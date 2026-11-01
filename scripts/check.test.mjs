import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const script = new URL("./check.mjs", import.meta.url).pathname;

const validPage = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>T</title>
<link rel="stylesheet" href="assets/styles.css"></head>
<body><h1 id="top">Hola</h1><a href="#top">Arriba</a>
<a href="https://example.com/contacto">Contacto</a></body></html>`;

function run(html, ...flags) {
  const root = mkdtempSync(join(tmpdir(), "hp-check-"));
  try {
    writeFileSync(join(root, "index.html"), html);
    return spawnSync(process.execPath, [script, "--root", root, ...flags], {
      encoding: "utf8",
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("a clean page passes", () => {
  const result = run(validPage);
  assert.equal(result.status, 0, result.stderr);
});

const violations = {
  "a form": ["<a href=\"#top\">Arriba</a>", "<form></form>", /<form>/],
  "a script": ["<a href=\"#top\">Arriba</a>", "<script></script>", /<script>/],
  "an unverified large figure": ["Hola", "Hola 7 millones", /millones/i],
  "a price": ["Hola", "Hola 12 €", /price/],
  "a price with the symbol first": ["Hola", "Hola €12", /price/],
  "a price in EUR": ["Hola", "Hola 12 EUR", /price/],
  "a price in dollars": ["Hola", "Hola $12", /price/],
  "a price with an HTML space": ["Hola", "Hola 12&nbsp;€", /price/],
  "a payment mention": ["Hola", "Hola Stripe", /stripe/i],
  "a broken anchor": ["href=\"#top\"", "href=\"#nope\"", /#nope/],
  "a second h1": ["</body>", "<h1>Otro</h1></body>", /exactly one <h1>/],
  "an image without alt": ["</body>", "<img src=\"a.png\"></body>", /without alt/],
  "a remote stylesheet": [
    "assets/styles.css",
    "https://fonts.googleapis.com/x.css",
    /external/i,
  ],
  "a remote image": [
    "</body>",
    "<img alt=\"x\" src=\"https://example.com/a.png\"></body>",
    /external/i,
  ],
};

for (const [name, [from, to, message]] of Object.entries(violations)) {
  test(`${name} fails, even in preview mode`, () => {
    const html = validPage.replace(from, to);
    assert.notEqual(html, validPage, "the fixture did not change");
    for (const flags of [[], ["--preview"]]) {
      const result = run(html, ...flags);
      assert.equal(result.status, 1, `passed with flags: ${flags}`);
      assert.match(result.stderr, message);
    }
  });
}

test("private terms come from the environment, so they stay out of this public repository", () => {
  const html = validPage.replace("Hola", "Hola Confidencial");
  const root = mkdtempSync(join(tmpdir(), "hp-check-"));
  try {
    writeFileSync(join(root, "index.html"), html);
    const check = (env) => spawnSync(process.execPath, [script, "--root", root], {
      encoding: "utf8",
      env: { ...process.env, CHECK_EXTRA_TERMS: env },
    });
    const blocked = check("otro, confidencial");
    assert.equal(blocked.status, 1);
    assert.match(blocked.stderr, /private term/);
    assert.doesNotMatch(blocked.stderr, /confidencial/i, "the error must not echo the term");
    assert.equal(check("").status, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("a canonical link is not an external resource", () => {
  const html = validPage.replace(
    "<title>",
    "<link rel=\"canonical\" href=\"https://example.com/\"><title>",
  );
  const result = run(html);
  assert.equal(result.status, 0, result.stderr);
});

test("pages in subfolders are checked too", () => {
  const root = mkdtempSync(join(tmpdir(), "hp-check-"));
  try {
    writeFileSync(join(root, "index.html"), validPage);
    mkdirSync(join(root, "servicios"));
    writeFileSync(join(root, "servicios", "index.html"), validPage.replace("Hola", "Hola Stripe"));
    const result = spawnSync(process.execPath, [script, "--root", root], { encoding: "utf8" });
    assert.equal(result.status, 1, "a nested page escaped the check");
    assert.match(result.stderr, /servicios.*stripe/is);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("a pending item blocks publishing but not the preview", () => {
  const html = validPage.replace(
    "Hola",
    "<span data-pending=\"canal de contacto\">Hola</span>",
  );
  const strict = run(html);
  assert.equal(strict.status, 1);
  assert.match(strict.stderr, /canal de contacto/);
  const preview = run(html, "--preview");
  assert.equal(preview.status, 0, preview.stderr);
  assert.match(preview.stdout, /canal de contacto/);
});

test("noindex blocks publishing but not the preview", () => {
  const html = validPage.replace(
    "<title>",
    "<meta name=\"robots\" content=\"noindex\"><title>",
  );
  const strict = run(html);
  assert.equal(strict.status, 1);
  assert.match(strict.stderr, /noindex/);
  assert.equal(run(html, "--preview").status, 0);
});
