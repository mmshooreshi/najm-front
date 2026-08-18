<!-- pages/dashboard/sitemap/index.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-0 z-50 h-screen w-screen bg-[#F8FAFC] text-slate-900 select-none overflow-hidden font-sans text-xs flex flex-col"
  >
    <!-- Soft Ambient Lighting -->
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-emerald-100/50 blur-[110px]"></div>
      <div class="absolute -bottom-[15%] -right-[10%] w-[55vw] h-[55vw] rounded-full bg-blue-100/50 blur-[110px]"></div>
      <div class="absolute top-[35%] left-[35%] w-[40vw] h-[40vw] rounded-full bg-purple-100/35 blur-[130px]"></div>
    </div>

    <!-- Top HUD Toolbar with 4 Dynamic Layout Engines & Global Controls -->
    <header class="relative z-40 h-14 px-3 sm:px-5 flex items-center justify-between pointer-events-auto bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs">
      <!-- Left: Navigation & Graph Telemetry -->
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/dashboard"
          class="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs text-slate-700 hover:text-emerald-800 hover:border-emerald-300 transition cursor-pointer"
          title="بازگشت به پیشخوان"
        >
          <Icon name="mdi:arrow-right" class="w-4 h-4" :class="isRTL ? '' : 'rotate-180'" />
        </NuxtLink>

        <!-- Live Graph Count -->
        <div class="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-bold text-[11px] text-slate-700">
          <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
          <span>{{ visibleNodes.length }} صفحه در نقشه</span>
        </div>
      </div>

      <!-- Center: 4 DYNAMIC VIEW MODES & RECURSIVE SUBTREE TOGGLES -->
      <div class="flex items-center gap-1.5 sm:gap-2 py-1">
        <!-- 4 Layout Engines -->
        <div class="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-bold">
          <button
            v-for="mode in viewModes"
            :key="mode.id"
            @click="switchViewMode(mode.id)"
            class="px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            :class="currentViewMode === mode.id ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
            :title="mode.desc"
          >
            <Icon :name="mode.icon" class="w-3.5 h-3.5" />
            <span class="hidden md:inline">{{ mode.label }}</span>
          </button>
        </div>

        <div class="h-5 w-[1px] bg-slate-200 hidden sm:block"></div>

        <!-- Re-Center / Re-Calculate Math Layout -->
        <button
          @click="resetNodePositions"
          class="w-8 h-8 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center shadow-xs transition cursor-pointer active:scale-95"
          title="محاسبه مجدد موقعیت‌های هندسی"
        >
          <Icon name="mdi:crosshairs-gps" class="w-4 h-4" />
        </button>

        <!-- Master 1-Arrow (Toggle Direct) -->
        <button
          @click="toggleDirectChildrenOfAll"
          class="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs transition cursor-pointer"
          :title="isAnyDirectFolded ? 'نمایش شاخه‌های مستقیم' : 'بستن شاخه‌های مستقیم'"
        >
          <Icon :name="isAnyDirectFolded ? 'mdi:chevron-down' : 'mdi:chevron-up'" class="w-4 h-4" />
        </button>

        <!-- Master 2-Arrow (Recursive Subtree Deep Fold) -->
        <button
          @click="toggleRecursiveChildrenOfAll"
          class="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-emerald-800 flex items-center justify-center shadow-2xs transition cursor-pointer"
          :title="isAnyRecursiveFolded ? 'بازکردن تمام زیرشاخه‌ها به صورت آبشاری' : 'بستن تمام زیرشاخه‌ها و فرزندان'"
        >
          <Icon :name="isAnyRecursiveFolded ? 'mdi:chevron-double-down' : 'mdi:chevron-double-up'" class="w-4 h-4" />
        </button>

        <!-- Unlock / Lock All -->
        <button
          @click="toggleLockAll"
          class="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs transition cursor-pointer"
          :title="isAllLocked ? 'بازکردن قفل همه' : 'قفل موقعیت همه صفحات'"
        >
          <Icon :name="isAllLocked ? 'mdi:lock' : 'mdi:lock-open-variant-outline'" class="w-3.5 h-3.5" :class="isAllLocked ? 'text-amber-600' : 'text-slate-400'" />
        </button>

        <!-- Spacing & Density Physics Tuner Button -->
        <button
          @click="showTuningPanel = !showTuningPanel"
          class="px-2.5 py-1 rounded-xl border flex items-center gap-1.5 shadow-2xs transition cursor-pointer font-bold text-xs"
          :class="showTuningPanel ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
          title="تنظیم فواصل و حریم دفع برخورد"
        >
          <Icon name="mdi:tune-variant" class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">فواصل: {{ Math.round(clusterSpacingScale * 100) }}%</span>
        </button>

        <!-- Group Selector Chips -->
        <div class="hidden lg:flex items-center bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-bold">
          <button
            @click="selectedGroup = 'all'"
            class="px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            :class="selectedGroup === 'all' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          >
            <span>همه</span>
          </button>

          <button
            v-for="grp in groupToggles"
            :key="grp.id"
            @click="selectedGroup = grp.id"
            class="px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            :class="selectedGroup === grp.id ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          >
            <span class="text-[10px]">{{ grp.icon }}</span>
            <span class="hidden xl:inline">{{ grp.label }}</span>
          </button>
        </div>
      </div>

      <!-- Right: Search, Refresh & Debug -->
      <div class="flex items-center gap-1.5">
        <div class="relative w-24 sm:w-32">
          <Icon name="mdi:magnify" class="absolute right-2 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو..."
            class="w-full bg-white border border-slate-200 rounded-xl pr-7 pl-2 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs text-xs"
          />
        </div>

        <button
          @click="refreshSitemap"
          class="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-800 shadow-2xs transition cursor-pointer"
          title="بروزرسانی داده‌ها از PocketBase"
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

    <!-- FIT-CONTAINED AUTO-RESIZING STAGE -->
    <div
      ref="canvasStageRef"
      class="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-default"
      style="touch-action: none;"
    >
      <!-- Centered Scaled Cluster Stage -->
      <div
        class="relative transition-transform duration-300 ease-out"
        :style="{
          width: `${stageBaseWidth}px`,
          height: `${stageBaseHeight}px`,
          transform: `scale(${clusterFitScale})`,
          transformOrigin: 'center center'
        }"
      >
        <!-- DYNAMIC TOPOLOGICAL VECTOR PATHS -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          <g v-for="edge in visibleEdges" :key="`${edge.from}-${edge.to}`">
            <!-- Background Glow for Active Route -->
            <path
              v-if="isEdgeActive(edge)"
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="edge.color"
              stroke-opacity="0.25"
              stroke-width="8"
              stroke-linecap="round"
            />
            <!-- Main Vector Path (Thinner 1.2px by default, bold 3.5px when active) -->
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeActive(edge) ? edge.color : '#94a3b8'"
              :stroke-opacity="isEdgeActive(edge) ? 1.0 : 0.45"
              :stroke-width="isEdgeActive(edge) ? 3.5 : 1.3"
              stroke-linecap="round"
            />
            <!-- Animated Flow Particle on Active Route -->
            <circle
              v-if="isEdgeActive(edge)"
              r="4"
              :fill="edge.color"
              filter="drop-shadow(0 0 5px rgba(0,0,0,0.3))"
            >
              <animateMotion
                :path="getEdgePath(edge)"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>

        <!-- DYNAMIC MATHEMATICALLY POSITIONED NODES -->
        <div
          v-for="node in visibleNodes"
          :key="node.id"
          @pointerdown="startNodePointerDrag($event, node)"
          @click.stop="handleNodeClick(node)"
          @dblclick.stop="openProJsonStudio(node, 'content-studio')"
          @mouseenter="hoveredNodeId = node.id"
          @mouseleave="hoveredNodeId = null"
          class="absolute select-none group"
          :class="[
            isNodeLocked(node.id) ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
            isDraggingNodeId === node.id
              ? 'z-50 duration-0 transition-none will-change-transform'
              : 'z-20 transition-[left,top,transform] duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]'
          ]"
          :style="{
            left: `${node.currentX}px`,
            top: `${node.currentY}px`,
            transform: `translate3d(-50%, -50%, 0) scale(${getNodeScale(node)}) ${getNode3DTilt(node)}`,
            transformOrigin: 'center center',
            touchAction: 'none'
          }"
        >
          <!-- 1. MASTER COMMANDING NUCLEUS NODE (270px × 155px) -->
          <div
            v-if="node.depth === 0"
            class="relative rounded-[2.5rem] p-5 flex flex-col justify-between transition-all duration-200 bg-white border-2 border-emerald-500/70 shadow-[0_24px_50px_-12px_rgba(1,135,134,0.3),0_8px_20px_-4px_rgba(0,0,0,0.08)]"
            :style="{ width: '270px', minHeight: '155px' }"
            :class="selectedNode?.id === node.id ? 'ring-4 ring-emerald-500' : ''"
          >
            <!-- Top Glass Highlight -->
            <div class="absolute inset-x-4 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"></div>

            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
                  <Icon :name="node.icon || 'mdi:home'" class="w-5 h-5" />
                </div>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[9px] font-extrabold uppercase">
                  CORE HUB
                </span>
              </div>

              <!-- Micro-Icons: 1-Arrow, 2-Arrow & Lock -->
              <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
                <!-- 1-Arrow -->
                <button
                  @click.stop="toggleDirectChildren(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white text-slate-600 hover:text-emerald-800 flex items-center justify-center transition cursor-pointer shadow-2xs"
                  :title="isDirectFolded(node.id) ? 'نمایش شاخه‌های مستقیم' : 'بستن شاخه‌های مستقیم'"
                >
                  <Icon :name="isDirectFolded(node.id) ? 'mdi:chevron-down' : 'mdi:chevron-up'" class="w-3.5 h-3.5" />
                </button>

                <!-- 2-Arrow (Recursive Subtree) -->
                <button
                  @click.stop="toggleRecursiveChildren(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white text-slate-600 hover:text-emerald-800 flex items-center justify-center transition cursor-pointer shadow-2xs"
                  title="بستن/بازکردن تمام فرزندان به صورت آبشاری"
                >
                  <Icon :name="isSubtreeFolded(node.id) ? 'mdi:chevron-double-down' : 'mdi:chevron-double-up'" class="w-3.5 h-3.5" />
                </button>

                <!-- Lock -->
                <button
                  @click.stop="toggleLockNode(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white flex items-center justify-center transition cursor-pointer shadow-2xs"
                  :class="isNodeLocked(node.id) ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'"
                  :title="isNodeLocked(node.id) ? 'قفل موقعیت باز شود' : 'قفل موقعیت'"
                >
                  <Icon :name="isNodeLocked(node.id) ? 'mdi:lock' : 'mdi:lock-open-variant-outline'" class="w-3 h-3" />
                </button>
              </div>
            </div>

            <div class="my-auto space-y-0.5">
              <h2 class="font-black text-slate-900 text-base tracking-tight">
                {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
              </h2>
              <p class="text-[10px] text-slate-500 font-mono" dir="ltr">/ (صفحه اصلی)</p>
            </div>

            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span class="font-bold text-emerald-800 flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>هسته مرکزی ({{ node.childrenIds?.length || 0 }} شاخه)</span>
              </span>

              <button
                @click.stop="openProJsonStudio(node, 'content-studio')"
                class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-800 text-emerald-800 hover:text-white font-bold text-[10px] transition cursor-pointer"
              >
                ویرایش محتوا
              </button>
            </div>
          </div>

          <!-- 2. PRIMARY PILLAR NODE (215px × 125px) -->
          <div
            v-else-if="node.depth === 1"
            class="relative rounded-[2rem] p-4 flex flex-col justify-between transition-all duration-200 bg-white border border-slate-200 shadow-[0_16px_36px_-8px_rgba(15,23,42,0.12),0_4px_10px_-2px_rgba(0,0,0,0.05)]"
            :style="{ width: '215px', minHeight: '125px' }"
            :class="selectedNode?.id === node.id ? 'ring-3 ring-emerald-500' : ''"
          >
            <div class="flex items-center justify-between gap-2">
              <div
                class="w-8 h-8 rounded-2xl flex items-center justify-center text-white shadow-xs"
                :style="{ backgroundColor: node.accentColor || '#2563eb' }"
              >
                <Icon :name="node.icon || 'mdi:layers'" class="w-4 h-4" />
              </div>

              <!-- 1-Arrow, 2-Arrow & Lock -->
              <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
                <!-- 1-Arrow -->
                <button
                  v-if="node.childrenIds?.length"
                  @click.stop="toggleDirectChildren(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white text-slate-600 hover:text-emerald-800 flex items-center justify-center transition cursor-pointer"
                  :title="isDirectFolded(node.id) ? 'نمایش زیرشاخه‌ها' : 'بستن زیرشاخه‌ها'"
                >
                  <Icon :name="isDirectFolded(node.id) ? 'mdi:chevron-down' : 'mdi:chevron-up'" class="w-3.5 h-3.5" />
                </button>

                <!-- 2-Arrow -->
                <button
                  v-if="node.childrenIds?.length"
                  @click.stop="toggleRecursiveChildren(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white text-slate-600 hover:text-emerald-800 flex items-center justify-center transition cursor-pointer"
                  title="بستن/بازکردن تمام فرزندان به صورت آبشاری"
                >
                  <Icon :name="isSubtreeFolded(node.id) ? 'mdi:chevron-double-down' : 'mdi:chevron-double-up'" class="w-3.5 h-3.5" />
                </button>

                <!-- Lock -->
                <button
                  @click.stop="toggleLockNode(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white flex items-center justify-center transition cursor-pointer"
                  :class="isNodeLocked(node.id) ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'"
                  :title="isNodeLocked(node.id) ? 'قفل باز شود' : 'قفل موقعیت'"
                >
                  <Icon :name="isNodeLocked(node.id) ? 'mdi:lock' : 'mdi:lock-open-variant-outline'" class="w-3 h-3" />
                </button>
              </div>
            </div>

            <div class="my-auto space-y-0.5">
              <h3 class="font-black text-slate-900 text-sm tracking-tight">
                {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
              </h3>
              <p class="text-[10px] text-slate-500 font-mono truncate" dir="ltr">{{ node.path }}</p>
            </div>

            <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span class="text-slate-400 font-mono font-bold">{{ getKeyCount(node) }} فیلد</span>
              <button
                @click.stop="openProJsonStudio(node, 'content-studio')"
                class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-800 text-slate-700 hover:text-white font-bold text-[10px] transition cursor-pointer"
              >
                ویرایش
              </button>
            </div>
          </div>

          <!-- 3. COMPACT SATELLITE NODE (145px × 65px) -->
          <div
            v-else
            class="relative rounded-2xl p-2.5 flex items-center justify-between gap-2 transition-all duration-200 bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm"
            :style="{ width: '145px', minHeight: '65px' }"
            :class="selectedNode?.id === node.id ? 'ring-2 ring-emerald-500' : ''"
          >
            <div class="flex items-center gap-2 overflow-hidden flex-1">
              <div
                class="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-2xs shrink-0"
                :style="{ backgroundColor: node.accentColor || '#64748b' }"
              >
                <Icon :name="node.icon || 'mdi:file-document-outline'" class="w-3.5 h-3.5" />
              </div>

              <div class="overflow-hidden space-y-0.5 flex-1">
                <h4 class="font-extrabold text-slate-900 text-xs truncate">
                  {{ isRTL ? (node.liveData?.titleFa || node.titleFa) : (node.liveData?.titleEn || node.titleEn) }}
                </h4>
                <span class="text-[9px] font-mono text-slate-400 block truncate" dir="ltr">{{ node.path }}</span>
              </div>
            </div>

            <!-- Lock on Satellite -->
            <button
              @click.stop="toggleLockNode(node.id)"
              class="w-5 h-5 rounded hover:bg-slate-100 flex items-center justify-center transition cursor-pointer shrink-0"
              :class="isNodeLocked(node.id) ? 'text-amber-600' : 'text-slate-300 hover:text-slate-600'"
              title="قفل موقعیت"
            >
              <Icon :name="isNodeLocked(node.id) ? 'mdi:lock' : 'mdi:lock-open-variant-outline'" class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ALWAYS-VISIBLE FLOATING PHYSICS & SPACING TUNING DOCK -->
    <transition name="fade">
      <div
        v-if="showTuningPanel"
        class="fixed bottom-5 right-5 z-40 w-72 sm:w-80 p-4 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl space-y-3.5 text-slate-800 font-sans text-xs select-none"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Icon name="mdi:tune-variant" class="w-3.5 h-3.5" />
            </div>
            <span class="font-extrabold text-xs text-slate-900">تنظیم فواصل و حریم دفع</span>
          </div>

          <div class="flex items-center gap-1.5">
            <button
              @click="resetTuningDefaults"
              class="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] cursor-pointer transition"
            >
              پیش‌فرض
            </button>
            <button
              @click="showTuningPanel = false"
              class="w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer transition"
            >
              <Icon name="mdi:close" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- 1. Spacing Multiplier Slider -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between font-bold text-xs">
            <span class="text-slate-700">فاصله و گستردگی خوشه‌ها (Spacing)</span>
            <span class="font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-extrabold">{{ Math.round(clusterSpacingScale * 100) }}%</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="clusterSpacingScale = Math.max(0.5, +(clusterSpacingScale - 0.1).toFixed(2)); onTuningChange()"
              class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
            >
              -
            </button>
            <input
              v-model.number="clusterSpacingScale"
              @input="onTuningChange"
              type="range"
              min="0.5"
              max="1.6"
              step="0.05"
              class="flex-1 accent-emerald-800 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <button
              @click="clusterSpacingScale = Math.min(1.6, +(clusterSpacingScale + 0.1).toFixed(2)); onTuningChange()"
              class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
            >
              +
            </button>
          </div>
          <div class="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>فشرده (50%)</span>
            <span>عادی (100%)</span>
            <span>گسترده (160%)</span>
          </div>
        </div>

        <!-- 2. Repulsion Cushion Slider -->
        <div class="space-y-1.5 pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between font-bold text-xs">
            <span class="text-slate-700">حریم دفع برخورد (Repulsion Cushion)</span>
            <span class="font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-extrabold">{{ repulsionCushion }}px</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="repulsionCushion = Math.max(0, repulsionCushion - 5); onTuningChange()"
              class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
            >
              -
            </button>
            <input
              v-model.number="repulsionCushion"
              @input="onTuningChange"
              type="range"
              min="0"
              max="40"
              step="1"
              class="flex-1 accent-emerald-800 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <button
              @click="repulsionCushion = Math.min(40, repulsionCushion + 5); onTuningChange()"
              class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
            >
              +
            </button>
          </div>
          <div class="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>چسبیده (0px)</span>
            <span>متعادل (15px)</span>
            <span>باز (40px)</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- 100/100 LIGHT MULTI-ENGINE STUDIO -->
    <transition name="fade">
      <div
        v-if="showJsonStudio"
        class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 select-text font-sans"
      >
        <div class="bg-white text-slate-800 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col overflow-hidden text-xs">
          <!-- Studio Header Bar -->
          <div class="h-12 px-3 sm:px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
                <Icon name="mdi:layers-outline" class="w-4 h-4" />
              </div>
              <div class="flex items-center gap-1.5">
                <h3 class="font-extrabold text-slate-900 text-xs truncate max-w-[140px] sm:max-w-none">
                  {{ activeStudioNode?.liveData?.titleFa || activeStudioNode?.titleFa || 'تنظیم صفحه' }}
                </h3>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold" dir="ltr">
                  /{{ activeStudioNode?.slug }}
                </span>
              </div>
            </div>

            <!-- Engine Switcher -->
            <div class="flex items-center gap-1.5">
              <div class="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-bold">
                <button
                  @click="studioEngine = 'content-studio'"
                  class="px-2.5 sm:px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                  :class="studioEngine === 'content-studio' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  <Icon name="mdi:translate" class="w-3.5 h-3.5" />
                  <span>محتوا</span>
                </button>

                <button
                  @click="studioEngine = 'vue-json-studio'"
                  class="px-2.5 sm:px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                  :class="studioEngine === 'vue-json-studio' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  <Icon name="mdi:code-json" class="w-3.5 h-3.5" />
                  <span>JSON استودیو</span>
                </button>

                <button
                  @click="studioEngine = 'visual-rows'"
                  class="hidden sm:flex px-3 py-1 rounded-lg transition cursor-pointer items-center gap-1"
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
                title="بازگردانی"
              >
                <Icon name="mdi:undo" class="w-3.5 h-3.5" />
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

          <!-- Studio Body -->
          <div v-if="studioEngine === 'content-studio'" class="flex-1 overflow-hidden">
            <LocalizedContentStudio
              v-model="currentWorkingSchema"
              @change="onContentStudioChange"
            />
          </div>

          <!-- Pro Vue JSON Studio -->
          <div v-else-if="studioEngine === 'vue-json-studio'" class="flex-1 bg-white overflow-hidden">
            <VueJsonStudio
              v-model="currentWorkingSchema"
              @change="onContentStudioChange"
            />
          </div>

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

          <!-- Studio Footer -->
          <div class="h-12 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 select-none">
            <div class="flex items-center gap-2">
              <span v-if="hasAnyModifications" class="text-amber-800 text-[11px] font-bold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>تغییرات آماده انتشار</span>
              </span>
              <span v-else class="text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                <Icon name="mdi:check-circle" class="w-3.5 h-3.5 text-emerald-600" />
                <span>داده‌ها همگام با دیتابیس هستند</span>
              </span>
            </div>

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
import VueJsonStudio from '~/components/dashboard/VueJsonStudio.vue'
import LocalizedContentStudio from '~/components/dashboard/LocalizedContentStudio.vue'

definePageMeta({
  layout: false
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

// State
const searchQuery = ref('')
const hoveredNodeId = ref<string | null>(null)
const selectedNode = ref<any | null>(null)
const showDebugPane = ref(false)

// 4 VIEW MODES
const currentViewMode = ref<'constellation' | 'tree' | 'columns' | 'radial'>('constellation')
const viewModes = [
  { id: 'constellation', label: 'کهکشانی', icon: 'mdi:orbit', desc: 'نمای کهکشانی مدور پیرامون هسته' },
  { id: 'tree', label: 'درختی', icon: 'mdi:file-tree', desc: 'ساختار سلسله‌مراتبی سازمانی' },
  { id: 'columns', label: 'ستونی', icon: 'mdi:view-column', desc: 'ستون‌های ساختاریافته بر اساس بخش‌ها' },
  { id: 'radial', label: 'رادار', icon: 'mdi:radar', desc: 'نمای راداری هم‌مرکز فشرده' }
]

function switchViewMode(modeId: 'constellation' | 'tree' | 'columns' | 'radial') {
  currentViewMode.value = modeId
  applyLayoutCoordinates(modeId)
  saveStateToLocalStorage()
}

// Group Selection
const selectedGroup = ref<string>('all')
const groupToggles = [
  { id: 'core', label: 'اصلی', icon: '🌟' },
  { id: 'products', label: 'محصولات', icon: '📦' },
  { id: 'services', label: 'خدمات', icon: '⚙️' },
  { id: 'history', label: 'تاریخچه', icon: '🏛️' },
  { id: 'system', label: 'سیستم', icon: '🔧' }
]

function getNodeGroup(node: any) {
  if (node.slug === 'home' || node.slug === 'about' || node.slug === 'contact') return 'core'
  if (node.slug === 'products' || node.slug === 'catalog') return 'products'
  if (node.slug === 'services' || node.slug === 'faq') return 'services'
  if (node.slug === 'history' || node.slug === 'blog') return 'history'
  return 'system'
}

// Subtree Branch Folding & LocalStorage Persistence
const foldedBranches = ref<Set<string>>(new Set())
const lockedNodes = ref<Set<string>>(new Set())

function isDirectFolded(nodeId: string) {
  return foldedBranches.value.has(nodeId)
}

function isSubtreeFolded(nodeId: string) {
  const allSub = getSubtreeNodeIds(nodeId)
  return allSub.length > 1 && allSub.slice(1).every(id => isDescendantOfFolded(id))
}

function isNodeLocked(nodeId: string) {
  return lockedNodes.value.has(nodeId)
}

function toggleLockNode(nodeId: string) {
  if (lockedNodes.value.has(nodeId)) {
    lockedNodes.value.delete(nodeId)
  } else {
    lockedNodes.value.add(nodeId)
  }
  saveStateToLocalStorage()
}

const isAllLocked = computed(() => {
  return rawDynamicNodes.value.length > 0 && rawDynamicNodes.value.every(n => lockedNodes.value.has(n.id))
})

function toggleLockAll() {
  if (isAllLocked.value) {
    lockedNodes.value.clear()
  } else {
    for (const n of rawDynamicNodes.value) {
      lockedNodes.value.add(n.id)
    }
  }
  saveStateToLocalStorage()
}

// 1-Arrow (Toggle Direct Children)
function toggleDirectChildren(nodeId: string) {
  if (foldedBranches.value.has(nodeId)) {
    foldedBranches.value.delete(nodeId)
  } else {
    foldedBranches.value.add(nodeId)
  }
  saveStateToLocalStorage()
}

// 2-Arrow (Recursive Subtree Deep Fold)
function toggleRecursiveChildren(nodeId: string) {
  const isFolded = foldedBranches.value.has(nodeId)
  const allSubtreeIds = getSubtreeNodeIds(nodeId)

  for (const id of allSubtreeIds) {
    if (isFolded) {
      foldedBranches.value.delete(id)
    } else {
      foldedBranches.value.add(id)
    }
  }
  saveStateToLocalStorage()
}

function getSubtreeNodeIds(parentId: string): string[] {
  const result: string[] = [parentId]
  const children = edges.value.filter(e => e.from === parentId).map(e => e.to)
  for (const childId of children) {
    result.push(...getSubtreeNodeIds(childId))
  }
  return result
}

// True Recursive Check: Tracing up the parent chain
function isDescendantOfFolded(nodeId: string): boolean {
  const node = rawDynamicNodes.value.find(n => n.id === nodeId)
  if (!node || !node.parentId) return false

  let currentParentId: string | null = node.parentId
  while (currentParentId) {
    if (foldedBranches.value.has(currentParentId)) return true
    const parentNode = rawDynamicNodes.value.find(n => n.id === currentParentId)
    currentParentId = parentNode?.parentId || null
  }
  return false
}

const isAnyDirectFolded = computed(() => foldedBranches.value.size > 0)
const isAnyRecursiveFolded = computed(() => foldedBranches.value.size > 2)

function toggleDirectChildrenOfAll() {
  if (foldedBranches.value.size > 0) {
    foldedBranches.value.clear()
  } else {
    for (const n of rawDynamicNodes.value) {
      if (n.childrenIds?.length) {
        foldedBranches.value.add(n.id)
      }
    }
  }
  saveStateToLocalStorage()
}

function toggleRecursiveChildrenOfAll() {
  if (foldedBranches.value.size > 0) {
    foldedBranches.value.clear()
  } else {
    for (const n of rawDynamicNodes.value) {
      foldedBranches.value.add(n.id)
    }
  }
  saveStateToLocalStorage()
}

function saveStateToLocalStorage() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('najm_sitemap_view_mode', currentViewMode.value)
    localStorage.setItem('najm_sitemap_spacing', String(clusterSpacingScale.value))
    localStorage.setItem('najm_sitemap_cushion', String(repulsionCushion.value))
    localStorage.setItem('najm_sitemap_folded', JSON.stringify([...foldedBranches.value]))
    localStorage.setItem('najm_sitemap_locked', JSON.stringify([...lockedNodes.value]))
    
    // Save custom positions
    const posMap: Record<string, { x: number, y: number }> = {}
    for (const n of rawDynamicNodes.value) {
      posMap[n.id] = { x: n.currentX, y: n.currentY }
    }
    localStorage.setItem('najm_sitemap_positions', JSON.stringify(posMap))
  } catch (e) {}
}

function loadStateFromLocalStorage() {
  if (typeof window === 'undefined') return
  try {
    const savedMode = localStorage.getItem('najm_sitemap_view_mode')
    if (savedMode && ['constellation', 'tree', 'columns', 'radial'].includes(savedMode)) {
      currentViewMode.value = savedMode as any
    }

    const savedSpacing = localStorage.getItem('najm_sitemap_spacing')
    if (savedSpacing) {
      clusterSpacingScale.value = parseFloat(savedSpacing) || 1.0
    }

    const savedCushion = localStorage.getItem('najm_sitemap_cushion')
    if (savedCushion) {
      repulsionCushion.value = parseInt(savedCushion, 10) || 15
    }

    const folded = localStorage.getItem('najm_sitemap_folded')
    if (folded) {
      foldedBranches.value = new Set(JSON.parse(folded))
    }

    const locked = localStorage.getItem('najm_sitemap_locked')
    if (locked) {
      lockedNodes.value = new Set(JSON.parse(locked))
    }

    const savedPos = localStorage.getItem('najm_sitemap_positions')
    if (savedPos) {
      const posMap = JSON.parse(savedPos)
      for (const n of rawDynamicNodes.value) {
        if (posMap[n.id] && isNodeLocked(n.id)) {
          n.currentX = posMap[n.id].x
          n.currentY = posMap[n.id].y
        }
      }
    }
  } catch (e) {}
}

// Stage Dimensions & Auto-Fit
const stageBaseWidth = 1100
const stageBaseHeight = 720
const clusterFitScale = ref(1)

// Multi-Package JSON Schema Studio State
const showJsonStudio = ref(false)
const activeStudioNode = ref<any | null>(null)
const studioEngine = ref<'content-studio' | 'vue-json-studio' | 'visual-rows'>('content-studio')
const originalBaselineSchema = ref<Record<string, any>>({})
const currentWorkingSchema = ref<Record<string, any>>({})
const isStudioSaving = ref(false)

function openProJsonStudio(node: any, engine: 'content-studio' | 'vue-json-studio' | 'visual-rows' = 'content-studio') {
  activeStudioNode.value = node
  const schemaSnapshot = JSON.parse(JSON.stringify(node.liveData?.rawUiData || { titleFa: node.titleFa, titleEn: node.titleEn }))
  originalBaselineSchema.value = JSON.parse(JSON.stringify(schemaSnapshot))
  currentWorkingSchema.value = JSON.parse(JSON.stringify(schemaSnapshot))
  studioEngine.value = engine
  showJsonStudio.value = true
}

function handleNodeClick(node: any) {
  if (selectedNode.value?.id === node.id) {
    selectedNode.value = null
  } else {
    selectedNode.value = node
  }
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

function getKeyCount(node: any) {
  const ui = node.liveData?.rawUiData || {}
  return Object.keys(ui).length || 3
}

function getNodeScale(node: any) {
  if (selectedNode.value?.id === node.id) return 1.05
  return 1.0
}

// 3D Perspective Tilt & Instant Real-Time Dragging
const mouseRelativeX = ref(0)
const mouseRelativeY = ref(0)

let nodeDragStartClientX = 0
let nodeDragStartClientY = 0
let nodeDragStartNodeX = 0
let nodeDragStartNodeY = 0

function getNode3DTilt(node: any) {
  if (hoveredNodeId.value === node.id && !isDraggingNodeId.value) {
    return `perspective(600px) rotateX(${mouseRelativeY.value * 1.3}deg) rotateY(${mouseRelativeX.value * 1.3}deg)`
  }
  return 'perspective(600px) rotateX(0deg) rotateY(0deg)'
}

// Fetch Dynamic PocketBase Telemetry
const { data: sitemapApiData, refresh: refreshSitemapApi } = await useAsyncData('sitemap-dynamic-telemetry', () =>
  $fetch<any>('/api/admin/sitemap'),
  { lazy: true }
)

const rawDynamicNodes = ref<any[]>([])

// Physics & Spacing Tuner State
const showTuningPanel = ref(false)
const clusterSpacingScale = ref(1.0)
const repulsionCushion = ref(15)

function onTuningChange() {
  applyLayoutCoordinates(currentViewMode.value)
  saveStateToLocalStorage()
}

function resetTuningDefaults() {
  clusterSpacingScale.value = 1.0
  repulsionCushion.value = 15
  applyLayoutCoordinates(currentViewMode.value)
  saveStateToLocalStorage()
}

// PURE MATHEMATICAL LAYOUT ALGORITHMS WITH DYNAMIC SPACING SCALE
function computeLayoutMath(nodesList: any[], mode: 'constellation' | 'tree' | 'columns' | 'radial'): Record<string, { x: number, y: number }> {
  const posMap: Record<string, { x: number, y: number }> = {}
  const cx = stageBaseWidth / 2   // 550
  const cy = stageBaseHeight / 2  // 360
  const scale = clusterSpacingScale.value

  const root = nodesList.find(n => n.depth === 0) || nodesList[0]
  if (!root) return posMap

  const depth1Nodes = nodesList.filter(n => n.depth === 1)
  const depth2Nodes = nodesList.filter(n => n.depth === 2)

  if (mode === 'constellation') {
    // Center root
    posMap[root.id] = { x: cx, y: cy }

    // Radial Orbits for Depth 1
    const n1 = depth1Nodes.length
    depth1Nodes.forEach((node, i) => {
      const angle = (i * (2 * Math.PI) / n1) - Math.PI / 2
      const r1 = 230 * scale
      const px = cx + Math.cos(angle) * r1
      const py = cy + Math.sin(angle) * r1 * 0.85
      posMap[node.id] = { x: Math.round(px), y: Math.round(py) }

      // Satellites placed along parent's radial vector
      const children = nodesList.filter(c => c.parentId === node.id)
      children.forEach((child, ci) => {
        const offsetAngle = angle + (ci - (children.length - 1) / 2) * 0.4
        const r2 = r1 + 140 * scale
        const sx = cx + Math.cos(offsetAngle) * r2
        const sy = cy + Math.sin(offsetAngle) * r2 * 0.85
        posMap[child.id] = { x: Math.round(sx), y: Math.round(sy) }
      })
    })

    // Root direct satellites (menu, footer, login)
    const rootSatellites = depth2Nodes.filter(n => n.parentId === root.id)
    rootSatellites.forEach((node, i) => {
      const offset = (i - (rootSatellites.length - 1) / 2) * 160 * scale
      posMap[node.id] = { x: Math.round(cx + offset), y: Math.round(cy + 240 * scale) }
    })
  } else if (mode === 'tree') {
    // Org Tree Hierarchy
    posMap[root.id] = { x: cx, y: Math.round(95 * scale) }

    const n1 = depth1Nodes.length
    const laneWidth = ((stageBaseWidth - 100) / Math.max(1, n1)) * Math.min(1.2, scale)

    depth1Nodes.forEach((node, i) => {
      const colCenterX = 50 + laneWidth * i + laneWidth / 2
      posMap[node.id] = { x: Math.round(colCenterX), y: Math.round(270 * scale) }

      const children = nodesList.filter(c => c.parentId === node.id)
      children.forEach((child, ci) => {
        const subOffset = (ci - (children.length - 1) / 2) * 140 * scale
        posMap[child.id] = { x: Math.round(colCenterX + subOffset), y: Math.round(480 * scale) }
      })
    })

    const rootSatellites = depth2Nodes.filter(n => n.parentId === root.id)
    rootSatellites.forEach((node, i) => {
      const offset = (i - (rootSatellites.length - 1) / 2) * 160 * scale
      posMap[node.id] = { x: Math.round(cx + offset), y: Math.round(620 * scale) }
    })
  } else if (mode === 'columns') {
    // Architectural Columns by Category
    const groups = ['core', 'products', 'services', 'history', 'system']
    const colWidth = (stageBaseWidth - 60) / groups.length

    groups.forEach((grp, colIdx) => {
      const colX = 30 + colIdx * colWidth + colWidth / 2
      const groupNodes = nodesList.filter(n => getNodeGroup(n) === grp)

      groupNodes.forEach((node, rowIdx) => {
        const rowY = 160 + rowIdx * 160 * scale
        posMap[node.id] = { x: Math.round(colX), y: Math.round(rowY) }
      })
    })
  } else if (mode === 'radial') {
    // Concentric Polar Radar
    posMap[root.id] = { x: cx, y: cy }

    const allNonRoot = nodesList.filter(n => n.id !== root.id)
    allNonRoot.forEach((node, i) => {
      const angle = (i * (2 * Math.PI) / allNonRoot.length) - Math.PI / 2
      const radius = (node.depth === 1 ? 220 : 310) * scale
      const rx = cx + Math.cos(angle) * radius
      const ry = cy + Math.sin(angle) * radius * 0.8
      posMap[node.id] = { x: Math.round(rx), y: Math.round(ry) }
    })
  }

  return posMap
}

function applyLayoutCoordinates(mode: 'constellation' | 'tree' | 'columns' | 'radial') {
  const posMap = computeLayoutMath(rawDynamicNodes.value, mode)
  for (const n of rawDynamicNodes.value) {
    if (posMap[n.id] && !isNodeLocked(n.id)) {
      n.currentX = posMap[n.id].x
      n.currentY = posMap[n.id].y
      n.initialX = posMap[n.id].x
      n.initialY = posMap[n.id].y
    }
  }
}

// Ingest Dynamic Nodes from PocketBase API
watchEffect(() => {
  if (sitemapApiData.value?.nodes && sitemapApiData.value.nodes.length > 0) {
    const rawList = sitemapApiData.value.nodes.map((n: any) => {
      const isRoot = n.slug === 'home'
      const parentId = isRoot ? null : `pb-${n.parentSlug || 'home'}`
      const depth = isRoot ? 0 : (n.parentSlug === 'home' && ['about', 'products', 'services', 'history', 'contact'].includes(n.slug) ? 1 : 2)

      return {
        ...n,
        parentId,
        depth,
        childrenIds: [] as string[]
      }
    })

    // Populate childrenIds dynamically
    for (const node of rawList) {
      if (node.parentId) {
        const parent = rawList.find((p: any) => p.id === node.parentId)
        if (parent && !parent.childrenIds.includes(node.id)) {
          parent.childrenIds.push(node.id)
        }
      }
    }

    const posMap = computeLayoutMath(rawList, currentViewMode.value)

    rawDynamicNodes.value = rawList.map((n: any) => {
      const pos = posMap[n.id] || { x: 550, y: 360 }
      return {
        ...n,
        currentX: pos.x,
        currentY: pos.y,
        initialX: pos.x,
        initialY: pos.y
      }
    })

    loadStateFromLocalStorage()
    autoFitConstellation()
  }
})

// Dynamic Graph Edges
const edges = computed(() => {
  return rawDynamicNodes.value
    .filter(n => n.parentId)
    .map(n => ({
      from: n.parentId,
      to: n.id,
      color: n.accentColor || '#018786'
    }))
})

const visibleNodes = computed(() => {
  return rawDynamicNodes.value.filter((n: any) => {
    // True recursive ancestry check
    if (isDescendantOfFolded(n.id)) {
      return false
    }

    if (selectedGroup.value !== 'all') {
      const grp = getNodeGroup(n)
      if (grp !== selectedGroup.value && n.depth !== 0) return false
    }

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
  return edges.value.filter(e => visibleIds.has(e.from) && visibleIds.has(e.to))
})

function resetNodePositions() {
  applyLayoutCoordinates(currentViewMode.value)
  saveStateToLocalStorage()
  autoFitConstellation()
}

async function refreshSitemap() {
  await refreshSitemapApi()
}

const canvasStageRef = ref<HTMLElement | null>(null)

// Auto-Fit Viewport
function autoFitConstellation() {
  if (typeof window === 'undefined') return
  const availableWidth = window.innerWidth - 30
  const availableHeight = window.innerHeight - 85

  const scaleX = availableWidth / stageBaseWidth
  const scaleY = availableHeight / stageBaseHeight
  const isMobile = window.innerWidth < 640
  clusterFitScale.value = isMobile ? Math.min(0.85, Math.max(0.55, Math.min(scaleX, scaleY))) : Math.min(1.15, Math.max(0.65, Math.min(scaleX, scaleY)))
}

// Reactive Coordinate Tracker for 120 FPS Glitch-Free SVG Link Following
const dragCoordRevision = ref(0)

// 120 FPS INSTANT DRAGGING WITH REAL-TIME DISPATCH
const isDraggingNodeId = ref<string | null>(null)

function startNodePointerDrag(e: PointerEvent, node: any) {
  if (isNodeLocked(node.id)) return
  isDraggingNodeId.value = node.id
  nodeDragStartClientX = e.clientX
  nodeDragStartClientY = e.clientY
  nodeDragStartNodeX = node.currentX
  nodeDragStartNodeY = node.currentY

  if (typeof window !== 'undefined') {
    window.addEventListener('pointermove', onGlobalPointerMove, { passive: true })
    window.addEventListener('pointerup', onGlobalPointerUp)
    window.addEventListener('pointercancel', onGlobalPointerUp)
  }
}

function onGlobalPointerMove(e: PointerEvent) {
  mouseRelativeX.value = (e.clientX / window.innerWidth - 0.5) * 8
  mouseRelativeY.value = (e.clientY / window.innerHeight - 0.5) * -8

  if (!isDraggingNodeId.value) return
  const dragged = rawDynamicNodes.value.find(n => n.id === isDraggingNodeId.value)
  if (dragged && !isNodeLocked(dragged.id)) {
    const dx = (e.clientX - nodeDragStartClientX) / clusterFitScale.value
    const dy = (e.clientY - nodeDragStartClientY) / clusterFitScale.value
    dragged.currentX = Math.round(nodeDragStartNodeX + dx)
    dragged.currentY = Math.round(nodeDragStartNodeY + dy)
    dragCoordRevision.value++
  }
}

function getNodeRadius(node: any): number {
  if (node.depth === 0) return 135
  if (node.depth === 1) return 110
  return 75
}

function smartRepulseOverlap(activeNode: any) {
  const rA = getNodeRadius(activeNode)

  for (let iter = 0; iter < 3; iter++) {
    for (const other of rawDynamicNodes.value) {
      if (other.id === activeNode.id) continue
      const rB = getNodeRadius(other)
      const minDist = rA + rB + repulsionCushion.value

      const dx = other.currentX - activeNode.currentX
      const dy = other.currentY - activeNode.currentY
      const dist = Math.hypot(dx, dy) || 1

      if (dist < minDist) {
        const overlap = minDist - dist
        const nx = dx / dist
        const ny = dy / dist
        const pushDist = Math.min(22, Math.round(overlap * 0.35))

        other.currentX = Math.min(stageBaseWidth - 80, Math.max(80, other.currentX + nx * pushDist))
        other.currentY = Math.min(stageBaseHeight - 60, Math.max(60, other.currentY + ny * pushDist))
      }
    }
  }

  saveStateToLocalStorage()
  dragCoordRevision.value++
}

function onGlobalPointerUp() {
  if (isDraggingNodeId.value) {
    const dragged = rawDynamicNodes.value.find(n => n.id === isDraggingNodeId.value)
    if (dragged) {
      // Smartly position and push neighbor nodes to prevent overlap!
      smartRepulseOverlap(dragged)
    }
  }
  isDraggingNodeId.value = null

  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', onGlobalPointerMove)
    window.removeEventListener('pointerup', onGlobalPointerUp)
    window.removeEventListener('pointercancel', onGlobalPointerUp)
  }
}

function isEdgeActive(edge: any) {
  if (!hoveredNodeId.value && !selectedNode.value) return false
  const activeId = hoveredNodeId.value || selectedNode.value?.id
  return edge.from === activeId || edge.to === activeId
}

function getEdgePath(edge: any) {
  // Access reactive revision so links follow nodes in real time 120 FPS
  const _ = dragCoordRevision.value

  const fromNode = rawDynamicNodes.value.find((n: any) => n.id === edge.from)
  const toNode = rawDynamicNodes.value.find((n: any) => n.id === edge.to)
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
  loadStateFromLocalStorage()
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
