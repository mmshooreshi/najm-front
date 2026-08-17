<!-- pages/dashboard/cms/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="space-y-4 sm:space-y-6 max-w-full">
    <!-- Header Bar -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-6 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 font-d4 flex items-center gap-2">
          <Icon name="mdi:file-document-edit-outline" class="h-5 w-5 text-najmgreen" />
          {{ isRTL ? 'مدیریت محتوای صفحات (Page CMS Studio)' : 'Page CMS Studio' }}
        </h2>
        <p class="text-xs text-gray-500 mt-0.5">
          {{
            isRTL
              ? 'ویرایش سریع و تودرتوی محتوا با پنل‌های آکاردئونی هوشمند'
              : 'Fast nested page content management with smart expandable section cards'
          }}
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Unsaved Changes Badge -->
        <span
          v-if="hasUnsavedChanges"
          class="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5"
        >
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>تغییرات ذخیره‌نشده</span>
        </span>

        <button
          @click="savePageChanges"
          :disabled="saving || !hasUnsavedChanges"
          class="flex items-center gap-1.5 rounded-xl bg-najmgreen px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Icon v-if="saving" name="mdi:loading" class="w-4 h-4 animate-spin" />
          <Icon v-else name="mdi:content-save-outline" class="w-4 h-4" />
          <span>{{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
        </button>
      </div>
    </div>

    <!-- Page & Language Selector Toolbar -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-3 sm:p-4 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between text-xs">
      <!-- Page Slug Selector -->
      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-bold text-gray-700 font-d4">{{ isRTL ? 'صفحه:' : 'Page:' }}</span>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="p in availablePages"
            :key="p.slug"
            @click="selectedSlug = p.slug"
            class="rounded-xl px-3 py-1.5 font-semibold transition cursor-pointer text-xs"
            :class="
              selectedSlug === p.slug
                ? 'bg-najmgreen text-white shadow-xs font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
          >
            {{ isRTL ? p.labelFa : p.labelEn }}
          </button>
        </div>
      </div>

      <!-- Language Tab Switcher & Expand/Collapse All -->
      <div class="flex items-center gap-3">
        <button
          @click="toggleAllSections"
          class="text-xs text-gray-500 hover:text-najmgreen font-medium transition cursor-pointer"
        >
          {{ allSectionsExpanded ? 'بستن همه بخش‌ها' : 'باز کردن همه بخش‌ها' }}
        </button>

        <div class="flex items-center gap-1.5">
          <span class="font-bold text-gray-700 font-d4">{{ isRTL ? 'زبان:' : 'Lang:' }}</span>
          <div class="flex items-center rounded-xl bg-gray-100 p-0.5">
            <button
              v-for="l in ['FA', 'EN', 'AR']"
              :key="l"
              @click="activeLang = l"
              class="rounded-lg px-3 py-1 font-bold transition cursor-pointer"
              :class="
                activeLang === l
                  ? 'bg-white text-najmgreen shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              "
            >
              {{ l }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Smart Collapsible Section Cards Grid -->
    <div class="space-y-4">
      <div
        v-for="section in parsedSections"
        :key="section.key"
        class="bg-white rounded-3xl border transition-all duration-200 overflow-hidden"
        :class="[
          expandedSectionsMap[section.key]
            ? 'border-najmgreen/50 ring-1 ring-najmgreen/10 shadow-sm'
            : 'border-gray-200/80 shadow-xs hover:border-gray-300'
        ]"
      >
        <!-- Card Header: Directly Editable Major Fields On Collapse -->
        <div class="p-4 sm:p-5 bg-[#FAFCFD] border-b border-gray-100/80 space-y-3">
          <!-- Top Row: Section Name, Icon, Badge & Expand Toggle -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-najmgreen/10 text-najmgreen flex items-center justify-center font-bold">
                <Icon :name="getSectionIcon(section.key)" class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900 font-d4">
                  {{ section.label }}
                </h3>
                <span class="text-[10px] text-gray-400 font-mono">section: {{ section.key }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-mono">
                {{ section.subFieldCount }} فیلد
              </span>
              <button
                @click="toggleSection(section.key)"
                class="w-8 h-8 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition cursor-pointer shadow-xs"
                :title="expandedSectionsMap[section.key] ? 'بستن پنل' : 'مشاهده جزئیات بیشتر'"
              >
                <Icon
                  :name="expandedSectionsMap[section.key] ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                  class="w-4 h-4 text-gray-700"
                />
              </button>
            </div>
          </div>

          <!-- Quick-Edit Primary Fields (Title & Eyebrow/Subtitle) Right on the Collapsed Bar -->
          <div v-if="section.primaryFields.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div
              v-for="field in section.primaryFields"
              :key="field.path"
              class="space-y-1"
            >
              <label class="block text-[11px] font-bold text-gray-600 font-d4">
                {{ field.label }}:
              </label>
              <input
                v-model="field.value"
                @input="onFieldChange(field.path, field.value)"
                type="text"
                class="w-full px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 font-semibold focus:border-najmgreen focus:outline-none transition shadow-inner"
              />
            </div>
          </div>
        </div>

        <!-- Expanded Drawer Content: Nested Rich Controls -->
        <div v-if="expandedSectionsMap[section.key]" class="p-5 sm:p-6 space-y-5 bg-white">
          <!-- Textarea / Detailed Description -->
          <div v-if="section.longTextFields.length" class="space-y-4">
            <div v-for="field in section.longTextFields" :key="field.path" class="space-y-1.5">
              <label class="block text-xs font-bold text-gray-700 font-d4">
                {{ field.label }}:
              </label>
              <textarea
                v-model="field.value"
                @input="onFieldChange(field.path, field.value)"
                rows="3"
                class="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:bg-white focus:border-najmgreen focus:outline-none transition leading-relaxed"
              ></textarea>
            </div>
          </div>

          <!-- Tags / Highlights Chips Manager -->
          <div v-if="section.tagArrays.length" class="space-y-4">
            <div v-for="tagField in section.tagArrays" :key="tagField.path" class="space-y-2">
              <label class="block text-xs font-bold text-gray-700 font-d4">{{ tagField.label }}:</label>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, tIdx) in tagField.items"
                  :key="tIdx"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-najmgrey text-xs text-gray-800 border border-najmborder/40"
                >
                  <span>{{ tag }}</span>
                  <button
                    @click="removeTagFromSection(tagField.path, tIdx)"
                    class="text-gray-400 hover:text-red-500 p-0.5 rounded transition cursor-pointer"
                  >
                    <Icon name="mdi:close" class="w-3 h-3" />
                  </button>
                </span>
              </div>
              <div class="flex items-center gap-2 pt-1 max-w-sm">
                <input
                  v-model="newTagInputs[tagField.path]"
                  @keydown.enter.prevent="addTagToSection(tagField.path)"
                  type="text"
                  placeholder="افزودن مورد جدید..."
                  class="flex-1 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
                />
                <button
                  @click="addTagToSection(tagField.path)"
                  class="px-3.5 py-1.5 rounded-xl bg-najmgreen text-white text-xs font-bold hover:bg-emerald-800 transition cursor-pointer"
                >
                  + افزودن
                </button>
              </div>
            </div>
          </div>

          <!-- Image Pickers -->
          <div v-if="section.imageFields.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="img in section.imageFields" :key="img.path" class="space-y-2 p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80">
              <label class="block text-xs font-bold text-gray-700 font-d4">{{ img.label }}:</label>
              <div class="flex items-center gap-3">
                <div v-if="img.value" class="w-16 h-16 rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img :src="'/' + img.value.replace(/^\//, '')" class="w-full h-full object-contain p-1" />
                </div>
                <input
                  v-model="img.value"
                  @input="onFieldChange(img.path, img.value)"
                  type="text"
                  placeholder="images/..."
                  class="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-mono ltr text-left focus:border-najmgreen focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          <!-- Nested Sub-Cards / FAQ Items / Capability Cards -->
          <div v-if="section.nestedCards.length" class="space-y-3 pt-2">
            <h4 class="text-xs font-bold text-gray-900 font-d4">کارت‌ها و آیتم‌های تودرتو:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(card, cIdx) in section.nestedCards"
                :key="cIdx"
                class="rounded-2xl border border-gray-200 p-4 bg-gray-50/50 space-y-3 hover:border-gray-300 transition"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-800">کارت شماره ۰{{ cIdx + 1 }}</span>
                  <button
                    @click="deleteNestedCard(section.key, cIdx)"
                    class="text-gray-400 hover:text-red-500 p-1"
                    title="حذف کارت"
                  >
                    <Icon name="mdi:trash-can-outline" class="w-3.5 h-3.5" />
                  </button>
                </div>

                <div v-for="(cardVal, cardKey) in card" :key="cardKey" class="space-y-1">
                  <label class="block text-[11px] font-semibold text-gray-600 font-mono">{{ cardKey }}:</label>
                  <textarea
                    v-if="String(cardVal).length > 60 || String(cardKey).includes('desc') || String(cardKey).includes('answer')"
                    :value="cardVal"
                    @input="onNestedCardFieldChange(section.key, cIdx, String(cardKey), ($event.target as HTMLTextAreaElement).value)"
                    rows="2"
                    class="w-full px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs focus:border-najmgreen focus:outline-none transition leading-relaxed"
                  ></textarea>
                  <input
                    v-else
                    :value="cardVal"
                    @input="onNestedCardFieldChange(section.key, cIdx, String(cardKey), ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="w-full px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs focus:border-najmgreen focus:outline-none transition"
                  />
                </div>
              </div>
            </div>
            <button
              @click="addNestedCard(section.key)"
              class="px-4 py-2 rounded-xl border border-dashed border-gray-300 hover:border-najmgreen text-xs font-bold text-gray-700 hover:text-najmgreen transition w-full"
            >
              + افزودن کارت جدید به این بخش
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { useAdminLogger } from '~/composables/useAdminLogger'
import { usePageUI } from '~/composables/ui/usePageUI'

definePageMeta({
  layout: 'dashboard',
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const { logInfo, logError, logNetwork } = useAdminLogger()

const selectedSlug = ref('home')
const activeLang = ref('FA')
const saving = ref(false)
const hasUnsavedChanges = ref(false)
const allSectionsExpanded = ref(false)
const expandedSectionsMap = reactive<Record<string, boolean>>({})
const newTagInputs = reactive<Record<string, string>>({})

const availablePages = [
  { slug: 'home', labelFa: 'صفحه اصلی', labelEn: 'Home' },
  { slug: 'about', labelFa: 'درباره ما', labelEn: 'About' },
  { slug: 'services', labelFa: 'خدمات چاپ', labelEn: 'Services' },
  { slug: 'products', labelFa: 'محصولات', labelEn: 'Products' },
  { slug: 'contact', labelFa: 'تماس با ما', labelEn: 'Contact' },
  { slug: 'catalog', labelFa: 'کاتالوگ‌ها', labelEn: 'Catalog' },
  { slug: 'guides', labelFa: 'راهنماهای فنی', labelEn: 'Guides' },
]

const { allUi } = usePageUI(selectedSlug.value)
const currentRawSchema = ref<Record<string, any>>({})

function loadCurrentSchema() {
  const all = allUi.value || {}
  const langSchema = all[activeLang.value] || {}
  currentRawSchema.value = JSON.parse(JSON.stringify(langSchema))
  hasUnsavedChanges.value = false
}

watch([selectedSlug, activeLang, allUi], () => {
  loadCurrentSchema()
}, { immediate: true })

interface ParsedSection {
  key: string
  label: string
  subFieldCount: number
  primaryFields: { path: string; label: string; value: string }[]
  longTextFields: { path: string; label: string; value: string }[]
  tagArrays: { path: string; label: string; items: string[] }[]
  imageFields: { path: string; label: string; value: string }[]
  nestedCards: Record<string, any>[]
}

const parsedSections = computed<ParsedSection[]>(() => {
  const schema = currentRawSchema.value || {}
  const keys = Object.keys(schema)

  return keys.map((secKey) => {
    const secObj = schema[secKey] || {}
    const primaryFields: { path: string; label: string; value: string }[] = []
    const longTextFields: { path: string; label: string; value: string }[] = []
    const tagArrays: { path: string; label: string; items: string[] }[] = []
    const imageFields: { path: string; label: string; value: string }[] = []
    let nestedCards: Record<string, any>[] = []
    let subFieldCount = 0

    if (typeof secObj === 'object' && secObj !== null) {
      for (const k in secObj) {
        const val = secObj[k]
        const path = `${secKey}.${k}`
        subFieldCount++

        if (k === 'title' || k === 'eyebrow' || k === 'subtitle') {
          primaryFields.push({ path, label: formatFieldLabel(k), value: String(val ?? '') })
        } else if (k.toLowerCase().includes('image') || k.toLowerCase().includes('icon')) {
          imageFields.push({ path, label: formatFieldLabel(k), value: String(val ?? '') })
        } else if (typeof val === 'string') {
          longTextFields.push({ path, label: formatFieldLabel(k), value: String(val ?? '') })
        } else if (Array.isArray(val) && (val.length === 0 || typeof val[0] === 'string')) {
          tagArrays.push({ path, label: formatFieldLabel(k), items: val })
        } else if (Array.isArray(val) && typeof val[0] === 'object') {
          nestedCards = val
        }
      }
    }

    return {
      key: secKey,
      label: formatSectionLabel(secKey),
      subFieldCount,
      primaryFields,
      longTextFields,
      tagArrays,
      imageFields,
      nestedCards
    }
  })
})

function formatSectionLabel(key: string): string {
  const map: Record<string, string> = {
    hero: 'هیرو و سربرگ اصلی (Hero)',
    services: 'خدمات و قابلیت‌ها',
    serviceIncludes: 'شامل چه مواردی است',
    packages: 'پکیج‌ها و بسته‌ها',
    industries: 'راهکارهای صنایع',
    facilities: 'ماشین‌آلات و تجهیزات',
    faq: 'پرسش‌های متداول (FAQ)',
    midCta: 'بخش فراخوان اقدام (CTA)',
    contact: 'اطلاعات تماس و نشانی',
    layout: 'تنظیمات ساختاری صفحه'
  }
  return map[key] || key.replace(/_/g, ' ')
}

function formatFieldLabel(key: string): string {
  const map: Record<string, string> = {
    title: 'عنوان اصلی',
    eyebrow: 'تیتر کوچک بالایی (Eyebrow)',
    subtitle: 'زیرعنوان',
    description: 'توضیحات تکمیلی',
    topImage: 'تصویر شاخص بالای بخش',
    secondaryImage: 'تصویر دوم / پس‌زمینه',
    highlights: 'ویژگی‌های کلیدی',
    items: 'لیست آیتم‌ها'
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
  if (key.includes('midCta') || key.includes('cta')) return 'mdi:bullhorn-outline'
  return 'mdi:folder-outline'
}

function toggleSection(key: string) {
  expandedSectionsMap[key] = !expandedSectionsMap[key]
}

function toggleAllSections() {
  allSectionsExpanded.value = !allSectionsExpanded.value
  parsedSections.value.forEach((s) => {
    expandedSectionsMap[s.key] = allSectionsExpanded.value
  })
}

function onFieldChange(path: string, val: any) {
  hasUnsavedChanges.value = true
  const parts = path.split('.')
  let cur = currentRawSchema.value
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = val
}

function addTagToSection(path: string) {
  const val = newTagInputs[path]?.trim()
  if (!val) return
  hasUnsavedChanges.value = true

  const parts = path.split('.')
  const sec = currentRawSchema.value[parts[0]]
  if (sec) {
    if (!Array.isArray(sec[parts[1]])) sec[parts[1]] = []
    sec[parts[1]].push(val)
  }
  newTagInputs[path] = ''
}

function removeTagFromSection(path: string, idx: number) {
  hasUnsavedChanges.value = true
  const parts = path.split('.')
  const sec = currentRawSchema.value[parts[0]]
  if (sec && Array.isArray(sec[parts[1]])) {
    sec[parts[1]].splice(idx, 1)
  }
}

function onNestedCardFieldChange(secKey: string, cardIdx: number, field: string, val: any) {
  hasUnsavedChanges.value = true
  const sec = currentRawSchema.value[secKey]
  const list = sec?.items || sec?.groups || sec?.cards
  if (list && list[cardIdx]) {
    list[cardIdx][field] = val
  }
}

function addNestedCard(secKey: string) {
  hasUnsavedChanges.value = true
  const sec = currentRawSchema.value[secKey]
  if (!sec.items && !sec.groups) sec.items = []
  const targetList = sec.items || sec.groups
  targetList.push({ title: 'کارت جدید', description: 'توضیحات کارت...' })
}

function deleteNestedCard(secKey: string, cardIdx: number) {
  hasUnsavedChanges.value = true
  const sec = currentRawSchema.value[secKey]
  const targetList = sec?.items || sec?.groups
  if (targetList) targetList.splice(cardIdx, 1)
}

async function savePageChanges() {
  saving.value = true
  try {
    logNetwork('CMS', `Saving CMS draft for "${selectedSlug.value}" (${activeLang.value})`)

    await $fetch('/api/admin/ui/save-draft', {
      method: 'POST',
      body: {
        slug: selectedSlug.value,
        language: activeLang.value,
        fullSchema: currentRawSchema.value
      },
    })

    hasUnsavedChanges.value = false
    logInfo('CMS', `Saved CMS changes for ${selectedSlug.value} [${activeLang.value}]`)
    alert('تغییرات صفحه با موفقیت ذخیره شد.')
  } catch (err: any) {
    logError('CMS', `Failed to save CMS changes: ${err?.message || err}`)
    alert('خطا در ذخیره تغییرات.')
  } finally {
    saving.value = false
  }
}
</script>
