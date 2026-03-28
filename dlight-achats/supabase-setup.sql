-- ============================================
-- D-LIGHT ACHATS - Script de création Supabase
-- À exécuter dans Supabase > SQL Editor
-- ============================================

-- 1. Table des utilisateurs autorisés
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('admin', 'buyer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table des produits
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Non classé',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table des achats
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL NOT NULL,
  total DECIMAL NOT NULL,
  note TEXT DEFAULT '',
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Index pour performances
CREATE INDEX idx_purchases_created_at ON purchases(created_at DESC);
CREATE INDEX idx_purchases_buyer_email ON purchases(buyer_email);
CREATE INDEX idx_purchases_category ON purchases(category);
CREATE INDEX idx_products_category ON products(category);

-- 5. Activer Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- 6. Policies : accès public en lecture/écriture (app interne)
-- Pour users
CREATE POLICY "Users visible par tous" ON users FOR SELECT USING (true);
CREATE POLICY "Admin peut insérer users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin peut supprimer users" ON users FOR DELETE USING (true);

-- Pour products
CREATE POLICY "Products visible par tous" ON products FOR SELECT USING (true);
CREATE POLICY "Tout le monde peut ajouter products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin peut supprimer products" ON products FOR DELETE USING (true);

-- Pour purchases
CREATE POLICY "Purchases visible par tous" ON purchases FOR SELECT USING (true);
CREATE POLICY "Tout le monde peut ajouter purchases" ON purchases FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin peut supprimer purchases" ON purchases FOR DELETE USING (true);

-- ============================================
-- 7. Insérer l'admin par défaut
-- ============================================
INSERT INTO users (email, name, role) VALUES
  ('admin@dlight.ma', 'Admin D-Light', 'admin');

-- ============================================
-- 8. Insérer les 61 produits
-- ============================================
INSERT INTO products (name, category) VALUES
  ('Viande hachée poulet', 'Poulet'),
  ('Poulet complet', 'Poulet'),
  ('Viande Hachée Bœuf', 'Bœuf'),
  ('Dinde fumée', 'Viande transformée'),
  ('Carottes', 'Légumes'),
  ('Epinards', 'Légumes'),
  ('Champignons noirs', 'Légumes'),
  ('Champignons frais', 'Légumes'),
  ('Oignons', 'Légumes'),
  ('Citron', 'Légumes'),
  ('Citron Confit', 'Légumes'),
  ('Persil et coriandre', 'Légumes'),
  ('Poivron rouge et jaune', 'Légumes'),
  ('Poirreau', 'Légumes'),
  ('Courgette', 'Légumes'),
  ('Crevettes roses', 'Poisson'),
  ('Crevettes Grises 60/70', 'Poisson'),
  ('Merlan', 'Poisson'),
  ('Sépia', 'Poisson'),
  ('Gingembre frais', 'Produit d''épicerie'),
  ('Poivre noir', 'Produit d''épicerie'),
  ('Soja Epaisse', 'Produit d''épicerie'),
  ('Soja légère', 'Produit d''épicerie'),
  ('Huile de sésame', 'Produit d''épicerie'),
  ('Sweet chili sauce', 'Produit d''épicerie'),
  ('Sauce Tériyaki', 'Produit d''épicerie'),
  ('Sauce huitres', 'Produit d''épicerie'),
  ('Sauce poisson', 'Produit d''épicerie'),
  ('Sel chinois', 'Produit d''épicerie'),
  ('Ail poudre', 'Produit d''épicerie'),
  ('Ail', 'Produit d''épicerie'),
  ('Harissa Poudre', 'Produit d''épicerie'),
  ('Harissa', 'Produit d''épicerie'),
  ('Thym', 'Produit d''épicerie'),
  ('Chapelure', 'Produit d''épicerie'),
  ('Œufs', 'Produit d''épicerie'),
  ('Piment doux', 'Produit d''épicerie'),
  ('Knorr poisson', 'Produit d''épicerie'),
  ('Knorr Poulet', 'Produit d''épicerie'),
  ('Knorr safran', 'Produit d''épicerie'),
  ('Feuille de Laurier', 'Produit d''épicerie'),
  ('Vermicelle', 'Produit d''épicerie'),
  ('Vermicelle 250Gr', 'Produit d''épicerie'),
  ('Curcuma poudre', 'Produit d''épicerie'),
  ('Gingembre poudre', 'Produit d''épicerie'),
  ('Canelle poudre', 'Produit d''épicerie'),
  ('Amandes', 'Produit d''épicerie'),
  ('Sucre semoule', 'Produit d''épicerie'),
  ('Fleur d''orange', 'Produit d''épicerie'),
  ('Beurre animale', 'Produits laitiers'),
  ('Fromage Blanc Jben INDUS', 'Produits laitiers'),
  ('Smen', 'Produits laitiers'),
  ('Huile d''olive', 'Huile'),
  ('Huile de table Tournesol', 'Huile'),
  ('Feuille de brick', 'Pâte'),
  ('Emballage', 'Emballage'),
  ('Carton pâtissier', 'Emballage'),
  ('Etiquettes', 'Emballage'),
  ('Bota Gaz', 'Gaz'),
  ('Diesel', 'Carburant'),
  ('Main d''œuvre', 'Main d''œuvre');
