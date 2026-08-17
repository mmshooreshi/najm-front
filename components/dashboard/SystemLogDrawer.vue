<!-- components/dashboard/SystemLogDrawer.vue -->
<template>
  <div
    v-if="open"
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-xs transition-opacity"
    :class="isRTL ? 'justify-start' : 'justify-end'"
    @click.self="$emit('close')"
  >
    <div
      class="flex h-full w-full max-w-xl flex-col bg-zinc-950 text-zinc-100 shadow-2xl"
      :class="isRTL ? 'border-r border-zinc-800' : 'border-l border-zinc-800'"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-zinc-800 px-4 py-3 bg-zinc-900/60">
        <div class="flex items-center gap-2">
          <Icon name="mdi:console" class="h-4.5 w-4.5 text-[#018786]" />
          <h2 class="text-sm font-bold text-zinc-100 font-d4">
            {{ isRTL ? 'لاگ‌های سیستم' : 'System Logs' }}
          </h2>
          <span class="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400">
            {{ toLocalizedDigits(logs.length) }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="clearLogs"
            class="flex items-center gap-1 rounded-xl bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-700 transition cursor-pointer"
            :title="isRTL ? 'پاک‌سازی' : 'Clear'"
          >
            <Icon name="mdi:delete-sweep-outline" class="h-3.5 w-3.5" />
            <span class="hidden xs:inline">{{ isRTL ? 'پاک‌سازی' : 'Clear' }}</span>
          </button>
          <button
            @click="$emit('close')"
            class="rounded-xl p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
          >
            <Icon name="mdi:close" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="flex items-center gap-2 border-b border-zinc-800 px-4 py-2 bg-zinc-900/30 text-xs flex-wrap">
        <span class="text-zinc-500 font-medium">{{ isRTL ? 'فیلتر:' : 'Filter:' }}</span>
        <button
          v-for="lvl in filterOptions"
          :key="lvl.value"
          @click="activeFilter = lvl.value"
          class="rounded-xl px-2 py-0.5 transition font-medium capitalize cursor-pointer"
          :class="
            activeFilter === lvl.value
              ? 'bg-[#018786]/20 text-[#2DD4BF] border border-[#018786]/40'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
          "
        >
          {{ isRTL ? lvl.labelFa : lvl.labelEn }}
        </button>

        <div class="ms-auto relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="isRTL ? 'جستجو...' : 'Search...'"
            class="w-28 sm:w-36 rounded-xl bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
      </div>

      <!-- Terminal Log Body -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2 text-xs" dir="ltr">
        <div v-if="filteredLogs.length === 0" class="flex flex-col items-center justify-center h-48 text-zinc-500 space-y-2">
          <Icon name="mdi:text-box-remove-outline" class="h-8 w-8 opacity-50" />
          <p>{{ isRTL ? 'رویدادی یافت نشد.' : 'No log events found.' }}</p>
        </div>

        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-2.5 transition hover:border-zinc-700 max-w-full"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-zinc-500 text-[11px]">{{ log.timestamp }}</span>

              <span
                class="rounded-full px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider"
                :class="getLevelBadgeClass(log.level)"
              >
                {{ log.level }}
              </span>

              <span class="text-zinc-300 font-bold text-[11px]">[{{ log.tag }}]</span>
            </div>

            <button
              v-if="log.details"
              @click="toggleDetails(log.id)"
              class="text-zinc-400 hover:text-zinc-200 text-[11px] underline cursor-pointer"
            >
              {{ expandedMap[log.id] ? 'Hide' : 'Details' }}
            </button>
          </div>

          <div class="mt-1 text-zinc-200 text-xs whitespace-pre-wrap break-words">
            {{ log.message }}
          </div>

          <div v-if="expandedMap[log.id] && log.details" class="mt-2 rounded-xl bg-black/60 p-2.5 border border-zinc-800 max-w-full">
            <pre class="text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap break-words">{{ JSON.stringify(log.details, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { useAdminLogger, type LogLevel } from '~/composables/useAdminLogger'
import { toLocalizedDigits } from '~/utils/digits'

defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const { logs, clearLogs } = useAdminLogger()

const activeFilter = ref<string>('all')
const searchQuery = ref<string>('')
const expandedMap = ref<Record<string, boolean>>({})

const filterOptions = [
  { labelFa: 'همه', labelEn: 'All', value: 'all' },
  { labelFa: 'اطلاعات', labelEn: 'Info', value: 'info' },
  { labelFa: 'شبکه', labelEn: 'Network', value: 'network' },
  { labelFa: 'هشدار', labelEn: 'Warn', value: 'warn' },
  { labelFa: 'خطا', labelEn: 'Error', value: 'error' },
]

const filteredLogs = computed(() => {
  return logs.value.filter((l) => {
    if (activeFilter.value !== 'all' && l.level !== activeFilter.value) {
      return false
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchMsg = l.message.toLowerCase().includes(q)
      const matchTag = l.tag.toLowerCase().includes(q)
      return matchMsg || matchTag
    }
    return true
  })
})

function toggleDetails(id: string) {
  expandedMap.value[id] = !expandedMap.value[id]
}

function getLevelBadgeClass(level: LogLevel) {
  switch (level) {
    case 'error':
      return 'bg-red-950 text-red-400 border border-red-800/50'
    case 'warn':
      return 'bg-amber-950 text-amber-400 border border-amber-800/50'
    case 'network':
      return 'bg-blue-950 text-blue-400 border border-blue-800/50'
    case 'auth':
      return 'bg-purple-950 text-purple-400 border border-purple-800/50'
    default:
      return 'bg-zinc-800 text-zinc-300 border border-zinc-700'
  }
}
</script>
