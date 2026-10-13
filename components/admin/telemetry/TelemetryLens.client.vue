<!-- components/admin/telemetry/TelemetryLens.client.vue -->
<template>
  <div v-if="isOpen" class="telemetry-lens-container font-sans" dir="ltr">
    <!-- ============================================================= -->
    <!-- 1. Full-Page Visual Heatmap Layer (Taps, Scroll & Hesitation)  -->
    <!-- ============================================================= -->
    <div
      v-if="heatmapMode !== 'OFF'"
      class="absolute top-0 left-0 w-full pointer-events-none z-[99994] overflow-visible select-none"
      :style="{ height: `${documentTotalHeight}px` }"
    >
      <!-- A. Full-Page Translucent Scroll Heatmap Gradient Curtain -->
      <div
        v-if="['ALL', 'SCROLL'].includes(heatmapMode)"
        class="absolute inset-0 w-full pointer-events-none opacity-20 transition-opacity duration-300"
        :style="{ background: fullPageScrollGradient }"
      />

      <!-- B. Scroll Attention Hotspot & Milestone Banners (Where People Stopped) -->
      <template v-if="['ALL', 'SCROLL'].includes(heatmapMode)">
        <!-- Most Dwelled Hotspot Banner -->
        <div
          v-if="maxDwellSec >= 1.5"
          class="absolute left-6 right-6 flex items-center gap-3 pointer-events-none transition-all duration-300"
          :style="{ top: `${mostDwelledPixelY}px` }"
        >
          <div class="h-0.5 flex-1 bg-gradient-to-r from-transparent via-rose-500 to-rose-400 shadow-[0_0_10px_#f43f5e]" />
          <div class="px-3.5 py-1.5 rounded-full bg-zinc-950/95 border border-rose-500 text-rose-200 text-xs font-mono shadow-2xl flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span class="font-bold text-white">🔥 کانون بیشترین مکث و مطالعه</span>
            <span class="text-rose-300 font-sans text-[11px]">• {{ maxDwellSec.toFixed(1) }} ثانیه مکث</span>
          </div>
          <div class="h-0.5 flex-1 bg-gradient-to-r from-rose-400 via-rose-500 to-transparent shadow-[0_0_10px_#f43f5e]" />
        </div>

        <!-- 50% Mid-Page Fold Milestone -->
        <div
          class="absolute left-8 right-8 flex items-center gap-3 pointer-events-none opacity-70"
          :style="{ top: `${Math.round(documentTotalHeight * 0.5)}px` }"
        >
          <div class="h-px flex-1 border-t border-dashed border-amber-400/50" />
          <span class="px-2 py-0.5 rounded bg-zinc-950/90 border border-amber-400/30 text-amber-300 text-[10px] font-mono">
            50% Scroll Depth • میانگین عبور بازدیدکنندگان
          </span>
          <div class="h-px flex-1 border-t border-dashed border-amber-400/50" />
        </div>
      </template>

      <!-- C. Visual Tap Heatmap Glowing Halos -->
      <template v-if="['ALL', 'TAPS'].includes(heatmapMode)">
        <div
          v-for="(tap, tIdx) in calculatedTapPoints"
          :key="tIdx"
          class="absolute pointer-events-auto group cursor-crosshair transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 hover:scale-125"
          :style="{
            left: `${tap.x}px`,
            top: `${tap.y}px`
          }"
          @click.stop="selectedTap = (selectedTap === tap ? null : tap)"
        >
          <!-- Radiant Outer Heat Flare (Hotjar / Clarity Glow) -->
          <div
            class="rounded-full blur-xs pointer-events-none transition-all duration-300"
            :style="{
              width: `${Math.min(96, 44 + tap.count * 8)}px`,
              height: `${Math.min(96, 44 + tap.count * 8)}px`,
              marginLeft: `-${Math.min(48, 22 + tap.count * 4)}px`,
              marginTop: `-${Math.min(48, 22 + tap.count * 4)}px`,
              background: getHeatGradient(tap.count)
            }"
          />
          <!-- Core Precision Center Pin -->
          <div class="absolute inset-0 w-3.5 h-3.5 m-auto rounded-full bg-white shadow-[0_0_10px_#ffffff] border-2 border-rose-600 flex items-center justify-center pointer-events-none">
            <span v-if="tap.count > 1" class="text-[8px] font-bold text-rose-600 font-mono">
              {{ tap.count }}
            </span>
          </div>

          <!-- Tap Point Hover/Tap Tooltip (With generous clearance) -->
          <div
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1.5 rounded-xl bg-zinc-950/98 text-zinc-100 text-[10px] font-mono whitespace-nowrap shadow-2xl border border-white/20 z-50"
            :class="(selectedTap === tap) ? 'block' : 'hidden group-hover:block'"
          >
            <div class="flex items-center gap-1.5 font-bold text-rose-400">
              <span>#{{ tap.targetId }}</span>
              <span class="text-zinc-500">•</span>
              <span class="text-white">{{ tap.count }} taps</span>
            </div>
            <div class="text-[9px] text-zinc-400 font-sans mt-0.5 text-right" dir="rtl">
              {{ tap.label }}
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- ============================================================= -->
    <!-- 2. Right-Edge Minimalist Scroll Rail & Touch-Friendly Hit Area -->
    <!-- ============================================================= -->
    <div
      class="fixed top-0 right-0 w-[5px] sm:w-[3px] hover:w-[8px] active:w-[12px] h-full z-[99998] transition-all duration-200 cursor-pointer group select-none touch-none"
      :style="{ background: scrollHeatmapGradient }"
      @mousemove="handleRailHover"
      @touchstart.passive="handleRailTouch"
      @touchmove.passive="handleRailTouch"
      @mouseleave="railTooltip.visible = false"
      @touchend="railTooltip.visible = false"
      @click="handleRailClick"
    >
      <!-- Viewport Depth Indicator -->
      <div
        class="absolute right-0 w-2.5 h-3.5 -mr-[3px] rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] border border-zinc-950 pointer-events-none transition-all duration-75"
        :style="{ top: `${currentScrollPercent}%` }"
      />

      <!-- Floating Rail Depth Tooltip -->
      <div
        v-if="railTooltip.visible"
        class="absolute right-4 px-2.5 py-1 rounded-md bg-zinc-950/95 text-zinc-200 border border-white/10 text-[10px] font-mono shadow-xl pointer-events-none whitespace-nowrap transition-transform duration-75"
        :style="{ top: `${railTooltip.y}px`, transform: 'translateY(-50%)' }"
      >
        <span class="text-emerald-400 font-bold">{{ railTooltip.percent }}% عمق</span>
        <span class="text-zinc-500 mx-1">•</span>
        <span>{{ railTooltip.dwell.toFixed(1) }}s مکث</span>
      </div>
    </div>

    <!-- Floating Scroll Attention Tier Guide (Mobile-Collapsible so it never covers content) -->
    <div
      v-if="['ALL', 'SCROLL'].includes(heatmapMode)"
      class="fixed top-16 right-3 sm:top-20 sm:right-4 z-[99996] select-none"
    >
      <!-- Mobile Mini Toggle Chip -->
      <button
        v-if="!showMobileScrollGuide"
        type="button"
        @click="showMobileScrollGuide = true"
        class="sm:hidden px-2.5 py-1 rounded-full bg-zinc-950/95 border border-white/20 text-[10px] text-zinc-300 font-mono shadow-xl flex items-center gap-1 cursor-pointer active:scale-95"
      >
        <span>📜</span>
        <span>زون‌ها</span>
        <span class="text-rose-400 font-bold">({{ scrollTiers.length }})</span>
      </button>

      <!-- Full Tier Card (Desktop permanent, Mobile collapsible) -->
      <div
        v-if="showMobileScrollGuide || !isMobile"
        class="w-44 p-2.5 rounded-2xl bg-zinc-950/95 border border-white/10 shadow-2xl backdrop-blur-xl text-[10px] font-mono text-zinc-300 space-y-1.5"
      >
        <div class="flex items-center justify-between border-b border-white/10 pb-1.5 text-[9px] font-bold text-zinc-400">
          <span class="flex items-center gap-1 text-rose-400">
            <span>📜</span>
            <span>SCROLL ATTENTION</span>
          </span>
          <button
            v-if="isMobile"
            type="button"
            @click="showMobileScrollGuide = false"
            class="text-zinc-400 hover:text-white p-0.5 text-xs sm:hidden"
          >
            ✕
          </button>
          <span v-else class="text-zinc-500">Live Dwell</span>
        </div>

        <div
          v-for="(tier, idx) in scrollTiers"
          :key="idx"
          class="p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between gap-2"
          @click="scrollToPercent(tier.pct)"
        >
          <div class="flex items-center gap-1.5 truncate">
            <span class="w-1.5 h-3 rounded-full shrink-0" :style="{ background: tier.color }" />
            <span class="truncate text-[9px]">{{ tier.label }}</span>
          </div>
          <span class="font-bold shrink-0 text-[10px]" :style="{ color: tier.color }">
            {{ tier.dwell.toFixed(1) }}s
          </span>
        </div>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- 3. Interactive Element Inspector Overlay (Anti-Occlusion & Clearance) -->
    <!-- ============================================================= -->
    <div v-if="isInspectorActive && hoveredElementRect" class="fixed inset-0 pointer-events-none z-[99997]">
      <!-- Clean Spotlight Frame (Hardware-synced, NO CSS transition lag on scroll/move) -->
      <div
        class="fixed pointer-events-none"
        :style="{
          left: `${hoveredElementRect.left - 2}px`,
          top: `${hoveredElementRect.top - 2}px`,
          width: `${hoveredElementRect.width + 4}px`,
          height: `${hoveredElementRect.height + 4}px`,
          borderRadius: `${elementBorderRadius}px`
        }"
        style="outline: 2px solid #10b981; outline-offset: 1px; background: rgba(16, 185, 129, 0.08); box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);"
      />

      <!-- Precision Inspector HUD Card (Never covers element, generous 16px space) -->
      <div
        class="fixed z-[100000] pointer-events-auto select-none transition-all duration-100"
        :style="{
          left: `${clampedCardPos.x}px`,
          top: `${clampedCardPos.y}px`
        }"
      >
        <div class="w-72 sm:w-80 p-3 rounded-2xl bg-zinc-950/98 border border-emerald-500/50 text-zinc-100 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl space-y-2.5 font-sans text-xs relative">
          <!-- Directional Arrow/Beacon pointing towards element -->
          <div
            v-if="clampedCardPos.placement === 'below'"
            class="absolute -top-1.5 left-8 w-3 h-3 bg-zinc-950 border-t border-l border-emerald-500/50 transform rotate-45 pointer-events-none"
          />
          <div
            v-else-if="clampedCardPos.placement === 'above'"
            class="absolute -bottom-1.5 left-8 w-3 h-3 bg-zinc-950 border-b border-r border-emerald-500/50 transform rotate-45 pointer-events-none"
          />

          <!-- Target Header -->
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <div class="flex items-center gap-1.5 truncate">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span class="font-bold text-white font-mono text-xs truncate">#{{ inspectedTargetId }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-[9px] text-zinc-400 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 shrink-0 font-mono">
                {{ inspectedContext }} • &lt;{{ hoveredElementTag }}&gt;
              </span>
              <button
                type="button"
                @click="dismissInspectorCard"
                class="w-5 h-5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                title="بستن پنجره بازرس"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Persian Semantic Label & Specs -->
          <div class="text-right py-0.5" dir="rtl">
            <div class="text-xs font-semibold text-emerald-300 truncate">
              {{ inspectedLabel }}
            </div>
            <div class="text-[10px] text-zinc-400 flex items-center justify-between mt-0.5 font-mono" dir="ltr">
              <span>{{ hoveredDimensions }}</span>
              <span class="text-zinc-500 uppercase text-[9px] font-sans px-1 py-0.2 rounded bg-white/5">
                {{ inspectedCategory }}
              </span>
            </div>
          </div>

          <!-- Micro-Metrics Grid (When events exist) -->
          <div v-if="hasInteractions" class="grid grid-cols-3 gap-1.5 text-center font-mono">
            <div class="p-1.5 rounded-lg bg-white/5 border border-white/5">
              <span class="block text-[9px] text-zinc-400 uppercase">Taps</span>
              <span class="text-sm font-bold text-emerald-400">{{ activeElementSummary.tap_count }}</span>
            </div>
            <div class="p-1.5 rounded-lg bg-white/5 border border-white/5">
              <span class="block text-[9px] text-zinc-400 uppercase">Avg Dwell</span>
              <span class="text-sm font-bold text-amber-300">
                {{ activeElementSummary.avg_dwell_ms > 0 ? (activeElementSummary.avg_dwell_ms / 1000).toFixed(1) + 's' : '0s' }}
              </span>
            </div>
            <div class="p-1.5 rounded-lg bg-white/5 border border-white/5">
              <span class="block text-[9px] text-zinc-400 uppercase">Friction</span>
              <span
                class="text-sm font-bold"
                :class="activeElementSummary.errors > 0 ? 'text-rose-400' : activeElementSummary.hesitations > 0 ? 'text-amber-400' : 'text-zinc-500'"
              >
                {{ activeElementSummary.errors > 0 ? `❌ ${activeElementSummary.errors}` : activeElementSummary.hesitations > 0 ? `⚠️ ${activeElementSummary.hesitations}` : '0' }}
              </span>
            </div>
          </div>

          <!-- Clean Telemetry Readiness Banner (When 0 events recorded yet) -->
          <div v-else class="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-right space-y-0.5" dir="rtl">
            <div class="flex items-center justify-between text-[11px] font-medium text-emerald-300">
              <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>آماده رهگیری هوشمند</span>
              </span>
              <span class="text-[9px] font-mono text-emerald-400/70" dir="ltr">0 events</span>
            </div>
            <div class="text-[10px] text-zinc-400 leading-tight">
              برای ثبت رویداد، روی المان کلیک یا تعامل کنید.
            </div>
          </div>

          <!-- Target Tap Coordinate Radar Map -->
          <div v-if="activeElementTaps.length > 0" class="space-y-1">
            <div class="flex items-center justify-between text-[9px] text-zinc-400 font-mono">
              <span>TAP HEATMAP DISTRIBUTION</span>
              <span>{{ activeElementTaps.length }} samples</span>
            </div>
            <div class="relative w-full h-8 rounded-md bg-zinc-900 border border-white/10 overflow-hidden">
              <div
                v-for="(tap, idx) in activeElementTaps"
                :key="idx"
                class="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] opacity-80"
                :style="{ left: `${tap.rx * 100}%`, top: `${tap.ry * 100}%` }"
              />
            </div>
          </div>

          <!-- Inspector Footer & Action Button -->
          <div class="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-400 font-mono">
            <span>[I] بازرسی • [H] هیت‌مپ</span>
            <button
              v-if="activeHoveredElement"
              type="button"
              @click="executeActiveElementAction"
              class="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-sans text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>اجرا / کلیک</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- 4. Minimal Floating Command Capsule (Collapsed Mode)          -->
    <!-- ============================================================= -->
    <div
      v-if="isDrawerCollapsed"
      class="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-[100002] flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-zinc-950/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl text-xs font-mono select-none max-w-[calc(100vw-16px)] overflow-x-auto no-scrollbar"
    >
      <div class="flex items-center gap-1.5 pr-1 shrink-0">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
        <span class="font-bold text-white tracking-wider text-[10px] sm:text-[11px] hidden xs:inline">LENS</span>
      </div>

      <div class="h-3 w-px bg-white/15 shrink-0 hidden xs:block" />

      <!-- Inspector Mode Toggle Button -->
      <button
        type="button"
        @click="toggleInspector"
        class="px-2 py-1 sm:py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 min-h-[36px] sm:min-h-0"
        :class="isInspectorActive ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-800 text-zinc-400 hover:text-white'"
      >
        <span>🎯</span>
        <span class="hidden sm:inline">Inspect {{ isInspectorActive ? 'ON' : 'OFF' }}</span>
        <span class="sm:hidden">{{ isInspectorActive ? 'بازرسی' : 'خاموش' }}</span>
      </button>

      <!-- Heatmap Mode Switcher Button (ALL / TAPS / SCROLL / OFF) -->
      <button
        type="button"
        @click="cycleHeatmapMode"
        class="px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 min-h-[36px] sm:min-h-0"
        :class="heatmapMode !== 'OFF' ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)]' : 'bg-zinc-800 text-zinc-400 hover:text-white'"
        title="Toggle Full Visual Heatmaps (Key: H)"
      >
        <span>🔥</span>
        <span class="hidden sm:inline">Heatmap: {{ heatmapMode }}</span>
        <span class="sm:hidden">{{ heatmapMode }}</span>
      </button>

      <!-- Heatmap Timeframe Quick Picker -->
      <div v-if="heatmapMode !== 'OFF'" class="flex items-center gap-0.5 bg-zinc-900/80 px-1 py-0.5 rounded-full border border-white/5 shrink-0">
        <button
          v-for="tf in ['all', '5m', '15m', '60m'] as const"
          :key="tf"
          type="button"
          @click="heatmapTimeframe = tf"
          class="px-1.5 py-0.5 rounded-full text-[9px] font-mono transition-colors cursor-pointer"
          :class="heatmapTimeframe === tf ? 'bg-rose-500/80 text-white font-bold' : 'text-zinc-400 hover:text-white'"
          :title="tf === 'all' ? 'All session time' : `Last ${tf}`"
        >
          {{ tf }}
        </button>
      </div>

      <!-- Scope Indicator in Capsule -->
      <button
        type="button"
        @click="isDrawerCollapsed = false; activeDrawerTab = 'USERS'"
        class="px-2 py-1 sm:py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 border"
        :class="selectedSessionId === 'all' ? 'bg-zinc-800 text-zinc-300 border-white/10' : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'"
        :title="`Current Scope: ${selectedSessionId}`"
      >
        <span>👤</span>
        <span class="max-w-[70px] truncate">{{ selectedSessionId === 'all' ? 'همه کاربران' : selectedSessionId === 'me' ? 'من' : selectedSessionId.slice(0, 8) }}</span>
      </button>

      <!-- Expand Drawer Button -->
      <button
        type="button"
        @click="isDrawerCollapsed = false"
        class="px-2 py-1 sm:py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] flex items-center gap-1 transition-colors cursor-pointer shrink-0 min-h-[36px] sm:min-h-0"
      >
        <span>📜</span>
        <span>لاگ ({{ filteredLogs.length }})</span>
        <span class="text-zinc-500">▲</span>
      </button>

      <!-- Close HUD -->
      <button
        type="button"
        @click="isOpen = false"
        class="w-6 h-6 rounded-full bg-white/5 hover:bg-rose-950 text-zinc-400 hover:text-rose-300 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-0.5"
        title="بستن HUD (Ctrl+Shift+Z)"
      >
        ✕
      </button>
    </div>

    <!-- ============================================================= -->
    <!-- 5. The Flight Recorder (Docked Monospace Command Center)      -->
    <!-- ============================================================= -->
    <div
      v-else
      class="fixed bottom-0 left-0 right-0 z-[100001] bg-zinc-950/98 text-zinc-300 border-t border-emerald-500/30 backdrop-blur-2xl shadow-2xl transition-all duration-200 flex flex-col font-mono pb-[calc(env(safe-area-inset-bottom,0px)+8px)]"
      :style="{ height: isMobile ? (isDrawerExpanded ? '85vh' : '55vh') : (isDrawerExpanded ? '460px' : '240px') }"
    >
      <!-- Mobile Drag Handle -->
      <div class="w-10 h-1 rounded-full bg-zinc-700 mx-auto my-1.5 shrink-0 sm:hidden cursor-pointer" @click="isDrawerExpanded = !isDrawerExpanded" />

      <!-- Command Bar Header -->
      <div class="px-3 py-1.5 bg-zinc-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-1.5 text-xs select-none">
        <div class="flex items-center gap-2 truncate">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981] shrink-0" />
          <span class="font-bold tracking-wider text-emerald-400 text-[11px] hidden sm:inline">NAJM LENS</span>
          <span class="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-white/5 truncate max-w-[150px] sm:max-w-[220px]" dir="ltr">
            {{ activeUrl }}
          </span>
          <span class="text-[10px] text-zinc-500 hidden md:inline">
            ({{ logs.length }} events)
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Inspector Mode Button in Drawer Header -->
          <button
            type="button"
            @click="toggleInspector"
            class="px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            :class="isInspectorActive ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'"
          >
            <span>🎯</span>
            <span class="hidden sm:inline">Inspect {{ isInspectorActive ? 'ON' : 'OFF' }}</span>
          </button>

          <!-- Heatmap Mode Pills in Drawer Header -->
          <div class="flex items-center gap-0.5 text-[10px]">
            <button
              v-for="mode in ['OFF', 'ALL', 'TAPS', 'SCROLL'] as const"
              :key="mode"
              type="button"
              @click="heatmapMode = mode"
              class="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold border transition-colors cursor-pointer"
              :class="heatmapMode === mode && mode !== 'OFF' ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : heatmapMode === mode ? 'bg-zinc-700 text-white border-white/20' : 'bg-zinc-800 text-zinc-400 border-white/10 hover:text-white'"
            >
              {{ mode === 'ALL' ? '🔥' : mode === 'TAPS' ? '👆' : mode === 'SCROLL' ? '📜' : 'OFF' }}
            </button>
          </div>

          <!-- Scope Filter: ALL vs PAGE -->
          <button
            type="button"
            @click="scopeMode = scopeMode === 'ALL' ? 'PAGE' : 'ALL'"
            class="px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer"
            :class="scopeMode === 'ALL' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 border-white/10'"
          >
            {{ scopeMode }}
          </button>

          <!-- Refresh Button -->
          <button
            type="button"
            @click="fetchLensData"
            class="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 transition-colors cursor-pointer"
            :class="{ 'animate-spin': isRefreshing }"
            title="Refresh Live Analytics"
          >
            ↻
          </button>

          <!-- Height Toggle -->
          <button
            type="button"
            @click="isDrawerExpanded = !isDrawerExpanded"
            class="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 cursor-pointer hidden sm:block"
          >
            {{ isDrawerExpanded ? '▼' : '▲' }}
          </button>

          <!-- Minimize to Capsule -->
          <button
            type="button"
            @click="isDrawerCollapsed = true"
            class="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 cursor-pointer"
            title="Minimize to Floating Capsule"
          >
            ━
          </button>

          <!-- Close -->
          <button
            type="button"
            @click="isOpen = false"
            class="px-2 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 text-[10px] text-rose-300 border border-rose-500/30 cursor-pointer"
            title="Close HUD (Ctrl+Shift+Z)"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Drawer Navigation Tabs (LOGS vs USERS / SESSIONS) & Scope Controls -->
      <div class="px-3 py-1 bg-zinc-950/90 border-b border-white/5 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
        <!-- Tabs -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            @click="activeDrawerTab = 'LOGS'"
            class="px-2.5 py-0.5 rounded-full font-bold transition-colors cursor-pointer flex items-center gap-1"
            :class="activeDrawerTab === 'LOGS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-zinc-400 hover:text-zinc-200'"
          >
            <span>📜</span>
            <span>رویدادها / Events ({{ filteredLogs.length }})</span>
          </button>

          <button
            type="button"
            @click="activeDrawerTab = 'USERS'"
            class="px-2.5 py-0.5 rounded-full font-bold transition-colors cursor-pointer flex items-center gap-1"
            :class="activeDrawerTab === 'USERS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-zinc-400 hover:text-zinc-200'"
          >
            <span>👥</span>
            <span>کاربران / Sessions ({{ sessions.length }})</span>
          </button>
        </div>

        <!-- Scope & Timeframe Selectors -->
        <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <!-- Session Scope Picker Dropdown -->
          <div class="flex items-center gap-1 bg-zinc-900 border border-white/10 px-1.5 py-0.5 rounded text-[10px]">
            <span class="text-zinc-500">Scope:</span>
            <select
              v-model="selectedSessionId"
              class="bg-transparent text-cyan-300 font-mono text-[10px] focus:outline-none cursor-pointer max-w-[120px] truncate"
              @change="fetchLensData"
            >
              <option value="all" class="bg-zinc-900 text-zinc-200">🌐 All Users (همه)</option>
              <option value="me" class="bg-zinc-900 text-emerald-300">👤 Just Me (سشن فعلی)</option>
              <option
                v-for="s in sessions.filter(s => s.session_id !== mySessionId)"
                :key="s.session_id"
                :value="s.session_id"
                class="bg-zinc-900 text-zinc-300"
              >
                {{ s.device_type === 'mobile' ? '📱' : '💻' }} {{ s.session_id.slice(0, 10) }} ({{ s.event_count }} ev)
              </option>
            </select>
          </div>

          <!-- Heatmap Timeframe Window Picker -->
          <div class="flex items-center gap-0.5 bg-zinc-900 border border-white/10 px-1 py-0.5 rounded text-[10px]">
            <span class="text-zinc-500 hidden sm:inline">Time:</span>
            <button
              v-for="tf in ['all', '5m', '15m', '60m'] as const"
              :key="tf"
              type="button"
              @click="heatmapTimeframe = tf; fetchLensData()"
              class="px-1 py-0.2 rounded text-[9px] font-mono transition-colors cursor-pointer"
              :class="heatmapTimeframe === tf ? 'bg-rose-500 text-white font-bold' : 'text-zinc-400 hover:text-white'"
            >
              {{ tf }}
            </button>
          </div>
        </div>
      </div>

      <!-- Category Filter Bar (Only shown on LOGS tab) -->
      <div v-if="activeDrawerTab === 'LOGS'" class="px-3 py-1 bg-zinc-950/70 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
        <button
          v-for="cat in ['ALL', 'INTERACTIONS', 'PACKAGING', 'ERRORS']"
          :key="cat"
          type="button"
          @click="activeFilter = cat"
          class="px-2 py-0.5 rounded-full shrink-0 transition-colors cursor-pointer text-[10px]"
          :class="activeFilter === cat ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-zinc-400 hover:text-zinc-200'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Tab 1: Live Stream Table Body -->
      <div v-if="activeDrawerTab === 'LOGS'" class="flex-1 overflow-y-auto p-2 text-[11px] leading-relaxed select-text">
        <div v-if="filteredLogs.length === 0" class="h-full flex flex-col items-center justify-center text-zinc-500 space-y-1">
          <p>No telemetry events matching current scope.</p>
          <p class="text-[10px] text-zinc-600">Interact with page or switch scope to "All Users".</p>
        </div>

        <div v-else class="space-y-1">
          <div
            v-for="log in filteredLogs"
            :key="log.id"
            class="px-2.5 py-1.5 rounded-md border border-white/5 hover:bg-white/5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-3 cursor-pointer group"
            :class="getLogRowClass(log.event_name)"
            @mouseenter="spotlightLogTarget(log)"
            @click="handleLogClick(log)"
          >
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-zinc-500 text-[10px]">{{ formatTime(log.timestamp) }}</span>
              <span
                class="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider"
                :class="getLevelBadgeClass(log.event_name)"
              >
                {{ getLogLevel(log.event_name) }}
              </span>
              <span class="font-bold" :class="getEventColorClass(log.event_name)">{{ log.event_name }}</span>
            </div>

            <div class="flex items-center gap-2 truncate text-zinc-400 text-[10px] w-full sm:w-auto">
              <span
                v-if="log.session_id"
                class="text-zinc-500 font-mono text-[9px] px-1 py-0.2 rounded bg-zinc-900 border border-white/5 shrink-0"
                :class="{ 'text-emerald-400 font-bold': log.session_id === mySessionId }"
                :title="log.session_id"
              >
                {{ log.session_id === mySessionId ? 'YOU' : log.session_id.slice(0, 8) }}
              </span>
              <span
                v-if="log.properties?.target_id || log.properties?.component_id"
                class="text-emerald-300 font-semibold px-1 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/20 shrink-0"
              >
                #{{ log.properties.target_id || log.properties.component_id }}
              </span>
              <span class="truncate">
                {{ formatPropertiesSummary(log.properties) }}
              </span>
            </div>

            <div class="shrink-0 text-[10px] text-zinc-500 group-hover:text-zinc-300 flex items-center justify-between sm:justify-end w-full sm:w-auto">
              <span class="text-[9px] text-zinc-600 hidden sm:inline">{{ log.url }}</span>
              <span class="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">Locate ↗</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Users & Sessions Browser Body -->
      <div v-else class="flex-1 overflow-y-auto p-2 text-[11px] leading-relaxed select-text space-y-2">
        <div v-if="sessions.length === 0" class="h-full flex flex-col items-center justify-center text-zinc-500 space-y-1">
          <p>No user sessions recorded yet.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div
            v-for="s in sessions"
            :key="s.session_id"
            class="p-2.5 rounded-lg border transition-all cursor-pointer bg-zinc-900/60 hover:bg-zinc-800/80 flex flex-col justify-between gap-2"
            :class="selectedSessionId === s.session_id || (selectedSessionId === 'me' && s.session_id === mySessionId) ? 'border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.2)] bg-cyan-950/20' : 'border-white/5'"
            @click="selectedSessionId = (selectedSessionId === s.session_id ? 'all' : s.session_id); fetchLensData()"
          >
            <!-- Session Card Header -->
            <div class="flex items-center justify-between gap-1.5">
              <div class="flex items-center gap-1.5 truncate">
                <span class="text-sm">{{ s.device_type === 'mobile' ? '📱' : s.device_type === 'tablet' ? '📟' : '💻' }}</span>
                <span class="font-mono font-bold text-xs text-zinc-100 truncate" :title="s.session_id">
                  {{ s.session_id === mySessionId ? '👤 شما (You)' : s.session_id.slice(0, 14) }}
                </span>
              </div>
              <span
                class="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase"
                :class="s.device_type === 'mobile' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' : 'bg-blue-950/60 text-blue-300 border border-blue-500/30'"
              >
                {{ s.device_type }}
              </span>
            </div>

            <!-- Session Metrics Pills -->
            <div class="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
              <div class="p-1 rounded bg-zinc-950/80 border border-white/5">
                <div class="text-zinc-500 text-[9px]">EVENTS</div>
                <div class="text-emerald-400 font-bold">{{ s.event_count }}</div>
              </div>
              <div class="p-1 rounded bg-zinc-950/80 border border-white/5">
                <div class="text-zinc-500 text-[9px]">TAPS</div>
                <div class="text-rose-400 font-bold">{{ s.tap_count }}</div>
              </div>
              <div class="p-1 rounded bg-zinc-950/80 border border-white/5">
                <div class="text-zinc-500 text-[9px]">TIME</div>
                <div class="text-zinc-200">{{ s.duration_sec }}s</div>
              </div>
            </div>

            <!-- Session Visited Pages & Referrer -->
            <div class="text-[10px] text-zinc-400 space-y-0.5 truncate">
              <div v-if="s.referrer" class="truncate text-zinc-500">
                <span class="text-zinc-600">Ref:</span> {{ s.referrer.replace(/^https?:\/\//, '') }}
              </div>
              <div class="flex items-center gap-1 overflow-hidden">
                <span class="text-zinc-600 shrink-0">Pages ({{ s.page_count }}):</span>
                <span v-for="p in s.pages.slice(0, 3)" :key="p" class="px-1 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[9px] truncate">
                  {{ p }}
                </span>
                <span v-if="s.pages.length > 3" class="text-zinc-600 text-[9px]">+{{ s.pages.length - 3 }}</span>
              </div>
            </div>

            <!-- Scope Action Button -->
            <div class="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px]">
              <span class="text-zinc-500 font-mono text-[9px]">{{ formatTime(s.last_seen) }}</span>
              <button
                type="button"
                class="px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer"
                :class="selectedSessionId === s.session_id ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-cyan-300 hover:bg-zinc-700'"
              >
                {{ selectedSessionId === s.session_id ? '✓ Scoped to this User' : 'Filter Heatmap & Logs ↗' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Floating Trigger Pill (Visible when HUD is closed) -->
  <div
    v-if="!isOpen"
    class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[99999] flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-950/95 border border-emerald-500/60 shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl text-xs font-mono text-zinc-200 cursor-pointer active:scale-95 transition-all select-none hover:border-emerald-400 hover:shadow-emerald-500/20"
    @click="isOpen = true"
    title="Open Telemetry Lens HUD"
  >
    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
    <span class="font-bold text-white tracking-wider text-[11px]">⚡ Lens</span>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import type { StoredAnalyticsEvent, ElementMetricSummary, TelemetryLensResponse, SessionSummary } from '~/types/telemetry'
import { resolveElementIdentity, scanAndTagPage } from '~/utils/telemetrySemanticResolver'
import { getTelemetrySessionId } from '~/composables/useTracker'

const route = useRoute()
const isOpen = ref(false)
const isDrawerCollapsed = ref(true) // Defaults to clean floating capsule to prevent screen takeover
const isDrawerExpanded = ref(false)
const isRefreshing = ref(false)
const isInspectorActive = ref(true) // Interactive element inspector mode
const heatmapMode = ref<'OFF' | 'ALL' | 'TAPS' | 'SCROLL'>('OFF') // Full-page visual heatmap mode
const scopeMode = ref<'PAGE' | 'ALL'>('ALL')
const activeFilter = ref<'ALL' | 'INTERACTIONS' | 'PACKAGING' | 'ERRORS'>('ALL')
const selectedTap = ref<any | null>(null)
const showMobileScrollGuide = ref(false)

// Drawer Tabs & Observation Scoping
const activeDrawerTab = ref<'LOGS' | 'USERS'>('LOGS')
const sessions = ref<SessionSummary[]>([])
const selectedSessionId = ref<string>('all') // 'all' | 'me' | specific session ID
const heatmapTimeframe = ref<'all' | '5m' | '15m' | '60m'>('all')
const activeSessionDetail = ref<SessionSummary | null>(null)
const mySessionId = ref<string>('')

const logs = ref<StoredAnalyticsEvent[]>([])
const metrics = ref<Record<string, ElementMetricSummary>>({})
const scrollBins = ref<number[]>(new Array(20).fill(0))

const activeUrl = computed(() => route.fullPath)
const currentScrollPercent = ref(0)
const documentTotalHeight = ref(2000)

/* -------------------------------------------------------------
 * Full-Page Heatmap Logic & Tap Coordinate Projector
 * ------------------------------------------------------------- */
function cycleHeatmapMode() {
  const modes: Array<'OFF' | 'ALL' | 'TAPS' | 'SCROLL'> = ['OFF', 'ALL', 'TAPS', 'SCROLL']
  const nextIdx = (modes.indexOf(heatmapMode.value) + 1) % modes.length
  heatmapMode.value = modes[nextIdx]
}

function updateDocumentHeight() {
  if (typeof document === 'undefined') return
  documentTotalHeight.value = Math.max(
    document.body?.scrollHeight || 0,
    document.documentElement?.scrollHeight || 0,
    document.body?.offsetHeight || 0,
    document.documentElement?.offsetHeight || 0,
    1200
  )
}

function getHeatGradient(count: number): string {
  if (count >= 5) {
    return 'radial-gradient(circle, rgba(239, 68, 68, 0.95) 0%, rgba(245, 158, 11, 0.75) 40%, rgba(16, 185, 129, 0.4) 70%, transparent 85%)'
  }
  if (count >= 2) {
    return 'radial-gradient(circle, rgba(245, 158, 11, 0.9) 0%, rgba(16, 185, 129, 0.6) 45%, rgba(6, 182, 212, 0.3) 70%, transparent 85%)'
  }
  return 'radial-gradient(circle, rgba(16, 185, 129, 0.85) 0%, rgba(6, 182, 212, 0.5) 45%, transparent 80%)'
}

// Cache DOM queries for tap projection to eliminate repeated querySelector & layout reflows
const elementRectCache = new Map<string, { rect: DOMRect; timestamp: number }>()

function getCachedElementRect(targetId: string): DOMRect | null {
  const cached = elementRectCache.get(targetId)
  if (cached && Date.now() - cached.timestamp < 3500) {
    return cached.rect
  }
  const el = document.querySelector(`[data-track="${CSS.escape(targetId)}"]`) as HTMLElement | null
  if (!el) return null
  const rect = el.getBoundingClientRect()
  elementRectCache.set(targetId, { rect, timestamp: Date.now() })
  return rect
}

// Projection of all recorded tap points onto document coordinates (cached & clustered)
const calculatedTapPoints = computed(() => {
  if (typeof document === 'undefined' || !['ALL', 'TAPS'].includes(heatmapMode.value)) return []
  const clusterMap = new Map<string, { x: number; y: number; targetId: string; label: string; count: number }>()

  let tapLogs = logs.value.filter((l) => l.event_name === 'tap_heat')

  // Apply User / Session Scope Filter
  if (selectedSessionId.value === 'me' && mySessionId.value) {
    tapLogs = tapLogs.filter((l) => l.session_id === mySessionId.value)
  } else if (selectedSessionId.value !== 'all' && selectedSessionId.value !== 'me') {
    tapLogs = tapLogs.filter((l) => l.session_id === selectedSessionId.value)
  }

  // Apply Timeframe Window Filter
  if (heatmapTimeframe.value !== 'all') {
    const mins = heatmapTimeframe.value === '5m' ? 5 : heatmapTimeframe.value === '15m' ? 15 : 60
    const cutoff = Date.now() - mins * 60 * 1000
    tapLogs = tapLogs.filter((l) => new Date(l.timestamp).getTime() >= cutoff)
  }

  for (const log of tapLogs) {
    const props = log.properties || {}
    let x = 0
    let y = 0
    const targetId = props.target_id || 'tap'

    if (typeof props.page_x === 'number' && typeof props.page_y === 'number' && props.page_x > 0 && props.page_y > 0) {
      x = props.page_x
      y = props.page_y
    } else {
      const rect = getCachedElementRect(targetId)
      if (rect) {
        const rx = typeof props.rx === 'number' ? props.rx : 0.5
        const ry = typeof props.ry === 'number' ? props.ry : 0.5
        x = Math.round(rect.left + (window.scrollX || window.pageXOffset || 0) + rx * rect.width)
        y = Math.round(rect.top + (window.scrollY || window.pageYOffset || 0) + ry * rect.height)
      }
    }

    if (x > 0 && y > 0) {
      // Cluster nearby taps within 28px
      const clusterKey = `${Math.round(x / 28) * 28}_${Math.round(y / 28) * 28}`
      if (clusterMap.has(clusterKey)) {
        clusterMap.get(clusterKey)!.count++
      } else {
        clusterMap.set(clusterKey, {
          x,
          y,
          targetId,
          label: props.label || targetId,
          count: 1
        })
      }
    }
  }

  return Array.from(clusterMap.values())
})

// Scroll Attention Tiers and Most Dwelled Pixel Y
const maxDwellSec = computed(() => {
  return Math.max(0, ...scrollBins.value)
})

const mostDwelledBinIndex = computed(() => {
  const max = maxDwellSec.value
  if (max <= 0) return 0
  return scrollBins.value.indexOf(max)
})

const mostDwelledPixelY = computed(() => {
  const bin = mostDwelledBinIndex.value
  const pct = (bin / 20) + 0.025
  return Math.round(pct * documentTotalHeight.value)
})

const scrollTiers = computed(() => {
  const bins = scrollBins.value
  const tierNames = [
    'بالای صفحه (Fold)',
    'مشخصات جعبه و بسته‌بندی',
    'استعلام و محاسبه آنلاین',
    'گالری و محصولات',
    'پایین صفحه و فوتر'
  ]
  const colors = ['#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#64748b']

  return tierNames.map((name, idx) => {
    const startBin = idx * 4
    const tierDwell = (bins[startBin] || 0) + (bins[startBin + 1] || 0) + (bins[startBin + 2] || 0) + (bins[startBin + 3] || 0)
    return {
      label: name,
      pct: (idx * 20) + 10,
      dwell: tierDwell,
      color: tierDwell > 8 ? '#f43f5e' : tierDwell > 3 ? '#f59e0b' : tierDwell > 0.5 ? '#10b981' : '#64748b'
    }
  })
})

function scrollToPercent(pct: number) {
  if (typeof window === 'undefined') return
  const viewHeight = window.innerHeight || 800
  const maxScroll = Math.max(1, documentTotalHeight.value - viewHeight)
  window.scrollTo({ top: (pct / 100) * maxScroll, behavior: 'smooth' })
}

const fullPageScrollGradient = computed(() => {
  const bins = scrollBins.value
  const maxVal = Math.max(1, ...bins)

  const colorStops = bins.map((val, idx) => {
    const ratio = Math.min(1, val / maxVal)
    const pct = idx * 5
    const nextPct = (idx + 1) * 5

    let color = 'rgba(15, 23, 42, 0.1)'
    if (ratio > 0.65) {
      color = 'rgba(244, 63, 94, 0.45)'
    } else if (ratio > 0.3) {
      color = 'rgba(245, 158, 11, 0.35)'
    } else if (ratio > 0.05) {
      color = 'rgba(16, 185, 129, 0.25)'
    }

    return `${color} ${pct}%, ${color} ${nextPct}%`
  })

  return `linear-gradient(to bottom, ${colorStops.join(', ')})`
})

/* -------------------------------------------------------------
 * Inspector State & Smooth Hardware Clamping
 * ------------------------------------------------------------- */
let activeHoveredElement: HTMLElement | null = null
const inspectedTargetId = ref('')
const inspectedLabel = ref('')
const inspectedCategory = ref('')
const inspectedContext = ref('')
const hoveredElementTag = ref('')
const hoveredDimensions = ref('')
const elementBorderRadius = ref(8)
const hoveredElementRect = ref<{ left: number; top: number; width: number; height: number } | null>(null)

const activeElementSummary = computed<ElementMetricSummary>(() => {
  const id = inspectedTargetId.value
  return (
    metrics.value[id] || {
      target_id: id,
      tap_count: 0,
      avg_dwell_ms: 0,
      hesitations: 0,
      errors: 0,
      last_interaction: ''
    }
  )
})

const hasInteractions = computed(() => {
  const s = activeElementSummary.value
  return s.tap_count > 0 || s.avg_dwell_ms > 0 || s.hesitations > 0 || s.errors > 0
})

const activeElementTaps = computed(() => {
  const id = inspectedTargetId.value
  if (!id) return []
  return logs.value
    .filter((l) => l.event_name === 'tap_heat' && (l.properties?.target_id === id || l.properties?.component_id === id))
    .map((l) => ({ rx: l.properties.rx || 0.5, ry: l.properties.ry || 0.5 }))
    .slice(0, 20)
})

function toggleInspector() {
  isInspectorActive.value = !isInspectorActive.value
  if (!isInspectorActive.value) {
    hoveredElementRect.value = null
    activeHoveredElement = null
  }
}

function dismissInspectorCard() {
  hoveredElementRect.value = null
  activeHoveredElement = null
}

function executeActiveElementAction() {
  if (!activeHoveredElement) return
  const el = activeHoveredElement
  hoveredElementRect.value = null
  activeHoveredElement = null

  if (el.tagName === 'A' && (el as HTMLAnchorElement).href) {
    window.location.href = (el as HTMLAnchorElement).href
  } else {
    el.click()
  }
}

const isMobile = ref(false)
function checkMobile() {
  if (typeof window === 'undefined') return
  isMobile.value = window.innerWidth < 640
}

// Precision card placement strictly bounded inside viewport margins,
// guaranteed NEVER to cover the element it belongs to with >= 16px clearance gap.
const clampedCardPos = computed(() => {
  if (typeof window === 'undefined' || !hoveredElementRect.value) {
    return { x: 0, y: 0, placement: 'below' }
  }
  const rect = hoveredElementRect.value
  const cardW = isMobile.value ? Math.min(window.innerWidth - 32, 320) : 310
  const cardH = 250 // actual card height with metrics/labels
  const gap = 16 // strict 16px clearance gap - NEVER touches or covers the element!
  const margin = 16

  // Candidate 1: Below the element
  const canFitBelow = rect.bottom + gap + cardH <= window.innerHeight - margin

  // Candidate 2: Above the element
  const canFitAbove = rect.top - gap - cardH >= margin

  let placement: 'below' | 'above' | 'right' | 'left' = 'below'
  let posX = rect.left
  let posY = rect.bottom + gap

  if (canFitBelow) {
    // Fits below with generous 16px gap
    placement = 'below'
    posY = rect.bottom + gap
    posX = Math.max(margin, Math.min(window.innerWidth - cardW - margin, rect.left))
  } else if (canFitAbove) {
    // Fits above with generous 16px gap
    placement = 'above'
    posY = rect.top - gap - cardH
    posX = Math.max(margin, Math.min(window.innerWidth - cardW - margin, rect.left))
  } else {
    // Middle of viewport: try lateral placement (Right or Left)
    const canFitRight = rect.right + gap + cardW <= window.innerWidth - margin
    const canFitLeft = rect.left - gap - cardW >= margin

    if (canFitRight) {
      placement = 'right'
      posX = rect.right + gap
      posY = Math.max(margin, Math.min(window.innerHeight - cardH - margin, rect.top))
    } else if (canFitLeft) {
      placement = 'left'
      posX = rect.left - gap - cardW
      posY = Math.max(margin, Math.min(window.innerHeight - cardH - margin, rect.top))
    } else {
      // Fallback for very tight viewports: place on opposite vertical side from element
      if (rect.top > window.innerHeight / 2) {
        placement = 'above'
        posY = margin
      } else {
        placement = 'below'
        posY = window.innerHeight - cardH - margin
      }
      posX = Math.max(margin, Math.min(window.innerWidth - cardW - margin, rect.left))
    }
  }

  return { x: Math.round(posX), y: Math.round(posY), placement }
})

function spotlightInteractiveElement(interactive: HTMLElement) {
  activeHoveredElement = interactive
  const identity = resolveElementIdentity(interactive)

  inspectedTargetId.value = identity.id
  inspectedLabel.value = identity.label
  inspectedCategory.value = identity.category
  inspectedContext.value = identity.parentContext || 'Page'
  hoveredElementTag.value = interactive.tagName.toLowerCase()

  if (!interactive.hasAttribute('data-track')) {
    interactive.setAttribute('data-track', identity.id)
    interactive.setAttribute('data-telemetry-label', identity.label)
    interactive.setAttribute('data-telemetry-cat', identity.category)
  }

  const rect = interactive.getBoundingClientRect()
  hoveredElementRect.value = {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  }
  hoveredDimensions.value = `${Math.round(rect.width)} × ${Math.round(rect.height)} px`

  try {
    const cs = window.getComputedStyle(interactive)
    const br = parseFloat(cs.borderRadius) || 8
    elementBorderRadius.value = Math.max(6, Math.min(24, br))
  } catch {
    elementBorderRadius.value = 8
  }

  // Mobile auto-scroll clearance: if element is near the bottom, scroll slightly so both element and card are 100% visible
  if (typeof window !== 'undefined' && window.innerWidth < 640) {
    if (rect.bottom > window.innerHeight - 260) {
      window.scrollBy({ top: rect.bottom - (window.innerHeight - 280), behavior: 'smooth' })
    }
  }
}

// RAF-throttled hover processor: runs at most once per display frame (< 0.2% CPU)
let mouseRaf: number | null = null
let pendingMouseEvent: MouseEvent | null = null

function processHover(e: MouseEvent) {
  const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
  if (!target) {
    hoveredElementRect.value = null
    activeHoveredElement = null
    return
  }

  if (target.closest('.telemetry-lens-container') || target.closest('.admin-floating-dock')) {
    return
  }

  const interactive = target.closest(
    '[data-track], button, a, input, select, textarea, [role="button"], [data-cta-primary], [v-editable]'
  ) as HTMLElement | null

  if (interactive) {
    spotlightInteractiveElement(interactive)
  } else {
    hoveredElementRect.value = null
    activeHoveredElement = null
  }
}

// Mobile "Tap-to-Inspect" Click Interceptor
function onInspectClickCapture(e: MouseEvent | TouchEvent) {
  if (!isOpen.value || !isInspectorActive.value) return

  const target = (e.target as HTMLElement | null)
  if (!target) return

  if (target.closest('.telemetry-lens-container') || target.closest('.admin-floating-dock')) {
    return
  }

  const interactive = target.closest(
    '[data-track], button, a, input, select, textarea, [role="button"], [data-cta-primary], [v-editable]'
  ) as HTMLElement | null

  if (interactive) {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation?.()
    spotlightInteractiveElement(interactive)
  }
}

function onGlobalMouseMove(e: MouseEvent) {
  if (!isOpen.value || !isInspectorActive.value) {
    hoveredElementRect.value = null
    activeHoveredElement = null
    return
  }

  pendingMouseEvent = e
  if (!mouseRaf) {
    mouseRaf = requestAnimationFrame(() => {
      mouseRaf = null
      if (pendingMouseEvent) {
        processHover(pendingMouseEvent)
      }
    })
  }
}

// 0% Scroll Lag Tracker: Updates bounding box coordinates immediately on scroll inside RAF
let scrollRaf: number | null = null

function onScrollSync() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = null
    updateScrollProgress()
    if (activeHoveredElement && isInspectorActive.value && isOpen.value) {
      if (!activeHoveredElement.isConnected) {
        hoveredElementRect.value = null
        activeHoveredElement = null
        return
      }
      const rect = activeHoveredElement.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
        hoveredElementRect.value = null
      } else {
        hoveredElementRect.value = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        }
      }
    }
  })
}

/* -------------------------------------------------------------
 * Data Fetching, Polling & Background Tab Sleep
 * ------------------------------------------------------------- */
async function fetchLensData() {
  if (typeof document !== 'undefined' && document.hidden) return
  isRefreshing.value = true
  try {
    updateDocumentHeight()

    // Determine session_id query param
    let effectiveSessionId: string | undefined = undefined
    if (selectedSessionId.value === 'me' && mySessionId.value) {
      effectiveSessionId = mySessionId.value
    } else if (selectedSessionId.value !== 'all' && selectedSessionId.value !== 'me') {
      effectiveSessionId = selectedSessionId.value
    }

    // Determine timeframe minutes
    let timeframeMinutes: number | undefined = undefined
    if (heatmapTimeframe.value !== 'all') {
      timeframeMinutes = heatmapTimeframe.value === '5m' ? 5 : heatmapTimeframe.value === '15m' ? 15 : 60
    }

    const queryParams: Record<string, any> = {
      url: scopeMode.value === 'PAGE' ? activeUrl.value : ''
    }
    if (effectiveSessionId) queryParams.session_id = effectiveSessionId
    if (timeframeMinutes) queryParams.timeframe = timeframeMinutes

    const [res, sessionsRes] = await Promise.all([
      $fetch<TelemetryLensResponse>('/api/analytics/lens', { query: queryParams }),
      $fetch<{ sessions: SessionSummary[] }>('/api/analytics/sessions', { query: { limit: 50 } }).catch(() => ({ sessions: [] }))
    ])

    const existingIds = new Set(res.recent_logs?.map((l) => l.id) || [])
    const localPending = logs.value.filter((l) => l.id.startsWith('live_') && !existingIds.has(l.id))
    logs.value = [...localPending, ...(res.recent_logs || [])]
    metrics.value = { ...metrics.value, ...(res.element_metrics || {}) }
    if (res.scroll_density && Array.isArray(res.scroll_density)) {
      scrollBins.value = res.scroll_density
    }
    if (sessionsRes.sessions && Array.isArray(sessionsRes.sessions)) {
      sessions.value = sessionsRes.sessions
    }
  } catch (err) {
    console.warn('[TelemetryLens] Failed to fetch telemetry data:', err)
  } finally {
    isRefreshing.value = false
  }
}

let pollTimer: any = null

function handleVisibilityChange() {
  if (document.hidden) {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  } else if (isOpen.value) {
    fetchLensData()
    if (!pollTimer) {
      pollTimer = setInterval(fetchLensData, 5000)
    }
  }
}

watch(isOpen, (open) => {
  if (open) {
    updateDocumentHeight()
    scanAndTagPage()
    fetchLensData()
    pollTimer = setInterval(fetchLensData, 5000)
    window.addEventListener('scroll', onScrollSync, { passive: true })
    window.addEventListener('mousemove', onGlobalMouseMove, { passive: true })
    window.addEventListener('click', onInspectClickCapture, { capture: true })
    window.addEventListener('resize', updateDocumentHeight, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
  } else {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
    if (mouseRaf) {
      cancelAnimationFrame(mouseRaf)
      mouseRaf = null
    }
    if (scrollRaf) {
      cancelAnimationFrame(scrollRaf)
      scrollRaf = null
    }
    window.removeEventListener('scroll', onScrollSync)
    window.removeEventListener('mousemove', onGlobalMouseMove)
    window.removeEventListener('click', onInspectClickCapture, { capture: true })
    window.removeEventListener('resize', updateDocumentHeight)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    hoveredElementRect.value = null
    activeHoveredElement = null
  }
})

watch(() => route.fullPath, () => {
  if (isOpen.value) {
    updateDocumentHeight()
    scanAndTagPage()
    fetchLensData()
  }
})

function updateScrollProgress() {
  if (typeof window === 'undefined') return
  const viewHeight = window.innerHeight || 800
  const maxScroll = Math.max(1, documentTotalHeight.value - viewHeight)
  const scrollY = window.scrollY || window.pageYOffset || 0
  currentScrollPercent.value = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100))
}

/* -------------------------------------------------------------
 * Right-Edge Rail Hover & Click
 * ------------------------------------------------------------- */
const railTooltip = reactive({
  visible: false,
  y: 0,
  percent: 0,
  dwell: 0
})

function handleRailHover(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const relativeY = e.clientY - rect.top
  const ratio = Math.max(0, Math.min(1, relativeY / rect.height))
  const binIndex = Math.min(19, Math.floor(ratio * 20))

  railTooltip.visible = true
  railTooltip.y = e.clientY
  railTooltip.percent = Math.round(ratio * 100)
  railTooltip.dwell = scrollBins.value[binIndex] || 0
}

function handleRailClick(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const relativeY = e.clientY - rect.top
  const ratio = Math.max(0, Math.min(1, relativeY / rect.height))

  const viewHeight = window.innerHeight || 800
  const maxScroll = Math.max(1, documentTotalHeight.value - viewHeight)
  window.scrollTo({ top: ratio * maxScroll, behavior: 'smooth' })
}

function handleRailTouch(e: TouchEvent) {
  if (!e.touches || !e.touches[0]) return
  const touch = e.touches[0]
  const viewHeight = window.innerHeight || 800
  const ratio = Math.max(0, Math.min(1, touch.clientY / viewHeight))
  const binIndex = Math.min(19, Math.floor(ratio * 20))

  railTooltip.visible = true
  railTooltip.y = touch.clientY
  railTooltip.percent = Math.round(ratio * 100)
  railTooltip.dwell = scrollBins.value[binIndex] || 0

  const maxScroll = Math.max(1, documentTotalHeight.value - viewHeight)
  window.scrollTo({ top: ratio * maxScroll })
}

const scrollHeatmapGradient = computed(() => {
  const bins = scrollBins.value
  const maxVal = Math.max(1, ...bins)

  const colorStops = bins.map((val, idx) => {
    const ratio = Math.min(1, val / maxVal)
    const pct = idx * 5
    const nextPct = (idx + 1) * 5

    let color = 'rgba(24, 24, 27, 0.4)'
    if (ratio > 0.7) {
      color = 'rgba(244, 63, 94, 0.95)'
    } else if (ratio > 0.35) {
      color = 'rgba(245, 158, 11, 0.85)'
    } else if (ratio > 0.08) {
      color = 'rgba(16, 185, 129, 0.75)'
    }

    return `${color} ${pct}%, ${color} ${nextPct}%`
  })

  return `linear-gradient(to bottom, ${colorStops.join(', ')})`
})

/* -------------------------------------------------------------
 * Flight Recorder Filter & Formatting
 * ------------------------------------------------------------- */
const filteredLogs = computed(() => {
  let list = logs.value

  if (scopeMode.value === 'PAGE') {
    const norm = activeUrl.value.split('?')[0]
    list = list.filter((log) => log.url === norm || log.url.startsWith(norm))
  }

  // Session scoping
  if (selectedSessionId.value === 'me' && mySessionId.value) {
    list = list.filter((log) => log.session_id === mySessionId.value)
  } else if (selectedSessionId.value !== 'all' && selectedSessionId.value !== 'me') {
    list = list.filter((log) => log.session_id === selectedSessionId.value)
  }

  // Timeframe windowing
  if (heatmapTimeframe.value !== 'all') {
    const mins = heatmapTimeframe.value === '5m' ? 5 : heatmapTimeframe.value === '15m' ? 15 : 60
    const cutoff = Date.now() - mins * 60 * 1000
    list = list.filter((log) => new Date(log.timestamp).getTime() >= cutoff)
  }

  if (activeFilter.value === 'ALL') return list

  return list.filter((log) => {
    if (activeFilter.value === 'INTERACTIONS') {
      return ['tap_heat', 'hesitation_trigger'].includes(log.event_name)
    }
    if (activeFilter.value === 'PACKAGING') {
      return ['dieline_download', 'spec_configured', 'volume_inquired', 'sales_handoff'].includes(log.event_name)
    }
    if (activeFilter.value === 'ERRORS') {
      return ['ui_error', 'mobile_issue'].includes(log.event_name)
    }
    return true
  })
})

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toTimeString().split(' ')[0]
  } catch {
    return iso
  }
}

function getLogLevel(eventName: string): string {
  if (eventName === 'ui_error' || eventName === 'mobile_issue') return 'ERR'
  if (eventName === 'hesitation_trigger') return 'WARN'
  return 'INFO'
}

function getLevelBadgeClass(eventName: string): string {
  if (eventName === 'ui_error' || eventName === 'mobile_issue') {
    return 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
  }
  if (eventName === 'hesitation_trigger') {
    return 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
  }
  return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
}

function getEventColorClass(eventName: string): string {
  if (eventName === 'ui_error' || eventName === 'mobile_issue') return 'text-rose-400'
  if (eventName === 'hesitation_trigger') return 'text-amber-400'
  if (['dieline_download', 'spec_configured', 'volume_inquired', 'sales_handoff'].includes(eventName)) {
    return 'text-cyan-300'
  }
  return 'text-emerald-400'
}

function getLogRowClass(eventName: string): string {
  if (eventName === 'ui_error' || eventName === 'mobile_issue') {
    return 'bg-rose-950/20 border-rose-500/20'
  }
  if (eventName === 'hesitation_trigger') {
    return 'bg-amber-950/20 border-amber-500/20'
  }
  return 'bg-zinc-900/50'
}

function formatPropertiesSummary(props: any): string {
  if (!props) return ''
  const items: string[] = []
  for (const [k, v] of Object.entries(props)) {
    if (k === 'target_id' || k === 'component_id' || k === 'page_x' || k === 'page_y') continue
    if (typeof v === 'object' && v !== null) {
      items.push(`${k}: ${JSON.stringify(v)}`)
    } else {
      items.push(`${k}: ${v}`)
    }
  }
  return items.slice(0, 3).join(' • ')
}

/* -------------------------------------------------------------
 * Target Element Highlighting & Locating
 * ------------------------------------------------------------- */
function scrollToElement(targetId: string) {
  if (typeof document === 'undefined') return
  const el =
    document.querySelector(`[data-track="${CSS.escape(targetId)}"]`) ||
    document.getElementById(targetId)

  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('telemetry-highlight-pulse')
    setTimeout(() => {
      el.classList.remove('telemetry-highlight-pulse')
    }, 2000)
  }
}

function spotlightLogTarget(log: StoredAnalyticsEvent) {
  const targetId = log.properties?.target_id || log.properties?.component_id
  if (!targetId || typeof document === 'undefined') return

  const el =
    document.querySelector(`[data-track="${CSS.escape(targetId)}"]`) ||
    document.getElementById(targetId)

  if (el) {
    activeHoveredElement = el as HTMLElement
    const rect = el.getBoundingClientRect()
    hoveredElementRect.value = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    }
    const identity = resolveElementIdentity(el as HTMLElement)
    inspectedTargetId.value = identity.id
    inspectedLabel.value = identity.label
    inspectedCategory.value = identity.category
    inspectedContext.value = identity.parentContext || 'Page'
    hoveredElementTag.value = el.tagName.toLowerCase()
    hoveredDimensions.value = `${Math.round(rect.width)} × ${Math.round(rect.height)} px`
  }
}

function handleLogClick(log: StoredAnalyticsEvent) {
  const targetId = log.properties?.target_id || log.properties?.component_id
  if (targetId) {
    scrollToElement(targetId)
  }
}

/* -------------------------------------------------------------
 * Real-Time Live Event Bus Listener
 * ------------------------------------------------------------- */
function onLiveEvent(e: Event) {
  const customEv = e as CustomEvent
  const ev = customEv.detail
  if (!ev) return

  // Real-time scroll density update
  if (ev.event_name === 'scroll_dwell' && ev.properties?.buckets) {
    const newBuckets = ev.properties.buckets
    if (Array.isArray(newBuckets) && newBuckets.length === 20) {
      scrollBins.value = newBuckets.map((val: number, idx: number) => {
        return Math.max(scrollBins.value[idx] || 0, Number(val) || 0)
      })
    }
  }

  const newLog: StoredAnalyticsEvent = {
    id: ev.id || `live_${Date.now()}`,
    event_name: ev.event_name,
    session_id: ev.session_id,
    timestamp: ev.timestamp || new Date().toISOString(),
    url: ev.url || route.fullPath,
    referrer: ev.referrer,
    ip_hash: 'live-session',
    user_agent: 'Client',
    properties: ev.properties || {}
  }

  logs.value.unshift(newLog)
  if (logs.value.length > 150) logs.value.pop()

  const targetId = ev.properties?.target_id || ev.properties?.component_id
  if (targetId) {
    if (!metrics.value[targetId]) {
      metrics.value[targetId] = {
        target_id: targetId,
        tap_count: 0,
        avg_dwell_ms: 0,
        hesitations: 0,
        errors: 0,
        last_interaction: newLog.timestamp
      }
    }
    const m = metrics.value[targetId]
    m.last_interaction = newLog.timestamp
    if (ev.event_name === 'tap_heat') {
      m.tap_count++
    } else if (ev.event_name === 'hesitation_trigger') {
      m.hesitations++
      if (ev.properties.dwell_ms) {
        m.avg_dwell_ms = Math.round(Number(ev.properties.dwell_ms))
      }
    } else if (ev.event_name === 'ui_error') {
      m.errors++
    }
  }
}

/* -------------------------------------------------------------
 * Shortcuts & Gestures
 * ------------------------------------------------------------- */
function handleKeyDown(e: KeyboardEvent) {
  // Toggle HUD with Ctrl+Shift+Z or Cmd+Shift+Z
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'Z' || e.key === 'z')) {
    e.preventDefault()
    isOpen.value = !isOpen.value
    return
  }

  // Quick Inspector Mode Toggle with key "I"
  if (
    isOpen.value &&
    (e.key === 'I' || e.key === 'i') &&
    !e.ctrlKey &&
    !e.metaKey &&
    !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
  ) {
    e.preventDefault()
    toggleInspector()
    return
  }

  // Quick Heatmap Mode Toggle with key "H"
  if (
    isOpen.value &&
    (e.key === 'H' || e.key === 'h') &&
    !e.ctrlKey &&
    !e.metaKey &&
    !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
  ) {
    e.preventDefault()
    cycleHeatmapMode()
  }
}

let tapCount = 0
let lastTapTime = 0
function handleMobileMultiTap() {
  const now = Date.now()
  if (now - lastTapTime < 500) {
    tapCount++
    if (tapCount >= 4) {
      isOpen.value = !isOpen.value
      tapCount = 0
    }
  } else {
    tapCount = 1
  }
  lastTapTime = now
}

function onToggleLensEvent() {
  isOpen.value = !isOpen.value
}

function onTouchStart3Finger(e: TouchEvent) {
  if (e.touches && e.touches.length === 3) {
    isOpen.value = !isOpen.value
  }
}

onMounted(() => {
  mySessionId.value = getTelemetrySessionId()
  checkMobile()
  updateDocumentHeight()
  window.addEventListener('resize', checkMobile, { passive: true })
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('najm:telemetry-event', onLiveEvent as EventListener)
  window.addEventListener('najm:toggle-lens', onToggleLensEvent)
  window.addEventListener('touchstart', onTouchStart3Finger, { passive: true })
  if (route.query.lens === 'true' || route.query.lens === '1') {
    isOpen.value = true
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('najm:telemetry-event', onLiveEvent as EventListener)
  window.removeEventListener('najm:toggle-lens', onToggleLensEvent)
  window.removeEventListener('touchstart', onTouchStart3Finger)
  if (pollTimer) clearInterval(pollTimer)
  window.removeEventListener('scroll', onScrollSync)
  window.removeEventListener('mousemove', onGlobalMouseMove)
  window.removeEventListener('click', onInspectClickCapture, { capture: true })
  window.removeEventListener('resize', updateDocumentHeight)
})
</script>

<style>
@keyframes telemetryPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8);
    outline: 2px solid #10b981;
  }
  70% {
    box-shadow: 0 0 0 14px rgba(16, 185, 129, 0);
    outline: 2px solid #10b981;
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    outline: 2px solid transparent;
  }
}

.telemetry-highlight-pulse {
  animation: telemetryPulse 1.6s ease-out;
  border-radius: 8px;
}
</style>
