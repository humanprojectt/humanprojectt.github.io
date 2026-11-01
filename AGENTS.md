# Agent guide

Read [docs/architecture.md](docs/architecture.md) before changing the structure.

## Commands

- `pnpm verify`: types, tests, build and content check. Run it before reporting done.
- `pnpm build && pnpm check:publish`: must pass before any public launch.

## Rules

- Copy lives in `src/content/`. Never hardcode it in components.
- The repository will be public. Never commit source PDFs, the manual, emails, secrets or case study evidence.
- Do not publish client names, case studies, figures or prices without Yera's approval. Keep them out of code and docs too, because this repository is public.
- Do not invent metrics, testimonials, biography or photos. Styleboard images and numbers are illustrative.
- Do not redraw or replace the logo.
- No client JavaScript, forms, cookies, analytics or external requests without an explicit decision.
- Do not weaken `scripts/check.mjs` to make it pass. Fix the content instead.
- Publishing, pushing and enabling payments need explicit approval.
