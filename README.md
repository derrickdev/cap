# Cap — Suivi de budget (PWA)

Application de suivi des entrées/sorties, objectifs financiers et rappels, basée fidèlement sur le design `Cap.dc.html`.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + CSS variables (système de thèmes light/dark du design)
- **Zustand** pour l'état global, persisté en **IndexedDB** (Dexie.js)
- **@ducanh2912/next-pwa** : Service Worker + cache offline
- **lucide-react** pour les icônes
- Police **Satoshi** (Fontshare)

## Démarrer

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000

## Build de production

```bash
npm run build
npm start
```

## Structure

```
app/
  layout.tsx        Métadonnées + PWA
  page.tsx          Shell (cadre téléphone, routing par écran)
  globals.css       Satoshi + classes du design
components/
  NotificationManager.tsx  Vérifie le rappel quotidien (app ouverte)
  Icon.tsx          Wrapper lucide-react
  StatusBar.tsx     Barre de statut iOS
  BottomNav.tsx     Navigation + FAB
  BottomSheet.tsx   Saisie opération / allocation (clavier numérique)
  RingProgress.tsx  Anneaux conic-gradient
  Toast.tsx         Notifications in-app
  screens/
    HomeScreen, OpsScreen, GoalsScreen,
    GoalDetailScreen, RemindersScreen, ProfileScreen
lib/
  themes.ts         Tokens light/dark (copiés du design)
  categories.ts     Catégories + icônes
  seed.ts           Données de démonstration + types
  selectors.ts      Calculs dérivés (totaux, feed, stats, projection)
  format.ts         Formatage des montants
  db.ts             Dexie (IndexedDB) : schéma, seed, migration, write-through
  notify.ts         Permission + notifs locales (rappel 20h, alertes objectifs)
  currency.ts       Multi-devises : taux, conversion, formatage (base FCFA)
  pdf.ts            Export rapport PDF (jsPDF, import dynamique)
store/
  useStore.ts       État global + logique (saisie, allocation, streak)
public/
  manifest.json     Manifest PWA
  icon-192.png / icon-512.png  (placeholder — à remplacer)
```

## Ce qui est fait (Phase 1)

- 6 écrans fidèles au design + bottom sheet + toast
- Thème clair / sombre complet
- Saisie d'opérations (entrée/sortie, catégories, clavier)
- Allocation de fonds aux objectifs
- Streak de saisie quotidienne
- Statistiques (donut par catégorie, insight)

## Ce qui est fait (Phase 2)

- Persistance **IndexedDB** via Dexie.js (`lib/db.ts`), offline robuste
- Tables `transactions` / `goals` + table clé/valeur `meta` (theme, balance, streak, reminders)
- Write-through : chaque mutation du store écrit en base
- Hydratation au montage (`hydrate()` dans le store, appelé par `page.tsx`)
- Migration automatique de l'ancien `localStorage` (`cap-store-v1`) vers IndexedDB

## Ce qui est fait (Phase 3)

- **PWA installable** + Service Worker (`@ducanh2912/next-pwa`), cache offline
- Notifications locales (`lib/notify.ts`) :
  - rappel quotidien à 20h si rien saisi (vérifié pendant que l'app tourne)
  - alerte objectif au franchissement d'un palier (75% / 100%)
- Demande de permission au moment d'activer un rappel
- SW désactivé en dev (`disable` si `NODE_ENV=development`)

> **Limite** : sans backend, pas de push serveur (notif quand l'app est fermée).
> Le rappel 20h n'est déclenché que pendant que l'app est ouverte. La vraie push
> (Web Push + VAPID) arrivera avec le backend (Phase 5 Supabase).

## Ce qui est fait (Phase 4)

- **Multi-devises** FCFA / EUR / USD (`lib/currency.ts`)
  - stockage toujours en **FCFA** (devise de base), affichage + saisie convertis
  - sélecteur de devise dans Profil, persisté en base
- **Export PDF** du rapport (`lib/pdf.ts`, jsPDF chargé dynamiquement)
  - synthèse (solde, entrées/sorties/net, série), objectifs, opérations
  - bouton « Export rapport PDF » dans Profil → télécharge `cap-rapport.pdf`

## Prochaines étapes

- **Phase 5** : synchro cloud (Supabase)

> Les icônes `public/icon-*.png` sont des placeholders générés. Remplace-les par les vraies icônes de l'app avant publication.
