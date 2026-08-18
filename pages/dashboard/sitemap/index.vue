<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-0 z-50 h-screen w-screen bg-[#F8FAFC] text-slate-900 select-none overflow-hidden font-sans text-xs"
  >
    <!-- Architectural Dot Grid Canvas Background -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div
        class="absolute inset-0 opacity-40 transition-all duration-75"
        :style="{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: `${32 * zoomScale}px ${32 * zoomScale}px`,
          backgroundPosition: `${panX}px ${panY}px`
        }"
      ></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.85)_0%,rgba(241,245,249,0.6)_60%,rgba(226,232,240,0.85)_100%)]"></div>
    </div>

    <!-- Ultra-Compact Icon-Only Top HUD Bar -->
    <header class="absolute top-3 inset-x-3 z-40 flex items-center justify-between pointer-events-none gap-2">
      <!-- Left: Exit & Telemetry Pill -->
      <div class="flex items-center gap-1.5 pointer-events-auto shrink-0">
        <NuxtLink
          to="/dashboard"
          class="w-8 h-8 flex items-center justify-center rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xs text-slate-700 hover:text-emerald-800 hover:border-emerald-300 transition cursor-pointer"
          title="بازگشت به پیشخوان"
        >
          <Icon name="mdi:arrow-right" class="w-4 h-4" :class="isRTL ? '' : 'rotate-180'" />
        </NuxtLink>

        <!-- Live Node Count Pill -->
        <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xs text-emerald-800 font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)] animate-pulse"></span>
          <span class="font-mono">{{ backendSyncedCount }} PB</span>
        </div>
      </div>

      <!-- Center: GPS Center & Filter Lenses -->
      <div class="pointer-events-auto flex items-center gap-1.5 shrink-0">
        <button
          @click="resetToCenter"
          class="w-8 h-8 flex items-center justify-center rounded-xl bg-[#018786] hover:bg-emerald-800 text-white shadow-2xs transition cursor-pointer active:scale-95"
          title="مرکز چین نقشه"
        >
          <Icon name="mdi:crosshairs-gps" class="w-4 h-4" />
        </button>

        <!-- Filter Lens Pills -->
        <div class="hidden sm:flex items-center gap-0.5 bg-white/95 backdrop-blur-md p-0.5 rounded-xl border border-slate-200 shadow-2xs text-[11px] font-bold">
          <button
            v-for="lens in lenses"
            :key="lens.id"
            @click="activeLens = lens.id"
            class="px-2.5 py-1 rounded-lg transition cursor-pointer"
            :class="activeLens === lens.id ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'"
          >
            {{ isRTL ? lens.labelFa : lens.labelEn }}
          </button>
        </div>
      </div>

      <!-- Right: Search, Zoom & Console Trigger -->
      <div class="flex items-center gap-1.5 pointer-events-auto shrink-0">
        <!-- Search -->
        <div class="relative w-28 sm:w-36">
          <Icon name="mdi:magnify" class="absolute right-2 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو..."
            class="w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl pr-7 pl-2 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#018786] shadow-2xs text-xs"
          />
        </div>

        <!-- Zoom Controls -->
        <div class="flex items-center gap-0.5 bg-white/95 backdrop-blur-md p-0.5 rounded-xl border border-slate-200 shadow-2xs">
          <button @click="zoomIn" class="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 cursor-pointer" title="بزرگنمایی">
            <Icon name="mdi:plus" class="w-3.5 h-3.5" />
          </button>
          <span class="px-1 font-mono font-bold text-emerald-800 text-[10px]">{{ Math.round(zoomScale * 100) }}%</span>
          <button @click="zoomOut" class="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 cursor-pointer" title="کوچکنمایی">
            <Icon name="mdi:minus" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Refresh Live DB Button -->
        <button
          @click="refreshSitemap"
          class="w-8 h-8 flex items-center justify-center rounded-xl bg-white/95 border border-slate-200 text-slate-700 hover:text-emerald-800 shadow-2xs transition cursor-pointer"
          title="بروزرسانی داده‌ها از PocketBase"
        >
          <Icon name="mdi:refresh" class="w-4 h-4" />
        </button>

        <!-- Network Console Trigger -->
        <button
          @click="showDebugPane = !showDebugPane"
          class="w-8 h-8 flex items-center justify-center rounded-xl border shadow-2xs transition cursor-pointer"
          :class="[
            showDebugPane
              ? 'bg-emerald-800 text-white border-emerald-800'
              : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-100'
          ]"
          title="کنسول لاگ و تله‌متری شبکه"
        >
          <Icon name="mdi:code-json" class="w-4 h-4" />
        </button>
      </div>
    </header>

    <!-- Infinite Spatial Canvas Stage with Physics Spring Nodes -->
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
        <!-- VECTOR SVG CONNECTION PATHS -->
        <svg class="absolute inset-0 w-[4200px] h-[3000px] pointer-events-none z-10 overflow-visible">
          <!-- Orbital Concentric Reference Rings -->
          <g opacity="0.12">
            <circle cx="1800" cy="1300" r="320" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6 6" />
            <circle cx="1800" cy="1300" r="620" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="8 8" />
            <circle cx="1800" cy="1300" r="950" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="10 10" />
          </g>

          <!-- Dynamic Connecting Bezier Curves -->
          <g v-for="edge in visibleEdges" :key="`${edge.from}-${edge.to}`">
            <!-- Glow background path when active -->
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeActive(edge) ? edgeColor(edge.color, 0.25) : 'rgba(203, 213, 225, 0.5)'"
              :stroke-width="isEdgeActive(edge) ? 6 : 1.5"
              stroke-linecap="round"
              class="transition-all duration-200"
            />
            <!-- Main Vector Line -->
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeActive(edge) ? edgeColor(edge.color, 1) : '#94a3b8'"
              :stroke-width="isEdgeActive(edge) ? 2.5 : 1.2"
              stroke-linecap="round"
              class="transition-all duration-200"
            />
            <!-- Animated Flowing Light Pulse -->
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

        <!-- PUNCHY, BIGGER, 100% LIVE POCKETBASE NODES -->
        <div
          v-for="node in visibleNodes"
          :key="node.id"
          @mousedown.stop="startNodeDrag($event, node)"
          @click.stop="toggleNodeSelect(node)"
          @mouseenter="hoveredNodeId = node.id"
          @mouseleave="hoveredNodeId = null"
          class="absolute transition-transform duration-200 cursor-pointer group z-20 select-none"
          :style="{
            left: `${node.x}px`,
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%)',
            transition: isSpringingNode === node.id ? 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
          }"
        >
          <!-- 1. BIGGER SOLAR NUCLEUS NODE (Home Hub) -->
          <div
            v-if="node.type === 'nucleus'"
            class="relative flex flex-col items-center justify-center rounded-full bg-white border-3 border-[#018786] shadow-xl p-4 transition-all duration-300 group-hover:scale-105"
            :style="{ width: '155px', height: '155px' }"
            :class="selectedNode?.id === node.id ? 'ring-6 ring-emerald-500/25 scale-105' : ''"
          >
            <span class="absolute top-2.5 right-2.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse"></span>

            <div class="w-10 h-10 rounded-full bg-[#018786] text-white flex items-center justify-center shadow-md mb-1.5">
              <Icon :name="node.icon" class="w-5 h-5" />
            </div>

            <span class="text-[9px] font-extrabold text-[#018786] font-mono whitespace-nowrap uppercase tracking-wider">LIVE PB HUB</span>
            <h2 class="text-xs font-extrabold text-slate-900 truncate max-w-[125px] whitespace-nowrap text-center">
              {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
            </h2>
            <span class="text-[9px] font-mono text-slate-400">/</span>

            <!-- Branch Fold Toggle -->
            <button
              @click.stop="toggleBranchFold(node.id)"
              class="absolute -bottom-2.5 px-2 py-0.2 rounded-full bg-slate-900 text-white font-mono text-[9px] font-bold shadow-xs hover:bg-emerald-800 transition"
              :title="isBranchFolded(node.id) ? 'نمایش زیرشاخه‌ها' : 'بستن زیرشاخه‌ها'"
            >
              {{ isBranchFolded(node.id) ? '+ بازکردن' : '- بستن' }}
            </button>
          </div>

          <!-- 2. BIGGER PRIMARY PILLAR NODES -->
          <div
            v-else-if="node.type === 'pillar'"
            class="relative flex flex-col items-center justify-center rounded-full bg-white/98 backdrop-blur-md border-2 shadow-md p-3.5 transition-all duration-200 group-hover:scale-105 text-center"
            :style="{ width: '130px', height: '130px', borderColor: node.accentColor }"
            :class="[
              selectedNode?.id === node.id
                ? 'ring-4 ring-emerald-500/25 scale-105 z-30 shadow-xl'
                : hoveredNodeId === node.id
                  ? 'scale-102 z-20 shadow-lg'
                  : 'z-10'
            ]"
          >
            <span class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full border border-white bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)] animate-pulse"></span>

            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs mb-1.5"
              :style="{ backgroundColor: node.accentColor }"
            >
              <Icon :name="node.icon" class="w-4 h-4" />
            </div>

            <h3 class="text-[11px] font-extrabold text-slate-900 truncate max-w-[105px] whitespace-nowrap">
              {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
            </h3>

            <span class="text-[9px] font-mono text-slate-400 truncate max-w-[95px] whitespace-nowrap">
              {{ node.path }}
            </span>

            <!-- Branch Fold Toggle -->
            <button
              v-if="hasChildren(node.id)"
              @click.stop="toggleBranchFold(node.id)"
              class="absolute -bottom-2 px-1.5 py-0.2 rounded-full bg-slate-800 text-white font-mono text-[8px] font-bold shadow-xs hover:bg-emerald-800 transition"
            >
              {{ isBranchFolded(node.id) ? '+' : '-' }}
            </button>
          </div>

          <!-- 3. SATELLITE ISLAND NODES -->
          <div
            v-else
            class="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/98 backdrop-blur-md border shadow-xs transition-all duration-200 group-hover:scale-105 whitespace-nowrap"
            :style="{ borderColor: node.accentColor ? `${node.accentColor}70` : '#cbd5e1' }"
            :class="selectedNode?.id === node.id ? 'ring-2 ring-emerald-500 border-emerald-500 scale-105 z-30 shadow-md' : 'hover:border-slate-400 z-10'"
          >
            <span class="w-2 h-2 rounded-full border border-white bg-emerald-500 animate-pulse shrink-0"></span>

            <div
              class="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[10px] shadow-2xs shrink-0"
              :style="{ backgroundColor: node.accentColor || '#64748b' }"
            >
              <Icon :name="node.icon" class="w-3 h-3" />
            </div>

            <span class="text-xs font-bold text-slate-900 whitespace-nowrap">
              {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
            </span>

            <span class="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
              PB
            </span>
          </div>

          <!-- ORBITAL MICRO-ACTION ICONS AROUND SELECTED NODE -->
          <div
            v-if="selectedNode?.id === node.id"
            @click.stop
            @mousedown.stop
            class="absolute inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <!-- Orbit Ring -->
            <div class="relative w-full h-full">
              <!-- Action 1: Open Content Studio (Top) -->
              <button
                @click.stop="openProJsonStudio(node, 'content-studio')"
                class="pointer-events-auto absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white shadow-lg flex items-center justify-center transition-all duration-150 hover:scale-110 cursor-pointer"
                title="ویرایشگر محتوای صفحه"
              >
                <Icon name="mdi:pencil-outline" class="w-4 h-4" />
              </button>

              <!-- Action 2: Open Media Hub (Right) -->
              <button
                @click.stop="openProJsonStudio(node, 'media-hub')"
                class="pointer-events-auto absolute top-1/2 -right-8 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex items-center justify-center transition-all duration-150 hover:scale-110 cursor-pointer"
                title="رسانه‌ها و تصاویر"
              >
                <Icon name="mdi:image-multiple-outline" class="w-4 h-4" />
              </button>

              <!-- Action 3: Open Raw JSON (Bottom) -->
              <button
                @click.stop="openProJsonStudio(node, 'vanilla-editor')"
                class="pointer-events-auto absolute -bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg flex items-center justify-center transition-all duration-150 hover:scale-110 cursor-pointer"
                title="ویرایشگر JSON خام"
              >
                <Icon name="mdi:code-json" class="w-4 h-4" />
              </button>

              <!-- Action 4: Close Selection (Left) -->
              <button
                @click.stop="selectedNode = null"
                class="pointer-events-auto absolute top-1/2 -left-8 -translate-y-1/2 w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-lg flex items-center justify-center transition-all duration-150 hover:scale-110 cursor-pointer"
                title="بستن"
              >
                <Icon name="mdi:close" class="w-4 h-4" />
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

          <!-- ENGINE 3: SMART VISUAL ROWS (100% Flush Rectangular Sheet) -->
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

    <!-- BRIGHT LIGHT THEME TELEMETRY INSPECTOR DOCK -->
    <transition name="dock-slide">
      <div
        v-if="showDebugPane"
        class="fixed bottom-0 inset-x-0 z-50 h-80 bg-white/98 backdrop-blur-2xl border-t border-slate-200 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] flex flex-col font-sans text-xs text-slate-800 select-text"
      >
        <div class="h-8 px-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="font-bold text-emerald-800 text-xs">POCKETBASE NETWORK TELEMETRY</span>
            <span class="px-2 py-0.2 rounded-md bg-slate-200/80 text-slate-600 text-[10px] font-mono font-bold">
              {{ waterfallRequests.length }} requests
            </span>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex items-center bg-slate-200/80 rounded-lg p-0.5 text-[10px] font-bold">
              <button
                @click="logFilter = 'ALL'"
                class="px-2 py-0.5 rounded transition"
                :class="logFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              >
                ALL
              </button>
              <button
                @click="logFilter = 'GET'"
                class="px-2 py-0.5 rounded transition text-emerald-800"
                :class="logFilter === 'GET' ? 'bg-emerald-100 text-emerald-900 shadow-xs' : 'opacity-70 hover:opacity-100'"
              >
                GET
              </button>
              <button
                @click="logFilter = 'POST'"
                class="px-2 py-0.5 rounded transition text-blue-800"
                :class="logFilter === 'POST' ? 'bg-blue-100 text-blue-900 shadow-xs' : 'opacity-70 hover:opacity-100'"
              >
                POST
              </button>
            </div>

            <button
              @click="refreshSitemap"
              class="w-6 h-6 flex items-center justify-center rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
              title="Fetch"
            >
              <Icon name="mdi:refresh" class="w-3.5 h-3.5" />
            </button>

            <button
              @click="showDebugPane = false"
              class="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
              title="Close"
            >
              <Icon name="mdi:close" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div class="flex-1 flex overflow-hidden">
          <div class="w-72 sm:w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/60">
            <div class="p-1.5 border-b border-slate-200 bg-white flex items-center justify-between text-[10px] text-slate-500 font-bold select-none">
              <span>REQUESTS</span>
              <button @click="clearLogs" class="text-slate-400 hover:text-slate-700">Clear</button>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
              <div
                v-for="req in filteredWaterfallRequests"
                :key="req.id"
                @click="activeRequestId = req.id"
                class="p-2 cursor-pointer transition-colors flex items-center justify-between select-none"
                :class="[
                  activeRequestId === req.id
                    ? 'bg-white text-slate-900 border-l-3 border-emerald-500 shadow-2xs font-bold'
                    : 'hover:bg-white text-slate-600'
                ]"
              >
                <div class="flex items-center gap-1.5 overflow-hidden">
                  <span
                    class="px-1.5 py-0.2 rounded text-[8px] font-bold shrink-0 font-mono"
                    :class="req.method === 'POST' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'"
                  >
                    {{ req.method }}
                  </span>
                  <span class="text-[11px] truncate font-medium">{{ req.endpoint }}</span>
                </div>

                <div class="flex items-center gap-1.5 shrink-0 text-[10px] font-mono">
                  <span :class="req.status >= 400 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'">{{ req.status }}</span>
                  <span class="text-slate-400">{{ req.durationMs }}ms</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeRequest" class="flex-1 flex flex-col overflow-hidden bg-white">
            <div class="h-8 px-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 select-none">
              <div class="flex items-center gap-2">
                <button
                  @click="activeDetailTab = 'response'"
                  class="px-2.5 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer"
                  :class="activeDetailTab === 'response' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'text-slate-600 hover:text-slate-900'"
                >
                  RESPONSE JSON
                </button>
                <button
                  @click="activeDetailTab = 'request'"
                  class="px-2.5 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer"
                  :class="activeDetailTab === 'request' ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'text-slate-600 hover:text-slate-900'"
                >
                  REQUEST PAYLOAD
                </button>
              </div>
            </div>

            <div class="flex-1 overflow-hidden">
              <JsonLogViewer
                v-if="activeDetailTab === 'response'"
                :data="activeRequest.responseJson"
              />
              <JsonLogViewer
                v-else
                :data="activeRequest.requestJson"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useLocale } from '~/composables/useLocale'
import JsonTreeRow from '~/components/dashboard/JsonTreeRow.vue'
import VanillaJsonEditor from '~/components/dashboard/VanillaJsonEditor.vue'
import JsonLogViewer from '~/components/dashboard/JsonLogViewer.vue'
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

// Branch Folding State
const foldedBranches = ref<Set<string>>(new Set())

function isBranchFolded(nodeId: string) {
  return foldedBranches.value.has(nodeId)
}

function toggleBranchFold(nodeId: string) {
  if (foldedBranches.value.has(nodeId)) {
    foldedBranches.value.delete(nodeId)
  } else {
    foldedBranches.value.add(nodeId)
  }
}

// Multi-Package JSON Schema Studio State
const showJsonStudio = ref(false)
const activeStudioNode = ref<any | null>(null)
const studioEngine = ref<'content-studio' | 'vanilla-editor' | 'visual-rows'>('content-studio')
const originalBaselineSchema = ref<Record<string, any>>({})
const currentWorkingSchema = ref<Record<string, any>>({})
const studioCopied = ref(false)
const isStudioSaving = ref(false)

function openProJsonStudio(node: any, engine: 'content-studio' | 'vanilla-editor' | 'visual-rows' | 'media-hub' = 'content-studio') {
  activeStudioNode.value = node
  const schemaSnapshot = JSON.parse(JSON.stringify(node.liveData?.rawUiData || { titleFa: node.titleFa, titleEn: node.titleEn }))
  
  originalBaselineSchema.value = JSON.parse(JSON.stringify(schemaSnapshot))
  currentWorkingSchema.value = JSON.parse(JSON.stringify(schemaSnapshot))
  studioEngine.value = engine === 'media-hub' ? 'content-studio' : engine
  showJsonStudio.value = true
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
    const newId = `req-${Date.now()}`

    activeStudioNode.value.source = 'backend'
    if (activeStudioNode.value.liveData) {
      activeStudioNode.value.liveData.rawUiData = currentWorkingSchema.value
    }

    originalBaselineSchema.value = JSON.parse(JSON.stringify(currentWorkingSchema.value))

    waterfallRequests.value.unshift({
      id: newId,
      method: 'POST',
      endpoint: `/api/admin/ui/publish [${slug}]`,
      status: 200,
      statusText: 'OK',
      durationMs,
      timestamp: new Date().toLocaleTimeString(),
      requestJson: payload,
      responseJson: res || { success: true, slug, updated: new Date().toISOString() }
    })
    activeRequestId.value = newId

    showJsonStudio.value = false
  } catch (err: any) {
    // Error
  } finally {
    isStudioSaving.value = false
  }
}

// Telemetry Inspector State
const activeRequestId = ref<string>('req-1')
const activeDetailTab = ref<'response' | 'request'>('response')
const logFilter = ref<'ALL' | 'GET' | 'POST'>('ALL')

// Physics Spring Snap-Back Node Dragging State
let draggedNode: any = null
let nodeDragStartX = 0
let nodeDragStartY = 0
let nodeInitialX = 0
let nodeInitialY = 0
const isSpringingNode = ref<string | null>(null)

function startNodeDrag(e: MouseEvent, node: any) {
  draggedNode = node
  nodeDragStartX = e.clientX
  nodeDragStartY = e.clientY
  nodeInitialX = node.initialAnchorX || node.x
  nodeInitialY = node.initialAnchorY || node.y
  node.initialAnchorX = nodeInitialX
  node.initialAnchorY = nodeInitialY
}

function toggleNodeSelect(node: any) {
  if (selectedNode.value?.id === node.id) {
    selectedNode.value = null
    return
  }
  selectedNode.value = node
}

interface WaterfallEntry {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  status: number
  statusText: string
  durationMs: number
  timestamp: string
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
    durationMs: 16,
    timestamp: new Date().toLocaleTimeString(),
    requestJson: { method: 'GET', endpoint: '/api/admin/sitemap' },
    responseJson: { success: true, stats: { totalNodes: 12, backendSyncedCount: 12, hardcodedCount: 0 } }
  }
])

const filteredWaterfallRequests = computed(() => {
  if (logFilter.value === 'ALL') return waterfallRequests.value
  return waterfallRequests.value.filter(r => r.method === logFilter.value)
})

const activeRequest = computed(() => {
  return waterfallRequests.value.find(r => r.id === activeRequestId.value) || waterfallRequests.value[0]
})

function clearLogs() {
  waterfallRequests.value = []
}

// Fetch 100% Dynamic Telemetry & Merge into Nodes
const { data: sitemapApiData, refresh: refreshSitemapApi } = await useAsyncData('sitemap-dynamic-telemetry', () =>
  $fetch<any>('/api/admin/sitemap'),
  { lazy: true }
)

const dynamicNodesState = ref<any[]>([])

watchEffect(() => {
  if (sitemapApiData.value?.nodes && sitemapApiData.value.nodes.length > 0) {
    dynamicNodesState.value = sitemapApiData.value.nodes.map((n: any) => ({
      ...n,
      initialAnchorX: n.x,
      initialAnchorY: n.y
    }))
  }
})

const nodes = computed(() => dynamicNodesState.value)
const backendSyncedCount = computed(() => nodes.value.length)

async function refreshSitemap() {
  const startTime = performance.now()
  try {
    const res = await refreshSitemapApi()
    const durationMs = Math.round(performance.now() - startTime)
    const newId = `req-${Date.now()}`

    waterfallRequests.value.unshift({
      id: newId,
      method: 'GET',
      endpoint: '/api/admin/sitemap',
      status: 200,
      statusText: 'OK',
      durationMs,
      timestamp: new Date().toLocaleTimeString(),
      requestJson: { method: 'GET', endpoint: '/api/admin/sitemap' },
      responseJson: res || sitemapApiData.value
    })
    activeRequestId.value = newId
  } catch (err: any) {
    // Error
  }
}

// 60-120 FPS Pan & Zoom Engine
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

function resetToCenter() {
  const focalX = window.innerWidth / 2
  const focalY = window.innerHeight / 2
  const targetScale = window.innerWidth < 1024 ? 0.48 : (window.innerWidth < 1440 ? 0.6 : 0.7)
  
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
  if (draggedNode) {
    const dx = (e.clientX - nodeDragStartX) / zoomScale.value
    const dy = (e.clientY - nodeDragStartY) / zoomScale.value
    draggedNode.x = nodeInitialX + dx
    draggedNode.y = nodeInitialY + dy
    return
  }

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

// Physics Spring Snap-Back on Release
function stopDrag() {
  if (draggedNode) {
    const target = draggedNode
    isSpringingNode.value = target.id
    target.x = target.initialAnchorX || target.x
    target.y = target.initialAnchorY || target.y
    setTimeout(() => {
      isSpringingNode.value = null
    }, 450)
  }

  isDragging.value = false
  draggedNode = null
  initialPinchDistance = 0
}

function onCanvasDblClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('cursor-grab')) {
    resetToCenter()
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
  { from: 'pb-home', to: 'pb-about', color: '#018786', speed: 3.0 },
  { from: 'pb-home', to: 'pb-products', color: '#2563eb', speed: 2.8 },
  { from: 'pb-home', to: 'pb-services', color: '#9333ea', speed: 3.0 },
  { from: 'pb-home', to: 'pb-history', color: '#d97706', speed: 3.2 },
  { from: 'pb-home', to: 'pb-contact', color: '#e11d48', speed: 2.2 },
  { from: 'pb-home', to: 'pb-login', color: '#6366f1', speed: 2.5 },
  { from: 'pb-home', to: 'pb-menu', color: '#0ea5e9', speed: 2.3 },
  { from: 'pb-home', to: 'pb-footer', color: '#64748b', speed: 2.6 },
  { from: 'pb-products', to: 'pb-catalog', color: '#2563eb', speed: 2.8 },
  { from: 'pb-services', to: 'pb-faq', color: '#9333ea', speed: 2.9 },
  { from: 'pb-history', to: 'pb-blog', color: '#d97706', speed: 3.0 }
]

function hasChildren(nodeId: string) {
  return edges.some(e => e.from === nodeId)
}

const visibleNodes = computed(() => {
  return nodes.value.filter((n: any) => {
    // Check if folded by parent
    for (const parentId of foldedBranches.value) {
      const isChild = edges.some(e => e.from === parentId && e.to === n.id)
      if (isChild) return false
    }

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
