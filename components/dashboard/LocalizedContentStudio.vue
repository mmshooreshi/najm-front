<!-- components/dashboard/LocalizedContentStudio.vue -->
<template>
  <div class="w-full h-full flex flex-col font-sans text-xs bg-white select-text overflow-hidden">
    <!-- Top Minimalist Tab Bar -->
    <div class="h-12 px-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
      <!-- Section Tabs -->
      <div class="flex items-center gap-1">
        <button
          v-for="tab in studioTabs"
          :key="tab.id"
          @click="activeStudioTab = tab.id"
          class="px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer flex items-center gap-1.5"
          :class="[
            activeStudioTab === tab.id
              ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
          ]"
        >
          <Icon :name="tab.icon" class="w-3.5 h-3.5" :class="activeStudioTab === tab.id ? 'text-emerald-800' : 'text-slate-400'" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Language Toggle (For Copy tab) -->
      <div v-if="activeStudioTab === 'copy'" class="flex items-center bg-slate-200/60 p-0.5 rounded-xl text-[11px] font-bold">
        <button
          v-for="l in ['fa', 'en', 'ar', 'all']"
          :key="l"
          @click="activeLang = l as any"
          class="px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1 uppercase"
          :class="activeLang === l ? 'bg-white text-emerald-800 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'"
        >
          <span>{{ l === 'all' ? '۳ زبانه' : l }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Content Canvas (Motion Transition & High Breathing Room) -->
    <div class="flex-1 p-6 overflow-y-auto bg-white">
      <transition name="tab-fade" mode="out-in">
        <!-- 1. COPY & TEXTS TAB -->
        <div v-if="activeStudioTab === 'copy'" key="copy" class="max-w-4xl mx-auto space-y-6">
          <!-- Title -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="font-bold text-slate-800 text-xs">عنوان</label>
              <span class="text-[10px] font-mono text-slate-400" dir="ltr">title</span>
            </div>

            <div class="grid gap-3" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'" class="space-y-1">
                <span class="text-[10px] font-bold text-slate-400">فارسی</span>
                <input
                  type="text"
                  :value="getLangValue('fa', 'title')"
                  @input="setLangValue('fa', 'title', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none transition shadow-2xs"
                  placeholder="عنوان فارسی..."
                />
              </div>

              <div v-if="activeLang === 'en' || activeLang === 'all'" class="space-y-1" dir="ltr">
                <span class="text-[10px] font-bold text-slate-400">English</span>
                <input
                  type="text"
                  dir="ltr"
                  :value="getLangValue('en', 'title')"
                  @input="setLangValue('en', 'title', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none transition text-left shadow-2xs"
                  placeholder="English title..."
                />
              </div>

              <div v-if="activeLang === 'ar' || activeLang === 'all'" class="space-y-1">
                <span class="text-[10px] font-bold text-slate-400">العربية</span>
                <input
                  type="text"
                  :value="getLangValue('ar', 'title')"
                  @input="setLangValue('ar', 'title', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none transition shadow-2xs"
                  placeholder="العنوان بالعربية..."
                />
              </div>
            </div>
          </div>

          <!-- Subtitle -->
          <div class="space-y-2 pt-2">
            <div class="flex items-center justify-between">
              <label class="font-bold text-slate-800 text-xs">زیرعنوان و توضیحات</label>
              <span class="text-[10px] font-mono text-slate-400" dir="ltr">subtitle</span>
            </div>

            <div class="grid gap-3" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'" class="space-y-1">
                <span class="text-[10px] font-bold text-slate-400">فارسی</span>
                <textarea
                  rows="3"
                  :value="getLangValue('fa', 'subtitle')"
                  @input="setLangValue('fa', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl p-3 text-xs text-slate-900 focus:outline-none transition leading-relaxed shadow-2xs"
                  placeholder="توضیحات فارسی..."
                ></textarea>
              </div>

              <div v-if="activeLang === 'en' || activeLang === 'all'" class="space-y-1" dir="ltr">
                <span class="text-[10px] font-bold text-slate-400">English</span>
                <textarea
                  rows="3"
                  dir="ltr"
                  :value="getLangValue('en', 'subtitle')"
                  @input="setLangValue('en', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl p-3 text-xs text-slate-900 focus:outline-none transition leading-relaxed text-left shadow-2xs"
                  placeholder="English subtitle..."
                ></textarea>
              </div>

              <div v-if="activeLang === 'ar' || activeLang === 'all'" class="space-y-1">
                <span class="text-[10px] font-bold text-slate-400">العربية</span>
                <textarea
                  rows="3"
                  :value="getLangValue('ar', 'subtitle')"
                  @input="setLangValue('ar', 'subtitle', ($event.target as HTMLTextAreaElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl p-3 text-xs text-slate-900 focus:outline-none transition leading-relaxed shadow-2xs"
                  placeholder="الوصف بالعربية..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Key Tagline / Stats -->
          <div v-if="hasFieldAcrossLocales('stats') || hasFieldAcrossLocales('mission')" class="space-y-2 pt-2">
            <div class="flex items-center justify-between">
              <label class="font-bold text-slate-800 text-xs">شعار یا آمار کلیدی</label>
              <span class="text-[10px] font-mono text-slate-400" dir="ltr">stats</span>
            </div>

            <div class="grid gap-3" :class="activeLang === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'">
              <div v-if="activeLang === 'fa' || activeLang === 'all'" class="space-y-1">
                <span class="text-[10px] font-bold text-slate-400">فارسی</span>
                <input
                  type="text"
                  :value="getLangValue('fa', 'stats') || getLangValue('fa', 'mission')"
                  @input="setLangValue('fa', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none transition shadow-2xs"
                />
              </div>

              <div v-if="activeLang === 'en' || activeLang === 'all'" class="space-y-1" dir="ltr">
                <span class="text-[10px] font-bold text-slate-400">English</span>
                <input
                  type="text"
                  dir="ltr"
                  :value="getLangValue('en', 'stats') || getLangValue('en', 'mission')"
                  @input="setLangValue('en', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none transition text-left shadow-2xs"
                />
              </div>

              <div v-if="activeLang === 'ar' || activeLang === 'all'" class="space-y-1">
                <span class="text-[10px] font-bold text-slate-400">العربية</span>
                <input
                  type="text"
                  :value="getLangValue('ar', 'stats') || getLangValue('ar', 'mission')"
                  @input="setLangValue('ar', 'stats', ($event.target as HTMLInputElement).value)"
                  class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none transition shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 2. MEDIA TAB (BIG PREVIEW FIRST) -->
        <div v-else-if="activeStudioTab === 'media'" key="media" class="max-w-4xl mx-auto space-y-6">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-bold text-slate-900 text-sm">تصویر کاور صفحه</h4>
                <p class="text-[11px] text-slate-400">پیش‌نمایش تصویر اصلی</p>
              </div>

              <button
                @click="openMediaModalFor('coverImage')"
                class="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Icon name="mdi:image-multiple" class="w-4 h-4" />
                <span>تعویض از رسانه‌های PocketBase</span>
              </button>
            </div>

            <!-- Big High-Res Visual Preview Box -->
            <div
              @click="openMediaModalFor('coverImage')"
              class="group relative w-full h-72 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden cursor-pointer shadow-sm hover:border-emerald-500 transition-all duration-200 flex items-center justify-center"
            >
              <img
                :src="activeCoverImageUrl"
                alt="cover"
                class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 gap-2">
                <span class="px-4 py-2 rounded-xl bg-white/95 text-slate-900 font-bold text-xs shadow-lg flex items-center gap-1.5">
                  <Icon name="mdi:tune" class="w-4 h-4 text-emerald-800" />
                  <span>کلیک برای ویرایش یا تعویض</span>
                </span>
              </div>
            </div>

            <!-- URL input (Strict LTR) -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400">آدرس لینک رسانه (URL)</label>
              <input
                type="text"
                dir="ltr"
                :value="rootSchema.coverImage || activeCoverImageUrl"
                @input="rootSchema.coverImage = ($event.target as HTMLInputElement).value; emitChange()"
                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-800 focus:outline-none text-left transition shadow-2xs"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <!-- 3. THEME & COLORS TAB -->
        <div v-else-if="activeStudioTab === 'theme'" key="theme" class="max-w-2xl mx-auto space-y-6">
          <div class="space-y-3">
            <h4 class="font-bold text-slate-900 text-sm">رنگ برند و المان‌ها</h4>

            <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <!-- Interactive Swatch & Picker -->
              <div class="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-300 shadow-sm shrink-0 cursor-pointer">
                <input
                  type="color"
                  :value="rootSchema.accentColor || '#018786'"
                  @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div class="w-full h-full" :style="{ backgroundColor: rootSchema.accentColor || '#018786' }"></div>
              </div>

              <div class="flex-1 space-y-1" dir="ltr">
                <label class="text-[10px] font-bold text-slate-400 block text-left">کد رنگ (HEX)</label>
                <input
                  type="text"
                  dir="ltr"
                  :value="rootSchema.accentColor || '#018786'"
                  @input="rootSchema.accentColor = ($event.target as HTMLInputElement).value; emitChange()"
                  class="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-900 focus:outline-none text-left font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 4. LISTS & ITEMS TAB -->
        <div v-else-if="activeStudioTab === 'lists'" key="lists" class="max-w-3xl mx-auto space-y-6">
          <div v-if="dynamicListKeys.length === 0" class="text-center py-12 text-slate-400">
            لیست پویایی در این اسکیما تعریف نشده است.
          </div>

          <div v-for="listKey in dynamicListKeys" :key="listKey" class="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 text-xs font-mono" dir="ltr">{{ listKey }}</span>
              <button
                @click="addDynamicListItem(listKey)"
                class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px] hover:bg-emerald-100 transition cursor-pointer flex items-center gap-1"
              >
                <Icon name="mdi:plus" class="w-3.5 h-3.5" />
                <span>افزودن آیتم</span>
              </button>
            </div>

            <div class="space-y-2">
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
                  class="flex-1 bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none transition shadow-2xs"
                />
                <button
                  @click="removeDynamicListItem(listKey, idx)"
                  class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="حذف"
                >
                  <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
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

const activeStudioTab = ref<'copy' | 'media' | 'theme' | 'lists'>('copy')
const activeLang = ref<'fa' | 'en' | 'ar' | 'all'>('fa')
const isMediaModalOpen = ref(false)
const activeMediaField = ref<string | null>(null)

const studioTabs = [
  { id: 'copy', label: 'متون', icon: 'mdi:format-text' },
  { id: 'media', label: 'رسانه', icon: 'mdi:image-outline' },
  { id: 'theme', label: 'رنگ و تم', icon: 'mdi:palette-outline' },
  { id: 'lists', label: 'لیست‌ها', icon: 'mdi:format-list-bulleted' }
]

const rootSchema = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  }
})

const activeCoverImageUrl = computed(() => {
  return rootSchema.value.coverImage || 'http://65.108.80.205:8090/api/files/media_files/af1wcbm41bpyl5u/03h7lwu7jexl_09nq786tge.avif'
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
  return locales.some(l => props.modelValue[l] && (props.modelValue[l][field] !== undefined))
}

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
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
