import { BaseComponent } from "../base/base-component.js";
import TranslationService from "../../assets/i18n/translationService.js";

class ProductCarousel extends BaseComponent {
  constructor() {
    super();
    this.products = [];
    this.titleKey = null;
    this.placeholderImage = new URL(
      "../../assets/products/placeholder.jpg",
      import.meta.url
    ).href;
  }

  async onConnected() {
    await this.loadTemplate(import.meta.url);
    this.updateTitle();
    this.renderCarousel();
  }

  setProducts(products) {
    this.products = Array.isArray(products) ? products : [];
    this.renderCarousel();
  }

  renderCarousel() {
    const container = this.shadowRoot.querySelector(".featured-grid");
    const wrapper = this.shadowRoot.querySelector(".carousel-container");
    if (!container || !wrapper) return;

    if (!this.products.length) {
      wrapper.hidden = true;
      return;
    }

    wrapper.hidden = false;
    container.replaceChildren();

    this.products.forEach((product) => {
      const card = document.createElement("article");
      card.className = "carousel-card";
      card.tabIndex = 0;
      card.setAttribute("role", "listitem");

      const image = document.createElement("img");
      image.className = "product-image";
      image.src = product.image || this.placeholderImage;
      image.alt = product.name || "Featured product";
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        if (image.src !== this.placeholderImage) {
          image.src = this.placeholderImage;
        }
      }, { once: true });

      const info = document.createElement("div");
      info.className = "product-info";

      const name = document.createElement("h3");
      name.className = "product-name";
      name.textContent = product.name || "Featured product";
      info.appendChild(name);

      if (product.description) {
        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;
        info.appendChild(description);
      }

      if (product.ingredients) {
        const ingredients = document.createElement("p");
        ingredients.className = "product-ingredients";
        ingredients.textContent = product.ingredients;
        info.appendChild(ingredients);
      }

      const price = document.createElement("p");
      price.className = "product-price-size";
      price.textContent = `${product.price || ""}${
        product.size ? ` - ${product.size}` : ""
      }`;
      info.appendChild(price);

      card.append(image, info);
      container.appendChild(card);
    });
  }

  setTitleKey(key) {
    this.titleKey = key;
    this.updateTitle();
  }

  updateTitle() {
    const carouselTitle = this.shadowRoot.querySelector(".carousel-title");
    if (!carouselTitle) return;

    const key = this.titleKey || "carousel.default.title";
    carouselTitle.setAttribute("data-i18n", key);

    try {
      carouselTitle.textContent = TranslationService.translate(key);
    } catch (e) {
      console.warn("Error translating carousel title:", e);
      carouselTitle.textContent = key;
    }
  }
}

customElements.define("product-carousel", ProductCarousel);
