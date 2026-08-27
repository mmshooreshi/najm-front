<!-- components/dash/DashMobileNav.vue -->
<template>
  <div class="md:hidden fixed bottom-3 inset-x-3 z-40 select-none">
    <nav class="flex items-center justify-around p-1.5 rounded-2xl bg-zinc-950/95 border border-white/15 shadow-2xl backdrop-blur-xl text-white">
      <NuxtLink
        v-for="item in mobileItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors text-[10px] font-semibold"
        :class="route.path === item.to || (item.to !== '/dash' && route.path.startsWith(item.to))
          ? 'text-emerald-400 font-bold bg-white/10'
          : 'text-zinc-400 hover:text-zinc-200'"
      >
        <AdminIcon :name="item.icon" class="w-4 h-4" />
        <span class="truncate">{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AdminIcon from '~/components/admin/AdminIcon.vue'

const route = useRoute()

const mobileItems = [
  { to: '/dash', icon: 'dashboard', label: 'پیشخوان' },
  { to: '/dash/requests', icon: 'mail', label: 'سفارشات' },
  { to: '/dash/products', icon: 'crop', label: 'نمونه‌کارها' },
  { to: '/dash/messaging', icon: 'chat', label: 'واتس‌اپ' },
  { to: '/dash/content', icon: 'edit', label: 'سایت' }
]
</script>
