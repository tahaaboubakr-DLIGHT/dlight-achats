"use client";
import { catColor } from "@/lib/constants";
export default function CatBadge({ cat }) {
  const c = catColor(cat);
  return <span className="text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap inline-block leading-[18px]" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>{cat}</span>;
}
