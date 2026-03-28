"use client";
import { useState } from "react";

export default function LoginScreen({ users, onLogin }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    const t = email.trim().toLowerCase();
    if (!t) { setErr("Veuillez saisir votre email"); return; }
    const u = users.find(u => u.email === t);
    if (!u) { setErr("Email non autorisé. Contactez l'administrateur."); return; }
    onLogin(u);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-[400px] w-full shadow-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-dlight flex items-center justify-center mx-auto mb-3 text-white font-medium text-2xl">D</div>
          <h1 className="text-xl font-medium text-gray-900">D-Light Achats</h1>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous pour saisir vos achats</p>
        </div>

        <label className="text-sm text-gray-500 block mb-1.5">Adresse email</label>
        <input
          type="email" value={email}
          onChange={e => { setEmail(e.target.value); setErr(""); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="prenom@dlight.ma"
          className="w-full h-11 px-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-dlight/30 focus:border-dlight"
          autoFocus
        />

        {err && (
          <div className="mt-2 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{err}</div>
        )}

        <button onClick={submit}
          className="w-full mt-4 bg-dlight text-white rounded-xl py-3 font-medium text-base active:scale-[0.98] transition">
          Se connecter
        </button>
      </div>
    </div>
  );
}
