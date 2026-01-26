export type ScheduleItem = {
  name: string;
  details: string;
};

export type InvitationData = {
  // ownerId is no longer needed here as it's part of the path structure
  brideName: string;
  brideFather: string;
  brideMother: string;
  groomName: string;
  groomFather: string;
  groomMother: string;
  mainDate: string;
  mainMonth: string;
  mainDay: string;
  mainTime: string;
  mainYear: string;
  venueName: string;
  venueCity: string;
  venueMapLink: string;
  schedule: ScheduleItem[];
  theme: string;
  suggestedMessage?: string;
  designAdjustments?: string;
  coupleImageUrl?: string;
  gallery?: {
    type: 'image' | 'video';
    url: string;
  }[];
  weddingHeader?: string;
  brideParentsDetails?: string;
  groomParentsDetails?: string;
  requestMessage?: string;
  sectionOrder?: string[];
  hostSide?: 'bride' | 'groom';
  editExpiryDate?: any; // Using 'any' to accommodate both Firestore Timestamp and Date objects during transition
  scheduleSectionTitle?: string;
  fonts?: {
    brideName?: string;
    groomName?: string;
    brideParents?: string;
    groomParents?: string;
    weddingHeader?: string;
    requestMessage?: string;
    date?: string;
    place?: string;
    shubhMuhhurt?: string;
    general?: string;
    scheduleName?: string;
    scheduleDetails?: string;
    scheduleSectionTitle?: string;
    mainDate?: string;
    mainMonth?: string;
    mainTime?: string;
    mainYear?: string;
    mainDay?: string;
    venueCity?: string;
  };
  boldText?: {
    brideName?: boolean;
    groomName?: boolean;
    brideParents?: boolean;
    groomParents?: boolean;
    weddingHeader?: boolean;
    requestMessage?: boolean;
    place?: boolean;
    shubhMuhhurt?: boolean;
    general?: boolean;
    scheduleName?: boolean;
    scheduleDetails?: boolean;
    scheduleSectionTitle?: boolean;
    mainDate?: boolean;
    mainMonth?: boolean;
    mainTime?: boolean;
    mainYear?: boolean;
    mainDay?: boolean;
    venueCity?: boolean;
  };
  fontSizes?: {
    brideName?: string;
    groomName?: string;
    brideParents?: string;
    groomParents?: string;
    weddingHeader?: string;
    requestMessage?: string;
    place?: string;
    shubhMuhhurt?: string;
    general?: string;
    scheduleName?: string;
    scheduleDetails?: string;
    scheduleSectionTitle?: string;
    mainDate?: string;
    mainMonth?: string;
    mainTime?: string;
    mainYear?: string;
    mainDay?: string;
    venueCity?: string;
  };
  colors?: {
    brideName?: string;
    groomName?: string;
    brideParents?: string;
    groomParents?: string;
    weddingHeader?: string;
    requestMessage?: string;
    place?: string;
    shubhMuhhurt?: string;
    general?: string;
    scheduleName?: string;
    scheduleDetails?: string;
    scheduleSectionTitle?: string;
    mainDate?: string;
    mainMonth?: string;
    mainTime?: string;
    mainYear?: string;
    mainDay?: string;
    venueCity?: string;
  };
  topBanner?: {
    enabled: boolean;
    text: string;
    font?: string;
    bold?: boolean;
    fontSize?: string;
    color?: string;
  };
  countdown?: {
    isEnabled: boolean;
    targetDate: string;
  };
  customSections?: {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    fontTitle?: string;
    fontContent?: string;
    boldTitle?: boolean;
    boldContent?: boolean;
    fontSizeContent?: string;
    colorContent?: string;
  }[];
  branding?: {
    isEnabled: boolean;
    text: string;
    logoUrl?: string;
    contact?: string;
    type?: 'text' | 'button'; // 'text' for basic contact, 'button' for WhatsApp button
    buttonText?: string;
    whatsappNumber?: string;
    whatsappMessage?: string;
  };
  galleryConfig?: {
    autoscroll: boolean;
  };
};


export const initialData: InvitationData = {
  brideName: "मुक्ता",
  brideFather: "राम पाटील",
  brideMother: "आशा पाटील",
  groomName: "शिवम",
  groomFather: "अजय पवार",
  groomMother: "सीमा पवार",
  mainDate: "२६",
  mainMonth: "जुलै",
  mainDay: "रविवार",
  mainTime: "सायंकाळी ०६:१६ वाजता",
  mainYear: "२०२६",
  venueName: "सिद्धिविनायक लॉन",
  venueCity: "छत्रपती संभाजीनगर (औरंगाबाद)",
  venueMapLink: "https://maps.app.goo.gl/PXjDf2mTkkCrYUBB9",
  schedule: [
    { name: "हळदी समारंभ", details: "शुक्रवार, २४ जुलै । स. १०:०० वाजता" },
    { name: "संगीत संध्या", details: "शुक्रवार, २४ जुलै । सायं. ०७:०० वाजता" },
    { name: "लग्न समारंभ", details: "शनिवार, २५ जुलै । दु. १२:३० वाजता" },
    { name: "स्वागत समारंभ", details: "शनिवार, २५ जुलै । सायं. ०७:०० वाजता" },
  ],
  theme: "default",
  coupleImageUrl: "",
  gallery: [],
  weddingHeader: "शुभविवाह",
  sectionOrder: ['welcome', 'couple', 'date', 'schedule', 'venue'],
  hostSide: 'bride',
  scheduleSectionTitle: "कार्यक्रम",
  fonts: {
    brideName: "font-headline",
    groomName: "font-headline",
    brideParents: "font-body",
    groomParents: "font-body",
    weddingHeader: "font-custom-header",
    requestMessage: "font-body",
    date: "font-headline",
    place: "font-headline",
    shubhMuhhurt: "font-headline",
    general: "font-body",
    scheduleName: "font-headline",
    scheduleDetails: "font-serif",
    scheduleSectionTitle: "font-headline",
    mainDate: "font-headline",
    mainMonth: "font-body",
    mainTime: "font-body",
    mainYear: "font-body",
    mainDay: "font-serif",
    venueCity: "font-body",
  },
  boldText: {
    brideName: true,
    groomName: true,
    brideParents: false,
    groomParents: false,
    weddingHeader: false,
    requestMessage: false,
    place: true,
    shubhMuhhurt: true,
    scheduleName: true,
    scheduleDetails: false,
    scheduleSectionTitle: true,
    mainDate: true,
    mainMonth: false,
    mainTime: false,
    mainYear: true,
    mainDay: false,
    venueCity: false,
  },
  fontSizes: {
    brideName: "text-xl sm:text-3xl",
    groomName: "text-xl sm:text-3xl",
    brideParents: "text-xs",
    groomParents: "text-xs",
    weddingHeader: "text-4xl sm:text-6xl",
    requestMessage: "text-lg",
    place: "text-2xl sm:text-5xl",
    shubhMuhhurt: "text-2xl sm:text-4xl",
    scheduleName: "text-xl sm:text-3xl",
    scheduleDetails: "text-xl",
    scheduleSectionTitle: "text-2xl sm:text-4xl",
    mainDate: "text-6xl sm:text-9xl",
    mainMonth: "text-xl",
    mainTime: "text-xl",
    mainYear: "text-5xl",
    mainDay: "text-2xl",
    venueCity: "text-xl sm:text-3xl",
  },
  colors: {
    brideName: "",
    groomName: "",
    brideParents: "",
    groomParents: "",
    weddingHeader: "",
    requestMessage: "",
    place: "",
    shubhMuhhurt: "",
    scheduleName: "",
    scheduleDetails: "",
    scheduleSectionTitle: "",
    mainDate: "",
    mainMonth: "",
    mainTime: "",
    mainYear: "",
    mainDay: "",
    venueCity: "",
  },
  topBanner: {
    enabled: false,
    text: "You are specially invited",
    font: "font-headline",
    bold: true,
    fontSize: "text-xs sm:text-sm",
    color: "#ffffff"
  },
  countdown: {
    isEnabled: false,
    targetDate: "2026-07-26T18:16:00"
  },
  customSections: [],
  branding: {
    isEnabled: false,
    text: "Created with DigiInvite",
    logoUrl: "",
    contact: "",
    type: 'text',
    buttonText: "Chat with us",
    whatsappNumber: "",
    whatsappMessage: "Hi, I would like to inquire about..."
  },
  galleryConfig: {
    autoscroll: false
  }
};
