export function formatDate(d) {
  return new Date(d).toLocaleDateString("fr-MA", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export function formatDH(n) {
  return Number(n).toLocaleString("fr-MA", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }) + " DH";
}

export function exportCSV(purchases) {
  const BOM = "\uFEFF";
  const header = ["Date","Produit","Catégorie","Quantité","Unité","Prix Unitaire (DH)","Total (DH)","Acheteur","Note"];
  const rows = purchases
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(p => [
      formatDate(p.created_at), p.product_name, p.category,
      p.quantity, p.unit, Number(p.unit_price).toFixed(2),
      Number(p.total).toFixed(2), p.buyer_name, p.note || "",
    ]);
  const totalRow = ["","","","","","TOTAL",
    purchases.reduce((s, p) => s + Number(p.total), 0).toFixed(2), "", ""];
  const csv = [header, ...rows, [], totalRow]
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `achats_dlight_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}
