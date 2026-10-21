# Agent Operating Guide & Codebase Intelligence (AGENTS.md)

> **Target Audience**: AI Agents (Antigravity, Claude, Copilot, Cursor, Codex) & Human Engineers  
> **Repository**: [mmshooreshi/najm-front](https://github.com/mmshooreshi/najm-front)  
> **Production Target**: [chapenajm.com](https://chapenajm.com)  
> **Active Deployment Branch**: `staging` (Vercel CI/CD)  
> **Last Verified**: October 2026

---

## 1. Golden Rules & Operational Directives

### Rule 1: Python Tooling — ALWAYS Use `uv`
- **MANDATORY**: Whenever running Python scripts, virtualenvs, or package management, ALWAYS use `uv`.
- Never run bare `python` or bare `pip`.
- Example: `uv run python script.py` or `uv pip install ...`.

### Rule 2: Persian Text Formatting — Persian Numerals
- **MANDATORY**: Whenever generating or editing Persian (Farsi) text/copy, ALL digits, counts, hours, scores, and dates MUST strictly use Persian numerals:
  `۰, ۱, ۲, ۳, ۴, ۵, ۶, ۷, ۸, ۹`
- Never output English digits (`0-9`) in Persian user-facing text.

### Rule 3: Building Nuxt in This Environment
- Build command must set `HOME` and `VERCEL=1` to ensure Nitro build succeeds inside local sandbox or shell:
  ```bash
  HOME=/Users/mamthenebo/Me/projects/najm/najm-front VERCEL=1 ./node_modules/.bin/nuxt build
  ```

### Rule 4: Git Operations in Agent Sandboxes
- When staging or committing files via `git add`, `git commit`, or `git push`, the sandbox may throw `fatal: Unable to create '.git/index.lock': Operation not permitted`.
- **Solution**: Execute Git commands with `BypassSandbox: true` so the tool can safely acquire the lockfile and authenticate with GitHub remote.

---

## 2. System Architecture at a Glance

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Nuxt 3 Frontend                               │
│  - Vue 3 + Vite + UnoCSS / Tailwind                                    │
│  - Trilingual: FA (default), EN, AR (RTL/LTR dynamic engine)           │
│  - Visual Live Editor (?edit=true) + Inline Directives (v-editable)    │
│  - Executive CRM Dashboard (/dash/requests) & Media Studio             │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
        Public & CRM API                        Admin UI Publishing
     /api/content/[slug].get                   /api/admin/ui/publish
     /api/consultation/submit                  /api/admin/requests/[id]
                 │                                       │
                 ▼                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Nitro Server / Edge Lambdas                          │
│  - Content Store: server/utils/contentStore.ts                         │
│  - Leads Store: server/utils/leadsStore.ts                             │
│  - Local Resilience Fallback: .data/content/*.json, .data/leads.json   │
│  - Static Baseline Schemas: schemas/*-ui.json                          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                     HTTP REST with Superuser JWT
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Remote Backend Database                          │
│  - PocketBase v0.23+ on VPS (http://65.108.80.205:8090)               │
│  - Collections: `pages` (stores uiData JSON), `_superusers`, `admins`  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Top Pitfalls & Critical Discoveries

### ⚠️ Pitfall 1: Vercel Serverless Freezes Non-Awaited Async Tasks
- **The Bug**: When saving content or writing leads, running `syncContentToPocketBase(slug, data).catch(...)` as a fire-and-forget background promise caused Vercel serverless lambdas to terminate before the HTTP request reached PocketBase! As a result, drafts were saved locally in memory but NEVER persisted to PocketBase.
- **The Fix**: ALWAYS `await` any PocketBase sync before returning the API response:
  ```ts
  // CORRECT:
  await syncContentToPocketBase(slug, currentUi)
  return { success: true }
  ```

### ⚠️ Pitfall 2: PocketBase Duplicate Records by Slug
- **The Bug**: Calling `POST /api/collections/pages/records` with `slug="footer"` repeatedly created multiple duplicate records in PocketBase. Subsequent GET requests queried without sorting and returned stale/first records, ignoring new updates.
- **The Fix**:
  1. Always query `filter: 'slug="' + slug + '"'`.
  2. If records exist, PATCH `items[0].id`.
  3. Proactively delete any leftover duplicates (`items[1..n]`).

### ⚠️ Pitfall 3: PocketBase Superuser Token Authentication
- **The Fact**: Direct unauthenticated calls to `http://65.108.80.205:8090/api/collections/pages/records` will fail or be rejected if collection API rules restrict public write access.
- **The Fix**: Always provide the `Authorization` header with `PB_SUPERUSER_TOKEN`:
  ```ts
  const PB_SUPERUSER_TOKEN = process.env.PB_SUPERUSER_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'
  ```

### ⚠️ Pitfall 4: Visual Editor vs Visitor Mode & Hardcoded Data
- **The Bug**: An admin edits content in `?edit=true` mode. It updates `localStorage`, but regular visitors open `https://chapenajm.com` and still see old hardcoded values!
- **Why It Happened**:
  1. The page component was using local `ref(...)` defaults instead of `useAdminEditable('slug')`.
  2. The admin clicked "Save" locally without publishing to server, OR `/api/content/[slug]` was cached.
- **The Fix**:
  - Every content-bearing component (e.g. `Footer2.vue`, `Hero.vue`, `Accordion.vue`) MUST use `useAdminEditable('pageSlug')`.
  - `/api/content/[slug].get.ts` sets `Cache-Control: no-cache, no-store, must-revalidate`.
  - Once published via `/api/admin/ui/publish`, the content is written to PocketBase and immediately visible to public users without edit mode.

### ⚠️ Pitfall 5: Mobile Safari Touch-Scroll Traps
- **The Bug**: On iPhone Safari, user starts scrolling down the page. The scroll abruptly locks up at the interactive slider (`ImagesFloating.vue`).
- **Why It Happened**: Horizontal touch event listeners (`touchstart`/`touchmove`) captured all gestures and called `preventDefault()` or lacked touch direction differentiation.
- **The Fix**:
  - Add `touch-pan-y` Tailwind class to interactive containers.
  - Distinguish touch vs mouse: mouse enables click-and-drag horizontal physics; touch relies on native vertical scroll passthrough.

### ⚠️ Pitfall 6: Sidebar / Drawer Animation Jitter
- **The Bug**: Opening the mobile navigation drawer was jumpy and clipped margins on iOS.
- **The Fix**:
  - Use unified solid drawer surfaces without nested item stagger delays during enter.
  - Directional anchoring: RTL uses `left-0 right-auto`, LTR uses `right-0 left-auto`.
  - Unlock body scroll (`document.body.style.overflow = ''`) only in `onAfterLeave()`.

---

## 4. Key Endpoints Directory

| Category | Endpoint | Method | Role |
|----------|----------|--------|------|
| **Public Content** | `/api/content/:slug` | `GET` | Fetches live JSON content for any page (e.g., `home`, `footer`, `about`, `contact`). No cache. |
| **Consultation** | `/api/consultation/submit` | `POST` | Public lead capture from modal or `/consultation`. Persists to PocketBase and `.data/leads.json`. |
| **Admin Auth** | `/api/admin/login` | `POST` | Authenticates against PocketBase `_superusers` / `admins` and sets `pb_admin` cookie. |
| **Admin Auth** | `/api/admin/logout` | `POST` | Clears admin auth cookie. |
| **UI Publishing** | `/api/admin/ui/publish` | `POST` | Atomically commits visual editor drafts to PocketBase & local cache. |
| **UI Drafts** | `/api/admin/ui/save-draft` | `POST` | Saves server-side draft version. |
| **CRM Leads** | `/api/admin/requests` | `GET` | Fetches all incoming client inquiries with normalized Tehran timestamps & call histories. |
| **CRM Leads** | `/api/admin/requests/:id` | `PATCH` | Updates lead status, notes, call attempts, and timestamps. |
| **CRM Leads** | `/api/admin/requests/:id` | `DELETE` | Deletes a lead. |
| **CRM SMS** | `/api/admin/requests/sms` | `POST` | Logs SMS in lead history and forwards to SMS gateway (Kavenegar/FarazSMS) if configured. |
| **Media** | `/api/admin/media` | `GET` | Lists images and assets. Supports upload, move, delete. |

---

## 5. Environment & Credentials Reference

- **PocketBase VPS IP**: `65.108.80.205`
- **PocketBase Port**: `8090`
- **PocketBase URL**: `http://65.108.80.205:8090` (configured in `.env` as `PB_URL`)
- **PocketBase Leads Collection ID**: `z2962w7ya816ei0` in collection `pages` (`slug="leads"`)
- **PocketBase Superuser Token**: Configured in `server/utils/contentStore.ts` and `server/utils/leadsStore.ts`.
- **Public Domain**: `https://chapenajm.com`
- **Admin Visual Editor**: `https://chapenajm.com/?edit=true`
- **Admin Dashboard**: `https://chapenajm.com/dash`
- **Official Contact Phone**: `۰۲۱-۶۶۷۹۷۹۱۱ الی ۱۳`
- **Official WhatsApp / Mobile**: `۰۹۹۰۳۴۰۰۰۷۴`

---

## 6. Project Directory Map

```
najm-front/
├── components/               # Vue 3 UI components
│   ├── Accordion.vue         # Capabilities accordion with subtle organic links
│   ├── AccordionItem.vue     # Individual accordion step with animated RTL arrow
│   ├── Drawer.vue            # Mobile navigation drawer with silky smooth transitions
│   ├── ImagesFloating.vue    # Full-bleed floating brand showcase
│   ├── consultation/         # Consultation modals and quote request forms
│   ├── admin/                # Visual editing toolbar, icon components, media studio
│   └── dash/                 # /dash CRM sidebar, header, mobile nav
├── composables/              # Vue Composables
│   ├── useAdminEditable.ts   # Core engine for inline visual editing & live reactive updates
│   ├── useLocale.ts          # Language state (FA, EN, AR), RTL detection, localePath()
│   ├── useAppSeo.ts          # Structured schema graph (Organization, Service, FAQ, etc.)
│   └── useMenu.ts            # Navigation menu state
├── pages/                    # File-based routing
│   ├── index.vue             # Homepage
│   ├── consultation/         # Standalone consultation & 3D mockup order page
│   ├── dash/                 # Admin Dashboard
│   │   ├── requests.vue      # CRM Leads & inquiries pipeline with 1-click missed call & SMS
│   │   ├── content.vue       # Content & banners management
│   │   ├── media.vue         # Media studio & asset explorer
│   │   ├── blog.vue          # Blog & articles CMS
│   │   └── settings.vue      # Global site settings
│   ├── services/             # Industrial service detail pages
│   ├── products/             # Packaging & printing catalog pages
│   └── resources/            # Die-cut templates and technical guidelines download center
├── schemas/                  # Baseline fallback JSON schemas for all pages
├── server/                   # Nitro Server Engine (H3 Event Handlers)
│   ├── api/                  # REST API routes
│   └── utils/
│       ├── contentStore.ts   # PocketBase <-> Local file syncing & path setter
│       └── leadsStore.ts     # Leads management, normalization & Tehran time formatting
├── docs/                     # In-depth architectural & API manuals (see below)
│   ├── ARCHITECTURE.md       # Full stack design & data flow
│   ├── BACKEND_AND_API.md    # Detailed API endpoint reference & schemas
│   ├── FRONTEND_AND_CMS.md   # Visual editor & frontend development guide
│   └── CRM_AND_LEADS.md      # CRM pipeline, missed-call tracking & SMS guide
└── README.md                 # Primary project overview
```
