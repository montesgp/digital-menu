import { BaseComponent } from "../base/base-component.js";
import TranslationService from "../../assets/i18n/translationService.js";

class ProductCarousel extends BaseComponent {
  constructor() {
    super();
    this.products = [];
    this.titleKey = null;
  }

  async onConnected() {
    await this.loadTemplate(import.meta.url);

    // Oculta el contenedor inicialmente hasta que tenga productos
    const wrapper = this.shadowRoot.querySelector(".carousel-container");
    if (wrapper) {
      wrapper.style.display = "none";
    }

    this.updateTitle();
  }

  setProducts(products) {
    this.products = products;
    this.renderCarousel();
  }

  renderCarousel() {
    const container = this.shadowRoot.querySelector(".carousel-inner");
    const wrapper = this.shadowRoot.querySelector(".carousel-container");

    if (!container || !wrapper) return;

    if (!this.products || !this.products.length) {
      wrapper.style.display = "none"; // Oculta completamente
      return;
    }

    wrapper.style.display = ""; // Muestra si hay productos
    container.innerHTML = "";

    this.products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "carousel-card";
      card.innerHTML = `
      <img class="product-image" src="${
        product.image || "/assets/img/placeholder-dessert.jpg"
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
            ? `<div class="product-ingredients">Ingredientes: ${product.ingredients}</div>`
            : ""
        }
        <div class="product-price-size">${product.price}${
        product.size ? " - " + product.size : ""
      }</div>
      </div>
    `;
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
      console.warn("Error traduciendo el título del carrusel:", e);
      carouselTitle.textContent = key;
    }
  }
}

customElements.define("product-carousel", ProductCarousel);
