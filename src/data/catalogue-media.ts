/** Approved Reve-made sample photography. Source originals remain private. */
export type CatalogueCategorySlug = "t-shirts" | "polo-shirts" | "hoodies" | "joggers" | "sweatshirts" | "ladies-wear" | "kids-wear" | "specialized-fabrics";
export interface CatalogueImage { src: string; width: number; height: number }
export interface CatalogueMedia {
  sampleId: string;
  sourceId: string;
  categorySlug: CatalogueCategorySlug;
  relatedSampleIds: string[];
  title: string;
  alt: string;
  images: CatalogueImage[];
  originalFilename: string;
  sourceDeck: string | null;
  sourceSlide: string | null;
  sourceApproval: { status: string; date: string; scope: string };
  enhancementRecipe: string;
}
export const catalogueMedia: CatalogueMedia[] = [
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a027",
    "sourceId": "A027",
    "categorySlug": "t-shirts",
    "title": "Grey script T-shirt",
    "alt": "Grey short-sleeve T-shirt with Dsgn Studio script chest graphic on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a027-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a027-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a027-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (12).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a040",
    "sourceId": "A040",
    "categorySlug": "t-shirts",
    "title": "Charcoal 98 graphic T-shirt",
    "alt": "Charcoal short-sleeve T-shirt with a large tonal 98 chest graphic on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a040-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a040-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a040-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (24).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a041",
    "sourceId": "A041",
    "categorySlug": "t-shirts",
    "title": "Cream typographic T-shirt",
    "alt": "Cream short-sleeve T-shirt with stacked black typography on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a041-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a041-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a041-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (25).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a033",
    "sourceId": "A033",
    "categorySlug": "polo-shirts",
    "title": "Contrast-collar rugby top",
    "alt": "Black long-sleeve rugby-style top with a white collar and small chest graphic on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a033-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a033-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a033-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (18).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a038",
    "sourceId": "A038",
    "categorySlug": "polo-shirts",
    "title": "California 06 rugby top",
    "alt": "Cream and navy long-sleeve rugby-style top with California 06 graphics and striped cuffs on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a038-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a038-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a038-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (22).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a049",
    "sourceId": "A049",
    "categorySlug": "polo-shirts",
    "title": "Red striped rugby top",
    "alt": "Red and cream wide-striped long-sleeve rugby-style top with a pointed collar on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a049-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a049-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a049-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (32).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a051",
    "sourceId": "A051",
    "categorySlug": "polo-shirts",
    "title": "New York striped rugby top",
    "alt": "Green and cream wide-striped long-sleeve rugby-style top with New York script on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a051-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a051-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a051-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (34).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a046",
    "sourceId": "A046",
    "categorySlug": "hoodies",
    "title": "Black script zip hoodie",
    "alt": "Black full-zip hoodie with a white script chest graphic and ribbed hem on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a046-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a046-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a046-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (3).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a057",
    "sourceId": "A057",
    "categorySlug": "hoodies",
    "title": "New York 06 hoodie",
    "alt": "Grey pullover hoodie with New York State USA 06 chest graphics and a kangaroo pocket on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a057-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a057-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a057-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (4).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a071",
    "sourceId": "A071",
    "categorySlug": "hoodies",
    "title": "Grey NYC zip hoodie",
    "alt": "Grey full-zip hoodie with a stacked NYC 98 chest graphic on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a071-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a071-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a071-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.43 PM (8).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a030",
    "sourceId": "A030",
    "categorySlug": "joggers",
    "title": "Charcoal wide-leg trousers",
    "alt": "Plain charcoal wide-leg trousers with an elasticated waistband on a clip hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a030-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a030-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a030-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (15).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a055",
    "sourceId": "A055",
    "categorySlug": "joggers",
    "title": "Cropped drawstring trousers",
    "alt": "Charcoal cropped wide-leg trousers with a drawstring waistband and side pocket on a clip hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a055-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a055-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a055-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (38).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a065",
    "sourceId": "A065",
    "categorySlug": "joggers",
    "title": "Washed wide-leg trousers",
    "alt": "Washed charcoal wide-leg trousers with a drawstring waistband on a clip hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a065-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a065-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a065-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.43 PM (2).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a024",
    "sourceId": "A024",
    "categorySlug": "sweatshirts",
    "title": "Contrast-sleeve raglan sweatshirt",
    "alt": "Dark crew-neck sweatshirt with brown contrast raglan sleeves on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a024-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a024-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a024-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (1).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a035",
    "sourceId": "A035",
    "categorySlug": "sweatshirts",
    "title": "Grey script sweatshirt",
    "alt": "Light grey crew-neck sweatshirt with a black Dsgn Studio script chest graphic on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a035-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a035-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a035-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (2).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a060",
    "sourceId": "A060",
    "categorySlug": "sweatshirts",
    "title": "Black raglan sweatshirt",
    "alt": "Black crew-neck sweatshirt with visible tonal raglan seam detailing on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a060-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a060-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a060-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (7).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a104",
    "sourceId": "A104",
    "categorySlug": "ladies-wear",
    "title": "Pink striped hooded sweatshirt",
    "alt": "Pale pink hooded sweatshirt with horizontal light stripes and a front graphic on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a104-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a104-603.webp",
        "width": 603,
        "height": 804
      }
    ],
    "originalFilename": "ppt/media/image20.png",
    "sourceDeck": "Ladies Sample 23-05-26.pptx",
    "sourceSlide": "13",
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [
      "rs-a122"
    ],
    "sampleId": "rs-a121",
    "sourceId": "A121",
    "categorySlug": "ladies-wear",
    "title": "Light grey graphic hoodie",
    "alt": "Light grey hooded sweatshirt with pink DSGN Studio lettering and a kangaroo pocket on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a121-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a121-537.webp",
        "width": 537,
        "height": 717
      }
    ],
    "originalFilename": "ppt/media/image36.png",
    "sourceDeck": "Ladies Sample 23-05-26.pptx",
    "sourceSlide": "22",
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [
      "rs-a121"
    ],
    "sampleId": "rs-a122",
    "sourceId": "A122",
    "categorySlug": "ladies-wear",
    "title": "Light grey matching trousers",
    "alt": "Light grey trousers with a drawstring waistband on a clip hanger, from the same sample presentation as the grey graphic hoodie.",
    "images": [
      {
        "src": "/images/catalogue/rs-a122-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a122-503.webp",
        "width": 503,
        "height": 670
      }
    ],
    "originalFilename": "ppt/media/image37.png",
    "sourceDeck": "Ladies Sample 23-05-26.pptx",
    "sourceSlide": "22",
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a137",
    "sourceId": "A137",
    "categorySlug": "ladies-wear",
    "title": "Tonal graphic hoodie",
    "alt": "Grey pullover hoodie with tonal ATH CLUB 89 lettering on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a137-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a137-577.webp",
        "width": 577,
        "height": 769
      }
    ],
    "originalFilename": "ppt/media/image3.png",
    "sourceDeck": "Ladies Samples 16-05-26.pptx",
    "sourceSlide": "2",
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [
      "rs-a165"
    ],
    "sampleId": "rs-a164",
    "sourceId": "A164",
    "categorySlug": "ladies-wear",
    "title": "Striped collared top",
    "alt": "Fine-striped short-sleeve collared top with an open V neckline on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a164-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a164-514.webp",
        "width": 514,
        "height": 685
      }
    ],
    "originalFilename": "ppt/media/image24.png",
    "sourceDeck": "Ladies Style Reve.pptx",
    "sourceSlide": "8",
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [
      "rs-a164"
    ],
    "sampleId": "rs-a165",
    "sourceId": "A165",
    "categorySlug": "ladies-wear",
    "title": "Striped wide-leg trousers",
    "alt": "Fine-striped wide-leg trousers on a clip hanger, from the same sample presentation as the striped collared top.",
    "images": [
      {
        "src": "/images/catalogue/rs-a165-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a165-434.webp",
        "width": 434,
        "height": 579
      }
    ],
    "originalFilename": "ppt/media/image25.png",
    "sourceDeck": "Ladies Style Reve.pptx",
    "sourceSlide": "8",
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a195",
    "sourceId": "A195",
    "categorySlug": "kids-wear",
    "title": "Pink ROSES T-shirt",
    "alt": "Pink short-sleeve ROSES graphic T-shirt photographed flat with its original sample tag.",
    "images": [
      {
        "src": "/images/catalogue/rs-a195-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a195-569.webp",
        "width": 569,
        "height": 759
      }
    ],
    "originalFilename": "ppt/media/image12.png",
    "sourceDeck": "PPT REVE 1.pptx",
    "sourceSlide": "7",
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a048",
    "sourceId": "A048",
    "categorySlug": "specialized-fabrics",
    "title": "Washed sweatshirt development",
    "alt": "Washed charcoal crew-neck sweatshirt with a tonal front graphic on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a048-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a048-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a048-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (31).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a058",
    "sourceId": "A058",
    "categorySlug": "specialized-fabrics",
    "title": "Camouflage zip-jacket development",
    "alt": "Green and brown camouflage cropped full-zip collared jacket on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a058-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a058-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a058-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (5).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a059",
    "sourceId": "A059",
    "categorySlug": "specialized-fabrics",
    "title": "Camouflage trouser development",
    "alt": "Green and brown camouflage wide-leg trousers on a clip hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a059-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a059-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a059-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (6).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a061",
    "sourceId": "A061",
    "categorySlug": "specialized-fabrics",
    "title": "Contrast-sleeve graphic development",
    "alt": "Grey ICONIC graphic T-shirt with camouflage raglan sleeves on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a061-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a061-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a061-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (8).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  },
  {
    "relatedSampleIds": [],
    "sampleId": "rs-a062",
    "sourceId": "A062",
    "categorySlug": "specialized-fabrics",
    "title": "Camouflage T-shirt development",
    "alt": "Green and brown camouflage short-sleeve T-shirt on a hanger.",
    "images": [
      {
        "src": "/images/catalogue/rs-a062-360.webp",
        "width": 360,
        "height": 480
      },
      {
        "src": "/images/catalogue/rs-a062-640.webp",
        "width": 640,
        "height": 853
      },
      {
        "src": "/images/catalogue/rs-a062-960.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "originalFilename": "WhatsApp Image 2026-10-18 at 3.18.42 PM (9).jpeg",
    "sourceDeck": null,
    "sourceSlide": null,
    "sourceApproval": {
      "status": "owner-confirmed",
      "date": "2026-10-18",
      "scope": "Reve-manufactured; website publication and faithful enhancement authorized"
    },
    "enhancementRecipe": "faithful-v1"
  }
];
