import { BaseComponent } from "../base/base-component.js";
import TranslationService from "../../assets/i18n/translationService.js";
import { localizeProduct, menuText } from "../../services/menu-localization-service.js";

class ProductCarousel extends BaseComponent {
  constructor() {
    super();
    this.products = [];
    this.titleKey = null;
    this.placeholderImage = new URL(
      "../../assets/products/placeholder.jpg",
      import.meta.url
    ).href;
    this.handleScroll = this.updateControls.bind(this);
    this.handleControlClick = this.handleControlClick.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleTranslationsReady = this.handleTranslationsReady.bind(this);
  }

  async onConnected() {
    await this.loadTemplate(import.meta.url);
    this.setupControls();
    this.updateTitle();
    this.renderCarousel();
    this.handleTranslationsReady();
    document.addEventListener("translationsReady", this.handleTranslationsReady);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    document.removeEventListener("translationsReady", this.handleTranslationsReady);
  }

  setProducts(products) {
    this.products = Array.isArray(products) ? products : [];
    this.renderCarousel();
  }

  setupControls() {
    const viewport = this.shadowRoot.querySelector(".carousel-viewport");
    const controls = this.shadowRoot.querySelectorAll(".carousel-control");
    if (!viewport) return;

    viewport.addEventListener("scroll", this.handleScroll, { passive: true });
    controls.forEach((control) => {
      control.addEventListener("click", this.handleControlClick);
    });

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(viewport);
  }

  handleResize() {
    const viewport = this.shadowRoot.querySelector(".carousel-viewport");
    if (!viewport) return;

    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (viewport.scrollLeft > maxScroll) {
      viewport.scrollTo({ left: maxScroll, behavior: "auto" });
    }
    this.updateControls();
  }

  handleControlClick(event) {
    const viewport = this.shadowRoot.querySelector(".carousel-viewport");
    if (!viewport) return;

    const direction = event.currentTarget.dataset.direction === "previous" ? -1 : 1;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    viewport.scrollBy({
      left: direction * Math.max(viewport.clientWidth * 0.85, 1),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  updateControls() {
    const viewport = this.shadowRoot.querySelector(".carousel-viewport");
    const controls = this.shadowRoot.querySelector(".carousel-controls");
    const previous = this.shadowRoot.querySelector('[data-direction="previous"]');
    const next = this.shadowRoot.querySelector('[data-direction="next"]');
    if (!viewport || !controls || !previous || !next) return;

    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const hasOverflow = maxScroll > 1;
    controls.hidden = !hasOverflow;
    previous.disabled = !hasOverflow || viewport.scrollLeft <= 1;
    next.disabled = !hasOverflow || viewport.scrollLeft >= maxScroll - 1;
  }

  renderCarousel() {
    const container = this.shadowRoot.querySelector(".carousel-track");
    const wrapper = this.shadowRoot.querySelector(".carousel-container");
    if (!container || !wrapper) return;

    if (!this.products.length) {
      wrapper.hidden = true;
      this.updateControls();
      return;
    }

    wrapper.hidden = false;
    container.replaceChildren();

    this.products.forEach((product) => {
      const display = localizeProduct(product);
      const card = document.createElement("article");
      card.className = "carousel-card";
      card.tabIndex = 0;
      card.setAttribute("role", "listitem");

      const image = document.createElement("img");
      image.className = "product-image";
      image.src = product.image || this.placeholderImage;
      image.alt = display.name || menuText("carousel.image.alt_fallback");
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener(
        "error",
        () => {
          if (image.src !== this.placeholderImage) {
            image.src = this.placeholderImage;
          }
        },
        { once: true }
      );

      const info = document.createElement("div");
      info.className = "product-info";

      const name = document.createElement("h3");
      name.className = "product-name";
      name.textContent = display.name || menuText("carousel.image.alt_fallback");
      info.appendChild(name);

      if (display.description) {
        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = display.description;
        info.appendChild(description);
      }

      if (display.ingredients) {
        const ingredients = document.createElement("p");
        ingredients.className = "product-ingredients";
        ingredients.textContent = `${menuText("menu.ingredients")}: ${display.ingredients}`;
        info.appendChild(ingredients);
      }

      const price = document.createElement("p");
      price.className = "product-price-size";
      price.textContent = `${display.price || ""}${
        display.size ? ` - ${display.size}` : ""
      }`;
      info.appendChild(price);

      card.append(image, info);
      container.appendChild(card);
    });

    requestAnimationFrame(() => this.handleResize());
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

  handleTranslationsReady() {
    this.updateTitle();
    this.renderCarousel();
    const controls = this.shadowRoot.querySelector(".carousel-controls");
    const previous = this.shadowRoot.querySelector('[data-direction="previous"]');
    const next = this.shadowRoot.querySelector('[data-direction="next"]');
    if (controls) controls.setAttribute("aria-label", menuText("carousel.controls.label"));
    if (previous) previous.setAttribute("aria-label", menuText("carousel.controls.previous"));
    if (next) next.setAttribute("aria-label", menuText("carousel.controls.next"));
  }
}

customElements.define("product-carousel", ProductCarousel);
