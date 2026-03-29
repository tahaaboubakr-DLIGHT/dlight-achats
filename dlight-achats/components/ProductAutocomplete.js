"use client";
import { useState, useEffect, useRef } from "react";
import { catColor } from "@/lib/constants";
export default function ProductAutocomplete({ value, onChange, onSelect, products, inputRef }) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [hl, setHl] = useState(-1);
  const wrapRef = useRef(null);
  useEffect(() => {
    if (value.length >= 2) {
      const l = value.toLowerCase();
      const m = products.filter(p => p.name.toLowerCase().includes(l)).slice(0, 8);
      setFiltered(m); setOpen(m.length > 0); setHl(-1);
    } else setOpen(false);
  }, [value, products]);
  useEffect(() => {
    const h = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  function onKey(e) {
    if (!open || !filtered.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHl(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHl(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && hl >= 0) { e.preventDefault(); onSelect(filtered[hl]); setOpen(false); }
  }
  return (
    <div ref={wrapRef} className="relative">
      <input ref={inputRef} type="text" value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => { if (value.length >= 2 && filtered.length) setOpen(true); }} onKeyDown={onKey}
        placeholder="Tapez le nom du produit..." className="w-full h-11 px-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-dlight/30 focus:border-dlight" />
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[200] bg-white border border-gray-300 rounded-xl max-h-[260px] overflow-y-auto shadow-lg">
          {filtered.map((p, i) => {
            const cc = catColor(p.category);
            return (
              <div key={p.id || p.name} onClick={() => { onSelect(p); setOpen(false); }} onMouseEnter={() => setHl(i)}
                className={`px-3 py-3 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-0 ${i === hl ? "bg-gray-50" : "bg-white"}`}>
                <span className="text-[15px] text-gray-900">{p.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: cc.bg, color: cc.text }}>{p.category}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
