# Telemetry & Analytics Architecture Manual (TELEMETRY_AND_ANALYTICS.md)

> **Repository**: [mmshooreshi/najm-front](https://github.com/mmshooreshi/najm-front)  
> **Production Target**: [chapenajm.com](https://chapenajm.com)  
> **Dashboard Route**: `/dash/traffic`  
> **Target Audience**: AI Agents & Engineers  

---

## 1. System Overview: The Two Analytics Engines

The Najm platform operates two distinct, specialized analytics engines designed for zero client friction and high operational utility:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Najm Client Frontend                          │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
     Real-Time Telemetry (1.5s flush)       Form Lead Submission
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│  Engine 1: Telemetry V2 (SQLite)    │  │ Engine 2: Lead Attribution   │
│  - composables/useTracker.ts         │  │ - composables/useAnalytics...│
│  - server/utils/telemetryDb.ts       │  │ - server/utils/leadsStore.ts │
│  - pages/dash/traffic.vue            │  │ - components/consultation... │
│  - Storage: node:sqlite (WAL mode)   │  │ - Storage: .data/leads.json  │
│    + fallback in-memory JSON         │  │    + PocketBase 'pages' slug │
├──────────────────────────────────────┤  ├──────────────────────────────┤
│ Capabilities:                        │  │ Capabilities:                │
│ • Deterministic client fingerprint   │  │ • sessionStorage journey DAG  │
│ • Tap heatmaps (rx/ry & page_x/y)    │  │ • Entry referrer capture     │
│ • 20-bin scroll dwell depth tracking │  │ • Device categorization      │
│ • Component hesitation detection     │  │ • Formatted time-on-site     │
│ • Live mode polling (5s / 10s / off) │  │ • Active product context     │
│ • Admin exclusion by fingerprint/IP  │  │ • Embedded in CRM leads      │
│ • Dual Mode: Historical vs Real-Time │  │   pipeline (/dash/requests)  │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 2. Engine 1: Telemetry V2 Deep Dive (`server/utils/telemetryDb.ts`)

### A. Database Storage & Pragmas
- **Primary Database File**: `.data/analytics.db` accessed via Node 22 native `node:sqlite` (`DatabaseSync`).
- **Resilience Fallback**: If `node:sqlite` is unavailable (e.g. edge lambdas without C-bindings), it gracefully falls back to `.data/analytics_events.json`.
- **SQLite Performance Pragmas**:
  ```sql
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  ```
- **Table Schema (`analytics_events`)**:
  ```sql
  CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    event_name TEXT NOT NULL,
    session_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    url TEXT NOT NULL,
    referrer TEXT,
    ip_hash TEXT NOT NULL,
    user_agent TEXT,
    fingerprint TEXT,
    is_excluded INTEGER DEFAULT 0,
    ip TEXT,
    region TEXT,
    properties TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
  CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
  CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
  CREATE INDEX IF NOT EXISTS idx_analytics_events_url ON analytics_events(url);
  ```

### B. Dual-Mode Switcher (`pages/dash/traffic.vue`)

1. **Mode 1: Historical Analytics (`آرشیو و تحلیل گذشته`)**:
   - Preserves and analyzes accumulated historical sessions across range presets:
     - `1h` (5-minute buckets)
     - `24h` (hourly buckets)
     - `7d` (daily buckets with Persian weekday labels)
     - `30d` / `90d` / `all` (daily buckets)
   - **Dynamic Timeline Calculation for `all`**: Rather than a fixed window, computes `min(timestamp)` and `max(timestamp)` across all database records (bounded between 7 and 60 days).
   - **Zero-Data Fallback Banner**: If a narrow range (like `1h`) returns 0 sessions, the API reports `total_historical_sessions`. If `total_historical_sessions > 0`, the UI renders a 1-click button to view the full database history.

2. **Mode 2: Real-Time Live Stream (`پخش زنده و لحظه‌ای`)**:
   - **Live pulse indicator** with active visitor counter (15-minute sliding window).
   - **Active Pages List**: Shows exactly what paths visitors are reading right now.
   - **Live Event Stream Ticker**: Ticker of pageviews, button clicks, dwell pauses, and form inquiries with friendly persona avatars.
   - Configurable auto-polling interval: `5s`, `10s`, or `خاموش` (manual).

### C. Visitor DAG Journey Architecture
Reconstructed server-side in `buildJourneySteps(events, sourceType, durationSec)`:
- **`landing`**: Entry URL, referrer channel badge (`google_organic`, `google_ads`, `direct`, `referral`, `social`, `utm`). Includes a `🚫` button to exclude paths.
- **`page`**: Subsequent route views.
- **`tap`**: Button or interactive element clicks (`target_label`, `target_id`).
- **`dwell`**: Reading pause trigger (`scroll_dwell`) when dwell $\ge 3\text{s}$, capturing `dwell_sec` and `section` name.
- **`conversion`**: High-value business goals:
  - `sales_handoff`: WhatsApp/Phone contact inquiries.
  - `dieline_download`: Box die-cut CAD template downloads.
  - `spec_configured`: Box 3D dimension calculator usage.
  - `volume_inquired`: Order quantity inquiries.

### D. Friendly Fingerprint Personas (`composables/useFriendlyFingerprint.ts`)
- Deterministically hashes client fingerprints into friendly user persona names and 6 distinct visual themes (Emerald, Sky, Amber, Violet, Rose, Teal).
- **Admin Aliasing**: Admins can label fingerprints (e.g. `"لپ‌تاپ شرکت"`, `"مشتری زعفران"`), saved locally in LocalStorage (`najm_fp_aliases`).
- **Device Exclusion**: Admins can toggle device exclusion (`POST /api/analytics/exclude-device`), persisted in `.data/excluded_fingerprints.json`.

---

## 3. Engine 2: Consultation Lead Attribution & CRM Link

- **Client Tracking (`composables/useAnalyticsTracker.ts`)**:
  - Maintains visitor trail in `sessionStorage` (`najm_journey` & `najm_product_context`).
  - Records entry referrer (`document.referrer` or `ورود مستقیم`).
  - Formats time-on-site dynamically upon form submission.
- **CRM Integration (`/dash/requests`)**:
  - Attached directly to every inquiry submitted via `ConsultationModal.vue` or `/consultation`.
  - Persisted to PocketBase record `z2962w7ya816ei0` (`slug="leads"`).

---

## 4. API Endpoints Directory

| Endpoint | Method | Role | Key Parameters / Body |
| :--- | :--- | :--- | :--- |
| **`/api/analytics/traffic`** | `GET` | Aggregated KPIs, timelines, UTM breakdowns, device/browser distributions, and page flows. | `time_range` (`1h`, `24h`, `7d`, `30d`, `all`), `include_excluded`, `exclude_admin`, `exclude_fps`, `exclude_pages`, `filter_utm`, `since`, `until`. |
| **`/api/analytics/sessions`** | `GET` | Individual session summaries with full reconstructed DAG journeys. | `limit` (max 100, default 50), plus all filter query params identical to `/traffic`. |
| **`/api/analytics/live`** | `GET` | Dedicated real-time telemetry endpoint. | `minutes` (1-60, default 15), `exclude_admin`. Returns `active_visitors`, `active_pages`, `active_sessions`, `live_events`. |
| **`/api/analytics/exclude-device`** | `POST` | Toggles or sets exclusion status for a device fingerprint in `.data/excluded_fingerprints.json`. | `{ fingerprint: string, action?: 'add' \| 'remove' }` |
| **`/api/t`** | `POST` | Public ingest beacon for telemetry events. Batched into in-memory queue and written to SQLite. | Array or single telemetry event payload. |

---

## 5. Security & Authentication Layer

All analytics endpoints implement a unified authentication check:
```ts
const isDev = process.env.NODE_ENV !== 'production' || Boolean((process as any).dev)
const token =
  getCookie(event, 'pb_admin') ||
  getCookie(event, 'pb_auth') ||
  getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')

if (!token && !isDev) {
  throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Admin authentication required' })
}
```
- **Dev-Mode Bypass**: Local testing via `localhost` is never locked out even if cookies are omitted.
- **Client Fetching**: Frontend `$fetch` passes `credentials: 'include'` and attaches `Authorization: Bearer <cookie>`.

---

## 6. Zero-Impact Performance Guarantees & Zero-Regression Mandate

> **Zero-Regression Performance Mandate**: Telemetry, tracking, and analytics **MUST NOT** affect performance even slightly. You can **ONLY** preserve or enhance performance, never lower it. With this mindset, come up with final, flawless solutions that operate completely out of the critical rendering path and can be 100% relied upon.


1. **Non-Blocking Ingest Pipeline**:
   - `useTracker.ts` buffers events in memory and flushes them in batches every 1.5 seconds.
   - When a visitor navigates away or closes a tab, events are dispatched via `navigator.sendBeacon` or `$fetch(..., { keepalive: true })`, completely bypassing main thread execution.
2. **SQLite WAL Concurrency**:
   - The embedded database runs with `PRAGMA journal_mode = WAL;` and `PRAGMA synchronous = NORMAL;`.
   - Write operations append to the WAL journal in microseconds without acquiring table locks, ensuring simultaneous reads and writes never collide.
3. **Smart Idle Clamping**:
   - If a visitor leaves a tab open in the background, inter-event gaps $> 300\text{s}$ are clamped to 30s, and total session length is capped at 7200s. This protects analytics calculations from runaway loops and memory overhead.
