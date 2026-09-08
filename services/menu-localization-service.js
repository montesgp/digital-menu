import TranslationService from "../assets/i18n/translationService.js";

/**
 * Resolves the display-only portion of a menu product. Product records stay
 * immutable so filters can keep using their canonical machine keys.
 */
export function localizeProduct(product, lang = TranslationService.getCurrentLang()) {
  const localized = product?.translations?.[lang] || {};
  return { ...product, ...localized };
}

export function menuText(key) {
  return TranslationService.translate(key);
}

export function getLocalizedCategories(products) {
  const categories = new Map();

  products.forEach((product) => {
    if (!product.category) return;
    const { categoryDescription } = localizeProduct(product);
    if (categoryDescription) categories.set(product.category, categoryDescription);
  });

  return [
    { value: "all", label: menuText("menu.category.all") },
    ...Array.from(categories, ([value, label]) => ({ value, label })),
  ];
}

export function createProductCard(product, { showType = false } = {}) {
  const display = localizeProduct(product);
  const card = document.createElement("div");
  card.className = "product-card";

  const append = (className, text) => {
    if (!text) return;
    const element = document.createElement("div");
    element.className = className;
    element.textContent = text;
    card.appendChild(element);
  };

  append("product-name", display.name);
  append("product-description", display.description);
  if (showType && display.type) {
    append("beverage-type", `${menuText("menu.type")}: ${display.type}`);
  }
  if (display.ingredients) {
    append(
      "product-ingredients",
      `${menuText("menu.ingredients")}: ${display.ingredients}`
    );
  }
  append(
    "product-price-size",
    `${display.price || ""}${display.size ? ` - ${display.size}` : ""}`
  );

  return card;
}
