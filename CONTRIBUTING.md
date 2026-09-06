# Contributing to digital-menu

Thank you for wanting to contribute. This guide explains how we work: the branching model, how to open issues and pull requests, and the standards every contribution must meet.

## Getting started

1. Fork the repository and clone your fork.
2. Read [README.md](README.md) to understand the project, run it locally, and know the data model.
3. Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — all participation is governed by it.
4. Read [SECURITY.md](SECURITY.md) before reporting security issues.

## Development workflow

The repository follows a **Gitflow**-style model:

- Long-lived branches:
  - `dev` — integration / development, the **default branch**.
  - `main` — production.
- Feature/fix and other work branches point to `dev`.
- `dev` is promoted to `main` only after verification.

### Branching model

- Create branches from `dev`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) prefixes for branch names, matching the change type:

```
feat/  fix/  chore/  docs/  style/  refactor/
perf/  test/  build/  ci/  revert/
```

For example: `feat/add-category-filter`, `fix/carousel-overflow`, `docs/update-readme`.

### Branch protection

- `main` is **strictly protected**: no direct pushes (including by admins). Changes reach `main` only through pull requests that pass all checks, using linear history, and deleting the branch on merge.
- `dev` is **flexible**: the maintainer may push directly, but external contributors must open a pull request. Branch protection rules are configured by the repository owner in GitHub settings.

## Issues

- Search for an existing issue before opening a new one.
- Use the provided issue templates:
  - Bug report → title `fix: ...` — use when something is broken.
  - Feature request → title `feat: ...` — use when proposing new functionality.
- Follow the template fields (summary, reproduction steps, environment, expected/actual, evidence).

## Pull requests

Every change to `dev` (and every promotion to `main`) happens through a pull request.

### Requirements

- **Template:** fill in the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
- **Branch name:** must match the gitflow convention above (validated in CI).
- **Label:** exactly **one** `type:*` label on the PR (for example `type:fix`). Additional non-`type` labels are fine.
- **Linked issue (recommended, not required):** reference the issue you are addressing (for example `Closes #12`). Referencing is strongly encouraged but not a hard gate.
- **Conventional Commits:** use Conventional Commits for your commit messages. Do **not** add `Co-Authored-By` or any AI attribution trailers.
- **Scope:** keep PRs focused. Prefer smaller, reviewable changes over large mixed PRs.

### PR content

- **Summary:** what changes and why.
- **Changes:** a short table of file → change.
- **Test plan:** how you verified the change. Because this is a static site without a test runner, run it on a local HTTP server (see README "Quick start") and record what you checked.
- **Screenshots (for UI changes):** include before/after screenshots when the change affects rendering.

### Reviewer checklist (contributors should self-check)

- [ ] Branch name follows the gitflow convention.
- [ ] Exactly one `type:*` label is applied.
- [ ] Commits use Conventional Commits with no `Co-Authored-By`.
- [ ] Change is verified on a local server.
- [ ] UI changes include screenshots.
- [ ] Docs are updated if the change affects documented behavior.

## Review process

- The repository has a single maintainer: **Patricio Montes**.
- Reviews are asynchronous; please be patient. Feedback is aimed at improving the change, not blocking contribution.
- You may be asked to rebase or adjust before the PR is merged.

## Commit message examples

```
feat(category-slider): add search-as-you-type filter
fix(product-carousel): prevent overflow on narrow screens
docs(README): clarify Google Sheet connection steps
chore(deps): pin Tiny Slider CDN version
```

## Code style

- Match the conventions of the surrounding code (naming, component structure, Shadow DOM patterns).
- Do not add dependencies without discussing them first — this project intentionally has no build step and no package manager.
- Keep third-party use to CDN links already present (see README).

## Security

Do not report security vulnerabilities publicly in a normal issue. Follow the procedure in [SECURITY.md](SECURITY.md).
