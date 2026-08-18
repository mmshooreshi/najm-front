<!-- components/dashboard/DashboardSidebar.vue -->
<template>
  <aside
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="flex h-full flex-col bg-[#0b141a] text-gray-100 transition-all duration-300 select-none"
    :class="[
      collapsed ? 'w-16' : 'w-60',
      isRTL ? 'border-l border-gray-800' : 'border-r border-gray-800'
    ]"
  >
    <!-- Brand / Header -->
    <div class="flex h-14 sm:h-16 items-center justify-between px-4 border-b border-gray-800/80">
      <NuxtLink to="/dashboard" class="flex items-center gap-2.5 overflow-hidden">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-najmgreen font-bold text-white shadow-sm border border-emerald-700/50">
          {{ isRTL ? 'ن' : 'N' }}
        </div>
        <span v-if="!collapsed" class="font-bold tracking-tight text-white text-sm truncate font-d4">
          {{ isRTL ? 'پیشخوان چاپ نجم' : 'Najm Studio' }}
        </span>
      </NuxtLink>

      <button
        @click="collapsed = !collapsed"
        class="hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white md:flex transition cursor-pointer"
        :title="isRTL ? 'تغییر سایز' : 'Toggle Sidebar'"
      >
        <Icon
          :name="
            isRTL
              ? (collapsed ? 'mdi:chevron-left' : 'mdi:chevron-right')
              : (collapsed ? 'mdi:chevron-right' : 'mdi:chevron-left')
          "
          class="h-5 w-5"
        />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 space-y-1.5 p-3 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition group cursor-pointer"
        :class="
          isNavActive(item.to)
            ? 'bg-najmgreen text-white font-bold shadow-xs border border-emerald-700/50'
            : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
        "
        :title="collapsed ? getLabel(item) : undefined"
      >
        <Icon :name="item.icon" class="h-4.5 w-4.5 shrink-0 transition" />
        <span v-if="!collapsed" class="truncate">{{ getLabel(item) }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer Quick Link to Public Site -->
    <div v-if="!collapsed" class="p-3 border-t border-gray-800/80 space-y-2">
      <NuxtLink
        to="/"
        class="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-900/80 text-gray-300 hover:text-white hover:bg-gray-800 text-xs transition"
      >
        <span class="flex items-center gap-1.5">
          <Icon name="mdi:open-in-new" class="w-3.5 h-3.5 text-emerald-400" />
          <span>مشاهده وبسایت اصلی</span>
        </span>
        <span class="text-[10px] font-mono text-gray-500">Live</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '~/composables/useLocale'

const route = useRoute()
const collapsed = ref(false)
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

interface NavItem {
  labelFa: string
  labelEn: string
  to: string
  icon: string
}

const navItems: NavItem[] = [
  { labelFa: 'پیشخوان و آمار', labelEn: 'Dashboard', to: '/dashboard', icon: 'mdi:view-dashboard-outline' },
  { labelFa: 'نقشه تعاملی اکوسیستم', labelEn: 'System Architecture Map', to: '/dashboard/map', icon: 'mdi:sitemap' },
  { labelFa: 'دیتابیس و رکوردها', labelEn: 'Database', to: '/dashboard/collections', icon: 'mdi:database-outline' },
  { labelFa: 'مخزن رسانه و فایل‌ها', labelEn: 'Media Lab', to: '/dashboard/media', icon: 'mdi:folder-multiple-image' },
  { labelFa: 'مدیریت محتوای صفحات', labelEn: 'Page CMS', to: '/dashboard/cms', icon: 'mdi:file-document-edit-outline' },
  { labelFa: 'لاگ‌ها و رویدادها', labelEn: 'Logs', to: '/dashboard/logs', icon: 'mdi:format-list-bulleted-square' },
]

function getLabel(item: NavItem) {
  return isRTL.value ? item.labelFa : item.labelEn
}

function isNavActive(to: string) {
  if (to === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(to)
}
</script>
