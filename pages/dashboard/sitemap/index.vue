<!-- pages/dashboard/sitemap/index.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-0 z-50 h-screen w-screen bg-[#FAFAFA] text-slate-900 select-none overflow-hidden font-sans"
  >
    <!-- Artistic Architectural Canvas Background -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <!-- Subtle Swiss Modernist Dot Grid -->
      <div
        class="absolute inset-0 opacity-40 transition-all duration-75"
        :style="{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: `${32 * zoomScale}px ${32 * zoomScale}px`,
          backgroundPosition: `${panX}px ${panY}px`
        }"
      ></div>
      <!-- Soft Radial Vignette for Depth -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_0%,rgba(241,245,249,0.5)_60%,rgba(226,232,240,0.8)_100%)]"></div>
    </div>

    <!-- Floating Zen Header HUD (Minimalist, Non-Distracting) -->
    <header class="absolute top-6 inset-x-6 z-40 flex items-center justify-between pointer-events-none">
      <!-- Left: Discreet Dashboard Exit Pill & Brand Monogram -->
      <div class="flex items-center gap-3 pointer-events-auto">
        <NuxtLink
          to="/dashboard"
          class="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-slate-700 hover:text-emerald-800 hover:border-emerald-300 transition-all text-xs font-bold text-d4"
        >
          <Icon name="mdi:arrow-right" class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" :class="isRTL ? '' : 'rotate-180 group-hover:translate-x-0.5'" />
          <span>{{ isRTL ? 'بازگشت به پیشخوان' : 'Exit to Dashboard' }}</span>
        </NuxtLink>

        <div class="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <span class="w-2 h-2 rounded-full bg-[#018786] animate-pulse"></span>
          <span class="text-xs font-extrabold text-slate-800 text-d4 tracking-tight">
            {{ isRTL ? 'سامانه فضایی نقشه وبسایت' : 'Spatial Site Constellation' }}
          </span>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold">
            {{ nodes.length }} Nodes
          </span>
        </div>
      </div>

      <!-- Center: Auto-Center Quick Target Pill -->
      <div class="pointer-events-auto flex items-center gap-2">
        <button
          @click="resetToCenter"
          class="px-5 py-2 rounded-full bg-[#018786] hover:bg-emerald-800 text-white font-bold text-xs shadow-[0_4px_20px_rgba(1,135,134,0.25)] hover:shadow-[0_6px_24px_rgba(1,135,134,0.35)] transition-all flex items-center gap-2 text-d4 cursor-pointer active:scale-95"
        >
          <Icon name="mdi:crosshairs-gps" class="w-4 h-4 text-emerald-200" />
          <span>{{ isRTL ? 'تمرکز بر مرکز' : 'Recenter Canvas' }}</span>
        </button>

        <!-- Lens Category Quick Filters -->
        <div class="hidden lg:flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 rounded-full border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-xs">
          <button
            v-for="lens in lenses"
            :key="lens.id"
            @click="activeLens = lens.id"
            class="px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer text-d4"
            :class="activeLens === lens.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'"
          >
            {{ isRTL ? lens.labelFa : lens.labelEn }}
          </button>
        </div>
      </div>

      <!-- Right: Search Lens & Zoom Stepper -->
      <div class="flex items-center gap-2 pointer-events-auto">
        <!-- Search Pill -->
        <div class="relative w-44 sm:w-60">
          <Icon name="mdi:magnify" class="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="isRTL ? 'کاوش در گره‌ها و مسیرها...' : 'Search nodes or paths...'"
            class="w-full bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-full pr-10 pl-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#018786] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="absolute left-3 top-2.5 text-slate-400 hover:text-slate-700">
            <Icon name="mdi:close-circle" class="w-4 h-4" />
          </button>
        </div>

        <!-- Zoom Controls -->
        <div class="flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 rounded-full border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <button @click="zoomIn" class="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer" title="Zoom In">
            <Icon name="mdi:plus" class="w-4 h-4" />
          </button>
          <span class="px-2 font-mono text-xs text-emerald-800 font-bold">{{ Math.round(zoomScale * 100) }}%</span>
          <button @click="zoomOut" class="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer" title="Zoom Out">
            <Icon name="mdi:minus" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Bottom HUD Info Pill -->
    <div class="absolute bottom-6 inset-x-6 z-40 flex items-center justify-between pointer-events-none">
      <div class="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-md text-xs text-slate-500 font-mono">
        <span>Canvas: 3600 × 2400 px</span>
        <span>•</span>
        <span>Double-click to reset</span>
      </div>

      <!-- Constellation Legend -->
      <div class="pointer-events-auto hidden md:flex items-center gap-4 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-md text-xs text-slate-600 font-bold text-d4">
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-[#018786]"></span>
          <span>{{ isRTL ? 'هسته و صفحات' : 'Core & Pages' }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>{{ isRTL ? 'محصولات و کاتالوگ' : 'Products & Catalog' }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>{{ isRTL ? 'تجهیزات و خدمات' : 'Fleet & Services' }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>{{ isRTL ? 'دانش و تاریخچه' : 'Knowledge & Story' }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>{{ isRTL ? 'استعلام و ارتباط' : 'Action & Contact' }}</span>
        </div>
      </div>
    </div>

    <!-- Pure Infinite Spatial Stage (Hardware Accelerated, Gesture Drag & Zoom) -->
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
      <!-- Single Unified Spatial Vector & Node World Plane -->
      <div
        class="absolute inset-0 w-full h-full origin-top-left z-10 transition-transform duration-75 ease-out"
        :style="{
          transform: `translate3d(${panX}px, ${panY}px, 0px) scale(${zoomScale})`,
          willChange: 'transform'
        }"
      >
        <!-- ABSTRACT SVG CONSTELLATION CONNECTION ARCS -->
        <svg class="absolute inset-0 w-[4200px] h-[3000px] pointer-events-none z-10 overflow-visible">
          <!-- Orbital Guide Rings (Architectural Spatial Structure) -->
          <g opacity="0.18">
            <circle cx="1800" cy="1300" r="320" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6 6" />
            <circle cx="1800" cy="1300" r="620" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="8 8" />
            <circle cx="1800" cy="1300" r="950" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 10" />
          </g>

          <!-- Dynamic Bezier Vector Edges with Artistic Flow Particles -->
          <g v-for="edge in visibleEdges" :key="`${edge.from}-${edge.to}`">
            <!-- Background Glow Curve -->
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeActive(edge) ? edgeColor(edge.color, 0.25) : 'rgba(203, 213, 225, 0.6)'"
              :stroke-width="isEdgeActive(edge) ? 8 : 2"
              stroke-linecap="round"
              class="transition-all duration-300"
            />
            <!-- Main Crisp Vector Arcs -->
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeActive(edge) ? edgeColor(edge.color, 1) : '#94a3b8'"
              :stroke-width="isEdgeActive(edge) ? 2.5 : 1.2"
              :stroke-dasharray="edge.dashed ? '5 5' : 'none'"
              stroke-linecap="round"
              class="transition-all duration-300"
            />
            <!-- Living Energy Pulse Dot -->
            <circle
              v-if="isEdgeActive(edge)"
              r="4.5"
              :fill="edgeColor(edge.color, 1)"
              class="filter drop-shadow-sm"
            >
              <animateMotion
                :path="getEdgePath(edge)"
                :dur="`${edge.speed || 2.5}s`"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>

        <!-- ARTISTIC SPATIAL NODES (Constellation Clusters) -->
        <div
          v-for="node in visibleNodes"
          :key="node.id"
          @click.stop="selectNode(node)"
          @mouseenter="hoveredNodeId = node.id"
          @mouseleave="hoveredNodeId = null"
          class="absolute transition-all duration-300 cursor-pointer group z-20"
          :style="{
            left: `${node.x}px`,
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%)'
          }"
        >
          <!-- NODE VARIANT 1: THE CORE SOLAR NUCLEUS (Hub - /) -->
          <div
            v-if="node.type === 'nucleus'"
            class="relative flex flex-col items-center justify-center rounded-full bg-white border-4 border-[#018786] shadow-[0_20px_50px_rgba(1,135,134,0.22)] p-6 transition-all duration-500 group-hover:scale-105"
            :style="{ width: `${node.size}px`, height: `${node.size}px` }"
            :class="selectedNode?.id === node.id ? 'ring-8 ring-emerald-500/20 scale-105' : ''"
          >
            <!-- Ambient Pulsing Corona -->
            <div class="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping pointer-events-none"></div>

            <div class="w-14 h-14 rounded-full bg-[#018786] text-white flex items-center justify-center shadow-lg mb-2">
              <Icon :name="node.icon" class="w-7 h-7" />
            </div>

            <span class="text-xs font-bold text-[#018786] tracking-wider uppercase font-mono mb-0.5">ECOSYSTEM CORE</span>
            <h2 class="text-base font-extrabold text-slate-900 text-d4 text-center leading-tight">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </h2>
            <span class="text-[10px] font-mono text-slate-400 mt-1">/</span>
          </div>

          <!-- NODE VARIANT 2: PRIMARY PILLAR CLUSTERS (Level 2 Main Orbit) -->
          <div
            v-else-if="node.type === 'pillar'"
            class="relative flex flex-col items-center justify-center rounded-full bg-white/95 backdrop-blur-md border-2 shadow-[0_12px_32px_rgba(0,0,0,0.06)] p-5 transition-all duration-400 group-hover:scale-105 text-center"
            :style="{ width: `${node.size}px`, height: `${node.size}px`, borderColor: node.accentColor }"
            :class="[
              selectedNode?.id === node.id
                ? 'ring-6 ring-emerald-500/20 scale-105 z-30 shadow-xl'
                : hoveredNodeId === node.id
                  ? 'scale-103 shadow-lg z-20'
                  : 'z-10'
            ]"
          >
            <div
              class="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md mb-2 transition-transform group-hover:scale-110"
              :style="{ backgroundColor: node.accentColor }"
            >
              <Icon :name="node.icon" class="w-5 h-5" />
            </div>

            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1 text-d4" :style="{ backgroundColor: `${node.accentColor}15`, color: node.accentColor }">
              {{ isRTL ? node.badgeFa : node.badgeEn }}
            </span>

            <h3 class="text-xs font-extrabold text-slate-900 text-d4 truncate max-w-[130px]">
              {{ isRTL ? node.titleFa : node.titleEn }}
            </h3>

            <span class="text-[9px] font-mono text-slate-400 mt-0.5">
              {{ node.path }}
            </span>
          </div>

          <!-- NODE VARIANT 3: DETAIL SATELLITE ISLANDS (Level 3 Deep Features) -->
          <div
            v-else-if="node.type === 'satellite'"
            class="relative flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border shadow-[0_6px_20px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:scale-105 whitespace-nowrap"
            :style="{ borderColor: node.accentColor ? `${node.accentColor}60` : '#e2e8f0' }"
            :class="[
              selectedNode?.id === node.id
                ? 'ring-4 ring-emerald-500/20 scale-105 z-30 border-emerald-500 shadow-md'
                : 'hover:border-slate-300 z-10'
            ]"
          >
            <div
              class="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs shadow-xs shrink-0"
              :style="{ backgroundColor: node.accentColor || '#64748b' }"
            >
              <Icon :name="node.icon" class="w-3.5 h-3.5" />
            </div>

            <div>
              <div class="text-xs font-bold text-slate-800 text-d4">
                {{ isRTL ? node.titleFa : node.titleEn }}
              </div>
              <div class="text-[9px] font-mono text-slate-400">
                {{ node.path || node.meta }}
              </div>
            </div>

            <span v-if="node.tag" class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {{ node.tag }}
            </span>
          </div>

          <!-- NODE VARIANT 4: MICRO FEATURE GLYPHS (Level 4 Capabilities) -->
          <div
            v-else
            class="relative flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm p-2 transition-all duration-300 group-hover:scale-115"
            :style="{ width: `${node.size || 36}px`, height: `${node.size || 36}px` }"
            :class="selectedNode?.id === node.id ? 'ring-4 ring-emerald-500/30 border-[#018786]' : ''"
            :title="isRTL ? node.titleFa : node.titleEn"
          >
            <Icon :name="node.icon" class="w-4 h-4" :style="{ color: node.accentColor || '#018786' }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Luxury Frosted Glass Node Inspector Sheet (Right Drawer) -->
    <transition name="sheet-slide">
      <div
        v-if="selectedNode"
        class="absolute inset-y-6 right-6 z-50 w-full sm:w-[400px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl text-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div class="space-y-6">
          <!-- Sheet Header -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                :style="{ backgroundColor: selectedNode.accentColor || '#018786' }"
              >
                <Icon :name="selectedNode.icon" class="w-5 h-5" />
              </div>
              <div>
                <span class="text-[10px] font-bold tracking-wider uppercase font-mono text-slate-400">NODE INSPECTOR</span>
                <div class="text-xs font-mono font-bold text-[#018786]">ID #{{ selectedNode.id }}</div>
              </div>
            </div>

            <button
              @click="selectedNode = null"
              class="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
            >
              <Icon name="mdi:close" class="w-4.5 h-4.5" />
            </button>
          </div>

          <!-- Title & Live Route -->
          <div class="space-y-2 text-right">
            <span
              v-if="selectedNode.badgeFa"
              class="inline-block px-3 py-1 rounded-full text-xs font-bold text-d4"
              :style="{ backgroundColor: `${selectedNode.accentColor || '#018786'}15`, color: selectedNode.accentColor || '#018786' }"
            >
              {{ isRTL ? selectedNode.badgeFa : selectedNode.badgeEn }}
            </span>

            <h2 class="text-xl font-extrabold text-slate-900 text-d4 leading-tight">
              {{ isRTL ? selectedNode.titleFa : selectedNode.titleEn }}
            </h2>

            <div v-if="selectedNode.path" class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-emerald-800 ltr text-left overflow-x-auto">
              {{ selectedNode.path }}
            </div>
          </div>

          <!-- Narrative Architectural Role -->
          <div class="space-y-2 text-right">
            <h3 class="text-xs font-bold text-slate-400 text-d4 uppercase tracking-wider">نقش در اکوسیستم وبسایت</h3>
            <p class="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
              {{ isRTL ? selectedNode.descFa : selectedNode.descEn }}
            </p>
          </div>

          <!-- Connected Capabilities / Child Modules -->
          <div v-if="selectedNode.capabilities?.length" class="space-y-2.5 text-right">
            <h3 class="text-xs font-bold text-slate-400 text-d4 uppercase tracking-wider">زیرسیستم‌ها و قابلیت‌ها</h3>
            <div class="space-y-2">
              <div
                v-for="cap in selectedNode.capabilities"
                :key="cap.title"
                class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: selectedNode.accentColor || '#018786' }"></span>
                  <span class="font-bold text-slate-800 text-d4">{{ cap.title }}</span>
                </div>
                <span class="text-[10px] font-mono text-slate-400">{{ cap.meta }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons Footer -->
        <div class="pt-6 border-t border-slate-100 space-y-2">
          <NuxtLink
            v-if="selectedNode.path && !selectedNode.path.includes('[')"
            :to="selectedNode.path"
            target="_blank"
            class="block w-full py-3 rounded-2xl bg-[#018786] hover:bg-emerald-800 text-white font-bold text-xs text-center transition shadow-md text-d4"
          >
            {{ isRTL ? 'مشاهده زنده این صفحه ↗' : 'View Live Route ↗' }}
          </NuxtLink>

          <NuxtLink
            to="/dashboard/cms"
            class="block w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition text-d4"
          >
            {{ isRTL ? 'تنظیم محتوا در استودیو CMS' : 'Edit in CMS Studio' }}
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
  layout: false // Standalone Pure Artistic Fullscreen Canvas
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

// Canvas HUD Controls
const activeLens = ref('all') // all, pages, products, services, knowledge, admin
const searchQuery = ref('')
const hoveredNodeId = ref<string | null>(null)
const selectedNode = ref<SpatialConstellationNode | null>(null)

// 60-120 FPS Pan & Zoom Coordinate Matrix
const panX = ref(window.innerWidth > 1024 ? -1000 : -1300)
const panY = ref(window.innerHeight > 800 ? -700 : -850)
const zoomScale = ref(0.85)
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
  const delta = e.deltaY > 0 ? -0.06 : 0.06
  zoomScale.value = Math.max(0.35, Math.min(2.0, zoomScale.value + delta))
}

function zoomIn() {
  zoomScale.value = Math.min(2.0, zoomScale.value + 0.15)
}

function zoomOut() {
  zoomScale.value = Math.max(0.35, zoomScale.value - 0.15)
}

function resetToCenter() {
  // Center onto the Solar Nucleus (1800, 1300)
  panX.value = window.innerWidth / 2 - 1800 * 0.85
  panY.value = window.innerHeight / 2 - 1300 * 0.85
  zoomScale.value = 0.85
  activeLens.value = 'all'
}

function onCanvasDblClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('cursor-grab')) {
    resetToCenter()
  }
}

const lenses = [
  { id: 'all', labelFa: 'همه مدارها', labelEn: 'All Orbits' },
  { id: 'pages', labelFa: 'صفحات اصلی', labelEn: 'Core Pages' },
  { id: 'products', labelFa: 'محصولات', labelEn: 'Products' },
  { id: 'services', labelFa: 'خدمات و کارخانه', labelEn: 'Fleet & Process' },
  { id: 'knowledge', labelFa: 'دانش و تاریخچه', labelEn: 'Knowledge' },
]

interface SpatialConstellationNode {
  id: string
  type: 'nucleus' | 'pillar' | 'satellite' | 'micro'
  lens: string
  titleFa: string
  titleEn: string
  badgeFa?: string
  badgeEn?: string
  path?: string
  meta?: string
  tag?: string
  descFa: string
  descEn: string
  icon: string
  accentColor?: string
  size?: number
  x: number
  y: number
  capabilities?: { title: string; meta: string }[]
}

interface ConstellationEdge {
  from: string
  to: string
  color: string
  dashed?: boolean
  speed?: number
}

// SPATIAL CONSTELLATION NODES (Center Nucleus at 1800, 1300)
const nodes: SpatialConstellationNode[] = [
  // ☀️ NUCLEUS (The Solar Heart of Najm Web)
  {
    id: 'core-home',
    type: 'nucleus',
    lens: 'pages',
    titleFa: 'مجتمع چاپ و بسته‌بندی نجم',
    titleEn: 'Najm Industrial Core',
    path: '/',
    descFa: 'هسته اصلی سامانه؛ تلفیق زیبایی‌شناسی صنعتی، صحنه‌های سه‌بعدی کاتالوگ و درگاه ورود مخاطبان.',
    descEn: 'The central industrial nucleus combining 3D product scenes and entry workflows.',
    icon: 'mdi:hexagon-multiple-outline',
    size: 210,
    x: 1800,
    y: 1300,
    capabilities: [
      { title: 'استیج سه‌بعدی نوری', meta: 'WebGL 60FPS' },
      { title: 'محاسبه‌گر آنلاین تیراژ', meta: 'Realtime Quote' },
      { title: 'ناوبری شناور هوشمند', meta: 'Header Capsule' }
    ]
  },

  // 🪐 ORBIT 1: ABOUT US & INDUSTRIAL STORY (Top-Left Pillar)
  {
    id: 'about-pillar',
    type: 'pillar',
    lens: 'pages',
    badgeFa: 'روایت صنعتی',
    badgeEn: 'Industrial Heritage',
    titleFa: 'درباره ما',
    titleEn: 'About Us',
    path: '/about',
    descFa: 'معرفی بیش از دو دهه سابقه، سرمایه انسانی و خطوط پیشرفته افست ۵ رنگ هایدلبرگ.',
    descEn: '25-year heritage, human craft leads, and advanced Heidelberg 5-color fleet.',
    icon: 'mdi:information-outline',
    accentColor: '#018786',
    size: 155,
    x: 1350,
    y: 950,
    capabilities: [
      { title: 'تیم سرپرستان تولید', meta: 'CTP & Offset Leads' },
      { title: 'تجهیزات و آزمایشگاه کنترل کیفیت', meta: 'ISO 12647-2' },
      { title: 'ارزش‌های مسئولیت زیست‌محیطی', meta: 'Eco Inks' }
    ]
  },
  {
    id: 'about-pinned-solutions',
    type: 'satellite',
    lens: 'pages',
    titleFa: 'راهکارهای پین‌شده 360vh',
    titleEn: '360vh Pinned Stage',
    path: '/about#solutions',
    descFa: 'استیج قفل‌شده چرخشی اسکرول با مورفینگ تصاویر و کنترل گام به گام راهکارها.',
    descEn: 'Sticky scroll-pinned stage with step-by-step image morphing.',
    icon: 'mdi:view-carousel-outline',
    accentColor: '#018786',
    x: 1050,
    y: 850,
    tag: 'Interactive'
  },
  {
    id: 'about-machinery',
    type: 'satellite',
    lens: 'services',
    titleFa: 'ماشین‌آلات هایدلبرگ و بوبست',
    titleEn: 'Heidelberg & Bobst Fleet',
    path: '/about#facility',
    descFa: 'نمایش ناوگان ماشین‌های چاپ، دایکات و جعبه‌چسبانی با مشخصات فنی دقیق.',
    descEn: 'Detailed specs of Speedmaster 5-color, Bobst Die-cut & CTP.',
    icon: 'mdi:cog-transfer-outline',
    accentColor: '#018786',
    x: 1100,
    y: 1050
  },

  // 🪐 ORBIT 2: PRODUCTS & PACKAGING CATALOG (Top-Right Pillar)
  {
    id: 'products-pillar',
    type: 'pillar',
    lens: 'products',
    badgeFa: 'کاتالوگ و متریال',
    badgeEn: 'Product Catalog',
    titleFa: 'محصولات و بسته‌بندی',
    titleEn: 'Packaging Catalog',
    path: '/products',
    descFa: 'آرشیو ۱۲ رده محصول اختصاصی بر پایه مقواهای ایندربرد، کرافت، فلوت‌دار و هاردباکس لوکس.',
    descEn: '12 authentic packaging categories with custom SVG mockups and filters.',
    icon: 'mdi:package-variant-closed',
    accentColor: '#2563eb',
    size: 155,
    x: 2250,
    y: 950,
    capabilities: [
      { title: '۱۲ موکاپ وکتور SVG', meta: 'Interactive Vector' },
      { title: 'نمای دوگانه شبکه / لیست', meta: 'Dual Grid-List' },
      { title: 'فیلتر دسته‌بندی و سورتینگ', meta: 'Smart Filters' }
    ]
  },
  {
    id: 'products-detail-slug',
    type: 'satellite',
    lens: 'products',
    titleFa: 'صفحه جزئیات بسته‌بندی [slug]',
    titleEn: 'Packaging Detail [slug]',
    path: '/products/[slug]',
    descFa: 'بررسی مشخصات ساختاری، ابعاد تیغ، انطباق رنگ و سلفون حرارتی.',
    descEn: 'Detailed structural box specs, die-cuts, and foil coatings.',
    icon: 'mdi:cube-scan',
    accentColor: '#2563eb',
    x: 2550,
    y: 850,
    tag: 'Dynamic'
  },
  {
    id: 'catalog-kit',
    type: 'satellite',
    lens: 'products',
    titleFa: 'دانلود کاتالوگ و کیت نمونه',
    titleEn: 'Catalog & Sample Kit',
    path: '/catalog',
    descFa: 'دانلود فایل‌های جامع PDF و امکان سفارش فیزیکی نمونه‌های جعبه.',
    descEn: 'PDF downloads and physical material sample kit requests.',
    icon: 'mdi:file-pdf-box',
    accentColor: '#2563eb',
    x: 2550,
    y: 1050
  },

  // 🪐 ORBIT 3: KNOWLEDGE, TIMELINE & BLOG (Bottom-Right Pillar)
  {
    id: 'knowledge-pillar',
    type: 'pillar',
    lens: 'knowledge',
    badgeFa: 'دانشنامه و تاریخچه',
    badgeEn: 'Knowledge & Press',
    titleFa: 'دانش و تاریخچه ۲۵ ساله',
    titleEn: 'Heritage & Blog',
    path: '/history',
    descFa: 'سیر تحول صنعتی از ۱۳۷۸ تا ۱۴۰۴ به همراه مقالات فنی پیش از چاپ و متریال‌شناسی.',
    descEn: '25-year milestone chronology and packaging engineering guides.',
    icon: 'mdi:timeline-text-outline',
    accentColor: '#d97706',
    size: 155,
    x: 2250,
    y: 1650,
    capabilities: [
      { title: 'تایم‌لاین ۱۳۷۸ تا ۱۴۰۴', meta: 'Chronological' },
      { title: 'مقالات مقایسه مقواها', meta: 'Prepress Articles' },
      { title: 'اخبار و رویدادهای نمایشگاهی', meta: 'Press Center' }
    ]
  },
  {
    id: 'history-timeline',
    type: 'satellite',
    lens: 'knowledge',
    titleFa: 'روایت ۲۵ سال تحول صنعتی',
    titleEn: '1999-2026 Chronology',
    path: '/history',
    descFa: 'روایت تصویری توسعه خطوط هایدلبرگ و بوبست در ۲۵ سال گذشته.',
    descEn: 'Milestones of press machinery installations.',
    icon: 'mdi:history',
    accentColor: '#d97706',
    x: 2550,
    y: 1550
  },
  {
    id: 'blog-ecosystem',
    type: 'satellite',
    lens: 'knowledge',
    titleFa: 'وبلاگ تخصصی چاپ و بسته‌بندی',
    titleEn: 'Technical Blog Articles',
    path: '/blog',
    descFa: 'دانشنامه تخصصی گرماژ مقوا، سلفون مخملی و بهینه‌سازی زینک.',
    descEn: 'Paper GSM comparison, velvet lamination and prepress.',
    icon: 'mdi:post-outline',
    accentColor: '#d97706',
    x: 2550,
    y: 1750
  },

  // 🪐 ORBIT 4: SERVICES, FLEET & PROCESS (Bottom-Left Pillar)
  {
    id: 'services-pillar',
    type: 'pillar',
    lens: 'services',
    badgeFa: 'خدمات و کارخانه',
    badgeEn: 'Industrial Fleet',
    titleFa: 'خدمات و فرآیند تولید',
    titleEn: 'Services & Fleet',
    path: '/services',
    descFa: 'چرخه کامل پیش از چاپ، لیتوگرافی حرارتی CTP، چاپ افست ورقی و خطوط تکمیلی.',
    descEn: 'Full prepress, thermal CTP, Heidelberg offset, and automated gluing.',
    icon: 'mdi:factory',
    accentColor: '#9333ea',
    size: 155,
    x: 1350,
    y: 1650,
    capabilities: [
      { title: 'لیتوگرافی CTP حرارتی', meta: '2540 DPI' },
      { title: 'چاپ ۵ رنگ با ورنی', meta: 'Speedmaster' },
      { title: 'دایکات و جعبه‌چسبانی اتوماتیک', meta: 'Bobst Auto' }
    ]
  },
  {
    id: 'guides-prepress',
    type: 'satellite',
    lens: 'services',
    titleFa: 'راهنمای آماده‌سازی فایل و تیغ',
    titleEn: 'Prepress & Dieline Guides',
    path: '/guides',
    descFa: 'استانداردهای ۳ الی ۵ میلی‌متر بلید، تفکیک رنگ پنتون و خروجی زینک.',
    descEn: 'Bleed guidelines, pantone separation, and dieline rules.',
    icon: 'mdi:book-open-page-variant-outline',
    accentColor: '#9333ea',
    x: 1050,
    y: 1550
  },
  {
    id: 'faq-help',
    type: 'satellite',
    lens: 'services',
    titleFa: 'مرکز راهنما و سوالات متداول',
    titleEn: 'FAQ Help Center',
    path: '/help/faq',
    descFa: 'پاسخ به سوالات حداقل تیراژ، نحوه ارسال بار و آزمون‌های کیفی.',
    descEn: 'Answers regarding minimum quantities and shipping.',
    icon: 'mdi:help-circle-outline',
    accentColor: '#9333ea',
    x: 1050,
    y: 1750
  },

  // 🪐 ORBIT 5: ACTION, QUOTE & CONTACT (Direct North Satellite)
  {
    id: 'contact-node',
    type: 'satellite',
    lens: 'pages',
    titleFa: 'استعلام قیمت و هماهنگی بازدید',
    titleEn: 'Instant Quote & Visit',
    path: '/contact',
    descFa: 'محاسبه آنلاین متریال، هماهنگی جلسه حضوری و شماره‌های مستقیم کارخانه.',
    descEn: 'Instant quote calculator and showroom booking.',
    icon: 'mdi:phone-in-talk-outline',
    accentColor: '#e11d48',
    x: 1800,
    y: 920,
    tag: 'Direct Action'
  },

  // 🪐 ORBIT 6: SWR ENGINE & CMS DASHBOARD (Direct South Satellite)
  {
    id: 'admin-cms-node',
    type: 'satellite',
    lens: 'pages',
    titleFa: 'پیشخوان مدیریت و استودیو CMS',
    titleEn: 'Admin Studio & SWR Engine',
    path: '/dashboard/cms',
    descFa: 'مدیریت داده‌های سه زبانه، ویرایش در لحظه و پایگاه داده PocketBase.',
    descEn: 'Trilingual CMS studio with 0ms SWR instant hydration.',
    icon: 'mdi:view-dashboard-outline',
    accentColor: '#018786',
    x: 1800,
    y: 1680,
    tag: 'Admin Suite'
  }
]

// ABSTRACT CONSTELLATION EDGES (Flow Arcs)
const edges: ConstellationEdge[] = [
  // Core to Primary Pillars
  { from: 'core-home', to: 'about-pillar', color: '#018786', speed: 3.0 },
  { from: 'core-home', to: 'products-pillar', color: '#2563eb', speed: 2.8 },
  { from: 'core-home', to: 'knowledge-pillar', color: '#d97706', speed: 3.2 },
  { from: 'core-home', to: 'services-pillar', color: '#9333ea', speed: 3.0 },
  { from: 'core-home', to: 'contact-node', color: '#e11d48', speed: 2.2 },
  { from: 'core-home', to: 'admin-cms-node', color: '#018786', speed: 2.4 },

  // About Cluster
  { from: 'about-pillar', to: 'about-pinned-solutions', color: '#018786', speed: 2.5 },
  { from: 'about-pillar', to: 'about-machinery', color: '#018786', speed: 2.7 },

  // Products Cluster
  { from: 'products-pillar', to: 'products-detail-slug', color: '#2563eb', speed: 2.6 },
  { from: 'products-pillar', to: 'catalog-kit', color: '#2563eb', speed: 2.8 },

  // Knowledge Cluster
  { from: 'knowledge-pillar', to: 'history-timeline', color: '#d97706', speed: 3.0 },
  { from: 'knowledge-pillar', to: 'blog-ecosystem', color: '#d97706', speed: 2.7 },

  // Services Cluster
  { from: 'services-pillar', to: 'guides-prepress', color: '#9333ea', speed: 2.9 },
  { from: 'services-pillar', to: 'faq-help', color: '#9333ea', speed: 3.1 }
]

const visibleNodes = computed(() => {
  return nodes.filter(n => {
    if (activeLens.value !== 'all' && n.lens !== activeLens.value && n.type !== 'nucleus') return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchFa = n.titleFa.toLowerCase().includes(q)
      const matchEn = n.titleEn.toLowerCase().includes(q)
      const matchPath = n.path?.toLowerCase().includes(q) || false
      if (!matchFa && !matchEn && !matchPath) return false
    }
    return true
  })
})

const visibleEdges = computed(() => {
  const visibleIds = new Set(visibleNodes.value.map(n => n.id))
  return edges.filter(e => visibleIds.has(e.from) && visibleIds.has(e.to))
})

function selectNode(node: SpatialConstellationNode) {
  selectedNode.value = node

  // Smooth cinematic camera centering on selected node
  panX.value = window.innerWidth / 2 - node.x * zoomScale.value
  panY.value = window.innerHeight / 2 - node.y * zoomScale.value
}

function isEdgeActive(edge: ConstellationEdge) {
  if (!hoveredNodeId.value && !selectedNode.value) return false
  const activeId = hoveredNodeId.value || selectedNode.value?.id
  return edge.from === activeId || edge.to === activeId
}

function edgeColor(color: string, alpha: number) {
  if (alpha === 1) return color
  return `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
}

// Calculate Elegant Cubic Bezier Curves between Center Coordinates
function getEdgePath(edge: ConstellationEdge) {
  const fromNode = nodes.find(n => n.id === edge.from)
  const toNode = nodes.find(n => n.id === edge.to)
  if (!fromNode || !toNode) return ''

  const x1 = fromNode.x
  const y1 = fromNode.y
  const x2 = toNode.x
  const y2 = toNode.y

  // Curved architectural arcs
  const dx = (x2 - x1) * 0.5
  const dy = (y2 - y1) * 0.5

  const cx1 = x1 + dx * 0.85
  const cy1 = y1
  const cx2 = x2 - dx * 0.85
  const cy2 = y2

  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
}

onMounted(() => {
  resetToCenter()
})
</script>

<style scoped>
.sheet-slide-enter-active,
.sheet-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
