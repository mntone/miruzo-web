[&lsaquo; Back to README](./README.md)

# Contributing to miruzo-web

## 🧭 Overview

miruzo-web is the Solid.js frontend for browsing the miruzo photo archive that
miruzo-core exposes over a REST API. This document explains how to set up a
local environment, which conventions to follow, and how to propose changes. For
day-to-day commands (install, dev server, tests) refer to [`README.md`](./README.md), and for
coding standards see [`AGENTS.md`](./AGENTS.md).

## 🛠️ Prerequisites

- Install dependencies exactly as described in [`README.md`](./README.md). We track the latest
  stable Node.js release (see `.nvmrc`) rather than LTS.
- Clone the repo and run `nvm use`/`npm install` before hacking. Git is the only
  other required tool.
- Work on macOS, Linux, or Windows (WSL works fine). Always test UI behavior in
  a Chromium-based browser and Firefox, because we support the latest and
  previous stable versions of these browsers plus Safari.
- Ensure you have access to a running miruzo-core backend (local or remote) so
  API flows can be validated end-to-end.

## 🔁 Workflow

- Follow Conventional Commits (English prefixes such as `feat:`, `fix:`, etc.)
  and keep each commit focused on a single logical change.
- Large or potentially breaking work should start as a GitHub issue or
  discussion so scope can be agreed upon.
- Use the provided GitHub issue/PR templates; fill out the checklists so
  reviewers know what was verified.
- Before requesting review run `npm run test` (which covers typecheck, lint,
  vitest, and build). For UI-only tweaks at least run `npm run lint` +
  `npm run vitest`.

## 🎨 Code style

- `AGENTS.md` is the canonical source of formatting and architectural rules.
  Highlights: tabs for indentation, single quotes, camelCase CSS module tokens,
  Solid signals named `get*/set*` (or `fetch*`/`update*`), and type-only imports
  where possible.
- Do not ignore lint errors—fix them or adjust ESLint config via PR if a rule is
  truly incompatible.
- For shared utilities (navigation helpers, layout metrics, etc.), extend the
  existing modules in `src/**/shared` (for example,
  [`src/components/ImageLayout/shared/layoutMetrics.ts`](./src/components/ImageLayout/shared/layoutMetrics.ts))
  instead of introducing ad-hoc versions.

## 🧪 Testing

- We use Vitest with `vitest/globals`. Run `npm run vitest` for a full pass or
  `npm run vitest:watch` while iterating.
- Pure functions must have unit tests unless doing so would add unreasonable
  complexity. When touching UI logic, add or update tests that cover the new
  behavior.
- Reuse helpers under `test-utils/` before writing local ad-hoc mocks.
- Benchmarks (`npm run vitest:bench`) are optional and intended for performance
  investigations; run them only when profiling layout/metrics changes.

## 🌐 Translations

- English (`en`) and Japanese (`ja`) strings must be kept in sync for any new
  translation key. Other locales are optional but welcome if a reviewer can
  validate them.
- Use the dedicated translation PR template when making locale changes. Keep the
  namespace/key structure consistent across files.
- If you add a brand-new locale file, ensure the i18n loader recognizes it (see
  [`src/i18n/loader.ts`](./src/i18n/loader.ts)).

## 🐛 Reporting issues

- File bug reports and feature requests through GitHub Issues using the provided
  templates. Include reproduction steps, expected vs. actual behavior, browser
  and OS versions, and screenshots if the problem is visual.
- Sensitive bugs can be disclosed privately to *mntone* via the contact links in
  [`README.md`](./README.md).

## 📜 License notice

By contributing to miruzo-web you agree to license your work under GPLv3 (same
as the project). Submit only code, translations, and assets that you are allowed
to relicense under GPLv3. Verify the compatibility of any third-party
dependency before introducing it.
