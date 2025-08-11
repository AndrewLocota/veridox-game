// Document dataset configuration
// This file manages all document data including images, metadata, and educational content

export const documentDataset = [
  // Real Documents
  {
    id: 1,
    image:
      process.env.PUBLIC_URL +
      "/dataset/real/" +
      encodeURIComponent("NCD Doc Sourced Online.jpg"),
    isReal: true,
    type: "Valid NCD Document",
    category: "certificate",
    difficulty: "medium",
    description: "Authentic No Claims Discount document sourced online",
    securityFeatures: [
      "Official letterhead",
      "Consistent formatting",
      "Proper contact information",
      "Professional typography",
    ],
    educationalNotes: {
      whenWrong:
        "This is actually a REAL NCD document. Look for: consistent branding, professional formatting, and legitimate contact details.",
      keyIndicators:
        "Notice the official letterhead, proper formatting, and consistent typography throughout.",
    },
  },
  {
    id: 2,
    image:
      process.env.PUBLIC_URL +
      "/dataset/real/" +
      encodeURIComponent("Invoice Re-use sourced online.jpg"),
    isReal: true,
    type: "Valid Invoice",
    category: "invoice",
    difficulty: "easy",
    description: "Legitimate invoice document sourced online",
    securityFeatures: [
      "Sequential invoice number",
      "Proper VAT information",
      "Clear itemization",
      "Professional layout",
    ],
    educationalNotes: {
      whenWrong:
        "This is actually a REAL invoice. Real invoices have: proper sequential numbering, clear VAT details, and professional formatting.",
      keyIndicators:
        "Check for consistent formatting, proper tax information, and legitimate business details.",
    },
  },
  {
    id: 3,
    image:
      process.env.PUBLIC_URL +
      "/dataset/real/" +
      encodeURIComponent("Receipt Sourced online.jpg"),
    isReal: true,
    type: "Valid Receipt",
    category: "receipt",
    difficulty: "easy",
    description: "Authentic receipt document sourced online",
    securityFeatures: [
      "Clear transaction details",
      "Proper date/time stamp",
      "Valid payment method info",
      "Store branding",
    ],
    educationalNotes: {
      whenWrong:
        "This is actually a REAL receipt. Look for: clear transaction details, proper timestamps, and consistent store branding.",
      keyIndicators:
        "Notice the professional formatting, clear pricing, and legitimate business information.",
    },
  },
  {
    id: 4,
    image:
      process.env.PUBLIC_URL +
      "/dataset/real/" +
      encodeURIComponent("Receipt Genuine document other insurer.jpg"),
    isReal: true,
    type: "Genuine Insurance Receipt",
    category: "insurance",
    difficulty: "medium",
    description: "Authentic insurance document from legitimate insurer",
    securityFeatures: [
      "Official insurance branding",
      "Policy reference numbers",
      "Proper contact information",
      "Professional letterhead",
    ],
    educationalNotes: {
      whenWrong:
        "This is actually a REAL insurance document. Real insurance docs have: official branding, valid policy numbers, and professional formatting.",
      keyIndicators:
        "Check for consistent branding, proper policy details, and legitimate insurer information.",
    },
  },
  {
    id: 5,
    image:
      process.env.PUBLIC_URL +
      "/dataset/real/" +
      encodeURIComponent("Damage Genuine document other insurer.jpg"),
    isReal: true,
    type: "Genuine Damage Report",
    category: "damage_report",
    difficulty: "hard",
    description: "Authentic damage assessment document from legitimate insurer",
    securityFeatures: [
      "Professional damage assessment",
      "Detailed cost breakdown",
      "Official signatures",
      "Proper documentation",
    ],
    educationalNotes: {
      whenWrong:
        "This is actually a REAL damage report. Look for: professional assessment details, proper cost breakdowns, and official documentation.",
      keyIndicators:
        "Notice the detailed professional assessment, consistent formatting, and legitimate insurer branding.",
    },
  },

  // Fake Documents
  {
    id: 6,
    image:
      process.env.PUBLIC_URL +
      "/dataset/fake/" +
      encodeURIComponent("NCD Doc GenAI generated image.png"),
    isReal: false,
    type: "AI-Generated NCD Document",
    category: "certificate",
    difficulty: "hard",
    description: "AI-generated fake NCD document with synthetic content",
    forgeryType: "ai_generation",
    forgeryDetails: {
      alterations: [
        "Completely AI-generated content",
        "Synthetic letterhead design",
        "Artificial text generation",
        "Non-existent company details",
      ],
      techniques: ["AI image generation", "Synthetic text creation"],
      detectionClues: [
        "Inconsistent typography",
        "Artificial-looking logos",
        "Generic formatting",
        "Unrealistic details",
      ],
    },
    educationalNotes: {
      whenWrong:
        "This is actually FAKE! This is an AI-generated document. Look for: inconsistent typography, artificial-looking elements, and generic formatting.",
      keyIndicators:
        "AI-generated documents often have subtle inconsistencies in fonts, spacing, and overall design quality.",
    },
  },
  {
    id: 7,
    image:
      process.env.PUBLIC_URL +
      "/dataset/fake/" +
      encodeURIComponent("Receipt GenAI generated image.png"),
    isReal: false,
    type: "AI-Generated Receipt",
    category: "receipt",
    difficulty: "medium",
    description: "AI-generated fake receipt with synthetic transaction details",
    forgeryType: "ai_generation",
    forgeryDetails: {
      alterations: [
        "AI-generated transaction data",
        "Synthetic store branding",
        "Artificial pricing information",
        "Non-existent business details",
      ],
      techniques: ["AI image generation", "Synthetic data creation"],
      detectionClues: [
        "Inconsistent formatting",
        "Unrealistic pricing",
        "Generic store design",
        "Artificial text quality",
      ],
    },
    educationalNotes: {
      whenWrong:
        "This is actually FAKE! This receipt was AI-generated. Notice: inconsistent formatting, unrealistic details, and artificial-looking text.",
      keyIndicators:
        "AI receipts often have inconsistent fonts, unrealistic pricing patterns, and generic store designs.",
    },
  },
  {
    id: 8,
    image:
      process.env.PUBLIC_URL +
      "/dataset/fake/" +
      encodeURIComponent("Invoice GenAI Generated.png"),
    isReal: false,
    type: "AI-Generated Invoice",
    category: "invoice",
    difficulty: "hard",
    description: "Sophisticated AI-generated fake invoice",
    forgeryType: "ai_generation",
    forgeryDetails: {
      alterations: [
        "Completely synthetic content",
        "AI-generated company details",
        "Artificial pricing structure",
        "Non-existent business information",
      ],
      techniques: ["Advanced AI generation", "Synthetic business data"],
      detectionClues: [
        "Subtle typography inconsistencies",
        "Unrealistic business details",
        "Generic professional layout",
        "Artificial data patterns",
      ],
    },
    educationalNotes: {
      whenWrong:
        "This is actually FAKE! This sophisticated AI-generated invoice can be tricky. Look for: subtle inconsistencies in formatting and unrealistic business details.",
      keyIndicators:
        "Advanced AI invoices require careful examination of typography consistency and business detail authenticity.",
    },
  },
  {
    id: 9,
    image:
      process.env.PUBLIC_URL +
      "/dataset/fake/" +
      encodeURIComponent("Damage Image GenAI Generated.png"),
    isReal: false,
    type: "AI-Generated Damage Report",
    category: "damage_report",
    difficulty: "expert",
    description: "AI-generated fake damage assessment document",
    forgeryType: "ai_generation",
    forgeryDetails: {
      alterations: [
        "Synthetic damage assessment",
        "AI-generated cost estimates",
        "Artificial professional formatting",
        "Non-existent assessor details",
      ],
      techniques: ["AI document generation", "Synthetic professional data"],
      detectionClues: [
        "Unrealistic damage descriptions",
        "Inconsistent professional terminology",
        "Generic assessment format",
        "Artificial signature patterns",
      ],
    },
    educationalNotes: {
      whenWrong:
        "This is actually FAKE! This AI-generated damage report is very sophisticated. Look for: unrealistic damage descriptions and inconsistent professional terminology.",
      keyIndicators:
        "Expert-level AI documents require detailed knowledge of industry standards and professional practices to detect.",
    },
  },
  {
    id: 10,
    image:
      process.env.PUBLIC_URL +
      "/dataset/fake/" +
      encodeURIComponent("V5 GenAI Generated Image.png"),
    isReal: false,
    type: "AI-Generated V5 Document",
    category: "vehicle_registration",
    difficulty: "hard",
    description: "AI-generated fake vehicle registration document",
    forgeryType: "ai_generation",
    forgeryDetails: {
      alterations: [
        "Synthetic vehicle details",
        "AI-generated registration data",
        "Artificial DVLA formatting",
        "Non-existent vehicle information",
      ],
      techniques: ["AI document synthesis", "Synthetic government formatting"],
      detectionClues: [
        "Inconsistent government formatting",
        "Unrealistic vehicle data",
        "Generic security features",
        "Artificial registration patterns",
      ],
    },
    educationalNotes: {
      whenWrong:
        "This is actually FAKE! This AI-generated V5 document mimics official formatting. Look for: inconsistent government styling and unrealistic vehicle data.",
      keyIndicators:
        "AI-generated government documents often have subtle formatting errors and unrealistic official data.",
    },
  },
  {
    id: 11,
    image:
      process.env.PUBLIC_URL +
      "/dataset/fake/" +
      encodeURIComponent("Damage Image Editing Spliced.png"),
    isReal: false,
    type: "Digitally Edited Damage Report",
    category: "damage_report",
    difficulty: "medium",
    description: "Damage report with digitally spliced/edited content",
    forgeryType: "digital_editing",
    forgeryDetails: {
      alterations: [
        "Spliced content from multiple sources",
        "Digitally edited cost figures",
        "Modified assessment details",
        "Composite image creation",
      ],
      techniques: [
        "Digital image editing",
        "Content splicing",
        "Photo manipulation",
      ],
      detectionClues: [
        "Inconsistent image quality",
        "Mismatched formatting styles",
        "Color variations between sections",
        "Pixelation around edited areas",
      ],
    },
    educationalNotes: {
      whenWrong:
        "This is actually FAKE! This document has been digitally edited and spliced. Look for: inconsistent image quality, mismatched formatting, and color variations.",
      keyIndicators:
        "Digitally edited documents often show quality inconsistencies, formatting mismatches, and visible editing artifacts.",
    },
  },
];

// Analytics and Learning Data
export const userAnalytics = {
  wrongAnswers: [], // Will store user mistakes for learning

  // Function to log wrong answers with educational feedback
  logWrongAnswer: function (documentId, userChoice, timestamp = new Date()) {
    const document = documentDataset.find((doc) => doc.id === documentId);
    if (document) {
      this.wrongAnswers.push({
        documentId,
        userChoice,
        correctAnswer: document.isReal,
        timestamp,
        document: {
          type: document.type,
          category: document.category,
          difficulty: document.difficulty,
        },
        educationalContent: document.educationalNotes.whenWrong,
        keyIndicators: document.educationalNotes.keyIndicators,
      });
    }
  },

  // Get educational feedback for wrong answers
  getEducationalFeedback: function (documentId) {
    const document = documentDataset.find((doc) => doc.id === documentId);
    return document ? document.educationalNotes : null;
  },

  // Get user's mistake patterns
  getMistakePatterns: function () {
    const patterns = {
      categories: {},
      difficulties: {},
      types: {},
    };

    this.wrongAnswers.forEach((mistake) => {
      const { category, difficulty, type } = mistake.document;
      patterns.categories[category] = (patterns.categories[category] || 0) + 1;
      patterns.difficulties[difficulty] =
        (patterns.difficulties[difficulty] || 0) + 1;
      patterns.types[type] = (patterns.types[type] || 0) + 1;
    });

    return patterns;
  },
};

// Configuration for dataset management
export const datasetConfig = {
  supportedFormats: [".jpg", ".jpeg", ".png", ".webp"],
  maxFileSize: "2MB",
  recommendedDimensions: "400x600",
  categories: [
    "certificate",
    "invoice",
    "receipt",
    "insurance",
    "damage_report",
    "vehicle_registration",
    "passport",
    "license",
    "id_card",
    "contract",
    "diploma",
  ],
  difficulties: ["easy", "medium", "hard", "expert"],

  // Validation function for new documents
  validateDocument: function (document) {
    const required = [
      "id",
      "image",
      "isReal",
      "type",
      "category",
      "educationalNotes",
    ];
    return required.every((field) => document.hasOwnProperty(field));
  },
};
