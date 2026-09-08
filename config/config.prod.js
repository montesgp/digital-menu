export const storeConfig = {
  // General site configuration
  site: {
    name: "#TabName",
    description: "#TabDescription",
    shortName: "#ShortName",
    subtitle: "#SloganOrSubtitle",
    title: "#MenuTitle",
    url: "https://montesgp.github.io/digital-menu/",
    // Imagen destinada a los preview de los enlaces.
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
        startersService: "carousel.starters.title",
        mainService: "carousel.main_courses.title",
        drinksService: "carousel.drinks.title",
      },
      visibility: {
        dessertsService: true,
        fullService: true,
        drinksService: true,
        startersService: true,
        mainService: true,
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
      es: "© 2025 Patricio Montes - Todos los derechos reservados.",
      en: "© 2025 Patricio Montes - All rights reserved.",
      fr: "© 2025 Patricio Montes - Tous droits réservés.",
      pt: "© 2025 Patricio Montes - Todos os direitos reservados.",
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
