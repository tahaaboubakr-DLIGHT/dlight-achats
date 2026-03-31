"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import LoginScreen from "@/components/LoginScreen";
import Header from "@/components/Header";
import Stats from "@/components/Stats";
import NavTabs from "@/components/NavTabs";
import PurchaseForm from "@/components/PurchaseForm";
import PurchaseHistory from "@/components/PurchaseHistory";
import AdminPanel from "@/components/AdminPanel";
import DeletionLogs from "@/components/DeletionLogs";
import SaveIndicator from "@/components/SaveIndicator";
import { exportCSV } from "@/lib/utils";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState("form");
  const [saveStatus, setSaveStatus] = useState(null);
  const [lastPurchase, setLastPurchase] = useState(null);
  const [undoTimer, setUndoTimer] = useState(0);
  const undoRef = useRef(null);

  useEffect(() => {
    try { const s = localStorage.getItem("dlight-user"); if (s) setCurrentUser(JSON.parse(s)); } catch {}
    loadData();
  }, []);

  async function loadData() {
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }
    try {
      const [{ data: u }, { data: p }, { data: pu }, { data: c }] = await Promise.all([
        sb.from("users").select("*").order("name"),
        sb.from("products").select("*").order("name"),
        sb.from("purchases").select("*").order("created_at", { ascending: false }).limit(200),
        sb.from("categories").select("*").order("name"),
      ]);
      if (u) setUsers(u); if (p) setProducts(p); if (pu) setPurchases(pu); if (c) setCategories(c);
    } catch (err) { console.error("Load error:", err); }
    setLoading(false);
  }

  const flash = useCallback((ok) => { setSaveStatus(ok ? "ok" : "err"); setTimeout(() => setSaveStatus(null), 2000); }, []);
  function handleLogin(user) { setCurrentUser(user); localStorage.setItem("dlight-user", JSON.stringify(user)); }
  function handleLogout() { setCurrentUser(null); localStorage.removeItem("dlight-user"); }

  async function addPurchase(fd) {
    const sb = getSupabase(); if (!sb) return;
    const row = { product_name: fd.product, category: fd.category, quantity: fd.qty, unit: fd.unit, unit_price: fd.priceUnit, total: fd.total, note: fd.note, buyer_name: currentUser.name, buyer_email: currentUser.email, purchase_date: fd.purchaseDate };
    const { data, error } = await sb.from("purchases").insert([row]).select().single();
    if (error) { flash(false); return; }
    setPurchases(prev => [data, ...prev]); flash(true); startUndo(data);
  }
  async function editPurchase(updated) {
    const sb = getSupabase(); if (!sb) return;
    const { id, ...fields } = updated;
    const { data, error } = await sb.from("purchases").update(fields).eq("id", id).select().single();
    if (error) { flash(false); return; }
    setPurchases(prev => prev.map(p => p.id === id ? data : p)); flash(true);
  }
  async function deletePurchase(id, reason, purchase) {
    const sb = getSupabase(); if (!sb) return;
    await sb.from("deletion_logs").insert([{ purchase_id: id, product_name: purchase.product_name, category: purchase.category, quantity: purchase.quantity, unit: purchase.unit, unit_price: purchase.unit_price, total: purchase.total, purchase_date: purchase.purchase_date, buyer_name: purchase.buyer_name, buyer_email: purchase.buyer_email, deleted_by_name: currentUser.name, deleted_by_email: currentUser.email, reason }]);
    const { error } = await sb.from("purchases").delete().eq("id", id);
    if (error) { flash(false); return; }
    setPurchases(prev => prev.filter(p => p.id !== id)); flash(true);
  }
  function startUndo(p) {
    setLastPurchase(p); setUndoTimer(10);
    if (undoRef.current) clearInterval(undoRef.current);
    undoRef.current = setInterval(() => { setUndoTimer(t => { if (t <= 1) { clearInterval(undoRef.current); setLastPurchase(null); return 0; } return t - 1; }); }, 1000);
  }
  async function handleUndo() {
    if (!lastPurchase) return;
    if (undoRef.current) clearInterval(undoRef.current);
    await deletePurchase(lastPurchase.id, "erreur", lastPurchase); setLastPurchase(null); setUndoTimer(0);
  }
  async function addProduct(prod) {
    const sb = getSupabase(); if (!sb) return;
    if (products.find(p => p.name.toLowerCase() === prod.name.toLowerCase())) return;
    const { data, error } = await sb.from("products").insert([prod]).select().single();
    if (error) return;
    setProducts(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name, "fr")));
  }
  async function removeProduct(id) {
    const sb = getSupabase(); if (!sb) return;
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) { flash(false); return; }
    setProducts(prev => prev.filter(p => p.id !== id)); flash(true);
  }
  async function addUser(user) {
    const sb = getSupabase(); if (!sb) return;
    const { data, error } = await sb.from("users").insert([user]).select().single();
    if (error) { flash(false); return; }
    setUsers(prev => [...prev, data]); flash(true);
  }
  async function removeUser(id) {
    const sb = getSupabase(); if (!sb) return;
    const { error } = await sb.from("users").delete().eq("id", id);
    if (error) { flash(false); return; }
    setUsers(prev => prev.filter(u => u.id !== id)); flash(true);
  }
  async function addCategory(cat) {
    const sb = getSupabase(); if (!sb) return;
    if (categories.find(c => c.name.toLowerCase() === cat.name.toLowerCase())) return;
    const { data, error } = await sb.from("categories").insert([cat]).select().single();
    if (error) { flash(false); return; }
    setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name, "fr"))); flash(true);
  }
  async function removeCategory(id) {
    const sb = getSupabase(); if (!sb) return;
    const { error } = await sb.from("categories").delete().eq("id", id);
    if (error) { flash(false); return; }
    setCategories(prev => prev.filter(c => c.id !== id)); flash(true);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-dlight flex items-center justify-center mx-auto mb-3 text-white font-medium text-xl">D</div>
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    </div>
  );
  if (!currentUser) return <LoginScreen users={users} onLogin={handleLogin} />;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayP = purchases.filter(p => { const d = p.purchase_date || (p.created_at ? p.created_at.slice(0, 10) : ""); return d === todayStr; });
  const todayTotal = todayP.reduce((s, p) => s + Number(p.total), 0);
  const allTotal = purchases.reduce((s, p) => s + Number(p.total), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header user={currentUser} onLogout={handleLogout} />
      <div className="max-w-[600px] mx-auto px-4 pt-3">
        <Stats todayCount={todayP.length} todayTotal={todayTotal} allTotal={allTotal} />
        <NavTabs view={view} setView={setView} isAdmin={currentUser.role === "admin"} />
        {view === "history" && purchases.length > 0 && (
          <div className="mb-3 text-right">
            <button onClick={() => exportCSV(purchases)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 active:scale-95 transition">Exporter Excel</button>
          </div>
        )}
        {view === "form" && <PurchaseForm products={products} categories={categories} onAdd={addPurchase} onNewProduct={addProduct} lastPurchase={lastPurchase} undoTimer={undoTimer} onUndo={handleUndo} />}
        {view === "history" && <PurchaseHistory purchases={purchases} currentUser={currentUser} onDelete={deletePurchase} onEdit={editPurchase} products={products} categories={categories} />}
        {view === "admin" && currentUser.role === "admin" && <AdminPanel users={users} onAddUser={addUser} onRemoveUser={removeUser} products={products} onAddProduct={addProduct} onRemoveProduct={removeProduct} categories={categories} onAddCategory={addCategory} onRemoveCategory={removeCategory} />}
        {view === "deletions" && currentUser.role === "admin" && <DeletionLogs />}
      </div>
      <SaveIndicator status={saveStatus} />
    </div>
  );
}
