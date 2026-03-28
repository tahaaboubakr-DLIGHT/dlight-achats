"use client";
import { formatDH } from "@/lib/utils";

export default function Stats({ todayCount, todayTotal, allTotal }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-3">
      <div className="bg-gray-100 rounded-xl p-2.5 border-l-[3px] border-l-blue-400">
        <div className="text-[11px] text-gray-500">Aujourd'hui</div>
        <div className="text-lg font-medium mt-0.5">{todayCount}</div>
      </div>
      <div className="bg-gray-100 rounded-xl p-2.5 border-l-[3px] border-l-dlight">
        <div className="text-[11px] text-gray-500">Total jour</div>
        <div className="text-lg font-medium text-dlight mt-0.5">{formatDH(todayTotal)}</div>
      </div>
      <div className="bg-gray-100 rounded-xl p-2.5 border-l-[3px] border-l-purple-400">
        <div className="text-[11px] text-gray-500">Total</div>
        <div className="text-lg font-medium mt-0.5">{formatDH(allTotal)}</div>
      </div>
    </div>
  );
}
