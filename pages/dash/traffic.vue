<!-- pages/dash/traffic.vue -->
<template>
  <div class="space-y-6 select-none font-d4 text-white">
    <!-- Top Header & Actions -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl sm:text-2xl font-bold text-white">تحلیل ترافیک، رفتار و سفر کاربران (Traffic & Telemetry)</h2>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Telemetry V2
          </span>
        </div>
        <p class="text-xs sm:text-sm text-zinc-400 mt-1">
          رصد تعاملی سفر کاربران (DAG Journeys)، ردیابی کلیک روی دکمه‌ها، منابع UTM، توقف‌های مطالعه و فیلترهای زمانی پیشرفته.
        </p>
      </div>
    </div>

    <!-- Mode Switcher Tabs: Historical vs Live -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-2.5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-lg">
      <!-- Mode Tabs -->
      <div class="flex items-center p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs">
        <button
          type="button"
          @click="switchMode('historical')"
          class="px-4 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-2"
          :class="currentMode === 'historical'
            ? 'bg-emerald-500 text-zinc-950 shadow-md font-black'
            : 'text-zinc-400 hover:text-white'"
        >
          <AdminIcon name="chart-pie" class="w-4 h-4" />
          <span>آرشیو و تحلیل گذشته (Historical)</span>
        </button>

        <button
          type="button"
          @click="switchMode('live')"
          class="px-4 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-2 relative"
          :class="currentMode === 'live'
            ? 'bg-emerald-500 text-zinc-950 shadow-md font-black'
            : 'text-zinc-400 hover:text-white'"
        >
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>پخش زنده و لحظه‌ای (Live Stream)</span>
          <span v-if="liveStats.active_visitors > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-400/30 text-emerald-950 font-bold font-mono">
            {{ liveStats.active_visitors }} آنلاین
          </span>
        </button>
      </div>

      <!-- Mode Specific Controls -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Historical Mode Range Selector -->
        <template v-if="currentMode === 'historical'">
          <div class="flex items-center p-0.5 rounded-xl bg-zinc-950 border border-white/10 text-xs">
            <button
              v-for="opt in timeRangeOptions"
              :key="opt.value"
              type="button"
              @click="selectedTimeRange = (opt.value as any); fetchData()"
              class="px-2.5 py-1 rounded-lg font-bold transition cursor-pointer"
              :class="selectedTimeRange === opt.value
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'"
            >
              {{ opt.label }}
            </button>
          </div>
        </template>

        <!-- Live Mode Interval Selector -->
        <template v-else>
          <div class="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs">
            <span class="text-zinc-400 text-[11px] px-1 font-semibold">بروزرسانی خودکار:</span>
            <button
              type="button"
              @click="liveRefreshInterval = 5; startLivePolling()"
              class="px-2 py-0.5 rounded font-mono transition cursor-pointer"
              :class="liveRefreshInterval === 5 ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'"
            >
              ۵ ثانیه
            </button>
            <button
              type="button"
              @click="liveRefreshInterval = 10; startLivePolling()"
              class="px-2 py-0.5 rounded font-mono transition cursor-pointer"
              :class="liveRefreshInterval === 10 ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'"
            >
              ۱۰ ثانیه
            </button>
            <button
              type="button"
              @click="liveRefreshInterval = 0; stopLivePolling()"
              class="px-2 py-0.5 rounded font-mono transition cursor-pointer"
              :class="liveRefreshInterval === 0 ? 'bg-rose-500 text-white font-bold' : 'text-zinc-400 hover:text-white'"
            >
              خاموش
            </button>
          </div>
        </template>

        <!-- Exclude Admin Routes Toggle -->
        <label class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs font-semibold text-zinc-300 cursor-pointer hover:bg-zinc-800 transition">
          <input
            type="checkbox"
            v-model="excludeAdmin"
            @change="currentMode === 'live' ? fetchLiveStats() : fetchData()"
            class="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 cursor-pointer"
          />
          <span>حذف صفحات ادمین (/dash)</span>
        </label>

        <!-- Refresh Button -->
        <button
          type="button"
          @click="currentMode === 'live' ? fetchLiveStats() : fetchData()"
          class="px-3.5 py-1.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
          :disabled="loading || liveLoading"
        >
          <AdminIcon name="refresh" class="w-3.5 h-3.5" :class="{ 'animate-spin': loading || liveLoading }" />
          <span>{{ (loading || liveLoading) ? 'دریافت...' : 'بروزرسانی' }}</span>
        </button>
      </div>
    </div>

    <!-- Error Banner (if any) -->
    <div
      v-if="fetchError"
      class="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-center justify-between gap-3 text-xs"
    >
      <div class="flex items-center gap-2">
        <AdminIcon name="x" class="w-4 h-4 text-rose-400 shrink-0" />
        <span>{{ fetchError }}</span>
      </div>
      <button
        type="button"
        @click="currentMode === 'live' ? fetchLiveStats() : fetchData()"
        class="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
      >
        تلاش مجدد
      </button>
    </div>

    <!-- Zero-Data Historical Notice with One-Click Fallback -->
    <div
      v-if="currentMode === 'historical' && stats.total_sessions === 0 && (stats.total_historical_sessions || 0) > 0"
      class="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
    >
      <div class="flex items-center gap-2">
        <span class="text-base">💡</span>
        <span>
          در بازه زمانی انتخابی ({{ timeRangeOptions.find(o => o.value === selectedTimeRange)?.label }}) نشستی ثبت نشده است، اما در آرشیو تاریخچه سایت <strong>{{ formatNumber(stats.total_historical_sessions) }} نشست</strong> ذخیره شده وجود دارد.
        </span>
      </div>
      <button
        type="button"
        @click="selectAllHistory"
        class="px-3.5 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 transition cursor-pointer shrink-0"
      >
        مشاهده کل تاریخچه دیتابیس
      </button>
    </div>

    <!-- Active Filters & Exclusions Bar (Chips) -->
    <div
      v-if="activeUtmFilter || activeUserFilter || excludedFpsList.length > 0 || excludedPagesList.length > 0 || searchQuery"
      class="p-3 rounded-xl bg-zinc-900/80 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-xs"
    >
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-zinc-400 font-bold flex items-center gap-1">
          <AdminIcon name="filter" class="w-3.5 h-3.5 text-emerald-400" />
          فیلترهای فعال:
        </span>
        <span
          v-if="activeUtmFilter"
          class="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 flex items-center gap-1 font-mono"
        >
          کمپین UTM: {{ activeUtmFilter }}
          <button @click="filterByUtm('')" class="hover:text-white cursor-pointer mr-1">✕</button>
        </span>
        <span
          v-if="activeUserFilter"
          class="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center gap-1"
        >
          کاربر: {{ activeUserFilter }}
          <button @click="filterByUser('')" class="hover:text-white cursor-pointer mr-1">✕</button>
        </span>
        <span
          v-if="searchQuery"
          class="px-2.5 py-1 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center gap-1"
        >
          جستجو: «{{ searchQuery }}»
          <button @click="searchQuery = ''" class="hover:text-white cursor-pointer mr-1">✕</button>
        </span>
        <span
          v-for="fp in excludedFpsList"
          :key="fp"
          class="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1"
        >
          استثنای کاربر: {{ fp.slice(0, 8) }}...
          <button @click="removeExcludedFp(fp)" class="hover:text-white cursor-pointer mr-1">✕</button>
        </span>
        <span
          v-for="pg in excludedPagesList"
          :key="pg"
          class="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-1"
        >
          استثنای صفحه: {{ pg }}
          <button @click="removeExcludedPage(pg)" class="hover:text-white cursor-pointer mr-1">✕</button>
        </span>
      </div>

      <button
        type="button"
        @click="clearAllFilters"
        class="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold transition cursor-pointer"
      >
        پاکسازی همه فیلترها
      </button>
    </div>

    <!-- Admin Device Identity Card -->
    <div class="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start md:items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border"
          :class="[currentFpMeta.palette.bg, currentFpMeta.palette.text, currentFpMeta.palette.border]"
        >
          {{ currentFpMeta.avatarChar }}
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-bold text-zinc-200">{{ currentFpMeta.label }}</span>
            <button
              type="button"
              @click="openAliasModal(currentFingerprint)"
              class="px-2 py-0.5 rounded text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
              title="تغییر نام مستعار این دستگاه"
            >
              ✏️ نامگذاری
            </button>
            <span
              class="px-2 py-0.5 rounded-md text-xs font-bold border flex items-center gap-1"
              :title="currentFpMeta.device.tooltip"
            >
              <AdminIcon :name="currentFpMeta.device.icon" class="w-3.5 h-3.5" />
              <span>{{ currentFpMeta.device.label }}</span>
            </span>
            <span
              class="px-2 py-0.5 rounded-md text-xs font-bold border border-white/10 bg-zinc-800 text-zinc-300 flex items-center gap-1"
              :title="currentFpMeta.browser.tooltip"
            >
              <AdminIcon :name="currentFpMeta.browser.icon" class="w-3.5 h-3.5" />
              <span>{{ currentFpMeta.browser.name }}</span>
            </span>
            <span
              v-if="isCurrentExcluded"
              class="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
            >
              مستثنی شده
            </span>
          </div>
          <p class="text-xs text-zinc-400 mt-1">
            با یک کلیک دستگاه خودتان را مستثنی کنید تا تست‌ها، بازدیدها و اسکرول‌های شما آمارهای سایت را کدر و اشتباه نکند.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          type="button"
          @click="toggleDeviceExclusion"
          class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          :class="isCurrentExcluded
            ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10'
            : 'bg-amber-600/90 hover:bg-amber-600 text-white'"
          :disabled="togglingExclusion"
        >
          <AdminIcon :name="isCurrentExcluded ? 'check' : 'x'" class="w-3.5 h-3.5" />
          <span>{{ isCurrentExcluded ? 'لغو استثنا (محاسبه مجدد)' : 'دستگاه من را مستثنی کن' }}</span>
        </button>
      </div>
    </div>

    <!-- Historical Analytics Mode View -->
    <template v-if="currentMode === 'historical'">
      <!-- Executive KPI Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <!-- 1. Total Sessions -->
      <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">کل نشست‌ها (Sessions)</span>
          <AdminIcon name="users" class="w-4 h-4 text-emerald-400" />
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-emerald-400">
            {{ formatNumber(stats.total_sessions) }}
          </span>
          <span class="text-xs text-zinc-400">نشست</span>
        </div>
        <p class="text-xs text-zinc-500 mt-1">بازدیدهای ثبت‌شده کاربران</p>
      </div>

      <!-- 2. Total Pageviews -->
      <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">بازدید صفحات (Pageviews)</span>
          <AdminIcon name="eye" class="w-4 h-4 text-sky-400" />
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-sky-400">
            {{ formatNumber(stats.total_pageviews) }}
          </span>
          <span class="text-xs text-zinc-400">صفحه</span>
        </div>
        <p class="text-xs text-zinc-500 mt-1">
          میانگین {{ stats.total_sessions ? (stats.total_pageviews / stats.total_sessions).toFixed(1) : 0 }} صفحه/کاربر
        </p>
      </div>

      <!-- 3. Bounce Rate -->
      <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">نرخ پرش (Bounce Rate)</span>
          <AdminIcon name="chart-pie" class="w-4 h-4 text-amber-400" />
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-amber-400">
            {{ stats.bounce_rate_pct }}٪
          </span>
        </div>
        <p class="text-xs text-zinc-500 mt-1">زیر ۱۰ ثانیه و بدون تعامل بعدی</p>
      </div>

      <!-- 4. Avg Duration -->
      <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">میانگین ماندگاری</span>
          <AdminIcon name="clock" class="w-4 h-4 text-purple-400" />
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-purple-400">
            {{ formatDuration(stats.avg_duration_sec) }}
          </span>
        </div>
        <p class="text-xs text-zinc-500 mt-1">زمان سپری‌شده در سایت</p>
      </div>

      <!-- 5. Scroll Debounce Stops -->
      <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">توقف‌های اسکرول (Debounces)</span>
          <AdminIcon name="adjustments" class="w-4 h-4 text-teal-400" />
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-teal-400">
            {{ formatNumber(stats.debounce_stats?.total_debounced_scrolls || 0) }}
          </span>
          <span class="text-xs text-zinc-400">مکث</span>
        </div>
        <p class="text-xs text-zinc-500 mt-1">
          میانگین {{ stats.debounce_stats?.avg_dwell_before_stop || 0 }} ثانیه مطالعه
        </p>
      </div>
    </div>

    <!-- Interactive Timeline SVG Chart -->
    <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <AdminIcon name="chart-pie" class="w-4 h-4 text-emerald-400" />
          <h3 class="text-sm font-bold text-white">روند ترافیک و نشست‌ها در بازه انتخابی</h3>
          <span class="text-xs text-zinc-400 font-mono">
            ({{ selectedTimeRange === '1h' ? 'گام‌های ۵ دقیقه‌ای' : selectedTimeRange === '24h' ? 'گام‌های ساعتی' : 'گام‌های روزانه' }})
          </span>
        </div>
        <div class="flex items-center gap-4 text-xs">
          <div class="flex items-center gap-1.5 text-emerald-400">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>بازدید صفحات (Pageviews)</span>
          </div>
          <div class="flex items-center gap-1.5 text-sky-400">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span>نشست‌های فعال (Sessions)</span>
          </div>
        </div>
      </div>

      <!-- SVG Chart Canvas -->
      <div class="relative w-full h-48 bg-zinc-950/60 rounded-xl border border-white/5 p-2 overflow-hidden flex items-end">
        <svg
          v-if="timelineChartData.items.length > 0"
          viewBox="0 0 800 180"
          class="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines -->
          <line x1="20" y1="40" x2="780" y2="40" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4" />
          <line x1="20" y1="90" x2="780" y2="90" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4" />
          <line x1="20" y1="140" x2="780" y2="140" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4" />

          <!-- Pageviews Area Fill -->
          <path :d="timelineChartData.areaPoints" fill="url(#emeraldGradient)" />

          <!-- Pageviews Line -->
          <path
            :d="timelineChartData.linePoints"
            fill="none"
            stroke="#10b981"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Sessions Line -->
          <path
            :d="timelineChartData.sessionsLinePoints"
            fill="none"
            stroke="#38bdf8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Hover / Interactive Markers -->
          <circle
            v-for="(pt, idx) in timelineChartData.items"
            :key="idx"
            :cx="pt.x"
            :cy="pt.yPv"
            r="3.5"
            class="fill-emerald-400 stroke-zinc-950 stroke-2 cursor-pointer hover:r-5 transition-all"
            @mouseenter="hoveredChartItem = pt"
            @mouseleave="hoveredChartItem = null"
          />
        </svg>

        <!-- Hover Tooltip -->
        <div
          v-if="hoveredChartItem"
          class="absolute top-2 left-4 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/20 text-xs font-mono shadow-xl z-10 flex items-center gap-3 pointer-events-none"
        >
          <span class="text-zinc-300 font-bold">زمان: {{ hoveredChartItem.hour }}</span>
          <span class="text-emerald-400">📄 {{ hoveredChartItem.pageviews }} بازدید</span>
          <span class="text-sky-400">👥 {{ hoveredChartItem.sessions }} نشست</span>
        </div>
      </div>
    </div>

    <!-- Main Grid: Traffic Sources & Top Clicked Targets -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Traffic Sources Breakdown -->
      <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdminIcon name="globe" class="w-4 h-4 text-emerald-400" />
            <h3 class="text-sm font-bold text-white">ترکیب کانال‌های ورودی (Source Channels)</h3>
          </div>
          <span class="text-xs text-zinc-400 font-mono">{{ stats.source_breakdown?.length || 0 }} کانال</span>
        </div>

        <div v-if="!stats.source_breakdown || stats.source_breakdown.length === 0" class="py-8 text-center text-xs text-zinc-500">
          هنوز داده‌ای برای کانال‌های ورودی در این بازه زمانی ثبت نشده است.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="src in stats.source_breakdown"
            :key="src.type"
            class="p-3 rounded-xl bg-zinc-950/60 border border-white/5 space-y-2"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-zinc-200">{{ src.label }}</span>
              <div class="flex items-center gap-2 font-mono">
                <span class="text-emerald-400 font-bold">{{ src.count }} ورود</span>
                <span class="text-zinc-500">({{ src.percentage }}٪)</span>
              </div>
            </div>
            <!-- Progress Bar -->
            <div class="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="getSourceColor(src.type)"
                :style="{ width: src.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Clicked Buttons & CTAs -->
      <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdminIcon name="cursor-click" class="w-4 h-4 text-teal-400" />
            <h3 class="text-sm font-bold text-white">محبوب‌ترین دکمه‌ها و تعاملات کلیک (Top Clicked Targets)</h3>
          </div>
          <span class="text-xs text-zinc-400 font-mono">{{ stats.top_clicked_targets?.length || 0 }} المان</span>
        </div>

        <div v-if="!stats.top_clicked_targets || stats.top_clicked_targets.length === 0" class="py-8 text-center text-xs text-zinc-500">
          هنوز رویداد کلیک روی دکمه‌های سایت ثبت نشده است.
        </div>
        <div v-else class="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          <div
            v-for="target in stats.top_clicked_targets"
            :key="target.target_id"
            class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-teal-500/30 transition text-xs"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                <AdminIcon name="cursor-click" class="w-3 h-3" />
              </span>
              <span class="font-bold text-zinc-200 truncate">{{ target.label }}</span>
            </div>
            <div class="flex items-center gap-2 font-mono shrink-0">
              <span class="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold text-xs">
                {{ target.count }} کلیک
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hardware Devices & Browsers Distribution Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Device Breakdown -->
      <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdminIcon name="desktop" class="w-4 h-4 text-emerald-400" />
            <h3 class="text-sm font-bold text-white">توزیع دیوایس‌ها و سیستم‌عامل (Device Breakdown)</h3>
          </div>
          <span class="text-xs text-zinc-400 font-mono">{{ stats.device_breakdown?.length || 0 }} نوع</span>
        </div>

        <div v-if="!stats.device_breakdown || stats.device_breakdown.length === 0" class="py-8 text-center text-xs text-zinc-500">
          هنوز داده‌ای برای دیوایس‌ها ثبت نشده است.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="dev in stats.device_breakdown"
            :key="dev.device"
            class="p-3 rounded-xl bg-zinc-950/60 border border-white/5 space-y-2"
          >
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 font-bold text-zinc-200">
                <AdminIcon :name="dev.icon || 'desktop'" class="w-4 h-4 text-emerald-400" />
                <span>{{ dev.device }}</span>
              </div>
              <div class="flex items-center gap-2 font-mono">
                <span class="text-emerald-400 font-bold">{{ dev.count }} نشست</span>
                <span class="text-zinc-500">({{ dev.percentage }}٪)</span>
              </div>
            </div>
            <div class="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div class="h-full rounded-full bg-emerald-500 transition-all duration-500" :style="{ width: dev.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Browser Breakdown -->
      <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdminIcon name="globe" class="w-4 h-4 text-sky-400" />
            <h3 class="text-sm font-bold text-white">مرورگرهای کاربران با آیکون (Browsers)</h3>
          </div>
          <span class="text-xs text-zinc-400 font-mono">{{ stats.browser_breakdown?.length || 0 }} مرورگر</span>
        </div>

        <div v-if="!stats.browser_breakdown || stats.browser_breakdown.length === 0" class="py-8 text-center text-xs text-zinc-500">
          هنوز داده‌ای برای مرورگرها ثبت نشده است.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="br in stats.browser_breakdown"
            :key="br.browser"
            class="p-3 rounded-xl bg-zinc-950/60 border border-white/5 space-y-2"
          >
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 font-bold text-zinc-200">
                <AdminIcon :name="br.icon || 'globe'" class="w-4 h-4 text-sky-400" />
                <span>{{ br.browser }}</span>
              </div>
              <div class="flex items-center gap-2 font-mono">
                <span class="text-sky-400 font-bold">{{ br.count }} نشست</span>
                <span class="text-zinc-500">({{ br.percentage }}٪)</span>
              </div>
            </div>
            <div class="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div class="h-full rounded-full bg-sky-500 transition-all duration-500" :style="{ width: br.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Google Search Queries & Page Flows -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- UTM Sources, Campaigns & Mediums Suite -->
      <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdminIcon name="tag" class="w-4 h-4 text-sky-400" />
            <h3 class="text-sm font-bold text-white">کمپین‌ها و پارامترهای UTM (تاریخچه و تحلیل)</h3>
          </div>
          <!-- Tabs: source | campaign | medium -->
          <div class="flex items-center p-0.5 rounded-lg bg-zinc-950 border border-white/10 text-[11px]">
            <button
              type="button"
              @click="utmTab = 'source'"
              class="px-2 py-0.5 rounded transition cursor-pointer"
              :class="utmTab === 'source' ? 'bg-sky-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'"
            >
              منبع (Source)
            </button>
            <button
              type="button"
              @click="utmTab = 'campaign'"
              class="px-2 py-0.5 rounded transition cursor-pointer"
              :class="utmTab === 'campaign' ? 'bg-sky-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'"
            >
              کمپین (Campaign)
            </button>
            <button
              type="button"
              @click="utmTab = 'medium'"
              class="px-2 py-0.5 rounded transition cursor-pointer"
              :class="utmTab === 'medium' ? 'bg-sky-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'"
            >
              نوع (Medium)
            </button>
          </div>
        </div>

        <!-- Content according to selected tab -->
        <div class="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          <!-- Sources Tab -->
          <template v-if="utmTab === 'source'">
            <div v-if="!stats.utm_sources || stats.utm_sources.length === 0" class="py-8 text-center text-xs text-zinc-500">
              هنوز ورودی از طریق پارامترهای utm_source ثبت نشده است.
            </div>
            <div
              v-for="utm in stats.utm_sources"
              :key="utm.name"
              @click="filterByUtm(utm.name)"
              class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-sky-500/40 transition text-xs cursor-pointer group"
              title="کلیک برای فیلتر کردن تمام گزارش‌ها بر اساس این منبع"
            >
              <div class="flex items-center gap-2">
                <code class="px-2 py-1 rounded-md bg-sky-500/10 text-sky-300 font-mono font-bold text-xs border border-sky-500/20 group-hover:bg-sky-500/20 transition">
                  🏷️ {{ utm.name }}
                </code>
              </div>
              <div class="flex items-center gap-3 font-mono">
                <span v-if="utm.conversions" class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  🎯 {{ utm.conversions }} تبدیل
                </span>
                <span class="text-white font-bold">{{ utm.count }} نشست</span>
                <span class="text-xs text-zinc-400">({{ utm.percentage }}٪)</span>
              </div>
            </div>
          </template>

          <!-- Campaigns Tab -->
          <template v-else-if="utmTab === 'campaign'">
            <div v-if="!stats.utm_campaigns || stats.utm_campaigns.length === 0" class="py-8 text-center text-xs text-zinc-500">
              هنوز ورودی از طریق پارامترهای utm_campaign ثبت نشده است.
            </div>
            <div
              v-for="utm in stats.utm_campaigns"
              :key="utm.name"
              @click="filterByUtm(utm.name)"
              class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-sky-500/40 transition text-xs cursor-pointer group"
              title="کلیک برای فیلتر کردن تمام گزارش‌ها بر اساس این کمپین"
            >
              <div class="flex items-center gap-2">
                <code class="px-2 py-1 rounded-md bg-sky-500/10 text-sky-300 font-mono font-bold text-xs border border-sky-500/20 group-hover:bg-sky-500/20 transition">
                  🎯 {{ utm.name }}
                </code>
              </div>
              <div class="flex items-center gap-3 font-mono">
                <span v-if="utm.conversions" class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  🎯 {{ utm.conversions }} تبدیل
                </span>
                <span class="text-white font-bold">{{ utm.count }} نشست</span>
                <span class="text-xs text-zinc-400">({{ utm.percentage }}٪)</span>
              </div>
            </div>
          </template>

          <!-- Mediums Tab -->
          <template v-else>
            <div v-if="!stats.utm_mediums || stats.utm_mediums.length === 0" class="py-8 text-center text-xs text-zinc-500">
              هنوز ورودی از طریق پارامترهای utm_medium ثبت نشده است.
            </div>
            <div
              v-for="utm in stats.utm_mediums"
              :key="utm.name"
              class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 text-xs"
            >
              <div class="flex items-center gap-2">
                <code class="px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 font-mono font-bold text-xs">
                  {{ utm.name }}
                </code>
              </div>
              <div class="flex items-center gap-3 font-mono">
                <span class="text-white font-bold">{{ utm.count }} نشست</span>
                <span class="text-xs text-zinc-400">({{ utm.percentage }}٪)</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Page Flows -->
      <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdminIcon name="arrow-right" class="w-4 h-4 text-purple-400" />
            <h3 class="text-sm font-bold text-white">جریان انتقال صفحات (Page Flows & Paths)</h3>
          </div>
          <span class="text-xs text-zinc-400 font-mono">{{ stats.page_flows?.length || 0 }} مسیر</span>
        </div>
        <p class="text-xs text-zinc-400">
          کاربران پس از ورود به صفحه مبدا، عمدتاً به کدام صفحه بعدی حرکت کرده‌اند:
        </p>

        <div v-if="!stats.page_flows || stats.page_flows.length === 0" class="py-8 text-center text-xs text-zinc-500">
          هنوز مسیر انتقال متوالی بین صفحات ثبت نشده است.
        </div>
        <div v-else class="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          <div
            v-for="(flow, idx) in stats.page_flows"
            :key="idx"
            class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-purple-500/30 transition text-xs"
          >
            <div class="flex items-center gap-2 min-w-0">
              <code class="truncate text-zinc-300 font-mono text-xs bg-zinc-900 px-2 py-1 rounded max-w-[120px] sm:max-w-[160px]">
                {{ flow.from }}
              </code>
              <AdminIcon name="arrow-left" class="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <code class="truncate text-purple-300 font-mono text-xs bg-purple-950/40 px-2 py-1 rounded border border-purple-800/30 max-w-[120px] sm:max-w-[160px]">
                {{ flow.to }}
              </code>
            </div>
            <div class="shrink-0 font-mono">
              <span class="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 font-bold text-xs">
                {{ flow.count }} انتقال
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Journeys Timeline Explorer (Interactive DAG Flow) -->
    <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <AdminIcon name="clock" class="w-4 h-4 text-amber-400" />
          <h3 class="text-sm font-bold text-white">ردپای تعاملی و جریان سفر کاربران (DAG User Journeys)</h3>
        </div>
        <div class="flex items-center gap-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجوی کاربر، صفحه، IP یا UTM..."
            class="px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 w-64"
          />
          <div class="text-xs text-zinc-400 font-mono">
            {{ filteredSessions.length }} نشست
          </div>
        </div>
      </div>

      <div v-if="filteredSessions.length === 0" class="py-12 text-center text-xs text-zinc-500">
        نشستی با فیلترهای مشخص‌شده یافت نشد.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="s in filteredSessions.slice(0, 20)"
          :key="s.session_id"
          class="p-4 rounded-2xl bg-zinc-950/70 border border-white/5 hover:border-white/15 transition space-y-3"
        >
          <!-- Session Header Row with Friendly Fingerprint Persona -->
          <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2.5 flex-wrap">
              <!-- Friendly Persona Avatar & Name -->
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border"
                :class="[formatFriendlyFingerprint(s.fingerprint, s.user_agent).palette.bg, formatFriendlyFingerprint(s.fingerprint, s.user_agent).palette.text, formatFriendlyFingerprint(s.fingerprint, s.user_agent).palette.border]"
              >
                {{ formatFriendlyFingerprint(s.fingerprint, s.user_agent).avatarChar }}
              </div>
              <span class="font-bold text-zinc-100">
                {{ formatFriendlyFingerprint(s.fingerprint, s.user_agent).label }}
              </span>

              <!-- Rename Button -->
              <button
                v-if="s.fingerprint"
                type="button"
                @click="openAliasModal(s.fingerprint)"
                class="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
                title="تغییر نام مستعار این کاربر"
              >
                ✏️ نامگذاری
              </button>

              <!-- Device Badge with instant tooltip -->
              <span
                class="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 text-[11px] font-bold flex items-center gap-1 cursor-help"
                :title="formatFriendlyFingerprint(s.fingerprint, s.user_agent).device.tooltip"
              >
                <AdminIcon :name="formatFriendlyFingerprint(s.fingerprint, s.user_agent).device.icon" class="w-3 h-3 text-zinc-400" />
                <span>{{ formatFriendlyFingerprint(s.fingerprint, s.user_agent).device.label }}</span>
              </span>

              <!-- Browser Badge with instant tooltip -->
              <span
                class="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 text-[11px] font-bold flex items-center gap-1 cursor-help"
                :title="formatFriendlyFingerprint(s.fingerprint, s.user_agent).browser.tooltip"
              >
                <AdminIcon :name="formatFriendlyFingerprint(s.fingerprint, s.user_agent).browser.icon" class="w-3 h-3 text-zinc-400" />
                <span>{{ formatFriendlyFingerprint(s.fingerprint, s.user_agent).browser.name }}</span>
              </span>

              <!-- IP & Region Badge with tooltip -->
              <span
                class="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-400 text-[11px] font-mono flex items-center gap-1 cursor-help"
                :title="`آدرس IP کاربر: ${s.ip || 'نامشخص'} | منطقه: ${s.region || 'ایران'}`"
              >
                <AdminIcon name="map-pin" class="w-3 h-3 text-emerald-400" />
                <span>{{ s.region || 'ایران' }}</span>
                <span class="text-zinc-600">•</span>
                <span class="text-zinc-300">{{ s.ip ? s.ip.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, '$1.$2.$3.***') : 'Local' }}</span>
              </span>

              <!-- UTM / Source Pill -->
              <span
                v-if="s.utm_source"
                @click="filterByUtm(s.utm_source)"
                class="px-2 py-0.5 rounded bg-sky-950/70 text-sky-300 border border-sky-800/40 text-[11px] font-mono cursor-pointer hover:bg-sky-900/80 transition"
                title="کلیک برای فیلتر بر اساس این UTM"
              >
                🏷️ {{ s.utm_source }}
              </span>

              <!-- User Filter / Exclude Quick Actions -->
              <button
                v-if="s.fingerprint"
                type="button"
                @click="filterByUser(s.fingerprint)"
                class="px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer"
                :class="activeUserFilter === s.fingerprint ? 'bg-purple-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'"
                title="فیلتر فقط نشست‌های این کاربر"
              >
                🔍 فقط این کاربر
              </button>
              <button
                v-if="s.fingerprint"
                type="button"
                @click="temporarilyExcludeFp(s.fingerprint)"
                class="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 hover:bg-rose-950/60 hover:text-rose-400 text-zinc-500 transition cursor-pointer"
                title="استثنا کردن موقت این کاربر از گزارش‌ها"
              >
                🚫 استثنا
              </button>
            </div>

            <!-- Session Stats Metrics -->
            <div class="flex items-center gap-3 text-zinc-400 font-mono text-xs shrink-0">
              <span class="text-emerald-400 font-bold">{{ formatDuration(s.duration_sec) }}</span>
              <span>•</span>
              <span>{{ s.page_count }} صفحه</span>
              <span>•</span>
              <span>{{ s.event_count }} رویداد ({{ s.tap_count }} کلیک)</span>
              <span>•</span>
              <span class="text-zinc-500">{{ formatTimeAgo(s.last_seen) }}</span>
            </div>
          </div>

          <!-- DAG Journey Flow Ribbon -->
          <div class="p-3 rounded-xl bg-zinc-900/60 border border-white/5 overflow-x-auto custom-scrollbar">
            <div class="flex items-center gap-2 min-w-max py-1">
              <!-- Steps Loop -->
              <template v-for="(step, stIdx) in (s.journey_steps && s.journey_steps.length > 0 ? s.journey_steps : s.pages.map((p, i) => ({ step: i + 1, type: 'page', title: p, subtitle: p, timestamp: '' })))" :key="stIdx">
                <!-- Step Node -->
                <div
                  class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition"
                  :class="step.type === 'landing'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                    : step.type === 'tap'
                    ? 'bg-teal-950/40 border-teal-500/30 text-teal-200'
                    : step.type === 'dwell'
                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                    : step.type === 'conversion'
                    ? 'bg-purple-950/60 border-purple-500/40 text-purple-200 font-bold'
                    : 'bg-zinc-900 border-white/10 text-zinc-200'"
                  :title="step.subtitle || step.title"
                >
                  <!-- Step Icon / Indicator -->
                  <span class="shrink-0">
                    <AdminIcon v-if="step.type === 'tap'" name="cursor-click" class="w-3.5 h-3.5 text-teal-400" />
                    <AdminIcon v-else-if="step.type === 'dwell'" name="clock" class="w-3.5 h-3.5 text-amber-400" />
                    <AdminIcon v-else-if="step.type === 'conversion'" name="sparkles" class="w-3.5 h-3.5 text-purple-400" />
                    <span v-else class="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center font-bold text-zinc-400">
                      {{ stIdx + 1 }}
                    </span>
                  </span>

                  <!-- Step Content -->
                  <div class="flex flex-col min-w-0 max-w-[200px]">
                    <span class="font-bold truncate text-[11px]">{{ step.title }}</span>
                    <span v-if="step.subtitle && step.subtitle !== step.title" class="text-[10px] text-zinc-400 font-mono truncate">
                      {{ step.subtitle }}
                    </span>
                  </div>

                  <!-- Quick Exclude Page Action -->
                  <button
                    v-if="step.type === 'page' || step.type === 'landing'"
                    type="button"
                    @click="temporarilyExcludePage(step.subtitle || step.title)"
                    class="text-[10px] text-zinc-600 hover:text-rose-400 cursor-pointer mr-1"
                    title="استثنا کردن موقت این صفحه از گزارش‌ها"
                  >
                    🚫
                  </button>
                </div>

                <!-- Directed Arrow Connector -->
                <AdminIcon
                  v-if="stIdx < (s.journey_steps?.length || s.pages.length) - 1"
                  name="arrow-left"
                  class="w-3 h-3 text-zinc-600 shrink-0"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

    <!-- Real-Time Live Mode View -->
    <template v-else-if="currentMode === 'live'">
      <div class="space-y-6">
        <!-- Live Pulse KPI Strip -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Active Visitors -->
          <div class="p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs text-zinc-400">کاربران فعال آنلاین (هم‌اکنون)</span>
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-3xl font-bold font-mono text-emerald-400">
                {{ formatNumber(liveStats.active_visitors) }}
              </span>
              <span class="text-xs text-zinc-400">کاربر آنلاین</span>
            </div>
            <p class="text-[11px] text-zinc-500 mt-1">فعال در ۱۵ دقیقه اخیر</p>
          </div>

          <!-- Active Pages -->
          <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
            <div class="flex items-center justify-between">
              <span class="text-xs text-zinc-400">صفحات در حال مشاهده</span>
              <AdminIcon name="eye" class="w-4 h-4 text-sky-400" />
            </div>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-3xl font-bold font-mono text-sky-400">
                {{ formatNumber(liveStats.active_pages?.length || 0) }}
              </span>
              <span class="text-xs text-zinc-400">صفحه فعال</span>
            </div>
            <p class="text-[11px] text-zinc-500 mt-1">صفحاتی که هم‌اکنون کاربر در آن‌هاست</p>
          </div>

          <!-- Live Events Captured -->
          <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
            <div class="flex items-center justify-between">
              <span class="text-xs text-zinc-400">رویدادهای زنده اخیر</span>
              <AdminIcon name="cursor-click" class="w-4 h-4 text-teal-400" />
            </div>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-3xl font-bold font-mono text-teal-400">
                {{ formatNumber(liveStats.live_events?.length || 0) }}
              </span>
              <span class="text-xs text-zinc-400">رویداد تعاملی</span>
            </div>
            <p class="text-[11px] text-zinc-500 mt-1">کلیک، توقف و انتقال زنده</p>
          </div>

          <!-- Auto-Refresh Status -->
          <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
            <div class="flex items-center justify-between">
              <span class="text-xs text-zinc-400">وضعیت استریم زنده</span>
              <AdminIcon name="refresh" class="w-4 h-4 text-purple-400" :class="{ 'animate-spin': liveLoading }" />
            </div>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-base font-bold text-zinc-200">
                {{ liveRefreshInterval > 0 ? `هر ${liveRefreshInterval} ثانیه` : 'دستی' }}
              </span>
            </div>
            <p class="text-[11px] text-zinc-500 mt-1">
              آخرین پالس: {{ liveStats.timestamp ? formatTimeAgo(liveStats.timestamp) : 'هم‌اکنون' }}
            </p>
          </div>
        </div>

        <!-- Real-Time Grid: Active Pages & Live Event Stream Ticker -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Active Pages List -->
          <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <AdminIcon name="eye" class="w-4 h-4 text-sky-400" />
                <h3 class="text-sm font-bold text-white">صفحات در حال مطالعه (هم‌اکنون)</h3>
              </div>
              <span class="text-xs text-zinc-400 font-mono">{{ liveStats.active_pages?.length || 0 }} مسیر</span>
            </div>

            <div v-if="!liveStats.active_pages || liveStats.active_pages.length === 0" class="py-8 text-center text-xs text-zinc-500">
              در حال حاضر کاربری روی صفحات سایت نیست.
            </div>
            <div v-else class="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              <div
                v-for="p in liveStats.active_pages"
                :key="p.url"
                class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-sky-500/30 transition text-xs"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <code class="font-mono text-zinc-200 truncate">{{ p.url }}</code>
                </div>
                <span class="px-2.5 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 font-bold font-mono text-xs">
                  {{ p.count }} کاربر فعال
                </span>
              </div>
            </div>
          </div>

          <!-- Real-Time Live Event Stream Ticker -->
          <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <AdminIcon name="clock" class="w-4 h-4 text-emerald-400" />
                <h3 class="text-sm font-bold text-white">جریان رویدادهای زنده (Live Event Stream)</h3>
              </div>
              <span class="text-xs text-zinc-400 font-mono">{{ liveStats.live_events?.length || 0 }} رویداد</span>
            </div>

            <div v-if="!liveStats.live_events || liveStats.live_events.length === 0" class="py-8 text-center text-xs text-zinc-500">
              هنوز رویدادی در ۱۵ دقیقه اخیر ثبت نشده است.
            </div>
            <div v-else class="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              <div
                v-for="ev in liveStats.live_events.slice(0, 20)"
                :key="ev.id"
                class="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-white/5 text-xs hover:border-emerald-500/20 transition"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span
                    class="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 border"
                    :class="[formatFriendlyFingerprint(ev.fingerprint, ev.user_agent).palette.bg, formatFriendlyFingerprint(ev.fingerprint, ev.user_agent).palette.text, formatFriendlyFingerprint(ev.fingerprint, ev.user_agent).palette.border]"
                  >
                    {{ formatFriendlyFingerprint(ev.fingerprint, ev.user_agent).avatarChar }}
                  </span>
                  <div class="flex flex-col min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="font-bold text-zinc-200 truncate text-[11px]">
                        {{ ev.label || (ev.event_name === 'page_view' ? 'بازدید صفحه' : ev.event_name) }}
                      </span>
                      <span class="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400 font-mono">
                        {{ ev.event_name }}
                      </span>
                    </div>
                    <code class="text-[10px] text-zinc-500 truncate font-mono">{{ ev.url }}</code>
                  </div>
                </div>
                <span class="text-[10px] text-zinc-500 font-mono shrink-0">
                  {{ formatTimeAgo(ev.timestamp) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Active Visitor Journeys -->
        <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <h3 class="text-sm font-bold text-white">کاربران فعال آنلاین و جریان تعامل زنده</h3>
            </div>
            <span class="text-xs text-zinc-400 font-mono">{{ liveStats.active_sessions?.length || 0 }} نشست آنلاین</span>
          </div>

          <div v-if="!liveStats.active_sessions || liveStats.active_sessions.length === 0" class="py-12 text-center text-xs text-zinc-500">
            در حال حاضر کاربری آنلاین نیست. به محض ورود کاربر به سایت، این بخش بلافاصله پر می‌شود.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="s in liveStats.active_sessions"
              :key="s.session_id"
              class="p-4 rounded-2xl bg-zinc-950/70 border border-emerald-500/20 hover:border-emerald-500/40 transition space-y-3"
            >
              <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2.5 flex-wrap">
                  <div
                    class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border"
                    :class="[formatFriendlyFingerprint(s.fingerprint, s.user_agent).palette.bg, formatFriendlyFingerprint(s.fingerprint, s.user_agent).palette.text, formatFriendlyFingerprint(s.fingerprint, s.user_agent).palette.border]"
                  >
                    {{ formatFriendlyFingerprint(s.fingerprint, s.user_agent).avatarChar }}
                  </div>
                  <span class="font-bold text-zinc-100">
                    {{ formatFriendlyFingerprint(s.fingerprint, s.user_agent).label }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    🟢 آنلاین
                  </span>
                  <span
                    class="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 text-[11px] font-bold flex items-center gap-1"
                  >
                    <AdminIcon :name="formatFriendlyFingerprint(s.fingerprint, s.user_agent).device.icon" class="w-3 h-3 text-zinc-400" />
                    <span>{{ formatFriendlyFingerprint(s.fingerprint, s.user_agent).device.label }}</span>
                  </span>
                  <span
                    class="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 text-[11px] font-bold flex items-center gap-1"
                  >
                    <AdminIcon :name="formatFriendlyFingerprint(s.fingerprint, s.user_agent).browser.icon" class="w-3 h-3 text-zinc-400" />
                    <span>{{ formatFriendlyFingerprint(s.fingerprint, s.user_agent).browser.name }}</span>
                  </span>
                  <span class="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-400 text-[11px] font-mono flex items-center gap-1">
                    <AdminIcon name="map-pin" class="w-3 h-3 text-emerald-400" />
                    <span>{{ s.region || 'ایران' }}</span>
                  </span>
                </div>
                <div class="flex items-center gap-3 text-zinc-400 font-mono text-xs">
                  <span class="text-emerald-400 font-bold">{{ formatDuration(s.duration_sec) }}</span>
                  <span>•</span>
                  <span>{{ s.page_count }} صفحه</span>
                  <span>•</span>
                  <span class="text-emerald-300 font-bold">{{ formatTimeAgo(s.last_seen) }}</span>
                </div>
              </div>

              <!-- DAG Journey Ribbon for Live Session -->
              <div class="p-3 rounded-xl bg-zinc-900/60 border border-white/5 overflow-x-auto custom-scrollbar">
                <div class="flex items-center gap-2 min-w-max py-1">
                  <template v-for="(step, stIdx) in (s.journey_steps && s.journey_steps.length > 0 ? s.journey_steps : s.pages.map((p, i) => ({ step: i + 1, type: 'page', title: p, subtitle: p, timestamp: '' })))" :key="stIdx">
                    <div
                      class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
                      :class="step.type === 'landing' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' : 'bg-zinc-900 border-white/10 text-zinc-200'"
                    >
                      <span class="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center font-bold text-zinc-400">
                        {{ stIdx + 1 }}
                      </span>
                      <span class="font-bold text-[11px]">{{ step.title }}</span>
                    </div>
                    <AdminIcon
                      v-if="stIdx < (s.journey_steps?.length || s.pages.length) - 1"
                      name="arrow-left"
                      class="w-3 h-3 text-zinc-600 shrink-0"
                    />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Alias Editing Modal -->
    <div
      v-if="isAliasModalOpen"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999999] flex items-center justify-center p-4"
    >
      <div class="w-full max-w-sm rounded-2xl bg-zinc-900 border border-white/10 p-5 space-y-4 shadow-2xl">
        <h4 class="text-sm font-bold text-white flex items-center gap-2">
          <AdminIcon name="pencil" class="w-4 h-4 text-emerald-400" />
          تغییر نام مستعار کاربر / دستگاه
        </h4>
        <p class="text-xs text-zinc-400">
          برای این اثر انگشت یک نام مشخص تعیین کنید (مثلاً «لپ‌تاپ شرکت»، «مشتری زعفران» و ...):
        </p>
        <input
          v-model="aliasInputText"
          type="text"
          placeholder="نام مستعار را وارد کنید..."
          class="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
          @keyup.enter="saveAlias"
        />
        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            @click="isAliasModalOpen = false"
            class="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold transition hover:bg-zinc-700 cursor-pointer"
          >
            انصراف
          </button>
          <button
            type="button"
            @click="saveAlias"
            class="px-4 py-1.5 rounded-xl bg-najmgreen text-white text-xs font-bold transition hover:bg-emerald-700 cursor-pointer"
          >
            ذخیره نام
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'
import type { TrafficStatsOverview, SessionSummary, LiveRealTimeStats } from '~/types/telemetry'
import { getClientFingerprint, isDeviceExcluded, setDeviceExcluded } from '~/composables/useTracker'
import {
  formatFriendlyFingerprint,
  saveFingerprintAlias,
  getStoredAliases
} from '~/composables/useFriendlyFingerprint'

definePageMeta({
  layout: 'dash'
})

// Dual-Mode: 'historical' (گزارش تاریخی و آرشیو) vs 'live' (رصد لحظه‌ای زنده)
const currentMode = ref<'historical' | 'live'>('historical')

const loading = ref(false)
const liveLoading = ref(false)
const fetchError = ref('')
const togglingExclusion = ref(false)
const includeExcluded = ref(false)
const excludeAdmin = ref(true)
const selectedTimeRange = ref<'1h' | '24h' | '7d' | '30d' | 'all'>('24h')

const currentFingerprint = ref('')
const isCurrentExcluded = ref(false)
const activeUtmFilter = ref('')
const activeUserFilter = ref('')
const excludedFpsList = ref<string[]>([])
const excludedPagesList = ref<string[]>([])
const searchQuery = ref('')
const utmTab = ref<'source' | 'campaign' | 'medium'>('source')

// Live mode auto-refresh interval (in seconds, 0 = off)
const liveRefreshInterval = ref<number>(5)
let liveIntervalTimer: any = null

// Alias modal state
const isAliasModalOpen = ref(false)
const targetFpToAlias = ref('')
const aliasInputText = ref('')

const timeRangeOptions = [
  { label: '۱ ساعت اخیر', value: '1h' },
  { label: '۲۴ ساعت اخیر', value: '24h' },
  { label: '۷ روز اخیر', value: '7d' },
  { label: '۳۰ روز اخیر', value: '30d' },
  { label: 'کل تاریخچه', value: 'all' }
]

const stats = ref<Partial<TrafficStatsOverview>>({
  total_sessions: 0,
  total_pageviews: 0,
  total_events: 0,
  avg_duration_sec: 0,
  bounce_rate_pct: 0,
  total_historical_sessions: 0,
  utm_sources: [],
  utm_campaigns: [],
  utm_mediums: [],
  google_queries: [],
  source_breakdown: [],
  device_breakdown: [],
  browser_breakdown: [],
  region_breakdown: [],
  page_flows: [],
  top_landing_pages: [],
  hourly_timeline: [],
  top_clicked_targets: [],
  debounce_stats: {
    total_debounced_scrolls: 0,
    avg_dwell_before_stop: 0,
    hesitations: 0
  },
  excluded_fingerprints: []
})

const liveStats = ref<LiveRealTimeStats>({
  active_visitors: 0,
  active_sessions: [],
  live_events: [],
  active_pages: [],
  timestamp: ''
})

const sessions = ref<SessionSummary[]>([])

const currentFpMeta = computed(() => {
  return formatFriendlyFingerprint(currentFingerprint.value, typeof navigator !== 'undefined' ? navigator.userAgent : null)
})

// Filtered sessions list
const filteredSessions = computed(() => {
  return sessions.value.filter((s) => {
    if (activeUserFilter.value && s.fingerprint !== activeUserFilter.value) return false
    if (activeUtmFilter.value) {
      const u1 = (s.utm_source || '').toLowerCase()
      const u2 = (s.utm_campaign || '').toLowerCase()
      if (u1 !== activeUtmFilter.value && u2 !== activeUtmFilter.value) return false
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim()
      const fpMatch = (s.fingerprint || '').toLowerCase().includes(q)
      const sidMatch = (s.session_id || '').toLowerCase().includes(q)
      const ipMatch = (s.ip || '').toLowerCase().includes(q)
      const regMatch = (s.region || '').toLowerCase().includes(q)
      const pageMatch = s.pages.some((p) => p.toLowerCase().includes(q))
      if (!fpMatch && !sidMatch && !ipMatch && !regMatch && !pageMatch) return false
    }
    return true
  })
})

// SVG Area & Line Chart calculations
const timelineChartData = computed(() => {
  const points = stats.value.hourly_timeline || []
  if (points.length === 0) return { areaPoints: '', linePoints: '', sessionsLinePoints: '', maxPv: 10, items: [] }

  const maxPv = Math.max(1, ...points.map((p) => p.pageviews), ...points.map((p) => p.sessions))
  const width = 800
  const height = 180
  const padX = 20
  const padY = 20
  const chartW = width - padX * 2
  const chartH = height - padY * 2

  const coords = points.map((p, idx) => {
    const x = padX + (idx / Math.max(1, points.length - 1)) * chartW
    const yPv = height - padY - (p.pageviews / maxPv) * chartH
    const ySes = height - padY - (p.sessions / maxPv) * chartH
    return { ...p, x, yPv, ySes }
  })

  const linePv = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.yPv.toFixed(1)}`).join(' ')
  const areaPv = `${linePv} L ${coords[coords.length - 1].x.toFixed(1)} ${(height - padY).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(height - padY).toFixed(1)} Z`
  const lineSes = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.ySes.toFixed(1)}`).join(' ')

  return { areaPoints: areaPv, linePoints: linePv, sessionsLinePoints: lineSes, maxPv, items: coords }
})

const hoveredChartItem = ref<any>(null)

function getAuthHeaders(): Record<string, string> {
  const adminCookie = useCookie('pb_admin')
  const headers: Record<string, string> = {}
  if (adminCookie.value) {
    headers['Authorization'] = `Bearer ${adminCookie.value}`
  }
  return headers
}

async function fetchData() {
  loading.value = true
  fetchError.value = ''
  try {
    const headers = getAuthHeaders()
    const params = new URLSearchParams()
    params.set('include_excluded', includeExcluded.value ? 'true' : 'false')
    params.set('exclude_admin', excludeAdmin.value ? 'true' : 'false')
    params.set('time_range', selectedTimeRange.value)
    if (excludedFpsList.value.length > 0) {
      params.set('exclude_fps', excludedFpsList.value.join(','))
    }
    if (excludedPagesList.value.length > 0) {
      params.set('exclude_pages', excludedPagesList.value.join(','))
    }
    if (activeUtmFilter.value) {
      params.set('filter_utm', activeUtmFilter.value)
    }

    const [trafficRes, sessionsRes] = await Promise.all([
      $fetch<{ stats: TrafficStatsOverview }>(`/api/analytics/traffic?${params.toString()}`, {
        credentials: 'include',
        headers
      }),
      $fetch<{ sessions: SessionSummary[] }>(`/api/analytics/sessions?limit=100&${params.toString()}`, {
        credentials: 'include',
        headers
      })
    ])

    if (trafficRes?.stats) {
      stats.value = trafficRes.stats
    }
    if (sessionsRes?.sessions) {
      sessions.value = sessionsRes.sessions
    }
  } catch (err: any) {
    console.error('Error fetching traffic stats:', err)
    fetchError.value = err?.data?.statusMessage || err?.statusMessage || err?.message || 'خطا در ارتباط با سرور'
  } finally {
    loading.value = false
  }
}

async function fetchLiveStats() {
  liveLoading.value = true
  try {
    const headers = getAuthHeaders()
    const res = await $fetch<{ live: LiveRealTimeStats }>(`/api/analytics/live?minutes=15&exclude_admin=${excludeAdmin.value}`, {
      credentials: 'include',
      headers
    })
    if (res?.live) {
      liveStats.value = res.live
    }
  } catch (err: any) {
    console.error('Error fetching live stats:', err)
  } finally {
    liveLoading.value = false
  }
}

function switchMode(mode: 'historical' | 'live') {
  currentMode.value = mode
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('najm_traffic_mode', mode)
  }
  if (mode === 'live') {
    fetchLiveStats()
    startLivePolling()
  } else {
    stopLivePolling()
    fetchData()
  }
}

function startLivePolling() {
  stopLivePolling()
  if (liveRefreshInterval.value > 0) {
    liveIntervalTimer = setInterval(() => {
      if (currentMode.value === 'live') {
        fetchLiveStats()
      }
    }, liveRefreshInterval.value * 1000)
  }
}

function stopLivePolling() {
  if (liveIntervalTimer) {
    clearInterval(liveIntervalTimer)
    liveIntervalTimer = null
  }
}

function selectAllHistory() {
  selectedTimeRange.value = 'all'
  fetchData()
}

async function toggleDeviceExclusion() {
  if (!currentFingerprint.value) return
  togglingExclusion.value = true
  const nextExcluded = !isCurrentExcluded.value

  try {
    await $fetch('/api/analytics/exclude-device', {
      method: 'POST',
      body: {
        action: nextExcluded ? 'exclude' : 'include',
        fingerprint: currentFingerprint.value
      }
    })

    setDeviceExcluded(nextExcluded)
    isCurrentExcluded.value = nextExcluded
    await fetchData()
  } catch (err) {
    console.error('Failed to toggle exclusion:', err)
  } finally {
    togglingExclusion.value = false
  }
}

function openAliasModal(fp: string) {
  targetFpToAlias.value = fp
  const aliases = getStoredAliases()
  aliasInputText.value = aliases[fp] || ''
  isAliasModalOpen.value = true
}

function saveAlias() {
  if (targetFpToAlias.value) {
    saveFingerprintAlias(targetFpToAlias.value, aliasInputText.value)
  }
  isAliasModalOpen.value = false
}

function filterByUser(fp: string) {
  activeUserFilter.value = activeUserFilter.value === fp ? '' : fp
}

function filterByUtm(utm: string) {
  activeUtmFilter.value = activeUtmFilter.value === utm ? '' : utm
  fetchData()
}

function temporarilyExcludeFp(fp: string) {
  if (!excludedFpsList.value.includes(fp)) {
    excludedFpsList.value.push(fp)
    fetchData()
  }
}

function removeExcludedFp(fp: string) {
  excludedFpsList.value = excludedFpsList.value.filter((f) => f !== fp)
  fetchData()
}

function temporarilyExcludePage(page: string) {
  if (!excludedPagesList.value.includes(page)) {
    excludedPagesList.value.push(page)
    fetchData()
  }
}

function removeExcludedPage(page: string) {
  excludedPagesList.value = excludedPagesList.value.filter((p) => p !== page)
  fetchData()
}

function clearAllFilters() {
  activeUtmFilter.value = ''
  activeUserFilter.value = ''
  excludedFpsList.value = []
  excludedPagesList.value = []
  searchQuery.value = ''
  fetchData()
}

function formatNumber(num?: number): string {
  if (num == null) return '۰'
  return new Intl.NumberFormat('fa-IR').format(num)
}

function formatDuration(sec?: number): string {
  if (!sec || sec < 1) return '۰ ثانیه'
  if (sec < 60) return `${sec} ثانیه`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m} د ${s} ث`
}

function formatTimeAgo(isoString: string): string {
  if (!isoString) return ''
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000))
  if (diffSec < 60) return 'هم‌اکنون'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} دقیقه پیش`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ساعت پیش`
  return `${Math.floor(diffSec / 86400)} روز پیش`
}

function getSourceColor(type?: string): string {
  switch (type) {
    case 'google_organic': return 'bg-emerald-500'
    case 'google_ads': return 'bg-amber-500'
    case 'direct': return 'bg-sky-500'
    case 'referral': return 'bg-rose-500'
    case 'social': return 'bg-purple-500'
    case 'utm': return 'bg-teal-500'
    default: return 'bg-zinc-500'
  }
}

function getSourceLabel(type?: string): string {
  switch (type) {
    case 'google_organic': return 'گوگل ارگانیک'
    case 'google_ads': return 'تبلیغات گوگل'
    case 'direct': return 'مستقیم'
    case 'referral': return 'معرف'
    case 'social': return 'شبکه اجتماعی'
    case 'utm': return 'کمپین UTM'
    default: return 'سایر'
  }
}

function onIncomingLiveTelemetry(evt: any) {
  if (currentMode.value === 'live') {
    fetchLiveStats()
  }
}

onMounted(() => {
  currentFingerprint.value = getClientFingerprint()
  isCurrentExcluded.value = isDeviceExcluded()

  if (typeof localStorage !== 'undefined') {
    const savedMode = localStorage.getItem('najm_traffic_mode')
    if (savedMode === 'live' || savedMode === 'historical') {
      currentMode.value = savedMode
    }
  }

  if (currentMode.value === 'live') {
    fetchLiveStats()
    startLivePolling()
  } else {
    fetchData()
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('najm:fp-alias-updated', () => {
      sessions.value = [...sessions.value]
    })
    window.addEventListener('najm:telemetry-event', onIncomingLiveTelemetry)
  }
})

onBeforeUnmount(() => {
  stopLivePolling()
  if (typeof window !== 'undefined') {
    window.removeEventListener('najm:telemetry-event', onIncomingLiveTelemetry)
  }
})
</script>
