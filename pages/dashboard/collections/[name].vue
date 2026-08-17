<!-- pages/dashboard/collections/[name].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="space-y-4 sm:space-y-6 max-w-full">
    <!-- Top Action Bar & Breadcrumbs -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-6 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
          <NuxtLink to="/dashboard" class="hover:text-najmgreen">{{ isRTL ? 'پیشخوان' : 'Home' }}</NuxtLink>
          <span>/</span>
          <NuxtLink to="/dashboard/collections" class="hover:text-najmgreen">{{ isRTL ? 'دیتابیس' : 'DB' }}</NuxtLink>
          <span>/</span>
          <span class="font-bold text-gray-900">{{ collectionName }}</span>
        </div>

        <h2 class="text-lg sm:text-xl font-bold text-gray-900 font-d4 flex items-center gap-2">
          <Icon name="mdi:table" class="h-5 w-5 text-najmgreen" />
          {{ getHumanTitle(collectionName) }}
          <span class="text-xs font-normal text-gray-500">({{ toLocalizedDigits(totalRecords) }})</span>
        </h2>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Add New Record Trigger -->
        <button
          @click="openCreateModal"
          class="flex items-center gap-1.5 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white px-3.5 py-2 text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Icon name="mdi:plus" class="h-4 w-4" />
          <span>{{ isRTL ? 'افزودن رکورد جدید' : 'New Record' }}</span>
        </button>

        <button
          @click="refreshData"
          :disabled="pending"
          class="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          :title="isRTL ? 'به‌روزرسانی' : 'Refresh'"
        >
          <Icon name="mdi:refresh" class="h-4 w-4" :class="pending ? 'animate-spin' : ''" />
        </button>
      </div>
    </div>

    <!-- Filter Bar & View Mode Toggle -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-3 sm:p-4 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative flex-1 max-w-sm">
        <Icon name="mdi:magnify" class="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="isRTL ? 'جستجو در رکوردها...' : 'Search records...'"
          class="w-full rounded-xl border border-gray-300 bg-gray-50 pr-9 pl-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-najmgreen transition font-mono text-right"
        />
      </div>

      <!-- View Mode Buttons -->
      <div class="flex items-center gap-2 justify-between sm:justify-end text-xs">
        <div class="flex items-center rounded-xl bg-gray-100 p-1">
          <button
            @click="viewMode = 'grid'"
            class="flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer"
            :class="viewMode === 'grid' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-600 hover:text-gray-900'"
          >
            <Icon name="mdi:view-grid-outline" class="h-4 w-4" />
            <span class="hidden sm:inline">{{ isRTL ? 'کارت‌ها' : 'Grid' }}</span>
          </button>

          <button
            @click="viewMode = 'list'"
            class="flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer"
            :class="viewMode === 'list' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-600 hover:text-gray-900'"
          >
            <Icon name="mdi:view-headline" class="h-4 w-4" />
            <span class="hidden sm:inline">{{ isRTL ? 'لیست' : 'List' }}</span>
          </button>

          <button
            @click="viewMode = 'table'"
            class="flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer"
            :class="viewMode === 'table' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-600 hover:text-gray-900'"
          >
            <Icon name="mdi:table" class="h-4 w-4" />
            <span class="hidden sm:inline">{{ isRTL ? 'جدول' : 'Table' }}</span>
          </button>
        </div>

        <span class="text-gray-500 hidden md:inline font-mono">
          {{ isRTL ? 'صفحه' : 'Page' }} <strong class="text-gray-900">{{ toLocalizedDigits(page) }}</strong>
        </span>
      </div>
    </div>

    <!-- Loading Shimmer -->
    <div v-if="pending && !items.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <div v-for="i in 6" :key="i" class="h-44 rounded-2xl bg-gray-100 animate-pulse border border-gray-200"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredItems.length === 0" class="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500 space-y-2">
      <Icon name="mdi:text-box-remove-outline" class="h-10 w-10 text-gray-300 mx-auto" />
      <p class="text-xs font-semibold">{{ isRTL ? 'هیچ رکوردی یافت نشد.' : 'No records found.' }}</p>
    </div>

    <!-- VIEW MODE 1: GRID CARDS -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs hover:border-najmgreen hover:shadow-md transition"
      >
        <div>
          <!-- Thumbnail Image Header -->
          <div v-if="getFileUrl(item)" class="mb-3 h-36 w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200/80 flex items-center justify-center">
            <img
              :src="getFileUrl(item)!"
              :alt="getRecordTitle(item)"
              class="h-full w-full object-cover group-hover:scale-105 transition duration-300"
              loading="lazy"
            />
          </div>

          <!-- Title & Type Badge -->
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="text-sm font-bold text-gray-900 group-hover:text-najmgreen transition font-d4 line-clamp-2">
              {{ getRecordTitle(item) }}
            </h3>

            <span v-if="item.layoutType || item.type || item.status" class="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-najmgreen shrink-0">
              {{ item.layoutType || item.type || item.status }}
            </span>
          </div>

          <!-- Description Excerpt -->
          <p v-if="getRecordExcerpt(item)" class="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-3">
            {{ getRecordExcerpt(item) }}
          </p>
        </div>

        <!-- Footer Actions & Quick Controls -->
        <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span class="text-gray-400 text-[11px] font-mono">ID: {{ item.id.slice(0, 8) }}</span>

          <div class="flex items-center gap-1">
            <!-- Open Advanced Drill-Down Editor Button -->
            <button
              @click="openMillerModal(item)"
              class="rounded-xl px-2.5 py-1 bg-najmgreen/10 text-najmgreen hover:bg-najmgreen hover:text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              :title="isRTL ? 'ویرایشگر پیشرفته ستونی' : 'Miller Editor'"
            >
              <Icon name="mdi:pencil-outline" class="h-3.5 w-3.5" />
              <span>{{ isRTL ? 'ویرایش' : 'Edit' }}</span>
            </button>

            <!-- Duplicate Record Button -->
            <button
              @click="duplicateRecord(item)"
              class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition cursor-pointer"
              :title="isRTL ? 'کپی و تکثیر' : 'Duplicate'"
            >
              <Icon name="mdi:content-copy" class="h-3.5 w-3.5" />
            </button>

            <!-- Delete Record Button -->
            <button
              @click="deleteRecord(item.id)"
              class="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
              :title="isRTL ? 'حذف' : 'Delete'"
            >
              <Icon name="mdi:delete-outline" class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW MODE 2: COMPACT LIST -->
    <div v-else-if="viewMode === 'list'" class="space-y-3">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-xs hover:border-najmgreen transition gap-3"
      >
        <div class="flex items-center gap-3.5 min-w-0">
          <div v-if="getFileUrl(item)" class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
            <img :src="getFileUrl(item)!" :alt="getRecordTitle(item)" class="h-full w-full object-cover" />
          </div>

          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-gray-900 font-d4 truncate">
                {{ getRecordTitle(item) }}
              </h3>
              <span v-if="item.layoutType || item.type" class="rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-najmgreen">
                {{ item.layoutType || item.type }}
              </span>
            </div>
            <p v-if="getRecordExcerpt(item)" class="text-xs text-gray-500 truncate max-w-xl mt-0.5">
              {{ getRecordExcerpt(item) }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <button
            @click="openMillerModal(item)"
            class="rounded-xl px-3 py-1.5 bg-najmgreen text-white font-bold text-xs flex items-center gap-1 transition"
          >
            <Icon name="mdi:pencil-outline" class="h-3.5 w-3.5" />
            <span>ویرایش</span>
          </button>
          <button @click="duplicateRecord(item)" class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Icon name="mdi:content-copy" class="h-3.5 w-3.5" />
          </button>
          <button @click="deleteRecord(item.id)" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
            <Icon name="mdi:delete-outline" class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW MODE 3: SIMPLE TABLE -->
    <div v-else class="relative overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs max-w-full">
      <table class="w-full text-xs text-right">
        <thead class="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
          <tr>
            <th class="px-3 py-2.5">ID</th>
            <th class="px-3 py-2.5">{{ isRTL ? 'عنوان / نام' : 'Title' }}</th>
            <th class="px-3 py-2.5">{{ isRTL ? 'توضیحات' : 'Description' }}</th>
            <th class="px-3 py-2.5">{{ isRTL ? 'نوع' : 'Type' }}</th>
            <th class="px-3 py-2.5 text-center w-28">{{ isRTL ? 'عملیات' : 'Actions' }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-gray-50 transition">
            <td class="px-3 py-2.5 font-bold text-gray-900 font-mono">{{ item.id.slice(0, 8) }}</td>
            <td class="px-3 py-2.5 text-gray-900 font-bold truncate max-w-[200px]">{{ getRecordTitle(item) }}</td>
            <td class="px-3 py-2.5 text-gray-600 truncate max-w-[250px]">{{ getRecordExcerpt(item) || '—' }}</td>
            <td class="px-3 py-2.5 text-gray-500">{{ item.layoutType || item.type || item.status || '—' }}</td>
            <td class="px-3 py-2.5 text-center">
              <div class="flex items-center justify-center gap-1">
                <button @click="openMillerModal(item)" class="p-1.5 text-najmgreen hover:bg-emerald-50 rounded" title="ویرایش">
                  <Icon name="mdi:pencil-outline" class="h-4 w-4" />
                </button>
                <button @click="deleteRecord(item.id)" class="p-1.5 text-red-500 hover:bg-red-50 rounded" title="حذف">
                  <Icon name="mdi:delete-outline" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center justify-between rounded-2xl bg-white p-3 sm:p-4 shadow-xs border border-gray-200 text-xs">
      <button
        @click="page = Math.max(1, page - 1)"
        :disabled="page === 1 || pending"
        class="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
      >
        <Icon :name="isRTL ? 'mdi:chevron-right' : 'mdi:chevron-left'" class="h-4 w-4" />
        {{ isRTL ? 'قبلی' : 'Previous' }}
      </button>

      <span class="font-semibold text-gray-600 font-mono">
        {{ isRTL ? 'صفحه' : 'Page' }} <strong class="text-gray-900">{{ toLocalizedDigits(page) }}</strong>
      </span>

      <button
        @click="page++"
        :disabled="items.length < per || pending"
        class="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
      >
        {{ isRTL ? 'بعدی' : 'Next' }}
        <Icon :name="isRTL ? 'mdi:chevron-left' : 'mdi:chevron-right'" class="h-4 w-4" />
      </button>
    </div>

    <!-- Integrated Miller-Columns Drill-Down Modal Editor -->
    <MillerColumnModal
      :isOpen="millerModalOpen"
      :collectionName="collectionName"
      :record="editingRecord"
      @close="millerModalOpen = false"
      @saved="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '~/composables/useLocale'
import { useAdminLogger } from '~/composables/useAdminLogger'
import { useDashboardState } from '~/composables/useDashboardCache'
import { toLocalizedDigits } from '~/utils/digits'
import MillerColumnModal from '~/components/admin/MillerColumnModal.vue'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const collectionName = computed(() => (route.params.name as string) || '')
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const { logInfo, logError, logNetwork } = useAdminLogger()

const page = ref(1)
const per = 24
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list' | 'table'>('grid')

// Miller Column Drill-Down Modal State
const millerModalOpen = ref(false)
const editingRecord = ref<Record<string, any> | null>(null)

interface CollectionResponse {
  items: Record<string, any>[]
  totalItems: number
}

const cachedState = useDashboardState<CollectionResponse>(`col-${collectionName.value}`, () => ({ items: [], totalItems: 0 }))

const { data: colData, pending, refresh } = await useAsyncData<CollectionResponse>(
  `pb-col-${collectionName.value}`,
  () =>
    $fetch<CollectionResponse>('/api/admin/pb/collection', {
      params: { name: collectionName.value, page: page.value, per },
    }),
  {
    watch: [page, collectionName],
    lazy: true,
    default: () => cachedState.value,
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || cachedState.value,
  }
)

const items = computed(() => colData.value?.items || cachedState.value.items || [])
const totalRecords = computed(() => colData.value?.totalItems || cachedState.value.totalItems || items.value.length)

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter((item) => {
    return Object.values(item).some((v) => String(v ?? '').toLowerCase().includes(q))
  })
})

function getHumanTitle(name: string): string {
  if (name === 'pages') return isRTL.value ? 'صفحات سایت' : 'Pages'
  if (name === 'products') return isRTL.value ? 'محصولات' : 'Products'
  if (name === 'services') return isRTL.value ? 'خدمات' : 'Services'
  if (name === 'orders') return isRTL.value ? 'سفارش‌ها' : 'Orders'
  if (name === 'media_files') return isRTL.value ? 'فایل‌های رسانه' : 'Media'
  return name
}

function getRecordTitle(item: Record<string, any>): string {
  return (
    item.title ||
    item.name ||
    item.headline ||
    item.label ||
    item.slug ||
    item.id ||
    'رکورد بدون عنوان'
  )
}

function getRecordExcerpt(item: Record<string, any>): string {
  const text = item.description || item.content || item.summary || item.text || item.bio || ''
  if (!text) return ''
  return String(text).replace(/<[^>]*>/g, '').trim()
}

function getFileUrl(item: Record<string, any>): string | null {
  const filename = item.coverImage || item.image || item.file || item.avatar || item.thumbnail
  if (!filename || typeof filename !== 'string') return null

  const pbUrl = useRuntimeConfig().public.pbUrl || 'http://65.108.80.205:8090'
  const colId = item.collectionId || collectionName.value
  return `${pbUrl}/api/files/${colId}/${item.id}/${filename}`
}

function openMillerModal(item: Record<string, any>) {
  editingRecord.value = JSON.parse(JSON.stringify(item))
  millerModalOpen.value = true
}

function openCreateModal() {
  editingRecord.value = null
  millerModalOpen.value = true
}

async function refreshData() {
  logNetwork('Collections', `Refreshing ${collectionName.value}`)
  await refresh()
}

async function duplicateRecord(item: Record<string, any>) {
  try {
    logNetwork('Collections', `Duplicating record ${item.id} in ${collectionName.value}`)
    const clone = { ...item }
    delete clone.id
    delete clone.created
    delete clone.updated

    if (clone.title) clone.title = `${clone.title} (کپی)`
    if (clone.name) clone.name = `${clone.name}-copy`
    if (clone.slug) clone.slug = `${clone.slug}-copy-${Date.now().toString().slice(-4)}`

    await $fetch('/api/admin/pb/collection', {
      method: 'POST',
      params: { name: collectionName.value },
      body: clone,
    })

    logInfo('Collections', `Successfully duplicated record ${item.id}`)
    await refresh()
  } catch (err: any) {
    logError('Collections', `Failed to duplicate record: ${err?.message || err}`)
  }
}

async function deleteRecord(id: string) {
  const confirmMsg = isRTL.value ? 'حذف این رکورد؟' : 'Delete this record?'
  if (!confirm(confirmMsg)) return

  try {
    logNetwork('Collections', `Deleting record ${id} from ${collectionName.value}`)
    await $fetch('/api/admin/pb/collection', {
      method: 'DELETE',
      params: { name: collectionName.value, id },
    })
    logInfo('Collections', `Deleted record ${id}`)
    await refresh()
  } catch (err: any) {
    logError('Collections', `Failed to delete record: ${err?.message || err}`)
  }
}
</script>
