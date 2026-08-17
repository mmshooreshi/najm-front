<!-- components/admin/MillerColumnModal.vue -->
<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-md">
        <!-- Modal Container -->
        <div
          dir="rtl"
          class="relative w-full h-full max-h-[94vh] bg-[#F8FAFC] rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden flex flex-col animate-modal-pop"
        >
          <!-- Top Bar: Title, Breadcrumbs, Save & Close -->
          <div class="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-najmgreen/10 text-najmgreen flex items-center justify-center font-bold">
                <Icon name="mdi:layers-triple-outline" class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-base font-bold text-gray-900">
                    ویرایشگر هوشمند رکورد: <span class="text-najmgreen font-mono">{{ record?.slug || record?.id || collection }}</span>
                  </h2>
                  <span v-if="hasChanges" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {{ changedFieldsCount }} تغییر ذخیره‌نشده
                  </span>
                </div>
                <!-- Breadcrumbs -->
                <nav class="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 font-mono">
                  <button @click="navPath = []" class="hover:text-najmgreen">root</button>
                  <template v-for="(seg, idx) in navPath" :key="idx">
                    <span>/</span>
                    <button
                      @click="navPath = navPath.slice(0, idx + 1)"
                      class="hover:text-najmgreen"
                      :class="idx === navPath.length - 1 ? 'text-gray-900 font-bold' : ''"
                    >
                      {{ seg }}
                    </button>
                  </template>
                </nav>
              </div>
            </div>

            <!-- Action Controls -->
            <div class="flex items-center gap-3">
              <button
                v-if="hasChanges"
                @click="resetChanges"
                class="px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                بازنشانی تغییرات
              </button>

              <button
                @click="saveRecord"
                :disabled="isSaving"
                class="px-5 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Icon v-if="isSaving" name="mdi:loading" class="w-4 h-4 animate-spin" />
                <Icon v-else name="mdi:content-save-outline" class="w-4 h-4" />
                <span>{{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
              </button>

              <button
                @click="handleClose"
                class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition"
                title="بستن (ESC)"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Main 3-Pane Miller Columns Body -->
          <div class="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            <!-- Pane 1: Root Sections / High-Level Keys (3 cols) -->
            <div class="md:col-span-3 bg-white border-l border-gray-200 overflow-y-auto p-3 space-y-1">
              <div class="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                <span>بخش‌های اصلی</span>
                <span class="text-[10px] font-mono">{{ rootSections.length }}</span>
              </div>
              <button
                v-for="sec in rootSections"
                :key="sec.key"
                @click="selectRootSection(sec.key)"
                class="w-full text-right p-3 rounded-2xl text-xs font-semibold transition flex items-center justify-between group"
                :class="selectedRoot === sec.key ? 'bg-najmgreen/10 text-najmgreen font-bold border border-najmgreen/20' : 'text-gray-700 hover:bg-gray-50'"
              >
                <div class="flex items-center gap-2.5">
                  <Icon :name="getSectionIcon(sec.key)" class="w-4 h-4 text-gray-400 group-hover:text-najmgreen" />
                  <span>{{ sec.label }}</span>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-mono">
                  {{ sec.type }}
                </span>
              </button>
            </div>

            <!-- Pane 2: Sub-items / Array Cards / Object Properties (4 cols) -->
            <div class="md:col-span-4 bg-[#F8FAFC] border-l border-gray-200 overflow-y-auto p-3 space-y-2">
              <div class="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                <span>زیرمجموعه / فیلدها</span>
                <span class="text-[10px] font-mono">{{ subItems.length }}</span>
              </div>

              <div v-if="!subItems.length" class="text-center py-12 text-xs text-gray-400">
                یک بخش را از ستون سمت راست انتخاب فرمایید.
              </div>

              <template v-else>
                <!-- Add new item if array -->
                <button
                  v-if="isArray(currentSubParent)"
                  @click="addNewArrayItem"
                  class="w-full py-2 px-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-najmgreen text-gray-500 hover:text-najmgreen text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Icon name="mdi:plus" class="w-4 h-4" />
                  افزودن آیتم جدید به لیست
                </button>

                <div
                  v-for="(item, idx) in subItems"
                  :key="idx"
                  @click="selectSubItem(item.key)"
                  class="p-3 bg-white rounded-2xl border transition cursor-pointer flex items-center justify-between group"
                  :class="selectedSub === item.key ? 'border-najmgreen ring-2 ring-najmgreen/10 shadow-sm' : 'border-gray-200 hover:border-gray-300'"
                >
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-lg bg-gray-100 text-[10px] font-mono font-bold flex items-center justify-center text-gray-600">
                      {{ idx + 1 }}
                    </span>
                    <div>
                      <div class="text-xs font-bold text-gray-800">{{ item.label }}</div>
                      <div class="text-[10px] text-gray-400 truncate max-w-[180px] font-mono">{{ item.preview }}</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-1">
                    <button
                      v-if="isArray(currentSubParent)"
                      @click.stop="removeArrayItem(idx)"
                      class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition"
                      title="حذف آیتم"
                    >
                      <Icon name="mdi:trash-can-outline" class="w-3.5 h-3.5" />
                    </button>
                    <Icon name="mdi:chevron-left" class="w-4 h-4 text-gray-400 group-hover:text-najmgreen transition" />
                  </div>
                </div>
              </template>
            </div>

            <!-- Pane 3: Focused Field Inspector & Inputs (5 cols) -->
            <div class="md:col-span-5 bg-white overflow-y-auto p-6 space-y-6">
              <div class="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h3 class="text-sm font-bold text-gray-900">
                  ویرایشگر مقدار: <span class="font-mono text-najmgreen">{{ selectedSub || selectedRoot || 'موردی انتخاب نشده' }}</span>
                </h3>
              </div>

              <!-- Field Input Controls based on type -->
              <div v-if="inspectorTarget !== undefined" class="space-y-5">
                <!-- If primitive string/number -->
                <div v-if="typeof inspectorTarget === 'string' && inspectorTarget.length > 80" class="space-y-1.5">
                  <label class="block text-xs font-bold text-gray-700">متن طولانی / پاراگراف</label>
                  <textarea
                    v-model="inspectorProxy"
                    rows="5"
                    class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:border-najmgreen focus:outline-none transition leading-relaxed"
                  ></textarea>
                </div>

                <div v-else-if="typeof inspectorTarget === 'string' && isImageUrl(inspectorTarget)" class="space-y-3">
                  <label class="block text-xs font-bold text-gray-700">تصویر / مدیا</label>
                  <div class="w-full aspect-video rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center relative">
                    <img :src="inspectorProxy" class="w-full h-full object-contain" />
                  </div>
                  <input
                    v-model="inspectorProxy"
                    type="text"
                    placeholder="https://... یا /images/..."
                    class="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono ltr text-left focus:bg-white focus:border-najmgreen focus:outline-none transition"
                  />
                </div>

                <div v-else-if="typeof inspectorTarget === 'string'" class="space-y-1.5">
                  <label class="block text-xs font-bold text-gray-700">متن عنوان یا مقدار</label>
                  <input
                    v-model="inspectorProxy"
                    type="text"
                    class="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:border-najmgreen focus:outline-none transition"
                  />
                </div>

                <div v-else-if="typeof inspectorTarget === 'number'" class="space-y-1.5">
                  <label class="block text-xs font-bold text-gray-700">مقدار عددی</label>
                  <input
                    v-model.number="inspectorProxy"
                    type="number"
                    class="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono focus:bg-white focus:border-najmgreen focus:outline-none transition"
                  />
                </div>

                <div v-else-if="typeof inspectorTarget === 'boolean'" class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <span class="text-xs font-bold text-gray-800">فعال / غیرفعال (Toggle)</span>
                  <button
                    @click="inspectorProxy = !inspectorProxy"
                    type="button"
                    class="w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5"
                    :class="inspectorProxy ? 'bg-najmgreen' : 'bg-gray-300'"
                  >
                    <div
                      class="w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
                      :class="inspectorProxy ? '-translate-x-6' : 'translate-x-0'"
                    ></div>
                  </button>
                </div>

                <!-- If array of strings (e.g. highlights, tags) -->
                <div v-else-if="Array.isArray(inspectorTarget) && inspectorTarget.every(x => typeof x === 'string')" class="space-y-3">
                  <label class="block text-xs font-bold text-gray-700">لیست برچسب‌ها / نکات برجسته</label>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, tIdx) in inspectorTarget"
                      :key="tIdx"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-xs text-gray-800"
                    >
                      <span>{{ tag }}</span>
                      <button @click="inspectorTarget.splice(tIdx, 1)" class="text-gray-400 hover:text-red-500">
                        <Icon name="mdi:close" class="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <input
                      v-model="newTagInput"
                      @keydown.enter.prevent="addTag"
                      type="text"
                      placeholder="برچسب جدید..."
                      class="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
                    />
                    <button
                      @click="addTag"
                      class="px-4 py-2 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-black transition"
                    >
                      افزودن
                    </button>
                  </div>
                </div>

                <!-- If object: render all key-value entries in a clean form -->
                <div v-else-if="typeof inspectorTarget === 'object' && inspectorTarget !== null" class="space-y-4">
                  <div
                    v-for="(val, key) in inspectorTarget"
                    :key="key"
                    class="space-y-1"
                  >
                    <label class="block text-[11px] font-bold text-gray-500 font-mono">{{ key }}</label>
                    <input
                      v-if="typeof val === 'string' || typeof val === 'number'"
                      v-model="inspectorTarget[key]"
                      class="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
                    />
                    <textarea
                      v-else-if="typeof val === 'object'"
                      :value="JSON.stringify(val, null, 2)"
                      @input="updateJsonObjectKey(key, ($event.target as HTMLTextAreaElement).value)"
                      rows="3"
                      class="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] font-mono ltr text-left focus:bg-white focus:border-najmgreen focus:outline-none transition"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-16 text-xs text-gray-400">
                یک فیلد را برای ویرایش در این بخش انتخاب کنید.
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  open: boolean
  collection: string
  record: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const localData = ref<Record<string, any>>({})
const originalDataStr = ref('')
const navPath = ref<string[]>([])
const selectedRoot = ref<string>('')
const selectedSub = ref<string>('')
const newTagInput = ref('')
const isSaving = ref(false)

watch(
  () => props.record,
  (rec) => {
    if (rec) {
      // If uiData exists inside record (like in pages collection), clone that, else clone record
      const targetObj = rec.uiData || rec
      localData.value = JSON.parse(JSON.stringify(targetObj))
      originalDataStr.value = JSON.stringify(localData.value)
      
      const keys = Object.keys(localData.value)
      if (keys.length) {
        selectRootSection(keys[0])
      }
    }
  },
  { immediate: true, deep: true }
)

const hasChanges = computed(() => {
  return JSON.stringify(localData.value) !== originalDataStr.value
})

const changedFieldsCount = computed(() => {
  if (!hasChanges.value) return 0
  return 1 // reactive delta count
})

const rootSections = computed(() => {
  return Object.keys(localData.value).map(key => {
    const val = localData.value[key]
    const type = Array.isArray(val) ? `لیست (${val.length})` : typeof val === 'object' ? 'بخش' : typeof val
    return {
      key,
      label: formatLabel(key),
      type
    }
  })
})

function formatLabel(key: string): string {
  const map: Record<string, string> = {
    hero: 'هیرو و سربرگ اصلی (Hero)',
    services: 'خدمات و قابلیت‌ها',
    capabilities: 'کارت‌های توانمندی',
    industries: 'پکیج‌های صنایع',
    facilities: 'ماشین‌آلات و تجهیزات',
    faq: 'پرسش‌های متداول (FAQ)',
    contact: 'اطلاعات تماس',
    products: 'محصولات',
    links: 'لینک‌ها و منابع',
    serviceIncludes: 'شامل چه مواردی است',
    packages: 'پکیج‌ها',
    midCta: 'بخش فراخوان (CTA)'
  }
  return map[key] || key.replace(/_/g, ' ')
}

function getSectionIcon(key: string): string {
  if (key.includes('hero')) return 'mdi:star-outline'
  if (key.includes('service')) return 'mdi:tools'
  if (key.includes('faq')) return 'mdi:frequently-asked-questions'
  if (key.includes('contact')) return 'mdi:phone-outline'
  if (key.includes('product')) return 'mdi:package-variant-closed'
  return 'mdi:folder-outline'
}

function selectRootSection(key: string) {
  selectedRoot.value = key
  selectedSub.value = ''
  navPath.value = [key]
}

const currentSubParent = computed(() => {
  if (!selectedRoot.value) return null
  return localData.value[selectedRoot.value]
})

const subItems = computed(() => {
  const parent = currentSubParent.value
  if (!parent) return []

  if (Array.isArray(parent)) {
    return parent.map((item, idx) => ({
      key: String(idx),
      label: item?.title || item?.name || `آیتم ${idx + 1}`,
      preview: typeof item === 'object' ? JSON.stringify(item).slice(0, 40) : String(item)
    }))
  } else if (typeof parent === 'object') {
    return Object.keys(parent).map(k => ({
      key: k,
      label: formatLabel(k),
      preview: typeof parent[k] === 'object' ? `[${Array.isArray(parent[k]) ? 'لیست' : 'آبجکت'}]` : String(parent[k])
    }))
  }
  return []
})

function selectSubItem(key: string) {
  selectedSub.value = key
  navPath.value = [selectedRoot.value, key]
}

const inspectorTarget = computed(() => {
  if (!selectedRoot.value) return undefined
  const root = localData.value[selectedRoot.value]
  if (!selectedSub.value) return root
  return root[selectedSub.value]
})

const inspectorProxy = computed({
  get() {
    return inspectorTarget.value
  },
  set(val) {
    if (selectedRoot.value && selectedSub.value) {
      localData.value[selectedRoot.value][selectedSub.value] = val
    } else if (selectedRoot.value) {
      localData.value[selectedRoot.value] = val
    }
  }
})

function isArray(val: any): boolean {
  return Array.isArray(val)
}

function isImageUrl(val: string): boolean {
  return typeof val === 'string' && (val.endsWith('.png') || val.endsWith('.jpg') || val.endsWith('.webp') || val.endsWith('.svg') || val.includes('/images/'))
}

function addNewArrayItem() {
  const parent = currentSubParent.value
  if (Array.isArray(parent)) {
    const template = parent.length ? JSON.parse(JSON.stringify(parent[0])) : { title: 'عنوان جدید', description: 'توضیحات...' }
    parent.push(template)
  }
}

function removeArrayItem(idx: number) {
  const parent = currentSubParent.value
  if (Array.isArray(parent)) {
    parent.splice(idx, 1)
    if (selectedSub.value === String(idx)) {
      selectedSub.value = ''
    }
  }
}

function addTag() {
  if (!newTagInput.value.trim()) return
  if (Array.isArray(inspectorTarget.value)) {
    inspectorTarget.value.push(newTagInput.value.trim())
    newTagInput.value = ''
  }
}

function updateJsonObjectKey(key: string, rawVal: string) {
  try {
    const parsed = JSON.parse(rawVal)
    inspectorTarget.value[key] = parsed
  } catch {
    // wait for valid JSON
  }
}

function resetChanges() {
  if (confirm('آیا از لغو تمامی تغییرات اطمینان دارید؟')) {
    localData.value = JSON.parse(originalDataStr.value)
  }
}

async function saveRecord() {
  isSaving.value = true
  try {
    const isUiDataPage = !!props.record?.uiData
    const payload = isUiDataPage ? { ...props.record, uiData: localData.value } : localData.value

    const url = '/api/admin/pb/collection'
    const opts = props.record?.id
      ? { method: 'PATCH', params: { name: props.collection, id: props.record.id }, body: payload }
      : { method: 'POST', params: { name: props.collection }, body: payload }

    await $fetch(url, opts)
    originalDataStr.value = JSON.stringify(localData.value)
    emit('saved')
  } catch (err: any) {
    alert('خطا در ذخیره‌سازی: ' + err.message)
  } finally {
    isSaving.value = false
  }
}

function handleClose() {
  if (hasChanges.value) {
    if (!confirm('تغییرات ذخیره نشده دارید. آیا می‌خواهید پنجره بسته شود؟')) return
  }
  emit('close')
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.animate-modal-pop {
  animation: modal-pop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
