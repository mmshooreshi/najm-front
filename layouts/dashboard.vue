<!-- layouts/dashboard.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="flex h-screen w-full overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
  >
    <!-- Desktop & Mobile Sidebar -->
    <DashboardSidebar
      :class="[
        'fixed inset-y-0 z-40 md:static md:translate-x-0 transition-transform duration-300',
        mobileSidebarOpen
          ? 'translate-x-0'
          : (isRTL ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')
      ]"
    />

    <!-- Mobile Sidebar Backdrop Overlay -->
    <div
      v-if="mobileSidebarOpen"
      @click="mobileSidebarOpen = false"
      class="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
    ></div>

    <!-- Main Content Shell -->
    <div class="flex flex-1 flex-col overflow-hidden min-w-0">
      <DashboardHeader
        :title="pageTitle"
        @toggle-sidebar="mobileSidebarOpen = !mobileSidebarOpen"
        @open-logs="logsDrawerOpen = true"
      />

      <main class="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 max-w-full">
        <slot />
      </main>
    </div>

    <!-- System Diagnostics Log Drawer -->
    <SystemLogDrawer
      :open="logsDrawerOpen"
      @close="logsDrawerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '~/composables/useLocale'
import DashboardSidebar from '~/components/dashboard/DashboardSidebar.vue'
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import SystemLogDrawer from '~/components/dashboard/SystemLogDrawer.vue'

const route = useRoute()
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const mobileSidebarOpen = ref(false)
const logsDrawerOpen = ref(false)

const pageTitle = computed(() => {
  const isFa = isRTL.value
  if (route.path === '/dashboard') return isFa ? 'پیشخوان' : 'Dashboard'
  if (route.path.startsWith('/dashboard/collections')) return isFa ? 'دیتابیس' : 'Database'
  if (route.path.startsWith('/dashboard/media')) return isFa ? 'رسانه' : 'Media'
  if (route.path.startsWith('/dashboard/cms')) return isFa ? 'محتوا' : 'CMS'
  if (route.path.startsWith('/dashboard/logs')) return isFa ? 'لاگ‌ها' : 'Logs'
  return isFa ? 'ادمین' : 'Admin'
})
</script>
