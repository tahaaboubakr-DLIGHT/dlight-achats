export const CAT_COLORS = {
  "Poulet": { bg: "#FFF3E0", text: "#E65100", border: "#FFB74D" },
  "Bœuf": { bg: "#FFEBEE", text: "#B71C1C", border: "#EF9A9A" },
  "Viande transformée": { bg: "#FCE4EC", text: "#880E4F", border: "#F48FB1" },
  "Légumes": { bg: "#E8F5E9", text: "#1B5E20", border: "#81C784" },
  "Poisson": { bg: "#E3F2FD", text: "#0D47A1", border: "#64B5F6" },
  "Produit d'épicerie": { bg: "#FFF8E1", text: "#F57F17", border: "#FFD54F" },
  "Produits laitiers": { bg: "#F3E5F5", text: "#6A1B9A", border: "#CE93D8" },
  "Huile": { bg: "#FFFDE7", text: "#827717", border: "#DCE775" },
  "Pâte": { bg: "#FBE9E7", text: "#BF360C", border: "#FFAB91" },
  "Emballage": { bg: "#ECEFF1", text: "#37474F", border: "#90A4AE" },
  "Gaz": { bg: "#E0F7FA", text: "#006064", border: "#4DD0E1" },
  "Carburant": { bg: "#EFEBE9", text: "#4E342E", border: "#A1887F" },
  "Main d'œuvre": { bg: "#EDE7F6", text: "#4527A0", border: "#9575CD" },
  "Non classé": { bg: "#F5F5F5", text: "#616161", border: "#BDBDBD" },
};
export function catColor(cat) { return CAT_COLORS[cat] || CAT_COLORS["Non classé"]; }
export const UNITS = ["kg","g","L","unité","pack","carton","pièce","bouteille","sac","boîte","bidon","plateau"];
