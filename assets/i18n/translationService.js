import { storeConfig } from "../../config/config.js";

const TranslationService = (() => {
  let currentLang = localStorage.getItem("selectedLanguage") || "en";
  let translations = {};
  let latestRequest = 0;

  const loadTranslations = async (lang = currentLang) => {
    const requestId = ++latestRequest;
    const previousLang = currentLang;
    localStorage.setItem("selectedLanguage", lang);

    try {
      const res = await fetch(
        `${storeConfig.site.url}/assets/i18n/${lang}.json`
      );
      if (!res.ok) {
        throw new Error(`Unable to load translations: ${res.status}`);
      }

      const nextTranslations = await res.json();

      // A later choice wins, even if an earlier request finishes last.
      if (requestId !== latestRequest) {
        return false;
      }

      translations = nextTranslations;
      currentLang = lang;
      document.dispatchEvent(
        new CustomEvent("translationsReady", {
          detail: { lang, translations },
        })
      );
      return true;
    } catch (err) {
      if (requestId === latestRequest) {
        localStorage.setItem("selectedLanguage", previousLang);
      }
      console.error("Error cargando traducciones:", err);
      return false;
    }
  };

  const translate = (key) => translations[key] || key;

  const translatePage = (root = document) => {
    translateElementTree(root);
  };

  const translateElementTree = (root) => {
    if (!root) return;
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Repetir para los shadow roots de los custom elements
    root.querySelectorAll("*").forEach((el) => {
      if (el.shadowRoot) {
        translateElementTree(el.shadowRoot);
      }
    });
  };

  const changeLanguage = async (lang) => {
    if (lang === currentLang && Object.keys(translations).length) {
      return true;
    }

    const applied = await loadTranslations(lang);
    if (applied) {
      translatePage();
    }
    return applied;
  };

  return {
    loadTranslations,
    translatePage,
    translate,
    changeLanguage,
    getCurrentLang: () => currentLang,
  };
})();

export default TranslationService;
