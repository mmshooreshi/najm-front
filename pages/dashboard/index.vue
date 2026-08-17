<!-- pages/dashboard/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="space-y-4 sm:space-y-6 max-w-full">
    <!-- Top Hero Banner -->
    <div class="flex flex-col gap-3 rounded-2xl bg-[#111827] p-4 sm:p-6 text-white shadow-sm md:flex-row md:items-center md:justify-between border border-gray-800">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-1.5 rounded-full bg-[#018786]/20 px-2.5 py-0.5 text-xs font-semibold text-[#2DD4BF] border border-[#018786]/30">
          <span class="h-1.5 w-1.5 rounded-full bg-[#018786] animate-pulse"></span>
          {{ isRTL ? 'آنلاین' : 'Online' }}
        </div>
        <h2 class="text-lg sm:text-xl font-bold tracking-tight font-d4">
          {{ isRTL ? 'پیشخوان ادمین' : 'Dashboard' }}
        </h2>
        <p class="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
          {{
            isRTL
              ? 'مدیریت دیتابیس، تصویرهای محصولات، محتوای صفحات و بررسی سرور'
              : 'Database collections, media assets, CMS content, and server diagnostics'
          }}
        </p>
      </div>

      <div class="flex items-center gap-2 pt-2 md:pt-0">
        <button
          @click="refreshStats"
          :disabled="pending"
          class="flex items-center gap-1.5 rounded-xl bg-[#018786] px-3 py-2 text-xs font-bold text-white hover:bg-[#018786]/90 transition shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Icon name="mdi:refresh" class="h-4 w-4" :class="pending ? 'animate-spin' : ''" />
          {{ isRTL ? 'به‌روزرسانی' : 'Refresh' }}
        </button>
      </div>
    </div>

    <!-- Metrics Cards Grid -->
    <div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Collections -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-gray-300">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-600">
            {{ isRTL ? 'کالکشن‌ها' : 'Collections' }}
          </span>
          <div class="rounded-xl bg-teal-50 p-2 text-[#018786]">
            <Icon name="mdi:database-outline" class="h-4.5 w-4.5" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline justify-between">
          <span v-if="!pending" class="text-2xl font-extrabold text-gray-900">
            {{ toLocalizedDigits(collectionsCount) }}
          </span>
          <div v-else class="h-7 w-12 bg-gray-100 rounded-lg animate-pulse"></div>
          <NuxtLink to="/dashboard/collections" class="text-xs font-semibold text-[#018786] hover:underline">
            {{ isRTL ? 'مشاهده ←' : 'View →' }}
          </NuxtLink>
        </div>
      </div>

      <!-- Media Files -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-gray-300">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-600">
            {{ isRTL ? 'فایل‌ها و رسانه' : 'Media Files' }}
          </span>
          <div class="rounded-xl bg-indigo-50 p-2 text-indigo-600">
            <Icon name="mdi:folder-multiple-image" class="h-4.5 w-4.5" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline justify-between">
          <span v-if="!pending" class="text-2xl font-extrabold text-gray-900">
            {{ toLocalizedDigits(mediaCount) }}
          </span>
          <div v-else class="h-7 w-12 bg-gray-100 rounded-lg animate-pulse"></div>
          <NuxtLink to="/dashboard/media" class="text-xs font-semibold text-[#018786] hover:underline">
            {{ isRTL ? 'مشاهده ←' : 'View →' }}
          </NuxtLink>
        </div>
      </div>

      <!-- CMS Pages -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-gray-300">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-600">
            {{ isRTL ? 'صفحات سایت' : 'CMS Pages' }}
          </span>
          <div class="rounded-xl bg-emerald-50 p-2 text-emerald-700">
            <Icon name="mdi:file-document-edit-outline" class="h-4.5 w-4.5" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline justify-between">
          <span v-if="!pending" class="text-2xl font-extrabold text-gray-900">
            {{ toLocalizedDigits(pagesCount) }}
          </span>
          <div v-else class="h-7 w-12 bg-gray-100 rounded-lg animate-pulse"></div>
          <NuxtLink to="/dashboard/cms" class="text-xs font-semibold text-[#018786] hover:underline">
            {{ isRTL ? 'ویرایش ←' : 'Edit →' }}
          </NuxtLink>
        </div>
      </div>

      <!-- Health Ping -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-gray-300">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-600">
            {{ isRTL ? 'وضعیت PocketBase' : 'PocketBase Status' }}
          </span>
          <div class="rounded-xl bg-amber-50 p-2 text-amber-700">
            <Icon name="mdi:server-network" class="h-4.5 w-4.5" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline justify-between">
          <span class="text-xs font-bold text-[#018786] flex items-center gap-1">
            <span class="h-2 w-2 rounded-full bg-[#018786]"></span>
            {{ isRTL ? 'برقرار' : 'Online' }}
          </span>
          <span class="text-xs text-gray-500">v0.23</span>
        </div>
      </div>
    </div>

    <!-- Main Grid Section -->
    <div class="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
      <!-- PocketBase Collections Summary -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-xs">
        <div class="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-100">
          <div>
            <h3 class="text-sm sm:text-base font-bold text-gray-900 font-d4">
              {{ isRTL ? 'کالکشن‌های فعال' : 'Active Collections' }}
            </h3>
            <p class="text-[11px] text-gray-500">
              {{ isRTL ? 'لیست جدول‌های دیتابیس' : 'PocketBase schema tables' }}
            </p>
          </div>
          <NuxtLink
            to="/dashboard/collections"
            class="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            {{ isRTL ? 'همه' : 'All' }}
          </NuxtLink>
        </div>

        <div v-if="pending && !collections.length" class="space-y-2">
          <div v-for="i in 4" :key="i" class="h-10 bg-gray-50 rounded-xl animate-pulse"></div>
        </div>

        <div v-else-if="collections.length === 0" class="py-8 text-center text-xs text-gray-400">
          {{ isRTL ? 'کالکشنی یافت نشد.' : 'No collections found.' }}
        </div>

        <div v-else class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <NuxtLink
            v-for="col in collections.slice(0, 8)"
            :key="col.name"
            :to="`/dashboard/collections/${col.name}`"
            class="flex items-center justify-between rounded-xl border border-gray-200/60 bg-gray-50/60 p-2.5 hover:bg-gray-100 transition min-w-0"
          >
            <div class="flex items-center gap-2 min-w-0">
              <Icon name="mdi:table" class="h-4 w-4 text-[#018786] shrink-0" />
              <span class="text-xs font-semibold text-gray-800 truncate">{{ col.name }}</span>
            </div>
            <span class="rounded-lg bg-gray-200 px-2 py-0.5 text-[11px] font-bold text-gray-700 shrink-0">
              {{ toLocalizedDigits(col.count) }}
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- Server Diagnostics & System Tools -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-100">
            <div>
              <h3 class="text-sm sm:text-base font-bold text-gray-900 font-d4">
                {{ isRTL ? 'وضعیت سرور' : 'Server Info' }}
              </h3>
              <p class="text-[11px] text-gray-500">
                {{ isRTL ? 'آدرس‌ها و پورت اتصال' : 'Host parameters' }}
              </p>
            </div>
            <span class="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
              {{ isRTL ? 'اوکی' : 'OK' }}
            </span>
          </div>

          <div class="space-y-2.5 text-xs">
            <div class="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 border border-gray-100">
              <span class="text-gray-500">{{ isRTL ? 'آدرس PocketBase' : 'PocketBase Host' }}</span>
              <span class="font-bold text-gray-900 truncate max-w-[160px] sm:max-w-[200px]">{{ pbUrl }}</span>
            </div>

            <div class="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 border border-gray-100">
              <span class="text-gray-500">{{ isRTL ? 'سطح دسترسی' : 'Admin Auth' }}</span>
              <span class="font-bold text-[#018786]">_superusers</span>
            </div>

            <div class="flex items-center justify-between rounded-xl bg-gray-50 p-2.5 border border-gray-100">
              <span class="text-gray-500">{{ isRTL ? 'فریم‌ورک' : 'Framework' }}</span>
              <span class="font-bold text-gray-900">Nuxt 3 + Vite</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span class="text-gray-500">{{ isRTL ? 'بررسی لاگ‌های سیستم:' : 'System logs:' }}</span>
          <button
            @click="openLogsDrawer"
            class="text-[#018786] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Icon name="mdi:console" class="h-4 w-4" />
            {{ isRTL ? 'مشاهده لاگ‌ها ←' : 'View Logs →' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { toLocalizedDigits } from '~/utils/digits'

definePageMeta({
  layout: 'dashboard',
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

// Nuxt caching key + lazy fetching so UI opens instantly (0ms)
const { data: statsData, pending, refresh } = await useAsyncData<{ name: string; count: number }[]>(
  'pb-dashboard-stats',
  () => $fetch<{ name: string; count: number }[]>('/api/admin/pb/stats'),
  { lazy: true, default: () => [] }
)

const collections = computed(() => statsData.value || [])
const collectionsCount = computed(() => collections.value.length)
const mediaCount = computed(() => collections.value.find(s => s.name === 'media_files')?.count || 0)
const pagesCount = computed(() => collections.value.find(s => s.name === 'pages')?.count || 0)
const pbUrl = computed(() => useRuntimeConfig().public.pbUrl || 'http://127.0.0.1:8090')

function refreshStats() {
  refresh()
}

function openLogsDrawer() {
  window.dispatchEvent(new CustomEvent('open-admin-logs'))
}
</script>
