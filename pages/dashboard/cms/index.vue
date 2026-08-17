<!-- pages/dashboard/cms/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="space-y-4 sm:space-y-6 max-w-full">
    <!-- Header Bar -->
    <div class="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-6 shadow-xs border border-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 font-d4 flex items-center gap-2">
          <Icon name="mdi:file-document-edit-outline" class="h-5 w-5 text-najmgreen" />
          {{ isRTL ? 'مدیریت محتوای صفحات (CMS)' : 'Page CMS Studio' }}
        </h2>
        <p class="text-xs text-gray-500 mt-0.5">
          {{
            isRTL
              ? 'ویرایش متون، عناوین، بنرها و ساختار صفحات بدون نیاز به تغییر کد'
              : 'Edit page text, headings, banners, and structured sections'
          }}
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="savePageChanges"
          :disabled="saving || !hasUnsavedChanges"
          class="flex items-center gap-1.5 rounded-xl bg-najmgreen px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Icon name="mdi:content-save" class="h-4 w-4" :class="saving ? 'animate-spin' : ''" />
          {{ isRTL ? 'ذخیره تغییرات' : 'Save Changes' }}
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

      <!-- Language Tab Switcher -->
      <div class="flex items-center gap-2">
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

    <!-- CMS Studio Layout -->
    <div class="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      <!-- Visual Section & Form Fields Editor -->
      <div class="lg:col-span-2 space-y-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-xs max-w-full">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 text-xs">
          <h3 class="font-bold text-gray-900 font-d4 flex items-center gap-1.5">
            <Icon name="mdi:format-text" class="h-4 w-4 text-najmgreen" />
            {{ selectedSlug }} ({{ activeLang }})
          </h3>
          <span class="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-najmgreen font-mono">
            {{ toLocalizedDigits(flattenedFields.length) }} {{ isRTL ? 'فیلد متنی' : 'fields' }}
          </span>
        </div>

        <!-- Empty State -->
        <div v-if="flattenedFields.length === 0" class="py-12 text-center text-xs text-gray-400">
          {{ isRTL ? 'محتوایی برای این زبان ثبت نشده است.' : 'No fields found for this page and language.' }}
        </div>

        <!-- Flattened Clean Input List -->
        <div v-else class="space-y-3 max-h-[550px] overflow-y-auto pe-1">
          <div
            v-for="item in flattenedFields"
            :key="item.path"
            class="rounded-xl border border-gray-200/80 bg-gray-50/60 p-3 space-y-1 hover:border-gray-300 transition"
          >
            <!-- Field Label / Path -->
            <div class="flex items-center justify-between">
              <label class="block text-[11px] font-bold text-gray-700 font-d4">
                {{ formatPathLabel(item.path) }}
              </label>
              <span class="text-[10px] text-gray-400 font-mono">{{ item.path }}</span>
            </div>

            <!-- Textarea for multiline, text input for single line -->
            <textarea
              v-if="String(item.value).length > 60 || String(item.value).includes('\n')"
              v-model="item.value"
              rows="2"
              @input="onFieldInput(item.path, item.value)"
              class="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs text-gray-900 focus:outline-none focus:border-najmgreen transition leading-relaxed"
            ></textarea>

            <input
              v-else
              type="text"
              v-model="item.value"
              @input="onFieldInput(item.path, item.value)"
              class="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs text-gray-900 focus:outline-none focus:border-najmgreen transition"
            />
          </div>
        </div>
      </div>

      <!-- Live JSON Schema Inspector -->
      <div class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 max-w-full">
        <div>
          <div class="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-3 text-xs">
            <h3 class="font-bold text-gray-900 font-d4 flex items-center gap-1">
              <Icon name="si:json-fill" class="h-4 w-4 text-najmgreen" />
              JSON Schema
            </h3>
            <button
              @click="copyJson"
              class="text-najmgreen font-semibold hover:underline cursor-pointer"
            >
              {{ isRTL ? 'کپی JSON' : 'Copy JSON' }}
            </button>
          </div>

          <div class="rounded-xl bg-gray-900 p-3 text-xs text-emerald-400 font-mono overflow-x-auto max-h-[400px] max-w-full" dir="ltr">
            <pre class="whitespace-pre-wrap text-[11px]">{{ JSON.stringify(currentRawSchema, null, 2) }}</pre>
          </div>
        </div>

        <div class="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
          <span class="text-gray-500">{{ isRTL ? 'وضعیت تغییرات:' : 'Status:' }}</span>
          <span
            class="rounded-full px-2.5 py-0.5 font-bold"
            :class="hasUnsavedChanges ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'"
          >
            {{ hasUnsavedChanges ? (isRTL ? 'تغییرات ذخیره‌نشده' : 'Unsaved') : (isRTL ? 'همگام با سرور' : 'Saved') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { useAdminLogger } from '~/composables/useAdminLogger'
import { toLocalizedDigits } from '~/utils/digits'
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

const currentRawSchema = ref<Record<string, any>>({})
const flattenedFields = ref<{ path: string; value: string }[]>([])

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

function flattenObject(obj: any, prefix = ''): { path: string; value: string }[] {
  let result: { path: string; value: string }[] = []
  if (!obj || typeof obj !== 'object') return result

  for (const key in obj) {
    const val = obj[key]
    const path = prefix ? `${prefix}.${key}` : key

    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      result.push({ path, value: String(val) })
    } else if (Array.isArray(val)) {
      val.forEach((item, index) => {
        if (typeof item === 'string' || typeof item === 'number') {
          result.push({ path: `${path}[${index}]`, value: String(item) })
        } else if (typeof item === 'object') {
          result = result.concat(flattenObject(item, `${path}[${index}]`))
        }
      })
    } else if (typeof val === 'object') {
      result = result.concat(flattenObject(val, path))
    }
  }

  return result
}

function loadCurrentSchema() {
  const all = allUi.value || {}
  const langSchema = all[activeLang.value] || {}
  currentRawSchema.value = JSON.parse(JSON.stringify(langSchema))
  flattenedFields.value = flattenObject(currentRawSchema.value)
  hasUnsavedChanges.value = false
}

watch([selectedSlug, activeLang, allUi], () => {
  loadCurrentSchema()
}, { immediate: true })

function onFieldInput(path: string, newValue: string) {
  hasUnsavedChanges.value = true
  setDeepProperty(currentRawSchema.value, path, newValue)
}

function setDeepProperty(obj: any, path: string, val: any) {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    if (!current[key]) current[key] = {}
    current = current[key]
  }
  current[parts[parts.length - 1]] = val
}

function formatPathLabel(path: string): string {
  const parts = path.split('.')
  const last = parts[parts.length - 1]
  return last.replace(/\[\d+\]/g, '').replace(/_/g, ' ')
}

function copyJson() {
  const text = JSON.stringify(currentRawSchema.value, null, 2)
  navigator.clipboard.writeText(text)
  alert(isRTL.value ? 'کپی شد.' : 'Copied.')
}

async function savePageChanges() {
  saving.value = true
  try {
    logNetwork('CMS', `Saving CMS draft for "${selectedSlug.value}" (${activeLang.value})`)

    const payload = flattenedFields.value.map((f) => ({ path: f.path, value: f.value }))
    await $fetch('/api/admin/ui/save-draft', {
      method: 'POST',
      body: { slug: selectedSlug.value, language: activeLang.value, changes: payload },
    })

    hasUnsavedChanges.value = false
    logInfo('CMS', `Saved CMS changes for ${selectedSlug.value} [${activeLang.value}]`)
    alert(isRTL.value ? 'تغییرات با موفقیت ذخیره شد.' : 'Saved.')
  } catch (err: any) {
    logError('CMS', `Failed to save CMS changes: ${err?.message || err}`)
    alert(isRTL.value ? 'خطا در ذخیره تغییرات.' : 'Error saving.')
  } finally {
    saving.value = false
  }
}
</script>
