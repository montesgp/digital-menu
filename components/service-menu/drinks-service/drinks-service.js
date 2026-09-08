import { storeConfig } from "../../../config/config.js";
import { BaseComponent } from "../../base/base-component.js";
import "../../../components/category-slider/category-slider.js";
import "../../../components/product-carousel/product-carousel.js";
import { createProductCard, getLocalizedCategories, localizeProduct, menuText } from "../../../services/menu-localization-service.js";

class DrinksService extends BaseComponent {
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
        this.renderDrinks();
      });
    }

    this.setupProductCarousel(this.products);

    this.renderDrinks();
    document.addEventListener("translationsReady", this.handleTranslationsReady);
  }

  async loadProducts() {
    const res = await fetch(`${storeConfig.site.url}/data/products.json`);
    const data = await res.json();
    this.products = (data.products || []).filter((p) => p.service === "drink");
  }

  extractCategories() {
    return getLocalizedCategories(this.products);
  }

  renderDrinks() {
    const container = this.shadowRoot.querySelector("#drinks-container");
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

    // Agrupar por subcategoría (si existe)
    const groupedProducts = {};
    filtered.forEach((p) => {
      const subcat = localizeProduct(p).subcategory || menuText("menu.drinks.other");
      if (!groupedProducts[subcat]) {
        groupedProducts[subcat] = [];
      }
      groupedProducts[subcat].push(p);
    });

    const section = document.createElement("section");
    section.innerHTML = `<h2 class="section-title">${menuText("menu.service.drink")}</h2>`;

    Object.keys(groupedProducts).forEach((subcatName) => {
      const subcatProducts = groupedProducts[subcatName];

      if (Object.keys(groupedProducts).length > 1) {
        const subcatHeader = document.createElement("h3");
        subcatHeader.className = "subsection-title";
        subcatHeader.textContent = subcatName;
        section.appendChild(subcatHeader);
      }

      subcatProducts.forEach((p) => {
        section.appendChild(createProductCard(p, { showType: true }));
      });
    });

    container.appendChild(section);
  }

  handleTranslationsReady() {
    this.shadowRoot.querySelector("category-slider")?.setCategories(this.extractCategories(), this.selectedCategory);
    this.renderDrinks();
    this.setupProductCarousel(this.products);
  }

  disconnectedCallback() {
    document.removeEventListener("translationsReady", this.handleTranslationsReady);
  }
}

customElements.define("drinks-service", DrinksService);
