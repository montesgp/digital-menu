#!/usr/bin/env node
// check-structure.mjs
// Validates the static-site structure of digital-menu without any dependencies.
//
//   node scripts/check-structure.mjs
//
// Checks:
//   1. Every relative import in main.js resolves to an existing file.
//   2. data/products.json is valid JSON with a "products" array whose items
//      have stable IDs and complete selectable-language display translations.
//   3. Every component .js that loads its own template (contains "loadTemplate")
//      has a sibling .html (and .css where the loader expects it).
//
// Exits 0 on success, 1 on any failure.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let errors = [];
let warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

// --- 1. Validate main.js imports -------------------------------------------

const mainJs = join(ROOT, "main.js");
if (!existsSync(mainJs)) {
  fail("main.js not found at repository root.");
} else {
  const source = readFileSync(mainJs, "utf8");
  const importRe = /^\s*import\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/gm;
  let match;
  const seen = new Set();

  while ((match = importRe.exec(source)) !== null) {
    const spec = match[1];
    if (!spec.startsWith(".")) continue; // only bare/relative resolvable here
    if (seen.has(spec)) continue;
    seen.add(spec);

    const target = resolve(dirname(mainJs), spec);
    if (!existsSync(target)) {
      fail(`main.js imports "${spec}" but ${relative(ROOT, target)} does not exist.`);
    }
  }
}

// --- 2. Validate data/products.json ----------------------------------------

const productsPath = join(ROOT, "data", "products.json");
if (!existsSync(productsPath)) {
  fail("data/products.json not found.");
} else {
  let data;
  try {
    data = JSON.parse(readFileSync(productsPath, "utf8"));
  } catch (e) {
    fail(`data/products.json is not valid JSON: ${e.message}`);
    data = null;
  }

  if (data !== null) {
    if (!Array.isArray(data.products)) {
      fail('data/products.json must contain a "products" array.');
    } else {
      const productIds = new Set();
      const localizedDisplayFields = [
        "name",
        "description",
        "ingredients",
        "categoryDescription",
        "subcategory",
        "section",
        "subSectionOne",
        "subSectionTwo",
        "sectionObservations",
        "size",
      ];

      data.products.forEach((product, index) => {
        const id = `products[${index}]`;
        if (product === null || typeof product !== "object") {
          fail(`${id} is not an object.`);
          return;
        }
        if (!product.name || typeof product.name !== "string") {
          fail(`${id} is missing a string "name" field.`);
        }
        if (!product.service || typeof product.service !== "string") {
          fail(`${id} is missing a string "service" field.`);
        }
        if (!product.id || typeof product.id !== "string" || !product.id.trim()) {
          fail(`${id} is missing a nonempty immutable string "id" field.`);
        } else if (productIds.has(product.id)) {
          fail(`${id} duplicates product id "${product.id}".`);
        } else {
          productIds.add(product.id);
        }

        for (const lang of ["en", "pt"]) {
          const localized = product.translations?.[lang];
          if (!localized || typeof localized !== "object") {
            fail(`${id} is missing its ${lang} display translation.`);
            continue;
          }
          localizedDisplayFields.forEach((field) => {
            if (
              typeof product[field] === "string" &&
              product[field].trim() &&
              (!localized[field] || typeof localized[field] !== "string" || !localized[field].trim())
            ) {
              fail(`${id} is missing nonempty ${lang} translation for "${field}".`);
            }
          });
        }
      });
    }
  }
}

// --- 3. Validate selectable-locale dynamic menu strings -------------------

const requiredMenuKeys = [
  "service-menu.starters",
  "service-menu.main_courses",
  "service-menu.drinks",
  "service-menu.desserts",
  "service-menu.full_service",
  "service-menu.full-service.title",
  "menu.service.starter",
  "menu.service.main",
  "menu.service.drink",
  "menu.service.dessert",
  "menu.category.all",
  "menu.empty",
  "menu.ingredients",
  "menu.type",
  "menu.drinks.other",
  "carousel.controls.label",
  "carousel.controls.previous",
  "carousel.controls.next",
  "carousel.image.alt_fallback",
  "carousel.default.title",
  "carousel.desserts.title",
  "carousel.full_service.title",
  "carousel.starters.title",
  "carousel.main_courses.title",
  "carousel.drinks.title",
];

for (const lang of ["es", "en", "pt"]) {
  const dictionaryPath = join(ROOT, "assets", "i18n", `${lang}.json`);
  if (!existsSync(dictionaryPath)) {
    fail(`assets/i18n/${lang}.json not found.`);
    continue;
  }
  try {
    const dictionary = JSON.parse(readFileSync(dictionaryPath, "utf8"));
    requiredMenuKeys.forEach((key) => {
      if (!dictionary[key] || typeof dictionary[key] !== "string") {
        fail(`assets/i18n/${lang}.json is missing dynamic menu key "${key}".`);
      }
    });
  } catch (e) {
    fail(`assets/i18n/${lang}.json is not valid JSON: ${e.message}`);
  }
}

// --- 4. Validate component template files ----------------------------------

function walk(dir, out = []) {
  for (const entry of readdirSafe(dir)) {
    const p = join(dir, entry);
    if (statIsDir(p)) {
      walk(p, out);
    } else if (extname(p) === ".js") {
      out.push(p);
    }
  }
  return out;
}

function readdirSafe(dir) {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}

function statIsDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

const componentJs = walk(join(ROOT, "components"));
const loadTemplateJs = componentJs.filter((p) =>
  /\.loadTemplate\s*\(/.test(readFileSync(p, "utf8"))
);

for (const jsPath of loadTemplateJs) {
  const base = jsPath.replace(/\.js$/, "");
  const htmlPath = `${base}.html`;
  const cssPath = `${base}.css`;
  const rel = relative(ROOT, jsPath);

  if (!existsSync(htmlPath)) {
    fail(`${rel} uses loadTemplate but has no sibling .html file.`);
  }
  if (!existsSync(cssPath)) {
    fail(`${rel} uses loadTemplate but has no sibling .css file.`);
  }
}

// --- Report ----------------------------------------------------------------

if (warnings.length) {
  console.log("\nWarnings:");
  warnings.forEach((w) => console.log(`  - ${w}`));
}

if (errors.length) {
  console.error("\nStructure check failed:");
  errors.forEach((e) => console.error(`  ✗ ${e}`));
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}

console.log("Structure check passed.");
console.log(`  - main.js imports: OK`);
console.log(`  - data/products.json schema: OK`);
console.log(`  - component templates (${loadTemplateJs.length} using loadTemplate): OK`);
process.exit(0);
