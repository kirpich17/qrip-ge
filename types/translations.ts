export interface HeaderTranslations {
  admin: string;
  getStarted: string;
}

export interface CommonTranslations {
  about: string;
  contact: string;
  privacy: string;
  terms: string;
}

export interface HomeTranslations {
  heroTitle: string;
}

export interface AdminOrdersTranslations {
  header: {
    back: string;
    title: string;
  };
  main: {
    title: string;
    description: string;
  };
  stats: {
    totalOrders: string;
    pending: string;
    paid: string;
    shipped: string;
    totalRevenue: string;
  };
  filters: {
    searchPlaceholder: string;
    orderStatus: string;
    paymentStatus: string;
    allStatuses: string;
    allPayments: string;
  };
  table: {
    title: string;
    description: string;
    headers: {
      orderId: string;
      customer: string;
      memorial: string;
      sticker: string;
      quantity: string;
      total: string;
      payment: string;
      status: string;
      date: string;
      actions: string;
    };
    actions: {
      ship: string;
      markDelivered: string;
      viewDetails: string;
      deleteOrder: string;
    };
  };
  status: {
    pending: string;
    processing: string;
    shipped: string;
    delivered: string;
    cancelled: string;
  };
  paymentStatus: {
    pending: string;
    paid: string;
    failed: string;
    refunded: string;
  };
  messages: {
    loading: string;
    loadError: string;
    updateSuccess: string;
    updateError: string;
    deleteSuccess: string;
    deleteError: string;
    deleteConfirm: string;
    trackingPrompt: string;
  };
  pagination: {
    previous: string;
    next: string;
    page: string;
    of: string;
    showing: string;
    to: string;
    results: string;
  };
}

export interface AdminOrderDetailTranslations {
  header: {
    back: string;
    title: string;
  };
  loading: {
    message: string;
  };
  notFound: {
    title: string;
    message: string;
    backButton: string;
  };
  orderHeader: {
    orderNumber: string;
    createdOn: string;
  };
  sections: {
    customerInfo: {
      title: string;
      name: string;
      email: string;
      phone: string;
      userId: string;
    };
    memorialInfo: {
      title: string;
      memorialName: string;
      slug: string;
      memorialId: string;
    };
    shippingAddress: {
      title: string;
      phone: string;
    };
    orderSummary: {
      title: string;
      sticker: string;
      type: string;
      size: string;
      quantity: string;
      unitPrice: string;
      total: string;
    };
    qrCodeDownload: {
      title: string;
      description: string;
      memorialLabel: string;
      qualityNote: string;
    };
    paymentInfo: {
      title: string;
      status: string;
      paymentId: string;
    };
    orderActions: {
      title: string;
      deleteOrder: string;
    };
    timeline: {
      title: string;
      orderCreated: string;
      lastUpdated: string;
    };
  };
  status: {
    pending: string;
    processing: string;
    shipped: string;
    delivered: string;
    cancelled: string;
  };
  paymentStatus: {
    pending: string;
    paid: string;
    failed: string;
    refunded: string;
  };
  messages: {
    orderNotFound: string;
    loadError: string;
    deleteConfirm: string;
    deleteSuccess: string;
    deleteError: string;
    notLoggedIn: string;
    downloadSuccess: string;
    downloadError: string;
  };
}

export interface AdminStickersTranslations {
  header: {
    back: string;
    title: string;
  };
  main: {
    title: string;
    description: string;
    addButton: string;
  };
  search: {
    placeholder: string;
  };
  table: {
    title: string;
    description: string;
    headers: {
      name: string;
      type: string;
      size: string;
      price: string;
      stock: string;
      status: string;
      actions: string;
    };
    status: {
      active: string;
      inactive: string;
    };
  };
  createDialog: {
    title: string;
    description: string;
    form: {
      name: string;
      namePlaceholder: string;
      type: string;
      typePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      size: string;
      sizePlaceholder: string;
      price: string;
      pricePlaceholder: string;
      stock: string;
      stockPlaceholder: string;
      material: string;
      materialPlaceholder: string;
      dimensions: string;
      dimensionsPlaceholder: string;
      durability: string;
      durabilityPlaceholder: string;
      weatherResistance: string;
      weatherResistancePlaceholder: string;
    };
    buttons: {
      cancel: string;
      create: string;
    };
  };
  editDialog: {
    title: string;
    description: string;
    buttons: {
      cancel: string;
      update: string;
    };
  };
  types: {
    vinyl: string;
    engraving: string;
    premium: string;
  };
  messages: {
    loading: string;
    createSuccess: string;
    updateSuccess: string;
    deleteSuccess: string;
    statusUpdateSuccess: string;
    createError: string;
    updateError: string;
    deleteError: string;
    statusUpdateError: string;
    loadError: string;
    deleteConfirm: string;
  };
}

export interface AdminDashboardTranslations {
  orders: {
    tabTitle: string;
    title: string;
    description: string;
    viewAllOrders: string;
    manageStickers: string;
    orderManagement: string;
    orderManagementDescription: string;
    goToOrders: string;
  };
}

export interface AdminStickersPageTranslations {
  header: {
    back: string;
    title: string;
    description: string;
  };
  loading: {
    message: string;
  };
  search: {
    placeholder: string;
  };
  table: {
    title: string;
    description: string;
    headers: {
      name: string;
      type: string;
      size: string;
      price: string;
      stock: string;
      status: string;
      actions: string;
    };
    status: {
      active: string;
      inactive: string;
    };
  };
  createDialog: {
    title: string;
    description: string;
    form: {
      name: string;
      namePlaceholder: string;
      type: string;
      typePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      size: string;
      sizePlaceholder: string;
      price: string;
      pricePlaceholder: string;
      stock: string;
      stockPlaceholder: string;
      material: string;
      materialPlaceholder: string;
      dimensions: string;
      dimensionsPlaceholder: string;
      durability: string;
      durabilityPlaceholder: string;
      weatherResistance: string;
      weatherResistancePlaceholder: string;
    };
    buttons: {
      cancel: string;
      create: string;
    };
  };
  editDialog: {
    title: string;
    description: string;
    buttons: {
      cancel: string;
      update: string;
    };
  };
  types: {
    vinyl: string;
    engraving: string;
    premium: string;
  };
  messages: {
    loading: string;
    createSuccess: string;
    updateSuccess: string;
    deleteSuccess: string;
    statusUpdateSuccess: string;
    createError: string;
    updateError: string;
    deleteError: string;
    statusUpdateError: string;
    loadError: string;
    deleteConfirm: string;
  };
}

export interface StickerPurchaseTranslations {
  header: {
    back: string;
    title: string;
    description: string;
  };
  loading: {
    message: string;
  };
  comingSoon: {
    title: string;
    message: string;
    backButton: string;
  };
  sections: {
    memorialSelection: {
      title: string;
      description: string;
    };
    stickerOptions: {
      title: string;
      description: string;
      specifications: {
        material: string;
        dimensions: string;
        durability: string;
      };
    };
    quantity: {
      title: string;
      description: string;
    };
    shippingAddress: {
      title: string;
      description: string;
      form: {
        fullName: string;
        fullNamePlaceholder: string;
        address: string;
        addressPlaceholder: string;
        city: string;
        cityPlaceholder: string;
        zipCode: string;
        zipCodePlaceholder: string;
        country: string;
        countryPlaceholder: string;
        phone: string;
        phonePlaceholder: string;
      };
    };
    orderSummary: {
      title: string;
      quantity: string;
      total: string;
      proceedToPayment: string;
      processing: string;
      securePayment: string;
    };
  };
  messages: {
    loadError: string;
    selectMemorialAndSticker: string;
    fillShippingDetails: string;
    orderCreated: string;
    paymentInitiationFailed: string;
    orderCreationFailed: string;
  };
}

export interface HeroTranslations {
  tagline: string;
  title1: string;
  title2: string;
  description: string;
  createButton: string;
  demoButton: string;
  stats: {
    memorials: string;
    families: string;
    memories: string;
  };
  memorialExample: {
    name: string;
    years: string;
    quote: string;
    photos: string;
    videos: string;
    family: string;
    scanCta: string;
  };
}

// Updated MemorialTranslations interface with location button translations
export interface MemorialTranslations {
  inLovingMemory: string;
  tapToViewMemorial: string;
  memorialUnavailable: string;
  memorialInactive: string;
  contactSupport: string;
  returnHome: string;
  noMemorialData: string;
  loadingMemorial: string;
  premiumSlides: {
    tapToView: string;
  };
  header: {
    views: string;
  };
  profile: {
    age: string;
  };
  tabs: {
    memories: string;
    description: string;
    photos: string;
    video: string;
    lifeStory: string;
  };
  video: {
    description: string;
  };
  premium: {
    feature: string;
    videoContent: string;
    learnMore: string;
  };
  navigation: {
    prev: string;
    next: string;
  };
  sections: {
    location: {
      title: string;
      noLocation: string;
      getDirections: string;
      viewOnGoogleMaps: string;
      copyCoordinates: string;
      preciseLocation: string;
    };
    family: {
      title: string;
      noFamily: string;
    };
    achievements: {
      title: string;
      noAchievements: string;
    };
    info: {
      title: string;
      qrCode: string;
      plan: string;
      lastUpdated: string;
      createMemorial: string;
    };
  };
}

export interface PlansTranslations {
  minimal: {
    name: string;
    description: string;
    features: {
      photoUploads: string;
      slideshow: string;
      videoUploads: string;
      documentUpload: string;
      familyTree: string;
    };
  };
  medium: {
    name: string;
    description: string;
    features: {
      photoUploads: string;
      slideshow: string;
      videoUploads: string;
      documentUpload: string;
      familyTree: string;
    };
  };
  premium: {
    name: string;
    description: string;
    features: {
      photoUploads: string;
      slideshow: string;
      videoUploads: string;
      documentUpload: string;
      familyTree: string;
    };
  };
}

export interface HomePagePlanTranslations {
  heading: string;
  title: string;
}

export interface PlanSelectionTranslations {
  loading?: string;
  error?: string;
  paymentError?: {
    initiate: string;
    process: string;
  };
  badgePopular?: string;
  selectDuration?: string;
  features?: {
    photoUploads: string;
    unlimitedPhotos: string;
    slideshow: string;
    videoUploads: string;
    documentUpload: string;
    familyTree: string;
  };
  cta: {
    processing?: string;
    getStarted: string;
    medium: string;
    goPremium: string;
    selectPlan: string;
  };
  preselected?: {
    title: string;
    description: string;
    badge: string;
  };
  promoCode?: {
    title: string;
    applied: string;
    placeholder: string;
    applying: string;
    apply: string;
    remove: string;
    getForFree: string;
    notApplicable: string;
  };
}

export interface LanguageManagementTranslations {
  title: string;
  description: string;
  backToDashboard: string;
  tabs: {
    uploadFiles: string;
    manageFiles: string;
  };
  languages: {
    english: string;
    georgian: string;
    russian: string;
  };
  upload: {
    selectFile: string;
    uploading: string;
    uploadDescription: string;
    progress: string;
    success: string;
    error: string;
    guidelines: {
      title: string;
      jsonFormat: string;
      fileSize: string;
      validJson: string;
      replacement: string;
      immediateEffect: string;
    };
  };
  manage: {
    fileUploaded: string;
    noFileUploaded: string;
    active: string;
    inactive: string;
    download: string;
    uploadFile: string;
    file: string;
    size: string;
    updated: string;
  };
  messages: {
    uploadSuccess: string;
    downloadSuccess: string;
    uploadError: string;
    downloadError: string;
    invalidJsonFile: string;
    fileSizeError: string;
  };
}

export interface Translations {
  header: HeaderTranslations;
  common: CommonTranslations;
  home: HomeTranslations;
  hero: HeroTranslations;
  memorial: MemorialTranslations;
  adminOrders: AdminOrdersTranslations;
  adminOrderDetail: AdminOrderDetailTranslations;
  adminStickers: AdminStickersTranslations;
  adminDashboard: AdminDashboardTranslations;
  adminStickersPage: AdminStickersPageTranslations;
  stickerPurchase: StickerPurchaseTranslations;
  createMemorial: any;
  editMemorial: any;
  plansTranslations: PlansTranslations;
  homePagePlan: HomePagePlanTranslations;
  planSelection: PlanSelectionTranslations;
  languageManagement: LanguageManagementTranslations;
}
