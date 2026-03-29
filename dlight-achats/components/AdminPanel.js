"use client";
import { useState } from "react";
import { catColor } from "@/lib/constants";
export default function AdminPanel({ users, onAddUser, onRemoveUser, products, onAddProduct, onRemoveProduct }) {
  const [ne, setNe] = useState(""); const [nn, setNn] = useState(""); const [nr, setNr] = useState("buyer"); const [msg, setMsg] = useState("");
  const [npn, setNpn] = useState(""); const [npc, setNpc] = useState(""); const [pm, setPm] = useState("");
  const allCats = [...new Set(products.map(p => p.category))].sort((a, b) => a.localeCompare(b, "fr"));
  async function addU() {
    const e = ne.trim().toLowerCase();
    if (!e || !nn.trim()) { setMsg("Email et nom requis"); return; }
    if (users.find(u => u.email === e)) { setMsg("Email déjà existant"); return; }
    await onAddUser({ email: e, name: nn.trim(), role: nr });
    setNe(""); setNn(""); setMsg("Ajouté"); setTimeout(() => setMsg(""), 2000);
  }
  async function addP() {
    if (!npn.trim()) { setPm("Nom requis"); return; }
    if (products.find(p => p.name.toLowerCase() === npn.trim().toLowerCase())) { setPm("Existe déjà"); return; }
    await onAddProduct({ name: npn.trim(), category: npc || "Non classé" });
    setNpn(""); setNpc(""); setPm("Ajouté"); setTimeout(() => setPm(""), 2000);
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-[17px] font-medium mb-3">Utilisateurs ({users.length})</h2>
        <div className="flex flex-col gap-2 mb-4">
          {users.map(u => (
            <div key={u.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl flex-wrap gap-1">
              <div>
                <div className="font-medium text-sm">{u.name}</div>
                <div className="text-xs text-gray-500">{u.email} <span className={`uppercase text-[11px] ${u.role === "admin" ? "text-blue-600" : "text-gray-400"}`}>{u.role}</span></div>
              </div>
              {u.role !== "admin" && <button onClick={() => onRemoveUser(u.id)} className="text-xs text-red-500">Retirer</button>}
            </div>
          ))}
        </div>
        <h3 className="text-[15px] font-medium mb-2">Ajouter un utilisateur</h3>
        <div className="flex flex-col gap-2">
          <input type="email" value={ne} onChange={e => setNe(e.target.value)} placeholder="email@dlight.ma" className="w-full h-11 px-3 rounded-xl border border-gray-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-dlight/30" />
          <input type="text" value={nn} onChange={e => setNn(e.target.value)} placeholder="Prénom Nom" className="w-full h-11 px-3 rounded-xl border border-gray-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-dlight/30" />
          <div className="flex gap-2">
            <select value={nr} onChange={e => setNr(e.target.value)} className="flex-1 h-11 rounded-xl border border-gray-300 px-3 text-[15px] bg-white">
              <option value="buyer">Acheteur</option><option value="admin">Admin</option>
            </select>
            <button onClick={addU} className="h-11 px-5 bg-dlight text-white rounded-xl font-medium text-[15px] active:scale-95 transition">Ajouter</button>
          </div>
        </div>
        {msg && <div className="text-sm text-green-700 mt-2">{msg}</div>}
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-[17px] font-medium mb-3">Produits ({products.length})</h2>
        <h3 className="text-[15px] font-medium mb-2">Ajouter un produit</h3>
        <div className="flex flex-col gap-2 mb-4">
          <input type="text" value={npn} onChange={e => setNpn(e.target.value)} placeholder="Nom du nouveau produit" className="w-full h-11 px-3 rounded-xl border border-gray-300 text-[15px] focus:outline-none focus:ring-2 focus:ring-dlight/30" />
          <div className="flex gap-2">
            <select value={npc} onChange={e => setNpc(e.target.value)} className="flex-1 h-11 rounded-xl border border-gray-300 px-3 text-sm bg-white">
              <option value="">Catégorie</option>{allCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={addP} className="h-11 px-5 bg-dlight text-white rounded-xl font-medium text-[15px] active:scale-95 transition">Ajouter</button>
          </div>
        </div>
        {pm && <div className="text-sm text-green-700 mb-3">{pm}</div>}
        {allCats.map(cat => {
          const ps = products.filter(p => p.category === cat).sort((a, b) => a.name.localeCompare(b.name, "fr"));
          const cc = catColor(cat);
          return (
            <div key={cat} className="mb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: cc.border }}></span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{cat} ({ps.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ps.map(p => (
                  <span key={p.id} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[13px]" style={{ background: cc.bg, color: cc.text, border: `1px solid ${cc.border}` }}>
                    {p.name}
                    <button onClick={() => onRemoveProduct(p.id)} className="text-[15px] leading-none opacity-60" style={{ color: cc.text }}>×</button>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
