<!-- pages/dashboard/map/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="space-y-6 max-w-full">
    <!-- Header Banner -->
    <div class="flex flex-col gap-4 rounded-2xl bg-[#0b141a] p-5 sm:p-6 text-white border border-gray-800 shadow-md md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          {{ isRTL ? 'نقشه زنده اکوسیستم (۱۰۰٪ پوشش)' : 'Live Ecosystem Canvas (100% Coverage)' }}
        </div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-d4">
          {{ isRTL ? 'نقشه جامع معماری و سیت‌مپ تعاملی' : 'Interactive System Architecture Map' }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
          {{ isRTL
            ? 'نمای کامل تمام صفحات، کامپوننت‌ها، مدال‌ها، کامپوزبل‌های SWR، دیتابیس PocketBase و APIهای سیستم با قابلیت درگ، زوم و بازرسی جزئیات.'
            : 'Interactive visual map of all pages, components, modals, SWR composables, PocketBase collections, and server API endpoints.' }}
        </p>
      </div>

      <!-- Quick Canvas Controls -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          @click="resetZoom"
          class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 transition flex items-center gap-1 cursor-pointer"
        >
          <Icon name="mdi:aspect-ratio" class="w-4 h-4" />
          {{ isRTL ? 'بازتنظیم زوم' : 'Reset Zoom' }}
        </button>
        <button
          @click="zoomIn"
          class="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition cursor-pointer"
          title="Zoom In"
        >
          <Icon name="mdi:magnify-plus-outline" class="w-4.5 h-4.5" />
        </button>
        <button
          @click="zoomOut"
          class="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition cursor-pointer"
          title="Zoom Out"
        >
          <Icon name="mdi:magnify-minus-outline" class="w-4.5 h-4.5" />
        </button>
      </div>
    </div>

    <!-- Category Filter Tabs Bar -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="activeCategory = cat.id"
        class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-d4"
        :class="[
          activeCategory === cat.id
            ? 'bg-najmgreen text-white shadow-xs border border-emerald-600'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
      >
        {{ isRTL ? cat.labelFa : cat.labelEn }} ({{ getCategoryCount(cat.id) }})
      </button>
    </div>

    <!-- Main Draggable & Zoomable Canvas Stage -->
    <div
      ref="canvasContainerRef"
      class="relative w-full h-[650px] rounded-3xl bg-[#090d12] border border-gray-800 overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-inner"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchstart="startTouchDrag"
      @touchmove="onTouchDrag"
      @touchend="stopDrag"
    >
      <!-- Ambient Grid Pattern Background -->
      <div
        class="absolute inset-0 pointer-events-none opacity-20"
        :style="{
          backgroundImage: 'radial-gradient(circle, #2DD4BF 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})`
        }"
      ></div>

      <!-- Transform Stage Layer -->
      <div
        class="absolute inset-0 w-full h-full transition-transform duration-75 origin-center"
        :style="{
          transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})`
        }"
      >
        <!-- Nodes Grid Container -->
        <div class="p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div
            v-for="node in filteredNodes"
            :key="node.id"
            @click.stop="selectNode(node)"
            class="bg-[#111827]/90 backdrop-blur-md rounded-2xl p-5 border transition-all duration-300 cursor-pointer group hover:scale-102 hover:shadow-xl relative overflow-hidden"
            :class="[
              selectedNode?.id === node.id
                ? 'border-emerald-400 ring-2 ring-emerald-500/20 shadow-emerald-950'
                : 'border-gray-800 hover:border-emerald-600/50'
            ]"
          >
            <!-- Node Header -->
            <div class="flex items-center justify-between mb-3">
              <span
                class="px-2.5 py-0.5 rounded-md text-[10px] font-bold text-d4 border"
                :class="getNodeBadgeClass(node.category)"
              >
                {{ getNodeCategoryLabel(node.category) }}
              </span>
              <Icon :name="node.icon" class="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
            </div>

            <!-- Node Title & Path -->
            <h3 class="text-sm font-bold text-white text-d4 group-hover:text-emerald-300 transition-colors mb-1">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </h3>
            <p class="text-[11px] font-mono text-gray-400 truncate ltr text-left mb-3">
              {{ node.path }}
            </p>

            <!-- Description -->
            <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
              {{ isRTL ? node.descFa : node.descEn }}
            </p>

            <!-- Tags Footer -->
            <div class="flex items-center gap-1.5 flex-wrap pt-3 border-t border-gray-800">
              <span
                v-for="tag in node.tags"
                :key="tag"
                class="px-2 py-0.5 rounded-md bg-gray-800 text-[10px] font-mono text-gray-300"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Node Detail Inspector Modal / Drawer -->
    <transition name="drawer-slide">
      <div
        v-if="selectedNode"
        class="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0e1620] border-l border-gray-800 text-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div class="space-y-6">
          <!-- Drawer Header -->
          <div class="flex items-center justify-between border-b border-gray-800 pb-4">
            <div class="flex items-center gap-2">
              <Icon :name="selectedNode.icon" class="w-6 h-6 text-emerald-400" />
              <span class="text-xs font-bold text-emerald-300 font-mono">گره شماره #{{ selectedNode.id }}</span>
            </div>
            <button
              @click="selectedNode = null"
              class="p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>

          <!-- Title & Path -->
          <div class="space-y-2 text-right">
            <span
              class="inline-block px-3 py-1 rounded-md text-xs font-bold text-d4 border"
              :class="getNodeBadgeClass(selectedNode.category)"
            >
              {{ getNodeCategoryLabel(selectedNode.category) }}
            </span>
            <h2 class="text-xl font-extrabold text-white text-d4">
              {{ isRTL ? selectedNode.titleFa : selectedNode.titleEn }}
            </h2>
            <div class="p-3 rounded-xl bg-gray-900 border border-gray-800 font-mono text-xs text-emerald-400 ltr overflow-x-auto">
              {{ selectedNode.path }}
            </div>
          </div>

          <!-- Description & Architectural Role -->
          <div class="space-y-2 text-right">
            <h3 class="text-xs font-bold text-gray-400 text-d4">توضیحات و نقش معماری</h3>
            <p class="text-xs text-gray-300 leading-relaxed bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
              {{ isRTL ? selectedNode.descFa : selectedNode.descEn }}
            </p>
          </div>

          <!-- Technical Specs -->
          <div class="space-y-2 text-right">
            <h3 class="text-xs font-bold text-gray-400 text-d4">مشخصات فنی و وابستگی‌ها</h3>
            <div class="space-y-2">
              <div
                v-for="(val, key) in selectedNode.specs"
                :key="key"
                class="flex items-center justify-between p-2.5 rounded-xl bg-gray-900 text-xs border border-gray-800/60"
              >
                <span class="text-gray-400 font-mono">{{ key }}</span>
                <span class="font-bold text-gray-200 font-mono">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Links Footer -->
        <div class="pt-6 border-t border-gray-800 space-y-2">
          <NuxtLink
            v-if="selectedNode.actionUrl"
            :to="selectedNode.actionUrl"
            class="block w-full py-3 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs text-center transition shadow-xs text-d4"
          >
            {{ isRTL ? 'مشاهده و پیمایش گره' : 'Navigate to Node' }}
          </NuxtLink>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'dashboard',
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

// Canvas Drag & Zoom State
const panX = ref(0)
const panY = ref(0)
const zoomScale = ref(1)
const isDragging = ref(false)
let dragStartX = 0
let dragStartY = 0

function startDrag(e: MouseEvent) {
  isDragging.value = true
  dragStartX = e.clientX - panX.value
  dragStartY = e.clientY - panY.value
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return
  panX.value = e.clientX - dragStartX
  panY.value = e.clientY - dragStartY
}

function startTouchDrag(e: TouchEvent) {
  isDragging.value = true
  dragStartX = e.touches[0].clientX - panX.value
  dragStartY = e.touches[0].clientY - panY.value
}

function onTouchDrag(e: TouchEvent) {
  if (!isDragging.value) return
  panX.value = e.touches[0].clientX - dragStartX
  panY.value = e.touches[0].clientY - dragStartY
}

function stopDrag() {
  isDragging.value = false
}

function zoomIn() {
  zoomScale.value = Math.min(1.8, zoomScale.value + 0.15)
}

function zoomOut() {
  zoomScale.value = Math.max(0.6, zoomScale.value - 0.15)
}

function resetZoom() {
  panX.value = 0
  panY.value = 0
  zoomScale.value = 1
}

// Categories Filter
const activeCategory = ref('all')

const categories = [
  { id: 'all', labelFa: 'همه گره‌ها', labelEn: 'All Nodes' },
  { id: 'pages', labelFa: 'صفحات و مسیرها (Sitemap)', labelEn: 'Pages & Sitemap' },
  { id: 'components', labelFa: 'کامپوننت‌ها و مدال‌ها', labelEn: 'Components & Modals' },
  { id: 'composables', labelFa: 'کامپوزبل‌ها و SWR', labelEn: 'Composables & SWR' },
  { id: 'pb', labelFa: 'دیتابیس PocketBase', labelEn: 'PocketBase Database' },
  { id: 'api', labelFa: 'سرویس‌های API سرور', labelEn: 'Server APIs' },
  { id: 'infra', labelFa: 'موتور و زیرساخت', labelEn: 'Engine & Infra' },
]

interface NodeItem {
  id: string
  category: string
  titleFa: string
  titleEn: string
  path: string
  descFa: string
  descEn: string
  icon: string
  tags: string[]
  specs: Record<string, string>
  actionUrl?: string
}

const nodes: NodeItem[] = [
  // 1. Pages
  {
    id: 'page-home',
    category: 'pages',
    titleFa: 'صفحه اصلی (Home)',
    titleEn: 'Home Page',
    path: 'pages/index.vue',
    descFa: 'صفحه اصلی فرانت‌اند شامل صحنه‌های سه بعدی، ویدیوها، کاتالوگ و فرم‌های استعلام.',
    descEn: 'Main frontend landing page with 3D scenes, videos, catalogs, and quote forms.',
    icon: 'mdi:home-outline',
    tags: ['Nuxt', 'GSAP', 'MiniSearch'],
    specs: { Layout: 'default', Route: '/', Status: 'Active 200 OK' },
    actionUrl: '/'
  },
  {
    id: 'page-about',
    category: 'pages',
    titleFa: 'درباره ما (About Us)',
    titleEn: 'About Us Page',
    path: 'pages/about/index.vue',
    descFa: 'روایت صنعتی، تیم متخصص، استانداردهای کیفی و خط پین‌شده GSAP برای راهکارها.',
    descEn: 'Industrial vision, team leads, quality standards, and GSAP pinned slides.',
    icon: 'mdi:information-outline',
    tags: ['GSAP', 'StaffImg', 'Fleet'],
    specs: { Layout: 'default', Route: '/about', Status: 'Active 200 OK' },
    actionUrl: '/about'
  },
  {
    id: 'page-products',
    category: 'pages',
    titleFa: 'کاتالوگ محصولات (Products)',
    titleEn: 'Products Catalog',
    path: 'pages/products/index.vue',
    descFa: '۱۲ نوع محصول واقعی با موکاپ وکتور SVG، فیلتر دسته‌بندی و حالت دوگانه شبکه/لیست.',
    descEn: '12 authentic products with SVG mockups, category tabs, and dual Grid/List view.',
    icon: 'mdi:package-variant-closed',
    tags: ['SVG', 'Grid/List', 'Filters'],
    specs: { Layout: 'default', Route: '/products', Status: 'Active 200 OK' },
    actionUrl: '/products'
  },
  {
    id: 'page-history',
    category: 'pages',
    titleFa: 'تاریخچه ۲۵ ساله (History)',
    titleEn: '25-Year History Timeline',
    path: 'pages/history.vue',
    descFa: 'تایم‌لاین کرونولوژیک تحولات لیتوگرافی، ماشین‌های هایدلبرگ و بوبست از ۱۳۷۸ تا ۱۴۰۴.',
    descEn: 'Chronological timeline of Heidelberg and Bobst acquisitions from 1999 to 2026.',
    icon: 'mdi:timeline-text-outline',
    tags: ['Timeline', 'Milestones', '1999-2026'],
    specs: { Layout: 'default', Route: '/history', Status: 'Active 200 OK' },
    actionUrl: '/history'
  },
  {
    id: 'page-blog',
    category: 'pages',
    titleFa: 'وبلاگ تخصصی (Blog)',
    titleEn: 'Blog Ecosystem',
    path: 'pages/blog/index.vue',
    descFa: 'دانشنامه مقایسه ایندربرد و پشت طوسی، سلفون مخملی و استانداردهای صادرات.',
    descEn: 'Printing knowledge base, material comparisons, and packaging design rules.',
    icon: 'mdi:post-outline',
    tags: ['Blog', 'Prepress', 'Articles'],
    specs: { Layout: 'default', Route: '/blog', Status: 'Active 200 OK' },
    actionUrl: '/blog'
  },
  {
    id: 'page-faq',
    category: 'pages',
    titleFa: 'سوالات متداول (FAQ Help)',
    titleEn: 'FAQ Help Center',
    path: 'pages/help/faq.vue',
    descFa: 'مرکز راهنمای آکاردئونی دسته‌بندی‌شده برای تیراژ، آماده‌سازی فایل و ارسال.',
    descEn: 'Categorized accordion help center for minimum quantities and pre-press.',
    icon: 'mdi:help-circle-outline',
    tags: ['Accordion', 'Ordering', 'Support'],
    specs: { Layout: 'default', Route: '/help/faq', Status: 'Active 200 OK' },
    actionUrl: '/help/faq'
  },
  {
    id: 'page-dashboard-cms',
    category: 'pages',
    titleFa: 'مدیریت CMS صفحات (Dashboard CMS)',
    titleEn: 'Page CMS Studio',
    path: 'pages/dashboard/cms/index.vue',
    descFa: 'ویرایشگر درگاه پیش‌نویس با کارت‌های آکاردئونی و ویرایش مستقیم فیلدها روی نوار سربرگ.',
    descEn: 'In-place CMS page studio with collapsible section cards and live draft saving.',
    icon: 'mdi:file-document-edit-outline',
    tags: ['CMS', 'In-Place', 'Drafts'],
    specs: { Layout: 'admin', Route: '/dashboard/cms', Status: 'Admin Only' },
    actionUrl: '/dashboard/cms'
  },
  {
    id: 'page-dashboard-media',
    category: 'pages',
    titleFa: 'مخزن رسانه و فایل‌ها (Media Lab)',
    titleEn: 'Media Studio',
    path: 'pages/dashboard/media/index.vue',
    descFa: 'مدیریت پوشه‌های درختی توئیده recursive با فیلتر پسوند، جستجو و ساخت لینک CDN.',
    descEn: 'Recursive directory tree media manager with search, extension filters, and CDN links.',
    icon: 'mdi:folder-multiple-image',
    tags: ['Tree', 'Folders', 'CDN'],
    specs: { Layout: 'admin', Route: '/dashboard/media', Status: 'Admin Only' },
    actionUrl: '/dashboard/media'
  },

  // 2. Components & Modals
  {
    id: 'comp-search-modal',
    category: 'components',
    titleFa: 'مدال جستجوی زنده (SearchModal)',
    titleEn: 'Live Search Modal',
    path: 'components/atom/SearchModal.vue',
    descFa: 'موتور جستجوی ایندکس‌شده MiniSearch در فرانت‌اند با حافظه تاریخچه جستجو.',
    descEn: 'Client-side MiniSearch indexing modal with persistent search history.',
    icon: 'mdi:magnify',
    tags: ['MiniSearch', 'Modal', 'Reactive'],
    specs: { Type: 'Atom Component', Engine: 'MiniSearch 0.7' }
  },
  {
    id: 'comp-solutions-showcase',
    category: 'components',
    titleFa: 'نمایشگر راهکارها (SolutionsShowcase)',
    titleEn: 'Solutions Showcase',
    path: 'components/about/SolutionsShowcase.vue',
    descFa: 'تایم‌لاین تعاملی ۰۱ الی ۰۴ با نوار زمان پیشرفت و تغییر فریم عکس‌های وضوح بالا.',
    descEn: 'Interactive step timeline with progress timer line and image cross-fading.',
    icon: 'mdi:view-carousel-outline',
    tags: ['Timeline', 'TimerBar', 'Fade'],
    specs: { Type: 'About Component', Transitions: 'Vue Dynamic' }
  },

  // 3. Composables & SWR
  {
    id: 'comp-usepageui',
    category: 'composables',
    titleFa: 'کامپوزبل SWR (usePageUI)',
    titleEn: 'SWR Page UI Composable',
    path: 'composables/ui/usePageUI.ts',
    descFa: 'لود فوری ۰ میلی‌ثانیه با اسکیماهای محلی JSON و به‌روزرسانی ریداکتیو از PocketBase.',
    descEn: '0ms instant hydration via local JSON schemas + background PocketBase sync.',
    icon: 'mdi:flash-outline',
    tags: ['SWR', '0ms Cache', 'Eager JSON'],
    specs: { Caching: 'SWR 0ms', Source: 'schemas/*-ui.json + PB' }
  },

  // 4. PocketBase Collections
  {
    id: 'pb-pages',
    category: 'pb',
    titleFa: 'کالکشن اسکیماها (pages)',
    titleEn: 'Pages Collection',
    path: 'PocketBase: pages',
    descFa: 'نگهداری داده‌های سه زبانه uiData (FA, EN, AR) برای تمام ۱۱ صفحه اصلی سایت.',
    descEn: 'Stores trilingual JSON UI data for all 11 public pages.',
    icon: 'mdi:database-outline',
    tags: ['PocketBase', 'JSON', 'Trilingual'],
    specs: { Schema: 'slug, uiData, title', Type: 'Base Collection' }
  },
  {
    id: 'pb-products',
    category: 'pb',
    titleFa: 'کالکشن محصولات (products)',
    titleEn: 'Products Collection',
    path: 'PocketBase: products',
    descFa: 'نگهداری مشخصات فنی، قیمت، تیراژ، دسته‌بندی و موکاپ‌های وکتور محصولات.',
    descEn: 'Stores product catalog specs, min quantity, pricing, and SVG mockups.',
    icon: 'mdi:cube-outline',
    tags: ['PocketBase', 'Products', 'Specs'],
    specs: { Schema: 'name, slug, sections', Type: 'Base Collection' }
  },

  // 5. Server API Endpoints
  {
    id: 'api-publish',
    category: 'api',
    titleFa: 'ای‌پی‌آی انتشار محتوا (ui/publish)',
    titleEn: 'Publish UI API',
    path: 'server/api/admin/ui/publish.post.ts',
    descFa: 'تایید و انتشار پیش‌نویس‌های CMS روی دیتابیس اصلی PocketBase.',
    descEn: 'Publishes draft UI schemas to production PocketBase records.',
    icon: 'mdi:cloud-upload-outline',
    tags: ['H3', 'Nitro', 'Server API'],
    specs: { Method: 'POST', Endpoint: '/api/admin/ui/publish' }
  },

  // 6. Infrastructure & Engine
  {
    id: 'infra-nitro',
    category: 'infra',
    titleFa: 'موتور Nitro Server',
    titleEn: 'Nitro Engine',
    path: 'nuxt.config.ts -> nitro',
    descFa: 'پکیجینگ بهینه تابع سرورلس Vercel با فشرده‌سازی پابلیک و حذف Sourcemap سنگین.',
    descEn: 'Optimized Vercel serverless function packaging with asset compression.',
    icon: 'mdi:server-network',
    tags: ['Vercel', 'Nitro', 'Edge'],
    specs: { Preset: 'vercel', Compression: 'Enabled' }
  }
]

const selectedNode = ref<NodeItem | null>(null)

function selectNode(node: NodeItem) {
  selectedNode.value = node
}

function getCategoryCount(catId: string) {
  if (catId === 'all') return nodes.length
  return nodes.filter(n => n.category === catId).length
}

const filteredNodes = computed(() => {
  if (activeCategory.value === 'all') return nodes
  return nodes.filter(n => n.category === activeCategory.value)
})

function getNodeCategoryLabel(catId: string) {
  const cat = categories.find(c => c.id === catId)
  if (!cat) return catId
  return isRTL.value ? cat.labelFa : cat.labelEn
}

function getNodeBadgeClass(catId: string) {
  switch (catId) {
    case 'pages': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    case 'components': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    case 'composables': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    case 'pb': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    case 'api': return 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    case 'infra': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    default: return 'bg-gray-800 text-gray-300 border-gray-700'
  }
}
</script>

<style scoped>
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
