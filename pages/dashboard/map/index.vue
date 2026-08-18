<!-- pages/dashboard/map/index.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-x-0 bottom-0 top-14 sm:top-16 z-30 w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-[#05080c] text-gray-100 select-none overflow-hidden font-sans"
  >
    <!-- Background Canvas Grid & Glow -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div
        class="absolute inset-0 opacity-25 transition-all duration-75"
        :style="{
          backgroundImage: 'radial-gradient(circle, #2DD4BF 1.2px, transparent 1.2px)',
          backgroundSize: `${30 * zoomScale}px ${30 * zoomScale}px`,
          backgroundPosition: `${panX}px ${panY}px`
        }"
      ></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(1,68,57,0.2),rgba(0,0,0,0.9))]"></div>
    </div>

    <!-- Top Command & Control Header -->
    <header class="relative z-30 flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-6 bg-[#0a0f16]/95 backdrop-blur-xl border-b border-gray-800/80 shadow-lg">
      <!-- Left: Title & Quick Center Action -->
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
          <Icon name="mdi:sitemap-outline" class="w-5 h-5" />
        </div>
        <div>
          <h1 class="text-sm sm:text-base font-extrabold text-white text-d4 flex items-center gap-2">
            <span>{{ isRTL ? 'نقشه فضایی اکوسیستم' : 'Spatial Ecosystem Canvas' }}</span>
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
              Infinite Canvas
            </span>
          </h1>
          <p class="text-[11px] text-gray-400 hidden sm:block">
            {{ isRTL ? 'دوبار کلیک روی صفحه خالی ➔ بازگشت خودکار به مرکز' : 'Double click empty canvas to auto-center view' }}
          </p>
        </div>
      </div>

      <!-- Center: Prominent Auto-Center & Zoom Actions -->
      <div class="flex items-center gap-2">
        <button
          @click="resetToCenter"
          class="px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer text-d4 group active:scale-95"
        >
          <Icon name="mdi:crosshairs-gps" class="w-4 h-4 text-emerald-200 group-hover:rotate-45 transition-transform" />
          <span>{{ isRTL ? 'تمرکز در مرکز (Auto-Center)' : 'Auto-Center View' }}</span>
        </button>

        <!-- Zoom Controls -->
        <div class="flex items-center gap-1 bg-gray-900/90 p-1 rounded-xl border border-gray-800">
          <button @click="zoomIn" class="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition cursor-pointer" title="Zoom In">
            <Icon name="mdi:plus" class="w-4 h-4" />
          </button>
          <span class="px-2 font-mono text-xs text-emerald-400 font-bold">{{ Math.round(zoomScale * 100) }}%</span>
          <button @click="zoomOut" class="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition cursor-pointer" title="Zoom Out">
            <Icon name="mdi:minus" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Right: Shape & Category Controls -->
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

        <!-- Annotations Toggle -->
        <button
          @click="showAnnotations = !showAnnotations"
          class="p-2 rounded-xl transition cursor-pointer border text-xs flex items-center gap-1"
          :class="[
            showAnnotations
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
              : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
          ]"
        >
          <Icon name="mdi:text-box-outline" class="w-4 h-4" />
          <span class="hidden md:inline">{{ isRTL ? 'توضیحات' : 'Details' }}</span>
        </button>
      </div>
    </header>

    <!-- Category Filter Bar -->
    <div class="relative z-20 flex items-center justify-between gap-3 px-4 py-2 bg-[#080d14]/90 border-b border-gray-800/60">
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

      <!-- Search Box -->
      <div class="relative w-48 sm:w-64 shrink-0">
        <Icon name="mdi:magnify" class="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="isRTL ? 'جستجوی گره یا مسیر...' : 'Search node or path...'"
          class="w-full bg-gray-900/90 border border-gray-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>
    </div>

    <!-- Infinite Canvas Stage (Non-scrollable body, double-click auto-center) -->
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
      <!-- Connected Curved Edge Vector Lines -->
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
            :stroke="isEdgeHighlighted(edge) ? '#2DD4BF' : '#1f2937'"
            :stroke-width="isEdgeHighlighted(edge) ? 3 : 1.5"
            class="transition-all duration-300"
          />
          <!-- Flow Pulse Particle -->
          <circle
            v-if="isEdgeHighlighted(edge)"
            r="4"
            fill="#2DD4BF"
          >
            <animateMotion
              :path="getEdgePath(edge)"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      <!-- Spatial Nodes Layer (Visual Importance Sizing) -->
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
          <!-- SHAPE 1: GLASS CARD (IMPORTANCE SCALED) -->
          <div
            v-if="activeShape === 'card'"
            class="rounded-3xl bg-[#0d131d]/95 backdrop-blur-xl border transition-all duration-300 shadow-2xl relative overflow-hidden"
            :class="[
              getNodeImportanceSizeClass(node.importance),
              selectedNode?.id === node.id
                ? 'border-emerald-400 ring-4 ring-emerald-500/30 shadow-emerald-950 scale-105 z-30'
                : hoveredNodeId === node.id
                  ? 'border-emerald-500/80 scale-103 z-20'
                  : 'border-gray-800/90 hover:border-gray-700 z-10'
            ]"
          >
            <!-- Importance Pulsing Glow Bar -->
            <div
              v-if="node.importance === 1"
              class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse"
            ></div>

            <div class="flex items-center justify-between mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-d4 border" :class="getNodeBadgeClass(node.category)">
                {{ getNodeCategoryLabel(node.category) }}
              </span>
              <Icon :name="node.icon" class="text-gray-400 group-hover:text-emerald-400 transition" :class="node.importance === 1 ? 'w-6 h-6' : 'w-4.5 h-4.5'" />
            </div>

            <!-- Title (Importance Sized) -->
            <h3
              class="font-extrabold text-white text-d4 group-hover:text-emerald-300 transition truncate mb-1"
              :class="[
                node.importance === 1 ? 'text-lg sm:text-xl' : node.importance === 2 ? 'text-sm' : 'text-xs'
              ]"
            >
              {{ isRTL ? node.titleFa : node.titleEn }}
            </h3>

            <p class="text-[10px] font-mono text-gray-400 truncate text-left ltr mb-2.5">
              {{ node.path }}
            </p>

            <!-- Inner Annotations -->
            <div v-if="showAnnotations" class="space-y-1.5 pt-2.5 border-t border-gray-800/80 text-[10px]">
              <div class="flex justify-between text-gray-400">
                <span>وابستگی‌ها:</span>
                <span class="font-mono text-emerald-400 font-bold">{{ node.depsCount }} گره</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>وضعیت:</span>
                <span class="font-mono text-emerald-300 font-bold">200 OK (SWR)</span>
              </div>
            </div>
          </div>

          <!-- SHAPE 2: MINIMAL PILL -->
          <div
            v-else-if="activeShape === 'pill'"
            class="px-5 py-2.5 rounded-full bg-[#0d131d]/95 backdrop-blur-xl border flex items-center gap-3 shadow-xl transition-all duration-300"
            :class="[
              node.importance === 1 ? 'scale-110 border-emerald-500/60 ring-2 ring-emerald-500/20' : 'border-gray-800 hover:border-emerald-500/60',
              selectedNode?.id === node.id ? 'border-emerald-400 scale-115' : ''
            ]"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <Icon :name="node.icon" class="w-4.5 h-4.5 text-emerald-300" />
            <span
              class="font-bold text-white text-d4 whitespace-nowrap"
              :class="node.importance === 1 ? 'text-sm' : 'text-xs'"
            >
              {{ isRTL ? node.titleFa : node.titleEn }}
            </span>
          </div>

          <!-- SHAPE 3: TECH HEXAGON -->
          <div
            v-else-if="activeShape === 'hex'"
            class="p-4 rounded-2xl bg-[#0d131d] border text-center transition-all duration-300 shadow-xl"
            :class="[
              node.importance === 1 ? 'w-48 border-emerald-500' : 'w-40 border-gray-800 hover:border-gray-600',
              selectedNode?.id === node.id ? 'border-emerald-400 scale-105' : ''
            ]"
          >
            <Icon :name="node.icon" class="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
            <div class="font-bold text-white text-d4 truncate text-xs">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </div>
          </div>

          <!-- SHAPE 4: COMPACT ORBIT CIRCLE -->
          <div
            v-else
            class="rounded-full bg-[#0d131d] border flex items-center justify-center shadow-xl transition-all duration-300"
            :class="[
              node.importance === 1 ? 'w-16 h-16 border-emerald-500 ring-4 ring-emerald-500/20' : 'w-12 h-12 border-gray-800 hover:border-emerald-500',
              selectedNode?.id === node.id ? 'border-emerald-400 scale-110' : ''
            ]"
            :title="isRTL ? node.titleFa : node.titleEn"
          >
            <Icon :name="node.icon" class="text-emerald-300" :class="node.importance === 1 ? 'w-7 h-7' : 'w-5 h-5'" />
          </div>
        </div>
      </div>
    </div>

    <!-- Node Detail Inspector Drawer -->
    <transition name="drawer-slide">
      <div
        v-if="selectedNode"
        class="absolute inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#080d14]/95 backdrop-blur-2xl border-l border-gray-800 text-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-gray-800 pb-4">
            <div class="flex items-center gap-2">
              <Icon :name="selectedNode.icon" class="w-6 h-6 text-emerald-400" />
              <span class="text-xs font-bold text-emerald-300 font-mono">گره #{{ selectedNode.id }}</span>
            </div>
            <button
              @click="selectedNode = null"
              class="p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-2 text-right">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold text-d4 border" :class="getNodeBadgeClass(selectedNode.category)">
              {{ getNodeCategoryLabel(selectedNode.category) }}
            </span>
            <h2 class="text-xl font-extrabold text-white text-d4">
              {{ isRTL ? selectedNode.titleFa : selectedNode.titleEn }}
            </h2>
            <div class="p-3 rounded-xl bg-gray-950 border border-gray-800 font-mono text-xs text-emerald-400 ltr text-left overflow-x-auto">
              {{ selectedNode.path }}
            </div>
          </div>

          <div class="space-y-2 text-right">
            <h3 class="text-xs font-bold text-gray-400 text-d4">توضیحات و نقش معماری</h3>
            <p class="text-xs text-gray-300 leading-relaxed bg-gray-950/60 p-4 rounded-2xl border border-gray-800/80">
              {{ isRTL ? selectedNode.descFa : selectedNode.descEn }}
            </p>
          </div>

          <div class="space-y-2 text-right">
            <h3 class="text-xs font-bold text-gray-400 text-d4">مشخصات کلیدی</h3>
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

        <div class="pt-6 border-t border-gray-800 space-y-2">
          <NuxtLink
            v-if="selectedNode.actionUrl"
            :to="selectedNode.actionUrl"
            class="block w-full py-3 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white font-bold text-xs text-center transition shadow-xs text-d4"
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

// Canvas Controls
const showAnnotations = ref(true)
const activeCategory = ref('all')
const activeShape = ref('card') // card, pill, hex, circle
const searchQuery = ref('')
const hoveredNodeId = ref<string | null>(null)
const selectedNode = ref<SpatialNode | null>(null)

// Infinite Canvas Drag/Pan/Zoom State
const panX = ref(100)
const panY = ref(80)
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
  panX.value = 100
  panY.value = 80
  zoomScale.value = 0.95
}

function onCanvasDblClick(e: MouseEvent) {
  // If double clicked directly on canvas (not on node card)
  if ((e.target as HTMLElement).classList.contains('cursor-grab')) {
    resetToCenter()
  }
}

const nodeShapes = [
  { id: 'card', label: 'کارت شیشه‌ای', icon: 'mdi:card-bulleted-outline' },
  { id: 'pill', label: 'کپسول کم‌حجم', icon: 'mdi:pill' },
  { id: 'hex', label: 'شش‌ضلعی فنی', icon: 'mdi:hexagon-outline' },
  { id: 'circle', label: 'دایره مدار', icon: 'mdi:circle-outline' },
]

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
  category: string
  importance: number // 1: Huge Core, 2: Large, 3: Medium, 4: Standard
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
}

// Nodes with Visual Importance Sizing
const allNodes: SpatialNode[] = [
  // Importance 1: Core Hubs (Bigger size: w-80)
  {
    id: 'home',
    category: 'pages',
    importance: 1,
    titleFa: 'صفحه اصلی (Home Hub)',
    titleEn: 'Home Main Hub',
    path: 'pages/index.vue',
    descFa: 'هسته اصلی فرانت‌اند، صحنه‌های سه بعدی، کاتالوگ و فرم‌های استعلام.',
    descEn: 'Main frontend hub with 3D scenes and quote calculator.',
    icon: 'mdi:home-outline',
    x: 460,
    y: 40,
    depsCount: 12,
    specs: { Route: '/', Layout: 'default', Importance: 'Core Hub' },
    actionUrl: '/'
  },
  {
    id: 'dashboard-hub',
    category: 'pages',
    importance: 1,
    titleFa: 'پیشخوان ادمین (Dashboard Hub)',
    titleEn: 'Admin Dashboard Hub',
    path: 'pages/dashboard/index.vue',
    descFa: 'مرکز مدیریت کل سیستم، دیتابیس، فایل‌ها و CMS.',
    descEn: 'Master administrative suite for database, media, and CMS.',
    icon: 'mdi:view-dashboard-outline',
    x: 1000,
    y: 40,
    depsCount: 14,
    specs: { Route: '/dashboard', Layout: 'dashboard', Importance: 'Core Hub' },
    actionUrl: '/dashboard'
  },

  // Importance 2: Main Pages (Medium-Large size: w-64)
  {
    id: 'about',
    category: 'pages',
    importance: 2,
    titleFa: 'درباره ما (About Us)',
    titleEn: 'About Us Page',
    path: 'pages/about/index.vue',
    descFa: 'روایت صنعتی، تیم فنی و بخش پین‌شده 360vh.',
    descEn: 'Industrial history, technical staff, and 360vh pinned solutions.',
    icon: 'mdi:information-outline',
    x: 100,
    y: 260,
    depsCount: 6,
    specs: { Route: '/about', Layout: 'default' },
    actionUrl: '/about'
  },
  {
    id: 'products',
    category: 'pages',
    importance: 2,
    titleFa: 'کاتالوگ محصولات (Products)',
    titleEn: 'Products Catalog',
    path: 'pages/products/index.vue',
    descFa: '۱۲ نوع محصول با موکاپ وکتور SVG.',
    descEn: '12 authentic products with vector SVG mockups.',
    icon: 'mdi:package-variant-closed',
    x: 460,
    y: 260,
    depsCount: 8,
    specs: { Route: '/products', Layout: 'default' },
    actionUrl: '/products'
  },
  {
    id: 'history',
    category: 'pages',
    importance: 2,
    titleFa: 'تاریخچه ۲۵ ساله (History)',
    titleEn: '25-Year History',
    path: 'pages/history.vue',
    descFa: 'تایم‌لاین کرونولوژیک صنعتی از ۱۳۷۸ تا ۱۴۰۴.',
    descEn: '25-year chronological journey timeline.',
    icon: 'mdi:timeline-text-outline',
    x: 820,
    y: 260,
    depsCount: 4,
    specs: { Route: '/history', Layout: 'default' },
    actionUrl: '/history'
  },

  // Importance 3: Components & Composables (Standard size: w-56)
  {
    id: 'gsap-pinned',
    category: 'components',
    importance: 3,
    titleFa: 'استیج پین‌شده راهکارها',
    titleEn: 'GSAP Pinned Stage',
    path: 'components/about/AboutGsapPinnedSection.vue',
    descFa: 'استیج قفل‌شده 360vh با پیمایش گام به گام.',
    descEn: 'Sticky 360vh pinned viewport stage with step locking.',
    icon: 'mdi:view-carousel-outline',
    x: 100,
    y: 500,
    depsCount: 3,
    specs: { Mode: 'Sticky 360vh', Motion: 'Vue Morph' }
  },
  {
    id: 'use-page-ui',
    category: 'composables',
    importance: 2,
    titleFa: 'کامپوزبل SWR (usePageUI)',
    titleEn: 'usePageUI SWR Engine',
    path: 'composables/ui/usePageUI.ts',
    descFa: 'لود ۰ms با اسکیماهای محلی JSON.',
    descEn: '0ms instant hydration + PocketBase background sync.',
    icon: 'mdi:flash-outline',
    x: 460,
    y: 500,
    depsCount: 11,
    specs: { Strategy: 'SWR 0ms', Cache: 'Eager JSON' }
  },
  {
    id: 'pb-pages-coll',
    category: 'pb',
    importance: 2,
    titleFa: 'کالکشن اسکیما (pages)',
    titleEn: 'Pages Collection',
    path: 'PocketBase: pages',
    descFa: 'داده‌های سه زبانه uiData برای تمام صفحات.',
    descEn: 'Trilingual UI schemas for all public pages.',
    icon: 'mdi:database-outline',
    x: 820,
    y: 500,
    depsCount: 11,
    specs: { Schema: 'slug, uiData', Type: 'PB Record' }
  },

  // Importance 4: Micro APIs & Infra (Compact size: w-48)
  {
    id: 'api-publish',
    category: 'api',
    importance: 4,
    titleFa: 'ای‌پی‌آی انتشار (publish)',
    titleEn: 'Publish API',
    path: 'server/api/admin/ui/publish.post.ts',
    descFa: 'انتشار رسمی پیش‌نویس‌های CMS.',
    descEn: 'Publish CMS draft schemas to production.',
    icon: 'mdi:cloud-upload-outline',
    x: 460,
    y: 720,
    depsCount: 2,
    specs: { Method: 'POST', Endpoint: '/api/admin/ui/publish' }
  }
]

const allEdges: Edge[] = [
  { from: 'home', to: 'about' },
  { from: 'home', to: 'products' },
  { from: 'home', to: 'history' },
  { from: 'dashboard-hub', to: 'history' },
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

  const x1 = fromNode.x + (fromNode.importance === 1 ? 140 : 110)
  const y1 = fromNode.y + (fromNode.importance === 1 ? 60 : 45)
  const x2 = toNode.x + (toNode.importance === 1 ? 140 : 110)
  const y2 = toNode.y + (toNode.importance === 1 ? 60 : 45)

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
    case 1: return 'w-80 p-5 text-base border-2 border-emerald-500/60 shadow-2xl'
    case 2: return 'w-64 p-4 text-sm border-gray-800'
    case 3: return 'w-56 p-3.5 text-xs border-gray-800/90'
    default: return 'w-48 p-3 text-[11px] border-gray-800/80'
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
