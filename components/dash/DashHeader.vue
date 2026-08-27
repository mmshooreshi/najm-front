<!-- components/dash/DashHeader.vue -->
<template>
  <header class="h-16 shrink-0 bg-zinc-950/80 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-20 text-white">
    <!-- Title -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        @click="$emit('openMobile')"
        class="md:hidden w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
        aria-label="Menu"
      >
        <AdminIcon name="menu" class="w-4 h-4" />
      </button>

      <h1 class="text-sm sm:text-base font-bold text-zinc-100 font-d4">
        {{ currentTitle }}
      </h1>
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center gap-2.5">
      <NuxtLink
        to="/?edit=true"
        target="_blank"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer font-d4"
      >
        <AdminIcon name="sparkles" class="w-3.5 h-3.5" />
        <span class="hidden xs:inline">ویرایش بصری سایت</span>
      </NuxtLink>

      <div class="w-8 h-8 rounded-xl bg-zinc-800 border border-white/15 flex items-center justify-center text-xs font-bold text-emerald-400">
        مدیر
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminIcon from '~/components/admin/AdminIcon.vue'

defineEmits<{
  (e: 'openMobile'): void
}>()

const route = useRoute()

const currentTitle = computed(() => {
  const path = route.path
  if (path === '/dash') return 'پیشخوان'
  if (path.startsWith('/dash/requests')) return 'درخواست‌ها و استعلام قیمت'
  if (path.startsWith('/dash/products')) return 'نمونه‌کارها و محصولات'
  if (path.startsWith('/dash/calendar')) return 'تقویم و صف تولید کارخانه'
  if (path.startsWith('/dash/content')) return 'متن‌ها و بنرهای سایت'
  if (path.startsWith('/dash/blog')) return 'مقالات و اخبار'
  if (path.startsWith('/dash/media')) return 'عکس‌ها و فایل‌ها'
  if (path.startsWith('/dash/messaging')) return 'پیام‌رسان واتس‌اپ'
  if (path.startsWith('/dash/design')) return 'رنگ‌ها و ظاهر سایت'
  return 'پیشخوان'
})
</script>
