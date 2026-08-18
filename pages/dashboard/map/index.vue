<!-- pages/dashboard/map/index.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="relative w-full transition-all duration-500 overflow-hidden bg-[#070b10] text-gray-100 select-none font-sans"
    :class="[
      isFullscreen
        ? 'fixed inset-0 z-50 h-screen w-screen p-0'
        : 'h-[calc(100vh-5rem)] rounded-3xl border border-gray-800/80 shadow-2xl'
    ]"
  >
    <!-- Background Canvas Ambient FX -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div
        class="absolute inset-0 opacity-20"
        :style="{
          backgroundImage: showGridPattern ? 'radial-gradient(circle, #2DD4BF 1.2px, transparent 1.2px)' : 'none',
          backgroundSize: `${24 * zoomScale}px ${24 * zoomScale}px`,
          backgroundPosition: `${panX}px ${panY}px`
        }"
      ></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(1,68,57,0.25),rgba(0,0,0,0.85))]"></div>
    </div>

    <!-- Top Command Toolbar -->
    <header class="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0c131c]/90 backdrop-blur-xl border-b border-gray-800/80">
      <!-- Left: Title & Live Status -->
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
          <Icon name="mdi:sitemap-outline" class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-sm sm:text-base font-extrabold text-white text-d4">
              {{ isRTL ? 'نقشه فضایی اکوسیستم' : 'Spatial Ecosystem Canvas' }}
            </h1>
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
              LOD {{ lodLevel }}
            </span>
          </div>
          <p class="text-[11px] text-gray-400">
            {{ isRTL ? 'پیمایش فضایی تعاملی، سطح‌بندی هوشمند و اتصال گره‌ها' : 'Interactive spatial graph, level-of-detail & node connections' }}
          </p>
        </div>
      </div>

      <!-- Center: Layout Modes & View Options -->
      <div class="flex items-center gap-1.5 bg-gray-900/90 p-1 rounded-2xl border border-gray-800">
        <button
          v-for="mode in layoutModes"
          :key="mode.id"
          @click="activeLayoutMode = mode.id"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-d4"
          :class="[
            activeLayoutMode === mode.id
              ? 'bg-najmgreen text-white shadow-xs'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          ]"
        >
          <Icon :name="mode.icon" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ isRTL ? mode.labelFa : mode.labelEn }}</span>
        </button>
      </div>

      <!-- Right: Controls & Options Dropdowns -->
      <div class="flex items-center gap-2">
        <!-- Node Shape Switcher -->
        <div class="flex items-center gap-1 bg-gray-900/90 p-1 rounded-xl border border-gray-800">
          <button
            v-for="shape in nodeShapes"
            :key="shape.id"
            @click="activeShape = shape.id"
            class="p-1.5 rounded-lg text-xs transition cursor-pointer"
            :class="[
              activeShape === shape.id ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-gray-400 hover:text-white'
            ]"
            :title="shape.label"
          >
            <Icon :name="shape.icon" class="w-4 h-4" />
          </button>
        </div>

        <!-- Level of Detail (LOD) Stepper -->
        <div class="flex items-center gap-1 bg-gray-900/90 px-2 py-1 rounded-xl border border-gray-800 text-xs">
          <span class="text-gray-400 font-mono text-[10px]">LOD:</span>
          <button
            v-for="lvl in [1, 2, 3, 4]"
            :key="lvl"
            @click="lodLevel = lvl"
            class="w-6 h-6 rounded-lg text-[11px] font-bold transition cursor-pointer"
            :class="[
              lodLevel === lvl ? 'bg-najmgreen text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            ]"
          >
            {{ lvl }}
          </button>
        </div>

        <!-- Annotations Toggle -->
        <button
          @click="showAnnotations = !showAnnotations"
          class="p-2 rounded-xl transition cursor-pointer border"
          :class="[
            showAnnotations
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
          ]"
          :title="isRTL ? 'تغییر نمایش توضیحات درون‌خطی' : 'Toggle Inline Annotations'"
        >
          <Icon name="mdi:text-box-outline" class="w-4.5 h-4.5" />
        </button>

        <!-- Fullscreen Toggle -->
        <button
          @click="isFullscreen = !isFullscreen"
          class="p-2 rounded-xl bg-gray-900 text-gray-300 hover:text-white border border-gray-800 transition cursor-pointer"
          :title="isRTL ? 'حالت تمام صفحه' : 'Toggle Fullscreen'"
        >
          <Icon :name="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" class="w-4.5 h-4.5" />
        </button>
      </div>
    </header>

    <!-- Sub-Toolbar: Search & Category Filters -->
    <div class="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#090e15]/80 border-b border-gray-800/60">
      <!-- Category Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap text-d4 border"
          :class="[
            activeCategory === cat.id
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:text-gray-200'
          ]"
        >
          {{ isRTL ? cat.labelFa : cat.labelEn }}
          <span class="ml-1 text-[10px] font-mono opacity-70">({{ getCategoryCount(cat.id) }})</span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full sm:w-64">
        <Icon name="mdi:magnify" class="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="isRTL ? 'جستجوی نام گره، فریم‌ورک یا مسیر...' : 'Search nodes, tags or paths...'"
          class="w-full bg-gray-900/90 border border-gray-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute left-2.5 top-2.5 text-gray-500 hover:text-white"
        >
          <Icon name="mdi:close-circle" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Spatial Drag/Pan Canvas Viewport Stage -->
    <div
      ref="canvasStageRef"
      class="relative w-full h-[calc(100%-7.5rem)] overflow-hidden cursor-grab active:cursor-grabbing"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchstart="startTouchDrag"
      @touchmove="onTouchDrag"
      @touchend="stopDrag"
    >
      <!-- Connected SVG Edge Lines Layer -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none z-10"
        :style="{
          transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})`,
          transformOrigin: '0 0'
        }"
      >
        <g v-for="edge in visibleEdges" :key="`${edge.from}-${edge.to}`">
          <!-- Main Edge Curve -->
          <path
            :d="getEdgePath(edge)"
            fill="none"
            :stroke="getEdgeColor(edge)"
            :stroke-width="isEdgeHighlighted(edge) ? 2.5 : 1"
            :stroke-dasharray="edge.type === 'dashed' ? '4 4' : 'none'"
            class="transition-all duration-300 opacity-60 group-hover:opacity-100"
          />
          <!-- Flow Pulse Dot -->
          <circle
            v-if="isEdgeHighlighted(edge)"
            r="3"
            fill="#2DD4BF"
            class="animate-ping"
          >
            <animateMotion
              :path="getEdgePath(edge)"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      <!-- Spatial Node Elements Stage Layer -->
      <div
        class="absolute inset-0 w-full h-full transition-transform duration-75 origin-top-left z-15"
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
          <!-- SHAPE 1: GLASS CARD SHAPE -->
          <div
            v-if="activeShape === 'card'"
            class="w-64 p-4 rounded-2xl bg-[#0f1722]/90 backdrop-blur-xl border transition-all duration-300 shadow-lg relative overflow-hidden"
            :class="[
              selectedNode?.id === node.id
                ? 'border-emerald-400 ring-2 ring-emerald-500/30 shadow-emerald-950 scale-105'
                : hoveredNodeId === node.id
                  ? 'border-emerald-500/70 scale-102'
                  : 'border-gray-800 hover:border-gray-700'
            ]"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold text-d4 border" :class="getNodeBadgeClass(node.category)">
                {{ getNodeCategoryLabel(node.category) }}
              </span>
              <Icon :name="node.icon" class="w-4.5 h-4.5 text-gray-400 group-hover:text-emerald-400 transition" />
            </div>

            <h3 class="text-xs font-bold text-white text-d4 group-hover:text-emerald-300 transition truncate mb-0.5">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </h3>

            <p class="text-[10px] font-mono text-gray-400 truncate text-left ltr mb-2">
              {{ node.path }}
            </p>

            <div v-if="showAnnotations" class="space-y-1 pt-2 border-t border-gray-800/80 text-[10px]">
              <div class="flex justify-between text-gray-400">
                <span>وابستگی‌ها:</span>
                <span class="font-mono text-emerald-400 font-bold">{{ node.depsCount }} گره</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>وضعیت SWR:</span>
                <span class="font-mono text-cyan-400">0ms Eager</span>
              </div>
            </div>
          </div>

          <!-- SHAPE 2: MINIMAL PILL SHAPE -->
          <div
            v-else-if="activeShape === 'pill'"
            class="px-4 py-2 rounded-full bg-[#0f1722]/90 backdrop-blur-xl border flex items-center gap-2.5 shadow-md transition-all duration-300"
            :class="[
              selectedNode?.id === node.id
                ? 'border-emerald-400 ring-2 ring-emerald-500/30 scale-105'
                : 'border-gray-800 hover:border-emerald-500/60'
            ]"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <Icon :name="node.icon" class="w-4 h-4 text-emerald-300" />
            <span class="text-xs font-bold text-white text-d4 whitespace-nowrap">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </span>
          </div>

          <!-- SHAPE 3: TECH HEXAGON SHAPE -->
          <div
            v-else-if="activeShape === 'hex'"
            class="w-40 p-3 rounded-2xl bg-[#0f1722]/95 border text-center transition-all duration-300 shadow-md"
            :class="[
              selectedNode?.id === node.id ? 'border-emerald-400 scale-105' : 'border-gray-800 hover:border-gray-600'
            ]"
          >
            <Icon :name="node.icon" class="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <div class="text-[11px] font-bold text-white text-d4 truncate">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </div>
            <div v-if="showAnnotations" class="text-[9px] font-mono text-gray-400 mt-1 truncate">
              {{ node.id }}
            </div>
          </div>

          <!-- SHAPE 4: COMPACT ORBIT CIRCLE SHAPE -->
          <div
            v-else
            class="w-12 h-12 rounded-full bg-[#0f1722] border flex items-center justify-center shadow-lg transition-all duration-300"
            :class="[
              selectedNode?.id === node.id ? 'border-emerald-400 scale-110 ring-4 ring-emerald-500/20' : 'border-gray-800 hover:border-emerald-500'
            ]"
            :title="isRTL ? node.titleFa : node.titleEn"
          >
            <Icon :name="node.icon" class="w-5 h-5 text-emerald-300" />
          </div>
        </div>
      </div>

      <!-- Floating Zoom Controls Footer -->
      <div class="absolute bottom-5 left-5 z-20 flex items-center gap-1.5 bg-[#0c131c]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-gray-800 shadow-xl">
        <button @click="resetZoom" class="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold transition cursor-pointer">
          <Icon name="mdi:aspect-ratio" class="w-4 h-4" />
        </button>
        <button @click="zoomIn" class="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition cursor-pointer">
          <Icon name="mdi:plus" class="w-4 h-4" />
        </button>
        <button @click="zoomOut" class="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition cursor-pointer">
          <Icon name="mdi:minus" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Node Detail Inspector Drawer -->
    <transition name="drawer-slide">
      <div
        v-if="selectedNode"
        class="absolute inset-y-0 right-0 z-40 w-full sm:w-96 bg-[#090e15]/95 backdrop-blur-2xl border-l border-gray-800 text-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div class="space-y-6">
          <!-- Drawer Header -->
          <div class="flex items-center justify-between border-b border-gray-800 pb-4">
            <div class="flex items-center gap-2">
              <Icon :name="selectedNode.icon" class="w-6 h-6 text-emerald-400" />
              <span class="text-xs font-bold text-emerald-300 font-mono">گره اکوسیستم #{{ selectedNode.id }}</span>
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
            <span class="inline-block px-3 py-1 rounded-md text-xs font-bold text-d4 border" :class="getNodeBadgeClass(selectedNode.category)">
              {{ getNodeCategoryLabel(selectedNode.category) }}
            </span>
            <h2 class="text-xl font-extrabold text-white text-d4">
              {{ isRTL ? selectedNode.titleFa : selectedNode.titleEn }}
            </h2>
            <div class="p-3 rounded-xl bg-gray-950 border border-gray-800 font-mono text-xs text-emerald-400 ltr text-left overflow-x-auto">
              {{ selectedNode.path }}
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2 text-right">
            <h3 class="text-xs font-bold text-gray-400 text-d4">نقش و مسئولیت در سامانه</h3>
            <p class="text-xs text-gray-300 leading-relaxed bg-gray-950/60 p-4 rounded-2xl border border-gray-800/80">
              {{ isRTL ? selectedNode.descFa : selectedNode.descEn }}
            </p>
          </div>

          <!-- Technical Specs -->
          <div class="space-y-2 text-right">
            <h3 class="text-xs font-bold text-gray-400 text-d4">مشخصات فنی</h3>
            <div class="space-y-2">
              <div
                v-for="(val, key) in selectedNode.specs"
                :key="key"
                class="flex items-center justify-between p-2.5 rounded-xl bg-gray-950 text-xs border border-gray-800/60"
              >
                <span class="text-gray-400 font-mono">{{ key }}</span>
                <span class="font-bold text-gray-200 font-mono">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Links -->
        <div class="pt-6 border-t border-gray-800 space-y-2">
          <NuxtLink
            v-if="selectedNode.actionUrl"
            :to="selectedNode.actionUrl"
            class="block w-full py-3 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs text-center transition shadow-xs text-d4"
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
  layout: 'dashboard'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

// Options State
const isFullscreen = ref(false)
const showAnnotations = ref(true)
const showGridPattern = ref(true)
const lodLevel = ref(3) // 1: Entry, 2: Pages, 3: Components, 4: Micro
const activeCategory = ref('all')
const activeLayoutMode = ref('graph') // graph, tree, grid, orbit
const activeShape = ref('card') // card, pill, hex, circle
const searchQuery = ref('')
const hoveredNodeId = ref<string | null>(null)
const selectedNode = ref<SpatialNode | null>(null)

// Canvas Drag/Pan State
const panX = ref(60)
const panY = ref(60)
const zoomScale = ref(0.9)
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
  zoomScale.value = Math.max(0.4, zoomScale.value - 0.15)
}

function resetZoom() {
  panX.value = 60
  panY.value = 60
  zoomScale.value = 0.9
}

// Modes & Shapes Definitions
const layoutModes = [
  { id: 'graph', labelFa: 'گراف فضایی', labelEn: 'Spatial Graph', icon: 'mdi:graph-outline' },
  { id: 'tree', labelFa: 'درختی', labelEn: 'Tree View', icon: 'mdi:file-tree' },
  { id: 'grid', labelFa: 'ماتریس', labelEn: 'Grid Matrix', icon: 'mdi:view-grid-outline' },
]

const nodeShapes = [
  { id: 'card', label: 'کارت شیشه‌ای', icon: 'mdi:card-bulleted-outline' },
  { id: 'pill', label: 'کپسول کم‌حجم', icon: 'mdi:pill' },
  { id: 'hex', label: 'شش‌ضلعی فنی', icon: 'mdi:hexagon-outline' },
  { id: 'circle', label: 'دایره مدار', icon: 'mdi:circle-outline' },
]

const categories = [
  { id: 'all', labelFa: 'همه گره‌ها', labelEn: 'All' },
  { id: 'pages', labelFa: 'صفحات (Sitemap)', labelEn: 'Pages' },
  { id: 'components', labelFa: 'کامپوننت‌ها', labelEn: 'Components' },
  { id: 'composables', labelFa: 'کامپوزبل‌ها', labelEn: 'Composables' },
  { id: 'pb', labelFa: 'دیتابیس PB', labelEn: 'Database' },
  { id: 'api', labelFa: 'ای‌پیک‌آی سرور', labelEn: 'Server API' },
]

interface SpatialNode {
  id: string
  category: string
  lod: number
  titleFa: string
  titleEn: string
  path: string
  descFa: string
  descEn: string
  icon: string
  x: number
  y: number
  depsCount: number
  specs: Record<string, string>
  actionUrl?: string
}

interface Edge {
  from: string
  to: string
  type?: 'solid' | 'dashed'
}

// Node Position Graph Matrix
const allNodes: SpatialNode[] = [
  // Core Entry
  {
    id: 'home',
    category: 'pages',
    lod: 1,
    titleFa: 'صفحه اصلی (Home)',
    titleEn: 'Home Page',
    path: 'pages/index.vue',
    descFa: 'ورودی اصلی فرانت‌اند با صحنه‌های سه بعدی و فرم استعلام.',
    descEn: 'Main entry point with 3D scenes and quote calculator.',
    icon: 'mdi:home-outline',
    x: 420,
    y: 60,
    depsCount: 8,
    specs: { Route: '/', Layout: 'default' },
    actionUrl: '/'
  },
  {
    id: 'about',
    category: 'pages',
    lod: 2,
    titleFa: 'درباره ما (About Us)',
    titleEn: 'About Us Page',
    path: 'pages/about/index.vue',
    descFa: 'تیم متخصص و خط پین‌شده 400vh برای راهکارها.',
    descEn: 'Industrial team and 400vh pinned solutions stage.',
    icon: 'mdi:information-outline',
    x: 100,
    y: 220,
    depsCount: 4,
    specs: { Route: '/about', Layout: 'default' },
    actionUrl: '/about'
  },
  {
    id: 'products',
    category: 'pages',
    lod: 2,
    titleFa: 'کاتالوگ محصولات (Products)',
    titleEn: 'Products Catalog',
    path: 'pages/products/index.vue',
    descFa: '۱۲ نوع محصول واقعی با موکاپ وکتور SVG.',
    descEn: '12 authentic packaging products with SVG mockups.',
    icon: 'mdi:package-variant-closed',
    x: 420,
    y: 220,
    depsCount: 6,
    specs: { Route: '/products', Layout: 'default' },
    actionUrl: '/products'
  },
  {
    id: 'history',
    category: 'pages',
    lod: 2,
    titleFa: 'تاریخچه ۲۵ ساله (History)',
    titleEn: '25-Year History',
    path: 'pages/history.vue',
    descFa: 'تایم‌لاین کرونولوژیک صنعتی از ۱۳۷۸ تا ۱۴۰۴.',
    descEn: '25-year chronological journey timeline.',
    icon: 'mdi:timeline-text-outline',
    x: 740,
    y: 220,
    depsCount: 3,
    specs: { Route: '/history', Layout: 'default' },
    actionUrl: '/history'
  },

  // Components & Tools
  {
    id: 'gsap-pinned',
    category: 'components',
    lod: 3,
    titleFa: 'بخش پین‌شده راهکارها',
    titleEn: 'GSAP Pinned Stage',
    path: 'components/about/AboutGsapPinnedSection.vue',
    descFa: 'استیج قفل‌شده sticky با پیمایش گام به گام.',
    descEn: 'Sticky pinned viewport stage with step locking.',
    icon: 'mdi:view-carousel-outline',
    x: 100,
    y: 450,
    depsCount: 2,
    specs: { Mode: 'Sticky 360vh', Motion: 'Vue Morph' }
  },
  {
    id: 'use-page-ui',
    category: 'composables',
    lod: 3,
    titleFa: 'کامپوزبل SWR (usePageUI)',
    titleEn: 'usePageUI SWR',
    path: 'composables/ui/usePageUI.ts',
    descFa: 'لود ۰ms با اسکیماهای محلی و همگام‌سازی PB.',
    descEn: '0ms instant hydration + PocketBase background sync.',
    icon: 'mdi:flash-outline',
    x: 420,
    y: 450,
    depsCount: 11,
    specs: { Strategy: 'SWR 0ms', Hydration: 'Progressive' }
  },

  // PocketBase & Server APIs
  {
    id: 'pb-pages-coll',
    category: 'pb',
    lod: 3,
    titleFa: 'کالکشن اسکیما (pages)',
    titleEn: 'Pages Collection',
    path: 'PocketBase: pages',
    descFa: 'رکورد سه زبانه uiData برای تمام ۱۱ صفحه.',
    descEn: 'Trilingual UI schemas for all public pages.',
    icon: 'mdi:database-outline',
    x: 740,
    y: 450,
    depsCount: 11,
    specs: { Type: 'PocketBase Record', Langs: 'FA, EN, AR' }
  },
  {
    id: 'api-publish',
    category: 'api',
    lod: 4,
    titleFa: 'ای‌پی‌آی انتشار (publish)',
    titleEn: 'Publish API',
    path: 'server/api/admin/ui/publish.post.ts',
    descFa: 'انتشار رسمی پیش‌نویس‌های CMS.',
    descEn: 'Publish CMS draft schemas to production.',
    icon: 'mdi:cloud-upload-outline',
    x: 420,
    y: 650,
    depsCount: 2,
    specs: { Method: 'POST', Route: '/api/admin/ui/publish' }
  }
]

const allEdges: Edge[] = [
  { from: 'home', to: 'about' },
  { from: 'home', to: 'products' },
  { from: 'home', to: 'history' },
  { from: 'about', to: 'gsap-pinned' },
  { from: 'products', to: 'use-page-ui' },
  { from: 'use-page-ui', to: 'pb-pages-coll' },
  { from: 'use-page-ui', to: 'api-publish' }
]

const visibleNodes = computed(() => {
  return allNodes.filter(n => {
    if (n.lod > lodLevel.value) return false
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

  const x1 = fromNode.x + 100
  const y1 = fromNode.y + 40
  const x2 = toNode.x + 100
  const y2 = toNode.y + 40

  const dx = x2 - x1
  const dy = y2 - y1
  const cx1 = x1 + dx * 0.5
  const cy1 = y1
  const cx2 = x1 + dx * 0.5
  const cy2 = y2

  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
}

function getEdgeColor(edge: Edge) {
  return isEdgeHighlighted(edge) ? '#2DD4BF' : '#374151'
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

function getNodeBadgeClass(catId: string) {
  switch (catId) {
    case 'pages': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    case 'components': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    case 'composables': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    case 'pb': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    case 'api': return 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    default: return 'bg-gray-800 text-gray-300 border-gray-700'
  }
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
