"use client";
import { useState } from "react";
import CatBadge from "./CatBadge";
import { formatDate, formatDH } from "@/lib/utils";

export default function PurchaseHistory({ purchases, currentUser, onDelete }) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");

  const buyers = [...new Set(purchases.map(p => p.buyer_name))].sort();
  const cats = [...new Set(purchases.map(p => p.category))].sort((a, b) => a.localeCompare(b, "fr"));

  const filtered = purchases.filter(p => {
    if (search && !p.product_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFilter && !p.created_at.startsWith(dateFilter)) return false;
    if (buyerFilter && p.buyer_name !== buyerFilter) return false;
    if (catFilter && p.category !== catFilter) return false;
    return true;
  });

  const totalF = filtered.reduce((s, p) => s + Number(p.total), 0);
  const hasFilters = search || dateFilter || catFilter || buyerFilter;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-3 flex-wrap gap-2">
        <h2 className="text-[17px] font-medium">Historique ({filtered.length})</h2>
        <span className="text-[17px] font-medium text-dlight">{formatDH(totalF)}</span>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full h-11 px-3 rounded-xl border border-gray-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-dlight/30" />
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="w-full h-10 px-2 rounded-xl border border-gray-300 text-sm focus:outline-none" />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="h-10 rounded-xl border border-gray-300 px-2 text-sm bg-white">
            <option value="">Toutes catégories</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {buyers.length > 1 && (
          <select value={buyerFilter} onChange={e => setBuyerFilter(e.target.value)}
            className="h-10 rounded-xl border border-gray-300 px-2 text-sm bg-white">
            <option value="">Tous les acheteurs</option>
            {buyers.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        )}
      </div>

      {hasFilters && (
        <button onClick={() => { setSearch(""); setDateFilter(""); setCatFilter(""); setBuyerFilter(""); }}
          className="mb-3 text-sm text-blue-600">Effacer les filtres</button>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-[15px]">Aucun achat trouvé</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.slice(0, 50).map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-[15px]">{p.product_name}</span>
                    <CatBadge cat={p.category} />
                  </div>
                  <div className="text-[13px] text-gray-500 leading-relaxed">
                    {p.quantity} {p.unit} × {formatDH(p.unit_price)}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {p.buyer_name} — {formatDate(p.created_at)}
                  </div>
                  {p.note && <div className="text-xs text-gray-400 mt-1 italic">{p.note}</div>}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-medium text-[16px] text-dlight">{formatDH(p.total)}</span>
                  {currentUser.role === "admin" && (
                    <button onClick={() => onDelete(p.id)} className="text-xs text-gray-400">supprimer</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length > 50 && (
            <div className="text-center text-sm text-gray-400 py-3">50 affichés sur {filtered.length}</div>
          )}
        </div>
      )}
    </div>
  );
}
