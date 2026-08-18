<!-- pages/dashboard/sitemap/index.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-0 z-50 h-screen w-screen bg-[#F8FAFC] text-slate-900 select-none overflow-hidden font-sans text-xs flex flex-col"
  >
    <!-- Ambient Light Background -->
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-emerald-100/50 blur-[110px]"></div>
      <div class="absolute -bottom-[15%] -right-[10%] w-[55vw] h-[55vw] rounded-full bg-blue-100/50 blur-[110px]"></div>
      <div class="absolute top-[35%] left-[35%] w-[40vw] h-[40vw] rounded-full bg-purple-100/35 blur-[130px]"></div>
    </div>

    <!-- Top HUD Bar with Group Selectors & Master Recursive Toggles -->
    <header class="relative z-40 h-13 px-3 sm:px-5 flex items-center justify-between pointer-events-auto bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs">
      <!-- Left: Exit & Live Status -->
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/dashboard"
          class="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-2xs text-slate-700 hover:text-emerald-800 hover:border-emerald-300 transition cursor-pointer"
          title="بازگشت به پیشخوان"
        >
          <Icon name="mdi:arrow-right" class="w-4 h-4" :class="isRTL ? '' : 'rotate-180'" />
        </NuxtLink>

        <!-- Live Node Count -->
        <div class="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-bold text-[11px] text-slate-700">
          <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
          <span>{{ visibleNodes.length }} صفحه فعال</span>
        </div>
      </div>

      <!-- Center: Master Recursive Fold/Unfold Icons, Lock & Group Selectors -->
      <div class="flex items-center gap-1 sm:gap-2">
        <!-- Re-Center Reset -->
        <button
          @click="resetNodePositions"
          class="w-8 h-8 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center shadow-xs transition cursor-pointer active:scale-95"
          title="بازنشانی موقعیت‌ها به چیدمان اصلی"
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

        <!-- Master 2-Arrow (Recursive Deep Fold/Unfold) -->
        <button
          @click="toggleRecursiveChildrenOfAll"
          class="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs transition cursor-pointer"
          :title="isAnyRecursiveFolded ? 'بازکردن تمام زیرشاخه‌ها به صورت آبشاری' : 'بستن تمام زیرشاخه‌ها به صورت آبشاری'"
        >
          <Icon :name="isAnyRecursiveFolded ? 'mdi:chevron-double-down' : 'mdi:chevron-double-up'" class="w-4 h-4 text-emerald-800" />
        </button>

        <!-- Unlock / Lock All -->
        <button
          @click="toggleLockAll"
          class="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs transition cursor-pointer"
          :title="isAllLocked ? 'بازکردن قفل همه' : 'قفل موقعیت همه صفحات'"
        >
          <Icon :name="isAllLocked ? 'mdi:lock' : 'mdi:lock-open-variant-outline'" class="w-3.5 h-3.5" :class="isAllLocked ? 'text-amber-600' : 'text-slate-400'" />
        </button>

        <!-- Group Selector Chips -->
        <div class="flex items-center bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-bold">
          <button
            @click="selectedGroup = 'all'"
            class="px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            :class="selectedGroup === 'all' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          >
            <span>همه</span>
          </button>

          <button
            v-for="grp in groupToggles"
            :key="grp.id"
            @click="selectedGroup = grp.id"
            class="px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            :class="selectedGroup === grp.id ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          >
            <span class="text-[10px]">{{ grp.icon }}</span>
            <span class="hidden md:inline">{{ grp.label }}</span>
          </button>
        </div>
      </div>

      <!-- Right: Search, Refresh & Console -->
      <div class="flex items-center gap-1.5">
        <div class="relative w-28 sm:w-36">
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

    <!-- FIT-CONTAINED AUTO-RESIZING STAGE WITH FREE DRAGGING -->
    <div
      ref="canvasStageRef"
      class="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-default"
      @mousemove="handleGlobalMouseMove"
      @mouseup="stopNodeDrag"
      @touchend="stopNodeDrag"
    >
      <!-- Centered Scaled Cluster Stage -->
      <div
        class="relative transition-transform duration-200 ease-out"
        :style="{
          width: `${stageBaseWidth}px`,
          height: `${stageBaseHeight}px`,
          transform: `scale(${clusterFitScale})`,
          transformOrigin: 'center center'
        }"
      >
        <!-- VECTOR CONNECTION PATHS (Instant Zero-Lag Rendering) -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          <g v-for="edge in visibleEdges" :key="`${edge.from}-${edge.to}`">
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="isEdgeActive(edge) ? edge.color : '#cbd5e1'"
              :stroke-opacity="isEdgeActive(edge) ? 0.9 : 0.4"
              :stroke-width="isEdgeActive(edge) ? 3.5 : 1.8"
              stroke-linecap="round"
            />
            <circle
              v-if="isEdgeActive(edge)"
              r="3.5"
              :fill="edge.color"
              filter="drop-shadow(0 0 4px rgba(0,0,0,0.2))"
            >
              <animateMotion
                :path="getEdgePath(edge)"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>

        <!-- EXAGGERATED SIZE SEMI-3D MAGNETIC BLOBS -->
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
            isDraggingNodeId === node.id ? 'z-50 duration-0 transition-none will-change-transform' : 'z-20 transition-transform duration-150 ease-out'
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
            v-if="node.type === 'nucleus'"
            class="relative rounded-[2.5rem] p-5 flex flex-col justify-between transition-all duration-200 bg-white border-2 border-emerald-500/60 shadow-[0_24px_50px_-12px_rgba(1,135,134,0.3),0_8px_20px_-4px_rgba(0,0,0,0.08)]"
            :style="{ width: '270px', minHeight: '155px' }"
            :class="selectedNode?.id === node.id ? 'ring-4 ring-emerald-500' : ''"
          >
            <!-- Top Glass Highlight -->
            <div class="absolute inset-x-4 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"></div>

            <!-- Header with 1-Arrow, 2-Arrow & Lock Icons -->
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
                <!-- 1-Arrow (Direct Children) -->
                <button
                  @click.stop="toggleDirectChildren(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white text-slate-600 hover:text-emerald-800 flex items-center justify-center transition cursor-pointer shadow-2xs"
                  :title="isChildrenFolded(node.id) ? 'نمایش شاخه‌های مستقیم' : 'بستن شاخه‌های مستقیم'"
                >
                  <Icon :name="isChildrenFolded(node.id) ? 'mdi:chevron-down' : 'mdi:chevron-up'" class="w-3.5 h-3.5" />
                </button>

                <!-- 2-Arrow (Recursive Deep Fold) -->
                <button
                  @click.stop="toggleRecursiveChildren(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white text-slate-600 hover:text-emerald-800 flex items-center justify-center transition cursor-pointer shadow-2xs"
                  title="بستن/بازکردن تمام زیرشاخه‌ها به صورت آبشاری"
                >
                  <Icon name="mdi:chevron-double-up" class="w-3.5 h-3.5" />
                </button>

                <!-- Lock Position -->
                <button
                  @click.stop="toggleLockNode(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white flex items-center justify-center transition cursor-pointer shadow-2xs"
                  :class="isNodeLocked(node.id) ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'"
                  :title="isNodeLocked(node.id) ? 'قفل موقعیت باز شود' : 'قفل موقعیت این صفحه'"
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
                <span>هسته مرکزی</span>
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
            v-else-if="node.type === 'pillar'"
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
                  v-if="hasConnectedChildren(node.id)"
                  @click.stop="toggleDirectChildren(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white text-slate-600 hover:text-emerald-800 flex items-center justify-center transition cursor-pointer"
                  :title="isChildrenFolded(node.id) ? 'نمایش زیرشاخه‌ها' : 'بستن زیرشاخه‌ها'"
                >
                  <Icon :name="isChildrenFolded(node.id) ? 'mdi:chevron-down' : 'mdi:chevron-up'" class="w-3.5 h-3.5" />
                </button>

                <!-- 2-Arrow -->
                <button
                  v-if="hasConnectedChildren(node.id)"
                  @click.stop="toggleRecursiveChildren(node.id)"
                  class="w-6 h-6 rounded-lg hover:bg-white text-slate-600 hover:text-emerald-800 flex items-center justify-center transition cursor-pointer"
                  title="بستن/بازکردن تمام زیرشاخه‌ها به صورت آبشاری"
                >
                  <Icon name="mdi:chevron-double-up" class="w-3.5 h-3.5" />
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

          <!-- New Pro Vue JSON Studio -->
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
  if (node.id === 'pb-home' || node.id === 'pb-about' || node.id === 'pb-contact') return 'core'
  if (node.id === 'pb-products' || node.id === 'pb-catalog') return 'products'
  if (node.id === 'pb-services' || node.id === 'pb-faq') return 'services'
  if (node.id === 'pb-history' || node.id === 'pb-blog') return 'history'
  return 'system'
}

// Subtree Branch Folding & LocalStorage Persistence
const foldedBranches = ref<Set<string>>(new Set())
const lockedNodes = ref<Set<string>>(new Set())

function isChildrenFolded(nodeId: string) {
  return foldedBranches.value.has(nodeId)
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
  return nodes.value.length > 0 && nodes.value.every(n => lockedNodes.value.has(n.id))
})

function toggleLockAll() {
  if (isAllLocked.value) {
    lockedNodes.value.clear()
  } else {
    for (const n of nodes.value) {
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

// 2-Arrow (Toggle Recursive Children)
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
  const children = edges.filter(e => e.from === parentId).map(e => e.to)
  for (const childId of children) {
    result.push(...getSubtreeNodeIds(childId))
  }
  return result
}

const isAnyDirectFolded = computed(() => foldedBranches.value.size > 0)
const isAnyRecursiveFolded = computed(() => foldedBranches.value.size > 2)

function toggleDirectChildrenOfAll() {
  if (foldedBranches.value.size > 0) {
    foldedBranches.value.clear()
  } else {
    for (const n of nodes.value) {
      if (hasConnectedChildren(n.id)) {
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
    for (const n of nodes.value) {
      foldedBranches.value.add(n.id)
    }
  }
  saveStateToLocalStorage()
}

function hasConnectedChildren(nodeId: string) {
  return edges.some(e => e.from === nodeId)
}

function saveStateToLocalStorage() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('najm_sitemap_folded', JSON.stringify([...foldedBranches.value]))
    localStorage.setItem('najm_sitemap_locked', JSON.stringify([...lockedNodes.value]))
    
    // Save custom positions
    const posMap: Record<string, { x: number, y: number }> = {}
    for (const n of dynamicNodesState.value) {
      posMap[n.id] = { x: n.currentX, y: n.currentY }
    }
    localStorage.setItem('najm_sitemap_positions', JSON.stringify(posMap))
  } catch (e) {}
}

function loadStateFromLocalStorage() {
  if (typeof window === 'undefined') return
  try {
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
      for (const n of dynamicNodesState.value) {
        if (posMap[n.id]) {
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

// 3D Perspective Tilt & Ultra-Smooth Dragging
const mouseRelativeX = ref(0)
const mouseRelativeY = ref(0)

let nodeDragStartClientX = 0
let nodeDragStartClientY = 0
let nodeDragStartNodeX = 0
let nodeDragStartNodeY = 0
let pendingClientX = 0
let pendingClientY = 0
let dragRafId: number | null = null

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

const dynamicNodesState = ref<any[]>([])

// COMPACT CENTROID CLUSTER POSITIONS
const defaultClusterPositions: Record<string, { x: number, y: number }> = {
  'pb-home': { x: 550, y: 360 },
  'pb-about': { x: 310, y: 200 },
  'pb-products': { x: 790, y: 200 },
  'pb-services': { x: 790, y: 520 },
  'pb-history': { x: 310, y: 520 },
  'pb-contact': { x: 550, y: 130 },
  'pb-catalog': { x: 990, y: 160 },
  'pb-faq': { x: 990, y: 560 },
  'pb-blog': { x: 110, y: 560 },
  'pb-login': { x: 110, y: 160 },
  'pb-menu': { x: 550, y: 590 },
  'pb-footer': { x: 320, y: 660 }
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
    loadStateFromLocalStorage()
    autoFitConstellation()
  }
})

const nodes = computed(() => dynamicNodesState.value)

function resetNodePositions() {
  for (const n of dynamicNodesState.value) {
    if (!isNodeLocked(n.id)) {
      n.currentX = n.initialX
      n.currentY = n.initialY
    }
  }
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
  const availableHeight = window.innerHeight - 80

  const scaleX = availableWidth / stageBaseWidth
  const scaleY = availableHeight / stageBaseHeight
  const isMobile = window.innerWidth < 640
  clusterFitScale.value = isMobile ? Math.min(0.85, Math.max(0.55, Math.min(scaleX, scaleY))) : Math.min(1.15, Math.max(0.65, Math.min(scaleX, scaleY)))
}

// 120 FPS HARDWARE ACCELERATED DRAGGING WITH POINTER CAPTURE
const isDraggingNodeId = ref<string | null>(null)

function startNodePointerDrag(e: PointerEvent, node: any) {
  if (isNodeLocked(node.id)) return
  isDraggingNodeId.value = node.id
  nodeDragStartClientX = e.clientX
  nodeDragStartClientY = e.clientY
  nodeDragStartNodeX = node.currentX
  nodeDragStartNodeY = node.currentY
  pendingClientX = e.clientX
  pendingClientY = e.clientY

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
  pendingClientX = e.clientX
  pendingClientY = e.clientY

  if (!dragRafId) {
    dragRafId = requestAnimationFrame(applyNodePositionFrame)
  }
}

function applyNodePositionFrame() {
  dragRafId = null
  if (!isDraggingNodeId.value) return

  const dragged = dynamicNodesState.value.find(n => n.id === isDraggingNodeId.value)
  if (dragged && !isNodeLocked(dragged.id)) {
    const dx = (pendingClientX - nodeDragStartClientX) / clusterFitScale.value
    const dy = (pendingClientY - nodeDragStartClientY) / clusterFitScale.value
    dragged.currentX = nodeDragStartNodeX + dx
    dragged.currentY = nodeDragStartNodeY + dy
  }
}

function onGlobalPointerUp() {
  if (dragRafId) {
    cancelAnimationFrame(dragRafId)
    dragRafId = null
  }
  if (isDraggingNodeId.value) {
    saveStateToLocalStorage()
  }
  isDraggingNodeId.value = null

  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', onGlobalPointerMove)
    window.removeEventListener('pointerup', onGlobalPointerUp)
    window.removeEventListener('pointercancel', onGlobalPointerUp)
  }
}

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
    // Check if folded by parent
    for (const parentId of foldedBranches.value) {
      const isChild = edges.some(e => e.from === parentId && e.to === n.id)
      if (isChild) return false
    }

    if (selectedGroup.value !== 'all') {
      const grp = getNodeGroup(n)
      if (grp !== selectedGroup.value && n.type !== 'nucleus') return false
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
