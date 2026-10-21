# Frontend & Visual CMS Guide (FRONTEND_AND_CMS.md)

This guide documents the frontend architecture of the Najm project, including page organization, the inline visual editing engine, multilingual RTL handling, and mobile performance patterns.

---

## 1. Component & Page Structure

```
najm-front/
├── layouts/
│   ├── default.vue          # Public site layout (Header, Smooth Scroll, Footer2, Floating Widgets)
│   ├── services.vue         # Industrial services layout with sticky sub-navigation
│   └── dash.vue             # Admin dashboard layout (Sidebar, Header, Mobile Nav, Notification stream)
├── pages/
│   ├── index.vue            # Main landing page (Hero, SceneServicesAndCapabilities, Showcase, Numbers)
│   ├── consultation/        # Quote request, material selection & 3D mockup order flow
│   ├── about.vue            # Company history, vision, factory certificates
│   ├── contact.vue          # Direct factory contact, interactive map, department contacts
│   ├── facilities.vue       # Heidelberg machinery, CTP lithography, box-making floor
│   ├── services/[slug].vue  # Dynamic service details (offset printing, finishing, packaging)
│   ├── products/            # Catalog sections (packaging, printing, industries)
│   ├── resources/[slug].vue # Die-cut template downloads & CMYK technical guides
│   ├── blog/[slug].vue      # Packaging industry articles & news
│   └── dash/                # Admin CRM, Content, Media, and System pages
```

---

## 2. The Visual Live Editor System (`?edit=true`)

The Najm platform features an in-context visual CMS allowing administrators to edit copy, images, and links directly on the live website.

### How to Make Any Component Editable
To connect any component to the visual editor:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'

const { isRTL, localePath } = useLocale()

// 1. Bind to the page's canonical slug
const { data: pageData, isEditMode } = useAdminEditable('about')

// 2. Computed helpers with fallbacks
const heroTitle = computed(() => pageData.value?.hero?.title || 'پیشرو در چاپ و بسته‌بندی')
</script>

<template>
  <section class="py-16">
    <!-- 3. Add v-editable directive with dot-notation path -->
    <h1 v-editable="'hero.title'" class="text-3xl font-bold">
      {{ heroTitle }}
    </h1>

    <p v-editable="'hero.description'" class="text-gray-600">
      {{ pageData.hero?.description }}
    </p>

    <!-- For array items, pass index: -->
    <div v-for="(item, idx) in pageData.features" :key="idx">
      <h3 v-editable="`features.${idx}.title`">{{ item.title }}</h3>
    </div>
  </section>
</template>
```

### The Editing Lifecycle
1. **Visitor Mode**:
   - `isEditMode` is `false`.
   - Data is fetched server-side or via `/api/content/[slug]`.
   - Directives remain inert with zero visual overhead.
2. **Admin Mode (`?edit=true`)**:
   - `AdminEditBar.client.vue` appears as a bottom floating toolbar.
   - Elements with `v-editable` receive subtle dashed outlines on hover.
   - Clicking an element opens an inline input popover or prompt.
   - Edits are immediately staged in the browser's `localStorage` (`admin_drafts_<slug>`).
   - The UI reactively updates via custom window events.
3. **Publishing**:
   - The admin clicks **«ذخیره و انتشار تغییرات»** in the floating bar.
   - Staged changes are posted to `POST /api/admin/ui/publish`.
   - Content is written to PocketBase and local file cache.
   - `localStorage` drafts are cleared.

---

## 3. Multilingual Engine & RTL Handling

- **Managed by**: `composables/useLocale.ts`.
- **Supported Locales**:
  - `FA` (Persian, Default): `dir="rtl"`
  - `EN` (English): `dir="ltr"`
  - `AR` (Arabic): `dir="rtl"`

### Essential Patterns
1. **Preserve Language in Links**:
   Always wrap navigation paths with `localePath()`:
   ```vue
   <NuxtLink :to="localePath('/services/printing-and-packaging')">
     {{ linkText }}
   </NuxtLink>
   ```
2. **Directional Arrow & Icon Flipping**:
   When rendering directional chevrons or arrows:
   ```vue
   <svg :class="isRTL ? 'rotate-0' : 'rotate-180'"></svg>
   ```
3. **RTL Padding & Alignment**:
   Avoid bare `pl-*` or `pr-*` when direction matters. Use conditional classes:
   ```vue
   :class="[isRTL ? 'pl-8 md:pl-16' : 'pr-8 md:pr-16']"
   ```

---

## 4. Mobile & Touch Performance Rules

### 1. Interactive Sliders & Full-Bleed Displays (`ImagesFloating.vue`)
- **Viewport Span**: Use `w-screen` rather than `w-full max-w-full` inside padded containers to avoid horizontal margin gaps on mobile devices.
- **Vertical Scroll Passthrough**: Always apply `touch-pan-y` to carousel elements so vertical swipes allow the page to scroll smoothly without trapping the user's thumb.
- **Mouse vs Touch Physics**: Only bind mouse drag events (`mousedown`/`mousemove`) on desktop. On touch devices, preserve native browser inertial scroll.

### 2. Navigation Drawer (`Drawer.vue`)
- **Solid Sliding Surfaces**: Never stagger child items during slide-in enter animations. Moving the drawer as a unified solid panel eliminates GPU composite frame drops.
- **Directional Anchors**:
  - RTL: `left-0 right-auto`
  - LTR: `right-0 left-auto`
- **Body Scroll Lock**: Unlock body scroll (`document.body.style.overflow = ''`) only during `onAfterLeave()`, preventing background page shifts while the drawer slides shut.
- **Easing**: Use fluid cubic-bezier curves:
  - Open: `0.28s cubic-bezier(0.16, 1, 0.3, 1)`
  - Close: `0.22s cubic-bezier(0.25, 1, 0.5, 1)`

### 3. Capabilities Accordion & Subtle Organic Links (`Accordion.vue`)
- Each accordion step features an organic link pill:
  ```vue
  <NuxtLink
    :to="localePath(link.url)"
    class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-najmgreen bg-najmgreen/10 hover:bg-najmgreen/20 border border-najmgreen/20"
    @click.stop
  >
    <span>{{ link.text }}</span>
  </NuxtLink>
  ```
- Use `@click.stop` to ensure clicking the navigation pill does not toggle the accordion state.
