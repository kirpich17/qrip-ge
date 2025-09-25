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

export interface Translations {
  header: HeaderTranslations;
  common: CommonTranslations;
  home: HomeTranslations;
  adminOrders: AdminOrdersTranslations;
  adminOrderDetail: AdminOrderDetailTranslations;
  adminStickers: AdminStickersTranslations;
  adminDashboard: AdminDashboardTranslations;
  adminStickersPage: AdminStickersPageTranslations;
  stickerPurchase: StickerPurchaseTranslations;
  createMemorial: any;
  editMemorial: any;
}
