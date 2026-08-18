<!-- pages/dashboard/map/index.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-0 z-50 h-screen w-screen bg-[#f8fafc] text-slate-800 select-none overflow-hidden font-sans"
  >
    <!-- Architectural Blueprint Grid Layer -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <!-- Grid Crosses -->
      <div
        class="absolute inset-0 opacity-40 transition-all duration-75"
        :style="{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1.2px, transparent 1.2px)',
          backgroundSize: `${32 * zoomScale}px ${32 * zoomScale}px`,
          backgroundPosition: `${panX}px ${panY}px`
        }"
      ></div>
      <!-- Ambient Soft Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(255,255,255,0.75),rgba(241,245,249,0.95))]"></div>
    </div>

    <!-- Top Blueprint HUD Header Bar -->
    <header class="absolute top-4 inset-x-4 z-40 flex items-center justify-between pointer-events-none">
      <!-- Left: Back to Dashboard Button & Live Ecosystem Status -->
      <div class="flex items-center gap-3 pointer-events-auto">
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-50 transition text-xs font-bold text-d4 cursor-pointer"
        >
          <Icon name="mdi:arrow-right" class="w-4 h-4" :class="isRTL ? '' : 'rotate-180'" />
          <span>{{ isRTL ? 'بازگشت به پیشخوان' : 'Back to Dashboard' }}</span>
        </NuxtLink>

        <div class="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-extrabold text-slate-900 text-d4">
            {{ isRTL ? 'نقشه معماری سامانه (Najm Ecosystem Blueprint)' : 'System Architecture Blueprint' }}
          </span>
          <span class="px-2 py-0.5 rounded-full bg-teal-50 text-[#018786] text-[10px] font-mono border border-teal-200 font-bold">
            {{ visibleNodes.length }} گره فعال
          </span>
        </div>
      </div>

      <!-- Center: Auto-Center & Camera Reset -->
      <div class="pointer-events-auto flex items-center gap-2">
        <button
          @click="resetToCenter"
          class="px-5 py-2.5 rounded-2xl bg-[#018786] hover:bg-emerald-800 text-white font-bold text-xs shadow-xl transition-all flex items-center gap-2 cursor-pointer text-d4 active:scale-95"
        >
          <Icon name="mdi:crosshairs-gps" class="w-4 h-4 text-emerald-200" />
          <span>{{ isRTL ? 'تمرکز در مرکز (Auto-Center)' : 'Auto-Center View' }}</span>
        </button>

        <!-- Viewport Presets -->
        <div class="hidden lg:flex items-center gap-1 bg-white/90 backdrop-blur-xl p-1 rounded-2xl border border-slate-200 shadow-xl text-xs">
          <button
            v-for="preset in presets"
            :key="preset.id"
            @click="applyPreset(preset)"
            class="px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-d4"
            :class="activePreset === preset.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'"
          >
            {{ isRTL ? preset.labelFa : preset.labelEn }}
          </button>
        </div>
      </div>

      <!-- Right: Zoom & Search Controls -->
      <div class="flex items-center gap-2 pointer-events-auto">
        <!-- Search Input -->
        <div class="relative w-40 sm:w-56 hidden md:block">
          <Icon name="mdi:magnify" class="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="isRTL ? 'جستجوی گره یا مسیر...' : 'Search node or path...'"
            class="w-full bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl pr-9 pl-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xl transition"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-700">
            <Icon name="mdi:close-circle" class="w-4 h-4" />
          </button>
        </div>

        <!-- Zoom Controls -->
        <div class="flex items-center gap-1 bg-white/90 backdrop-blur-xl p-1 rounded-2xl border border-slate-200 shadow-xl">
          <button @click="zoomIn" class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer" title="Zoom In">
            <Icon name="mdi:plus" class="w-4 h-4" />
          </button>
          <span class="px-2 font-mono text-xs text-emerald-700 font-bold">{{ Math.round(zoomScale * 100) }}%</span>
          <button @click="zoomOut" class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer" title="Zoom Out">
            <Icon name="mdi:minus" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Bottom Category Floating Bar -->
    <div class="absolute bottom-5 inset-x-0 z-40 flex justify-center pointer-events-none">
      <div class="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl rounded-full px-3 py-2 flex items-center gap-1.5 overflow-x-auto max-w-[95vw] no-scrollbar">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap text-d4"
          :class="[
            activeCategory === cat.id
              ? 'bg-[#018786] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
        >
          {{ isRTL ? cat.labelFa : cat.labelEn }}
          <span class="ml-1 text-[10px] font-mono opacity-80">({{ getCategoryCount(cat.id) }})</span>
        </button>
      </div>
    </div>

    <!-- 60 FPS Infinite Spatial Blueprint Stage -->
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
      <!-- Single Unified Transform Wrapper for Both Vector Curves and Nodes -->
      <div
        class="absolute inset-0 w-full h-full origin-top-left z-10 transition-transform duration-75 ease-out"
        :style="{
          transform: `translate3d(${panX}px, ${panY}px, 0px) scale(${zoomScale})`,
          willChange: 'transform'
        }"
      >
        <!-- Connected Curved SVG Vector Lines -->
        <svg class="absolute inset-0 w-[3600px] h-[2400px] pointer-events-none z-10 overflow-visible">
          <g v-for="edge in visibleEdges" :key="`${edge.from}-${edge.to}`">
            <!-- Shadow Curve for Contrast -->
            <path
              :d="getEdgePath(edge)"
              fill="none"
              stroke="#e2e8f0"
              stroke-width="4"
              stroke-linecap="round"
            />
            <!-- Main Glowing Bezier Line -->
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeHighlighted(edge) ? '#018786' : '#94a3b8'"
              :stroke-width="isEdgeHighlighted(edge) ? 3.5 : 1.75"
              stroke-linecap="round"
              class="transition-all duration-300"
            />
            <!-- Flow Particle Animation -->
            <circle
              v-if="isEdgeHighlighted(edge)"
              r="4.5"
              fill="#018786"
              class="filter drop-shadow-md"
            >
              <animateMotion
                :path="getEdgePath(edge)"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>

        <!-- Spatial Blueprint Nodes (Categorized Geometric Cell Designs) -->
        <div
          v-for="node in visibleNodes"
          :key="node.id"
          @click.stop="selectNode(node)"
          @mouseenter="hoveredNodeId = node.id"
          @mouseleave="hoveredNodeId = null"
          class="absolute transition-all duration-300 cursor-pointer group z-20"
          :style="{
            left: `${node.x}px`,
            top: `${node.y}px`
          }"
        >
          <!-- 1. CORE ENGINE & HYDRATION (Center Hub) -> Rich Emerald Hologram Card -->
          <div
            v-if="node.category === 'engine'"
            class="rounded-3xl bg-emerald-900 text-white p-5 border-2 border-emerald-400 shadow-2xl transition-all duration-300 relative overflow-hidden group"
            :style="{ width: `${node.width}px`, height: `${node.height}px` }"
            :class="[
              selectedNode?.id === node.id ? 'ring-4 ring-emerald-400/40 scale-105 z-30' : 'hover:scale-103 z-20'
            ]"
          >
            <div class="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-emerald-500/20 blur-xl pointer-events-none"></div>

            <div class="flex items-center justify-between mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-d4">
                هسته مرکزی و SWR
              </span>
              <Icon :name="node.icon" class="w-6 h-6 text-emerald-300" />
            </div>

            <h3 class="text-lg font-extrabold text-white text-d4 truncate mb-1">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </h3>

            <p class="text-[10px] font-mono text-emerald-200/80 truncate text-left ltr mb-2">
              {{ node.path }}
            </p>

            <div class="pt-2 border-t border-emerald-700/60 flex justify-between text-[10px] font-mono text-emerald-200">
              <span>Hydration: 0ms Eager</span>
              <span class="text-emerald-300 font-bold">Active</span>
            </div>
          </div>

          <!-- 2. PUBLIC PAGES (SITEMAP) -> Clean Rounded Glass Card -->
          <div
            v-else-if="node.category === 'pages'"
            class="rounded-3xl bg-white border border-slate-200 shadow-lg p-4 transition-all duration-300 flex flex-col justify-between"
            :style="{ width: `${node.width}px`, height: `${node.height}px` }"
            :class="[
              selectedNode?.id === node.id
                ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-xl scale-105 z-30'
                : hoveredNodeId === node.id
                  ? 'border-emerald-400 shadow-md scale-102 z-20'
                  : 'hover:border-slate-300 z-10'
            ]"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#018786] border border-teal-200 text-d4">
                  {{ isRTL ? 'صفحه وبسایت' : 'Page' }}
                </span>
                <Icon :name="node.icon" class="w-5 h-5 text-slate-400 group-hover:text-[#018786] transition" />
              </div>

              <h3 class="font-extrabold text-slate-900 text-d4 group-hover:text-[#018786] transition truncate text-sm mb-0.5">
                {{ isRTL ? node.titleFa : node.titleEn }}
              </h3>

              <p class="text-[10px] font-mono text-slate-400 truncate text-left ltr">
                {{ node.path }}
              </p>
            </div>

            <div class="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Route: {{ node.specs.Route }}</span>
              <span class="text-emerald-600 font-bold">200 OK</span>
            </div>
          </div>

          <!-- 3. UI COMPONENTS & MODALS -> Chamfered Tech Badge -->
          <div
            v-else-if="node.category === 'components'"
            class="rounded-2xl bg-white border-l-4 border-l-purple-500 border-y border-r border-slate-200 shadow-md p-3.5 transition-all duration-300 flex flex-col justify-between"
            :style="{ width: `${node.width}px`, height: `${node.height}px` }"
            :class="[
              selectedNode?.id === node.id ? 'ring-2 ring-purple-400 scale-105 z-30' : 'hover:border-purple-300 z-10'
            ]"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 text-d4">
                {{ isRTL ? 'کامپوننت UI' : 'UI Component' }}
              </span>
              <Icon :name="node.icon" class="w-4.5 h-4.5 text-purple-600" />
            </div>
            <div>
              <h3 class="text-xs font-bold text-slate-800 text-d4 truncate mb-0.5">
                {{ isRTL ? node.titleFa : node.titleEn }}
              </h3>
              <p class="text-[10px] font-mono text-slate-400 truncate text-left ltr">
                {{ node.path }}
              </p>
            </div>
          </div>

          <!-- 4. POCKETBASE DATABASE COLLECTIONS -> Cylinder Stacked Card -->
          <div
            v-else-if="node.category === 'pb'"
            class="rounded-2xl bg-white border-t-4 border-t-emerald-500 border-x border-b border-slate-200 shadow-md p-3.5 transition-all duration-300 flex flex-col justify-between"
            :style="{ width: `${node.width}px`, height: `${node.height}px` }"
            :class="[
              selectedNode?.id === node.id ? 'ring-2 ring-emerald-400 scale-105 z-30' : 'hover:border-emerald-300 z-10'
            ]"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 text-d4">
                {{ isRTL ? 'کالکشن PocketBase' : 'PB Collection' }}
              </span>
              <Icon :name="node.icon" class="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <div>
              <h3 class="text-xs font-bold text-slate-800 text-d4 truncate mb-0.5">
                {{ isRTL ? node.titleFa : node.titleEn }}
              </h3>
              <p class="text-[10px] font-mono text-slate-400 truncate text-left ltr">
                {{ node.path }}
              </p>
            </div>
          </div>

          <!-- 5. SERVER API ENDPOINTS -> Octagon Sharp Tech Badge -->
          <div
            v-else
            class="rounded-2xl bg-white border-l-4 border-l-rose-500 border-y border-r border-slate-200 shadow-md p-3.5 transition-all duration-300 flex flex-col justify-between"
            :style="{ width: `${node.width}px`, height: `${node.height}px` }"
            :class="[
              selectedNode?.id === node.id ? 'ring-2 ring-rose-400 scale-105 z-30' : 'hover:border-rose-300 z-10'
            ]"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 text-d4">
                {{ isRTL ? 'سرویس API' : 'Server API' }}
              </span>
              <Icon :name="node.icon" class="w-4 h-4 text-rose-600" />
            </div>
            <div>
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
    </div>

    <!-- Node Technical Inspector Drawer -->
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
  layout: false
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

// Options State
const activeCategory = ref('all')
const activePreset = ref('overview')
const searchQuery = ref('')
const hoveredNodeId = ref<string | null>(null)
const selectedNode = ref<SpatialNode | null>(null)

// 60 FPS Pan & Zoom
const panX = ref(140)
const panY = ref(120)
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
  panX.value = 140
  panY.value = 120
  zoomScale.value = 0.95
  activePreset.value = 'overview'
}

function onCanvasDblClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('cursor-grab')) {
    resetToCenter()
  }
}

const presets = [
  { id: 'overview', labelFa: 'نمای کلی', labelEn: 'Overview', panX: 140, panY: 120, zoom: 0.95 },
  { id: 'sitemap', labelFa: 'صفحات وبسایت', labelEn: 'Frontend Pages', panX: 400, panY: 120, zoom: 1.1 },
  { id: 'database', labelFa: 'دیتابیس PocketBase', labelEn: 'PocketBase Engine', panX: -450, panY: 100, zoom: 1.1 },
]

function applyPreset(preset: typeof presets[0]) {
  activePreset.value = preset.id
  panX.value = preset.panX
  panY.value = preset.panY
  zoomScale.value = preset.zoom
}

const categories = [
  { id: 'all', labelFa: 'همه گره‌ها', labelEn: 'All' },
  { id: 'engine', labelFa: 'موتور مرکزی SWR', labelEn: 'SWR Engine' },
  { id: 'pages', labelFa: 'صفحات اصلی', labelEn: 'Pages' },
  { id: 'components', labelFa: 'کامپوننت‌ها', labelEn: 'Components' },
  { id: 'pb', labelFa: 'دیتابیس PB', labelEn: 'Database' },
  { id: 'api', labelFa: 'ای‌پی‌آی سرور', labelEn: 'APIs' },
]

interface SpatialNode {
  id: string
  category: 'engine' | 'pages' | 'components' | 'pb' | 'api'
  importance: number
  titleFa: string
  titleEn: string
  path: string
  descFa: string
  descEn: string
  icon: string
  x: number
  y: number
  width: number
  height: number
  specs: Record<string, string>
  actionUrl?: string
}

interface Edge {
  from: string
  to: string
}

// 5 Orbital Blueprint Zones with Perfect Spatial Balance
const allNodes: SpatialNode[] = [
  // ZONE 1: CENTER CORE ENGINE (The Heart of SWR & Hydration)
  {
    id: 'swr-engine',
    category: 'engine',
    importance: 1,
    titleFa: 'موتور SWR & Hydration (usePageUI)',
    titleEn: 'usePageUI SWR Engine',
    path: 'composables/ui/usePageUI.ts',
    descFa: 'هسته مرکزی لود ۰ms با اسکیماهای محلی JSON و همگام‌سازی پس‌زمینه PB.',
    descEn: 'Core 0ms instant hydration + background PocketBase sync engine.',
    icon: 'mdi:flash-outline',
    x: 650,
    y: 280,
    width: 320,
    height: 160,
    specs: { Strategy: 'SWR 0ms', Hydration: 'Eager JSON + PB Sync' }
  },

  // ZONE 2: PUBLIC FRONTEND SITEMAP (Left Orbit Column)
  {
    id: 'home',
    category: 'pages',
    importance: 1,
    titleFa: 'صفحه اصلی (Home Hub)',
    titleEn: 'Home Main Hub',
    path: 'pages/index.vue',
    descFa: 'ورودی اصلی فرانت‌اند با صحنه‌های سه بعدی و کاتالوگ.',
    descEn: 'Main frontend landing page with 3D scenes.',
    icon: 'mdi:home-outline',
    x: 180,
    y: 80,
    width: 280,
    height: 140,
    specs: { Route: '/', Layout: 'default' },
    actionUrl: '/'
  },
  {
    id: 'about',
    category: 'pages',
    importance: 2,
    titleFa: 'درباره ما (About Us)',
    titleEn: 'About Us Page',
    path: 'pages/about/index.vue',
    descFa: 'روایت صنعتی، تیم فنی و بخش پین‌شده 360vh.',
    descEn: 'Industrial history and 360vh solutions stage.',
    icon: 'mdi:information-outline',
    x: 180,
    y: 270,
    width: 260,
    height: 135,
    specs: { Route: '/about', Layout: 'default' },
    actionUrl: '/about'
  },
  {
    id: 'products',
    category: 'pages',
    importance: 2,
    titleFa: 'محصولات (Products)',
    titleEn: 'Products Catalog',
    path: 'pages/products/index.vue',
    descFa: '۱۲ نوع محصول با موکاپ وکتور SVG.',
    descEn: '12 authentic products with vector SVG mockups.',
    icon: 'mdi:package-variant-closed',
    x: 180,
    y: 450,
    width: 260,
    height: 135,
    specs: { Route: '/products', Layout: 'default' },
    actionUrl: '/products'
  },

  // ZONE 3: UI COMPONENTS & MODALS (Top Orbit Zone)
  {
    id: 'gsap-pinned',
    category: 'components',
    importance: 3,
    titleFa: 'استیج پین‌شده راهکارها',
    titleEn: 'GSAP Pinned Stage',
    path: 'components/about/AboutGsapPinnedSection.vue',
    descFa: 'استیج قفل‌شده 360vh با گام‌بندی.',
    descEn: 'Sticky 360vh pinned viewport stage.',
    icon: 'mdi:view-carousel-outline',
    x: 650,
    y: 80,
    width: 250,
    height: 110,
    specs: { Mode: 'Sticky 360vh' }
  },

  // ZONE 4: BACKEND POCKETBASE DATA LAYER (Right Orbit Column)
  {
    id: 'pb-pages-coll',
    category: 'pb',
    importance: 2,
    titleFa: 'کالکشن اسکیما (pages)',
    titleEn: 'Pages Collection',
    path: 'PocketBase: pages',
    descFa: 'رکورد سه زبانه uiData برای تمام ۱۱ صفحه.',
    descEn: 'Trilingual UI schema records for all public pages.',
    icon: 'mdi:database-outline',
    x: 1150,
    y: 200,
    width: 260,
    height: 120,
    specs: { Type: 'PocketBase Record' }
  },
  {
    id: 'pb-products-coll',
    category: 'pb',
    importance: 2,
    titleFa: 'کالکشن محصولات (products)',
    titleEn: 'Products Collection',
    path: 'PocketBase: products',
    descFa: 'مشخصات فنی و قیمت کاتالوگ محصولات.',
    descEn: 'Product specs, min quantities, and prices.',
    icon: 'mdi:cube-outline',
    x: 1150,
    y: 360,
    width: 260,
    height: 120,
    specs: { Type: 'PocketBase Record' }
  },

  // ZONE 5: SERVER APIS & PUBLISHING ENGINE (Bottom Orbit Zone)
  {
    id: 'api-publish',
    category: 'api',
    importance: 3,
    titleFa: 'ای‌پی‌آی انتشار (publish)',
    titleEn: 'Publish API',
    path: 'server/api/admin/ui/publish.post.ts',
    descFa: 'انتشار رسمی پیش‌نویس‌های CMS روی PocketBase.',
    descEn: 'Publishes CMS drafts to production PocketBase.',
    icon: 'mdi:cloud-upload-outline',
    x: 650,
    y: 520,
    width: 240,
    height: 110,
    specs: { Method: 'POST', Endpoint: '/api/admin/ui/publish' }
  }
]

const allEdges: Edge[] = [
  { from: 'swr-engine', to: 'home' },
  { from: 'swr-engine', to: 'about' },
  { from: 'swr-engine', to: 'products' },
  { from: 'about', to: 'gsap-pinned' },
  { from: 'swr-engine', to: 'pb-pages-coll' },
  { from: 'products', to: 'pb-products-coll' },
  { from: 'swr-engine', to: 'api-publish' }
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

  // Smoothly center camera onto selected node
  panX.value = -node.x * zoomScale.value + window.innerWidth / 2 - (node.width * zoomScale.value) / 2
  panY.value = -node.y * zoomScale.value + window.innerHeight / 2 - (node.height * zoomScale.value) / 2
}

function isEdgeHighlighted(edge: Edge) {
  if (!hoveredNodeId.value && !selectedNode.value) return false
  const activeId = hoveredNodeId.value || selectedNode.value?.id
  return edge.from === activeId || edge.to === activeId
}

// Calculate Cubic Bezier Vector Paths from Exact Cell Anchor Centers
function getEdgePath(edge: Edge) {
  const fromNode = allNodes.find(n => n.id === edge.from)
  const toNode = allNodes.find(n => n.id === edge.to)
  if (!fromNode || !toNode) return ''

  // Dynamic Anchor Midpoints
  const x1 = fromNode.x + fromNode.width / 2
  const y1 = fromNode.y + fromNode.height / 2
  const x2 = toNode.x + toNode.width / 2
  const y2 = toNode.y + toNode.height / 2

  const dx = (x2 - x1) * 0.5
  const dy = (y2 - y1) * 0.5

  const cx1 = x1 + dx
  const cy1 = y1
  const cx2 = x2 - dx
  const cy2 = y2

  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
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
