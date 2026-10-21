# SEO, AEO & Multi-Locale Architecture Manual (SEO_AEO_AND_I18N.md)

> **Repository**: [mmshooreshi/najm-front](https://github.com/mmshooreshi/najm-front)  
> **Production Target**: [chapenajm.com](https://chapenajm.com)  
> **Primary Keyword Target**: `چاپ جعبه مقوایی` (Cardboard Box Printing & Packaging)  
> **Target Audience**: AI Agents & Engineers  

---

## 1. Multi-Locale Strategy & URL Architecture

| Dimension | 🇮🇷 Persian (`fa`, Root `/`) | 🇬🇧 English (`en`, `/en/...`) | 🇦🇪 / 🇮🇶 Arabic (`ar`, `/ar/...`) |
| :--- | :--- | :--- | :--- |
| **Primary Audience** | Iranian FMCG, pharmaceutical, cosmetic, food & saffron brands. | International procurement officers, Eurasian & European B2B buyers. | GCC & Iraqi importers (UAE, Iraq, Oman, Qatar) seeking luxury rigid boxes & commercial packaging. |
| **Core Keyword Pillars** | • `چاپ جعبه مقوایی`<br>• `تولید جعبه مقوایی دارویی`<br>• `چاپ هاردباکس لوکس`<br>• `جعبه ایندربرد فودگرید`<br>• `چاپ افست ۵ رنگ هایدلبرگ` | • `Custom Folding Carton Manufacturer`<br>• `Rigid Hardbox Packaging Supplier`<br>• `5-Color Heidelberg Offset Printing`<br>• `Pharmaceutical SBS Invercote Boxes` | • `طباعة علب كرتون مقوى`<br>• `تصنيع صناديق هاردبوكس فاخرة`<br>• `علب أدوية ومستحضرات تجميل إنفربورد`<br>• `طباعة أوفست ۵ ألوان هايدلبرغ` |
| **Route Architecture** | Base Nuxt routes (e.g. `/products/packaging/boxes`). Redirection from `/fa/*` to clean root via 301. | Cloned via `pages:extend` in `nuxt.config.ts`, prepended with `/en/`. | Cloned via `pages:extend` in `nuxt.config.ts`, prepended with `/ar/`. |
| **Commercial CTA** | دریافت ماکت سه بعدی رایگان ظرف ۴۸ ساعت / استعلام قیمت آنلاین. | Download Vector Dieline & Request Export Quotation. | طلب عينة ماكيت ثلاثي الأبعاد مجاناً / استعلام عروض الأسعار والتصدير. |

---

## 2. Technical SEO & Schema.org Graph Engine (`composables/useAppSeo.ts`)

### A. Reciprocal Hreflang & Canonical Links
Every public page dynamically emits reciprocal alternate tags:
```html
<link rel="alternate" hreflang="fa" href="https://chapenajm.com/path" />
<link rel="alternate" hreflang="en" href="https://chapenajm.com/en/path" />
<link rel="alternate" hreflang="ar" href="https://chapenajm.com/ar/path" />
<link rel="alternate" hreflang="x-default" href="https://chapenajm.com/path" />
```
- Open Graph tags inject localized `og:locale` (`fa_IR`, `en_US`, `ar_SA`) and bidirectional `og:locale:alternate`.
- Canonical URLs strictly reflect the locale prefix without cross-contamination.

### B. Schema.org Entity Graph (`@graph`)
1. **`Organization` Node**: Multilingual legal name, telephone (`۰۲۱-۶۶۷۹۷۹۱۱ الی ۱۳`), factory address, ISO 12647-2 color certification, and export coverage:
   ```json
   "areaServed": ["IR", "AE", "IQ", "OM", "TR"]
   ```
   Machinery specs explicitly listed in `knowsAbout` (Heidelberg Speedmaster XL 106, Roland 700/200, Bobst Novacut 106 E, Heidelberg Diana Easy 115).
2. **`LocalBusiness` Node**: Geocoordinates (`35.6735935, 51.3085833`), Google Maps CID, operating hours, currencies accepted (`IRR, AED, EUR, USD`).
3. **`BreadcrumbList` Node**: Hierarchy depth check ensures root single-item breadcrumbs are suppressed, eliminating Google Search Console structural warnings.
4. **`FAQPage` Node**: Pre-rendered industrial FAQs in 3 languages (covering MOQ, machinery fleet, 48-hour mockup turnaround, and food-grade substrate certification).

---

## 3. AEO (Answer Engine Optimization) & `/llms.txt`

To ensure citation by AI Answer Engines (Perplexity AI, ChatGPT Search, Gemini, Claude, Google SGE):
- **LLM Manifest**: Located at [`public/llms.txt`](file:///Users/mamthenebo/Me/projects/najm/najm-front/public/llms.txt) and [`public/llms-full.txt`](file:///Users/mamthenebo/Me/projects/najm/najm-front/public/llms-full.txt).
- **Head Link**: Emitted in SSR head:
  ```html
  <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Knowledge File" />
  ```
- **Technical Specs Included**:SBS/FBB Ivory grammages (250–350g), Duplex Greyback (280–400g), MOQs (1,000 folding cartons, 500 rigid boxes), Fogra39 color profile guidelines, and Rich Black formula (`C:50 M:40 Y:30 K:100`).

---

## 4. Google SERP Realities & Critical Fix Directives

Based on live Google search inspection for `site:chapenajm.com`:

### ⚠️ Real-World Issue 1: Footer Boilerplate Snippet Cannibalization
- **Symptom**: Google substituted unique descriptions across `/resources`, `/facilities`, `/services`, `/packaging`, and `/faq` with the identical footer text (*"از طراحی ساختاری و مهندسی خطوط تیغ تا چاپ ۵ رنگ افست هایدلبرگ..."*).
- **Fix**: Wrap the global footer in `<footer data-nosnippet>` to prevent search engines from extracting global boilerplate as page description snippets.

### ⚠️ Real-World Issue 2: Dynamic Future Dates in Snippets
- **Symptom**: Google SERP snippets displayed future dates (`Oct 2026`).
- **Root Cause**: `server/routes/sitemap.xml.ts` generated `<lastmod>` on the fly using `new Date().toISOString()`.
- **Fix**: Replace dynamic `new Date()` with actual modification timestamps from JSON schemas / PocketBase records.

### ⚠️ Real-World Issue 3: Google Images Identical Title Flaw
- **Symptom**: All indexed images in Google Images displayed the exact same title: *مجتمع چاپ و بسته‌بندی نجم | چاپ افست و جعبه‌سازی*.
- **Fix**: Ensure every `<img>` has a unique, descriptive `:alt` attribute (e.g. `:alt="'جعبه دارویی ایندربرد چاپ افست ۵ رنگ - ' + product.name"`) and inject `ImageObject` into Schema.org graph.

### ⚠️ Real-World Issue 4: Core Pillar Page for `چاپ جعبه مقوایی`
- **Symptom**: No indexed landing page was explicitly titled or optimized for the primary B2B term: **`چاپ جعبه مقوایی`**.
- **Fix**: Align `/products/packaging/boxes` (or create `/products/packaging/cardboard-boxes`) with target H1: **`چاپ جعبه مقوایی | تولید صنعتی جعبه‌های ایندربرد و هاردباکس`**. Embed SBS/Duplex specifications and direct dieline downloads.

---

## 5. Performance, Core Web Vitals (CWV) & Zero-Regression Mandate

> **Zero-Regression Performance Mandate**: SEO meta generation, schema graphs, and multi-locale routing **MUST NOT** affect performance even slightly. You can **ONLY** preserve or enhance performance, never lower it. With this mindset, come up with final, flawless solutions that maintain sub-millisecond generation and zero hydration cost.


1. **Zero-Latency SSR Schema Generation**:
   - In `composables/useAppSeo.ts`, Schema.org `@graph` JSON-LD is computed synchronously in-memory during SSR.
   - It emits inert static `<script type="application/ld+json">` tags into the HTML head, adding zero runtime reactivity or client-side hydration overhead.
2. **Font Loading & Cumulative Layout Shift (CLS)**:
   - Fonts (`IRANSansX` for FA/AR, `Geist` for EN) must specify `font-display: swap` with precalculated fallback font metrics.
   - Preserves sub-second First Contentful Paint (FCP) and prevents layout shifts during initial paint.
3. **Canonical Static Link Injection**:
   - `hreflang` alternate links are injected statically during SSR, preventing search engines from needing to run heavy JavaScript execution to discover language variants.
