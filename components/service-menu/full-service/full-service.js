import { storeConfig } from "../../../config/config.js";
import { BaseComponent } from "../../base/base-component.js";
import "../../../components/product-carousel/product-carousel.js";
import { createProductCard, menuText } from "../../../services/menu-localization-service.js";

class FullService extends BaseComponent {
  constructor() {
    super();
    this.products = [];
    this.handleTranslationsReady = this.handleTranslationsReady.bind(this);
  }

  async onConnected() {
    await this.loadTemplate(import.meta.url);
    await this.loadProducts();

    this.setupProductCarousel(this.products);

    this.renderFullMenu("all");
    document.addEventListener("translationsReady", this.handleTranslationsReady);
  }

  async loadProducts() {
    const res = await fetch(`${storeConfig.site.url}/data/products.json`);
    const data = await res.json();
    this.products = data.products || [];
  }

  renderFullMenu(filteredCategory) {
    const container = this.shadowRoot.querySelector("#full-menu-container");
    if (!container) return;

    container.innerHTML = "";

    const filtered =
      filteredCategory === "all"
        ? this.products
        : this.products.filter((p) => p.category === filteredCategory);

    const servicesOrder = ["starter", "main", "drink", "dessert"];
    const servicesMap = {
      starter: "menu.service.starter",
      drink: "menu.service.drink",
      main: "menu.service.main",
      dessert: "menu.service.dessert",
    };

    servicesOrder.forEach((service) => {
      const serviceProducts = filtered.filter((p) => p.service === service);
      if (!serviceProducts.length) return;

      const section = document.createElement("section");
      section.innerHTML = `<h2 class="section-title">${menuText(servicesMap[service])}</h2>`;

      serviceProducts.forEach((p) => {
        section.appendChild(createProductCard(p));
      });

      container.appendChild(section);
    });
  }

  handleTranslationsReady() {
    this.renderFullMenu("all");
    this.setupProductCarousel(this.products);
  }

  disconnectedCallback() {
    document.removeEventListener("translationsReady", this.handleTranslationsReady);
  }
}

customElements.define("full-service", FullService);
