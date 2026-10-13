<!-- pages/dash/traffic.vue -->
<template>
  <div class="space-y-6 select-none font-d4 text-white">
    <!-- Top Header & Actions -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl sm:text-2xl font-bold text-white">تحلیل ترافیک، ورودی گوگل و رفتار کاربر (Traffic & Journey)</h2>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Telemetry V2
          </span>
        </div>
        <p class="text-xs sm:text-sm text-zinc-400 mt-1">
          رصد دقیق منابع ورودی (UTM)، کلمات جستجوی گوگل، توقف‌ها و مکث‌های اسکرول (Debounces)، جریان حرکت بین صفحات و حذف دستگاه مدیر.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
        <!-- Include Excluded Devices Toggle -->
        <label class="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-300 cursor-pointer hover:bg-zinc-800 transition">
          <input
            type="checkbox"
            v-model="includeExcluded"
            @change="fetchData"
            class="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-0 cursor-pointer"
          />
          <span>نمایش لاگ دستگاه‌های مستثنی‌شده</span>
        </label>

        <!-- Refresh Button -->
        <button
          type="button"
          @click="fetchData"
          class="px-3.5 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
          :disabled="loading"
        >
          <AdminIcon name="refresh" class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
          <span>{{ loading ? 'در حال دریافت...' : 'بروزرسانی داده‌ها' }}</span>
        </button>
      </div>
    </div>

    <!-- Admin Device Fingerprint Exclusion Card -->
    <div class="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-start md:items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <AdminIcon name="shield-check" class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-bold text-zinc-200">اثر انگشت مرورگر شما (Browser Fingerprint):</span>
            <code class="px-2 py-0.5 rounded-lg bg-zinc-950 font-mono text-xs font-bold text-emerald-400 border border-white/5">
              {{ currentFingerprint || 'در حال محاسبه...' }}
            </code>
            <span
              v-if="isCurrentExcluded"
              class="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
            >
              مستثنی شده (ترافیک شما شمرده نمی‌شود)
            </span>
            <span
              v-else
              class="px-2 py-0.5 rounded-md text-xs font-bold bg-zinc-800 text-zinc-400 border border-white/5"
            >
              فعال (در آمار محاسبه می‌شود)
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

    <!-- Main Grid: Traffic Sources & UTM Campaigns -->
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
          هنوز داده‌ای برای کانال‌های ورودی ثبت نشده است.
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
                class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                :style="{ width: src.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- UTM Sources & Campaigns -->
      <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdminIcon name="tag" class="w-4 h-4 text-sky-400" />
            <h3 class="text-sm font-bold text-white">کمپین‌ها و پارامترهای UTM (utm_source)</h3>
          </div>
          <span class="text-xs text-zinc-400 font-mono">{{ stats.utm_sources?.length || 0 }} منبع</span>
        </div>

        <div v-if="!stats.utm_sources || stats.utm_sources.length === 0" class="py-8 text-center text-xs text-zinc-500">
          هنوز ورودی از طریق پارامترهای utm_source ثبت نشده است.
        </div>
        <div v-else class="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          <div
            v-for="utm in stats.utm_sources"
            :key="utm.name"
            class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-sky-500/30 transition text-xs"
          >
            <div class="flex items-center gap-2">
              <code class="px-2 py-1 rounded-md bg-sky-500/10 text-sky-300 font-mono font-bold text-xs border border-sky-500/20">
                {{ utm.name }}
              </code>
            </div>
            <div class="flex items-center gap-3 font-mono">
              <span class="text-white font-bold">{{ utm.count }} نشست</span>
              <span class="text-xs text-zinc-400">({{ utm.percentage }}٪)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Google Search Queries & Page Flows -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Google Search Queries -->
      <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdminIcon name="search" class="w-4 h-4 text-emerald-400" />
            <h3 class="text-sm font-bold text-white">کلمات جستجوی گوگل (Google Search Queries)</h3>
          </div>
          <span class="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
            SEO Keywords
          </span>
        </div>
        <p class="text-xs text-zinc-400">
          عباراتی که کاربران جستجو کردند و سپس از نتایج گوگل وارد سایت نجم شدند:
        </p>

        <div v-if="!stats.google_queries || stats.google_queries.length === 0" class="py-8 text-center text-xs text-zinc-500">
          هنوز عبارت جستجوی ارگانیک از رفررها استخراج نشده است.
        </div>
        <div v-else class="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          <div
            v-for="q in stats.google_queries"
            :key="q.query"
            class="p-3 rounded-xl bg-zinc-950/60 border border-white/5 space-y-1.5"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-white">«{{ q.query }}»</span>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                {{ q.count }} کلیک
              </span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-zinc-400 truncate">
              <span class="text-zinc-500">صفحه فرود:</span>
              <code class="text-zinc-300 font-mono">{{ q.landing_page }}</code>
            </div>
          </div>
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

    <!-- User Journeys Timeline Explorer -->
    <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <AdminIcon name="clock" class="w-4 h-4 text-amber-400" />
          <h3 class="text-sm font-bold text-white">ردپای زمانی کاربران اخیر (User Journeys & Timings)</h3>
        </div>
        <div class="text-xs text-zinc-400">
          نمایش {{ sessions.length }} نشست با جزئیات سفر و توقف‌ها
        </div>
      </div>

      <div v-if="sessions.length === 0" class="py-12 text-center text-xs text-zinc-500">
        نشستی برای نمایش یافت نشد.
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="s in sessions.slice(0, 10)"
          :key="s.session_id"
          class="p-4 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-white/15 transition space-y-3"
        >
          <!-- Session Header Row -->
          <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" :class="s.is_excluded ? 'bg-amber-400' : 'bg-emerald-400'"></span>
              <code class="font-mono text-zinc-300 font-bold text-xs">{{ s.session_id }}</code>
              <span v-if="s.is_excluded" class="px-1.5 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300">
                دستگاه مستثنی
              </span>
              <span class="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold text-xs">
                {{ getSourceLabel(s.source_type) }}
              </span>
              <span v-if="s.utm_source" class="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40 text-xs font-mono">
                UTM: {{ s.utm_source }}
              </span>
            </div>

            <div class="flex items-center gap-3 text-zinc-400 font-mono text-xs">
              <span>{{ formatDuration(s.duration_sec) }}</span>
              <span>•</span>
              <span>{{ s.page_count }} صفحه</span>
              <span>•</span>
              <span>{{ s.event_count }} رویداد</span>
              <span>•</span>
              <span>{{ formatTimeAgo(s.last_seen) }}</span>
            </div>
          </div>

          <!-- Journey Path Steps -->
          <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1">
            <div
              v-for="(pg, pIdx) in s.pages"
              :key="pIdx"
              class="flex items-center gap-2 shrink-0"
            >
              <div class="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/5 text-xs font-mono text-zinc-200 flex items-center gap-1.5">
                <span class="w-4 h-4 rounded-full bg-zinc-800 text-xs flex items-center justify-center font-bold text-zinc-400">
                  {{ pIdx + 1 }}
                </span>
                <span>{{ pg }}</span>
              </div>
              <AdminIcon
                v-if="pIdx < s.pages.length - 1"
                name="arrow-left"
                class="w-3 h-3 text-zinc-600 shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'
import type { TrafficStatsOverview, SessionSummary } from '~/types/telemetry'
import { getClientFingerprint, isDeviceExcluded, setDeviceExcluded } from '~/composables/useTracker'

definePageMeta({
  layout: 'dash'
})

const loading = ref(false)
const togglingExclusion = ref(false)
const includeExcluded = ref(false)
const currentFingerprint = ref('')
const isCurrentExcluded = ref(false)

const stats = ref<Partial<TrafficStatsOverview>>({
  total_sessions: 0,
  total_pageviews: 0,
  total_events: 0,
  avg_duration_sec: 0,
  bounce_rate_pct: 0,
  utm_sources: [],
  google_queries: [],
  source_breakdown: [],
  page_flows: [],
  top_landing_pages: [],
  debounce_stats: {
    total_debounced_scrolls: 0,
    avg_dwell_before_stop: 0,
    hesitations: 0
  },
  excluded_fingerprints: []
})

const sessions = ref<SessionSummary[]>([])

async function fetchData() {
  loading.value = true
  try {
    const inc = includeExcluded.value ? 'true' : 'false'
    const [trafficRes, sessionsRes] = await Promise.all([
      $fetch<{ stats: TrafficStatsOverview }>(`/api/analytics/traffic?include_excluded=${inc}`),
      $fetch<{ sessions: SessionSummary[] }>(`/api/analytics/sessions?limit=50&include_excluded=${inc}`)
    ])

    if (trafficRes && trafficRes.stats) {
      stats.value = trafficRes.stats
    }
    if (sessionsRes && sessionsRes.sessions) {
      sessions.value = sessionsRes.sessions
    }
  } catch (err) {
    console.error('Error fetching traffic stats:', err)
  } finally {
    loading.value = false
  }
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

function formatNumber(num?: number): string {
  if (num == null) return '0'
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

function getSourceLabel(type?: string): string {
  switch (type) {
    case 'google_organic': return 'گوگل ارگانیک'
    case 'google_ads': return 'تبلیغات گوگل'
    case 'direct': return 'مستقیم'
    case 'referral': return 'معرف'
    case 'social': return 'شبکه اجتماعی'
    case 'utm': return 'کمپین'
    default: return 'سایر'
  }
}

onMounted(() => {
  currentFingerprint.value = getClientFingerprint()
  isCurrentExcluded.value = isDeviceExcluded()
  fetchData()
})
</script>
