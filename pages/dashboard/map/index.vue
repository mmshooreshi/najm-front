<!-- pages/dashboard/map/index.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-0 z-50 h-screen w-screen bg-[#f8fafc] text-slate-800 select-none overflow-hidden font-sans"
  >
    <!-- Light Theme Subtle Dot Grid Background -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div
        class="absolute inset-0 opacity-40 transition-all duration-75"
        :style="{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1.2px, transparent 1.2px)',
          backgroundSize: `${28 * zoomScale}px ${28 * zoomScale}px`,
          backgroundPosition: `${panX}px ${panY}px`
        }"
      ></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(255,255,255,0.7),rgba(241,245,249,0.95))]"></div>
    </div>

    <!-- Top Minimalist Floating Control Bar -->
    <header class="absolute top-4 inset-x-4 z-40 flex items-center justify-between pointer-events-none">
      <!-- Left: Back to Dashboard & Title -->
      <div class="flex items-center gap-3 pointer-events-auto">
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-md text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition text-xs font-bold text-d4 cursor-pointer"
        >
          <Icon name="mdi:arrow-right" class="w-4 h-4" :class="isRTL ? '' : 'rotate-180'" />
          <span>{{ isRTL ? 'بازگشت به پیشخوان' : 'Back to Dashboard' }}</span>
        </NuxtLink>

        <div class="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-md">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-extrabold text-slate-800 text-d4">{{ isRTL ? 'نقشه جامع اکوسیستم' : 'Ecosystem Map' }}</span>
        </div>
      </div>

      <!-- Center: Auto-Center Prominent Action -->
      <div class="pointer-events-auto">
        <button
          @click="resetToCenter"
          class="px-4 py-2 rounded-2xl bg-[#018786] hover:bg-emerald-800 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer text-d4 active:scale-95"
        >
          <Icon name="mdi:crosshairs-gps" class="w-4 h-4 text-emerald-200" />
          <span>{{ isRTL ? 'تمرکز در مرکز (Auto-Center)' : 'Auto-Center' }}</span>
        </button>
      </div>

      <!-- Right: Controls & Zoom -->
      <div class="flex items-center gap-2 pointer-events-auto">
        <div class="flex items-center gap-1 bg-white/90 backdrop-blur-xl p-1 rounded-2xl border border-slate-200/90 shadow-md">
          <button @click="zoomIn" class="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer" title="Zoom In">
            <Icon name="mdi:plus" class="w-4 h-4" />
          </button>
          <span class="px-2 font-mono text-xs text-emerald-700 font-bold">{{ Math.round(zoomScale * 100) }}%</span>
          <button @click="zoomOut" class="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer" title="Zoom Out">
            <Icon name="mdi:minus" class="w-4 h-4" />
          </button>
        </div>

        <button
          @click="showAnnotations = !showAnnotations"
          class="p-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-md text-xs font-bold transition cursor-pointer text-d4"
          :class="showAnnotations ? 'text-emerald-700 font-bold border-emerald-300' : 'text-slate-600 hover:text-slate-900'"
          :title="isRTL ? 'نمایش توضیحات' : 'Toggle Details'"
        >
          <Icon name="mdi:text-box-outline" class="w-4.5 h-4.5" />
        </button>
      </div>
    </header>

    <!-- Category Filter Bar (Bottom Floating Capsule) -->
    <div class="absolute bottom-5 inset-x-0 z-40 flex justify-center pointer-events-none">
      <div class="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-full px-2.5 py-1.5 flex items-center gap-1.5 overflow-x-auto max-w-[95vw] no-scrollbar">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap text-d4"
          :class="[
            activeCategory === cat.id
              ? 'bg-[#018786] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          {{ isRTL ? cat.labelFa : cat.labelEn }}
          <span class="ml-1 text-[10px] font-mono opacity-80">({{ getCategoryCount(cat.id) }})</span>
        </button>
      </div>
    </div>

    <!-- Truly Infinite Canvas Board (0 scrollbars, double click auto-center) -->
    <div
      ref="canvasStageRef"
      class="relative w-full h-full cursor-grab active:cursor-grabbing"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchstart="startTouchDrag"
      @touchmove="onTouchDrag"
      @touchend="stopDrag"
      @wheel.prevent="onWheelZoom"
      @dblclick="onCanvasDblClick"
    >
      <!-- Connected SVG Edge Lines (Translucent Light Clean Curves) -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none z-10"
        :style="{
          transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})`,
          transformOrigin: '0 0'
        }"
      >
        <g v-for="edge in visibleEdges" :key="`${edge.from}-${edge.to}`">
          <path
            :d="getEdgePath(edge)"
            fill="none"
            :stroke="isEdgeHighlighted(edge) ? '#018786' : '#cbd5e1'"
            :stroke-width="isEdgeHighlighted(edge) ? 3 : 1.5"
            class="transition-all duration-300"
          />
          <!-- Light Mode Flow Particle -->
          <circle
            v-if="isEdgeHighlighted(edge)"
            r="4"
            fill="#018786"
          >
            <animateMotion
              :path="getEdgePath(edge)"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      <!-- Spatial Nodes Layer with DISTINCT SHAPES PER CATEGORY & IMPORTANCE SIZING -->
      <div
        class="absolute inset-0 w-full h-full transition-transform duration-100 origin-top-left z-20"
        :style="{
          transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})`
        }"
      >
        <div
          v-for="node in visibleNodes"
          :key="node.id"
          @click.stop="selectNode(node)"
          @mouseenter="hoveredNodeId = node.id"
          @mouseleave="hoveredNodeId = null"
          class="absolute transition-all duration-300 cursor-pointer group"
          :style="{
            left: `${node.x}px`,
            top: `${node.y}px`
          }"
        >
          <!-- TYPE 1: CORE PAGES (SITEMAP) -> Elegant Rounded Glass Card -->
          <div
            v-if="node.category === 'pages'"
            class="rounded-3xl bg-white border shadow-lg transition-all duration-300 relative overflow-hidden"
            :class="[
              getNodeImportanceSizeClass(node.importance),
              selectedNode?.id === node.id
                ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-xl scale-105 z-30'
                : hoveredNodeId === node.id
                  ? 'border-emerald-400 shadow-md scale-102 z-20'
                  : 'border-slate-200 hover:border-slate-300 z-10'
            ]"
          >
            <!-- Top Accent Stripe -->
            <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#018786] via-teal-400 to-[#018786]"></div>

            <div class="flex items-center justify-between mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#018786] border border-teal-200 text-d4">
                {{ isRTL ? 'صفحه وبسایت' : 'Page' }}
              </span>
              <Icon :name="node.icon" class="text-slate-500 group-hover:text-[#018786] transition" :class="node.importance === 1 ? 'w-6 h-6' : 'w-5 h-5'" />
            </div>

            <h3
              class="font-extrabold text-slate-900 text-d4 group-hover:text-[#018786] transition truncate mb-1"
              :class="node.importance === 1 ? 'text-lg sm:text-xl' : 'text-sm'"
            >
              {{ isRTL ? node.titleFa : node.titleEn }}
            </h3>

            <p class="text-[10px] font-mono text-slate-400 truncate text-left ltr mb-2">
              {{ node.path }}
            </p>

            <div v-if="showAnnotations" class="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Route: {{ node.specs.Route }}</span>
              <span class="text-emerald-600 font-bold">200 OK</span>
            </div>
          </div>

          <!-- TYPE 2: COMPONENTS (UI MODALS/SECTIONS) -> Chamfered Tech Badge -->
          <div
            v-else-if="node.category === 'components'"
            class="w-60 p-4 rounded-2xl bg-white border-l-4 border-l-purple-500 border-y border-r border-slate-200 shadow-md transition-all duration-300"
            :class="[
              selectedNode?.id === node.id ? 'ring-2 ring-purple-400 scale-105' : 'hover:border-purple-300'
            ]"
          >
            <div class="flex items-center justify-between mb-1.5">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 text-d4">
                {{ isRTL ? 'کامپوننت UI' : 'UI Component' }}
              </span>
              <Icon :name="node.icon" class="w-4.5 h-4.5 text-purple-600" />
            </div>
            <h3 class="text-xs font-bold text-slate-800 text-d4 truncate mb-0.5">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </h3>
            <p class="text-[10px] font-mono text-slate-400 truncate text-left ltr">
              {{ node.path }}
            </p>
          </div>

          <!-- TYPE 3: COMPOSABLES (SWR & LOGIC) -> Sleek Pill Capsule -->
          <div
            v-else-if="node.category === 'composables'"
            class="px-5 py-2.5 rounded-full bg-amber-50/90 border border-amber-300 shadow-md flex items-center gap-3 transition-all duration-300"
            :class="[
              selectedNode?.id === node.id ? 'ring-2 ring-amber-400 scale-105' : 'hover:bg-amber-100'
            ]"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <Icon :name="node.icon" class="w-4.5 h-4.5 text-amber-700" />
            <span class="text-xs font-bold text-amber-900 text-d4 whitespace-nowrap">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </span>
          </div>

          <!-- TYPE 4: POCKETBASE DATABASE -> Cylinder / Stacked Database Card -->
          <div
            v-else-if="node.category === 'pb'"
            class="w-60 p-4 rounded-2xl bg-white border-t-4 border-t-emerald-500 border-x border-b border-slate-200 shadow-md transition-all duration-300"
            :class="[
              selectedNode?.id === node.id ? 'ring-2 ring-emerald-400 scale-105' : 'hover:border-emerald-300'
            ]"
          >
            <div class="flex items-center justify-between mb-1.5">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 text-d4">
                {{ isRTL ? 'کالکشن PocketBase' : 'PB Database' }}
              </span>
              <Icon :name="node.icon" class="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <h3 class="text-xs font-bold text-slate-800 text-d4 truncate mb-0.5">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </h3>
            <p class="text-[10px] font-mono text-slate-400 truncate text-left ltr">
              {{ node.path }}
            </p>
          </div>

          <!-- TYPE 5: SERVER APIS -> Octagon / Sharp Tech Badge -->
          <div
            v-else
            class="w-56 p-3.5 rounded-2xl bg-white border-l-4 border-l-rose-500 border-y border-r border-slate-200 shadow-md transition-all duration-300"
            :class="[
              selectedNode?.id === node.id ? 'ring-2 ring-rose-400 scale-105' : 'hover:border-rose-300'
            ]"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 text-d4">
                {{ isRTL ? 'سرویس API' : 'Server API' }}
              </span>
              <Icon :name="node.icon" class="w-4 h-4 text-rose-600" />
            </div>
            <h3 class="text-xs font-bold text-slate-800 text-d4 truncate mb-0.5">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </h3>
            <p class="text-[10px] font-mono text-slate-400 truncate text-left ltr">
              {{ node.path }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Node Detail Inspector Drawer -->
    <transition name="drawer-slide">
      <div
        v-if="selectedNode"
        class="absolute inset-y-0 right-0 z-50 w-full sm:w-96 bg-white/95 backdrop-blur-2xl border-l border-slate-200 text-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2">
              <Icon :name="selectedNode.icon" class="w-6 h-6 text-[#018786]" />
              <span class="text-xs font-bold text-[#018786] font-mono">گره #{{ selectedNode.id }}</span>
            </div>
            <button
              @click="selectedNode = null"
              class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
            >
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-2 text-right">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#018786] text-d4 border border-teal-200">
              {{ getNodeCategoryLabel(selectedNode.category) }}
            </span>
            <h2 class="text-xl font-extrabold text-slate-900 text-d4">
              {{ isRTL ? selectedNode.titleFa : selectedNode.titleEn }}
            </h2>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-emerald-800 ltr text-left overflow-x-auto">
              {{ selectedNode.path }}
            </div>
          </div>

          <div class="space-y-2 text-right">
            <h3 class="text-xs font-bold text-slate-400 text-d4">توضیحات و نقش معماری</h3>
            <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {{ isRTL ? selectedNode.descFa : selectedNode.descEn }}
            </p>
          </div>

          <div class="space-y-2 text-right">
            <h3 class="text-xs font-bold text-slate-400 text-d4">مشخصات کلیدی</h3>
            <div class="space-y-2">
              <div
                v-for="(val, key) in selectedNode.specs"
                :key="key"
                class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs border border-slate-200"
              >
                <span class="text-slate-500 font-mono">{{ key }}</span>
                <span class="font-bold text-slate-800 font-mono">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-slate-100 space-y-2">
          <NuxtLink
            v-if="selectedNode.actionUrl"
            :to="selectedNode.actionUrl"
            class="block w-full py-3 rounded-xl bg-[#018786] hover:bg-emerald-800 text-white font-bold text-xs text-center transition shadow-xs text-d4"
          >
            {{ isRTL ? 'پیمایش مستقیم به گره' : 'Navigate to Node' }}
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
  layout: false // Completely bypass layout wrappers for 100% full-screen stage
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

// Canvas Options
const showAnnotations = ref(true)
const activeCategory = ref('all')
const searchQuery = ref('')
const hoveredNodeId = ref<string | null>(null)
const selectedNode = ref<SpatialNode | null>(null)

// Infinite Canvas Drag/Pan/Zoom State
const panX = ref(120)
const panY = ref(100)
const zoomScale = ref(0.95)
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

function onWheelZoom(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -0.08 : 0.08
  zoomScale.value = Math.max(0.3, Math.min(2.2, zoomScale.value + delta))
}

function zoomIn() {
  zoomScale.value = Math.min(2.2, zoomScale.value + 0.15)
}

function zoomOut() {
  zoomScale.value = Math.max(0.3, zoomScale.value - 0.15)
}

function resetToCenter() {
  panX.value = 120
  panY.value = 100
  zoomScale.value = 0.95
}

function onCanvasDblClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('cursor-grab')) {
    resetToCenter()
  }
}

const categories = [
  { id: 'all', labelFa: 'همه گره‌ها', labelEn: 'All' },
  { id: 'pages', labelFa: 'صفحات اصلی', labelEn: 'Pages' },
  { id: 'components', labelFa: 'کامپوننت‌ها', labelEn: 'Components' },
  { id: 'composables', labelFa: 'کامپوزبل‌ها', labelEn: 'Composables' },
  { id: 'pb', labelFa: 'دیتابیس PB', labelEn: 'Database' },
  { id: 'api', labelFa: 'ای‌پی‌آی سرور', labelEn: 'APIs' },
]

interface SpatialNode {
  id: string
  category: 'pages' | 'components' | 'composables' | 'pb' | 'api'
  importance: number // 1: Core Hub, 2: Large, 3: Medium
  titleFa: string
  titleEn: string
  path: string
  descFa: string
  descEn: string
  icon: string
  x: number
  y: number
  specs: Record<string, string>
  actionUrl?: string
}

interface Edge {
  from: string
  to: string
}

// Nodes Organized by Clear Hierarchical Columns
const allNodes: SpatialNode[] = [
  // COL 1: CORE ENTRANCES (Importance 1: Huge Cards)
  {
    id: 'home',
    category: 'pages',
    importance: 1,
    titleFa: 'صفحه اصلی (Home Hub)',
    titleEn: 'Home Main Hub',
    path: 'pages/index.vue',
    descFa: 'هسته اصلی فرانت‌اند با صحنه‌های سه بعدی و کاتالوگ.',
    descEn: 'Main frontend hub with 3D scenes and quote calculator.',
    icon: 'mdi:home-outline',
    x: 100,
    y: 80,
    specs: { Route: '/', Importance: 'Core Hub' },
    actionUrl: '/'
  },
  {
    id: 'dashboard-hub',
    category: 'pages',
    importance: 1,
    titleFa: 'پیشخوان ادمین (Dashboard)',
    titleEn: 'Admin Dashboard',
    path: 'pages/dashboard/index.vue',
    descFa: 'مرکز مدیریت دیتابیس، فایل‌ها و CMS.',
    descEn: 'Master administrative suite for database and CMS.',
    icon: 'mdi:view-dashboard-outline',
    x: 100,
    y: 380,
    specs: { Route: '/dashboard', Importance: 'Core Hub' },
    actionUrl: '/dashboard'
  },

  // COL 2: MAIN PAGES (Importance 2: Medium Cards)
  {
    id: 'about',
    category: 'pages',
    importance: 2,
    titleFa: 'درباره ما (About Us)',
    titleEn: 'About Us Page',
    path: 'pages/about/index.vue',
    descFa: 'روایت صنعتی و خط 360vh راهکارها.',
    descEn: 'Industrial history and 360vh solutions.',
    icon: 'mdi:information-outline',
    x: 480,
    y: 80,
    specs: { Route: '/about' },
    actionUrl: '/about'
  },
  {
    id: 'products',
    category: 'pages',
    importance: 2,
    titleFa: 'محصولات (Products)',
    titleEn: 'Products Catalog',
    path: 'pages/products/index.vue',
    descFa: '۱۲ محصول با موکاپ وکتور SVG.',
    descEn: '12 authentic packaging products.',
    icon: 'mdi:package-variant-closed',
    x: 480,
    y: 280,
    specs: { Route: '/products' },
    actionUrl: '/products'
  },

  // COL 3: COMPONENTS (Chamfered Tech Badges)
  {
    id: 'gsap-pinned',
    category: 'components',
    importance: 3,
    titleFa: 'استیج پین‌شده راهکارها',
    titleEn: 'GSAP Pinned Stage',
    path: 'components/about/AboutGsapPinnedSection.vue',
    descFa: 'استیج قفل‌شده 360vh با گام‌بندی.',
    descEn: 'Sticky 360vh pinned stage.',
    icon: 'mdi:view-carousel-outline',
    x: 820,
    y: 80,
    specs: { Mode: 'Sticky 360vh' }
  },

  // COL 4: COMPOSABLES & DATABASE (Pills & Cylinders)
  {
    id: 'use-page-ui',
    category: 'composables',
    importance: 2,
    titleFa: 'usePageUI SWR Engine',
    titleEn: 'usePageUI SWR',
    path: 'composables/ui/usePageUI.ts',
    descFa: 'لود ۰ms با اسکیماهای محلی.',
    descEn: '0ms instant hydration.',
    icon: 'mdi:flash-outline',
    x: 1140,
    y: 180,
    specs: { Strategy: 'SWR 0ms' }
  },
  {
    id: 'pb-pages-coll',
    category: 'pb',
    importance: 2,
    titleFa: 'کالکشن اسکیما (pages)',
    titleEn: 'Pages Collection',
    path: 'PocketBase: pages',
    descFa: 'داده‌های سه زبانه uiData.',
    descEn: 'Trilingual UI schemas.',
    icon: 'mdi:database-outline',
    x: 1140,
    y: 380,
    specs: { Type: 'PB Record' }
  },

  // COL 5: SERVER APIS (Octagon Tech Badges)
  {
    id: 'api-publish',
    category: 'api',
    importance: 3,
    titleFa: 'ای‌پی‌آی انتشار (publish)',
    titleEn: 'Publish API',
    path: 'server/api/admin/ui/publish.post.ts',
    descFa: 'انتشار پیش‌نویس‌های CMS.',
    descEn: 'Publish CMS draft schemas.',
    icon: 'mdi:cloud-upload-outline',
    x: 1460,
    y: 280,
    specs: { Method: 'POST' }
  }
]

const allEdges: Edge[] = [
  { from: 'home', to: 'about' },
  { from: 'home', to: 'products' },
  { from: 'about', to: 'gsap-pinned' },
  { from: 'products', to: 'use-page-ui' },
  { from: 'use-page-ui', to: 'pb-pages-coll' },
  { from: 'use-page-ui', to: 'api-publish' }
]

const visibleNodes = computed(() => {
  return allNodes.filter(n => {
    if (activeCategory.value !== 'all' && n.category !== activeCategory.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchFa = n.titleFa.toLowerCase().includes(q)
      const matchEn = n.titleEn.toLowerCase().includes(q)
      const matchPath = n.path.toLowerCase().includes(q)
      if (!matchFa && !matchEn && !matchPath) return false
    }
    return true
  })
})

const visibleEdges = computed(() => {
  const visibleIds = new Set(visibleNodes.value.map(n => n.id))
  return allEdges.filter(e => visibleIds.has(e.from) && visibleIds.has(e.to))
})

function selectNode(node: SpatialNode) {
  selectedNode.value = node
}

function isEdgeHighlighted(edge: Edge) {
  if (!hoveredNodeId.value && !selectedNode.value) return false
  const activeId = hoveredNodeId.value || selectedNode.value?.id
  return edge.from === activeId || edge.to === activeId
}

function getEdgePath(edge: Edge) {
  const fromNode = allNodes.find(n => n.id === edge.from)
  const toNode = allNodes.find(n => n.id === edge.to)
  if (!fromNode || !toNode) return ''

  const x1 = fromNode.x + 120
  const y1 = fromNode.y + 40
  const x2 = toNode.x + 120
  const y2 = toNode.y + 40

  const dx = x2 - x1
  const dy = y2 - y1
  const cx1 = x1 + dx * 0.5
  const cy1 = y1
  const cx2 = x1 + dx * 0.5
  const cy2 = y2

  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
}

function getNodeImportanceSizeClass(importance: number) {
  switch (importance) {
    case 1: return 'w-80 p-5 text-base border-2 shadow-xl'
    case 2: return 'w-64 p-4 text-sm shadow-md'
    default: return 'w-56 p-3.5 text-xs shadow-sm'
  }
}

function getCategoryCount(catId: string) {
  if (catId === 'all') return allNodes.length
  return allNodes.filter(n => n.category === catId).length
}

function getNodeCategoryLabel(catId: string) {
  const cat = categories.find(c => c.id === catId)
  if (!cat) return catId
  return isRTL.value ? cat.labelFa : cat.labelEn
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
