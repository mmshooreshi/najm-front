<!-- components/dashboard/LocalizedContentStudio.vue -->
<template>
  <div class="w-full h-full flex flex-col font-sans text-xs bg-white select-text overflow-hidden">
    <!-- Ultra-Compact Icon Toolbar -->
    <div class="h-10 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
      <!-- Section Tabs -->
      <div class="flex items-center gap-1">
        <button
          v-for="tab in sections"
          :key="tab.id"
          @click="activeSection = tab.id"
          class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer"
          :class="activeSection === tab.id ? 'bg-white text-emerald-800 shadow-2xs border border-slate-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'"
          :title="tab.tooltip"
        >
          <Icon :name="tab.icon" class="w-3.5 h-3.5" :class="activeSection === tab.id ? 'text-emerald-800' : 'text-slate-400'" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Icon-Only Language Toggles with Tooltips -->
      <div class="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold">
        <button
          @click="activeLang = 'fa'"
          class="w-7 h-6 flex items-center justify-center rounded transition cursor-pointer"
          :class="activeLang === 'fa' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="فارسی (FA)"
        >
          <span>🇮🇷</span>
        </button>
        <button
          @click="activeLang = 'en'"
          class="w-7 h-6 flex items-center justify-center rounded transition cursor-pointer"
          :class="activeLang === 'en' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="English (EN)"
        >
          <span>🇬🇧</span>
        </button>
        <button
          @click="activeLang = 'ar'"
          class="w-7 h-6 flex items-center justify-center rounded transition cursor-pointer"
          :class="activeLang === 'ar' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="العربية (AR)"
        >
          <span>🇸🇦</span>
        </button>
        <button
          @click="activeLang = 'all'"
          class="w-7 h-6 flex items-center justify-center rounded transition cursor-pointer text-slate-700"
          :class="activeLang === 'all' ? 'bg-white text-emerald-800 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
          title="نمایش همزمان ۳ زبانه (Parallel View)"
        >
          <Icon name="mdi:web" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Main High-Density Workspace (Zero Dead Space) -->
    <div class="flex-1 p-4 overflow-y-auto bg-slate-50/30">
      <!-- 1. COPY & CONTENT TAB -->
      <div v-if="activeSection === 'copy'" class="space-y-3">
        <!-- Title & Subtitle Grid -->
        <div class="bg-white rounded-xl border border-slate-200 p-3 space-y-3 shadow-2xs">
          <!-- Title Row -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">عنوان صفحه</span>
              <span class="text-[9px] font-mono text-slate-400" dir="ltr">title</span>
            </div>

            <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'" class="flex items-center gap-1.5">
                <span class="text-[9px] font-mono text-slate-400 shrink-0">FA</span>
                <input
                  type="text"
                  :value="getLangValue('fa', 'title')"
                  @input="setLangValue('fa', 'title', ($event.target as HTMLInputElement).value)"
                  class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none transition"
                  placeholder="عنوان فارسی..."
                />
              </div>

              <div v-if="activeLang === 'en' || activeLang === 'all'" class="flex items-center gap-1.5" dir="ltr">
                <span class="text-[9px] font-mono text-slate-400 shrink-0">EN</span>
                <input
                  type="text"
                  dir="ltr"
                  :value="getLangValue('en', 'title')"
                  @input="setLangValue('en', 'title', ($event.target as HTMLInputElement).value)"
                  class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none transition text-left"
                  placeholder="English title..."
                />
              </div>

              <div v-if="activeLang === 'ar' || activeLang === 'all'" class="flex items-center gap-1.5">
                <span class="text-[9px] font-mono text-slate-400 shrink-0">AR</span>
                <input
                  type="text"
                  :value="getLangValue('ar', 'title')"
                  @input="setLangValue('ar', 'title', ($event.target as HTMLInputElement).value)"
                  class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none transition"
                  placeholder="العنوان بالعربية..."
                />
              </div>
            </div>
          </div>

          <!-- Subtitle Row -->
          <div class="space-y-1.5 pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">زیرعنوان و توضیحات</span>
              <span class="text-[9px] font-mono text-slate-400" dir="ltr">subtitle</span>
            </div>

            <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'">
                <textarea
                  rows="2"
                  :value="getLangValue('fa', 'subtitle')"
                  @input="setLangValue('fa', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-900 focus:outline-none transition leading-relaxed"
                  placeholder="توضیحات فارسی..."
                ></textarea>
              </div>

              <div v-if="activeLang === 'en' || activeLang === 'all'" dir="ltr">
                <textarea
                  rows="2"
                  dir="ltr"
                  :value="getLangValue('en', 'subtitle')"
                  @input="setLangValue('en', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-900 focus:outline-none transition leading-relaxed text-left font-sans"
                  placeholder="English subtitle..."
                ></textarea>
              </div>

              <div v-if="activeLang === 'ar' || activeLang === 'all'">
                <textarea
                  rows="2"
                  :value="getLangValue('ar', 'subtitle')"
                  @input="setLangValue('ar', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-2 text-xs text-slate-900 focus:outline-none transition leading-relaxed"
                  placeholder="الوصف بالعربية..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Stats / Mission (If exists) -->
          <div v-if="hasKeyInUiData('stats') || hasKeyInUiData('mission')" class="space-y-1.5 pt-2 border-t border-slate-100">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">شعار یا آمار شاخص</span>
              <span class="text-[9px] font-mono text-slate-400" dir="ltr">stats</span>
            </div>

            <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'">
                <input
                  type="text"
                  :value="getLangValue('fa', 'stats') || getLangValue('fa', 'mission')"
                  @input="setLangValue('fa', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div v-if="activeLang === 'en' || activeLang === 'all'" dir="ltr">
                <input
                  type="text"
                  dir="ltr"
                  :value="getLangValue('en', 'stats') || getLangValue('en', 'mission')"
                  @input="setLangValue('en', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none text-left"
                />
              </div>
              <div v-if="activeLang === 'ar' || activeLang === 'all'">
                <input
                  type="text"
                  :value="getLangValue('ar', 'stats') || getLangValue('ar', 'mission')"
                  @input="setLangValue('ar', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Dynamic List Blocks (Categories, Fleet, Milestones, Topics) -->
        <div
          v-for="(sectionMeta, sectionKey) in recognizedPageSections"
          :key="sectionKey"
          class="bg-white rounded-xl border border-slate-200 p-3 space-y-2 shadow-2xs"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 text-xs">{{ sectionMeta.titleFa }}</span>
            <span class="text-[9px] font-mono text-slate-400" dir="ltr">{{ sectionKey }}</span>
          </div>

          <div v-if="sectionMeta.isArray" class="space-y-1.5">
            <div
              v-for="(item, idx) in getArraySectionItems(sectionKey as string)"
              :key="idx"
              class="flex items-center gap-2"
            >
              <span class="w-5 text-slate-400 font-mono text-[10px] text-center shrink-0">{{ idx + 1 }}</span>
              <input
                type="text"
                :value="typeof item === 'string' ? item : (item.title || item.name || JSON.stringify(item))"
                @input="updateArraySectionItem(sectionKey as string, idx, ($event.target as HTMLInputElement).value)"
                class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
              />
              <button
                @click="removeArraySectionItem(sectionKey as string, idx)"
                class="w-6 h-6 flex items-center justify-center rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                title="حذف"
              >
                <Icon name="mdi:trash-can-outline" class="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              @click="addArraySectionItem(sectionKey as string)"
              class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Icon name="mdi:plus" class="w-3 h-3" />
              <span>افزودن مورد</span>
            </button>
          </div>

          <div v-else class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
            <div v-if="activeLang === 'fa' || activeLang === 'all'">
              <input
                type="text"
                :value="getLangValue('fa', sectionKey as string)"
                @input="setLangValue('fa', sectionKey as string, ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
              />
            </div>
            <div v-if="activeLang === 'en' || activeLang === 'all'" dir="ltr">
              <input
                type="text"
                dir="ltr"
                :value="getLangValue('en', sectionKey as string)"
                @input="setLangValue('en', sectionKey as string, ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none text-left"
              />
            </div>
            <div v-if="activeLang === 'ar' || activeLang === 'all'">
              <input
                type="text"
                :value="getLangValue('ar', sectionKey as string)"
                @input="setLangValue('ar', sectionKey as string, ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 2. MEDIA HUB TAB (True Aspect Ratios & Live PB Gallery) -->
      <div v-else-if="activeSection === 'media'" class="space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- 16:9 Banner Cover -->
          <div class="bg-white rounded-xl border border-slate-200 p-3 space-y-2 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">تصویر بنر هدر (16:9)</span>
              <span class="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9px] font-mono" dir="ltr">16:9</span>
            </div>

            <div
              @click="openMediaModalFor('coverImage')"
              class="group relative w-full aspect-video rounded-lg border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer shadow-2xs"
            >
              <img
                :src="getCoverImageUrl()"
                alt="cover-16-9"
                class="w-full h-full object-cover group-hover:scale-102 transition duration-200"
              />
              <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                <span class="px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 font-bold text-[11px] shadow-md">تعویض رسانه</span>
              </div>
            </div>

            <input
              type="text"
              dir="ltr"
              :value="rootSchema.coverImage || getCoverImageUrl()"
              @input="rootSchema.coverImage = ($event.target as HTMLInputElement).value; emitChange()"
              class="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[10px] font-mono text-slate-700 text-left"
            />
          </div>

          <!-- 4:3 Feature Media -->
          <div class="bg-white rounded-xl border border-slate-200 p-3 space-y-2 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 text-xs">تصویر شاخص صفحه (4:3)</span>
              <span class="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9px] font-mono" dir="ltr">4:3</span>
            </div>

            <div
              @click="openMediaModalFor('featureImage')"
              class="group relative w-full aspect-[4/3] rounded-lg border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer shadow-2xs"
            >
              <img
                :src="rootSchema.featureImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'"
                alt="feature-4-3"
                class="w-full h-full object-cover group-hover:scale-102 transition duration-200"
              />
              <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                <span class="px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 font-bold text-[11px] shadow-md">تعویض رسانه</span>
              </div>
            </div>

            <input
              type="text"
              dir="ltr"
              :value="rootSchema.featureImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'"
              @input="rootSchema.featureImage = ($event.target as HTMLInputElement).value; emitChange()"
              class="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[10px] font-mono text-slate-700 text-left"
            />
          </div>
        </div>
      </div>

      <!-- 3. STYLE & THEME TAB -->
      <div v-else-if="activeSection === 'style'" class="space-y-3">
        <div class="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-3">
            <div class="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer">
              <input
                type="color"
                :value="rootSchema.accentColor || '#018786'"
                @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div class="w-full h-full" :style="{ backgroundColor: rootSchema.accentColor || '#018786' }"></div>
            </div>
            <div>
              <span class="font-bold text-slate-900 text-xs block">رنگ سازمانی و المان‌ها</span>
              <span class="text-[10px] text-slate-400 font-mono" dir="ltr">{{ rootSchema.accentColor || '#018786' }}</span>
            </div>
          </div>

          <input
            type="text"
            dir="ltr"
            :value="rootSchema.accentColor || '#018786'"
            @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
            class="w-28 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-mono text-xs text-slate-900 focus:outline-none text-center font-bold"
          />
        </div>
      </div>
    </div>

    <!-- Media Modal -->
    <MediaAssetModal
      :is-open="isMediaModalOpen"
      :initial-url="activeMediaField ? rootSchema[activeMediaField] : ''"
      @close="isMediaModalOpen = false"
      @select="handleMediaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MediaAssetModal from './MediaAssetModal.vue'

const props = defineProps<{
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void
  (e: 'change', val: Record<string, any>): void
}>()

const activeSection = ref<'copy' | 'media' | 'style'>('copy')
const activeLang = ref<'fa' | 'en' | 'ar' | 'all'>('fa')
const isMediaModalOpen = ref(false)
const activeMediaField = ref<string | null>(null)

const sections = [
  { id: 'copy', label: 'محتوا و متون', icon: 'mdi:format-text', tooltip: 'ویرایش عناوین و بخش‌ها' },
  { id: 'media', label: 'رسانه‌ها (16:9)', icon: 'mdi:image-outline', tooltip: 'مدیریت و نسبت ابعاد تصاویر' },
  { id: 'style', label: 'رنگ و استایل', icon: 'mdi:palette-outline', tooltip: 'رنگ سازمانی' }
]

const rootSchema = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  }
})

function emitChange() {
  emit('update:modelValue', props.modelValue)
  emit('change', props.modelValue)
}

function getLangValue(lang: 'fa' | 'en' | 'ar', field: string) {
  const langObj = props.modelValue[lang] || props.modelValue[lang.toUpperCase()] || {}
  return langObj[field] || ''
}

function setLangValue(lang: 'fa' | 'en' | 'ar', field: string, val: any) {
  if (!props.modelValue[lang]) {
    props.modelValue[lang] = {}
  }
  props.modelValue[lang][field] = val
  emitChange()
}

function getCoverImageUrl() {
  return rootSchema.value.coverImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'
}

function hasKeyInUiData(key: string) {
  const locales = ['fa', 'en', 'ar', 'FA', 'EN', 'AR']
  return locales.some(l => props.modelValue[l] && (props.modelValue[l][key] !== undefined))
}

const recognizedPageSections = computed(() => {
  const knownSectionMeta: Record<string, { titleFa: string, isArray: boolean }> = {
    'categories': { titleFa: 'دسته‌بندی‌های محصولات', isArray: true },
    'fleet': { titleFa: 'ماشین‌آلات و خطوط تولید', isArray: true },
    'milestones': { titleFa: 'گاه‌شمار تحول تاریخی', isArray: true },
    'topics': { titleFa: 'پرسش‌های متداول', isArray: true },
    'formats': { titleFa: 'فرمت‌های کاتالوگ', isArray: true },
    'mission': { titleFa: 'ماموریت و کیفیت', isArray: false },
    'story': { titleFa: 'روایت تاریخچه', isArray: false },
    'factoryAddress': { titleFa: 'نشانی کارخانه', isArray: false },
    'phone': { titleFa: 'تلفن مستقیم', isArray: false }
  }

  const result: Record<string, { titleFa: string, isArray: boolean }> = {}
  const locales = ['fa', 'en', 'ar', 'FA', 'EN', 'AR']

  for (const loc of locales) {
    const locObj = props.modelValue[loc]
    if (locObj && typeof locObj === 'object') {
      for (const k of Object.keys(locObj)) {
        if (!['title', 'subtitle', 'stats'].includes(k)) {
          if (knownSectionMeta[k]) {
            result[k] = knownSectionMeta[k]
          } else {
            result[k] = {
              titleFa: `بخش ${k}`,
              isArray: Array.isArray(locObj[k])
            }
          }
        }
      }
    }
  }

  return result
})

function getArraySectionItems(sectionKey: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  const locObj = props.modelValue[targetLang] || props.modelValue[targetLang.toUpperCase()] || {}
  return locObj[sectionKey] || []
}

function updateArraySectionItem(sectionKey: string, idx: number, val: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[targetLang]) props.modelValue[targetLang] = {}
  if (!props.modelValue[targetLang][sectionKey]) props.modelValue[targetLang][sectionKey] = []
  props.modelValue[targetLang][sectionKey][idx] = val
  emitChange()
}

function addArraySectionItem(sectionKey: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[targetLang]) props.modelValue[targetLang] = {}
  if (!props.modelValue[targetLang][sectionKey]) props.modelValue[targetLang][sectionKey] = []
  props.modelValue[targetLang][sectionKey].push('')
  emitChange()
}

function removeArraySectionItem(sectionKey: string, idx: number) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (props.modelValue[targetLang]?.[sectionKey]) {
    props.modelValue[targetLang][sectionKey].splice(idx, 1)
    emitChange()
  }
}

function openMediaModalFor(field: string) {
  activeMediaField.value = field
  isMediaModalOpen.value = true
}

function handleMediaSelect(newUrl: string) {
  if (activeMediaField.value) {
    rootSchema.value[activeMediaField.value] = newUrl
    emitChange()
  }
}
</script>
