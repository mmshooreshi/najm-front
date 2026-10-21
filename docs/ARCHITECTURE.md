# Najm Printing & Packaging — System Architecture (ARCHITECTURE.md)

This document provides a comprehensive architectural blueprint of the Najm web application, covering the frontend engine, the Nitro server layer, data persistence mechanisms, the visual editing system, and deployment workflows.

---

## 1. High-Level Architecture Diagram

```
[ Visitor / Client Browser ]              [ Admin In Edit Mode (?edit=true) ]
           │                                             │
           ├─────────────── HTTP / HTTPS ────────────────┤
           │                                             │
           ▼                                             ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Vercel Edge Network                             │
│                     (Global CDN & SSL Termination)                     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Nuxt 3 Application Server                         │
│  - SSR / Hydration Engine                                              │
│  - Dynamic RTL/LTR Locale System (fa, en, ar)                          │
│  - Global SEO & Schema.org JSON-LD Generation                          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           │                                                   │
           ▼                                                   ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────┐
│       Nitro API Route Handlers       │  │    Client-Side Visual Engine  │
│  - /api/content/:slug (No-Cache)     │  │  - useAdminEditable Composable│
│  - /api/consultation/submit          │  │  - v-editable Vue Directive   │
│  - /api/admin/ui/publish             │  │  - localStorage Draft Storage │
│  - /api/admin/requests/*             │  │  - AdminEditBar.client.vue    │
└──────────────────┬───────────────────┘  └───────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Persistence & Data Store                          │
│                                                                        │
│  1. In-Memory Cache (Fast Node/Serverless process cache)               │
│  2. Local File Fallback (.data/content/*.json, .data/leads.json)       │
│  3. Baseline Schemas (schemas/*-ui.json)                               │
│  4. Remote PocketBase VPS (http://65.108.80.205:8090)                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Layer

### Core Tech Stack
- **Nuxt 3** (`v3.15+`) with Vue 3 Composition API & `<script setup lang="ts">`.
- **Styling**: UnoCSS (`@unocss/nuxt`) coupled with Tailwind utility conventions.
- **State Management**: Pinia (`@pinia/nuxt`).
- **Smooth Scrolling**: Lenis (`@studio-freight/lenis` / `lenis`) integrated in layouts.
- **Animation & Physics**: GSAP (`gsap`, `ScrollTrigger`).
- **Icons**: Custom SVG system via `components/admin/AdminIcon.vue` + `unplugin-icons`.

### Multilingual & RTL Architecture
- The application natively supports **Persian (`fa`)**, **English (`en`)**, and **Arabic (`ar`)**.
- `composables/useLocale.ts` manages language state and detects text direction:
  - `isRTL = computed(() => language.value === 'FA' || language.value === 'AR')`
  - Body tag dynamically receives `dir="rtl"` or `dir="ltr"`.
  - Links use `localePath(path)` to preserve active language prefixes without hardcoded routing.
- **Rule of Persian Numerals**: In Persian locale, all numbers and digits are rendered as `۰, ۱, ۲, ۳, ۴, ۵, ۶, ۷, ۸, ۹`.

### Visual Live Editing Engine (`?edit=true`)
The application includes a real-time visual CMS built into the live website:
1. **Trigger**: Navigating with `?edit=true` activates admin mode if authenticated.
2. **Component Integration**:
   ```vue
   <script setup>
   import { useAdminEditable } from '~/composables/useAdminEditable'
   const { data: footerData } = useAdminEditable('footer')
   </script>
   <template>
     <h3 v-editable="'hero.title'">{{ footerData.hero?.title }}</h3>
   </template>
   ```
3. **Directive**: `v-editable="path"` registers clickable overlay frames that permit inline content updates.
4. **Draft Storage**: Unsaved modifications are staged in the browser's `localStorage` (`admin_drafts_*`).
5. **Publishing**: Clicking "Publish Changes" in `AdminEditBar.client.vue` sends an atomic batch update via `POST /api/admin/ui/publish`, which saves to PocketBase and updates local file caches.

---

## 3. Server Layer (Nitro & H3)

All backend endpoints are implemented as Nitro event handlers in `server/api/`.

### Key Server Handlers
- **Content Retrieval** (`/server/api/content/[slug].get.ts`):
  - Returns the latest UI JSON for any page.
  - Implements `setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')` to prevent stale HTTP caches from serving old content to visitors.
- **Draft & Publish Engine** (`/server/api/admin/ui/publish.post.ts`):
  - Accepts an array of `{ path, value }` mutations.
  - Applies mutations using `setByPath(root, path, value)`.
  - Persists directly to PocketBase and updates local storage.
- **CRM Leads Engine** (`/server/api/consultation/submit.post.ts`, `/server/api/admin/requests/*`):
  - Ingests incoming leads from contact and consultation forms.
  - Formats submission dates and hours using Tehran time (`Asia/Tehran`).
  - Supports 1-click status transitions, call attempts logging, and internal staff notes.

---

## 4. Database & Storage Architecture

### Remote PocketBase Database
- **Host**: VPS at `http://65.108.80.205:8090`
- **Authentication**: JWT Superuser Bearer Token
- **Collection `pages`**:
  - `id`: Unique record identifier (e.g. `z2962w7ya816ei0` for leads)
  - `slug`: String key identifying the page or module (`footer`, `about`, `home`, `leads`, `contact`, etc.)
  - `title`: Display title
  - `layoutType`: Template indicator
  - `uiData`: Rich JSON object containing all localized content (`fa`, `en`, `ar`) or array of lead records.

### Local Storage & Fallback Layer
In addition to PocketBase, the server maintains local file caches:
1. `.data/content/<slug>.json`: Local cached copies of published page UI data.
2. `.data/leads.json`: Local cached copies of incoming consultation requests.
3. `schemas/<slug>-ui.json`: Default baseline schemas created with initial defaults.

**Resilience Hierarchy**:
1. Server checks in-memory cache $\rightarrow$
2. If absent, queries remote PocketBase with timeout $\rightarrow$
3. If PocketBase fails or times out, reads local `.data/` JSON $\rightarrow$
4. If local file absent, falls back to `schemas/<slug>-ui.json`.

---

## 5. Deployment & CI/CD Pipeline

- **Repository**: `https://github.com/mmshooreshi/najm-front.git`
- **Main Development & Release Branch**: `staging`
- **Host Platform**: Vercel (Edge Functions + Static Assets)
- **Deployment Trigger**: Pushes to `staging` automatically trigger a production build on Vercel.
- **Serverless Rule**: In serverless lambdas, any asynchronous task that persists data to PocketBase MUST be `await`ed before sending the HTTP response. Fire-and-forget background promises are frozen by the runtime environment.

---

## 6. Zero-Regression Performance Architecture

> **The Core Mandate**: Any modification to this codebase **MUST NOT** degrade performance even slightly. Engineers and AI agents are expected to **only preserve or enhance performance, never lower it**. With this mindset, every solution must be final, flawless, and production-tested.

### A. Rendering, Paint & Animation Budget
1. **GPU Layer Promotion**: All interactive animations (e.g. `ImagesFloating.vue`, `Accordion.vue`, `HighlightedMotion.vue`) must use CSS transforms (`translate3d`, `scale`, `rotate`) and `opacity`. Never animate layout-triggering properties (`width`, `height`, `top`, `left`, `margin`).
2. **Passive Touch & Scroll Listeners**: Mobile interactive carousels must declare `touch-pan-y` in Tailwind / UnoCSS. Never call `preventDefault()` on vertical scroll gestures.
3. **GSAP Lifecycle Hygiene**: Every `SplitText` and `ScrollTrigger` instance MUST be reverted and killed in `onBeforeUnmount()` to prevent memory leaks and detached DOM node accumulation.

### B. Payload & Bundle Optimization
1. **Admin Tools Isolation**: All heavy admin editors, the live editing bar (`AdminEditBar.client.vue`), the media studio modal (`AdminMediaStudioModal.client.vue`), and cropping tools MUST remain client-only components (`*.client.vue`) or dynamically imported so public visitors never download admin JavaScript.
2. **Icon Tree-Shaking**: All icons are loaded as direct SVG vectors in `AdminIcon.vue` or through `unplugin-icons`, avoiding multi-megabyte icon font bundles.

### C. Server, Caching & I/O Hygiene
1. **Adaptive Edge Caching**:
   - Public content routes serve with `Cache-Control: public, max-age=60, s-maxage=3600, stale-while-revalidate=600`.
   - In-place editing sessions use `Cache-Control: no-cache, no-store, must-revalidate`.
2. **SQLite WAL Telemetry**: Native Node 22 `node:sqlite` runs in `WAL` (Write-Ahead Logging) mode with `synchronous = NORMAL`, allowing concurrent, zero-latency append writes without locking database reads.
3. **Non-Blocking Telemetry Beaconing**: Client event tracking (`useTracker.ts`) batches telemetry and flushes every 1.5 seconds or via `navigator.sendBeacon` upon page unload, guaranteeing zero main-thread blocking or frame drops during navigation.
