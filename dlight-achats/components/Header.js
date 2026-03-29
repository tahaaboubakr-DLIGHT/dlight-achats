"use client";
export default function Header({ user, onLogout }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2.5 sticky top-0 z-50">
      <div className="max-w-[600px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-dlight flex items-center justify-center text-white text-sm font-medium">D</div>
          <span className="font-medium text-gray-900">Achats</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{user.name}</span>
          <button onClick={onLogout} className="text-xs text-gray-400 underline">Quitter</button>
        </div>
      </div>
    </div>
  );
}
