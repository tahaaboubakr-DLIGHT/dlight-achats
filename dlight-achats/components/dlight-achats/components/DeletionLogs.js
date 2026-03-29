"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import CatBadge from "./CatBadge";
import { formatDate, formatDH } from "@/lib/utils";

export default function DeletionLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }
    const { data } = await sb.from("deletion_logs").select("*").order("deleted_at", { ascending: false }).limit(100);
    if (data) setLogs(data);
    setLoading(false);
  }

  const totalSupprime = logs.reduce((s, l) => s + Number(l.total), 0);

  if (loading) return <div className="text-center py-10 text-gray-400 text-sm">Chargement...</div>;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-3 flex-wrap gap-2">
        <h2 className="text-[17px] font-medium">Suppressions ({logs.length})</h2>
        <span className="text-[17px] font-medium text-red-500">{formatDH(totalSupprime)}</span>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-[15px]">Aucune suppression enregistrée</div>
      ) : (
        <div className="flex flex-col gap-2">
          {logs.map(l => (
            <div key={l.id} className="bg-white rounded-xl border border-gray-200 p-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-[15px] text-gray-900">{l.product_name}</span>
                    <CatBadge cat={l.category} />
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      l.reason === "doublon"
                        ? "bg-amber-50 text-amber-700 border border-amber-300"
                        : "bg-red-50 text-red-700 border border-red-300"
                    }`}>
                      {l.reason === "doublon" ? "Doublon" : "Erreur"}
                    </span>
                  </div>
                  <div className="text-[13px] text-gray-500">{l.quantity} {l.unit} × {formatDH(l.unit_price)}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Achat par <span className="font-medium text-gray-500">{l.buyer_name}</span>
                    {l.purchase_date && <span> — le {formatDate(l.purchase_date)}</span>}
                  </div>
                  <div className="text-xs text-red-400 mt-0.5">
                    Supprimé par <span className="font-medium text-red-500">{l.deleted_by_name}</span> — {formatDate(l.deleted_at)}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="font-medium text-[16px] text-red-500 line-through">{formatDH(l.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
