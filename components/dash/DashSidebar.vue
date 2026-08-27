<!-- components/dash/DashSidebar.vue -->
<template>
  <aside
    class="relative z-30 flex flex-col shrink-0 bg-zinc-950 border-r border-white/10 transition-all duration-300 ease-in-out text-white"
    :class="[
      isCollapsed ? 'w-20' : 'w-60',
      isMobileOpen ? 'translate-x-0' : 'max-md:-translate-x-full max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-68'
    ]"
  >
    <!-- Brand -->
    <div class="h-16 px-4 flex items-center justify-between border-b border-white/10">
      <NuxtLink to="/dash" class="flex items-center gap-3 overflow-hidden group">
        <div class="w-9 h-9 rounded-xl bg-najmgreen flex items-center justify-center text-white font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
          ن
        </div>
        <div v-if="!isCollapsed" class="truncate font-bold text-sm text-zinc-100 font-d4">
          چاپ و بسته‌بندی نجم
        </div>
      </NuxtLink>

      <button
        v-if="!isMobile"
        type="button"
        @click="isCollapsed = !isCollapsed"
        class="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/5"
        :title="isCollapsed ? 'باز کردن' : 'بستن'"
      >
        <AdminIcon :name="isCollapsed ? 'chevron-right' : 'chevron-left'" class="w-3.5 h-3.5" />
      </button>

      <button
        v-else
        type="button"
        @click="$emit('closeMobile')"
        class="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        <AdminIcon name="x" class="w-4 h-4" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group"
        :class="route.path === item.to || (item.to !== '/dash' && route.path.startsWith(item.to))
          ? 'bg-najmgreen text-white shadow-xs font-bold'
          : 'text-zinc-400 hover:text-white hover:bg-white/5'"
        :title="isCollapsed ? item.label : ''"
      >
        <AdminIcon :name="item.icon" class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
        <span v-if="!isCollapsed" class="truncate font-d4">{{ item.label }}</span>
        <span
          v-if="!isCollapsed && item.badge"
          class="mr-auto px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/10 text-white"
        >
          {{ item.badge }}
        </span>
      </NuxtLink>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-3 border-t border-white/10 space-y-2 bg-zinc-950/80">
      <NuxtLink
        to="/?edit=true"
        target="_blank"
        class="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-semibold transition-all duration-150"
      >
        <AdminIcon name="sparkles" class="w-4 h-4 text-emerald-400 shrink-0" />
        <span v-if="!isCollapsed" class="truncate font-d4">ویرایش بصری سایت</span>
      </NuxtLink>

      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 text-xs transition-colors"
      >
        <AdminIcon name="link" class="w-3.5 h-3.5 shrink-0" />
        <span v-if="!isCollapsed" class="truncate font-d4">مشاهده سایت</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminIcon from '~/components/admin/AdminIcon.vue'

defineProps<{
  isMobileOpen?: boolean
  isMobile?: boolean
}>()

defineEmits<{
  (e: 'closeMobile'): void
}>()

const route = useRoute()
const isCollapsed = ref(false)

const navItems = [
  { to: '/dash', icon: 'dashboard', label: 'پیشخوان' },
  { to: '/dash/requests', icon: 'mail', label: 'درخواست‌ها و استعلام', badge: 'جدید' },
  { to: '/dash/products', icon: 'crop', label: 'محصولات و نمونه‌کارها' },
  { to: '/dash/resources', icon: 'download', label: 'دانلودها و قالب‌های تیغ' },
  { to: '/dash/calendar', icon: 'check', label: 'تقویم و صف تولید' },
  { to: '/dash/content', icon: 'edit', label: 'متن‌ها و بنرها' },
  { to: '/dash/blog', icon: 'file', label: 'مقالات و اخبار' },
  { to: '/dash/media', icon: 'photo', label: 'عکس‌ها و فایل‌ها' },
  { to: '/dash/messaging', icon: 'chat', label: 'ارسال پیام واتس‌اپ' },
  { to: '/dash/design', icon: 'adjustments', label: 'رنگ‌ها و تم' }
]
</script>
