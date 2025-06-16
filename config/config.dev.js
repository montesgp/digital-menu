export const storeConfig = {
  // General site configuration
  site: {
    name: "#TabName",
    description: "#TabDescription",
    shortName: "#ShortName",
    subtitle: "#SloganOrSubtitle",
    title: "#MenuTitle",
    url: "http://127.0.0.1:8080",
    previewImage: "imgs/bergbach-fragrance-preliminar.jpg",
    loader: {
      general: {
        animationUrl: "./assets/animations/general_loader_animation.json",
        loadingText: "",
      },
      drinks: {
        animationUrl: "./assets/animations/general_loader_animation.json",
        loadingText: "Explorando Bebidas...",
      },
      desserts: {
        animationUrl: "./assets/animations/general_loader_animation.json",
        loadingText: "Explorando Postres...",
      },
    },
    header: {
      appearance: "navbar",
    },
  },

  // Features
  features: {
    productCarousel: {
      titles: {
        dessertsService: "carousel.desserts.title",
        fullService: "carousel.full_service.title",
      },
      visibility: {
        dessertsService: true,
        fullService: true,
        drinksService: false,
        startersService: false,
        mainService: false,
      },
    },
  },
  
  // Defaults
  default: {
    language: "es",
  },

  // Search and filter configuration
  search: {
    placeholder: "Buscar platos...",
  },

  // Footer configuration
  footer: {
    title: {
      es: "NombreCorto - Eslogan",
      en: "ShortName - Slogan",
      fr: "NomCourt - Slogan",
      pt: "NomeCurto - Slogan",
    },
    description: {
      es: "Subtítulo o descripción del pie de página",
      en: "Footer subtitle or description",
      fr: "Sous-titre ou description du pied de page",
      pt: "Legenda ou descrição do rodapé",
    },
    copyright: {
      es: "© 2025 Incoders - Todos los derechos reservados.",
      en: "© 2025 Incoders - All rights reserved.",
      fr: "© 2025 Incoders - Tous droits réservés.",
      pt: "© 2025 Incoders - Todos os direitos reservados.",
    },
    socialLinks: [
      { platform: "facebook", url: "#" },
      { platform: "instagram", url: "#" },
      { platform: "whatsapp", url: "#" },
    ],
  },
};

export const apiConfig = {
  google: {
    SheetsUrl:
      "https://script.google.com/macros/s/AKfycbz8bKKFWehv7cnLIjAHF4zsfAOcxUsi54x6HilPFevpCofdCBUSyXe6nYSUcMFIXXeCYQ/exec",
  },
};
