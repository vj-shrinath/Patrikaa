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
  };
};


export const initialData: InvitationData = {
  brideName: "प्रीती",
  brideFather: "राम पाटील",
  brideMother: "आशा पाटील",
  groomName: "आदित्य",
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
  }
};
