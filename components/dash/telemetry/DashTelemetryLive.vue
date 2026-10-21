<!-- components/dash/telemetry/DashTelemetryLive.vue -->
<template>
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
            {{ formatFaNumber(liveStats.active_visitors) }}
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
            {{ formatFaNumber(liveStats.active_pages?.length || 0) }}
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
            {{ formatFaNumber(liveStats.live_events?.length || 0) }}
          </span>
          <span class="text-xs text-zinc-400">رویداد تعاملی</span>
        </div>
        <p class="text-[11px] text-zinc-500 mt-1">کلیک، توقف و انتقال زنده</p>
      </div>

      <!-- Auto-Refresh Control -->
      <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">بروزرسانی خودکار استریم</span>
          <AdminIcon name="refresh" class="w-4 h-4 text-purple-400" :class="{ 'animate-spin': loading }" />
        </div>
        <div class="flex items-center gap-1.5 mt-2">
          <button
            type="button"
            @click="$emit('change-interval', 5)"
            class="px-2 py-0.5 rounded text-xs font-mono transition cursor-pointer"
            :class="refreshInterval === 5 ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400 hover:text-white'"
          >
            {{ formatFaNumber(5) }}ث
          </button>
          <button
            type="button"
            @click="$emit('change-interval', 10)"
            class="px-2 py-0.5 rounded text-xs font-mono transition cursor-pointer"
            :class="refreshInterval === 10 ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400 hover:text-white'"
          >
            {{ formatFaNumber(10) }}ث
          </button>
          <button
            type="button"
            @click="$emit('change-interval', 0)"
            class="px-2 py-0.5 rounded text-xs font-mono transition cursor-pointer"
            :class="refreshInterval === 0 ? 'bg-rose-500 text-white font-bold' : 'bg-zinc-800 text-zinc-400 hover:text-white'"
          >
            خاموش
          </button>
        </div>
        <p class="text-[11px] text-zinc-500 mt-1">
          آخرین پالس: {{ liveStats.timestamp ? formatTimeAgoFa(liveStats.timestamp) : 'هم‌اکنون' }}
        </p>
      </div>
    </div>

    <!-- Active Pages & Live Event Stream Ticker -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Active Pages List -->
      <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdminIcon name="eye" class="w-4 h-4 text-sky-400" />
            <h3 class="text-sm font-bold text-white">صفحات در حال مطالعه (هم‌اکنون)</h3>
          </div>
          <span class="text-xs text-zinc-400 font-mono">{{ formatFaNumber(liveStats.active_pages?.length || 0) }} مسیر</span>
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
            <div class="flex items-center gap-2 shrink-0">
              <span class="px-2.5 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 font-bold font-mono text-xs">
                {{ formatFaNumber(p.count) }} کاربر فعال
              </span>
              <a
                :href="`${p.url}${p.url.includes('?') ? '&' : '?'}lens=true`"
                target="_blank"
                rel="noopener noreferrer"
                class="px-2 py-0.5 rounded bg-zinc-800 hover:bg-emerald-600 text-emerald-400 hover:text-white transition cursor-pointer text-[10px]"
                title="مشاهده Lens روی این صفحه"
              >
                لنز ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-Time Live Event Stream Ticker -->
      <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AdminIcon name="clock" class="w-4 h-4 text-emerald-400" />
            <h3 class="text-sm font-bold text-white">جریان رویدادهای زنده (Live Event Flight Recorder)</h3>
          </div>
          <span class="text-xs text-zinc-400 font-mono">{{ formatFaNumber(liveStats.live_events?.length || 0) }} رویداد</span>
        </div>

        <div v-if="!liveStats.live_events || liveStats.live_events.length === 0" class="py-8 text-center text-xs text-zinc-500">
          هنوز رویدادی در ۱۵ دقیقه اخیر ثبت نشده است.
        </div>
        <div v-else class="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          <div
            v-for="ev in liveStats.live_events.slice(0, 25)"
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
              {{ formatTimeAgoFa(ev.timestamp) }}
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
        <span class="text-xs text-zinc-400 font-mono">{{ formatFaNumber(liveStats.active_sessions?.length || 0) }} نشست آنلاین</span>
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
              <span class="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 text-[11px] font-bold flex items-center gap-1">
                <AdminIcon :name="formatFriendlyFingerprint(s.fingerprint, s.user_agent).device.icon" class="w-3 h-3 text-zinc-400" />
                <span>{{ formatFriendlyFingerprint(s.fingerprint, s.user_agent).device.label }}</span>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 text-[11px] font-bold flex items-center gap-1">
                <AdminIcon :name="formatFriendlyFingerprint(s.fingerprint, s.user_agent).browser.icon" class="w-3 h-3 text-zinc-400" />
                <span>{{ formatFriendlyFingerprint(s.fingerprint, s.user_agent).browser.name }}</span>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-400 text-[11px] font-mono flex items-center gap-1">
                <AdminIcon name="map-pin" class="w-3 h-3 text-emerald-400" />
                <span>{{ s.region || 'ایران' }}</span>
              </span>
            </div>
            <div class="flex items-center gap-3 text-zinc-400 font-mono text-xs">
              <span class="text-emerald-400 font-bold">{{ formatDurationFa(s.duration_sec) }}</span>
              <span>•</span>
              <span>{{ formatFaNumber(s.page_count) }} صفحه</span>
              <span>•</span>
              <span class="text-emerald-300 font-bold">{{ formatTimeAgoFa(s.last_seen) }}</span>
            </div>
          </div>

          <!-- DAG Steps for Live Session -->
          <div class="p-3 rounded-xl bg-zinc-900/60 border border-white/5 overflow-x-auto custom-scrollbar">
            <div class="flex items-center gap-2 min-w-max py-1">
              <template v-for="(step, stIdx) in (s.journey_steps && s.journey_steps.length > 0 ? s.journey_steps : s.pages.map((p, i) => ({ step: i + 1, type: 'page', title: p, subtitle: p, timestamp: '' })))" :key="stIdx">
                <div
                  class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
                  :class="step.type === 'landing' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' : 'bg-zinc-900 border-white/10 text-zinc-200'"
                >
                  <span class="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center font-bold text-zinc-400">
                    {{ formatFaNumber(stIdx + 1) }}
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

<script setup lang="ts">
import AdminIcon from '~/components/admin/AdminIcon.vue'
import type { LiveRealTimeStats } from '~/types/telemetry'
import { formatFriendlyFingerprint } from '~/composables/useFriendlyFingerprint'

defineProps<{
  liveStats: LiveRealTimeStats
  loading?: boolean
  refreshInterval: number
}>()

defineEmits<{
  (e: 'change-interval', interval: number): void
}>()

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

function formatTimeAgoFa(isoString?: string): string {
  if (!isoString) return ''
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000))
  if (diffSec < 60) return 'هم‌اکنون'
  if (diffSec < 3600) return `${formatFaNumber(Math.floor(diffSec / 60))} دقیقه پیش`
  if (diffSec < 86400) return `${formatFaNumber(Math.floor(diffSec / 3600))} ساعت پیش`
  return `${formatFaNumber(Math.floor(diffSec / 86400))} روز پیش`
}
</script>
