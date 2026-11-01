// Fails when the site contains something that must not go public.
// Runs on the built site. Usage: node scripts/check.mjs --root dist [--preview]
// --preview tolerates pending items; hard rules still apply.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const preview = args.includes("--preview");
const rootFlag = args.indexOf("--root");
const root = rootFlag >= 0 ? args[rootFlag + 1] : ".";

// Content that needs approval before it can appear: figures, prices, payments.
const forbiddenText = [
  [/\bmillones\b/i, "an unverified figure (millones)"],
  [/\d(?:\s|&nbsp;)*(?:€|euros?\b|eur\b)|[€$](?:\s|&nbsp;)*\d/i, "a price"],
  [/\b(stripe|checkout)\b/i, "a payment mention (Stripe/checkout)"],
  [/lorem ipsum/i, "placeholder text"],
];

// Terms too sensitive to name in a public repository. Errors do not repeat them.
const extraTerms = (process.env.CHECK_EXTRA_TERMS ?? "")
  .split(",")
  .map((term) => term.trim().toLowerCase())
  .filter(Boolean);

const errors = [];
const pending = [];

const pages = readdirSync(root, { recursive: true })
  .map(String)
  .filter((name) => name.endsWith(".html"));
if (pages.length === 0) errors.push("no HTML pages found");

for (const page of pages) {
  const html = readFileSync(join(root, page), "utf8");
  const report = (message) => errors.push(`${page}: ${message}`);

  if (/<script\b/i.test(html)) report("forbidden <script>: the site uses no JS or trackers");
  if (/<form\b/i.test(html)) report("forbidden <form>: GitHub Pages cannot receive data");
  if (!/<html[^>]*\blang="es"/i.test(html)) report('missing <html lang="es">');

  const headings = html.match(/<h1\b/gi) ?? [];
  if (headings.length !== 1) report(`needs exactly one <h1>, found ${headings.length}`);

  for (const [pattern, label] of forbiddenText) {
    if (pattern.test(html)) report(`contains ${label}`);
  }

  const lowerHtml = html.toLowerCase();
  extraTerms.forEach((term, index) => {
    if (lowerHtml.includes(term)) report(`contains private term #${index + 1}`);
  });

  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt="/i.test(tag)) report(`image without alt: ${tag}`);
  }

  // Outbound <a> links are fine; anything the browser loads by itself is not.
  const loaded = [
    ...html.matchAll(/<(?:img|iframe|video|audio|source|embed)\b[^>]*\bsrc="([^"]+)"/gi),
    ...[...html.matchAll(/<link\b[^>]*\bhref="([^"]+)"[^>]*>/gi)].filter(
      ([tag]) => !/\brel="canonical"/i.test(tag),
    ),
  ];
  for (const [, url] of loaded) {
    if (/^(https?:)?\/\//i.test(url)) report(`loads an external resource: ${url}`);
  }

  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(target)) report(`broken anchor: #${target}`);
  }

  for (const [, item] of html.matchAll(/data-pending="([^"]+)"/g)) {
    pending.push(`${page}: ${item}`);
  }
  if (/<meta[^>]*name="robots"[^>]*noindex/i.test(html)) {
    pending.push(`${page}: noindex is still on`);
  }
}

if (pending.length > 0) {
  const lines = pending.map((item) => `  - ${item}`).join("\n");
  const message = `Pending before publishing:\n${lines}`;
  if (preview) console.log(message);
  else errors.push(message);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(preview ? "OK for a private preview" : "OK to publish");
