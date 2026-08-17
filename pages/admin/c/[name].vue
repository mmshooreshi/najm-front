<!-- pages/admin/c/[name].vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import RecordDrawer from '~/components/RecordDrawer.vue'
import MillerColumnModal from '~/components/admin/MillerColumnModal.vue'

definePageMeta({ layout: 'admin' })

// 1) Types
interface RecordModel {
  id: string
  slug?: string
  email?: string
  name?: string
  title?: string
  created: string
  updated: string
  uiData?: Record<string, any>
  [key: string]: unknown
}
interface AdminCollectionResponse<T> {
  items: T[]
  total: number
}

// 2) Route & Pagination
const route = useRoute()
const collectionName = computed(() => route.params.name as string)
const page = ref(1)
const per = 25

// Active record for Miller Column Modal
const selectedRecord = ref<RecordModel | null>(null)
const isEditorOpen = ref(false)

// 3) Fetch collection items
const { data, refresh, pending, error } = await useAsyncData<AdminCollectionResponse<RecordModel>>(
  () =>
    $fetch<AdminCollectionResponse<RecordModel>>('/api/admin/pb/collection', {
      params: { name: collectionName.value, page: page.value, per }
    }),
  { watch: [page, collectionName] }
)

const items = computed(() => data.value?.items ?? [])

function openEditor(record: RecordModel) {
  selectedRecord.value = record
  isEditorOpen.value = true
}

function handleSaved() {
  refresh()
}

async function removeRecord(id: string) {
  if (!confirm('آیا از حذف این رکورد اطمینان دارید؟')) return
  await $fetch('/api/admin/pb/collection', {
    method: 'DELETE',
    params: { name: collectionName.value, id }
  })
  await refresh()
}
</script>

<template>
  <div dir="rtl" class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Icon name="mdi:database-outline" class="w-6 h-6 text-najmgreen" />
          مدیریت کالکشن: <span class="font-mono text-najmgreen">{{ collectionName }}</span>
        </h1>
        <p class="text-xs text-gray-500 mt-1">
          مشاهده، ویرایش درختی و به‌روزرسانی رکوردهای دیتابیس بدون نیاز به کار با کدهای خام JSON
        </p>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-2">
        <button
          class="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition flex items-center gap-1.5 shadow-sm"
          :disabled="pending"
          @click="() => refresh()"
        >
          <Icon name="mdi:refresh" class="w-4 h-4" :class="{ 'animate-spin': pending }" />
          به‌روزرسانی
        </button>
        <RecordDrawer :collection="collectionName" @saved="refresh" />
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-2xl text-xs border border-red-200">
      خطا در بارگذاری داده‌ها: {{ (error as Error).message }}
    </div>

    <!-- Records Table -->
    <div class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-xs text-right divide-y divide-gray-100">
          <thead class="bg-gray-50/80 text-gray-500 font-semibold">
            <tr>
              <th class="px-5 py-3.5">عنوان / شناسه (Slug / ID)</th>
              <th class="px-5 py-3.5">نوع محتوا</th>
              <th class="px-5 py-3.5">تاریخ ایجاد</th>
              <th class="px-5 py-3.5">آخرین بروزرسانی</th>
              <th class="px-5 py-3.5 text-center">عملیات و ویرایشگر هوشمند</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 bg-white">
            <tr
              v-for="item in items"
              :key="item.id"
              class="hover:bg-gray-50/60 transition group"
            >
              <!-- Identifier -->
              <td class="px-5 py-4 font-mono font-bold text-gray-800">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-xl bg-najmgreen/10 text-najmgreen flex items-center justify-center font-sans">
                    <Icon name="mdi:file-document-outline" class="w-4 h-4" />
                  </div>
                  <div>
                    <span class="block text-xs text-gray-900">{{ item.slug || item.name || item.title || item.id }}</span>
                    <span class="block text-[10px] text-gray-400 font-mono">{{ item.id }}</span>
                  </div>
                </div>
              </td>

              <!-- Content Type -->
              <td class="px-5 py-4">
                <span v-if="item.uiData" class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                  ساختار درختی UI (JSON)
                </span>
                <span v-else class="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-semibold">
                  رکورد استاندارد
                </span>
              </td>

              <!-- Created -->
              <td class="px-5 py-4 text-gray-500 font-mono ltr text-right">
                {{ new Date(item.created).toLocaleDateString('fa-IR') }}
              </td>

              <!-- Updated -->
              <td class="px-5 py-4 text-gray-500 font-mono ltr text-right">
                {{ new Date(item.updated).toLocaleDateString('fa-IR') }}
              </td>

              <!-- Actions -->
              <td class="px-5 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openEditor(item)"
                    class="px-3.5 py-1.5 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Icon name="mdi:layers-triple-outline" class="w-4 h-4" />
                    <span>ویرایشگر Miller</span>
                  </button>

                  <RecordDrawer
                    :collection="collectionName"
                    :record="item"
                    icon="mdi:pencil"
                    @saved="refresh"
                  />

                  <button
                    class="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    @click="removeRecord(item.id)"
                    title="حذف رکورد"
                  >
                    <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="!items.length && !pending" class="text-center py-16 text-xs text-gray-400">
        هیچ رکوردی در این کالکشن یافت نشد.
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="items.length" class="flex items-center justify-between text-xs text-gray-500 px-2">
      <span>نمایش صفحه {{ page }}</span>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
          :disabled="page === 1"
          @click="page--"
        >
          صفحه قبلی
        </button>
        <button
          class="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
          :disabled="items.length < per"
          @click="page++"
        >
          صفحه بعدی
        </button>
      </div>
    </div>

    <!-- Miller Column Drill Down Modal -->
    <MillerColumnModal
      :open="isEditorOpen"
      :collection="collectionName"
      :record="selectedRecord"
      @close="isEditorOpen = false"
      @saved="handleSaved"
    />
  </div>
</template>
