<!-- components/FileGrid.vue -->
<template>
  <div class="space-y-4">
    <!-- View & Bulk Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs">
      <div class="flex items-center gap-2">
        <button
          @click="selectAll"
          class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-1.5"
        >
          <Icon :name="allSelected ? 'fluent:select-all-off-16-regular' : 'fluent:select-all-on-16-regular'" class="w-4 h-4" />
          <span>{{ allSelected ? 'لغو انتخاب' : 'انتخاب همه' }}</span>
        </button>

        <button
          v-if="selected.size > 0"
          @click="bulkDelete"
          class="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition flex items-center gap-1"
        >
          <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
          <span>حذف ({{ selected.size }})</span>
        </button>

        <button
          v-if="selected.size > 0"
          @click="bulkCopyUrls"
          class="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition flex items-center gap-1"
        >
          <Icon name="mdi:link-variant" class="w-4 h-4" />
          <span>کپی لینک‌ها</span>
        </button>
      </div>

      <div class="flex items-center gap-2 text-xs text-gray-500">
        <span>{{ internalFiles.length }} فایل در این پوشه</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!internalFiles.length" class="text-center py-16 bg-white rounded-3xl border border-gray-200/80 space-y-2">
      <div class="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
        <Icon name="mdi:folder-open-outline" class="w-6 h-6" />
      </div>
      <p class="text-xs font-bold text-gray-700">هیچ فایلی در این پوشه وجود ندارد</p>
      <p class="text-[11px] text-gray-400">برای آپلود فایل‌ها را به کادر بالا بکشید و رها کنید.</p>
    </div>

    <!-- MODE 1: DENSE GRID -->
    <client-only v-else-if="viewMode === 'grid'">
      <draggable
        v-model="internalFiles"
        item-key="id"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
        tag="div"
        ghost-class="dragGhost"
        chosen-class="dragChosen"
        @end="onReorder"
      >
        <template #item="{ element: file }">
          <div
            @click="select(file)"
            class="relative group bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden p-2 flex flex-col justify-between"
            :class="selected.has(file.id) ? 'border-najmgreen ring-2 ring-najmgreen/20 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:shadow-xs'"
          >
            <!-- Image thumb -->
            <div class="relative w-full aspect-square rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center mb-2">
              <img
                :src="getUrl(file)"
                class="w-full h-full object-cover transition-opacity duration-300"
                :class="loaded.has(file.id) ? 'opacity-100' : 'opacity-0 blur-sm'"
                @load="loaded.add(file.id)"
              />

              <!-- Overlay quick actions -->
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                <button
                  @click.stop="$emit('info', file)"
                  class="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-xs transition"
                  title="مشخصات فایل"
                >
                  <Icon name="mdi:information-variant" class="w-4 h-4" />
                </button>
                <button
                  @click.stop="copyFileUrl(file)"
                  class="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-xs transition"
                  title="کپی لینک"
                >
                  <Icon name="mdi:content-copy" class="w-4 h-4" />
                </button>
                <button
                  @click.stop="renameFile(file)"
                  class="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-xs transition"
                  title="تغییر نام"
                >
                  <Icon name="mdi:pencil-outline" class="w-4 h-4" />
                </button>
                <button
                  @click.stop="deleteFile(file)"
                  class="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xs transition"
                  title="حذف"
                >
                  <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Meta info -->
            <div class="space-y-0.5 text-right px-0.5">
              <div class="text-[11px] font-bold text-gray-900 truncate font-mono ltr text-right">{{ file.filename }}</div>
              <div class="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>{{ formatSize(file.size) }}</span>
                <span>{{ getFileExt(file.filename) }}</span>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </client-only>

    <!-- MODE 2: DETAILED CARDS -->
    <div v-else-if="viewMode === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="file in internalFiles"
        :key="file.id"
        @click="select(file)"
        class="bg-white rounded-2xl border p-4 flex gap-4 transition-all cursor-pointer items-start"
        :class="selected.has(file.id) ? 'border-najmgreen ring-2 ring-najmgreen/20' : 'border-gray-200 hover:border-gray-300'"
      >
        <div class="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
          <img :src="getUrl(file)" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 min-w-0 space-y-1 text-right">
          <h4 class="text-xs font-bold text-gray-900 truncate font-mono ltr text-right">{{ file.filename }}</h4>
          <div class="text-[11px] text-gray-500 font-mono">{{ formatSize(file.size) }} • {{ file.mime || 'image' }}</div>
          <div class="text-[10px] text-gray-400">
            {{ new Date(file.created).toLocaleDateString('fa-IR') }}
          </div>
          <div class="pt-2 flex items-center gap-2">
            <button
              @click.stop="copyFileUrl(file)"
              class="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[10px] font-semibold text-gray-700 transition"
            >
              کپی لینک
            </button>
            <button
              @click.stop="$emit('info', file)"
              class="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[10px] font-semibold text-gray-700 transition"
            >
              مشخصات
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 3: TABLE VIEW -->
    <div v-else-if="viewMode === 'table'" class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <table class="min-w-full text-xs text-right divide-y divide-gray-100">
        <thead class="bg-gray-50/80 text-gray-500 font-semibold">
          <tr>
            <th class="p-3 w-10 text-center">انتخاب</th>
            <th class="p-3">پیش‌نمایش</th>
            <th class="p-3">نام فایل</th>
            <th class="p-3">فرمت</th>
            <th class="p-3">حجم</th>
            <th class="p-3">تاریخ آپلود</th>
            <th class="p-3 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          <tr
            v-for="file in internalFiles"
            :key="file.id"
            class="hover:bg-gray-50/60 transition"
            :class="selected.has(file.id) ? 'bg-emerald-50/30' : ''"
          >
            <td class="p-3 text-center">
              <input
                type="checkbox"
                :checked="selected.has(file.id)"
                @change="select(file)"
                class="rounded text-najmgreen focus:ring-0"
              />
            </td>
            <td class="p-3">
              <div class="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 flex items-center justify-center">
                <img :src="getUrl(file)" class="w-full h-full object-cover" />
              </div>
            </td>
            <td class="p-3 font-mono font-bold text-gray-900 ltr text-right">{{ file.filename }}</td>
            <td class="p-3 text-gray-500 font-mono uppercase">{{ getFileExt(file.filename) }}</td>
            <td class="p-3 text-gray-500 font-mono">{{ formatSize(file.size) }}</td>
            <td class="p-3 text-gray-500">{{ new Date(file.created).toLocaleDateString('fa-IR') }}</td>
            <td class="p-3 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <button @click.stop="copyFileUrl(file)" class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100" title="کپی لینک">
                  <Icon name="mdi:content-copy" class="w-4 h-4" />
                </button>
                <button @click.stop="$emit('info', file)" class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100" title="مشخصات">
                  <Icon name="mdi:information-variant" class="w-4 h-4" />
                </button>
                <button @click.stop="deleteFile(file)" class="p-1.5 rounded-lg text-red-500 hover:bg-red-50" title="حذف">
                  <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { usePocketBase } from '~/plugins/pb.client'

const draggable = defineAsyncComponent(() => import('vuedraggable'))

const props = withDefaults(
  defineProps<{
    files: any[]
    viewMode?: 'grid' | 'cards' | 'table'
  }>(),
  {
    viewMode: 'grid'
  }
)

const emit = defineEmits(['refresh', 'info', 'reorder'])

const selected = ref<Set<string>>(new Set())
const loaded = ref<Set<string>>(new Set())
const pb = usePocketBase()

const internalFiles = ref<any[]>([])
watch(
  () => props.files,
  n => (internalFiles.value = [...n]),
  { immediate: true }
)

function onReorder() {
  emit('reorder', internalFiles.value.map(f => f.id))
}

function select(file: any) {
  if (selected.value.has(file.id)) selected.value.delete(file.id)
  else selected.value.add(file.id)
}

const allSelected = computed(() =>
  internalFiles.value.length > 0 &&
  internalFiles.value.every(f => selected.value.has(f.id))
)

function selectAll() {
  if (allSelected.value) selected.value.clear()
  else internalFiles.value.forEach(f => selected.value.add(f.id))
}

function getUrl(file: any) {
  if (!file) return ''
  return pb.files.getURL(file, file.file)
}

function formatSize(bytes?: number): string {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function getFileExt(filename = ''): string {
  return filename.split('.').pop() || 'img'
}

function copyFileUrl(file: any) {
  const url = getUrl(file)
  navigator.clipboard?.writeText(url)
  alert('لینک فایل کپی شد:\n' + url)
}

async function bulkCopyUrls() {
  const urls = internalFiles.value
    .filter(f => selected.value.has(f.id))
    .map(f => getUrl(f))
    .join('\n')
  navigator.clipboard?.writeText(urls)
  alert(`${selected.value.size} لینک کپی شد.`)
}

async function deleteFile(file: any) {
  if (!confirm(`آیا از حذف فایل "${file.filename}" اطمینان دارید؟`)) return
  await pb.collection('media_files').delete(file.id)
  emit('refresh')
}

async function bulkDelete() {
  if (!confirm(`آیا از حذف ${selected.value.size} فایل انتخاب‌شده اطمینان دارید؟`)) return
  const ids = [...selected.value]
  await Promise.all(ids.map(id => pb.collection('media_files').delete(id)))
  selected.value.clear()
  emit('refresh')
}

async function renameFile(file: any) {
  const newName = prompt('نام جدید فایل:', file.filename)?.trim()
  if (!newName || newName === file.filename) return
  await pb.collection('media_files').update(file.id, { filename: newName })
  emit('refresh')
}
</script>

<style scoped>
.dragGhost {
  opacity: 0.2;
}
.dragChosen {
  transform: scale(1.02);
}
</style>
