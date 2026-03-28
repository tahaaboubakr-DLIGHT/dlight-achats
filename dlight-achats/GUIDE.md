# GUIDE DE DÉPLOIEMENT — D-Light Achats
## De zéro à une app fonctionnelle sur téléphone

Ce guide est fait pour quelqu'un qui n'a jamais déployé d'application web.
Suivez chaque étape dans l'ordre. Temps estimé : 30 à 45 minutes.

---

## CE DONT VOUS AVEZ BESOIN

- Un ordinateur avec un navigateur web
- Une adresse email (Gmail recommandé)
- C'est tout.

---

## ÉTAPE 1 — Créer un compte GitHub (5 min)

GitHub va stocker le code de votre application.

1. Allez sur https://github.com
2. Cliquez "Sign up"
3. Créez votre compte avec votre email
4. Vérifiez votre email

---

## ÉTAPE 2 — Mettre le code sur GitHub (5 min)

1. Connectez-vous à GitHub
2. Cliquez le bouton "+" en haut à droite → "New repository"
3. Nom : `dlight-achats`
4. Laissez "Public" sélectionné
5. Cliquez "Create repository"
6. Vous verrez une page avec des instructions — gardez cette page ouverte

### Uploader les fichiers :

**Option A — Via l'interface GitHub (plus simple) :**
1. Sur la page du repository, cliquez "uploading an existing file"
2. Glissez-déposez TOUT le contenu du dossier `dlight-achats` téléchargé
3. Cliquez "Commit changes"

**Option B — Si vous avez Git installé :**
```bash
cd dlight-achats
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_NOM/dlight-achats.git
git push -u origin main
```

---

## ÉTAPE 3 — Créer la base de données Supabase (10 min)

Supabase va stocker vos achats, produits et utilisateurs.

1. Allez sur https://supabase.com
2. Cliquez "Start your project" → connectez-vous avec GitHub
3. Cliquez "New project"
4. Remplissez :
   - **Organization** : votre nom ou "D-Light"
   - **Name** : `dlight-achats`
   - **Database Password** : choisissez un mot de passe FORT et notez-le
   - **Region** : choisissez "West EU (Ireland)" (le plus proche du Maroc)
5. Cliquez "Create new project"
6. Attendez 2 minutes que le projet se crée

### Créer les tables :

1. Dans le menu à gauche, cliquez "SQL Editor"
2. Cliquez "New query"
3. Copiez-collez TOUT le contenu du fichier `supabase-setup.sql`
4. Cliquez "Run" (le bouton vert)
5. Vous devriez voir "Success. No rows returned" pour chaque commande

### Récupérer vos clés :

1. Dans le menu à gauche, cliquez "Project Settings" (icône engrenage en bas)
2. Cliquez "API" dans le sous-menu
3. Vous verrez :
   - **Project URL** : quelque chose comme `https://abcdefgh.supabase.co`
   - **anon public key** : une longue chaîne commençant par `eyJ...`
4. **COPIEZ CES DEUX VALEURS** — vous en aurez besoin à l'étape suivante

---

## ÉTAPE 4 — Déployer sur Vercel (10 min)

Vercel va héberger votre application et la rendre accessible par URL.

1. Allez sur https://vercel.com
2. Cliquez "Sign Up" → "Continue with GitHub"
3. Autorisez Vercel à accéder à votre GitHub
4. Cliquez "Add New..." → "Project"
5. Vous verrez votre repository `dlight-achats` — cliquez "Import"
6. **IMPORTANT — Avant de cliquer Deploy :**
   - Ouvrez la section "Environment Variables"
   - Ajoutez ces 2 variables :

   | Name                           | Value                           |
   |--------------------------------|---------------------------------|
   | NEXT_PUBLIC_SUPABASE_URL       | (votre Project URL de l'étape 3) |
   | NEXT_PUBLIC_SUPABASE_ANON_KEY  | (votre anon key de l'étape 3)    |

7. Cliquez "Deploy"
8. Attendez 2-3 minutes que le déploiement se termine
9. Vercel vous donnera une URL comme : `https://dlight-achats.vercel.app`

**VOTRE APPLICATION EST EN LIGNE !**

---

## ÉTAPE 5 — Tester (5 min)

1. Ouvrez l'URL donnée par Vercel dans votre navigateur
2. Connectez-vous avec `admin@dlight.ma`
3. Essayez de saisir un achat
4. Vérifiez que l'achat apparaît dans l'historique
5. Fermez le navigateur, rouvrez l'URL → vos données sont toujours là

---

## ÉTAPE 6 — Installer sur téléphone (2 min)

### Sur iPhone (Safari) :
1. Ouvrez l'URL de l'app dans Safari
2. Appuyez sur le bouton "Partager" (carré avec flèche vers le haut)
3. Faites défiler et appuyez "Sur l'écran d'accueil"
4. Tapez "D-Light" comme nom
5. Appuyez "Ajouter"
6. L'icône D-Light apparaît sur votre écran d'accueil

### Sur Android (Chrome) :
1. Ouvrez l'URL de l'app dans Chrome
2. Appuyez sur les 3 points en haut à droite
3. Appuyez "Ajouter à l'écran d'accueil"
4. Tapez "D-Light" comme nom
5. Appuyez "Ajouter"

---

## ÉTAPE 7 — Ajouter vos acheteurs (2 min)

1. Connectez-vous en tant qu'admin
2. Allez dans l'onglet "Admin"
3. Ajoutez chaque acheteur avec son email et son nom
4. Envoyez-leur l'URL de l'app par WhatsApp
5. Ils se connectent avec leur email et commencent à saisir

---

## ÉTAPE 8 — Nom de domaine personnalisé (optionnel)

Si vous voulez `achats.dlight.ma` au lieu de `dlight-achats.vercel.app` :

1. Dans Vercel, allez dans votre projet → "Settings" → "Domains"
2. Ajoutez `achats.dlight.ma`
3. Vercel vous donnera des enregistrements DNS à ajouter
4. Allez chez votre registrar de domaine (là où vous avez acheté dlight.ma)
5. Ajoutez les enregistrements DNS indiqués par Vercel
6. Attendez 24h maximum pour la propagation

---

## RÉSUMÉ DES COÛTS

| Service    | Coût                                    |
|------------|-----------------------------------------|
| GitHub     | Gratuit                                 |
| Supabase   | Gratuit (jusqu'à 500 Mo de données)     |
| Vercel     | Gratuit (jusqu'à 100 Go de bande passante/mois) |
| Domaine    | ~100-150 DH/an (optionnel)              |
| **TOTAL**  | **0 DH** (sans domaine personnalisé)    |

---

## EN CAS DE PROBLÈME

### "Les données ne se sauvegardent pas"
- Vérifiez que les variables d'environnement sont bien configurées dans Vercel
- Dans Supabase > Table Editor, vérifiez que les tables existent
- Vérifiez les policies RLS dans Supabase > Authentication > Policies

### "Je ne peux pas me connecter"
- Vérifiez que l'email est bien dans la table `users` de Supabase
- L'email doit être en minuscules

### "L'app ne s'affiche pas"
- Vérifiez le déploiement dans Vercel > Deployments
- Cliquez sur le dernier déploiement pour voir les erreurs éventuelles

### "Je veux modifier quelque chose"
- Modifiez les fichiers sur GitHub
- Vercel redéploie automatiquement à chaque modification

---

## STRUCTURE DES FICHIERS

```
dlight-achats/
├── app/
│   ├── globals.css          ← Styles globaux
│   ├── layout.js            ← Layout HTML principal
│   └── page.js              ← Page principale (logique)
├── components/
│   ├── AdminPanel.js        ← Gestion utilisateurs + produits
│   ├── CatBadge.js          ← Badge coloré de catégorie
│   ├── Header.js            ← Barre du haut
│   ├── LoginScreen.js       ← Écran de connexion
│   ├── NavTabs.js           ← Onglets Saisir/Historique/Admin
│   ├── ProductAutocomplete.js ← Champ produit avec suggestions
│   ├── PurchaseForm.js      ← Formulaire de saisie
│   ├── PurchaseHistory.js   ← Liste des achats
│   ├── SaveIndicator.js     ← Indicateur de sauvegarde
│   └── Stats.js             ← Cartes statistiques
├── lib/
│   ├── constants.js         ← Produits, couleurs, unités
│   ├── supabase.js          ← Connexion à Supabase
│   └── utils.js             ← Formatage, export CSV
├── public/
│   └── manifest.json        ← Configuration PWA (installation mobile)
├── supabase-setup.sql       ← Script SQL à exécuter dans Supabase
├── .env.local.example       ← Modèle pour les variables d'environnement
├── package.json             ← Dépendances du projet
├── next.config.js           ← Configuration Next.js
├── tailwind.config.js       ← Configuration Tailwind CSS
├── postcss.config.js        ← Configuration PostCSS
├── jsconfig.json            ← Alias d'import
└── GUIDE.md                 ← Ce fichier
```
