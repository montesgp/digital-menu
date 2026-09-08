import { storeConfig } from "../../../config/config.js";
import { BaseComponent } from "../../base/base-component.js";
import "../../../components/category-slider/category-slider.js";
import "../../../components/product-carousel/product-carousel.js";

class DrinksService extends BaseComponent {
  constructor() {
    super();
    this.products = [];
  }

  async onConnected() {
    await this.loadTemplate(import.meta.url);
    await this.loadProducts();

    const slider = this.shadowRoot.querySelector("category-slider");
    const categories = this.extractCategories();
    if (slider) {
      slider.setCategories(categories);
      slider.addEventListener("categorySelected", (e) => {
        this.renderDrinks(e.detail.category);
      });
    }

    this.setupProductCarousel(this.products);

    this.renderDrinks();
  }

  async loadProducts() {
    const res = await fetch(`${storeConfig.site.url}/data/products.json`);
    const data = await res.json();
    this.products = (data.products || []).filter((p) => p.service === "drink");
  }

  extractCategories() {
    const categoryMap = new Map();

    this.products.forEach((p) => {
      if (p.category && p.categoryDescription) {
        categoryMap.set(p.category, p.categoryDescription);
      }
    });

    // Convertimos a array incluyendo "all"
    return [
      { value: "all", label: "Todas" }, // O puedes poner "All", "Tous", etc. más tarde traducible
      ...Array.from(categoryMap.entries()).map(([value, label]) => ({
        value,
        label,
      })),
    ];
  }

  renderDrinks(filteredCategory = "all") {
    const container = this.shadowRoot.querySelector("#drinks-container");
    if (!container) return;

    container.innerHTML = "";

    let filtered = this.products;

    if (filteredCategory !== "all") {
      filtered = filtered.filter((p) => p.category === filteredCategory);
    }

    if (!filtered.length) {
      const message = document.createElement("p");
      message.className = "no-products-message";
      message.textContent = "No hay productos disponibles en esta categoría.";
      container.appendChild(message);
      return;
    }

    // Agrupar por subcategoría (si existe)
    const groupedProducts = {};
    filtered.forEach((p) => {
      const subcat = p.subcategory || "Otras Bebidas";
      if (!groupedProducts[subcat]) {
        groupedProducts[subcat] = [];
      }
      groupedProducts[subcat].push(p);
    });

    const section = document.createElement("section");
    section.innerHTML = `<h2 class="section-title">Bebidas</h2>`;

    Object.keys(groupedProducts).forEach((subcatName) => {
      const subcatProducts = groupedProducts[subcatName];

      if (Object.keys(groupedProducts).length > 1) {
        const subcatHeader = document.createElement("h3");
        subcatHeader.className = "subsection-title";
        subcatHeader.textContent = subcatName;
        section.appendChild(subcatHeader);
      }

      subcatProducts.forEach((p) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <div class="product-name">${p.name}</div>
          ${
            p.description
              ? `<div class="product-description">${p.description}</div>`
              : ""
          }
          ${p.type ? `<div class="beverage-type">Tipo: ${p.type}</div>` : ""}
          ${
            p.ingredients
              ? `<div class="product-ingredients">Ingredientes: ${p.ingredients}</div>`
              : ""
          }
          <div class="product-price-size">${p.price}${
          p.size ? " - " + p.size : ""
        }</div>
        `;
        section.appendChild(card);
      });
    });

    container.appendChild(section);
  }
}

customElements.define("drinks-service", DrinksService);
