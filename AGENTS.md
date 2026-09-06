# AGENTS.md

Guidance for AI coding agents and future contributors working in this repository.

## What this project is

`digital-menu` is a fully responsive online restaurant menu. It is **vanilla HTML/CSS/JS** — no framework, no build step, no `package.json`. Every UI block is a **Web Component** (Custom Element + Shadow DOM) built on `BaseComponent` (`components/base/base-component.js`). Content is designed to come from a **Google Sheet** via a Google Apps Script Web App, but the live demo uses local mock data in `data/products.json`.

## Stack & structure

- Entry points: `index.html` → `main.js` (ES Modules).
- Components live in `components/<name>/` as `.js` + `.html` + `.css`.
- Services live in `services/` (`ProductService`, `navigation-service`, `feature-service`, `device-service`).
- Configuration is per environment under `config/` (`env.js` auto-detects local/dev/prod; `config.js` picks the file).
- Translations live in `assets/i18n/<lang>.json`; the language selector exposes `es`, `en`, `pt` (plus partial `fr`).

## Rules

1. **No build, no package manager.** Do not add npm dependencies or a build step. If a change seems to need one, stop and ask first.
2. **Serve over HTTP.** The app cannot open via `file://` (ES Modules + CORS). Test with `npx http-server . -p 8080` and open `http://127.0.0.1:8080/digital-menu`, or use the included `.vscode/launch.json`.
3. **Conventional Commits only.** No `Co-Authored-By` or any AI attribution trailers.
4. **Test what you change.** Run `node scripts/check-structure.mjs` before finishing; it validates imports, JSON schema, and component template files. Verify behavior in the browser on a local server for UI changes.
5. **Do not touch `data/products.json` without reason.** It is the demo mock data. Changing it affects the live demo preview. If you must edit it, keep the schema valid (all products need at least `name` and `service`).
6. **Do not document the Google Sheet as the live source.** The current deploy uses local mock data. Docs must describe the Sheet as the *designed* data source and the demo as using mock data (see README "How it works").
7. **Keep legacy code alone.** `js/app.js`, `services/ProductService.js`, `ProductImageService.js`, `HelperService.js`, and `products/` (perfumery/e-commerce) are leftovers from an earlier iteration. Do not integrate or "clean up" them without explicit instruction.
8. **Follow existing conventions.** Match the surrounding component structure, naming, and Shadow DOM patterns. Do not refactor unrelated code.

## Commands

```bash
# Validate repo structure (imports, JSON schema, component files)
node scripts/check-structure.mjs

# Run locally
npx http-server . -p 8080
```

## Committing

- Use Conventional Commits, e.g. `feat(category-slider): add search filter`, `fix(product-carousel): stop overflow`.
- Keep commits focused on one work unit; keep docs with the change they explain.
- Do not add AI attribution. Only commit when the user explicitly asks.
