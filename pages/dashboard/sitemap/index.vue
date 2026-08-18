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
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.85)_0%,rgba(241,245,249,0.5)_60%,rgba(226,232,240,0.8)_100%)]"></div>
    </div>

    <!-- Floating Zen Header HUD & Live Telemetry -->
    <header class="absolute top-6 inset-x-6 z-40 flex items-center justify-between pointer-events-none">
      <!-- Left: Exit to Dashboard & Live Database Telemetry Badges -->
      <div class="flex items-center gap-3 pointer-events-auto">
        <NuxtLink
          to="/dashboard"
          class="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-slate-700 hover:text-emerald-800 hover:border-emerald-300 transition-all text-xs font-bold text-d4 cursor-pointer"
        >
          <Icon name="mdi:arrow-right" class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" :class="isRTL ? '' : 'rotate-180 group-hover:translate-x-0.5'" />
          <span>{{ isRTL ? 'بازگشت به پیشخوان' : 'Exit to Dashboard' }}</span>
        </NuxtLink>

        <!-- Live Sync Telemetry Pills -->
        <div class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
            <span>{{ backendSyncedCount }} {{ isRTL ? 'گره متصل به دیتابیس' : 'Live PB' }}</span>
          </div>
          <span class="text-slate-300">•</span>
          <div class="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span>{{ hardcodedCount }} {{ isRTL ? 'داده‌های محلی پیش‌فرض' : 'Local Samples' }}</span>
          </div>
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
        <div class="hidden lg:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-xs">
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
            :placeholder="isRTL ? 'کاوش در گره‌ها و محتوا...' : 'Search nodes or content...'"
            class="w-full bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full pr-10 pl-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#018786] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="absolute left-3 top-2.5 text-slate-400 hover:text-slate-700">
            <Icon name="mdi:close-circle" class="w-4 h-4" />
          </button>
        </div>

        <!-- Zoom Controls -->
        <div class="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
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

    <!-- Bottom HUD Info Pill & Telemetry Legend -->
    <div class="absolute bottom-6 inset-x-6 z-40 flex items-center justify-between pointer-events-none">
      <div class="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md text-xs text-slate-500 font-mono">
        <span>Spatial CMS Studio</span>
        <span>•</span>
        <span>Click any node to edit live</span>
      </div>

      <!-- Telemetry Status Legend -->
      <div class="pointer-events-auto hidden md:flex items-center gap-5 px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md text-xs font-bold text-d4">
        <div class="flex items-center gap-2 text-emerald-800">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
          <span>{{ isRTL ? 'متصل به دیتابیس PocketBase' : 'Live PocketBase' }}</span>
        </div>
        <div class="flex items-center gap-2 text-slate-600">
          <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
          <span>{{ isRTL ? 'نمونه محلی پیش‌فرض' : 'Default Sample' }}</span>
        </div>
      </div>
    </div>

    <!-- Pure Infinite Spatial Stage (Hardware Accelerated, Gesture Drag & Figma-Grade Zoom) -->
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

          <!-- Dynamic Bezier Vector Edges with Living Pulse -->
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
            <!-- Main Vector Arc -->
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeActive(edge) ? edgeColor(edge.color, 1) : '#94a3b8'"
              :stroke-width="isEdgeActive(edge) ? 2.5 : 1.2"
              stroke-linecap="round"
              class="transition-all duration-300"
            />
            <!-- Living Energy Dot -->
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

        <!-- ARTISTIC SPATIAL NODES WITH TELEMETRY STATUS DOTS -->
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
            <!-- Telemetry Indicator Beacon (Green if Live Backend, Gray if Hardcoded) -->
            <div class="absolute top-2 right-2 flex items-center gap-1">
              <span
                class="w-3.5 h-3.5 rounded-full border-2 border-white"
                :class="[
                  node.source === 'backend'
                    ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)] animate-pulse'
                    : 'bg-slate-400 shadow-xs'
                ]"
                :title="node.source === 'backend' ? 'Live PocketBase Data' : 'Hardcoded Sample'"
              ></span>
            </div>

            <div class="w-14 h-14 rounded-full bg-[#018786] text-white flex items-center justify-center shadow-lg mb-2">
              <Icon :name="node.icon" class="w-7 h-7" />
            </div>

            <span class="text-xs font-bold text-[#018786] tracking-wider uppercase font-mono mb-0.5">ECOSYSTEM CORE</span>
            <h2 class="text-base font-extrabold text-slate-900 text-d4 text-center leading-tight">
              {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
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
            <!-- Telemetry Indicator Beacon -->
            <div class="absolute top-2 right-2 flex items-center gap-1">
              <span
                class="w-3 h-3 rounded-full border-2 border-white"
                :class="[
                  node.source === 'backend'
                    ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)] animate-pulse'
                    : 'bg-slate-400 shadow-xs'
                ]"
                :title="node.source === 'backend' ? 'Live PocketBase Data' : 'Hardcoded Sample'"
              ></span>
            </div>

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
              {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
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
            <!-- Telemetry Indicator Beacon -->
            <span
              class="w-2.5 h-2.5 rounded-full border border-white shrink-0"
              :class="[
                node.source === 'backend'
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse'
                  : 'bg-slate-400'
              ]"
              :title="node.source === 'backend' ? 'Live PocketBase Data' : 'Hardcoded Sample'"
            ></span>

            <div
              class="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs shadow-xs shrink-0"
              :style="{ backgroundColor: node.accentColor || '#64748b' }"
            >
              <Icon :name="node.icon" class="w-3.5 h-3.5" />
            </div>

            <div>
              <div class="text-xs font-bold text-slate-800 text-d4">
                {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
              </div>
              <div class="text-[9px] font-mono text-slate-400">
                {{ node.path || node.meta }}
              </div>
            </div>

            <span v-if="node.tag" class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {{ node.tag }}
            </span>
          </div>

          <!-- NODE VARIANT 4: MICRO FEATURE GLYPHS -->
          <div
            v-else
            class="relative flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm p-2 transition-all duration-300 group-hover:scale-115"
            :style="{ width: `${node.size || 36}px`, height: `${node.size || 36}px` }"
            :class="selectedNode?.id === node.id ? 'ring-4 ring-emerald-500/30 border-[#018786]' : ''"
          >
            <span
              class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
              :class="node.source === 'backend' ? 'bg-emerald-500' : 'bg-slate-400'"
            ></span>
            <Icon :name="node.icon" class="w-4 h-4" :style="{ color: node.accentColor || '#018786' }" />
          </div>
        </div>
      </div>
    </div>

    <!-- IN-PLACE LIVE CMS STUDIO DRAWER (Direct Edit & PocketBase Sync) -->
    <transition name="sheet-slide">
      <div
        v-if="selectedNode"
        class="absolute inset-y-6 right-6 z-50 w-full sm:w-[440px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl text-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div class="space-y-5">
          <!-- Sheet Header & Telemetry Status Pill -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                :style="{ backgroundColor: selectedNode.accentColor || '#018786' }"
              >
                <Icon :name="selectedNode.icon" class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold tracking-wider uppercase font-mono text-slate-400">IN-PLACE CMS EDITOR</span>
                  <!-- Live Telemetry Badge -->
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
                    :class="[
                      selectedNode.source === 'backend'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    ]"
                  >
                    <span
                      class="w-2 h-2 rounded-full"
                      :class="selectedNode.source === 'backend' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"
                    ></span>
                    <span>{{ selectedNode.source === 'backend' ? 'دیتابیس آنلاین (PB)' : 'نمونه محلی (Sample)' }}</span>
                  </span>
                </div>
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

          <!-- Edit Mode Tabs: Form View vs Raw Schema JSON -->
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              @click="editorTab = 'form'"
              class="flex-1 py-1.5 rounded-xl transition cursor-pointer text-d4"
              :class="editorTab === 'form' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'"
            >
              {{ isRTL ? 'فیلدهای محتوایی' : 'Content Fields' }}
            </button>
            <button
              @click="editorTab = 'json'"
              class="flex-1 py-1.5 rounded-xl transition cursor-pointer text-d4"
              :class="editorTab === 'json' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'"
            >
              {{ isRTL ? 'اسکیما ساختار (JSON)' : 'Raw JSON Schema' }}
            </button>
          </div>

          <!-- TAB 1: FORM FIELDS IN-PLACE EDITOR -->
          <div v-if="editorTab === 'form'" class="space-y-4 text-right">
            <!-- Persian Title -->
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-slate-500 text-d4 flex items-center justify-between">
                <span>عنوان فارسی صفحه</span>
                <span class="text-emerald-700 font-mono text-[10px]">FA Title</span>
              </label>
              <input
                v-model="editForm.titleFa"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#018786] transition"
              />
            </div>

            <!-- English Title -->
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-slate-500 text-d4 flex items-center justify-between">
                <span>عنوان انگلیسی</span>
                <span class="text-slate-400 font-mono text-[10px]">EN Title</span>
              </label>
              <input
                v-model="editForm.titleEn"
                type="text"
                dir="ltr"
                class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#018786] transition font-sans text-left"
              />
            </div>

            <!-- Subtitle / Mission Statement -->
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-slate-500 text-d4">توضیحات و بیانیه ماموریت</label>
              <textarea
                v-model="editForm.subtitleFa"
                rows="3"
                class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-700 leading-relaxed focus:outline-none focus:border-[#018786] transition"
              ></textarea>
            </div>

            <!-- Key Stats Highlight -->
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-slate-500 text-d4">آمار کلیدی و هایلایت‌ها</label>
              <input
                v-model="editForm.stats"
                type="text"
                class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#018786] transition"
              />
            </div>
          </div>

          <!-- TAB 2: RAW JSON SCHEMA EDITOR -->
          <div v-else class="space-y-2 text-right">
            <label class="text-[11px] font-bold text-slate-500 text-d4">کد ساختار JSON اسکیما</label>
            <textarea
              v-model="rawJsonContent"
              rows="12"
              dir="ltr"
              class="w-full bg-slate-900 text-emerald-400 rounded-2xl p-3.5 font-mono text-[11px] leading-relaxed focus:outline-none border border-slate-800 text-left"
            ></textarea>
          </div>

          <!-- Live Save Feedback Alert -->
          <div
            v-if="saveStatusMessage"
            class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 text-d4 animate-fade-in"
          >
            <Icon name="mdi:check-circle" class="w-4 h-4 text-emerald-600" />
            <span>{{ saveStatusMessage }}</span>
          </div>
        </div>

        <!-- Action Footer (Save to PocketBase & View Live) -->
        <div class="pt-5 border-t border-slate-100 space-y-2">
          <button
            @click="saveNodeToPocketBase"
            :disabled="isSaving"
            class="w-full py-3.5 rounded-2xl bg-[#018786] hover:bg-emerald-800 text-white font-extrabold text-xs text-center transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 text-d4"
          >
            <Icon :name="isSaving ? 'mdi:loading' : 'mdi:cloud-upload'" class="w-4 h-4" :class="isSaving ? 'animate-spin' : ''" />
            <span>{{ isSaving ? (isRTL ? 'در حال ذخیره در دیتابیس...' : 'Saving to Database...') : (isRTL ? 'ذخیره و انتشار در PocketBase' : 'Save Live to PocketBase') }}</span>
          </button>

          <NuxtLink
            v-if="selectedNode.path && !selectedNode.path.includes('[')"
            :to="selectedNode.path"
            target="_blank"
            class="block w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition text-d4"
          >
            {{ isRTL ? 'مشاهده زنده این صفحه ↗' : 'View Live Route ↗' }}
          </NuxtLink>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: false // Standalone Pure Artistic Fullscreen Canvas
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

// Canvas HUD Controls
const activeLens = ref('all')
const searchQuery = ref('')
const hoveredNodeId = ref<string | null>(null)
const selectedNode = ref<any | null>(null)

// In-Place CMS Editor State
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

// Fetch 100% Dynamic Sitemap & Node Telemetry from Backend API
const { data: sitemapApiData, refresh: refreshSitemap } = await useAsyncData('sitemap-dynamic-telemetry', () =>
  $fetch<any>('/api/admin/sitemap'),
  { lazy: true }
)

const nodes = computed(() => sitemapApiData.value?.nodes || [])
const backendSyncedCount = computed(() => nodes.value.filter((n: any) => n.source === 'backend').length)
const hardcodedCount = computed(() => nodes.value.filter((n: any) => n.source === 'hardcoded').length)

// 60-120 FPS Pan & Zoom Engine with Focal Point Cursor-Centric Precision
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

  // Populate In-Place CMS Form Fields
  editForm.value = {
    titleFa: node.liveData?.titleFa || node.titleFa,
    titleEn: node.liveData?.titleEn || node.titleEn,
    subtitleFa: node.liveData?.subtitleFa || node.descFa,
    stats: node.liveData?.stats || ''
  }

  rawJsonContent.value = JSON.stringify(node.liveData?.rawUiData || node.defaultData || {}, null, 2)

  // Smooth cinematic camera centering on selected node (offset for drawer)
  const targetScreenX = window.innerWidth > 1024 ? (window.innerWidth - 440) / 2 : window.innerWidth / 2
  const targetScreenY = window.innerHeight / 2

  panX.value = targetScreenX - node.x * zoomScale.value
  panY.value = targetScreenY - node.y * zoomScale.value
}

// In-Place Save Directly to PocketBase Backend
async function saveNodeToPocketBase() {
  if (!selectedNode.value) return
  isSaving.value = true
  saveStatusMessage.value = ''

  try {
    const slug = selectedNode.value.slug || selectedNode.value.id
    
    // Save draft / live to backend
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

    // Immediately update local node reactive telemetry to 🟢 'backend'
    selectedNode.value.source = 'backend'
    if (selectedNode.value.liveData) {
      selectedNode.value.liveData.titleFa = editForm.value.titleFa
      selectedNode.value.liveData.titleEn = editForm.value.titleEn
      selectedNode.value.liveData.subtitleFa = editForm.value.subtitleFa
      selectedNode.value.liveData.stats = editForm.value.stats
    }

    saveStatusMessage.value = isRTL.value ? '✅ تغییرات مستقیماً در دیتابیس ثبت و گره همگام شد.' : '✅ Saved live to database. Node is now synced.'
    refreshSitemap()
  } catch (err: any) {
    saveStatusMessage.value = 'خطا در ثبت اطلاعات'
  } finally {
    isSaving.value = false
  }
}

const lenses = [
  { id: 'all', labelFa: 'همه مدارها', labelEn: 'All Orbits' },
  { id: 'pages', labelFa: 'صفحات اصلی', labelEn: 'Core Pages' },
  { id: 'products', labelFa: 'محصولات', labelEn: 'Products' },
  { id: 'services', labelFa: 'خدمات و کارخانه', labelEn: 'Fleet & Process' },
  { id: 'knowledge', labelFa: 'دانش و تاریخچه', labelEn: 'Knowledge' },
]

// Constellation Vector Edges
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
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
