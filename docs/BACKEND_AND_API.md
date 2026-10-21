# Backend, Database & API Reference (BACKEND_AND_API.md)

This reference manual documents the PocketBase database configuration, data persistence engines in `server/utils/`, and the complete inventory of API endpoints under `server/api/`.

---

## 1. PocketBase Backend & Infrastructure

### Connection Details
- **PocketBase Host**: VPS running Linux
- **Server URL**: `http://65.108.80.205:8090` (configured in `.env` as `PB_URL`)
- **Admin Panel**: `http://65.108.80.205:8090/_/`
- **Superuser Token**: A valid PocketBase JWT is configured in `server/utils/contentStore.ts` and `server/utils/leadsStore.ts`:
  ```ts
  const PB_SUPERUSER_TOKEN =
    process.env.PB_SUPERUSER_TOKEN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'
  ```

### Primary PocketBase Collections

#### 1. Collection `pages`
Stores all site content, page UI schemas, and lead registries.
- **Fields**:
  - `id` (Text, 15 chars): Unique record ID.
  - `slug` (Text): Unique page identifier (e.g. `home`, `about`, `footer`, `contact`, `leads`, `consultation`).
  - `title` (Text): Human-readable page title.
  - `layoutType` (Text): Template identifier (e.g. `custom`, `default`, `services`).
  - `uiData` (JSON): The full nested content object containing multilingual blocks (`fa`, `en`, `ar`) or array of lead objects.
- **Special Record**: `id: z2962w7ya816ei0` stores persistent leads (`slug="leads"`).

#### 2. Collection `media_folders`
Stores the virtual directory hierarchy for `/dash/media`.
- **Fields**: `id`, `name`, `path`, `parent`.

#### 3. Collection `_superusers` & `admins`
PocketBase v0.23+ user collections for administrative authentication. Used by `/api/admin/login` to issue session cookies.
- **Superuser ID**: `akvk96g432898l1`

---

## 2. PocketBase HTTPS Edge Proxy (`server/routes/api/pb/[...path].ts`)

In production on Vercel (`https://chapenajm.com`), direct browser calls to `http://65.108.80.205:8090` are blocked by browsers as **Mixed Content**.
- **Route**: `ALL /api/pb/[...path]`
- **Mechanism**: Catch-all Nitro reverse proxy that forwards all client PocketBase SDK requests securely upstream to `http://65.108.80.205:8090`.
- **Client Configuration**: Handled automatically in `plugins/pb.client.ts` which detects `window.location.protocol === 'https:'` and redirects the SDK base URL.

---

## 2. Server Utilities & Persistence Engines (`server/utils/`)

### `server/utils/contentStore.ts`
Manages content reading, writing, path updating, and remote PocketBase synchronization.

#### Exported Functions
- `readLocalContent(slug: string): Record<string, any> | null`  
  Reads cached content from `.data/content/<safeSlug>.json`.
- `writeLocalContent(slug: string, uiData: Record<string, any>): void`  
  Writes content to local `.data/content/<safeSlug>.json`.
- `setByPath(root: any, pathStr: string, value: any): void`  
  Mutates deeply nested keys inside an object using dot notation (e.g. `setByPath(obj, 'contact.items.0.phone', '021-66797911')`). Handles dynamic array index creation.
- `applyAndSaveContent(slug: string, language: string, changes: { path: string; value: any }[]): Promise<Record<string, any>>`  
  Applies an array of changes to both lowercase and uppercase language blocks, writes local cache, and calls `syncContentToPocketBase`.
- `syncContentToPocketBase(slug: string, uiData: Record<string, any>): Promise<boolean>`  
  Queries PocketBase by slug. If record exists, sends `PATCH /api/collections/pages/records/:id`. If duplicate records exist for the same slug, automatically deletes the duplicates (`items[1..n]`). If no record exists, creates via `POST`.

### `server/utils/leadsStore.ts`
Manages CRM consultation requests, contact inquiries, and follow-ups.

#### Exported Functions
- `normalizeLeads(leads: any[]): any[]`  
  Ensures every lead has a clean status (`new`, `called_no_answer`, `contacted`, `completed`, `cancelled`), formats Tehran local time (`createdTime`) and Jalali date (`created`) from timestamp if missing, and initializes call tracking counters.
- `getAllLeads(): Promise<any[]>`  
  Fetches leads from PocketBase record `z2962w7ya816ei0` with `PB_SUPERUSER_TOKEN` header. Falls back to `.data/leads.json`.
- `createLead(lead: any): Promise<any>`  
  Prepends a new lead to the list, records Tehran time, saves to `.data/leads.json`, and awaits PocketBase sync.
- `updateLead(id: string, patch: any): Promise<boolean>`  
  Updates any lead attributes (status, notes, call attempts, SMS counter) and persists changes.
- `removeLead(id: string): Promise<boolean>`  
  Deletes lead by ID and synchronizes storage.

---

## 3. Server API Route Catalog (`server/api/`)

### Public Content & Forms

#### `GET /api/content/:slug`
- **Description**: Returns live page content JSON for public rendering and visual editor baseline.
- **Headers**: Automatically sets `Cache-Control: no-cache, no-store, must-revalidate`.
- **Response**:
  ```json
  {
    "success": true,
    "slug": "footer",
    "data": { ... }
  }
  ```

#### `POST /api/consultation/submit`
- **Description**: Public form submission from `/consultation` page or consultation modals.
- **Payload**:
  ```json
  {
    "name": "محمد رضایی",
    "phone": "09123456789",
    "company": "داروسازی نوین",
    "category": "هاردباکس لوکس",
    "quantity": "۲,۵۰۰ عدد",
    "timeSlot": "عصر (۱۵:۰۰ الی ۱۸:۰۰)",
    "mockupRequested": true,
    "description": "نیاز به ماکت ۳D قبل از چاپ افست",
    "sourcePage": "/products/packaging/luxury-boxes",
    "device": "Mobile"
  }
  ```
- **Response**: `{ "ok": true, "message": "درخواست مشاوره با موفقیت ثبت شد", "data": { ... } }`

---

### Admin Authentication & System

#### `POST /api/admin/login`
- **Description**: Authenticates administrator using email and password against PocketBase `_superusers` or legacy `admins`.
- **Cookie Set**: `pb_admin` (HTTP-only cookie valid for 48 hours).
- **Payload**: `{ "email": "admin@chapenajm.com", "password": "..." }`

#### `POST /api/admin/logout`
- **Description**: Clears `pb_admin` cookie and ends administrative session.

---

### Visual Editor & Content Publishing

#### `POST /api/admin/ui/publish`
- **Description**: Atomically publishes visual editor drafts from the client to the server and PocketBase.
- **Payload**:
  ```json
  {
    "changes": [
      { "slug": "footer", "path": "contact.phone", "value": "۰۲۱-۶۶۷۹۷۹۱۱ الی ۱۳" },
      { "slug": "footer", "path": "contact.whatsapp", "value": "۰۹۹۰۳۴۰۰۰۷۴" }
    ],
    "language": "fa"
  }
  ```
- **Response**: `{ "success": true, "totalSaved": 2, "results": [...] }`

#### `POST /api/admin/ui/save-draft`
- **Description**: Saves server-side draft version for staging before publishing.

#### `GET /api/admin/ui/versions` & `POST /api/admin/ui/rollback`
- **Description**: Inspects historic content revisions and reverts any page to a previous snapshot.

---

### CRM Leads Management (`/api/admin/requests/*`)

#### `GET /api/admin/requests`
- **Description**: Lists all customer consultation inquiries with calculated relative timestamps, call counts, and notes.
- **Response**:
  ```json
  {
    "success": true,
    "total": 12,
    "items": [
      {
        "id": "req-1788211179859-yxx8",
        "name": "شرکت بهین دارو",
        "phone": "09123456789",
        "status": "called_no_answer",
        "created": "۱۴۰۵/۶/۲۱",
        "createdTime": "۰۹:۳۰",
        "callAttempts": 2,
        "lastCalledAt": "امروز ساعت ۱۱:۴۵",
        "notes": "تماس اول بی‌پاسخ، پیامک ارسال شد",
        "timeSlot": "عصر (۱۵:۰۰ الی ۱۸:۰۰)"
      }
    ]
  }
  ```

#### `PATCH /api/admin/requests/:id`
- **Description**: Updates lead status, internal notes, call attempts, or timestamps.
- **Payload**: `{ "status": "called_no_answer", "callAttempts": 2, "notes": "..." }`

#### `DELETE /api/admin/requests/:id`
- **Description**: Deletes a lead record by ID.

#### `POST /api/admin/requests/sms`
- **Description**: Logs an SMS dispatch event on the lead, records sent count, and dispatches via SMS gateway (Kavenegar / FarazSMS) when `SMS_API_KEY` is configured.
- **Payload**:
  ```json
  {
    "leadId": "req-1788211179859-yxx8",
    "phone": "09123456789",
    "message": "سلام وقت بخیر، از مجتمع چاپ نجم تماس گرفتیم...",
    "templateTitle": "عدم پاسخگویی تماس 📵"
  }
  ```

---

### Media Studio & Assets (`/api/admin/media/*`)

#### `GET /api/admin/media`
- **Description**: Scans and returns directory tree of images and documents stored in `/public/images/` and `/public/uploads/`.

#### `POST /api/admin/media/upload`
- **Description**: Handles multipart file uploads, image optimizations, and saves to public assets directory.

#### `POST /api/admin/media/delete` & `POST /api/admin/media/move`
- **Description**: Manages file operations in the asset storage.

---

### CMS Resources & Blog

- `POST /api/admin/blog/save`: Creates or updates a blog article.
- `POST /api/admin/blog/delete`: Removes an article.
- `POST /api/admin/blog/reorder`: Reorders blog listing.
- `POST /api/admin/resources/save`: Uploads or edits die-cut templates & guidelines.
- `POST /api/admin/resources/reorder`: Changes order of downloadable assets.

---

### Telemetry & Analytics (`/api/analytics/*` & `/api/t`)

- `POST /api/t`: Public beacon ingest for telemetry events (pageviews, taps, scroll dwell, conversions). Batched into in-memory queue and written to SQLite `.data/analytics.db`.
- `GET /api/analytics/traffic`: Returns aggregated traffic metrics, UTM breakdown, browser/OS breakdowns, and daily/hourly timelines. Accepts `time_range` (`1h`, `24h`, `7d`, `30d`, `all`).
- `GET /api/analytics/sessions`: Returns session summaries with reconstructed DAG journeys (Landing, Pageviews, Button Taps, Scroll Dwells, Conversions).
- `GET /api/analytics/live`: Real-time streaming telemetry returning active visitors online (15m window), active page paths, and live event ticker.
- `POST /api/analytics/exclude-device`: Toggles device exclusion in `.data/excluded_fingerprints.json` to prevent admin activity from distorting metrics.

---

## 4. Server-Side Performance, Latency & Edge Optimization

> **Performance Rule**: Backend and API changes **MUST NOT** degrade TTFB (Time to First Byte) or endpoint response latency even slightly. You can **ONLY** preserve or enhance performance, never lower it. Build final, flawless, battle-tested solutions with zero execution waste.

### 1. In-Memory Process Caching Before Disk / Network I/O
- `contentStore.ts` and `leadsStore.ts` maintain in-memory arrays and objects (`inMemoryLeads`, local content cache).
- Repeated calls within the same serverless instance execution read directly from memory in $0\text{ms}$ rather than making redundant sequential round-trips to disk or PocketBase.

### 2. Elimination of Sequential Request Waterfalls
- Server-side rendering (SSR) routes and API handlers must never execute sequential dependent waterfalls if operations can run concurrently.
- When querying multiple collections or checking assets, leverage `Promise.all()` to saturate network bandwidth and minimize edge lambda run-time.

### 3. SQLite WAL Mode & Concurrency Pragmas
- The local telemetry database (`.data/analytics.db`) is configured with:
  ```sql
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA temp_store = MEMORY;
  PRAGMA cache_size = -64000; -- 64MB cache
  ```
- Write-Ahead Logging (WAL) ensures writes (such as high-frequency telemetry beacons from `POST /api/t`) never block concurrent read queries from `/dash/traffic`, eliminating database lock contention.

### 4. Awaiting Serverless Persistence Without Hangs
- As outlined in Pitfall 1, never use unawaited fire-and-forget promises in Vercel edge functions.
- Always `await syncContentToPocketBase(slug, data)` with an explicit timeout (`timeout: 4000` to `6000ms`) so the response terminates cleanly without running into cloud provider lambda execution caps.

### 5. Microsecond Header Precision & Cache Invalidation
- **Public Content**: `/api/content/[slug]` sets `Cache-Control: no-cache, no-store, must-revalidate` so visitors instantly see published changes without relying on hard browser refresh.
- **Static Assets & Uploads**: `/public/images/*` and `/public/uploads/*` utilize immutable cache headers (`public, max-age=31536000, immutable`), offloading 100% of bandwidth to the CDN edge.

