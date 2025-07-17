<!-- pages/admin/c/[name].vue -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import RecordDrawer from '~/components/RecordDrawer.vue'

definePageMeta({ layout: 'admin' })

// 1) Types
interface RecordModel {
  id: string
  email: string
  created: string
  updated: string
  [key: string]: unknown
}
interface AdminCollectionResponse<T> {
  items: T[]
  total: number
}

// 2) Route & Pagination
const route          = useRoute()
const collectionName = computed(() => route.params.name as string)
const page           = ref(1)
const per            = 25

// 3) Fetch (no explicit key) with correct generic
const { data, refresh, pending, error } = await useAsyncData<
  AdminCollectionResponse<RecordModel>
>(
  // omit the key so Nuxt auto-keys it
  () =>
    $fetch<AdminCollectionResponse<RecordModel>>('/api/admin/pb/collection', {
      params: { name: collectionName.value, page: page.value, per }
    }),
  { watch: [page, collectionName] }
)

// 4) Derive items with a default
const items = computed(() => data.value?.items ?? [])

// 5) Track expanded rows by ID
const expanded = reactive<Record<string, boolean>>({})
watch(
  items,
  (newItems) => {
    Object.keys(expanded).forEach((k) => delete expanded[k])
    newItems.forEach((item) => (expanded[item.id] = false))
  },
  { immediate: true }
)

// 6) Actions
function toggleRow(id: string) {
  expanded[id] = !expanded[id]
}

async function removeRecord(id: string) {
  if (!confirm('حذف رکورد؟')) return
  await $fetch('/api/admin/pb/collection', {
    method: 'DELETE',
    params: { name: collectionName.value, id }
  })
  await refresh()
}
</script>

<template>
  <h1 class="mb-4 text-2xl font-bold">{{ collectionName }}</h1>

  <!-- Controls -->
  <div class="mb-2 flex items-center gap-2">
    <button class="btn" :disabled="pending" @click="refresh">↻ Refresh</button>
    <RecordDrawer :collection="collectionName" @saved="refresh" />
  </div>

  <!-- Error -->
  <div v-if="error" class="mb-2 text-red-600">
    خطا در بارگذاری: {{ (error as Error).message }}
  </div>

  <!-- Table -->
  <div class="relative overflow-x-auto rounded-lg border bg-white shadow">
    <table class="min-w-full text-sm">
      <thead class="bg-gray-100 text-gray-600">
        <tr>
          <th class="px-4 py-2 text-left">
            <div class="flex items-center gap-1">
              <Icon name="si:json-fill" class="h-5 w-5" /> Full
            </div>
          </th>
          <th class="px-4 py-2 text-left">
            <div class="flex items-center gap-1">
              <Icon name="fa6-solid:id-card-clip" class="h-5 w-5" /> ID
            </div>
          </th>
          <th class="px-4 py-2 text-left">
            <div class="flex items-center gap-1">
              <Icon name="mage:email-opened-fill" class="h-5 w-5" /> Email
            </div>
          </th>
          <th class="px-4 py-2 text-left">
            <div class="flex items-center gap-1">
              <Icon name="zondicons:date-add" class="h-5 w-5" /> Created
            </div>
          </th>
          <th class="px-4 py-2 text-left">
            <div class="flex items-center gap-1">
              <Icon name="eos-icons:modified-date-outlined" class="h-5 w-5" /> Updated
            </div>
          </th>
          <th class="px-4 py-2 text-left">
            <div class="flex items-center gap-1">
              <Icon name="codicon:github-action" class="h-5 w-5" /> Actions
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-for="item in items" :key="item.id">
          <!-- Data row -->
          <tr class="border-t">
            <td class="px-4 py-2">
              <button @click="toggleRow(item.id)" class="text-blue-600 hover:text-blue-800">
                <Icon name="si:json-fill" class="w-5 h-5" />
              </button>
            </td>
            <td class="px-4 py-2">{{ item.id }}</td>
            <td class="px-4 py-2">{{ item.email }}</td>
            <td class="px-4 py-2">{{ new Date(item.created).toLocaleString() }}</td>
            <td class="px-4 py-2">{{ new Date(item.updated).toLocaleString() }}</td>
            <td class="px-4 py-2 space-x-2 rtl:space-x-reverse">
              <RecordDrawer
                :collection="collectionName"
                :record="item"
                icon="mdi:pencil"
                @saved="refresh"
              />
              <button class="hover:text-red-600" @click="removeRecord(item.id)">
                <Icon name="mdi:delete-outline" />
              </button>
            </td>
          </tr>

          <!-- Collapsible JSON -->
          <tr v-if="expanded[item.id]">
            <td colspan="6" class="bg-gray-50 px-4 py-3 animate-fade-in">
              <pre
                class="text-xs overflow-x-auto max-w-[90vw] sm:max-w-[50vw] whitespace-pre-wrap bg-white p-4 rounded-xl border border-gray-200"
                style="direction: ltr;"
              >{{ JSON.stringify(item, null, 2) }}</pre>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div class="mt-4 flex items-center gap-2">
    <button class="btn" :disabled="page === 1" @click="page--">Prev</button>
    <span>Page {{ page }}</span>
    <button class="btn" :disabled="items.length < per" @click="page++">Next</button>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-in-out;
}
</style>
