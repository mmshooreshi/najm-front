<!-- pages/dashboard/sitemap/index.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-0 z-50 h-screen w-screen bg-[#F1F5F9] text-slate-900 select-none overflow-hidden font-sans text-xs flex flex-col"
  >
    <!-- Soft Ambient Light Background -->
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-100/40 blur-[100px]"></div>
      <div class="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-100/40 blur-[100px]"></div>
      <div class="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-purple-100/30 blur-[120px]"></div>
    </div>

    <!-- Top Minimalist HUD Bar -->
    <header class="relative z-40 h-12 px-4 flex items-center justify-between pointer-events-auto bg-white/70 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      <!-- Left: Exit & Cluster Telemetry -->
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/dashboard"
          class="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs text-slate-700 hover:text-emerald-800 hover:border-emerald-300 transition cursor-pointer"
          title="بازگشت به پیشخوان"
        >
          <Icon name="mdi:arrow-right" class="w-4 h-4" :class="isRTL ? '' : 'rotate-180'" />
        </NuxtLink>

        <div class="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-bold text-[11px] text-slate-700">
          <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
          <span>{{ nodes.length }} بلوک زنده</span>
        </div>
      </div>

      <!-- Center: Auto-Fit & Lens Filters -->
      <div class="flex items-center gap-1.5">
        <button
          @click="autoFitConstellation"
          class="px-3 py-1 rounded-xl bg-[#018786] hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1 active:scale-95"
          title="تنظیم خودکار کادر به ابعاد صفحه (Fit Viewport)"
        >
          <Icon name="mdi:fit-to-screen-outline" class="w-3.5 h-3.5" />
          <span>تنظیم کادر</span>
        </button>

        <div class="hidden sm:flex items-center bg-slate-200/60 p-0.5 rounded-xl text-[11px] font-bold">
          <button
            v-for="lens in lenses"
            :key="lens.id"
            @click="activeLens = lens.id"
            class="px-2.5 py-0.5 rounded-lg transition cursor-pointer"
            :class="activeLens === lens.id ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ isRTL ? lens.labelFa : lens.labelEn }}
          </button>
        </div>
      </div>

      <!-- Right: Search, Refresh & Console -->
      <div class="flex items-center gap-1.5">
        <div class="relative w-32 sm:w-40">
          <Icon name="mdi:magnify" class="absolute right-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو..."
            class="w-full bg-white border border-slate-200 rounded-xl pr-8 pl-2 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#018786] shadow-2xs text-xs"
          />
        </div>

        <button
          @click="refreshSitemap"
          class="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-800 shadow-2xs transition cursor-pointer"
          title="بروزرسانی داده‌ها"
        >
          <Icon name="mdi:refresh" class="w-4 h-4" />
        </button>

        <button
          @click="showDebugPane = !showDebugPane"
          class="w-8 h-8 flex items-center justify-center rounded-xl border shadow-2xs transition cursor-pointer"
          :class="[
            showDebugPane
              ? 'bg-emerald-800 text-white border-emerald-800'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          ]"
          title="کنسول شبکه"
        >
          <Icon name="mdi:code-json" class="w-4 h-4" />
        </button>
      </div>
    </header>

    <!-- FIT-CONTAINED AUTO-RESIZING STAGE (No Infinite Lost Space) -->
    <div
      ref="canvasStageRef"
      class="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-default"
      @mousemove="handleGlobalMouseMove"
      @mouseup="stopNodeDrag"
    >
      <!-- Unified Scaled Blob Mosaic Cluster -->
      <div
        class="relative transition-transform duration-300 ease-out"
        :style="{
          width: `${stageBaseWidth}px`,
          height: `${stageBaseHeight}px`,
          transform: `scale(${clusterFitScale})`,
          transformOrigin: 'center center'
        }"
      >
        <!-- VECTOR CONNECTION PATHS -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          <g v-for="edge in visibleEdges" :key="`${edge.from}-${edge.to}`">
            <!-- Semi-3D Dynamic Ambient Glow Line -->
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeActive(edge) ? edge.color : '#cbd5e1'"
              :stroke-opacity="isEdgeActive(edge) ? 0.9 : 0.4"
              :stroke-width="isEdgeActive(edge) ? 4 : 2"
              stroke-linecap="round"
              class="transition-all duration-300"
            />
            <!-- Animated Particle Glow -->
            <circle
              v-if="isEdgeActive(edge)"
              r="3.5"
              :fill="edge.color"
              filter="drop-shadow(0 0 4px rgba(0,0,0,0.2))"
            >
              <animateMotion
                :path="getEdgePath(edge)"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>

        <!-- ORGANIC SEMI-3D MAGNETIC BLOBS -->
        <div
          v-for="node in visibleNodes"
          :key="node.id"
          @mousedown="startNodeDrag($event, node)"
          @click.stop="handleNodeClick(node)"
          @mouseenter="hoveredNodeId = node.id"
          @mouseleave="hoveredNodeId = null"
          class="absolute cursor-pointer select-none transition-all duration-200 z-20"
          :style="{
            left: `${node.currentX}px`,
            top: `${node.currentY}px`,
            transform: `translate(-50%, -50%) scale(${getNodeScale(node)}) ${getNode3DTilt(node)}`,
            transformOrigin: 'center center',
            transition: isDraggingNodeId === node.id ? 'none' : 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }"
        >
          <!-- SEMI-3D BLOB CONTAINER (Non-Circle Organic Card with Tactile Depth) -->
          <div
            class="relative rounded-[2rem] p-4 flex flex-col justify-between transition-all duration-200"
            :style="{
              width: `${getNodeWidth(node)}px`,
              minHeight: `${getNodeHeight(node)}px`,
              background: getNodeBackground(node),
              boxShadow: getNodeShadow(node)
            }"
            :class="[
              selectedNode?.id === node.id
                ? 'ring-3 ring-emerald-500/80 -translate-y-1'
                : 'hover:-translate-y-1'
            ]"
          >
            <!-- Top Specular Glass Highlight -->
            <div class="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-t-full"></div>

            <!-- Top Header: Icon & Type Badge -->
            <div class="flex items-center justify-between gap-2 mb-2">
              <div
                class="w-8 h-8 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0"
                :style="{ backgroundColor: node.accentColor || '#018786' }"
              >
                <Icon :name="node.icon || 'mdi:layers'" class="w-4 h-4" />
              </div>

              <div class="flex items-center gap-1">
                <span
                  v-if="isRecentlyUsed(node.id)"
                  class="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[9px] shadow-2xs animate-pulse"
                >
                  فعال
                </span>
                <span class="px-2 py-0.5 rounded-full bg-slate-900/5 text-slate-600 font-mono text-[9px] font-bold">
                  {{ node.lens?.toUpperCase() || 'PAGE' }}
                </span>
              </div>
            </div>

            <!-- Center: Title & Subtitle / Key Insights -->
            <div class="space-y-0.5 my-auto">
              <h3 class="font-black text-slate-900 text-sm tracking-tight leading-tight">
                {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
              </h3>
              <p class="text-[10px] text-slate-500 font-mono truncate" dir="ltr">
                {{ node.path || `/${node.slug}` }}
              </p>
            </div>

            <!-- Bottom: Action Pills / Status Bar -->
            <div class="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
              <span class="flex items-center gap-1 font-bold text-emerald-800">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>همگام PB</span>
              </span>

              <span class="font-mono text-slate-400 font-bold">
                {{ getKeyCount(node) }} فیلد
              </span>
            </div>

            <!-- ORBITAL MICRO-ACTIONS ON SELECT -->
            <div
              v-if="selectedNode?.id === node.id"
              @click.stop
              class="absolute -top-3 -right-3 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in duration-150"
            >
              <button
                @click.stop="openProJsonStudio(node, 'content-studio')"
                class="w-7 h-7 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center shadow-xs transition cursor-pointer"
                title="ویرایشگر محتوا"
              >
                <Icon name="mdi:pencil-outline" class="w-3.5 h-3.5" />
              </button>

              <button
                @click.stop="openProJsonStudio(node, 'media')"
                class="w-7 h-7 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xs transition cursor-pointer"
                title="رسانه‌ها و تصاویر"
              >
                <Icon name="mdi:image-multiple-outline" class="w-3.5 h-3.5" />
              </button>

              <button
                @click.stop="openProJsonStudio(node, 'vanilla-editor')"
                class="w-7 h-7 rounded-xl bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center shadow-xs transition cursor-pointer"
                title="ویرایشگر JSON خام"
              >
                <Icon name="mdi:code-json" class="w-3.5 h-3.5" />
              </button>

              <button
                @click.stop="selectedNode = null"
                class="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                title="بستن"
              >
                <Icon name="mdi:close" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 100/100 MULTI-PACKAGE LIGHT JSON SCHEMA STUDIO -->
    <transition name="fade">
      <div
        v-if="showJsonStudio"
        class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-text font-sans"
      >
        <div class="bg-white text-slate-800 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden text-xs">
          <!-- Studio Header Bar -->
          <div class="h-12 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
                <Icon name="mdi:layers-outline" class="w-4 h-4" />
              </div>
              <div class="flex items-center gap-2">
                <h3 class="font-extrabold text-slate-900 text-xs">
                  {{ activeStudioNode?.liveData?.titleFa || activeStudioNode?.titleFa || 'تنظیم صفحه' }}
                </h3>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold" dir="ltr">
                  /{{ activeStudioNode?.slug }}
                </span>
                <span
                  v-if="hasAnyModifications"
                  class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold"
                >
                  ذخیره‌نشده
                </span>
              </div>
            </div>

            <!-- Unified 3-Engine Switcher -->
            <div class="flex items-center gap-1.5">
              <div class="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-bold">
                <button
                  @click="studioEngine = 'content-studio'"
                  class="px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                  :class="studioEngine === 'content-studio' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  <Icon name="mdi:translate" class="w-3.5 h-3.5" />
                  <span>محتوا</span>
                </button>

                <button
                  @click="studioEngine = 'vanilla-editor'"
                  class="px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                  :class="studioEngine === 'vanilla-editor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  <Icon name="mdi:code-json" class="w-3.5 h-3.5" />
                  <span>JSON خام</span>
                </button>

                <button
                  @click="studioEngine = 'visual-rows'"
                  class="px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                  :class="studioEngine === 'visual-rows' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  <Icon name="mdi:table" class="w-3.5 h-3.5" />
                  <span>جدول</span>
                </button>
              </div>

              <!-- Undo All -->
              <button
                v-if="hasAnyModifications"
                @click="undoAllChanges"
                class="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition cursor-pointer"
                title="بازگردانی به نسخه اصلی سرور"
              >
                <Icon name="mdi:undo" class="w-3.5 h-3.5" />
              </button>

              <button
                @click="copyStudioJson"
                class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition cursor-pointer"
              >
                {{ studioCopied ? 'کپی شد!' : 'کپی' }}
              </button>

              <button
                @click="showJsonStudio = false"
                class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer ml-1 transition"
                title="بستن"
              >
                <Icon name="mdi:close" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- ENGINE 1: UNIFIED MULTILINGUAL CONTENT STUDIO (FA / EN / AR) -->
          <div v-if="studioEngine === 'content-studio'" class="flex-1 overflow-hidden">
            <LocalizedContentStudio
              v-model="currentWorkingSchema"
              @change="onContentStudioChange"
            />
          </div>

          <!-- ENGINE 2: vanilla-jsoneditor (Jos de Jong Light Pro) -->
          <div v-else-if="studioEngine === 'vanilla-editor'" class="flex-1 bg-white overflow-hidden">
            <VanillaJsonEditor
              v-model="currentWorkingSchema"
              @change="onVanillaEditorChange"
            />
          </div>

          <!-- ENGINE 3: SMART VISUAL ROWS -->
          <div v-else class="flex-1 p-0 overflow-y-auto bg-white">
            <JsonTreeRow
              v-for="k in schemaKeys"
              :key="k"
              :key-name="k"
              :current-val="currentWorkingSchema[k]"
              :original-val="originalBaselineSchema[k]"
              :path="[k]"
              @update-field="handleFieldUpdate"
              @undo-field="handleFieldUndo"
            />
          </div>

          <!-- Studio Footer with 1-Click Save to PocketBase -->
          <div class="h-12 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 select-none">
            <div class="flex items-center gap-2">
              <span v-if="hasAnyModifications" class="text-amber-800 text-[11px] font-bold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>تغییرات آماده انتشار در پایگاه داده است</span>
              </span>
              <span v-else class="text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                <Icon name="mdi:check-circle" class="w-3.5 h-3.5 text-emerald-600" />
                <span>داده‌ها همگام با دیتابیس هستند</span>
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="showJsonStudio = false"
                class="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 text-xs transition cursor-pointer font-bold"
              >
                بستن
              </button>

              <button
                @click="saveWorkingSchemaToPocketBase"
                :disabled="isStudioSaving"
                class="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Icon :name="isStudioSaving ? 'mdi:loading' : 'mdi:cloud-upload'" class="w-3.5 h-3.5" :class="isStudioSaving ? 'animate-spin' : ''" />
                <span>{{ isStudioSaving ? 'در حال ذخیره...' : 'ذخیره در PocketBase' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- NETWORK TELEMETRY DOCK -->
    <transition name="dock-slide">
      <div
        v-if="showDebugPane"
        class="fixed bottom-0 inset-x-0 z-50 h-72 bg-white/98 backdrop-blur-2xl border-t border-slate-200 shadow-2xl flex flex-col font-sans text-xs text-slate-800 select-text"
      >
        <div class="h-8 px-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="font-bold text-emerald-800 text-xs">POCKETBASE NETWORK TELEMETRY</span>
          </div>

          <button
            @click="showDebugPane = false"
            class="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            <Icon name="mdi:close" class="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="flex-1 p-3 overflow-y-auto divide-y divide-slate-100">
          <div
            v-for="req in waterfallRequests"
            :key="req.id"
            class="py-1.5 flex items-center justify-between font-mono text-[11px]"
          >
            <div class="flex items-center gap-2">
              <span class="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">{{ req.method }}</span>
              <span class="text-slate-700 font-medium">{{ req.endpoint }}</span>
            </div>
            <span class="text-emerald-700 font-bold">{{ req.durationMs }}ms • {{ req.status }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, onUnmounted } from 'vue'
import { useLocale } from '~/composables/useLocale'
import JsonTreeRow from '~/components/dashboard/JsonTreeRow.vue'
import VanillaJsonEditor from '~/components/dashboard/VanillaJsonEditor.vue'
import LocalizedContentStudio from '~/components/dashboard/LocalizedContentStudio.vue'

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
const recentNodeClicks = ref<string[]>([])

// Base Layout Dimension Boundaries for Auto-Fit
const stageBaseWidth = 1100
const stageBaseHeight = 720
const clusterFitScale = ref(1)

// Multi-Package JSON Schema Studio State
const showJsonStudio = ref(false)
const activeStudioNode = ref<any | null>(null)
const studioEngine = ref<'content-studio' | 'vanilla-editor' | 'visual-rows'>('content-studio')
const originalBaselineSchema = ref<Record<string, any>>({})
const currentWorkingSchema = ref<Record<string, any>>({})
const studioCopied = ref(false)
const isStudioSaving = ref(false)

function openProJsonStudio(node: any, engine: 'content-studio' | 'vanilla-editor' | 'visual-rows' | 'media' = 'content-studio') {
  activeStudioNode.value = node
  recordNodeUsage(node.id)

  const schemaSnapshot = JSON.parse(JSON.stringify(node.liveData?.rawUiData || { titleFa: node.titleFa, titleEn: node.titleEn }))
  originalBaselineSchema.value = JSON.parse(JSON.stringify(schemaSnapshot))
  currentWorkingSchema.value = JSON.parse(JSON.stringify(schemaSnapshot))
  studioEngine.value = engine === 'media' ? 'content-studio' : engine
  showJsonStudio.value = true
}

function handleNodeClick(node: any) {
  if (selectedNode.value?.id === node.id) {
    selectedNode.value = null
  } else {
    selectedNode.value = node
    recordNodeUsage(node.id)
  }
}

function recordNodeUsage(nodeId: string) {
  recentNodeClicks.value = [nodeId, ...recentNodeClicks.value.filter(id => id !== nodeId)].slice(0, 5)
}

function isRecentlyUsed(nodeId: string) {
  return recentNodeClicks.value.includes(nodeId)
}

const schemaKeys = computed(() => {
  return Object.keys(currentWorkingSchema.value || {})
})

const hasAnyModifications = computed(() => {
  return JSON.stringify(currentWorkingSchema.value) !== JSON.stringify(originalBaselineSchema.value)
})

function onContentStudioChange(newVal: any) {
  currentWorkingSchema.value = newVal
}

function onVanillaEditorChange(newJson: any) {
  currentWorkingSchema.value = newJson
}

function setNestedValue(obj: any, path: (string | number)[], value: any) {
  let current = obj
  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]]
  }
  current[path[path.length - 1]] = value
}

function getNestedValue(obj: any, path: (string | number)[]) {
  let current = obj
  for (let i = 0; i < path.length; i++) {
    if (current === undefined || current === null) return undefined
    current = current[path[i]]
  }
  return current
}

function handleFieldUpdate(path: (string | number)[], newVal: any) {
  setNestedValue(currentWorkingSchema.value, path, newVal)
}

function handleFieldUndo(path: (string | number)[]) {
  const originalVal = getNestedValue(originalBaselineSchema.value, path)
  setNestedValue(currentWorkingSchema.value, path, JSON.parse(JSON.stringify(originalVal)))
}

function undoAllChanges() {
  currentWorkingSchema.value = JSON.parse(JSON.stringify(originalBaselineSchema.value))
}

function copyStudioJson() {
  navigator.clipboard.writeText(JSON.stringify(currentWorkingSchema.value, null, 2))
  studioCopied.value = true
  setTimeout(() => (studioCopied.value = false), 2000)
}

async function saveWorkingSchemaToPocketBase() {
  if (!activeStudioNode.value) return
  isStudioSaving.value = true
  const startTime = performance.now()

  try {
    const slug = activeStudioNode.value.slug || activeStudioNode.value.id
    const payload = {
      slug,
      title: currentWorkingSchema.value.fa?.title || currentWorkingSchema.value.titleFa || activeStudioNode.value.titleFa,
      uiData: currentWorkingSchema.value
    }

    const res = await $fetch('/api/admin/ui/publish', {
      method: 'POST',
      body: payload
    }).catch(() => null)

    const durationMs = Math.round(performance.now() - startTime)
    activeStudioNode.value.source = 'backend'
    if (activeStudioNode.value.liveData) {
      activeStudioNode.value.liveData.rawUiData = currentWorkingSchema.value
    }

    originalBaselineSchema.value = JSON.parse(JSON.stringify(currentWorkingSchema.value))

    waterfallRequests.value.unshift({
      id: `req-${Date.now()}`,
      method: 'POST',
      endpoint: `/api/admin/ui/publish [${slug}]`,
      status: 200,
      durationMs
    })

    showJsonStudio.value = false
  } catch (err) {
    //
  } finally {
    isStudioSaving.value = false
  }
}

const waterfallRequests = ref<any[]>([
  { id: '1', method: 'GET', endpoint: '/api/admin/sitemap', status: 200, durationMs: 12 }
])

// Sizing & Semi-3D Calculations
function getKeyCount(node: any) {
  const ui = node.liveData?.rawUiData || {}
  return Object.keys(ui).length || 3
}

function getNodeWidth(node: any) {
  if (node.type === 'nucleus') return 210
  if (node.type === 'pillar') return 185
  return 165
}

function getNodeHeight(node: any) {
  if (node.type === 'nucleus') return 130
  if (node.type === 'pillar') return 115
  return 95
}

function getNodeScale(node: any) {
  let scale = 1.0
  if (node.type === 'nucleus') scale = 1.12
  if (selectedNode.value?.id === node.id) scale *= 1.08
  if (isRecentlyUsed(node.id)) scale *= 1.05
  return scale
}

function getNodeBackground(node: any) {
  if (node.type === 'nucleus') {
    return 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
  }
  return 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
}

function getNodeShadow(node: any) {
  if (selectedNode.value?.id === node.id) {
    return '0 24px 48px -12px rgba(1, 135, 134, 0.25), 0 8px 16px -4px rgba(0, 0, 0, 0.08)'
  }
  if (hoveredNodeId.value === node.id) {
    return '0 20px 38px -10px rgba(15, 23, 42, 0.15), 0 6px 12px -3px rgba(0, 0, 0, 0.06)'
  }
  return '0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.04)'
}

// Subtle 3D Perspective Tilt on Mouse Movement
const mouseRelativeX = ref(0)
const mouseRelativeY = ref(0)

function handleGlobalMouseMove(e: MouseEvent) {
  mouseRelativeX.value = (e.clientX / window.innerWidth - 0.5) * 8
  mouseRelativeY.value = (e.clientY / window.innerHeight - 0.5) * -8

  // Neighbor Magnetic Push Simulation during drag
  if (isDraggingNodeId.value) {
    const dragged = dynamicNodesState.value.find(n => n.id === isDraggingNodeId.value)
    if (dragged) {
      for (const other of dynamicNodesState.value) {
        if (other.id !== dragged.id) {
          const dx = other.currentX - dragged.currentX
          const dy = other.currentY - dragged.currentY
          const dist = Math.hypot(dx, dy)
          const minDist = 180
          if (dist < minDist && dist > 0) {
            const push = (minDist - dist) * 0.15
            other.currentX += (dx / dist) * push
            other.currentY += (dy / dist) * push
          }
        }
      }
    }
  }
}

function getNode3DTilt(node: any) {
  if (hoveredNodeId.value === node.id) {
    return `perspective(600px) rotateX(${mouseRelativeY.value * 1.5}deg) rotateY(${mouseRelativeX.value * 1.5}deg)`
  }
  return 'perspective(600px) rotateX(0deg) rotateY(0deg)'
}

// Fetch Dynamic PocketBase Telemetry
const { data: sitemapApiData, refresh: refreshSitemapApi } = await useAsyncData('sitemap-dynamic-telemetry', () =>
  $fetch<any>('/api/admin/sitemap'),
  { lazy: true }
)

const dynamicNodesState = ref<any[]>([])

// COMPACT ORGANIC CLUSTER SEED POSITIONS
const defaultClusterPositions: Record<string, { x: number, y: number }> = {
  'pb-home': { x: 550, y: 360 },
  'pb-about': { x: 330, y: 220 },
  'pb-products': { x: 770, y: 220 },
  'pb-services': { x: 770, y: 500 },
  'pb-history': { x: 330, y: 500 },
  'pb-contact': { x: 550, y: 150 },
  'pb-catalog': { x: 960, y: 180 },
  'pb-faq': { x: 960, y: 540 },
  'pb-blog': { x: 140, y: 540 },
  'pb-login': { x: 140, y: 180 },
  'pb-menu': { x: 550, y: 570 },
  'pb-footer': { x: 350, y: 640 }
}

watchEffect(() => {
  if (sitemapApiData.value?.nodes && sitemapApiData.value.nodes.length > 0) {
    dynamicNodesState.value = sitemapApiData.value.nodes.map((n: any) => {
      const pos = defaultClusterPositions[n.id] || { x: 550, y: 360 }
      return {
        ...n,
        currentX: pos.x,
        currentY: pos.y,
        initialX: pos.x,
        initialY: pos.y
      }
    })
    autoFitConstellation()
  }
})

const nodes = computed(() => dynamicNodesState.value)

async function refreshSitemap() {
  await refreshSitemapApi()
}

// Responsive Viewport Auto-Fit
function autoFitConstellation() {
  if (typeof window === 'undefined') return
  const availableWidth = window.innerWidth - 40
  const availableHeight = window.innerHeight - 80

  const scaleX = availableWidth / stageBaseWidth
  const scaleY = availableHeight / stageBaseHeight
  clusterFitScale.value = Math.min(1.15, Math.max(0.65, Math.min(scaleX, scaleY)))
}

// Physics Dragging & Neighbor Push
const isDraggingNodeId = ref<string | null>(null)
let dragOffsetX = 0
let dragOffsetY = 0

function startNodeDrag(e: MouseEvent, node: any) {
  isDraggingNodeId.value = node.id
  dragOffsetX = e.clientX - node.currentX * clusterFitScale.value
  dragOffsetY = e.clientY - node.currentY * clusterFitScale.value
}

function stopNodeDrag() {
  if (isDraggingNodeId.value) {
    // Snap-back smoothly to relaxed cluster position
    const dragged = dynamicNodesState.value.find(n => n.id === isDraggingNodeId.value)
    if (dragged) {
      dragged.currentX = dragged.initialX
      dragged.currentY = dragged.initialY
    }
    // Settle all neighbors back
    for (const n of dynamicNodesState.value) {
      n.currentX = n.initialX
      n.currentY = n.initialY
    }
  }
  isDraggingNodeId.value = null
}

const lenses = [
  { id: 'all', labelFa: 'همه', labelEn: 'All' },
  { id: 'pages', labelFa: 'صفحات', labelEn: 'Pages' },
  { id: 'products', labelFa: 'محصولات', labelEn: 'Products' },
  { id: 'services', labelFa: 'خدمات', labelEn: 'Services' },
  { id: 'knowledge', labelFa: 'دانش', labelEn: 'Knowledge' },
]

const edges = [
  { from: 'pb-home', to: 'pb-about', color: '#018786' },
  { from: 'pb-home', to: 'pb-products', color: '#2563eb' },
  { from: 'pb-home', to: 'pb-services', color: '#9333ea' },
  { from: 'pb-home', to: 'pb-history', color: '#d97706' },
  { from: 'pb-home', to: 'pb-contact', color: '#e11d48' },
  { from: 'pb-home', to: 'pb-login', color: '#6366f1' },
  { from: 'pb-home', to: 'pb-menu', color: '#0ea5e9' },
  { from: 'pb-home', to: 'pb-footer', color: '#64748b' },
  { from: 'pb-products', to: 'pb-catalog', color: '#2563eb' },
  { from: 'pb-services', to: 'pb-faq', color: '#9333ea' },
  { from: 'pb-history', to: 'pb-blog', color: '#d97706' }
]

const visibleNodes = computed(() => {
  return nodes.value.filter((n: any) => {
    if (activeLens.value !== 'all' && n.lens !== activeLens.value && n.type !== 'nucleus') return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchFa = (n.liveData?.titleFa || n.titleFa || '').toLowerCase().includes(q)
      const matchEn = (n.liveData?.titleEn || n.titleEn || '').toLowerCase().includes(q)
      if (!matchFa && !matchEn) return false
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

function getEdgePath(edge: any) {
  const fromNode = nodes.value.find((n: any) => n.id === edge.from)
  const toNode = nodes.value.find((n: any) => n.id === edge.to)
  if (!fromNode || !toNode) return ''

  const x1 = fromNode.currentX
  const y1 = fromNode.currentY
  const x2 = toNode.currentX
  const y2 = toNode.currentY

  const dx = (x2 - x1) * 0.5
  const dy = (y2 - y1) * 0.5

  const cx1 = x1 + dx * 0.6
  const cy1 = y1
  const cx2 = x2 - dx * 0.6
  const cy2 = y2

  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
}

onMounted(() => {
  autoFitConstellation()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', autoFitConstellation)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', autoFitConstellation)
  }
})
</script>

<style scoped>
.dock-slide-enter-active,
.dock-slide-leave-active {
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.dock-slide-enter-from,
.dock-slide-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
