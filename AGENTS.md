# AGENTS.md

This document captures the non-negotiable guidelines for anyone—human or
automation agents—working on miruzo. Follow these instructions when
setting up the environment, writing code, testing, and preparing
commits so that tasks stay consistent regardless of who is executing
them.

## Setup Command

- Install dependencies: `npm install`
- Respect `.nvmrc`: run `nvm use`; if the version is missing, install it via
  `nvm install`. We target the latest stable Node version tracked in
  `.nvmrc`.
- Start dev server: `npm run dev` (or `npm run dev:host` for LAN
  testing)
- Typecheck and lint: `npm run typecheck`, `npm run lint`
- Run tests: `npm run vitest` (use `npm run vitest:watch` for TDD or
  `npm run vitest:bench` for benches)
- Build and preview production bundle: `npm run build`, `npm run preview`


## General Code Style

- TypeScript strict mode; prefer explicit types for exported
  functions/components
- Single quotes, no semicolons; indentation with tabs; keep trailing
  commas where ESLint expects them
- Follow the JSON formatting rules (tabs, multi-line objects for 2+ keys)
- Comments must be written in English and limited to intent/behavior,
  not obvious statements
- Markdown files must be wrapped at 80 characters
- Test utility code must be placed under `test-utils` at the project root
- Prefer `type` imports/exports (`import type { Foo }`) and keep runtime
  imports sorted to satisfy `import-x/order`


## Solid & UI Conventions

- Use `ParentProps`, `Accessor`, etc. to avoid `any`
- Name `createSignal` getters with a `get` (or `fetch`) prefix and setters
  with `set` (or `update`) when the semantics demand it (e.g.
  `const [fetchFoo, updateFoo] = createSignal()`); always call getters as
  functions (`getFoo()`).
- Do not destructure signals/resources; call the getter (`const value =
  signal()`) inside JSX
- Keep event handlers as arrow functions or annotate `this: void` to
  satisfy `@typescript-eslint/unbound-method`
- CSS modules/vanilla-extract files must export camelCase class names;
  reference them via the imported namespace (no string literals)
- Shared utilities (e.g., navigation helpers, layout metrics) live under
  `src/**/shared`; prefer extending these before adding ad-hoc logic
- miruzo-web does not use SSR. Assume browser-only execution when writing code
  (access to `window`, `document`, etc. is always available).
- Prefer string concatenation (`a + b`) for simple cases; reserve template
  literals for when two or more variables are interpolated.
- TSX component files and their paired vanilla-extract styles should start with
  the component name in PascalCase (e.g., `Controller.tsx`,
  `Controller.css.ts`). When the directory hierarchy already conveys the
  component name, shortened filenames are acceptable but must remain
  PascalCase.

## Commits

- Follow Conventional Commits; keep the subject within 55 characters.
- Group related changes (code + schema + docs) into a single commit.
- Avoid mixing unrelated changes; split into separate commits when needed.
- Use the GitHub issue and PR templates provided in `.github/` when filing or
  submitting changes.

## Testing

- Use `npm run vitest` for the default run, `npm run vitest:watch`
  during local iterations, and `npm run vitest:bench` for benchmarks.
  `npm run test` executes typecheck → lint → vitest → build; expect
  longer durations.
- Rely on `vitest/globals`; never import `vitest` directly in standard test
  files. (Benchmarks may import from `vitest` only when the API requires it.)
- Before adding new helper logic, check utilities under `/test-utils/*`
  - If a new test can be expressed by extending existing utilities,
    extend the shared utilities.
  - If extending shared utilities is not suitable, adding local helper
    functions inside each test file is allowed.
- Reuse existing mock/stub utilities from `/test-utils` before creating
  new ad-hoc mocks.
- Pure functions (no side effects or IO) must be covered by unit tests,
  unless doing so would introduce unreasonable complexity. When impure
  logic can be factored into pure helpers, test those helpers instead of
  the outer effectful wrapper.
- Benchmarks (`npm run vitest:bench`) are for internal performance
  investigations; general contributors do not need to run them unless
  a maintainer requests it.
- Do not pull in JSDOM or other browser simulators—tests should stub the small
  DOM APIs they need using `vi.stubGlobal` or light-weight helpers.
