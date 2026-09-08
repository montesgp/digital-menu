import { storeConfig } from "../../../config/config.js";
import { BaseComponent } from "../../base/base-component.js";
import "../../../components/category-slider/category-slider.js";
import "../../../components/product-carousel/product-carousel.js";
import {
  createProductCard,
  getLocalizedCategories,
  menuText,
} from "../../../services/menu-localization-service.js";

class StartersService extends BaseComponent {
  constructor() {
    super();
    this.products = [];
    this.selectedCategory = "all";
    this.handleTranslationsReady = this.handleTranslationsReady.bind(this);
  }

  async onConnected() {
    await this.loadTemplate(import.meta.url);
    await this.loadProducts();

    const slider = this.shadowRoot.querySelector("category-slider");
    if (slider) {
      slider.setCategories(this.extractCategories(), this.selectedCategory);
      slider.addEventListener("categorySelected", (e) => {
        this.selectedCategory = e.detail.category;
        this.renderStarters();
      });
    }

    this.setupProductCarousel(this.products);

    this.renderStarters();
    document.addEventListener("translationsReady", this.handleTranslationsReady);
  }

  async loadProducts() {
    const res = await fetch(`${storeConfig.site.url}/data/products.json`);
    const data = await res.json();
    this.products = (data.products || []).filter(
      (p) => p.service === "starter"
    );
  }

  extractCategories() {
    return getLocalizedCategories(this.products);
  }

  renderStarters() {
    const container = this.shadowRoot.querySelector("#starters-container");
    if (!container) return;

    container.innerHTML = "";

    let filtered = this.products;

    if (this.selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }

    if (!filtered.length) {
      const message = document.createElement("p");
      message.className = "no-products-message";
      message.textContent = menuText("menu.empty");
      container.appendChild(message);
      return;
    }

    const section = document.createElement("section");
    section.innerHTML = `<h2 class="section-title">${menuText("menu.service.starter")}</h2>`;

    filtered.forEach((p) => {
      section.appendChild(createProductCard(p));
    });

    container.appendChild(section);
  }

  handleTranslationsReady() {
    this.shadowRoot.querySelector("category-slider")?.setCategories(this.extractCategories(), this.selectedCategory);
    this.renderStarters();
    this.setupProductCarousel(this.products);
  }

  disconnectedCallback() {
    document.removeEventListener("translationsReady", this.handleTranslationsReady);
  }
}

customElements.define("starters-service", StartersService);
