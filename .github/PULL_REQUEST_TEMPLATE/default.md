---
name: General change
about: Default template for features, fixes, and refactors
---

# Summary

<!--
Add one or two bullet points. Describe what changed and why.
Mention related issues (e.g., `Fixes #123`) when applicable.
-->

- 

# Checklist

- [ ] Run `npm run test` (typecheck → lint → vitest → build) if the change
  affects logic or build output.
- [ ] Commits follow Conventional Commits (e.g., `feat:`, `fix:`) and do not mix
  unrelated changes.
- [ ] When adding new translation strings, every new key includes English (`en`)
  and Japanese (`ja`) values.
- [ ] Update and document configuration or environment files (`.env*`, etc.) when
  the change requires it.
- [ ] Add a screenshot or GIF for UI changes that are hard to describe in text
  (skip if not needed).
- [ ] No sensitive or secret information is in the commits.
