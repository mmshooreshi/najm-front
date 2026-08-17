<!-- components/dashboard/DashboardHeader.vue -->
<template>
  <header
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-gray-200 bg-white/90 px-3 sm:px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90 max-w-full"
  >
    <!-- Left/Right: Mobile Menu Toggle & Title -->
    <div class="flex items-center gap-2 sm:gap-3 min-w-0">
      <button
        @click="$emit('toggleSidebar')"
        class="rounded-xl p-1.5 text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800 md:hidden cursor-pointer shrink-0"
        aria-label="Toggle sidebar"
      >
        <Icon name="mdi:menu" class="h-5 w-5" />
      </button>

      <div class="min-w-0">
        <h1 class="text-sm sm:text-base font-bold text-gray-900 dark:text-zinc-100 font-d4 truncate">
          {{ translatedTitle }}
        </h1>
      </div>
    </div>

    <!-- Right/Left: Controls -->
    <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
      <!-- Language Switcher Pill -->
      <button
        @click="nextLanguage"
        class="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-bold text-gray-700 hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition cursor-pointer"
        :title="isRTL ? 'تغییر زبان' : 'Language'"
      >
        <Icon name="mdi:web" class="h-3.5 w-3.5 text-[#018786]" />
        <span>{{ language }}</span>
      </button>

      <!-- PocketBase Health Indicator -->
      <div
        class="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition"
        :class="
          serverHealth === 'online'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
            : serverHealth === 'checking'
            ? 'border-gray-200 bg-gray-50 text-gray-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
            : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300'
        "
      >
        <span
          class="h-1.5 w-1.5 rounded-full"
          :class="
            serverHealth === 'online'
              ? 'bg-emerald-500 animate-pulse'
              : serverHealth === 'checking'
              ? 'bg-gray-400 animate-spin'
              : 'bg-red-500'
          "
        ></span>
        <span class="hidden xs:inline">
          {{
            serverHealth === 'online'
              ? `PB ${toLocalizedDigits(latency)}ms`
              : serverHealth === 'checking'
              ? '...'
              : 'Offline'
          }}
        </span>
      </div>

      <!-- System Log Drawer Trigger Button -->
      <button
        @click="$emit('openLogs')"
        class="relative flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition cursor-pointer"
        :title="isRTL ? 'لاگ‌ها' : 'Logs'"
      >
        <Icon name="mdi:console" class="h-3.5 w-3.5 text-[#018786]" />
        <span class="hidden sm:inline">{{ isRTL ? 'لاگ‌ها' : 'Logs' }}</span>

        <span
          v-if="errorCount > 0"
          class="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow"
        >
          {{ toLocalizedDigits(errorCount) }}
        </span>
      </button>

      <!-- Logout button -->
      <button
        @click="handleLogout"
        class="flex items-center gap-1 rounded-xl bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 transition cursor-pointer"
      >
        <Icon name="mdi:logout" class="h-3.5 w-3.5" />
        <span class="hidden sm:inline">{{ isRTL ? 'خروج' : 'Logout' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { useAdminLogger } from '~/composables/useAdminLogger'
import { toLocalizedDigits } from '~/utils/digits'

const props = defineProps<{ title?: string }>()
defineEmits<{
  (e: 'toggleSidebar'): void
  (e: 'openLogs'): void
}>()

const { language, nextLanguage } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const { errorCount, logInfo, logError, logNetwork } = useAdminLogger()

const serverHealth = ref<'online' | 'offline' | 'checking'>('checking')
const latency = ref<number | null>(null)
let pingInterval: ReturnType<typeof setInterval> | null = null

const translatedTitle = computed(() => {
  if (props.title) return props.title
  return isRTL.value ? 'پنل نجم' : 'Najm Admin'
})

async function checkServerHealth() {
  const start = Date.now()
  try {
    const res = await $fetch<{ ok: boolean; latency: number }>('/api/admin/pb/health').catch(() => null)
    const duration = res?.latency ?? (Date.now() - start)
    latency.value = duration

    if (res?.ok) {
      if (serverHealth.value !== 'online') {
        logInfo('System', `PocketBase connected (${duration}ms)`)
      }
      serverHealth.value = 'online'
    } else {
      serverHealth.value = 'offline'
      logError('System', 'PocketBase ping offline')
    }
  } catch (err: any) {
    serverHealth.value = 'offline'
    latency.value = null
    logError('System', `PocketBase health check failed: ${err?.message || err}`)
  }
}

async function handleLogout() {
  logNetwork('Auth', 'Logging out superuser session')
  try {
    await $fetch('/api/admin/logout', { method: 'POST' })
  } catch (e) {
    // Ignore error
  }
  await navigateTo('/admin-login')
}

onMounted(() => {
  checkServerHealth()
  pingInterval = setInterval(checkServerHealth, 15000)
})

onUnmounted(() => {
  if (pingInterval) clearInterval(pingInterval)
})
</script>
