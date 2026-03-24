# Hasfy Docs - Instructions Copilot

## Vue d'ensemble du projet

Hasfy Docs est le site de documentation unifié pour le SaaS Hasfy, comprenant :
- **Documentation publique** : guide utilisateur Hasfy, accessible sans authentification, propulsée par Nextra 4
- **Documentation privée** : documentation technique interne organisée par projet, avec authentification Supabase
- **Dashboard admin** : gestion des profils, utilisateurs et documentation

## Organisation du contenu

### Documentation publique (sans auth)
Contenu exclusivement orienté **utilisateur final** : comment utiliser l'application Hasfy, ses fonctionnalités, la configuration, les intégrations, la sécurité.

### Documentation privée (auth requise)
Contenu **technique interne** organisé par dépôt :
- **hasfy-app/** — Architecture API, schéma BDD, frontend, CI/CD, sécurité
- **hasfy-agent/** — Installateur desktop Tauri 2.0 (Rust + React)
- **hasfy-infra/** — Infrastructure GKE, Terraform, Kubernetes, monitoring, PRA/PRI
- **hasfy-lp/** — Landing page Next.js, composants, SEO, i18n
- **hasfy-remotion/** — Génération vidéo programmatique avec Remotion

## Stack technique

- **Framework** : Next.js 15 (App Router, Server Components, Server Actions)
- **Documentation** : Nextra 4 + nextra-theme-docs pour les pages publiques
- **Base de données** : Supabase (PostgreSQL + Storage + Auth)
- **Contenu public** : MDX dans `content/` (pipeline Nextra)
- **Contenu privé** : MDX dans `docs/private/<projet>/` (gray-matter + next-mdx-remote)
- **Styling** : Tailwind CSS v4 + Shadcn UI (variables CSS HSL)
- **Authentification** : Supabase Auth (email/password + magic link)
- **Déploiement** : OVH via pipeline CI/CD
- **Langue du contenu** : Français
- **Langue du code** : Anglais

## Architecture du projet

### Structure des dossiers
```
app/                         # Routes Next.js (App Router)
  [[...mdxPath]]/            # Route catch-all Nextra - doc publique
  docs/private/[[...slug]]/  # Documentation privée (SSR + auth)
  admin/                     # Dashboard admin (auth requise)
  auth/                      # Pages d'authentification
content/                     # Contenu MDX public (Nextra)
  configuration/             # Onboarding, compte, préférences
  core-features/             # Équipements, assistance, calendrier, KPIs, notifs
  advanced-features/         # IA, marketplace technicien
  settings-security/         # Utilisateurs, MFA, sauvegardes, bonnes pratiques
  integrations/              # Vue d'ensemble, Stripe
docs/private/                # Contenu MDX privé (par projet)
  hasfy-app/                 # 6 fichiers : index, architecture-api, database-schema, frontend-architecture, ci-cd, security
  hasfy-agent/               # Installateur desktop Tauri
  hasfy-infra/               # 14 fichiers : architecture, infrastructure, sécurité, scaling, coûts, migration, PRA/PRI...
  hasfy-lp/                  # Landing page
  hasfy-remotion/            # Génération vidéo
src/
  components/                # Composants React
    ui/                      # Shadcn UI
    docs/                    # DocNav, DocHeader, Breadcrumbs
    mdx/                     # Alert, CodeBlock, Steps, Tabs
    auth/                    # LoginForm, SignupForm
    admin/                   # Composants admin
    providers/               # ThemeProvider, AuthProvider
  lib/                       # Utilitaires
    supabase/                # Client, Server, Middleware, Types
    actions/                 # Server Actions (permissions, etc.)
    mdx.ts                   # Parser MDX pour docs privées
    utils.ts                 # cn(), slugify(), formatDate()
  hooks/                     # Custom hooks (useToast, etc.)
supabase/                    # Schema SQL, migrations, storage policies
```

### Routes principales
- `/` — Page d'accueil (Nextra)
- `/introduction`, `/quickstart`, etc. — Documentation publique (Nextra)
- `/docs/private/hasfy-app/*` — Doc technique Hasfy-App (auth requise)
- `/docs/private/hasfy-agent/*` — Doc technique Hasfy-Agent (auth requise)
- `/docs/private/hasfy-infra/*` — Doc technique Hasfy-Infra (auth requise)
- `/docs/private/hasfy-lp/*` — Doc technique Hasfy-LP (auth requise)
- `/docs/private/hasfy-remotion/*` — Doc technique Hasfy-Remotion (auth requise)
- `/admin` — Dashboard admin (auth requise, rôle admin/editor)
- `/admin/profile` — Profil utilisateur (tout utilisateur authentifié)
- `/admin/users` — Gestion utilisateurs (super-admin @hasfy.fr uniquement)
- `/auth/login` — Connexion
- `/auth/signup` — Inscription
- `/auth/callback` — Callback OAuth Supabase

## Conventions de code

### Composants
- **Server Components par défaut** — Ne jamais ajouter `'use client'` sauf nécessité
- **`'use client'`** uniquement pour : hooks React (useState, useEffect), event handlers, accès browser APIs
- Props TypeScript strictement typées avec `interface`
- Composition plutôt qu'héritage
- Nommage : `PascalCase` pour les composants, un composant par fichier

### TypeScript
- Mode strict activé
- Alias d'import : `@/*` → `./src/*`
- Ne jamais utiliser `any` — préférer `unknown` + type guards
- Interfaces pour les props, types pour les unions/intersections

### Fichiers
- Nommage : `kebab-case` pour tous les fichiers et dossiers
- Extensions : `.tsx` pour les composants, `.ts` pour la logique
- Pas de fichiers `.js` ou `.jsx`

### Styling
- Tailwind CSS utility-first uniquement
- **Dark mode obligatoire** : toujours tester `dark:` variants
- Utiliser `cn()` de `@/lib/utils` pour fusionner les classes
- Variables CSS HSL pour le theming (Shadcn pattern)
- Ne jamais utiliser de CSS inline ni de fichiers CSS modules

### État et données
- **Server Actions** pour les mutations (formulaires, CRUD)
- **Supabase client** (`@/lib/supabase/client`) dans les Client Components
- **Supabase server** (`@/lib/supabase/server`) dans les Server Components
- Cache Next.js (`revalidatePath`, `revalidateTag`) pour la performance
- Pas de state management global (Redux, Zustand) — utiliser les Server Components

### Sécurité
- **Row Level Security (RLS)** obligatoire sur toutes les tables Supabase
- **Middleware** protège `/admin/*` et `/docs/private/*`
- Validation **Zod** aux frontières (formulaires, API)
- Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` côté client
- Vérifier les rôles côté serveur, jamais uniquement côté client

### Navigation Nextra
- Structure définie par les fichiers `_meta.js` dans `content/`
- Utiliser `type: 'separator'` pour les sections
- Utiliser `display: 'hidden'` pour masquer des pages de la sidebar
- Liens externes avec `href` et `newWindow: true`

## Base de données Supabase

### Tables principales
- `profiles` — Profils utilisateurs (id, email, full_name, role, avatar_url)
- `categories` — Catégories de documentation
- `docs` — Documents avec metadata, visibility, status, version
- `doc_versions` — Historique des versions
- `audit_logs` — Journal d'audit

### Rôles
- `admin` — Accès complet (CRUD docs, gestion utilisateurs)
- `editor` — Création et édition de documents
- `reader` — Lecture seule (défaut)

### Storage buckets
- `docs-public` — Fichiers publics
- `docs-private` — Fichiers privés (auth requise)
- `assets` — Images et médias partagés

## Commandes de développement

```bash
pnpm dev             # Serveur de développement (Turbopack)
pnpm build           # Build de production
pnpm start           # Serveur de production
pnpm lint            # Linter ESLint
pnpm type-check      # Vérification TypeScript (tsc --noEmit)
```

## Variables d'environnement requises

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
