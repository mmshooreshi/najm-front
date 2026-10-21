<!-- components/dash/telemetry/DashTelemetryHeatmap.vue -->
<template>
  <div class="space-y-6">
    <!-- Header Banner & Lens Quick Launcher -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-emerald-950/40 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <h3 class="text-base font-bold text-white">هیت‌مپ رفتار و لنز تعاملی صفحات (Heatmaps & In-Situ Lens)</h3>
        </div>
        <p class="text-xs text-zinc-400">
          تحلیل دقیق تراکم کلیک‌ها، مکث‌های مطالعه، رفتار اسکرول و دسترسی مستقیم با یک کلیک به بازرس زنده Lens روی صفحات زنده سایت.
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <a
          href="/?lens=true"
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
        >
          <AdminIcon name="sparkles" class="w-4 h-4" />
          <span>اجرای لنز زنده روی صفحه اصلی ↗</span>
        </a>
      </div>
    </div>

    <!-- Behavior & Debounce Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- 1. Total Debounced Stops -->
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">توقف‌های اسکرول و مطالعه</span>
          <AdminIcon name="adjustments" class="w-4 h-4 text-emerald-400" />
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-emerald-400">
            {{ formatFaNumber(debounceStats?.total_debounced_scrolls || 0) }}
          </span>
          <span class="text-xs text-zinc-400">توقف عمیق</span>
        </div>
        <p class="text-[11px] text-zinc-500 mt-1">لحظاتی که کاربر اسکرول را نگه داشته و خوانده است</p>
      </div>

      <!-- 2. Avg Dwell Before Stop -->
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">میانگین زمان توقف و خواندن</span>
          <AdminIcon name="clock" class="w-4 h-4 text-teal-400" />
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-teal-400">
            {{ formatFaNumber(debounceStats?.avg_dwell_before_stop || 0) }}
          </span>
          <span class="text-xs text-zinc-400">ثانیه</span>
        </div>
        <p class="text-[11px] text-zinc-500 mt-1">مدت زمان مکث چشمی روی پاراگراف‌ها و کاتالوگ</p>
      </div>

      <!-- 3. Hesitations / Rage Taps -->
      <div class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col justify-between shadow-lg">
        <div class="flex items-center justify-between">
          <span class="text-xs text-zinc-400">تردیدها و تپ‌های مکرر (Hesitations)</span>
          <AdminIcon name="cursor-click" class="w-4 h-4 text-amber-400" />
        </div>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-2xl font-bold font-mono text-amber-400">
            {{ formatFaNumber(debounceStats?.hesitations || 0) }}
          </span>
          <span class="text-xs text-zinc-400">مورد رصدشده</span>
        </div>
        <p class="text-[11px] text-zinc-500 mt-1">تپ‌های پیاپی روی المان‌ها قبل از تصمیم‌گیری</p>
      </div>
    </div>

    <!-- Page Heatmaps Matrix Table -->
    <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <AdminIcon name="eye" class="w-4 h-4 text-emerald-400" />
          <h3 class="text-sm font-bold text-white">ماتریس رفتار و هیت‌مپ صفحات (Page Heatmap Matrix)</h3>
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model="pageSearchQuery"
            type="text"
            placeholder="فیلتر آدرس صفحه..."
            class="px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 w-52"
          />
          <span class="text-xs text-zinc-400 font-mono">
            {{ formatFaNumber(filteredPages.length) }} صفحه
          </span>
        </div>
      </div>

      <div v-if="filteredPages.length === 0" class="py-12 text-center text-xs text-zinc-500">
        داده‌ای برای تعامل صفحات در این بازه زمانی یافت نشد.
      </div>

      <div v-else class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-right text-xs">
          <thead>
            <tr class="border-b border-white/10 text-zinc-400">
              <th class="py-2.5 px-3 font-semibold">آدرس صفحه</th>
              <th class="py-2.5 px-3 font-semibold text-center">بازدید</th>
              <th class="py-2.5 px-3 font-semibold text-center">تپ و کلیک</th>
              <th class="py-2.5 px-3 font-semibold text-center">مکث مطالعه</th>
              <th class="py-2.5 px-3 font-semibold text-center">تپ متوالی (Rage)</th>
              <th class="py-2.5 px-3 font-semibold text-left">لنز زنده صفحه</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 font-mono">
            <tr
              v-for="p in filteredPages"
              :key="p.url"
              class="hover:bg-zinc-800/40 transition group"
            >
              <td class="py-3 px-3">
                <div class="flex items-center gap-2 font-bold text-zinc-200 truncate max-w-xs sm:max-w-md">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span class="truncate">{{ p.url }}</span>
                </div>
              </td>
              <td class="py-3 px-3 text-center text-zinc-300">
                {{ formatFaNumber(p.views) }}
              </td>
              <td class="py-3 px-3 text-center">
                <span class="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold">
                  {{ formatFaNumber(p.taps) }}
                </span>
              </td>
              <td class="py-3 px-3 text-center text-zinc-300">
                {{ formatFaNumber(p.dwell_sec) }} ثانیه
              </td>
              <td class="py-3 px-3 text-center">
                <span
                  class="px-2 py-0.5 rounded-md font-bold text-xs"
                  :class="p.rage_taps > 0 ? 'bg-rose-500/20 text-rose-300' : 'text-zinc-500'"
                >
                  {{ formatFaNumber(p.rage_taps) }}
                </span>
              </td>
              <td class="py-3 px-3 text-left">
                <a
                  :href="`${p.url}${p.url.includes('?') ? '&' : '?'}lens=true`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-emerald-600 hover:text-white text-emerald-400 text-xs font-sans font-bold transition cursor-pointer"
                >
                  <span>مشاهده لنز</span>
                  <span class="text-[10px]">↗</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top Clicked Elements & CTAs -->
    <div class="p-5 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <AdminIcon name="cursor-click" class="w-4 h-4 text-teal-400" />
          <h3 class="text-sm font-bold text-white">محبوب‌ترین المان‌ها و دکمه‌های سایت (Top Clicked Targets)</h3>
        </div>
        <span class="text-xs text-zinc-400 font-mono">
          {{ formatFaNumber(topClickedTargets?.length || 0) }} المان
        </span>
      </div>

      <div v-if="!topClickedTargets || topClickedTargets.length === 0" class="py-8 text-center text-xs text-zinc-500">
        هنوز رویداد کلیک روی دکمه‌های سایت ثبت نشده است.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="target in topClickedTargets"
          :key="target.target_id"
          class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-teal-500/30 transition text-xs"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
              <AdminIcon name="cursor-click" class="w-3.5 h-3.5" />
            </span>
            <div class="min-w-0">
              <div class="font-bold text-zinc-200 truncate">{{ target.label }}</div>
              <div class="text-[10px] text-zinc-500 font-mono truncate">#{{ target.target_id }}</div>
            </div>
          </div>
          <div class="shrink-0 font-mono">
            <span class="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold text-xs">
              {{ formatFaNumber(target.count) }} کلیک
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'
import type { PageInteractionMetric, TopClickedTarget, DebounceStats } from '~/types/telemetry'

const props = defineProps<{
  pageInteractions?: PageInteractionMetric[]
  topClickedTargets?: TopClickedTarget[]
  debounceStats?: DebounceStats
}>()

const pageSearchQuery = ref('')

const filteredPages = computed(() => {
  const list = props.pageInteractions || []
  if (!pageSearchQuery.value.trim()) return list
  const q = pageSearchQuery.value.toLowerCase().trim()
  return list.filter(p => p.url.toLowerCase().includes(q))
})

function formatFaNumber(num?: number): string {
  if (num == null) return '۰'
  return new Intl.NumberFormat('fa-IR').format(num)
}
</script>
