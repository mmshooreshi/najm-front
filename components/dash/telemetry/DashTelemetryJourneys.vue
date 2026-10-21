<!-- components/dash/telemetry/DashTelemetryJourneys.vue -->
<template>
  <div class="space-y-6">
    <!-- Header & Search Toolbar -->
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
            {{ formatFaNumber(filteredSessions.length) }} نشست
          </div>
        </div>
      </div>

      <!-- Active Filter Chips -->
      <div
        v-if="activeUserFilter || activeUtmFilter || searchQuery"
        class="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5 text-xs"
      >
        <span class="text-zinc-500 text-[11px]">فیلترها:</span>
        <span
          v-if="activeUserFilter"
          class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-mono"
        >
          کاربر: {{ activeUserFilter.slice(0, 8) }}...
          <button @click="$emit('clear-user-filter')" class="hover:text-white cursor-pointer mr-1">✕</button>
        </span>
        <span
          v-if="activeUtmFilter"
          class="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1 font-mono"
        >
          کمپین UTM: {{ activeUtmFilter }}
          <button @click="$emit('clear-utm-filter')" class="hover:text-white cursor-pointer mr-1">✕</button>
        </span>
        <span
          v-if="searchQuery"
          class="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1"
        >
          عبارت: «{{ searchQuery }}»
          <button @click="searchQuery = ''" class="hover:text-white cursor-pointer mr-1">✕</button>
        </span>
      </div>

      <!-- Sessions List -->
      <div v-if="filteredSessions.length === 0" class="py-12 text-center text-xs text-zinc-500">
        نشستی با فیلترهای مشخص‌شده یافت نشد.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="s in filteredSessions.slice(0, 30)"
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
                @click="$emit('open-alias-modal', s.fingerprint)"
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
                @click="$emit('filter-utm', s.utm_source)"
                class="px-2 py-0.5 rounded bg-sky-950/70 text-sky-300 border border-sky-800/40 text-[11px] font-mono cursor-pointer hover:bg-sky-900/80 transition"
                title="کلیک برای فیلتر بر اساس این UTM"
              >
                🏷️ {{ s.utm_source }}
              </span>

              <!-- User Filter / Exclude Quick Actions -->
              <button
                v-if="s.fingerprint"
                type="button"
                @click="$emit('filter-user', s.fingerprint)"
                class="px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer"
                :class="activeUserFilter === s.fingerprint ? 'bg-purple-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'"
                title="فیلتر فقط نشست‌های این کاربر"
              >
                🔍 فقط این کاربر
              </button>
              <button
                v-if="s.fingerprint"
                type="button"
                @click="$emit('exclude-fp', s.fingerprint)"
                class="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 hover:bg-rose-950/60 hover:text-rose-400 text-zinc-500 transition cursor-pointer"
                title="استثنا کردن موقت این کاربر از گزارش‌ها"
              >
                🚫 استثنا
              </button>
            </div>

            <!-- Session Stats Metrics -->
            <div class="flex items-center gap-3 text-zinc-400 font-mono text-xs shrink-0">
              <span class="text-emerald-400 font-bold">{{ formatDurationFa(s.duration_sec) }}</span>
              <span>•</span>
              <span>{{ formatFaNumber(s.page_count) }} صفحه</span>
              <span>•</span>
              <span>{{ formatFaNumber(s.event_count) }} رویداد ({{ formatFaNumber(s.tap_count) }} کلیک)</span>
              <span>•</span>
              <span class="text-zinc-500">{{ formatTimeAgoFa(s.last_seen) }}</span>
            </div>
          </div>

          <!-- DAG Journey Flow Ribbon -->
          <div class="p-3 rounded-xl bg-zinc-900/60 border border-white/5 overflow-x-auto custom-scrollbar">
            <div class="flex items-center gap-2 min-w-max py-1">
              <!-- Steps Loop -->
              <template v-for="(step, stIdx) in getJourneySteps(s)" :key="stIdx">
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
                      {{ formatFaNumber(stIdx + 1) }}
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
                    @click="$emit('exclude-page', step.subtitle || step.title)"
                    class="text-[10px] text-zinc-600 hover:text-rose-400 cursor-pointer mr-1"
                    title="استثنا کردن موقت این صفحه از گزارش‌ها"
                  >
                    🚫
                  </button>
                </div>

                <!-- Directed Arrow Connector -->
                <AdminIcon
                  v-if="stIdx < getJourneySteps(s).length - 1"
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
import { ref, computed } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'
import type { SessionSummary } from '~/types/telemetry'
import { formatFriendlyFingerprint } from '~/composables/useFriendlyFingerprint'

const props = defineProps<{
  sessions: SessionSummary[]
  activeUserFilter?: string
  activeUtmFilter?: string
}>()

defineEmits<{
  (e: 'filter-user', fp: string): void
  (e: 'filter-utm', utm: string): void
  (e: 'exclude-fp', fp: string): void
  (e: 'exclude-page', page: string): void
  (e: 'open-alias-modal', fp: string): void
  (e: 'clear-user-filter'): void
  (e: 'clear-utm-filter'): void
}>()

const searchQuery = ref('')

const filteredSessions = computed(() => {
  return props.sessions.filter((s) => {
    if (props.activeUserFilter && s.fingerprint !== props.activeUserFilter) return false
    if (props.activeUtmFilter) {
      const u1 = (s.utm_source || '').toLowerCase()
      const u2 = (s.utm_campaign || '').toLowerCase()
      if (u1 !== props.activeUtmFilter.toLowerCase() && u2 !== props.activeUtmFilter.toLowerCase()) return false
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim()
      const fpMatch = (s.fingerprint || '').toLowerCase().includes(q)
      const sidMatch = (s.session_id || '').toLowerCase().includes(q)
      const ipMatch = (s.ip || '').toLowerCase().includes(q)
      const regMatch = (s.region || '').toLowerCase().includes(q)
      const pageMatch = s.pages?.some((p) => p.toLowerCase().includes(q))
      if (!fpMatch && !sidMatch && !ipMatch && !regMatch && !pageMatch) return false
    }
    return true
  })
})

function getJourneySteps(s: SessionSummary) {
  if (s.journey_steps && s.journey_steps.length > 0) return s.journey_steps
  return (s.pages || []).map((p, i) => ({
    step: i + 1,
    type: 'page',
    title: p,
    subtitle: p,
    timestamp: ''
  }))
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

function formatTimeAgoFa(isoString?: string): string {
  if (!isoString) return ''
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000))
  if (diffSec < 60) return 'هم‌اکنون'
  if (diffSec < 3600) return `${formatFaNumber(Math.floor(diffSec / 60))} دقیقه پیش`
  if (diffSec < 86400) return `${formatFaNumber(Math.floor(diffSec / 3600))} ساعت پیش`
  return `${formatFaNumber(Math.floor(diffSec / 86400))} روز پیش`
}
</script>
