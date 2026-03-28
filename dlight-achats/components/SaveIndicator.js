"use client";

export default function SaveIndicator({ status }) {
  if (!status) return null;
  const ok = status === "ok";
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-medium z-[100] animate-fade-in ${
      ok ? "bg-green-50 text-green-800 border border-green-300" : "bg-red-50 text-red-800 border border-red-300"
    }`}>
      {ok ? "Sauvegardé" : "Erreur de sauvegarde"}
    </div>
  );
}
