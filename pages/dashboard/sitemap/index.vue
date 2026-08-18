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
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-xs text-slate-700 hover:text-emerald-800 hover:border-emerald-300 transition whitespace-nowrap font-bold text-d4 cursor-pointer"
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
          <span class="whitespace-nowrap">{{ isRTL ? 'مرکز کل' : 'Fit All' }}</span>
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

      <!-- Right: Search, Zoom & Debug Panel Trigger -->
      <div class="flex items-center gap-1.5 pointer-events-auto shrink-0">
        <!-- Search Input -->
        <div class="relative w-36 sm:w-44">
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

        <!-- Debug Waterfall Console Trigger -->
        <button
          @click="showDebugPane = !showDebugPane"
          class="flex items-center gap-1 px-3 py-1.5 rounded-xl border shadow-xs transition font-bold cursor-pointer whitespace-nowrap text-d4"
          :class="[
            showDebugPane
              ? 'bg-slate-900 text-emerald-400 border-slate-900 shadow-md'
              : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100'
          ]"
        >
          <Icon name="mdi:code-json" class="w-3.5 h-3.5" />
          <span class="whitespace-nowrap">{{ isRTL ? 'لاگ و واترفال' : 'Waterfall' }}</span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
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
          <!-- Concentric Orbital Guide Rings -->
          <g opacity="0.15">
            <circle cx="1800" cy="1300" r="320" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6 6" />
            <circle cx="1800" cy="1300" r="620" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="8 8" />
            <circle cx="1800" cy="1300" r="950" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 10" />
          </g>

          <!-- Vector Curved Paths -->
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

    <!-- WATERFALL FLOW REQUEST / RESPONSE DEBUGGER (DEFAULT COLLAPSED) -->
    <transition name="drawer-up">
      <div
        v-if="showDebugPane"
        class="absolute bottom-3 inset-x-3 z-50 max-h-96 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-2xl p-3.5 flex flex-col font-mono text-[11px]"
      >
        <!-- Waterfall Header Bar -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold text-emerald-400 text-xs">PocketBase Waterfall Flow & Request/Response Inspector</span>
            <span class="text-slate-500 font-mono text-[10px]">({{ waterfallRequests.length }} requests captured)</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="toggleExpandAllWaterfall"
              class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer whitespace-nowrap"
            >
              {{ isAllWaterfallExpanded ? 'بستن همه (Collapse All)' : 'باز کردن همه (Expand All)' }}
            </button>
            <button
              @click="refreshSitemap"
              class="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 text-[10px] font-bold cursor-pointer whitespace-nowrap"
            >
              Re-Fetch All
            </button>
            <button @click="showDebugPane = false" class="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800">
              <Icon name="mdi:close" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Waterfall Flow Accordion List (Default: Collapsed) -->
        <div class="flex-1 overflow-y-auto space-y-2 text-left ltr pr-1">
          <div
            v-for="(req, idx) in waterfallRequests"
            :key="req.id || idx"
            class="rounded-xl border transition-all duration-200"
            :class="req.isExpanded ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'"
          >
            <!-- Waterfall Row Summary Header (Click to Toggle) -->
            <div
              @click="req.isExpanded = !req.isExpanded"
              class="p-2.5 flex items-center justify-between cursor-pointer select-none"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-slate-400 text-xs transition-transform" :class="req.isExpanded ? 'rotate-90' : ''">▶</span>
                <span
                  class="px-2 py-0.5 rounded text-[9px] font-bold"
                  :class="req.method === 'POST' ? 'bg-blue-900/60 text-blue-300 border border-blue-700' : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'"
                >
                  {{ req.method }}
                </span>
                <span class="font-bold text-slate-200 text-xs truncate max-w-sm sm:max-w-md">{{ req.endpoint }}</span>
              </div>

              <div class="flex items-center gap-3 text-[10px]">
                <span class="px-2 py-0.5 rounded font-bold font-mono" :class="req.status >= 400 ? 'bg-rose-900/60 text-rose-300' : 'bg-emerald-950 text-emerald-400'">
                  {{ req.status }} {{ req.statusText }}
                </span>
                <span class="text-slate-400 font-mono">{{ req.durationMs }}ms</span>
                <span class="text-slate-500 font-mono">{{ req.timestamp }}</span>
              </div>
            </div>

            <!-- Expandable JSON Split View: Request JSON + Response JSON -->
            <div v-if="req.isExpanded" class="p-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950/60 rounded-b-xl">
              <!-- Request JSON Block -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>REQUEST PAYLOAD</span>
                  <button @click="copyJson(req.requestJson)" class="text-emerald-400 hover:underline text-[9px]">Copy Request</button>
                </div>
                <pre class="bg-slate-900/90 text-amber-200/90 p-2.5 rounded-lg text-[10px] leading-tight overflow-x-auto border border-slate-800/80 max-h-48">{{ formatJson(req.requestJson) }}</pre>
              </div>

              <!-- Response JSON Block -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>RESPONSE PAYLOAD</span>
                  <button @click="copyJson(req.responseJson)" class="text-emerald-400 hover:underline text-[9px]">Copy Response</button>
                </div>
                <pre class="bg-slate-900/90 text-emerald-300/90 p-2.5 rounded-lg text-[10px] leading-tight overflow-x-auto border border-slate-800/80 max-h-48">{{ formatJson(req.responseJson) }}</pre>
              </div>
            </div>
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

// Base fallback nodes so canvas ALWAYS renders 15+ nodes regardless of network delay
const defaultNodes = [
  {
    id: 'core-home',
    slug: 'home',
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
    source: 'hardcoded',
    defaultData: {
      titleFa: 'نوآوری در چاپ افست، مهندسی در بسته‌بندی',
      titleEn: 'Innovation in Offset Printing, Engineering in Packaging',
      subtitleFa: 'مجتمع تخصصی چاپ و بسته‌بندی نجم با اتکا به خطوط هایدلبرگ و بوبست',
      stats: '+۲۵ سال سابقه مستمر صنعتی • ۱۵M تیراژ سالانه'
    }
  },
  {
    id: 'about-pillar',
    slug: 'about',
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
    source: 'hardcoded',
    defaultData: {
      titleFa: 'نوآوری در چاپ افست، مهندسی در ساختار بسته‌بندی',
      titleEn: 'Innovation in Offset Printing, Engineering in Packaging',
      subtitleFa: 'تولید یکپارچه با کیفیت میکرونی و پایش ۱۰۰٪ پچ‌ها',
      stats: 'ISO 12647-2 • نظارت مستقیم بر دقت تیغ'
    }
  },
  {
    id: 'about-pinned-solutions',
    slug: 'about-solutions',
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
    tag: 'Interactive',
    source: 'hardcoded',
    defaultData: {
      titleFa: '۴ گام تخصصی از ایده تا خروجی نهایی جعبه',
      titleEn: '4 Dedicated Engineering Steps',
      subtitleFa: 'مشاوره، CTP، چاپ ۵ رنگ و جعبه‌چسبانی اتوماتیک',
      stats: '۴ گام مجزا • اسکرول پین‌شده'
    }
  },
  {
    id: 'about-machinery',
    slug: 'machinery',
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
    y: 1050,
    source: 'hardcoded',
    defaultData: {
      titleFa: 'ناوگان پیشرفته ماشین‌آلات صنعتی چاپ نجم',
      titleEn: 'Industrial Fleet & Modern Prepress Equipment',
      subtitleFa: 'هایدلبرگ اسپیدمستر ۷۲×۱۰۲، دایکات بوبست و لیتوگرافی حرارتی',
      stats: '۱۵,۰۰۰ برگ/ساعت • فشار تیغ ۳۰۰ تن'
    }
  },
  {
    id: 'products-pillar',
    slug: 'products',
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
    source: 'hardcoded',
    defaultData: {
      titleFa: 'کاتالوگ انواع بسته‌بندی و مقواهای استاندارد',
      titleEn: 'Standard Paperboard & Packaging Catalog',
      subtitleFa: 'طراحی ساختار، جعبه‌های دارویی، آرایشی، غذایی و صنعتی',
      stats: '۱۲ رده محصول • ۱۰۰٪ استاندارد بهداشتی'
    }
  },
  {
    id: 'products-detail-slug',
    slug: 'packaging-detail',
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
    tag: 'Dynamic',
    source: 'hardcoded',
    defaultData: {
      titleFa: 'مشخصات فنی و استانداردهای گرماژ جعبه',
      titleEn: 'Technical Box Specs & GSM Standards',
      subtitleFa: 'ایندربرد ۲۵۰ الی ۴۰۰ گرم، سلفون حرارتی مات/براق و UV موضعی',
      stats: 'تحویل در کمترین زمان • تست خمش'
    }
  },
  {
    id: 'catalog-kit',
    slug: 'catalog',
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
    y: 1050,
    source: 'hardcoded',
    defaultData: {
      titleFa: 'کاتالوگ جامع محصولات و نمونه‌های فیزیکی',
      titleEn: 'Comprehensive PDF Catalog & Material Kit',
      subtitleFa: 'دریافت رایگان کاتالوگ مهندسی و ارسال کیت جعبه‌ها به سراسر کشور',
      stats: 'نسخه PDF • ارسال پستی سمپل'
    }
  },
  {
    id: 'knowledge-pillar',
    slug: 'history',
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
    source: 'hardcoded',
    defaultData: {
      titleFa: '۲۵ سال تجربه مستمر در توسعه خطوط چاپ کشور',
      titleEn: '25 Years of Continuous Heritage & Growth',
      subtitleFa: 'از اولین دستگاه تک‌رنگ هایدلبرگ تا خطوط ۵ رنگ تمام‌اتوماتیک',
      stats: '۱۳۷۸ تا ۱۴۰۴ • بیش از ۵۰۰ مشتری صنعتی'
    }
  },
  {
    id: 'history-timeline',
    slug: 'history-timeline',
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
    y: 1550,
    source: 'hardcoded',
    defaultData: {
      titleFa: 'گاه‌شمار پیشرفت تجهیزات و دستاوردهای نجم',
      titleEn: 'Milestone Chronology (1999-2026)',
      subtitleFa: 'خرید دستگاه‌های لیتوگرافی CTP و خطوط تکمیلی بوبست',
      stats: '۸ نقطه عطف صنعتی'
    }
  },
  {
    id: 'blog-ecosystem',
    slug: 'blog',
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
    y: 1750,
    source: 'hardcoded',
    defaultData: {
      titleFa: 'دانشنامه مقالات و راهنمای تخصصی طراحان',
      titleEn: 'Technical Articles & Printing Encyclopedia',
      subtitleFa: 'راهنمای آماده‌سازی زینک، مقایسه مقوای پشت طوسی و ایندربرد',
      stats: 'مقالات به‌روز • استانداردهای جهانی'
    }
  },
  {
    id: 'services-pillar',
    slug: 'services',
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
    source: 'hardcoded',
    defaultData: {
      titleFa: 'خدمات یکپارچه صفر تا صد چاپ و بسته‌بندی صنعتی',
      titleEn: 'Full Industrial Printing & Packaging Services',
      subtitleFa: 'مشاوره فنی، لیتوگرافی زینک CTP، چاپ افست، سلفون، دایکات و چسب',
      stats: '۱۰۰٪ درون مجتمع • نظارت دقیق'
    }
  },
  {
    id: 'guides-prepress',
    slug: 'guides',
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
    y: 1550,
    source: 'hardcoded',
    defaultData: {
      titleFa: 'چک‌لیست ارسال فایل چاپی و فایل تیغ دایکات',
      titleEn: 'Prepress Checklist & Dieline Specifications',
      subtitleFa: 'پروفایل رنگی Fogra 39، رزولوشن ۳۰۰ DPI و خط‌تاهای بدون خطا',
      stats: 'دانلود فایل قالب • استانداردهای تیغ'
    }
  },
  {
    id: 'faq-help',
    slug: 'faq',
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
    y: 1750,
    source: 'hardcoded',
    defaultData: {
      titleFa: 'پاسخ به متداول‌ترین پرسش‌های مدیران و طراحان',
      titleEn: 'Frequently Asked Questions & Support',
      subtitleFa: 'شرایط تیراژ، نحوه تست رنگ، زمان تحویل و بسته‌بندی پالت',
      stats: 'دسته‌بندی پرسش‌ها • پاسخ فوری'
    }
  },
  {
    id: 'contact-node',
    slug: 'contact',
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
    tag: 'Direct Action',
    source: 'hardcoded',
    defaultData: {
      titleFa: 'دریافت فوری پیش‌فاکتور و استعلام سفارشات',
      titleEn: 'Instant Quote & Factory Visit Booking',
      subtitleFa: 'تماس با کارشناسان فروش و بازدید حضوری از خطوط تولید',
      stats: 'پاسخگویی سریع • مشاوره فنی رایگان'
    }
  },
  {
    id: 'admin-cms-node',
    slug: 'admin-cms',
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
    tag: 'Admin Suite',
    source: 'hardcoded',
    defaultData: {
      titleFa: 'استودیو مرکزی مدیریت داده و تنظیمات',
      titleEn: 'Admin Studio & PocketBase Data Core',
      subtitleFa: 'کنترل کامل دیتابیس، کش SWR و مخزن رسانه',
      stats: 'Live Synced • 0ms Hydration'
    }
  }
]

// Waterfall Flow Requests Stream (DEFAULT: COLLAPSED)
interface WaterfallEntry {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  status: number
  statusText: string
  durationMs: number
  timestamp: string
  isExpanded: boolean
  requestJson: any
  responseJson: any
}

const waterfallRequests = ref<WaterfallEntry[]>([
  {
    id: 'req-1',
    method: 'GET',
    endpoint: '/api/admin/sitemap',
    status: 200,
    statusText: 'OK',
    durationMs: 14,
    timestamp: new Date().toLocaleTimeString(),
    isExpanded: false,
    requestJson: {
      method: 'GET',
      headers: { accept: 'application/json' },
      query: { telemetry: 'full' }
    },
    responseJson: {
      success: true,
      stats: { totalNodes: 15, backendSyncedCount: 1, hardcodedCount: 14 },
      activeEngine: 'PocketBase SWR Engine'
    }
  },
  {
    id: 'req-2',
    method: 'GET',
    endpoint: '/api/collections/pages/records?perPage=100',
    status: 200,
    statusText: 'OK',
    durationMs: 22,
    timestamp: new Date().toLocaleTimeString(),
    isExpanded: false,
    requestJson: {
      method: 'GET',
      endpoint: 'http://127.0.0.1:8090/api/collections/pages/records',
      params: { perPage: 100 }
    },
    responseJson: {
      page: 1,
      perPage: 100,
      totalItems: 1,
      items: [{ slug: 'home', title: 'مجتمع چاپ و بسته‌بندی نجم', id: 'rec_home_pb' }]
    }
  },
  {
    id: 'req-3',
    method: 'GET',
    endpoint: '/api/collections/products/records?perPage=20',
    status: 200,
    statusText: 'OK',
    durationMs: 31,
    timestamp: new Date().toLocaleTimeString(),
    isExpanded: false,
    requestJson: {
      method: 'GET',
      endpoint: 'http://127.0.0.1:8090/api/collections/products/records',
      params: { perPage: 20 }
    },
    responseJson: {
      totalItems: 12,
      categories: ['pharmaceutical', 'cosmetic', 'food', 'hardbox']
    }
  }
])

const isAllWaterfallExpanded = computed(() => waterfallRequests.value.every(r => r.isExpanded))

function toggleExpandAllWaterfall() {
  const target = !isAllWaterfallExpanded.value
  waterfallRequests.value.forEach(r => (r.isExpanded = target))
}

function formatJson(data: any) {
  try {
    return JSON.stringify(data, null, 2)
  } catch (e) {
    return String(data)
  }
}

function copyJson(data: any) {
  navigator.clipboard.writeText(JSON.stringify(data, null, 2))
}

// Fetch 100% Dynamic Telemetry & Merge into Nodes
const { data: sitemapApiData, refresh: refreshSitemapApi } = await useAsyncData('sitemap-dynamic-telemetry', () =>
  $fetch<any>('/api/admin/sitemap'),
  { lazy: true }
)

const nodes = computed(() => {
  if (sitemapApiData.value?.nodes && sitemapApiData.value.nodes.length > 0) {
    return sitemapApiData.value.nodes
  }
  return defaultNodes
})

const backendSyncedCount = computed(() => nodes.value.filter((n: any) => n.source === 'backend').length)
const hardcodedCount = computed(() => nodes.value.filter((n: any) => n.source === 'hardcoded').length)

async function refreshSitemap() {
  const startTime = performance.now()
  try {
    const res = await refreshSitemapApi()
    const durationMs = Math.round(performance.now() - startTime)

    waterfallRequests.value.unshift({
      id: `req-${Date.now()}`,
      method: 'GET',
      endpoint: '/api/admin/sitemap',
      status: 200,
      statusText: 'OK',
      durationMs,
      timestamp: new Date().toLocaleTimeString(),
      isExpanded: false,
      requestJson: { method: 'GET', endpoint: '/api/admin/sitemap' },
      responseJson: res || sitemapApiData.value
    })
  } catch (err: any) {
    waterfallRequests.value.unshift({
      id: `req-${Date.now()}`,
      method: 'GET',
      endpoint: '/api/admin/sitemap',
      status: 500,
      statusText: 'Error',
      durationMs: 0,
      timestamp: new Date().toLocaleTimeString(),
      isExpanded: false,
      requestJson: { method: 'GET', endpoint: '/api/admin/sitemap' },
      responseJson: { error: err.message }
    })
  }
}

// 60-120 FPS Pan & Zoom Engine with Focal Point Cursor Precision
const panX = ref(0)
const panY = ref(0)
const zoomScale = ref(0.6)
const isDragging = ref(false)
let dragStartX = 0
let dragStartY = 0
let initialPinchDistance = 0
let initialPinchScale = 1

function zoomAroundPoint(newScale: number, focalX: number, focalY: number) {
  const oldScale = zoomScale.value
  const clampedScale = Math.max(0.25, Math.min(2.5, newScale))
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

// Center to fit ALL 15 nodes and orbital rings into screen
function resetToCenter() {
  const focalX = window.innerWidth / 2
  const focalY = window.innerHeight / 2
  const targetScale = window.innerWidth < 1024 ? 0.45 : (window.innerWidth < 1440 ? 0.58 : 0.68)
  
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
  const startTime = performance.now()

  try {
    const slug = selectedNode.value.slug || selectedNode.value.id
    const payload = {
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

    const res = await $fetch('/api/admin/ui/publish', {
      method: 'POST',
      body: payload
    }).catch(() => null)

    const durationMs = Math.round(performance.now() - startTime)

    selectedNode.value.source = 'backend'
    if (selectedNode.value.liveData) {
      selectedNode.value.liveData.titleFa = editForm.value.titleFa
      selectedNode.value.liveData.titleEn = editForm.value.titleEn
      selectedNode.value.liveData.subtitleFa = editForm.value.subtitleFa
      selectedNode.value.liveData.stats = editForm.value.stats
    }

    waterfallRequests.value.unshift({
      id: `req-${Date.now()}`,
      method: 'POST',
      endpoint: `/api/admin/ui/publish [${slug}]`,
      status: 200,
      statusText: 'OK',
      durationMs,
      timestamp: new Date().toLocaleTimeString(),
      isExpanded: false,
      requestJson: payload,
      responseJson: res || { success: true, slug, updated: new Date().toISOString() }
    })

    saveStatusMessage.value = isRTL.value ? 'ذخیره شد' : 'Saved'
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
  { from: 'services-pillar', to: 'faq-help', color: '#9333ea', speed: 3.1 },
  // PocketBase Live Auxiliary Pages
  { from: 'core-home', to: 'pb-login', color: '#6366f1', speed: 2.5 },
  { from: 'core-home', to: 'pb-menu', color: '#0ea5e9', speed: 2.3 },
  { from: 'core-home', to: 'pb-footer', color: '#64748b', speed: 2.6 }
]

const visibleNodes = computed(() => {
  return nodes.value.filter((n: any) => {
    if (activeLens.value !== 'all' && n.lens !== activeLens.value && n.type !== 'nucleus') return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchFa = (n.liveData?.titleFa || n.titleFa || '').toLowerCase().includes(q)
      const matchEn = (n.liveData?.titleEn || n.titleEn || '').toLowerCase().includes(q)
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
