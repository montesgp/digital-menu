import { storeConfig } from "../../config/config.js";
import { DeviceService } from "../../services/device-service.js";
import TranslationService from "../../assets/i18n/translationService.js";

class LanguageSelector extends HTMLElement {
  constructor() {
    super();

    this.languages = {
      en: "English",
      es: "Español",
      pt: "Português",
    };
    this.basePath = this._getBasePath();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
    this.handleTranslationsReady = this.handleTranslationsReady.bind(this);
  }

  connectedCallback() {
    this.currentLang = this._getPersistedLanguage();
    this._loadResources();
    document.addEventListener("translationsReady", this.handleTranslationsReady);
  }

  disconnectedCallback() {
    document.removeEventListener("translationsReady", this.handleTranslationsReady);
  }

  _getBasePath() {
    return `${storeConfig.site.url}/components/language-selector/`;
  }

  _getPersistedLanguage() {
    const lang = localStorage.getItem("selectedLanguage") ||
      TranslationService.getCurrentLang() ||
      storeConfig.default.language;
    return this.languages[lang] ? lang : storeConfig.default.language;
  }

  _loadResources() {
    const cssURL = `${this.basePath}language-selector.css`;
    const htmlURL = `${this.basePath}language-selector.html`;

    Promise.all([
      fetch(cssURL).then((res) => {
        if (!res.ok) throw new Error(`Error cargando CSS: ${res.status}`);
        return res.text();
      }),
      fetch(htmlURL).then((res) => {
        if (!res.ok) throw new Error(`Error cargando HTML: ${res.status}`);
        return res.text();
      }),
    ])
      .then(([cssText, html]) => {
        this.shadowRoot.innerHTML = `<style>${cssText}</style>${html}`;
        this._updateFlagPaths();
        this._setCurrentLanguage(this._getPersistedLanguage());
        this._setupEventListeners();
      })
      .catch((error) => {
        console.error("Error cargando recursos:", error);
        this._createBasicStructure();
      });
  }

  _createBasicStructure() {
    this.shadowRoot.innerHTML = "";

    const container = document.createElement("div");
    container.className = "language-selector";

    const selectedLang = document.createElement("button");
    selectedLang.className = "selected-language";
    selectedLang.type = "button";
    selectedLang.setAttribute("aria-haspopup", "listbox");
    selectedLang.setAttribute("aria-expanded", "false");

    const selectedImg = document.createElement("img");
    selectedImg.id = "selected-lang-flag";
    const selectedText = document.createElement("span");
    selectedText.id = "selected-lang-text";
    selectedLang.append(selectedImg, selectedText);

    const dropdown = document.createElement("div");
    dropdown.className = "language-dropdown";
    const langList = document.createElement("ul");
    langList.setAttribute("role", "listbox");
    dropdown.appendChild(langList);

    container.append(selectedLang, dropdown);
    this.shadowRoot.appendChild(container);
    this._setCurrentLanguage(this._getPersistedLanguage());
    this._setupEventListeners();
  }

  _updateFlagPaths() {
    const flagImages = this.shadowRoot.querySelectorAll(
      ".language-dropdown li[data-lang] img"
    );
    flagImages.forEach((img) => {
      const lang = img.parentElement.getAttribute("data-lang");
      img.src = `${this.basePath}flags/${lang}.svg`;
    });
  }

  _setupEventListeners() {
    const selectedLang = this.shadowRoot.querySelector(".selected-language");
    if (selectedLang) {
      selectedLang.addEventListener("click", () => this._toggleDropdown());
    }

  }

  handleTranslationsReady(event) {
    const lang = event.detail?.lang || this._getPersistedLanguage();
    this._setCurrentLanguage(lang);
  }

  _toggleDropdown() {
    const dropdown = this.shadowRoot.querySelector(".language-dropdown");
    const container = this.shadowRoot.querySelector(".language-selector");
    const selected = this.shadowRoot.querySelector(".selected-language");
    if (!dropdown || !container) return;

    this.isOpen = !this.isOpen;
    dropdown.classList.toggle("open", this.isOpen);
    selected?.setAttribute("aria-expanded", String(this.isOpen));

    if (this.isOpen && DeviceService.isMobile()) {
      container.classList.add("mobile-expanded");
    } else {
      container.classList.remove("mobile-expanded");
    }
  }

  _closeDropdown() {
    const dropdown = this.shadowRoot.querySelector(".language-dropdown");
    const container = this.shadowRoot.querySelector(".language-selector");
    const selected = this.shadowRoot.querySelector(".selected-language");
    if (!dropdown || !container) return;

    dropdown.classList.remove("open");
    container.classList.remove("mobile-expanded");
    selected?.setAttribute("aria-expanded", "false");
    this.isOpen = false;
  }

  async _selectLanguage(lang) {
    if (!this.languages[lang] || this.currentLang === lang) {
      this._closeDropdown();
      return;
    }

    this._setCurrentLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);
    this._closeDropdown();

    const applied = await TranslationService.loadTranslations(lang);
    const persistedLanguage = this._getPersistedLanguage();

    // A failed latest request restores the previously applied language. A stale
    // request leaves the later user choice visible until it finishes loading.
    if (!applied && persistedLanguage !== lang) {
      this._setCurrentLanguage(persistedLanguage);
    }
  }

  _setCurrentLanguage(lang) {
    this.currentLang = this.languages[lang] ? lang : storeConfig.default.language;
    this._updateSelectedLanguage(this.currentLang);
    this._renderLanguageOptions();
  }

  _updateSelectedLanguage(lang) {
    const selectedImg = this.shadowRoot.querySelector("#selected-lang-flag");
    const selectedText = this.shadowRoot.querySelector("#selected-lang-text");
    if (!selectedImg || !selectedText) return;

    const langName = this.languages[lang] || lang;
    selectedImg.src = `${this.basePath}flags/${lang}.svg`;
    selectedImg.alt = langName;
    selectedText.textContent = langName;
  }

  _renderLanguageOptions() {
    const langList = this.shadowRoot.querySelector(".language-dropdown ul");
    if (!langList) return;

    langList.innerHTML = "";
    Object.entries(this.languages).forEach(([lang, name]) => {
      if (lang === this.currentLang) return;

      const li = document.createElement("li");
      li.dataset.lang = lang;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");

      const img = document.createElement("img");
      img.src = `${this.basePath}flags/${lang}.svg`;
      img.alt = "";

      const span = document.createElement("span");
      span.textContent = name;
      li.append(img, span);
      li.addEventListener("click", () => this._selectLanguage(lang));
      langList.appendChild(li);
    });
  }
}

customElements.define("language-selector", LanguageSelector);
