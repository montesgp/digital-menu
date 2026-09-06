import { BaseComponent } from "../base/base-component.js";
import TranslationService from "../../assets/i18n/translationService.js";
import { storeConfig } from "../../config/config.js";

class ProductCarousel extends BaseComponent {
  constructor() {
    super();
    this.products = [];
    this.titleKey = null;
  }

  async onConnected() {
    await this.loadTemplate(import.meta.url);

    // Hide the container until there are products to show
    const wrapper = this.shadowRoot.querySelector(".carousel-container");
    if (wrapper) {
      wrapper.style.display = "none";
    }

    this.setupArrows();
    this.updateTitle();
  }

  setProducts(products) {
    this.products = products;
    this.renderCarousel();
  }

  setupArrows() {
    const inner = this.shadowRoot.querySelector(".carousel-inner");
    const prev = this.shadowRoot.querySelector(".carousel-prev");
    const next = this.shadowRoot.querySelector(".carousel-next");
    if (!inner || !prev || !next) return;

    const scrollByCard = (direction) => {
      const card = this.shadowRoot.querySelector(".carousel-card");
      const gap = parseFloat(getComputedStyle(inner).gap) || 0;
      const step = card ? card.offsetWidth + gap : inner.clientWidth;
      inner.scrollBy({ left: direction * step, behavior: "smooth" });
    };

    prev.addEventListener("click", () => scrollByCard(-1));
    next.addEventListener("click", () => scrollByCard(1));

    inner.addEventListener("scroll", () => this.updateArrowState(inner, prev, next));
    this.updateArrowState(inner, prev, next);
  }

  updateArrowState(inner, prev, next) {
    if (!inner || !prev || !next) return;
    const atStart = inner.scrollLeft <= 0;
    const atEnd = inner.scrollLeft + inner.clientWidth >= inner.scrollWidth - 1;
    prev.disabled = atStart;
    next.disabled = atEnd;

    const card = this.shadowRoot.querySelector(".carousel-card");
    const overflow = card ? inner.scrollWidth > inner.clientWidth + 1 : false;
    prev.style.visibility = overflow ? "visible" : "hidden";
    next.style.visibility = overflow ? "visible" : "hidden";
  }

  renderCarousel() {
    const container = this.shadowRoot.querySelector(".carousel-inner");
    const wrapper = this.shadowRoot.querySelector(".carousel-container");

    if (!container || !wrapper) return;

    if (!this.products || !this.products.length) {
      wrapper.style.display = "none"; // Hide completely when empty
      return;
    }

    wrapper.style.display = ""; // Show when there are products
    container.innerHTML = "";

    this.products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "carousel-card";
      card.innerHTML = `
      <img class="product-image" src="${
        product.image ||
        `${(storeConfig.site.url || "").replace(/\/$/, "")}/assets/products/placeholder.jpg`
      }" alt="${product.name}" />
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        ${
          product.description
            ? `<div class="product-description">${product.description}</div>`
            : ""
        }
        ${
          product.ingredients
            ? `<div class="product-ingredients">${product.ingredients}</div>`
            : ""
        }
        <div class="product-price-size">${product.price}${
        product.size ? " - " + product.size : ""
      }</div>
      </div>
    `;
      container.appendChild(card);
    });

    const inner = this.shadowRoot.querySelector(".carousel-inner");
    const prev = this.shadowRoot.querySelector(".carousel-prev");
    const next = this.shadowRoot.querySelector(".carousel-next");
    this.updateArrowState(inner, prev, next);
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