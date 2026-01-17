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
  brideParentsDetails?: string;
  groomParentsDetails?: string;
  requestMessage?: string;
  sectionOrder?: string[];
  hostSide?: 'bride' | 'groom';
  editExpiryDate?: any; // Using 'any' to accommodate both Firestore Timestamp and Date objects during transition
};


export const initialData: InvitationData = {
  brideName: "प्रेरणा पाटील",
  brideFather: "राम पाटील",
  brideMother: "आशा पाटील",
  groomName: "सुमित पवार",
  groomFather: "अजय पवार",
  groomMother: "सीमा पवार",
  mainDate: "२६",
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
  sectionOrder: ['welcome', 'date', 'schedule', 'venue'],
  hostSide: 'bride',
};
