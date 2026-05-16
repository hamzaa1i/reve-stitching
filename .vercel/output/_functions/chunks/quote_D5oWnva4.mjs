const PRODUCT_NAMES = {
  "t-shirts": "Premium Cotton T-Shirts",
  "polo-shirts": "Corporate Polo Shirts",
  "hoodies": "Premium Hoodies",
  "joggers": "Athletic Joggers",
  "sweatshirts": "Sweatshirts Collection",
  "ladies-wear": "Ladies' Wear",
  "kids-wear": "Kids' Wear Range",
  "custom": "Custom / Other"
};
const FABRIC_NAMES = {
  "single-jersey": "Single Jersey",
  "double-jersey": "Double Jersey",
  "terry-fleece": "Terry Fleece",
  "lycra-rib": "Lycra Rib",
  "interlock": "Interlock",
  "custom-fabric": "Custom Fabric"
};
const CUSTOMIZATION_NAMES = {
  "screen-printing": "Screen Printing",
  "dtg-printing": "DTG Printing",
  "embroidery": "Embroidery",
  "heat-transfer": "Heat Transfer",
  "sublimation": "Sublimation",
  "custom-labels": "Custom Labels",
  "custom-hang-tags": "Custom Hang Tags",
  "custom-packaging": "Custom Packaging"
};
const DESTINATION_NAMES = {
  "uk": "United Kingdom",
  "eu": "European Union",
  "us": "United States",
  "other": "Other"
};
const STATUS_META = {
  new: { label: "New", color: "text-blue-800", bg: "bg-blue-100" },
  reviewed: { label: "Reviewed", color: "text-yellow-800", bg: "bg-yellow-100" },
  quoted: { label: "Quoted", color: "text-green-800", bg: "bg-green-100" },
  converted: { label: "Converted", color: "text-purple-800", bg: "bg-purple-100" },
  rejected: { label: "Rejected", color: "text-red-800", bg: "bg-red-100" }
};

export { CUSTOMIZATION_NAMES as C, DESTINATION_NAMES as D, FABRIC_NAMES as F, PRODUCT_NAMES as P, STATUS_META as S };
