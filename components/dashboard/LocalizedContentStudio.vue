<!-- components/dashboard/LocalizedContentStudio.vue -->
<template>
  <div class="w-full h-full flex flex-col font-sans text-xs bg-white select-text overflow-hidden">
    <!-- Top Studio Toolbar: Language Switcher & View Modes -->
    <div class="h-11 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
      <!-- Language Perspective Switcher -->
      <div class="flex items-center gap-1.5">
        <span class="text-slate-500 font-bold text-[11px] ml-1">زبان فعال محتوا:</span>
        <div class="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-bold">
          <button
            @click="activeLang = 'fa'"
            class="px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5"
            :class="activeLang === 'fa' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'"
          >
            <span>🇮🇷</span>
            <span>فارسی</span>
          </button>
          <button
            @click="activeLang = 'en'"
            class="px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5"
            :class="activeLang === 'en' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'"
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
          <button
            @click="activeLang = 'ar'"
            class="px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5"
            :class="activeLang === 'ar' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'"
          >
            <span>🇸🇦</span>
            <span>العربية</span>
          </button>
          <button
            @click="activeLang = 'all'"
            class="px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5"
            :class="activeLang === 'all' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'"
          >
            <span>🌐</span>
            <span>مقایسه ۳ زبانه</span>
          </button>
        </div>
      </div>

      <!-- Quick Section Anchor Links -->
      <div class="hidden md:flex items-center gap-1 text-[11px] text-slate-500 font-bold">
        <button @click="scrollToSection('sec-headings')" class="px-2 py-0.5 hover:text-emerald-800 hover:bg-slate-100 rounded">
          عناوین و متن‌ها
        </button>
        <span>•</span>
        <button @click="scrollToSection('sec-media')" class="px-2 py-0.5 hover:text-emerald-800 hover:bg-slate-100 rounded">
          رسانه‌ها
        </button>
        <span>•</span>
        <button @click="scrollToSection('sec-visuals')" class="px-2 py-0.5 hover:text-emerald-800 hover:bg-slate-100 rounded">
          رنگ‌ها و ظاهر
        </button>
        <span>•</span>
        <button @click="scrollToSection('sec-dynamic')" class="px-2 py-0.5 hover:text-emerald-800 hover:bg-slate-100 rounded">
          بخش‌های پویا
        </button>
      </div>
    </div>

    <!-- Main Content Canvas (Flush Rectangular Rows with Clean Sections) -->
    <div ref="scrollContainerRef" class="flex-1 overflow-y-auto divide-y divide-slate-200">
      <!-- 1. HEADINGS & CORE COPY SECTION -->
      <section id="sec-headings" class="w-full flex flex-col">
        <div class="px-4 py-2 bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="mdi:format-title" class="w-4 h-4 text-emerald-800" />
            <span>عناوین و متون اصلی صفحه</span>
          </div>
          <span class="text-[10px] text-slate-500">ویرایش همگام فارسی، انگلیسی و عربی</span>
        </div>

        <!-- 1.1 Page Title -->
        <div class="w-full px-4 py-3 border-b border-slate-200/90 flex flex-col gap-2 hover:bg-slate-50/60 transition">
          <div class="flex items-center justify-between">
            <label class="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>عنوان صفحه (Page Title)</span>
            </label>
            <span class="text-[10px] text-slate-400 font-mono">title</span>
          </div>

          <!-- Trilingual Parallel Grid or Active Lang -->
          <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
            <!-- FA -->
            <div v-if="activeLang === 'fa' || activeLang === 'all'" class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-slate-500 flex items-center gap-1">🇮🇷 فارسی</span>
              <input
                type="text"
                :value="getLangValue('fa', 'title')"
                @input="setLangValue('fa', 'title', ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-bold"
                placeholder="عنوان به فارسی..."
              />
            </div>
            <!-- EN -->
            <div v-if="activeLang === 'en' || activeLang === 'all'" class="flex flex-col gap-1" dir="ltr">
              <span class="text-[10px] font-bold text-slate-500 flex items-center gap-1">🇬🇧 English</span>
              <input
                type="text"
                :value="getLangValue('en', 'title')"
                @input="setLangValue('en', 'title', ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-bold text-left font-sans"
                placeholder="Title in English..."
              />
            </div>
            <!-- AR -->
            <div v-if="activeLang === 'ar' || activeLang === 'all'" class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-slate-500 flex items-center gap-1">🇸🇦 العربية</span>
              <input
                type="text"
                :value="getLangValue('ar', 'title')"
                @input="setLangValue('ar', 'title', ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-bold"
                placeholder="العنوان بالعربية..."
              />
            </div>
          </div>
        </div>

        <!-- 1.2 Subtitle / Description -->
        <div class="w-full px-4 py-3 border-b border-slate-200/90 flex flex-col gap-2 hover:bg-slate-50/60 transition">
          <div class="flex items-center justify-between">
            <label class="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>زیرعنوان و توضیحات (Subtitle / Description)</span>
            </label>
            <span class="text-[10px] text-slate-400 font-mono">subtitle</span>
          </div>

          <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
            <!-- FA -->
            <div v-if="activeLang === 'fa' || activeLang === 'all'" class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-slate-500 flex items-center gap-1">🇮🇷 فارسی</span>
              <textarea
                rows="2"
                :value="getLangValue('fa', 'subtitle')"
                @input="setLangValue('fa', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed"
                placeholder="توضیحات فارسی..."
              ></textarea>
            </div>
            <!-- EN -->
            <div v-if="activeLang === 'en' || activeLang === 'all'" class="flex flex-col gap-1" dir="ltr">
              <span class="text-[10px] font-bold text-slate-500 flex items-center gap-1">🇬🇧 English</span>
              <textarea
                rows="2"
                :value="getLangValue('en', 'subtitle')"
                @input="setLangValue('en', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed text-left font-sans"
                placeholder="Subtitle in English..."
              ></textarea>
            </div>
            <!-- AR -->
            <div v-if="activeLang === 'ar' || activeLang === 'all'" class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-slate-500 flex items-center gap-1">🇸🇦 العربية</span>
              <textarea
                rows="2"
                :value="getLangValue('ar', 'subtitle')"
                @input="setLangValue('ar', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed"
                placeholder="الوصف بالعربية..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 1.3 Key Stats or Mission Badge -->
        <div v-if="hasFieldAcrossLocales('stats') || hasFieldAcrossLocales('mission')" class="w-full px-4 py-3 border-b border-slate-200/90 flex flex-col gap-2 hover:bg-slate-50/60 transition">
          <div class="flex items-center justify-between">
            <label class="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>شعار یا آمار شاخص (Stats / Mission Tagline)</span>
            </label>
            <span class="text-[10px] text-slate-400 font-mono">stats / mission</span>
          </div>

          <div class="grid gap-2" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
            <!-- FA -->
            <div v-if="activeLang === 'fa' || activeLang === 'all'" class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-slate-500 flex items-center gap-1">🇮🇷 فارسی</span>
              <input
                type="text"
                :value="getLangValue('fa', 'stats') || getLangValue('fa', 'mission')"
                @input="setLangValue('fa', 'stats', ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                placeholder="+۲۵ سال سابقه • ۱۵M تیراژ..."
              />
            </div>
            <!-- EN -->
            <div v-if="activeLang === 'en' || activeLang === 'all'" class="flex flex-col gap-1" dir="ltr">
              <span class="text-[10px] font-bold text-slate-500 flex items-center gap-1">🇬🇧 English</span>
              <input
                type="text"
                :value="getLangValue('en', 'stats') || getLangValue('en', 'mission')"
                @input="setLangValue('en', 'stats', ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 text-left font-sans"
                placeholder="25+ Years Craft • 15M Capacity..."
              />
            </div>
            <!-- AR -->
            <div v-if="activeLang === 'ar' || activeLang === 'all'" class="flex flex-col gap-1">
              <span class="text-[10px] font-bold text-slate-500 flex items-center gap-1">🇸🇦 العربية</span>
              <input
                type="text"
                :value="getLangValue('ar', 'stats') || getLangValue('ar', 'mission')"
                @input="setLangValue('ar', 'stats', ($event.target as HTMLInputElement).value)"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                placeholder="+٢٥ عاماً من الخبرة..."
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 2. MEDIA ASSETS & IMAGERY SECTION (Global Non-Locale Setting) -->
      <section id="sec-media" class="w-full flex flex-col">
        <div class="px-4 py-2 bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="mdi:image-multiple-outline" class="w-4 h-4 text-emerald-800" />
            <span>رسانه‌ها، تصاویر شاخص و گالری</span>
          </div>
          <span class="text-[10px] text-slate-500">انتخاب از ۹۵ رسانه PocketBase</span>
        </div>

        <!-- Cover Image -->
        <div class="w-full px-4 py-3 border-b border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition">
          <div class="flex items-center gap-3">
            <!-- Thumbnail Preview -->
            <div
              @click="openMediaModalFor('coverImage')"
              class="relative w-12 h-12 rounded-lg border border-slate-300 bg-slate-100 overflow-hidden cursor-pointer group shadow-2xs hover:border-emerald-600 transition shrink-0"
              title="کلیک برای تغییر تصویر"
            >
              <img
                :src="rootSchema.coverImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'"
                alt="cover"
                class="w-full h-full object-cover group-hover:scale-110 transition duration-150"
              />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition">
                تغییر
              </div>
            </div>

            <div>
              <span class="font-bold text-slate-900 text-xs block">تصویر شاخص صفحه (Cover / Hero Image)</span>
              <span class="text-[10px] text-slate-500 font-mono">coverImage • AVIF / WebP / PNG</span>
            </div>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-lg">
            <input
              type="text"
              :value="rootSchema.coverImage"
              @input="rootSchema.coverImage = ($event.target as HTMLInputElement).value; emitChange()"
              class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-600 truncate"
              placeholder="https://..."
            />
            <button
              @click="openMediaModalFor('coverImage')"
              class="px-3 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Icon name="mdi:folder-image" class="w-3.5 h-3.5" />
              <span>انتخاب از گالری</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 3. COLORS & VISUAL THEME SECTION -->
      <section id="sec-visuals" class="w-full flex flex-col">
        <div class="px-4 py-2 bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="mdi:palette-outline" class="w-4 h-4 text-emerald-800" />
            <span>پالت‌های رنگ و استایل بصری</span>
          </div>
          <span class="text-[10px] text-slate-500">رنگ برند و نشانگرهای سیستمی</span>
        </div>

        <!-- Accent Color -->
        <div class="w-full px-4 py-3 border-b border-slate-200/90 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: rootSchema.accentColor || '#018786' }"></span>
            <div>
              <span class="font-bold text-slate-900 text-xs block">رنگ سازمانی و المان‌ها (Accent Color)</span>
              <span class="text-[10px] text-slate-500 font-mono">accentColor</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 shadow-2xs shrink-0 cursor-pointer">
              <input
                type="color"
                :value="rootSchema.accentColor || '#018786'"
                @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div class="w-full h-full" :style="{ backgroundColor: rootSchema.accentColor || '#018786' }"></div>
            </div>
            <input
              type="text"
              :value="rootSchema.accentColor || '#018786'"
              @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
              class="w-28 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-mono text-xs text-slate-800 focus:outline-none focus:border-emerald-600 text-center font-bold"
            />
          </div>
        </div>
      </section>

      <!-- 4. DYNAMIC LISTS & ITEMS (Fleet, Milestones, Categories, FAQ Topics) -->
      <section id="sec-dynamic" class="w-full flex flex-col">
        <div class="px-4 py-2 bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="mdi:format-list-bulleted" class="w-4 h-4 text-emerald-800" />
            <span>آیتم‌های پویا و لیست‌ها</span>
          </div>
          <span class="text-[10px] text-slate-500">لیست ماشین‌آلات، دسته‌بندی‌ها و گاه‌شمار</span>
        </div>

        <div v-if="dynamicListKeys.length === 0" class="p-4 text-center text-slate-400 text-xs">
          محتوای متنی اصلی در بخش بالا قرار دارد.
        </div>

        <div v-for="listKey in dynamicListKeys" :key="listKey" class="w-full px-4 py-3 border-b border-slate-200/90 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 text-xs">{{ listKey }}</span>
            <span class="px-2 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
              {{ getDynamicListLength(listKey) }} آیتم
            </span>
          </div>

          <!-- Items row -->
          <div class="space-y-1.5">
            <div
              v-for="(item, idx) in getDynamicListItems(listKey)"
              :key="idx"
              class="flex items-center gap-2"
            >
              <span class="w-5 text-slate-400 font-mono text-[10px] text-center">{{ idx + 1 }}</span>
              <input
                type="text"
                :value="typeof item === 'string' ? item : (item.title || item.name || JSON.stringify(item))"
                @input="updateDynamicListItem(listKey, idx, ($event.target as HTMLInputElement).value)"
                class="flex-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
              />
              <button
                @click="removeDynamicListItem(listKey, idx)"
                class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                title="حذف"
              >
                <Icon name="mdi:delete-outline" class="w-4 h-4" />
              </button>
            </div>

            <button
              @click="addDynamicListItem(listKey)"
              class="mt-1 px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Icon name="mdi:plus" class="w-3.5 h-3.5" />
              <span>افزودن آیتم جدید</span>
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- PocketBase Media Asset Picker Modal -->
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

const activeLang = ref<'fa' | 'en' | 'ar' | 'all'>('all')
const scrollContainerRef = ref<HTMLElement | null>(null)
const isMediaModalOpen = ref(false)
const activeMediaField = ref<string | null>(null)

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

function hasFieldAcrossLocales(field: string) {
  const locales = ['fa', 'en', 'ar', 'FA', 'EN', 'AR']
  return locales.some(l => props.modelValue[l] && props.modelValue[l][field])
}

// Dynamic List Keys (categories, milestones, fleet, topics, formats)
const dynamicListKeys = computed(() => {
  const activeLocales = [activeLang.value === 'all' ? 'fa' : activeLang.value]
  const keys: string[] = []
  
  for (const loc of activeLocales) {
    const locObj = props.modelValue[loc] || props.modelValue[loc.toUpperCase()] || {}
    for (const [k, v] of Object.entries(locObj)) {
      if (Array.isArray(v) && !keys.includes(k)) {
        keys.push(k)
      }
    }
  }
  return keys
})

function getDynamicListItems(listKey: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  const locObj = props.modelValue[targetLang] || props.modelValue[targetLang.toUpperCase()] || {}
  return locObj[listKey] || []
}

function getDynamicListLength(listKey: string) {
  return getDynamicListItems(listKey).length
}

function updateDynamicListItem(listKey: string, idx: number, val: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[targetLang]) props.modelValue[targetLang] = {}
  if (!props.modelValue[targetLang][listKey]) props.modelValue[targetLang][listKey] = []
  props.modelValue[targetLang][listKey][idx] = val
  emitChange()
}

function addDynamicListItem(listKey: string) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (!props.modelValue[targetLang]) props.modelValue[targetLang] = {}
  if (!props.modelValue[targetLang][listKey]) props.modelValue[targetLang][listKey] = []
  props.modelValue[targetLang][listKey].push('')
  emitChange()
}

function removeDynamicListItem(listKey: string, idx: number) {
  const targetLang = activeLang.value === 'all' ? 'fa' : activeLang.value
  if (props.modelValue[targetLang]?.[listKey]) {
    props.modelValue[targetLang][listKey].splice(idx, 1)
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

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el && scrollContainerRef.value) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
