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
<<<<<<< HEAD
  coupleImageUrl: string;
=======
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
  suggestedMessage?: string;
  designAdjustments?: string;
};


export const initialData: InvitationData = {
<<<<<<< HEAD
    brideName: "प्रेरणा शिंदे",
    brideFather: "राम शिंदे",
    brideMother: "आशा शिंदे",
    groomName: "सुमित जाधव",
    groomFather: "अजय जाधव",
    groomMother: "सीमा जाधव",
=======
    brideName: "प्रेरणा सिंह",
    brideFather: "राम सिंह",
    brideMother: "आशा सिंह",
    groomName: "सुमित गुप्ता",
    groomFather: "अजय गुप्ता",
    groomMother: "सीमा गुप्ता",
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
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
<<<<<<< HEAD
    coupleImageUrl: "",
=======
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
};
