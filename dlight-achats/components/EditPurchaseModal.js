"use client";
import { useState, useRef } from "react";
import ProductAutocomplete from "./ProductAutocomplete";
import CatBadge from "./CatBadge";
import { formatDH } from "@/lib/utils";

export default function EditPurchaseModal({ purchase, products, categories, units, onSave, onCancel }) {
  const unitNames = units.map(u => u.name);
  const [pn, setPn] = useState(purchase.product_name);
  const [cat, setCat] = useState(purchase.category);
  const [qty, setQty] = useState(String(purchase.quantity));
  const [unit, setUnit] = useState(purchase.unit);
  const [price, setPrice] = useState(String(purchase.unit_price));
  const [note, setNote] = useState(purchase.note || "");
  const [purchaseDate, setPurchaseDate] = useState(purchase.purchase_date || "");
  const [saving, setSaving] = useState(false);
  const prodRef = useRef(null);
  const total = (parseFloat(qty) || 0) * (parseFloat(price) || 0);
  const catNames = categories.map(c => c.name).sort((a, b) => a.localeCompare(b, "fr"));
  const ok = pn.trim() && qty && parseFloat(qty) > 0 && price && parseFloat(price) > 0;
  const today = new Date().toISOString().slice(0, 10);

  function handleSelect(p) { setPn(p.name); setCat(p.category); }
  function handleChange(val) {
    setPn(val);
    const m = products.find(p => p.name.toLowerCase() === val.trim().toLowerCase());
    setCat(m ? m.category : "");
  }

  async function handleSave() {
    if (!ok || saving) return;
    setSaving(true);
    await onSave({
      id: purchase.id,
      product_name: pn.trim(),
      category: cat || "Non classe",
      quantity: parseFloat(qty),
      unit,
      unit_price: parseFloat(price),
      total: Math.round(total * 100) / 100,
      note: note.trim(),
      purchase_date: purchaseDate || today,
    });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl p-5 max-w-[420px] w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-[17px] font-medium mb-4">Modifier l'achat</h3>
        <div className="mb-3">
          <label className="text-sm text-gray-500 block mb-1.5">Produit</label>
          <ProductAutocomplete value={pn} onChange={handleChange} onSelect={handleSelect} products={products} inputRef={prodRef} />
        </div>
        <div className="mb-3">
          {cat ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Categorie :</span>
              <CatBadge cat={cat} />
              <button onClick={() => setCat("")} className="text-xs text-gray-400">changer</button>
            </div>
          ) : (
            <div>
              <label className="text-sm text-gray-500 block mb-1.5">Categorie</label>
              <select value={cat} onChange={e => setCat(e.target.value)} className="w-full h-11 rounded-xl border border-gray-300 px-3 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-dlight/30">
                <option value="">Choisir une categorie</option>
                {catNames.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="mb-3">
          <label className="text-sm text-gray-500 block mb-1.5">Date d'achat</label>
          <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} max={today}
            className="w-full h-11 px-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-dlight/30" />
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2.5 mb-3">
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Quantite</label>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" min="0" step="0.01" inputMode="decimal"
              className="w-full h-11 px-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-dlight/30" />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Unite</label>
            <select value={unit} onChange={e => setUnit(e.target.value)} className="h-11 rounded-xl border border-gray-300 px-2.5 text-[15px] bg-white focus:outline-none">
              {unitNames.includes(unit) ? null : <option value={unit}>{unit}</option>}
              {unitNames.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="text-sm text-gray-500 block mb-1.5">Prix unitaire (DH)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" min="0" step="0.01" inputMode="decimal"
            className="w-full h-11 px-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-dlight/30" />
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">Total</span>
          <span className={`text-xl font-medium ${total > 0 ? "text-dlight" : "text-gray-900"}`}>{formatDH(total)}</span>
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1.5">Note (optionnel)</label>
          <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Ex: promotion, qualite..."
            className="w-full h-11 px-3 rounded-xl border border-gray-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-dlight/30" />
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 active:scale-95 transition">Annuler</button>
          <button onClick={handleSave} disabled={!ok || saving}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white active:scale-95 transition ${ok && !saving ? "bg-dlight" : "bg-green-300 cursor-default"}`}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
