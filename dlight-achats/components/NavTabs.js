"use client";
export default function NavTabs({ view, setView, isAdmin }) {
  const tabs = [
    { id: "form", label: "Saisir" },
    { id: "history", label: "Historique" },
    ...(isAdmin ? [
      { id: "deletions", label: "Supprimés" },
      { id: "admin", label: "Admin" },
    ] : []),
  ];
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 mb-3">
      {tabs.map(t => (
        <button key={t.id} onClick={() => setView(t.id)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${view === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{t.label}</button>
      ))}
    </div>
  );
}
