# Human Proyect website

Landing page for Human Proyect, the content strategy brand of Yera. Built with Astro as a static site, with no client JavaScript, forms, cookies or third-party requests.

This first version has no payments. Offers appear as coming soon, and the main button leads to a conversation with Yera.

## Work on it

Requires Node 22.12 or newer and pnpm.

```shell
pnpm install
pnpm dev       # local site at http://localhost:4321
pnpm verify    # types, tests, build and content check
```

## Common changes

| To change | Edit |
| --- | --- |
| Where contact buttons lead | `contact.url` in `src/content/site.ts` |
| Texts of the home page | `src/content/home.ts` |
| Open an offer | `status` in `src/content/offers.ts` |
| Legal owner details | `src/content/legal.ts` |
| Custom domain | `site` in `astro.config.mjs` |

See [docs/architecture.md](docs/architecture.md) for the structure and how to add pages, payments or a CMS later.

## Before publishing

`pnpm build && pnpm check:publish` must pass. It fails while anything is marked as pending: preview mode, contact channel, biography, legal owner details or legal review. It always fails on forms, scripts, external resources, broken anchors, prices, large unverified figures and payment mentions. It also blocks the private term in the `CHECK_EXTRA_TERMS` environment variable, kept as a GitHub Actions secret so that it never appears in this public repository or its logs. Keep one term in that secret: GitHub masks the whole value, not its parts. The check only reads HTML pages, and it does not catch every way of writing a figure.

Passing it does not replace Yera's approval of copy, logo and photos.

## Do not commit

This repository will be public. Keep private material out of it: source PDFs, the manual, emails and the case study evidence.

## Font

Archivo, under the SIL Open Font License (`public/fonts/OFL.txt`).
