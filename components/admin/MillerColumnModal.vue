<!-- components/admin/MillerColumnModal.vue -->
<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-md">
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
                    ویرایشگر پیشرفته رکورد: <span class="text-najmgreen font-mono">{{ activeRecord?.slug || activeRecord?.name || activeRecord?.id || activeCollection }}</span>
                  </h2>
                  <span v-if="hasChanges" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
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
                class="px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                بازنشانی تغییرات
              </button>

              <button
                @click="saveRecord"
                :disabled="isSaving"
                class="px-5 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Icon v-if="isSaving" name="mdi:loading" class="w-4 h-4 animate-spin" />
                <Icon v-else name="mdi:content-save-outline" class="w-4 h-4" />
                <span>{{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
              </button>

              <button
                @click="$emit('close')"
                class="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
                title="بستن پنجره"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- 3-Pane Miller Columns Body -->
          <div class="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-200">
            <!-- COLUMN 1: Root Sections (3 cols) -->
            <div class="md:col-span-3 bg-white p-4 overflow-y-auto space-y-2">
              <div class="flex items-center justify-between px-2 pb-2 text-xs font-bold text-gray-400 border-b border-gray-100">
                <span>بخش‌های اصلی (Sections)</span>
                <span class="font-mono text-[11px]">{{ rootSections.length }} بخش</span>
              </div>

              <div class="space-y-1 pt-1">
                <button
                  v-for="sec in rootSections"
                  :key="sec.key"
                  @click="selectRootSection(sec.key)"
                  class="w-full text-right p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition group cursor-pointer"
                  :class="[
                    selectedRoot === sec.key
                      ? 'bg-najmgreen text-white font-bold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate">
                    <Icon
                      :name="getSectionIcon(sec.key)"
                      class="w-4 h-4 flex-shrink-0"
                      :class="selectedRoot === sec.key ? 'text-white' : 'text-gray-400 group-hover:text-najmgreen'"
                    />
                    <span class="truncate">{{ sec.label }}</span>
                  </div>
                  <span
                    class="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-normal"
                    :class="selectedRoot === sec.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'"
                  >
                    {{ sec.type }}
                  </span>
                </button>
              </div>
            </div>

            <!-- COLUMN 2: Sub-items / Cards / Keys (4 cols) -->
            <div class="md:col-span-4 bg-[#F8FAFC] p-4 overflow-y-auto space-y-2 border-r border-gray-200">
              <div class="flex items-center justify-between px-2 pb-2 text-xs font-bold text-gray-400 border-b border-gray-200">
                <span>زیرمجموعه‌ها و کارت‌ها</span>
                <span class="font-mono text-[11px]">{{ subItems.length }} آیتم</span>
              </div>

              <div v-if="!selectedRoot" class="py-12 text-center text-xs text-gray-400">
                لطفاً یک بخش را از ستون اول انتخاب کنید.
              </div>

              <div v-else-if="subItems.length === 0" class="py-12 text-center text-xs text-gray-400">
                این بخش به صورت فیلد منفرد مستقیماً در ستون ویرایشگر قابل مشاهده است.
              </div>

              <div v-else class="space-y-1.5 pt-1">
                <button
                  v-for="sub in subItems"
                  :key="sub.key"
                  @click="selectSubItem(sub.key)"
                  class="w-full text-right p-3 rounded-2xl text-xs transition border flex flex-col gap-1 cursor-pointer"
                  :class="[
                    selectedSub === sub.key
                      ? 'bg-white border-najmgreen ring-2 ring-najmgreen/20 shadow-xs'
                      : 'bg-white/80 hover:bg-white border-gray-200 text-gray-700'
                  ]"
                >
                  <div class="flex items-center justify-between w-full">
                    <span class="font-bold text-gray-900 truncate">{{ sub.label }}</span>
                    <span class="text-[10px] font-mono text-gray-400">#{{ sub.key }}</span>
                  </div>
                  <p class="text-[11px] text-gray-500 line-clamp-1 text-right w-full">
                    {{ sub.preview || '—' }}
                  </p>
                </button>
              </div>
            </div>

            <!-- COLUMN 3: Field Inspector & Direct Controls (5 cols) -->
            <div class="md:col-span-5 bg-white p-6 overflow-y-auto space-y-6">
              <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <span class="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Icon name="mdi:pencil-ruler" class="w-4 h-4 text-najmgreen" />
                  ویرایشگر هوشمند فیلد (Inspector)
                </span>
                <span class="text-[10px] font-mono text-gray-400">
                  {{ navPath.join(' / ') || 'انتخاب نشده' }}
                </span>
              </div>

              <!-- Form Fields Dynamic Renderer -->
              <div v-if="inspectorTarget !== undefined" class="space-y-5">
                <!-- Case A: Target is Primitive String -->
                <div v-if="typeof inspectorTarget === 'string'" class="space-y-2">
                  <label class="block text-xs font-bold text-gray-700">مقدار متنی:</label>
                  <textarea
                    v-if="inspectorTarget.length > 50 || inspectorTarget.includes('\n')"
                    v-model="inspectorProxy"
                    rows="6"
                    class="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-gray-200 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition leading-relaxed"
                  ></textarea>
                  <input
                    v-else
                    v-model="inspectorProxy"
                    type="text"
                    class="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-gray-200 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
                  />
                </div>

                <!-- Case B: Target is Boolean -->
                <div v-else-if="typeof inspectorTarget === 'boolean'" class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <span class="text-xs font-bold text-gray-800">فعال / غیرفعال:</span>
                  <input
                    type="checkbox"
                    v-model="inspectorProxy"
                    class="w-5 h-5 rounded text-najmgreen focus:ring-0 cursor-pointer"
                  />
                </div>

                <!-- Case C: Target is Array of Strings (Tags/Highlights) -->
                <div v-else-if="isArray(inspectorTarget) && (inspectorTarget.length === 0 || typeof inspectorTarget[0] === 'string')" class="space-y-3">
                  <label class="block text-xs font-bold text-gray-700">لیست تگ‌ها و آیتم‌ها:</label>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tag, idx) in inspectorTarget"
                      :key="idx"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-najmgrey text-xs text-gray-800 border border-najmborder/40"
                    >
                      <span>{{ tag }}</span>
                      <button
                        @click="removeTag(idx)"
                        class="text-gray-400 hover:text-red-500 p-0.5 rounded transition"
                      >
                        <Icon name="mdi:close" class="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                  <div class="flex items-center gap-2 pt-2">
                    <input
                      v-model="newTagInput"
                      @keydown.enter.prevent="addTag"
                      type="text"
                      placeholder="افزودن تگ جدید..."
                      class="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
                    />
                    <button
                      @click="addTag"
                      class="px-4 py-2 rounded-xl bg-najmgreen text-white text-xs font-bold hover:bg-emerald-800 transition"
                    >
                      + افزودن
                    </button>
                  </div>
                </div>

                <!-- Case D: Target is Structured Object (Cards with title, description, image, etc.) -->
                <div v-else-if="typeof inspectorTarget === 'object' && !isArray(inspectorTarget)" class="space-y-4">
                  <div
                    v-for="(val, fieldKey) in inspectorTarget"
                    :key="fieldKey"
                    class="space-y-1.5"
                  >
                    <label class="block text-xs font-bold text-gray-700">
                      {{ formatLabel(String(fieldKey)) }}
                      <span class="text-[10px] text-gray-400 font-mono font-normal">({{ fieldKey }})</span>
                    </label>

                    <!-- Subfield: String -->
                    <div v-if="typeof val === 'string'">
                      <!-- Image previewer if URL/path -->
                      <div v-if="String(fieldKey).toLowerCase().includes('image') || String(fieldKey).toLowerCase().includes('icon')" class="space-y-2">
                        <div v-if="val" class="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                          <img :src="'/' + val.replace(/^\//, '')" class="w-full h-full object-contain p-2" />
                        </div>
                        <input
                          v-model="inspectorTarget[fieldKey]"
                          type="text"
                          class="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono ltr text-left focus:bg-white focus:border-najmgreen focus:outline-none transition"
                        />
                      </div>
                      <textarea
                        v-else-if="val.length > 50 || String(fieldKey).includes('desc') || String(fieldKey).includes('body')"
                        v-model="inspectorTarget[fieldKey]"
                        rows="3"
                        class="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition leading-relaxed"
                      ></textarea>
                      <input
                        v-else
                        v-model="inspectorTarget[fieldKey]"
                        type="text"
                        class="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
                      />
                    </div>

                    <!-- Subfield: Boolean -->
                    <div v-else-if="typeof val === 'boolean'" class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span class="text-xs text-gray-700">وضعیت</span>
                      <input
                        type="checkbox"
                        v-model="inspectorTarget[fieldKey]"
                        class="w-4 h-4 rounded text-najmgreen focus:ring-0 cursor-pointer"
                      />
                    </div>

                    <!-- Subfield: Nested Object / Array preview -->
                    <div v-else class="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] font-mono text-gray-600">
                      {{ JSON.stringify(val).slice(0, 80) }}...
                    </div>
                  </div>
                </div>

                <!-- Case E: Fallback JSON Raw Inspector for complex nested arrays -->
                <div v-else class="space-y-2">
                  <label class="block text-xs font-bold text-gray-700">ساختار داده خام (JSON):</label>
                  <textarea
                    :value="JSON.stringify(inspectorTarget, null, 2)"
                    @input="onRawJsonInput"
                    rows="10"
                    class="w-full px-4 py-3 rounded-2xl bg-gray-900 text-emerald-400 font-mono text-xs focus:outline-none leading-relaxed"
                    dir="ltr"
                  ></textarea>
                </div>
              </div>

              <!-- Unselected State -->
              <div v-else class="py-20 text-center text-xs text-gray-400 space-y-2">
                <Icon name="mdi:cursor-default-click-outline" class="w-8 h-8 mx-auto text-gray-300" />
                <p>برای ویرایش، یک آیتم را از ستون‌های اول یا دوم انتخاب نمایید.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePocketBase } from '~/plugins/pb.client'

const props = withDefaults(
  defineProps<{
    open?: boolean
    isOpen?: boolean
    collection?: string
    collectionName?: string
    record?: any
  }>(),
  {
    open: false,
    isOpen: false,
    collection: 'pages',
    collectionName: 'pages',
    record: null
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const pb = usePocketBase()

const isModalOpen = computed(() => props.open || props.isOpen)
const activeCollection = computed(() => props.collection || props.collectionName || 'pages')
const activeRecord = computed(() => props.record)

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
      const targetObj = rec.uiData || rec
      localData.value = JSON.parse(JSON.stringify(targetObj))
      originalDataStr.value = JSON.stringify(localData.value)
      
      const keys = Object.keys(localData.value)
      if (keys.length) {
        selectRootSection(keys[0])
      }
    } else {
      localData.value = {}
      originalDataStr.value = '{}'
      selectedRoot.value = ''
      selectedSub.value = ''
      navPath.value = []
    }
  },
  { immediate: true, deep: true }
)

const hasChanges = computed(() => {
  return JSON.stringify(localData.value) !== originalDataStr.value
})

const changedFieldsCount = computed(() => {
  if (!hasChanges.value) return 0
  return 1
})

const rootSections = computed(() => {
  return Object.keys(localData.value).map(key => {
    const val = localData.value[key]
    const type = Array.isArray(val) ? `لیست (${val.length})` : typeof val === 'object' && val !== null ? 'بخش' : typeof val
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
    midCta: 'بخش فراخوان (CTA)',
    title: 'عنوان اصلی',
    subtitle: 'زیرعنوان',
    eyebrow: 'تیتر کوچک بالایی',
    description: 'توضیحات تکمیلی',
    highlights: 'ویژگی‌های برجسته'
  }
  return map[key] || key.replace(/_/g, ' ')
}

function getSectionIcon(key: string): string {
  if (key.includes('hero')) return 'mdi:view-dashboard-outline'
  if (key.includes('service')) return 'mdi:tools'
  if (key.includes('industr')) return 'mdi:factory'
  if (key.includes('facilit')) return 'mdi:printer-3d-nozzle'
  if (key.includes('faq')) return 'mdi:frequently-asked-questions'
  if (key.includes('contact')) return 'mdi:phone'
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
      preview: typeof parent[k] === 'object' && parent[k] !== null ? `[${Array.isArray(parent[k]) ? 'لیست' : 'آبجکت'}]` : String(parent[k] ?? '')
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
  return root?.[selectedSub.value]
})

const inspectorProxy = computed({
  get() {
    return inspectorTarget.value
  },
  set(val) {
    if (selectedRoot.value && selectedSub.value) {
      if (!localData.value[selectedRoot.value]) localData.value[selectedRoot.value] = {}
      localData.value[selectedRoot.value][selectedSub.value] = val
    } else if (selectedRoot.value) {
      localData.value[selectedRoot.value] = val
    }
  }
})

function isArray(val: any): boolean {
  return Array.isArray(val)
}

function addTag() {
  if (!newTagInput.value.trim() || !isArray(inspectorTarget.value)) return
  inspectorTarget.value.push(newTagInput.value.trim())
  newTagInput.value = ''
}

function removeTag(idx: number) {
  if (!isArray(inspectorTarget.value)) return
  inspectorTarget.value.splice(idx, 1)
}

function onRawJsonInput(e: Event) {
  const val = (e.target as HTMLTextAreaElement).value
  try {
    const parsed = JSON.parse(val)
    if (selectedRoot.value && selectedSub.value) {
      localData.value[selectedRoot.value][selectedSub.value] = parsed
    } else if (selectedRoot.value) {
      localData.value[selectedRoot.value] = parsed
    }
  } catch {
    // wait for valid json
  }
}

function resetChanges() {
  localData.value = JSON.parse(originalDataStr.value)
}

async function saveRecord() {
  isSaving.value = true
  try {
    const colName = activeCollection.value
    const recId = activeRecord.value?.id

    let payload: any = { ...localData.value }
    if (activeRecord.value?.uiData) {
      payload = {
        ...activeRecord.value,
        uiData: localData.value
      }
    }

    if (recId) {
      await pb.collection(colName).update(recId, payload)
    } else {
      await pb.collection(colName).create(payload)
    }

    originalDataStr.value = JSON.stringify(localData.value)
    alert('تغییرات با موفقیت ذخیره شد.')
    emit('saved')
    emit('close')
  } catch (err: any) {
    alert('خطا در ذخیره رکورد: ' + (err?.message || err))
  } finally {
    isSaving.value = false
  }
}
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

.animate-modal-pop {
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPop {
  0% {
    transform: scale(0.96) translateY(8px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
</style>
