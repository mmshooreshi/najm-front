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

#### 2. Collection `_superusers` & `admins`
PocketBase v0.23+ user collections for administrative authentication. Used by `/api/admin/login` to issue session cookies.

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
