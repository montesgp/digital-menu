export class CategorySlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.pendingCategories = null;
  }

  async connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    const [html, css] = await Promise.all([
      fetch(
        import.meta.url.replace("category-slider.js", "category-slider.html")
      ).then((r) => r.text()),
      fetch(
        import.meta.url.replace("category-slider.js", "category-slider.css")
      ).then((r) => r.text()),
    ]);

    const style = document.createElement("style");
    style.textContent = css;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(wrapper);

    await this.loadTinySlider();

    // Si ya nos pasaron categorías antes de que cargue todo
    if (this.pendingCategories) {
      this.setCategories(this.pendingCategories);
    }
  }

  async loadTinySlider() {
    if (!window.tns) {
      await import(
        "https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.4/min/tiny-slider.js"
      );
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.4/tiny-slider.css";
    this.shadowRoot.appendChild(link);
  }

  setCategories(categories, activeCategory = this.activeCategory || "all") {
    const same = JSON.stringify(this.lastCategories) === JSON.stringify(categories);
    if (same && this.activeCategory === activeCategory) return;

    this.lastCategories = categories;
    this.activeCategory = activeCategory;

    const slider = this.shadowRoot.querySelector(".my-slider");
    if (!slider) {
      this.pendingCategories = categories;
      return;
    }

    // Eliminar cualquier instancia previa antes de modificar DOM
    if (slider.tnsInstance?.destroy) {
      slider.tnsInstance.destroy();
      slider.tnsInstance = null;
    }

    slider.innerHTML = ""; // Limpiar

    categories.forEach(({ value, label }, index) => {
      const item = document.createElement("div");
      item.className = "slide-item";
      item.dataset.category = value;
      item.textContent = label;
      if (value === activeCategory || (index === 0 && !categories.some((category) => category.value === activeCategory))) {
        item.classList.add("active");
      }
      slider.appendChild(item);
    });

    // ⏱ Esperar un microtask para que DOM esté actualizado antes de inicializar slider
    queueMicrotask(() => this.initSlider());
  }

  initSlider() {
    const container = this.shadowRoot.querySelector(".my-slider");
    if (!container || !window.tns) return;

    // Eliminar slider anterior si existe
    if (container.tnsInstance?.destroy) {
      container.tnsInstance.destroy();
      container.tnsInstance = null;
    }

    // Eliminar elementos Tiny Slider agregados antes (prevención extra)
    const oldNavs = this.shadowRoot.querySelectorAll('[class^="tns-"]');
    oldNavs.forEach((el) => el.remove());

    const sliderInstance = window.tns({
      container,
      items: 1,
      slideBy: "page",
      autoplay: false,
      nav: false,
      loop: false,
      gutter: 10,
      controls: false,
      responsive: {
        640: { items: 4 },
        900: { items: 5 },
        1200: { items: 6 },
      },
    });

    container.tnsInstance = sliderInstance;

    // Reasignar listeners
    const items = this.shadowRoot.querySelectorAll(".slide-item");
    items.forEach((item) => {
      item.addEventListener("click", () => {
        this.shadowRoot
          .querySelector(".slide-item.active")
          ?.classList.remove("active");
        item.classList.add("active");
        const category = item.dataset.category;
        this.activeCategory = category;
        this.dispatchEvent(
          new CustomEvent("categorySelected", {
            detail: { category },
            bubbles: true,
            composed: true,
          })
        );
      });
    });
  }
}

customElements.define("category-slider", CategorySlider);
