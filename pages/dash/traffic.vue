<!-- pages/dash/traffic.vue -->
<template>
  <div class="space-y-6 select-none font-d4 text-white">
    <!-- Top Header & Live Beacon -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="text-xl sm:text-2xl font-bold text-white">تحلیل ترافیک و لنز رفتار کاربران (Traffic & Telemetry Lens)</h2>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Unified V2
          </span>
          <button
            type="button"
            @click="activeTab = 'live'"
            class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/20 transition"
          >
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{{ formatFaNumber(liveStats.active_visitors) }} آنلاین</span>
          </button>
        </div>
        <p class="text-xs sm:text-sm text-zinc-400 mt-1">
          یکپارچه‌سازی کامل تله‌متری با Lens: ردپای تعاملی کاربران (DAG)، نقشه حرارتی کلیک‌ها، تحلیل کمپین‌ها و استریم زنده.
        </p>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Time Range Selector -->
        <div class="flex items-center p-0.5 rounded-xl bg-zinc-950 border border-white/10 text-xs">
          <button
            v-for="opt in timeRangeOptions"
            :key="opt.value"
            type="button"
            @click="changeTimeRange(opt.value)"
            class="px-2.5 py-1 rounded-lg font-bold transition cursor-pointer"
            :class="selectedTimeRange === opt.value
              ? 'bg-emerald-500 text-zinc-950 shadow-sm font-black'
              : 'text-zinc-400 hover:text-white'"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- Exclude Admin Routes Toggle -->
        <label class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs font-semibold text-zinc-300 cursor-pointer hover:bg-zinc-800 transition">
          <input
            type="checkbox"
            v-model="excludeAdmin"
            @change="fetchData"
            class="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 cursor-pointer"
          />
          <span>حذف صفحات ادمین</span>
        </label>

        <!-- Refresh Button -->
        <button
          type="button"
          @click="fetchData"
          class="px-3.5 py-1.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
          :disabled="loading"
        >
          <AdminIcon name="refresh" class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
          <span>{{ loading ? 'دریافت...' : 'بروزرسانی' }}</span>
        </button>
      </div>
    </div>

    <!-- Unified Hub Navigation Tabs (4 Core Pillars) -->
    <div class="flex items-center p-1.5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-lg text-xs overflow-x-auto custom-scrollbar">
      <button
        type="button"
        @click="switchTab('overview')"
        class="px-4 py-2.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === 'overview' ? 'bg-emerald-500 text-zinc-950 shadow-md font-black' : 'text-zinc-400 hover:text-white'"
      >
        <AdminIcon name="chart-pie" class="w-4 h-4" />
        <span>📊 شاخص‌ها و منابع ورودی (Acquisition)</span>
      </button>

      <button
        type="button"
        @click="switchTab('heatmaps')"
        class="px-4 py-2.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === 'heatmaps' ? 'bg-emerald-500 text-zinc-950 shadow-md font-black' : 'text-zinc-400 hover:text-white'"
      >
        <AdminIcon name="sparkles" class="w-4 h-4" />
        <span>🔥 هیت‌مپ و لنز صفحات (Heatmap & Lens)</span>
      </button>

      <button
        type="button"
        @click="switchTab('journeys')"
        class="px-4 py-2.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === 'journeys' ? 'bg-emerald-500 text-zinc-950 shadow-md font-black' : 'text-zinc-400 hover:text-white'"
      >
        <AdminIcon name="clock" class="w-4 h-4" />
        <span>🌊 ردپا و سفر کاربر (User Journeys)</span>
      </button>

      <button
        type="button"
        @click="switchTab('live')"
        class="px-4 py-2.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap relative"
        :class="activeTab === 'live' ? 'bg-emerald-500 text-zinc-950 shadow-md font-black' : 'text-zinc-400 hover:text-white'"
      >
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>🔴 رصد زنده لنز (Flight Recorder)</span>
      </button>
    </div>

    <!-- Zero-Data Auto-Fallback Banner (if any) -->
    <div
      v-if="autoSwitchedNotice"
      class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between text-xs"
    >
      <div class="flex items-center gap-2">
        <span>💡</span>
        <span>{{ autoSwitchedNotice }}</span>
      </div>
      <button @click="autoSwitchedNotice = ''" class="text-amber-400 hover:text-white cursor-pointer mr-2">✕</button>
    </div>

    <!-- TAB 1: OVERVIEW & ACQUISITION -->
    <template v-if="activeTab === 'overview'">
      <!-- Executive KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <!-- 1. Total Sessions -->
        <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
          <div class="flex items-center justify-between">
            <span class="text-xs text-zinc-400">کل نشست‌ها (Sessions)</span>
            <AdminIcon name="users" class="w-4 h-4 text-emerald-400" />
          </div>
          <div class="flex items-baseline gap-1.5 mt-2">
            <span class="text-2xl font-bold font-mono text-emerald-400">
              {{ formatFaNumber(stats.total_sessions) }}
            </span>
            <span class="text-xs text-zinc-400">نشست</span>
          </div>
          <p class="text-[11px] text-zinc-500 mt-1">بازدیدهای ثبت‌شده در این بازه</p>
        </div>

        <!-- 2. Pageviews -->
        <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
          <div class="flex items-center justify-between">
            <span class="text-xs text-zinc-400">بازدید صفحات (Pageviews)</span>
            <AdminIcon name="eye" class="w-4 h-4 text-sky-400" />
          </div>
          <div class="flex items-baseline gap-1.5 mt-2">
            <span class="text-2xl font-bold font-mono text-sky-400">
              {{ formatFaNumber(stats.total_pageviews) }}
            </span>
            <span class="text-xs text-zinc-400">صفحه</span>
          </div>
          <p class="text-[11px] text-zinc-500 mt-1">
            میانگین {{ stats.total_sessions ? formatFaNumber(Math.round((stats.total_pageviews / stats.total_sessions) * 10) / 10) : '۰' }} صفحه/کاربر
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
              {{ formatFaNumber(stats.bounce_rate_pct) }}٪
            </span>
          </div>
          <p class="text-[11px] text-zinc-500 mt-1">زیر ۱۰ ثانیه و بدون تعامل بعدی</p>
        </div>

        <!-- 4. Avg Duration -->
        <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
          <div class="flex items-center justify-between">
            <span class="text-xs text-zinc-400">میانگین ماندگاری</span>
            <AdminIcon name="clock" class="w-4 h-4 text-purple-400" />
          </div>
          <div class="flex items-baseline gap-1.5 mt-2">
            <span class="text-2xl font-bold font-mono text-purple-400">
              {{ formatDurationFa(stats.avg_duration_sec) }}
            </span>
          </div>
          <p class="text-[11px] text-zinc-500 mt-1">زمان سپری‌شده در وب‌سایت</p>
        </div>

        <!-- 5. Total Events -->
        <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg col-span-2 lg:col-span-1">
          <div class="flex items-center justify-between">
            <span class="text-xs text-zinc-400">رویدادهای ثبت‌شده</span>
            <AdminIcon name="adjustments" class="w-4 h-4 text-teal-400" />
          </div>
          <div class="flex items-baseline gap-1.5 mt-2">
            <span class="text-2xl font-bold font-mono text-teal-400">
              {{ formatFaNumber(stats.total_events) }}
            </span>
            <span class="text-xs text-zinc-400">رویداد</span>
          </div>
          <p class="text-[11px] text-zinc-500 mt-1">تپ، اسکرول، بازدید و فرم</p>
        </div>
      </div>

      <!-- Traffic Channels & Devices -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Traffic Sources Breakdown -->
        <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AdminIcon name="globe" class="w-4 h-4 text-emerald-400" />
              <h3 class="text-sm font-bold text-white">ترکیب کانال‌های ورودی (Source Channels)</h3>
            </div>
            <span class="text-xs text-zinc-400 font-mono">{{ formatFaNumber(stats.source_breakdown?.length || 0) }} کانال</span>
          </div>

          <div v-if="!stats.source_breakdown || stats.source_breakdown.length === 0" class="py-8 text-center text-xs text-zinc-500">
            هنوز داده‌ای برای کانال‌های ورودی در این بازه ثبت نشده است.
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
                  <span class="text-emerald-400 font-bold">{{ formatFaNumber(src.count) }} ورود</span>
                  <span class="text-zinc-500">({{ formatFaNumber(src.percentage) }}٪)</span>
                </div>
              </div>
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

        <!-- Devices & Browsers Breakdown -->
        <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AdminIcon name="desktop" class="w-4 h-4 text-sky-400" />
              <h3 class="text-sm font-bold text-white">تفکیک دیوایس‌ها و مرورگرها</h3>
            </div>
            <span class="text-xs text-zinc-400 font-mono">{{ formatFaNumber(stats.device_breakdown?.length || 0) }} دستگاه</span>
          </div>

          <div v-if="!stats.device_breakdown || stats.device_breakdown.length === 0" class="py-8 text-center text-xs text-zinc-500">
            داده‌ای برای دستگاه‌ها ثبت نشده است.
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
                  <span class="text-emerald-400 font-bold">{{ formatFaNumber(dev.count) }} نشست</span>
                  <span class="text-zinc-500">({{ formatFaNumber(dev.percentage) }}٪)</span>
                </div>
              </div>
              <div class="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div class="h-full rounded-full bg-emerald-500 transition-all duration-500" :style="{ width: dev.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- TAB 2: HEATMAPS & IN-SITU LENS -->
    <template v-else-if="activeTab === 'heatmaps'">
      <DashTelemetryHeatmap
        :page-interactions="stats.page_interactions"
        :top-clicked-targets="stats.top_clicked_targets"
        :debounce-stats="stats.debounce_stats"
      />
    </template>

    <!-- TAB 3: USER JOURNEYS (DAG) -->
    <template v-else-if="activeTab === 'journeys'">
      <DashTelemetryJourneys
        :sessions="sessions"
        :active-user-filter="activeUserFilter"
        :active-utm-filter="activeUtmFilter"
        @filter-user="onFilterUser"
        @filter-utm="onFilterUtm"
        @exclude-fp="onExcludeFp"
        @exclude-page="onExcludePage"
        @open-alias-modal="openAliasModal"
        @clear-user-filter="activeUserFilter = ''; fetchData()"
        @clear-utm-filter="activeUtmFilter = ''; fetchData()"
      />
    </template>

    <!-- TAB 4: LIVE FLIGHT RECORDER -->
    <template v-else-if="activeTab === 'live'">
      <DashTelemetryLive
        :live-stats="liveStats"
        :loading="liveLoading"
        :refresh-interval="liveRefreshInterval"
        @change-interval="onChangeLiveInterval"
      />
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
            ذخیره
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'
import DashTelemetryHeatmap from '~/components/dash/telemetry/DashTelemetryHeatmap.vue'
import DashTelemetryJourneys from '~/components/dash/telemetry/DashTelemetryJourneys.vue'
import DashTelemetryLive from '~/components/dash/telemetry/DashTelemetryLive.vue'
import type { TrafficStatsOverview, SessionSummary, LiveRealTimeStats } from '~/types/telemetry'
import {
  saveFingerprintAlias,
  getStoredAliases
} from '~/composables/useFriendlyFingerprint'

definePageMeta({
  layout: 'dash'
})

const activeTab = ref<'overview' | 'heatmaps' | 'journeys' | 'live'>('overview')
const selectedTimeRange = ref<'1h' | '24h' | '7d' | '30d' | 'all'>('all')
const excludeAdmin = ref(true)
const loading = ref(false)
const liveLoading = ref(false)
const autoSwitchedNotice = ref('')

const activeUserFilter = ref('')
const activeUtmFilter = ref('')
const excludedFpsList = ref<string[]>([])
const excludedPagesList = ref<string[]>([])

// Live mode timer
const liveRefreshInterval = ref(5)
let liveTimer: any = null

// Alias modal state
const isAliasModalOpen = ref(false)
const targetFpToAlias = ref('')
const aliasInputText = ref('')

const timeRangeOptions = [
  { label: 'کل تاریخچه', value: 'all' },
  { label: '۳۰ روز اخیر', value: '30d' },
  { label: '۷ روز اخیر', value: '7d' },
  { label: '۲۴ ساعت اخیر', value: '24h' },
  { label: '۱ ساعت اخیر', value: '1h' }
]

const stats = ref<Partial<TrafficStatsOverview>>({
  total_sessions: 0,
  total_pageviews: 0,
  total_events: 0,
  avg_duration_sec: 0,
  bounce_rate_pct: 0,
  source_breakdown: [],
  device_breakdown: [],
  browser_breakdown: [],
  page_interactions: [],
  top_clicked_targets: [],
  debounce_stats: {
    total_debounced_scrolls: 0,
    avg_dwell_before_stop: 0,
    hesitations: 0
  }
})

const sessions = ref<SessionSummary[]>([])

const liveStats = ref<LiveRealTimeStats>({
  active_visitors: 0,
  active_sessions: [],
  live_events: [],
  active_pages: [],
  timestamp: ''
})

function switchTab(tab: 'overview' | 'heatmaps' | 'journeys' | 'live') {
  activeTab.value = tab
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('najm_traffic_tab', tab)
  }
  if (tab === 'live') {
    fetchLiveStats()
    startLivePolling()
  } else {
    stopLivePolling()
  }
}

function changeTimeRange(val: any) {
  selectedTimeRange.value = val
  fetchData()
}

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
  try {
    const headers = getAuthHeaders()
    const params = new URLSearchParams()
    params.set('exclude_admin', excludeAdmin.value ? 'true' : 'false')
    params.set('time_range', selectedTimeRange.value)
    if (excludedFpsList.value.length > 0) params.set('exclude_fps', excludedFpsList.value.join(','))
    if (excludedPagesList.value.length > 0) params.set('exclude_pages', excludedPagesList.value.join(','))
    if (activeUtmFilter.value) params.set('filter_utm', activeUtmFilter.value)

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
      // Smart Auto-Fallback: If 24h or current range is empty but historical sessions exist, auto-select 'all'
      if (stats.value.total_sessions === 0 && (stats.value.total_historical_sessions || 0) > 0 && selectedTimeRange.value === '24h') {
        selectedTimeRange.value = 'all'
        autoSwitchedNotice.value = `در بازه ۲۴ ساعت نشستی ثبت نشده بود؛ کل تاریخچه دیتابیس (${formatFaNumber(stats.value.total_historical_sessions)} نشست) به صورت خودکار لود شد.`
        fetchData()
        return
      }
    }
    if (sessionsRes?.sessions) {
      sessions.value = sessionsRes.sessions
    }
  } catch (err) {
    console.error('Failed to fetch telemetry data:', err)
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
  } catch (err) {
    console.error('Failed to fetch live telemetry:', err)
  } finally {
    liveLoading.value = false
  }
}

function startLivePolling() {
  stopLivePolling()
  if (liveRefreshInterval.value > 0) {
    liveTimer = setInterval(() => {
      if (activeTab.value === 'live') {
        fetchLiveStats()
      }
    }, liveRefreshInterval.value * 1000)
  }
}

function stopLivePolling() {
  if (liveTimer) {
    clearInterval(liveTimer)
    liveTimer = null
  }
}

function onChangeLiveInterval(val: number) {
  liveRefreshInterval.value = val
  if (val > 0) startLivePolling()
  else stopLivePolling()
}

function onFilterUser(fp: string) {
  activeUserFilter.value = activeUserFilter.value === fp ? '' : fp
}

function onFilterUtm(utm: string) {
  activeUtmFilter.value = activeUtmFilter.value === utm ? '' : utm
  fetchData()
}

function onExcludeFp(fp: string) {
  if (!excludedFpsList.value.includes(fp)) {
    excludedFpsList.value.push(fp)
    fetchData()
  }
}

function onExcludePage(pg: string) {
  if (!excludedPagesList.value.includes(pg)) {
    excludedPagesList.value.push(pg)
    fetchData()
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

function formatFaNumber(num?: number): string {
  if (num == null) return '۰'
  return new Intl.NumberFormat('fa-IR').format(num)
}

function formatDurationFa(sec?: number): string {
  if (!sec || sec < 1) return '۰ ثانیه'
  if (sec < 60) return `${formatFaNumber(sec)} ثانیه`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${formatFaNumber(m)} د ${formatFaNumber(s)} ث`
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

onMounted(() => {
  if (typeof localStorage !== 'undefined') {
    const savedTab = localStorage.getItem('najm_traffic_tab') as any
    if (['overview', 'heatmaps', 'journeys', 'live'].includes(savedTab)) {
      activeTab.value = savedTab
    }
  }

  fetchData()
  fetchLiveStats()

  if (activeTab.value === 'live') {
    startLivePolling()
  }
})

onBeforeUnmount(() => {
  stopLivePolling()
})
</script>
