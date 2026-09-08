import { storeConfig } from "../config/config.js";

export class FeatureService {
  static showProductCarouselFor(componentName) {
    const key = componentName.charAt(0).toLowerCase() + componentName.slice(1);
    const isVisible =
      storeConfig?.features?.productCarousel?.visibility?.[key] === true;

    if (!isVisible) {
      console.warn(`❌ Carrusel desactivado para: ${componentName}`);
    } else {
      console.log(`✅ Carrusel activado para: ${componentName}`);
    }

    return isVisible;
  }

  static setCarouselProducts(componentInstance, products = []) {
    const componentName = componentInstance.constructor.name;

    if (!this.showProductCarouselFor(componentName)) return;

    const carousel =
      componentInstance.shadowRoot.querySelector("product-carousel");

    if (carousel) {
      const featured = products
        .filter((product) => Number.isFinite(product.featuredRank))
        .sort((a, b) => a.featuredRank - b.featuredRank)
        .slice(0, 5);
      carousel.setProducts(featured);

      const titleKey = this.getCarouselTitleKey(componentName);
      if (titleKey && typeof carousel.setTitleKey === "function") {
        carousel.setTitleKey(titleKey);
      }
    }
  }

  static getCarouselTitleKey(componentName) {
    const key = componentName.charAt(0).toLowerCase() + componentName.slice(1);
    return storeConfig?.features?.productCarousel?.titles?.[key] || null;
  }
}
