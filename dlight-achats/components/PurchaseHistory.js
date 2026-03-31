"use client";
import { useState } from "react";
import CatBadge from "./CatBadge";
import EditPurchaseModal from "./EditPurchaseModal";
import { formatDate, formatDH } from "@/lib/utils";

function DeleteModal({ purchase, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl p-5 max-w-[360px] w-full shadow-xl">
        <h3 className="text-[16px] font-medium mb-1">Supprimer cet achat ?</h3>
        <div className="text-sm text-gray-500 mb-4">{purchase.product_name} - {formatDH(purchase.total)}</div>
        <label className="text-sm text-gray-500 block mb-2">Motif de suppression (obligatoire)</label>
        <div className="flex flex-col gap-2 mb-4">
          <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${reason === "doublon" ? "border-dlight bg-green-50" : "border-gray-200"}`}>
            <input type="radio" name="reason" value="doublon" checked={reason === "doublon"} onChange={() => setReason("doublon")} className="w-4 h-4" style={{ accentColor: "#0F6E56" }} />
            <div><div className="text-sm font-medium text-gray-900">Doublon</div><div className="text-xs text-gray-500">Cet achat a ete saisi deux fois</div></div>
          </label>
          <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${reason === "erreur" ? "border-dlight bg-green-50" : "border-gray-200"}`}>
            <input type="radio" name="reason" value="erreur" checked={reason === "erreur"} onChange={() => setReason("erreur")} className="w-4 h-4" style={{ accentColor: "#0F6E56" }} />
            <div><div className="text-sm font-medium text-gray-900">Erreur de saisie</div><div className="text-xs text-gray-500">Mauvais produit, quantite ou prix</div></div>
          </label>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 active:scale-95 transition">Annuler</button>
          <button onClick={() => reason && onConfirm(reason)} disabled={!reason} className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white active:scale-95 transition ${reason ? "bg-red-600" : "bg-gray-300 cursor-default"}`}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseHistory({ purchases, currentUser, onDelete, onEdit, products, categories }) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const buyers = [...new Set(purchases.map(p => p.buyer_name))].sort();
  const cats = [...new Set(purchases.map(p => p.category))].sort((a, b) => a.localeCompare(b, "fr"));

  const filtered = purchases.filter(p => {
    if (search && !p.product_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFilter) { const d = p.purchase_date || (p.created_at ? p.created_at.slice(0, 10) : ""); if (!d.startsWith(dateFilter)) return false; }
    if (buyerFilter && p.buyer_name !== buyerFilter) return false;
    if (catFilter && p.category !== catFilter) return false;
    return true;
  });
  const totalF = filtered.reduce((s, p) => s + Number(p.total), 0);
  const hasFilters = search || dateFilter || catFilter || buyerFilter;

  async function handleSaveEdit(updated) { await onEdit(updated); setEditTarget(null); }

  return (
    <div>
      {deleteTarget && <DeleteModal purchase={deleteTarget} onConfirm={(reason) => { onDelete(deleteTarget.id, reason, deleteTarget); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />}
      {editTarget && <EditPurchaseModal purchase={editTarget} products={products} categories={categories || []} onSave={handleSaveEdit} onCancel={() => setEditTarget(null)} />}

      <div className="flex justify-between items-baseline mb-3 flex-wrap gap-2">
        <h2 className="text-[17px] font-medium">Historique ({filtered.length})</h2>
        <span className="text-[17px] font-medium text-dlight">{formatDH(totalF)}</span>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..." className="w-full h-11 px-3 rounded-xl border border-gray-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-dlight/30" />
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full h-10 px-2 rounded-xl border border-gray-300 text-sm focus:outline-none" />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="h-10 rounded-xl border border-gray-300 px-2 text-sm bg-white">
            <option value="">Toutes categories</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {buyers.length > 1 && (
          <select value={buyerFilter} onChange={e => setBuyerFilter(e.target.value)} className="h-10 rounded-xl border border-gray-300 px-2 text-sm bg-white">
            <option value="">Tous les acheteurs</option>
            {buyers.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        )}
      </div>
      {hasFilters && <button onClick={() => { setSearch(""); setDateFilter(""); setCatFilter(""); setBuyerFilter(""); }} className="mb-3 text-sm text-blue-600">Effacer les filtres</button>}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-[15px]">Aucun achat trouve</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.slice(0, 50).map(p => {
            const displayDate = p.purchase_date || (p.created_at ? p.created_at.slice(0, 10) : "");
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-[15px]">{p.product_name}</span>
                      <CatBadge cat={p.category} />
                    </div>
                    <div className="text-[13px] text-gray-500 leading-relaxed">{p.quantity} {p.unit} x {formatDH(p.unit_price)}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{p.buyer_name} - {formatDate(displayDate)}</div>
                    {p.note && <div className="text-xs text-gray-400 mt-1 italic">{p.note}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="font-medium text-[16px] text-dlight">{formatDH(p.total)}</span>
                    {currentUser.role === "admin" && (
                      <div className="flex gap-2">
                        <button onClick={() => setEditTarget(p)} className="text-xs text-blue-500">modifier</button>
                        <button onClick={() => setDeleteTarget(p)} className="text-xs text-red-400">supprimer</button>
                      </div>
                    )}
                    {currentUser.role !== "admin" && (
                      <button onClick={() => setDeleteTarget(p)} className="text-xs text-red-400">supprimer</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length > 50 && <div className="text-center text-sm text-gray-400 py-3">50 affiches sur {filtered.length}</div>}
        </div>
      )}
    </div>
  );
}
