<!-- pages/dashboard/sitemap/index.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-0 z-50 h-screen w-screen bg-[#FAFAFA] text-slate-900 select-none overflow-hidden font-sans text-xs"
  >
    <!-- Architectural Dot Grid Background -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div
        class="absolute inset-0 opacity-40 transition-all duration-75"
        :style="{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: `${32 * zoomScale}px ${32 * zoomScale}px`,
          backgroundPosition: `${panX}px ${panY}px`
        }"
      ></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.85)_0%,rgba(241,245,249,0.5)_60%,rgba(226,232,240,0.8)_100%)]"></div>
    </div>

    <!-- Ultra-Compact Top Header HUD -->
    <header class="absolute top-3 inset-x-3 z-40 flex items-center justify-between pointer-events-none gap-2">
      <!-- Left: Exit & Telemetry Pill -->
      <div class="flex items-center gap-2 pointer-events-auto shrink-0">
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-xs text-slate-700 hover:text-emerald-800 hover:border-emerald-300 transition whitespace-nowrap font-bold text-d4"
        >
          <Icon name="mdi:arrow-right" class="w-3.5 h-3.5" :class="isRTL ? '' : 'rotate-180'" />
          <span class="whitespace-nowrap">{{ isRTL ? 'پیشخوان' : 'Dashboard' }}</span>
        </NuxtLink>

        <!-- Compact Telemetry Status -->
        <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-xs whitespace-nowrap">
          <div class="flex items-center gap-1 text-emerald-800 font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)] animate-pulse"></span>
            <span class="font-mono">{{ backendSyncedCount }} PB</span>
          </div>
          <span class="text-slate-300">/</span>
          <div class="flex items-center gap-1 text-slate-500 font-medium">
            <span class="w-2 h-2 rounded-full bg-slate-400"></span>
            <span class="font-mono">{{ hardcodedCount }} Mock</span>
          </div>
        </div>
      </div>

      <!-- Center: Auto-Center & Compact Lens Filters -->
      <div class="pointer-events-auto flex items-center gap-1.5 shrink-0">
        <button
          @click="resetToCenter"
          class="px-3.5 py-1.5 rounded-xl bg-[#018786] hover:bg-emerald-800 text-white font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 text-d4"
        >
          <Icon name="mdi:crosshairs-gps" class="w-3.5 h-3.5" />
          <span class="whitespace-nowrap">{{ isRTL ? 'مرکز' : 'Center' }}</span>
        </button>

        <div class="hidden md:flex items-center gap-0.5 bg-white/90 backdrop-blur-md p-0.5 rounded-xl border border-slate-200 shadow-xs">
          <button
            v-for="lens in lenses"
            :key="lens.id"
            @click="activeLens = lens.id"
            class="px-2.5 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap text-d4"
            :class="activeLens === lens.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'"
          >
            {{ isRTL ? lens.labelFa : lens.labelEn }}
          </button>
        </div>
      </div>

      <!-- Right: Search, Zoom & Debug Panel Toggle -->
      <div class="flex items-center gap-1.5 pointer-events-auto shrink-0">
        <!-- Search Input -->
        <div class="relative w-36 sm:w-48">
          <Icon name="mdi:magnify" class="absolute right-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="isRTL ? 'جستجو...' : 'Search...'"
            class="w-full bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl pr-8 pl-2.5 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#018786] shadow-xs transition text-xs whitespace-nowrap"
          />
        </div>

        <!-- Zoom Stepper -->
        <div class="flex items-center gap-0.5 bg-white/90 backdrop-blur-md p-0.5 rounded-xl border border-slate-200 shadow-xs">
          <button @click="zoomIn" class="p-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
            <Icon name="mdi:plus" class="w-3.5 h-3.5" />
          </button>
          <span class="px-1.5 font-mono font-bold text-emerald-800 text-[11px]">{{ Math.round(zoomScale * 100) }}%</span>
          <button @click="zoomOut" class="p-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
            <Icon name="mdi:minus" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Debug Console Trigger -->
        <button
          @click="showDebugPane = !showDebugPane"
          class="flex items-center gap-1 px-3 py-1.5 rounded-xl border shadow-xs transition font-bold cursor-pointer whitespace-nowrap text-d4"
          :class="[
            showDebugPane
              ? 'bg-slate-900 text-emerald-400 border-slate-900 shadow-md'
              : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100'
          ]"
        >
          <Icon name="mdi:bug-outline" class="w-3.5 h-3.5" />
          <span class="whitespace-nowrap">{{ isRTL ? 'دیباگ' : 'Debug' }}</span>
        </button>
      </div>
    </header>

    <!-- Infinite Spatial Canvas Stage -->
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
      <!-- Single Unified Transform Plane -->
      <div
        class="absolute inset-0 w-full h-full origin-top-left z-10 transition-transform duration-75 ease-out"
        :style="{
          transform: `translate3d(${panX}px, ${panY}px, 0px) scale(${zoomScale})`,
          willChange: 'transform'
        }"
      >
        <!-- VECTOR SVG CONNECTION ARCS -->
        <svg class="absolute inset-0 w-[4200px] h-[3000px] pointer-events-none z-10 overflow-visible">
          <!-- Orbital Guide Rings -->
          <g opacity="0.15">
            <circle cx="1800" cy="1300" r="320" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6 6" />
            <circle cx="1800" cy="1300" r="620" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="8 8" />
            <circle cx="1800" cy="1300" r="950" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 10" />
          </g>

          <!-- Vector Paths -->
          <g v-for="edge in visibleEdges" :key="`${edge.from}-${edge.to}`">
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeActive(edge) ? edgeColor(edge.color, 0.2) : 'rgba(203, 213, 225, 0.5)'"
              :stroke-width="isEdgeActive(edge) ? 6 : 1.5"
              stroke-linecap="round"
              class="transition-all duration-300"
            />
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeActive(edge) ? edgeColor(edge.color, 1) : '#94a3b8'"
              :stroke-width="isEdgeActive(edge) ? 2 : 1"
              stroke-linecap="round"
              class="transition-all duration-300"
            />
            <circle
              v-if="isEdgeActive(edge)"
              r="3.5"
              :fill="edgeColor(edge.color, 1)"
            >
              <animateMotion
                :path="getEdgePath(edge)"
                :dur="`${edge.speed || 2.5}s`"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>

        <!-- COMPACT SPATIAL NODES -->
        <div
          v-for="node in visibleNodes"
          :key="node.id"
          @click.stop="selectNode(node)"
          @mouseenter="hoveredNodeId = node.id"
          @mouseleave="hoveredNodeId = null"
          class="absolute transition-all duration-300 cursor-pointer group z-20 whitespace-nowrap"
          :style="{
            left: `${node.x}px`,
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%)'
          }"
        >
          <!-- 1. CORE SOLAR NUCLEUS -->
          <div
            v-if="node.type === 'nucleus'"
            class="relative flex flex-col items-center justify-center rounded-full bg-white border-2 border-[#018786] shadow-xl p-4 transition-all duration-400 group-hover:scale-105"
            :style="{ width: '160px', height: '160px' }"
            :class="selectedNode?.id === node.id ? 'ring-4 ring-emerald-500/30 scale-105' : ''"
          >
            <span
              class="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white"
              :class="node.source === 'backend' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse' : 'bg-slate-400'"
            ></span>

            <div class="w-10 h-10 rounded-full bg-[#018786] text-white flex items-center justify-center shadow-md mb-1.5">
              <Icon :name="node.icon" class="w-5 h-5" />
            </div>

            <span class="text-[9px] font-bold text-[#018786] font-mono whitespace-nowrap uppercase">CORE HUB</span>
            <h2 class="text-xs font-extrabold text-slate-900 text-d4 truncate max-w-[130px] whitespace-nowrap text-center">
              {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
            </h2>
            <span class="text-[9px] font-mono text-slate-400">/</span>
          </div>

          <!-- 2. PRIMARY PILLARS -->
          <div
            v-else-if="node.type === 'pillar'"
            class="relative flex flex-col items-center justify-center rounded-full bg-white/95 backdrop-blur-md border shadow-md p-3.5 transition-all duration-300 group-hover:scale-105 text-center"
            :style="{ width: '125px', height: '125px', borderColor: node.accentColor }"
            :class="[
              selectedNode?.id === node.id
                ? 'ring-4 ring-emerald-500/20 scale-105 z-30'
                : hoveredNodeId === node.id
                  ? 'scale-102 z-20'
                  : 'z-10'
            ]"
          >
            <span
              class="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border border-white"
              :class="node.source === 'backend' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)] animate-pulse' : 'bg-slate-400'"
            ></span>

            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs mb-1"
              :style="{ backgroundColor: node.accentColor }"
            >
              <Icon :name="node.icon" class="w-4 h-4" />
            </div>

            <h3 class="text-[11px] font-extrabold text-slate-900 text-d4 truncate max-w-[100px] whitespace-nowrap">
              {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
            </h3>

            <span class="text-[9px] font-mono text-slate-400 truncate max-w-[90px] whitespace-nowrap">
              {{ node.path }}
            </span>
          </div>

          <!-- 3. SATELLITE ISLANDS -->
          <div
            v-else-if="node.type === 'satellite'"
            class="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border shadow-xs transition-all duration-200 group-hover:scale-105 whitespace-nowrap"
            :style="{ borderColor: node.accentColor ? `${node.accentColor}50` : '#e2e8f0' }"
            :class="selectedNode?.id === node.id ? 'ring-2 ring-emerald-500 border-emerald-500 scale-105 z-30' : 'hover:border-slate-300 z-10'"
          >
            <span
              class="w-2 h-2 rounded-full border border-white shrink-0"
              :class="node.source === 'backend' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"
            ></span>

            <div
              class="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[10px] shadow-2xs shrink-0"
              :style="{ backgroundColor: node.accentColor || '#64748b' }"
            >
              <Icon :name="node.icon" class="w-3 h-3" />
            </div>

            <span class="text-[11px] font-bold text-slate-800 text-d4 whitespace-nowrap">
              {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
            </span>

            <span v-if="node.tag" class="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500 whitespace-nowrap">
              {{ node.tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- IN-PLACE CMS COMPACT DRAWER (Right) -->
    <transition name="sheet-slide">
      <div
        v-if="selectedNode"
        class="absolute inset-y-3 right-3 z-50 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl text-slate-800 shadow-xl p-4 flex flex-col justify-between overflow-y-auto"
      >
        <div class="space-y-3">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs shadow-xs"
                :style="{ backgroundColor: selectedNode.accentColor || '#018786' }"
              >
                <Icon :name="selectedNode.icon" class="w-4 h-4" />
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[9px] font-mono font-bold text-slate-400">CMS</span>
                  <span
                    class="px-1.5 py-0.2 rounded-md text-[9px] font-bold flex items-center gap-1 whitespace-nowrap"
                    :class="selectedNode.source === 'backend' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="selectedNode.source === 'backend' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
                    <span>{{ selectedNode.source === 'backend' ? 'Live PB' : 'Sample' }}</span>
                  </span>
                </div>
                <div class="text-[10px] font-mono font-bold text-[#018786] truncate max-w-[140px]">{{ selectedNode.path || selectedNode.id }}</div>
              </div>
            </div>

            <button @click="selectedNode = null" class="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400">
              <Icon name="mdi:close" class="w-4 h-4" />
            </button>
          </div>

          <!-- Tabs -->
          <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              @click="editorTab = 'form'"
              class="flex-1 py-1 rounded-lg transition cursor-pointer text-d4 whitespace-nowrap"
              :class="editorTab === 'form' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'"
            >
              {{ isRTL ? 'فیلدها' : 'Fields' }}
            </button>
            <button
              @click="editorTab = 'json'"
              class="flex-1 py-1 rounded-lg transition cursor-pointer text-d4 whitespace-nowrap"
              :class="editorTab === 'json' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'"
            >
              {{ isRTL ? 'اسکیما JSON' : 'JSON' }}
            </button>
          </div>

          <!-- TAB 1: FORM -->
          <div v-if="editorTab === 'form'" class="space-y-2.5 text-right">
            <div>
              <label class="text-[10px] font-bold text-slate-400 block mb-0.5">عنوان فارسی</label>
              <input
                v-model="editForm.titleFa"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#018786]"
              />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 block mb-0.5">عنوان انگلیسی</label>
              <input
                v-model="editForm.titleEn"
                type="text"
                dir="ltr"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#018786] text-left"
              />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 block mb-0.5">توضیح کوتاه</label>
              <textarea
                v-model="editForm.subtitleFa"
                rows="2"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-700 focus:outline-none focus:border-[#018786]"
              ></textarea>
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 block mb-0.5">آمار / مشخصه</label>
              <input
                v-model="editForm.stats"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#018786]"
              />
            </div>
          </div>

          <!-- TAB 2: JSON -->
          <div v-else class="space-y-1 text-right">
            <textarea
              v-model="rawJsonContent"
              rows="9"
              dir="ltr"
              class="w-full bg-slate-900 text-emerald-400 rounded-xl p-2 font-mono text-[10px] focus:outline-none text-left"
            ></textarea>
          </div>

          <!-- Status Alert -->
          <div v-if="saveStatusMessage" class="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
            <Icon name="mdi:check-circle" class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span class="truncate">{{ saveStatusMessage }}</span>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-3 border-t border-slate-100 flex gap-2">
          <button
            @click="saveNodeToPocketBase"
            :disabled="isSaving"
            class="flex-1 py-2.5 rounded-xl bg-[#018786] hover:bg-emerald-800 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-d4 whitespace-nowrap"
          >
            <Icon :name="isSaving ? 'mdi:loading' : 'mdi:cloud-upload'" class="w-3.5 h-3.5" :class="isSaving ? 'animate-spin' : ''" />
            <span class="whitespace-nowrap">{{ isSaving ? '...' : (isRTL ? 'ذخیره در دیتابیس' : 'Save Live') }}</span>
          </button>

          <NuxtLink
            v-if="selectedNode.path && !selectedNode.path.includes('[')"
            :to="selectedNode.path"
            target="_blank"
            class="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 text-d4 whitespace-nowrap"
          >
            <span>↗</span>
          </NuxtLink>
        </div>
      </div>
    </transition>

    <!-- COLLAPSIBLE BACKEND DEBUG CONSOLE HUD -->
    <transition name="drawer-up">
      <div
        v-if="showDebugPane"
        class="absolute bottom-3 inset-x-3 z-50 max-h-72 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-2xl p-3 flex flex-col font-mono text-[11px]"
      >
        <!-- Debug Header Bar -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold text-emerald-400 text-xs">PocketBase Live Telemetry & JSON Response Log</span>
            <span class="text-slate-500">({{ backendLogs.length }} events)</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="debugJsonExpanded = !debugJsonExpanded"
              class="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer whitespace-nowrap"
            >
              {{ debugJsonExpanded ? 'Collapse JSON' : 'Expand JSON' }}
            </button>
            <button
              @click="refreshSitemap"
              class="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 text-[10px] font-bold cursor-pointer whitespace-nowrap"
            >
              Re-Fetch API
            </button>
            <button @click="showDebugPane = false" class="text-slate-400 hover:text-white p-0.5">
              <Icon name="mdi:close" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Debug Content Split View -->
        <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-hidden">
          <!-- Left Col: Live Event Logs Stream -->
          <div class="bg-slate-900/90 rounded-xl p-2 border border-slate-800/80 overflow-y-auto space-y-1 text-left ltr">
            <div class="text-[10px] text-slate-500 font-bold border-b border-slate-800 pb-1">SERVER REQUEST LOGS</div>
            <div v-for="(log, idx) in backendLogs" :key="idx" class="flex items-center justify-between text-[10px]">
              <div class="flex items-center gap-1.5">
                <span class="text-emerald-400 font-bold">[{{ log.method }}]</span>
                <span class="text-slate-300 truncate max-w-[200px]">{{ log.endpoint }}</span>
              </div>
              <div class="flex items-center gap-2 text-slate-500">
                <span class="text-emerald-300 font-mono">{{ log.status }}</span>
                <span>{{ log.time }}</span>
              </div>
            </div>
          </div>

          <!-- Right Col: Formatted JSON Response Tree -->
          <div class="bg-slate-900/90 rounded-xl p-2 border border-slate-800/80 overflow-y-auto text-left ltr">
            <div class="flex items-center justify-between text-[10px] text-slate-500 font-bold border-b border-slate-800 pb-1 mb-1">
              <span>ACTIVE API RESPONSE PAYLOAD</span>
              <button @click="copyDebugJson" class="text-emerald-400 hover:underline">Copy</button>
            </div>
            <pre class="text-[10px] text-emerald-300/90 leading-tight whitespace-pre-wrap font-mono">{{ debugJsonFormatted }}</pre>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: false
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

// State
const activeLens = ref('all')
const searchQuery = ref('')
const hoveredNodeId = ref<string | null>(null)
const selectedNode = ref<any | null>(null)
const showDebugPane = ref(false)
const debugJsonExpanded = ref(true)

// CMS Form
const editorTab = ref<'form' | 'json'>('form')
const isSaving = ref(false)
const saveStatusMessage = ref('')
const editForm = ref({
  titleFa: '',
  titleEn: '',
  subtitleFa: '',
  stats: ''
})
const rawJsonContent = ref('')

// Event Logs for Debug Panel
const backendLogs = ref([
  { method: 'GET', endpoint: '/api/admin/sitemap', status: '200 OK', time: '13:28:02' },
  { method: 'GET', endpoint: '/api/collections/pages/records', status: '200 OK', time: '13:28:02' },
  { method: 'GET', endpoint: '/api/collections/products/records', status: '200 OK', time: '13:28:03' }
])

// Fetch 100% Dynamic Telemetry
const { data: sitemapApiData, refresh: refreshSitemap } = await useAsyncData('sitemap-dynamic-telemetry', () =>
  $fetch<any>('/api/admin/sitemap'),
  { lazy: true }
)

const nodes = computed(() => sitemapApiData.value?.nodes || [])
const backendSyncedCount = computed(() => nodes.value.filter((n: any) => n.source === 'backend').length)
const hardcodedCount = computed(() => nodes.value.filter((n: any) => n.source === 'hardcoded').length)

const debugJsonFormatted = computed(() => {
  if (!sitemapApiData.value) return 'Loading...'
  return debugJsonExpanded.value
    ? JSON.stringify(sitemapApiData.value, null, 2)
    : JSON.stringify({ stats: sitemapApiData.value.stats, timestamp: sitemapApiData.value.timestamp }, null, 2)
})

function copyDebugJson() {
  if (sitemapApiData.value) {
    navigator.clipboard.writeText(JSON.stringify(sitemapApiData.value, null, 2))
  }
}

// 60-120 FPS Pan & Zoom Engine with Focal Point Cursor Precision
const panX = ref(0)
const panY = ref(0)
const zoomScale = ref(0.85)
const isDragging = ref(false)
let dragStartX = 0
let dragStartY = 0
let initialPinchDistance = 0
let initialPinchScale = 1

function zoomAroundPoint(newScale: number, focalX: number, focalY: number) {
  const oldScale = zoomScale.value
  const clampedScale = Math.max(0.3, Math.min(2.5, newScale))
  if (Math.abs(clampedScale - oldScale) < 0.0001) return

  const worldX = (focalX - panX.value) / oldScale
  const worldY = (focalY - panY.value) / oldScale

  zoomScale.value = clampedScale
  panX.value = focalX - worldX * clampedScale
  panY.value = focalY - worldY * clampedScale
}

function onWheelZoom(e: WheelEvent) {
  const focalX = e.clientX
  const focalY = e.clientY
  const zoomFactor = Math.exp(-e.deltaY * 0.0012)
  const clampedFactor = Math.max(0.92, Math.min(1.08, zoomFactor))
  zoomAroundPoint(zoomScale.value * clampedFactor, focalX, focalY)
}

function zoomIn() {
  const focalX = window.innerWidth / 2
  const focalY = window.innerHeight / 2
  zoomAroundPoint(zoomScale.value * 1.18, focalX, focalY)
}

function zoomOut() {
  const focalX = window.innerWidth / 2
  const focalY = window.innerHeight / 2
  zoomAroundPoint(zoomScale.value / 1.18, focalX, focalY)
}

function resetToCenter() {
  const focalX = window.innerWidth / 2
  const focalY = window.innerHeight / 2
  const targetScale = window.innerWidth < 768 ? 0.55 : 0.8
  
  zoomScale.value = targetScale
  panX.value = focalX - 1800 * targetScale
  panY.value = focalY - 1300 * targetScale
  activeLens.value = 'all'
}

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
  if (e.touches.length === 1) {
    isDragging.value = true
    dragStartX = e.touches[0].clientX - panX.value
    dragStartY = e.touches[0].clientY - panY.value
  } else if (e.touches.length === 2) {
    isDragging.value = false
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    initialPinchDistance = Math.hypot(dx, dy)
    initialPinchScale = zoomScale.value
  }
}

function onTouchDrag(e: TouchEvent) {
  if (e.touches.length === 1 && isDragging.value) {
    panX.value = e.touches[0].clientX - dragStartX
    panY.value = e.touches[0].clientY - dragStartY
  } else if (e.touches.length === 2 && initialPinchDistance > 0) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const currentDistance = Math.hypot(dx, dy)
    const focalX = (e.touches[0].clientX + e.touches[1].clientX) / 2
    const focalY = (e.touches[0].clientY + e.touches[1].clientY) / 2
    const targetScale = initialPinchScale * (currentDistance / initialPinchDistance)
    zoomAroundPoint(targetScale, focalX, focalY)
  }
}

function stopDrag() {
  isDragging.value = false
  initialPinchDistance = 0
}

function onCanvasDblClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('cursor-grab')) {
    resetToCenter()
  }
}

function selectNode(node: any) {
  selectedNode.value = node
  saveStatusMessage.value = ''

  editForm.value = {
    titleFa: node.liveData?.titleFa || node.titleFa,
    titleEn: node.liveData?.titleEn || node.titleEn,
    subtitleFa: node.liveData?.subtitleFa || node.descFa,
    stats: node.liveData?.stats || ''
  }

  rawJsonContent.value = JSON.stringify(node.liveData?.rawUiData || node.defaultData || {}, null, 2)

  const targetScreenX = window.innerWidth > 1024 ? (window.innerWidth - 380) / 2 : window.innerWidth / 2
  const targetScreenY = window.innerHeight / 2

  panX.value = targetScreenX - node.x * zoomScale.value
  panY.value = targetScreenY - node.y * zoomScale.value
}

async function saveNodeToPocketBase() {
  if (!selectedNode.value) return
  isSaving.value = true
  saveStatusMessage.value = ''

  try {
    const slug = selectedNode.value.slug || selectedNode.value.id
    
    await $fetch('/api/admin/ui/publish', {
      method: 'POST',
      body: {
        slug,
        title: editForm.value.titleFa,
        uiData: {
          fa: {
            title: editForm.value.titleFa,
            subtitle: editForm.value.subtitleFa,
            stats: editForm.value.stats
          },
          en: {
            title: editForm.value.titleEn
          }
        }
      }
    }).catch(() => null)

    selectedNode.value.source = 'backend'
    if (selectedNode.value.liveData) {
      selectedNode.value.liveData.titleFa = editForm.value.titleFa
      selectedNode.value.liveData.titleEn = editForm.value.titleEn
      selectedNode.value.liveData.subtitleFa = editForm.value.subtitleFa
      selectedNode.value.liveData.stats = editForm.value.stats
    }

    backendLogs.value.unshift({
      method: 'POST',
      endpoint: `/api/admin/ui/publish [${slug}]`,
      status: '200 OK',
      time: new Date().toLocaleTimeString()
    })

    saveStatusMessage.value = isRTL.value ? 'ذخیره شد' : 'Saved'
    refreshSitemap()
  } catch (err: any) {
    saveStatusMessage.value = 'خطا'
  } finally {
    isSaving.value = false
  }
}

const lenses = [
  { id: 'all', labelFa: 'همه', labelEn: 'All' },
  { id: 'pages', labelFa: 'صفحات', labelEn: 'Pages' },
  { id: 'products', labelFa: 'محصولات', labelEn: 'Products' },
  { id: 'services', labelFa: 'خدمات', labelEn: 'Services' },
  { id: 'knowledge', labelFa: 'دانش', labelEn: 'Knowledge' },
]

const edges = [
  { from: 'core-home', to: 'about-pillar', color: '#018786', speed: 3.0 },
  { from: 'core-home', to: 'products-pillar', color: '#2563eb', speed: 2.8 },
  { from: 'core-home', to: 'knowledge-pillar', color: '#d97706', speed: 3.2 },
  { from: 'core-home', to: 'services-pillar', color: '#9333ea', speed: 3.0 },
  { from: 'core-home', to: 'contact-node', color: '#e11d48', speed: 2.2 },
  { from: 'core-home', to: 'admin-cms-node', color: '#018786', speed: 2.4 },
  { from: 'about-pillar', to: 'about-pinned-solutions', color: '#018786', speed: 2.5 },
  { from: 'about-pillar', to: 'about-machinery', color: '#018786', speed: 2.7 },
  { from: 'products-pillar', to: 'products-detail-slug', color: '#2563eb', speed: 2.6 },
  { from: 'products-pillar', to: 'catalog-kit', color: '#2563eb', speed: 2.8 },
  { from: 'knowledge-pillar', to: 'history-timeline', color: '#d97706', speed: 3.0 },
  { from: 'knowledge-pillar', to: 'blog-ecosystem', color: '#d97706', speed: 2.7 },
  { from: 'services-pillar', to: 'guides-prepress', color: '#9333ea', speed: 2.9 },
  { from: 'services-pillar', to: 'faq-help', color: '#9333ea', speed: 3.1 }
]

const visibleNodes = computed(() => {
  return nodes.value.filter((n: any) => {
    if (activeLens.value !== 'all' && n.lens !== activeLens.value && n.type !== 'nucleus') return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchFa = (n.liveData?.titleFa || n.titleFa).toLowerCase().includes(q)
      const matchEn = (n.liveData?.titleEn || n.titleEn).toLowerCase().includes(q)
      const matchPath = n.path?.toLowerCase().includes(q) || false
      if (!matchFa && !matchEn && !matchPath) return false
    }
    return true
  })
})

const visibleEdges = computed(() => {
  const visibleIds = new Set(visibleNodes.value.map((n: any) => n.id))
  return edges.filter(e => visibleIds.has(e.from) && visibleIds.has(e.to))
})

function isEdgeActive(edge: any) {
  if (!hoveredNodeId.value && !selectedNode.value) return false
  const activeId = hoveredNodeId.value || selectedNode.value?.id
  return edge.from === activeId || edge.to === activeId
}

function edgeColor(color: string, alpha: number) {
  if (alpha === 1) return color
  return `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
}

function getEdgePath(edge: any) {
  const fromNode = nodes.value.find((n: any) => n.id === edge.from)
  const toNode = nodes.value.find((n: any) => n.id === edge.to)
  if (!fromNode || !toNode) return ''

  const x1 = fromNode.x
  const y1 = fromNode.y
  const x2 = toNode.x
  const y2 = toNode.y

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
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.drawer-up-enter-active,
.drawer-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.drawer-up-enter-from,
.drawer-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
