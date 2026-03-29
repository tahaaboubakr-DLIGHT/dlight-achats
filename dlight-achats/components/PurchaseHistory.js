"use client";
import { useState, useRef } from "react";
import ProductAutocomplete from "./ProductAutocomplete";
import CatBadge from "./CatBadge";
import { formatDH } from "@/lib/utils";
import { UNITS } from "@/lib/constants";
export default function PurchaseForm({ products, onAdd, onNewProduct, lastPurchase, undoTimer, onUndo }) {
  const [pn, setPn] = useState("");
  const [cat, setCat] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const prodRef = useRef(null);
  const total = (parseFloat(qty) || 0) * (parseFloat(price) || 0);
  const allCats = [...new Set(products.map(p => p.category))].sort((a, b) => a.localeCompare(b, "fr"));
  const ok = pn.trim() && qty && parseFloat(qty) > 0 && price && parseFloat(price) > 0;
  function handleSelect(p) { setPn(p.name); setCat(p.category); }
  function handleChange(val) { setPn(val); const m = products.find(p => p.name.toLowerCase() === val.trim().toLowerCase()); setCat(m ? m.category : ""); }
  async function handleSubmit() {
    if (!ok || submitting) return;
    setSubmitting(true);
    const c = cat || "Non classé";
    const dateToUse = purchaseDate || new Date().toISOString().slice(0, 10);
    await onAdd({
      product: pn.trim(), category: c, qty: parseFloat(qty),
      unit, priceUnit: parseFloat(price),
      total: Math.round(total * 100) / 100, note: note.trim(),
      purchaseDate: dateToUse,
    });
    if (!products.find(p => p.name.toLowerCase() === pn.trim().toLowerCase())) await onNewProduct({ name: pn.trim(), category: c });
    setPn(""); setCat(""); setQty(""); setPrice(""); setNote(""); setPurchaseDate(""); setSubmitting(false);
    setTimeout(() => { if (prodRef.current) prodRef.current.focus(); }, 100);
  }
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="flex flex-col gap-3">
      {lastPurchase && undoTimer > 0 && (
        <div className="bg-green-50 border border-green-300 rounded-xl px-3 py-2.5 flex justify-between items-center gap-2 animate-fade-in">
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-green-800">Dernier achat enregistré</div>
            <div className="text-[13px] text-green-700 mt-0.5">{lastPurchase.product_name} — {lastPurchase.quantity} {lastPurchase.unit} × {formatDH(lastPurchase.unit_price)} = {formatDH(lastPurchase.total)}</div>
          </div>
          <button onClick={onUndo} className="bg-red-700 text-white rounded-lg px-3 py-2 text-[13px] font-medium whitespace-nowrap active:scale-95 transition">Annuler ({undoTimer}s)</button>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-[17px] font-medium mb-4">Nouvel achat</h2>
        <div className="mb-3.5">
          <label className="text-sm text-gray-500 block mb-1.5">Produit</label>
          <ProductAutocomplete value={pn} onChange={handleChange} onSelect={handleSelect} products={products} inputRef={prodRef} />
        </div>
        <div className="mb-3.5">
          {cat ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Catégorie :</span>
              <CatBadge cat={cat} />
              <button onClick={() => setCat("")} className="text-xs text-gray-400">changer</button>
            </div>
          ) : (
            <div>
              <label className="text-sm text-gray-500 block mb-1.5">Catégorie</label>
              <select value={cat} onChange={e => setCat(e.target.value)} className="w-full h-11 rounded-xl border border-gray-300 px-3 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-dlight/30">
                <option value="">Choisir une catégorie</option>
                {allCats.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Non classé">Non classé</option>
              </select>
            </div>
          )}
        </div>
        <div className="mb-3.5">
          <label className="text-sm text-gray-500 block mb-1.5">
            Date d&apos;achat <span className="text-gray-400">(aujourd&apos;hui par défaut)</span>
          </label>
          <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} max={today}
            className="w-full h-11 px-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-dlight/30" />
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2.5 mb-3.5">
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Quantité</label>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" min="0" step="0.01" inputMode="decimal" className="w-full h-11 px-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-dlight/30" />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Unité</label>
            <select value={unit} onChange={e => setUnit(e.target.value)} className="h-11 rounded-xl border border-gray-300 px-2.5 text-[15px] bg-white focus:outline-none">
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-3.5">
          <label className="text-sm text-gray-500 block mb-1.5">Prix unitaire (DH)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" min="0" step="0.01" inputMode="decimal" className="w-full h-11 px-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-dlight/30" />
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-3.5 flex justify-between items-center">
          <span className="text-sm text-gray-500">Total</span>
          <span className={`text-xl font-medium ${total > 0 ? "text-dlight" : "text-gray-900"}`}>{formatDH(total)}</span>
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1.5">Note (optionnel)</label>
          <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Ex: promotion, qualité..." className="w-full h-11 px-3 rounded-xl border border-gray-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-dlight/30" />
        </div>
        <button onClick={handleSubmit} disabled={!ok || submitting}
          className={`w-full py-3.5 rounded-xl font-medium text-base text-white transition active:scale-[0.98] ${ok && !submitting ? "bg-dlight" : "bg-green-300 cursor-default"}`}>
          {submitting ? "Enregistrement..." : "Enregistrer l'achat"}
        </button>
      </div>
    </div>
  );
}
