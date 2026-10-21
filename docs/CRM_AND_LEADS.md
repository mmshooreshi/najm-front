# CRM Leads & Consultation Workflow Manual (CRM_AND_LEADS.md)

This document details the sales CRM pipeline located at `/dash/requests`, the customer inquiry data structure, missed-call tracking, and SMS communication workflows.

---

## 1. CRM Overview & Operational Philosophy

The `/dash/requests` page serves as the centralized sales desk for the Najm sales and support team (e.g., Reihane and sales coordinators). It eliminates fake vanity metrics in favor of high-utility, real-world operational tools:

1. **Exact Request Timing**: Clearly distinguishes inquiries submitted today from past inquiries, resolving ambiguity around requested call windows (e.g. knowing whether a "عصر (۱۵:۰۰ الی ۱۸:۰۰)" request is for this afternoon or tomorrow).
2. **1-Click Missed-Call Logging**: Quickly records when a customer did not pick up the phone without manual form filling.
3. **Frictionless SMS Dispatch**: Offers 1-tap SMS opening on mobile devices, instant clipboard copying, and system logging.
4. **Internal Follow-up Notes**: Enables coordinators to record internal customer status (e.g. "منتظر ارسال فایل طراحی").

---

## 2. Lead Data Schema

Each lead object in PocketBase (`pages` collection, `slug="leads"`, record `z2962w7ya816ei0`) contains the following attributes:

```ts
interface LeadRecord {
  id: string                      // e.g. "req-1788211179859-yxx8"
  name: string                    // Customer contact name
  company: string                 // Company or brand name
  phone: string                   // Clean mobile/phone number
  category: string                // e.g. "luxury-hardbox", "folding-carton"
  quantity: string                // e.g. "۲,۵۰۰ عدد"
  timeSlot: string                // e.g. "عصر (۱۵:۰۰ الی ۱۸:۰۰)"
  mockupRequested: boolean        // Whether client requested a physical 3D sample
  description: string             // Custom notes or specifications from client
  
  // Timing & Origin
  created: string                 // Jalali date string, e.g. "۲۱ شهریور ۱۴۰۵"
  createdAt: string               // ISO 8601 string, e.g. "2026-09-12T05:30:00.000Z"
  createdTime: string             // Tehran 24h clock, e.g. "۰۹:۳۰"
  timestamp: number               // Millisecond Unix epoch
  sourcePage: string              // URL path where request was submitted
  referer: string                 // Traffic source (e.g. "ورود مستقیم", Google)
  device: string                  // "Mobile" or "Desktop"
  timeOnSite: string              // Duration user spent before submitting
  journey: string                 // Navigation trail on site

  // CRM Pipeline State
  status: 'new' | 'called_no_answer' | 'contacted' | 'completed' | 'cancelled'
  callAttempts: number            // Number of attempted outbound phone calls
  lastCalledAt: string | null     // e.g. "امروز ساعت ۱۱:۴۵"
  notes: string                   // Internal team comments
  smsSentCount: number            // Total SMS notifications sent
  lastSmsAt: string | null        // Date/time of last SMS
  callHistory: Array<{            // Audit trail of calls and messages
    type: 'call' | 'sms'
    timestamp: number
    dateStr: string
    result?: string
    template?: string
    preview?: string
  }>
}
```

---

## 3. Pipeline Stages & Status Machine

```
  [ New Inquiry / جدید ]  ──────┐ (Customer submits form)
           │                    │
           ├────────────────────┼──────────────┐
           ▼                    ▼              ▼
 📵 Called - No Answer     📞 Contacted    ❌ Cancelled
    (تماس بی‌پاسخ)        (تماس موفق)      (انصراف)
           │                    │
           ├────────────────────┘
           ▼
  ✅ Completed / Quote Issued
    (پیش‌فاکتور صادر شد)
```

| Status | Badge Color | Meaning & Action |
|--------|-------------|------------------|
| `new` | Emerald (`bg-emerald-500/15`) | Unreviewed inquiry. Immediate action required. |
| `called_no_answer` | Rose (`bg-rose-500/15`) | Sales team called but received no answer. SMS follow-up triggered. |
| `contacted` | Amber (`bg-amber-500/15`) | Successful conversation held. Specifications in discussion. |
| `completed` | Blue (`bg-blue-500/15`) | Formal quote or 3D mockup delivered. Order in production or closed. |
| `cancelled` | Zinc (`bg-zinc-800`) | Invalid inquiry or client decided not to proceed. |

---

## 4. 1-Click Missed-Call Workflow (`recordMissedCall`)

When a coordinator calls a lead and there is no answer:
1. Coordinator clicks **«📵 تماس گرفتیم پاسخ نداد»** on the lead card.
2. The system executes:
   ```ts
   async function recordMissedCall(req: any) {
     const now = new Date()
     const timeStr = new Intl.DateTimeFormat('fa-IR', {
       timeZone: 'Asia/Tehran',
       hour: '2-digit',
       minute: '2-digit'
     }).format(now)

     req.callAttempts = (req.callAttempts || 0) + 1
     req.status = 'called_no_answer'
     req.lastCalledAt = `امروز ساعت ${timeStr}`

     await $fetch(`/api/admin/requests/${req.id}`, {
       method: 'PATCH',
       body: {
         status: req.status,
         callAttempts: req.callAttempts,
         lastCalledAt: req.lastCalledAt
       }
     })

     openSmsModal(req, 'missed_call')
   }
   ```
3. The UI automatically displays the incremented attempt count (`۲ بار تماس بی‌پاسخ`) and pops open the SMS Follow-up modal.

---

## 5. SMS Notification Templates & Dispatch Options

### The 3 Standard Templates

#### Template 1: Missed Call (الگوی اختصاصی ریحانه)
```
سلام وقت بخیر
از مجتمع چاپ و بسته‌بندی نجم تماس گرفتم خدمتتون جهت پیگیری سفارشتون. هر زمان تمایل داشتید تماس بگیرید در خدمتتون هستیم.
با تشکر
📞 ۰۲۱۶۶۷۹۷۹۱۱
📱 ۰۹۹۰۳۴۰۰۰۷۴
```

#### Template 2: Quote Ready (صدور پیش‌فاکتور)
```
[نام] عزیز، پیش‌فاکتور استعلام سفارش شما در مجتمع چاپ و بسته‌بندی نجم صادر گردید. جهت دریافت فایل یا هماهنگی نهایی با شماره ۰۲۱۶۶۷۹۷۹۱۱ یا واتس‌اپ ۰۹۹۰۳۴۰۰۰۷۴ در تماس باشید.
```

#### Template 3: 3D Mockup Ready (آماده‌سازی ماکت و تیغ)
```
[نام] عزیز، ماکت سه‌بعدی و فایل قالب تیغ بسته‌بندی شما آماده بررسی است. کارشناسان ما آماده پاسخگویی و اعمال تغییرات هستند. مجتمع چاپ نجم ۰۲۱۶۶۷۹۷۹۱۱
```

### Dispatch Channels
1. **Native Mobile SMS (`sms:...`)**:
   - Uses `sms:${phone}?body=${encodeURIComponent(text)}`.
   - On iOS Safari or Android Chrome, clicking **«باز کردن در پیامک موبایل»** immediately opens the native Messages app with the customer's phone number and message pre-filled.
2. **1-Click Copy**:
   - Copies the full personalized message to the clipboard for pasting into WhatsApp, Bale, or SMS web panels.
3. **System Dispatch (`POST /api/admin/requests/sms`)**:
   - Records the dispatch in the lead's history (`smsSentCount++`).
   - If an SMS gateway key (`KAVENEGAR_API_KEY` or `SMS_API_KEY`) is active in environment variables, sends via HTTP API; otherwise logs gracefully.
