<!-- pages/dash/resources.vue -->
<template>
  <div class="space-y-6 select-none font-sans">
    <!-- MODE 1: RESOURCES & GUIDES LIST -->
    <div v-if="!isEditingMode" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-white font-d4">مدیریت مرکز دانلود، کاتالوگ‌ها، قالب‌های تیغ و راهنماهای فنی</h2>
          <p class="text-xs text-zinc-400">افزودن، ویرایش، تغییر اولویت نمایش و بارگذاری فایل‌های PDF، AI، PSD و متون راهنما به ۳ زبان</p>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/resources"
            target="_blank"
            class="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all font-d4 cursor-pointer"
          >
            <AdminIcon name="link" class="w-4 h-4" />
            <span>مشاهده صفحه دانلودها در سایت</span>
          </NuxtLink>

          <button
            type="button"
            @click="openResourceStudio(null)"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all font-d4 cursor-pointer"
          >
            <AdminIcon name="plus" class="w-4 h-4" />
            <span>افزودن فایل / راهنمای جدید</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <!-- Search -->
        <div class="relative w-full md:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو در عنوان، فرمت، توضیحات..."
            class="w-full h-9 pr-8 pl-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
          <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-3 pointer-events-none" />
        </div>

        <!-- Category Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 rounded-xl bg-zinc-950 border border-white/5 custom-scrollbar text-xs font-d4">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            @click="activeCategory = cat.id"
            class="px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
            :class="activeCategory === cat.id ? 'bg-najmgreen text-white font-bold' : 'text-zinc-400 hover:text-white'"
          >
            <span>{{ cat.label }}</span>
            <span class="px-1 rounded-full text-[10px] bg-white/10 font-mono">{{ getCategoryCount(cat.id) }}</span>
          </button>
        </div>
      </div>

      <!-- Resources List -->
      <div v-if="loading" class="p-16 text-center text-zinc-500 text-xs font-d4">
        در حال بارگذاری فایل‌ها و منابع...
      </div>

      <div v-else-if="filteredResources.length === 0" class="p-16 text-center text-zinc-500 text-xs font-d4">
        موردی در این دسته‌بندی یافت نشد.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(item, index) in filteredResources"
          :key="item.id"
          class="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
        >
          <!-- Left: Order Controls + File Info -->
          <div class="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
            <!-- Reorder Buttons -->
            <div class="flex flex-col gap-1 shrink-0">
              <button
                type="button"
                @click="moveItem(index, -1)"
                :disabled="index === 0"
                class="w-6 h-6 rounded-md bg-zinc-950 hover:bg-zinc-800 disabled:opacity-20 text-zinc-300 flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                title="انتقال به بالا"
              >
                ▲
              </button>
              <button
                type="button"
                @click="moveItem(index, 1)"
                :disabled="index === filteredResources.length - 1"
                class="w-6 h-6 rounded-md bg-zinc-950 hover:bg-zinc-800 disabled:opacity-20 text-zinc-300 flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                title="انتقال به پایین"
              >
                ▼
              </button>
            </div>

            <!-- Icon / Thumbnail -->
            <div class="w-12 h-12 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
              <AdminIcon :name="item.category === 'templates' ? 'crop' : item.category === 'guides' ? 'file' : 'download'" class="w-6 h-6" />
            </div>

            <!-- Text & Metadata -->
            <div class="min-w-0 flex-1 space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-950 border border-white/5 text-emerald-300 font-d4">
                  {{ item.locales?.fa?.categoryLabel || item.categoryLabel || item.category }}
                </span>
                <span class="text-[11px] font-mono text-zinc-400">{{ item.fileFormat }} &middot; {{ item.fileSize }}</span>
                <span class="text-[10px] font-mono text-zinc-500">/resources/{{ item.slug }}</span>
              </div>

              <h3 class="text-sm font-bold text-white font-d4 truncate group-hover:text-emerald-300 transition-colors">
                {{ item.locales?.fa?.title || item.title }}
              </h3>

              <p class="text-xs text-zinc-400 line-clamp-1">
                {{ item.locales?.fa?.description || item.description }}
              </p>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 border-white/5 pt-2 md:pt-0 w-full md:w-auto justify-end">
            <a
              v-if="item.downloadUrl"
              :href="item.downloadUrl"
              target="_blank"
              download
              class="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer font-d4"
            >
              <AdminIcon name="download" class="w-3.5 h-3.5" />
              <span>تست دانلود</span>
            </a>

            <button
              type="button"
              @click="openResourceStudio(item)"
              class="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-d4 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <AdminIcon name="edit" class="w-3.5 h-3.5" />
              <span>ویرایش ۳ زبانه</span>
            </button>

            <button
              type="button"
              @click="deleteResource(item.id)"
              class="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="حذف فایل"
            >
              <AdminIcon name="trash" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 2: DEDICATED FULL-PAGE RESOURCE STUDIO (NOT A MODAL!) -->
    <div v-else class="space-y-6">
      <!-- Studio Topbar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900 border border-white/10">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isEditingMode = false"
            class="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer font-d4"
          >
            <AdminIcon name="chevron-right" class="w-4 h-4" />
            <span>بازگشت به فهرست فایل‌ها</span>
          </button>

          <div>
            <h2 class="text-base sm:text-lg font-bold text-white font-d4">
              {{ editingItem.id ? `ویرایش فایل و راهنما: ${editingItem.locales.fa.title}` : 'ثبت فایل / قالب تیغ / راهنمای جدید' }}
            </h2>
            <p class="text-xs text-zinc-400">تنظیم مشخصات فنی، فایل دانلودی و متن راهنما به زبان‌های فارسی، انگلیسی و عربی</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="saveResourceStudio"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all font-d4 cursor-pointer"
          >
            <AdminIcon name="save" class="w-4 h-4" />
            <span>ذخیره نهایی در سرور</span>
          </button>
        </div>
      </div>

      <!-- Studio Form: 3-Locale Text & File Settings -->
      <div class="rounded-3xl bg-zinc-900/90 border border-white/10 p-6 space-y-6">
        <!-- 3-Locale Switcher -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 class="text-sm font-bold text-white font-d4 flex items-center gap-2">
              <AdminIcon name="edit" class="w-4 h-4 text-emerald-400" />
              <span>محتوا و متن راهنما به ۳ زبان:</span>
            </h3>
            <p class="text-xs text-zinc-400">عنوان، خلاصه و دستورالعمل کامل فنی در هر زبان</p>
          </div>

          <div class="flex items-center p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono">
            <button
              v-for="lang in ['fa', 'en', 'ar']"
              :key="lang"
              type="button"
              @click="activeLocaleTab = lang as any"
              class="px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer uppercase flex items-center gap-1.5"
              :class="activeLocaleTab === lang ? 'bg-najmgreen text-white font-bold' : 'text-zinc-400 hover:text-white'"
            >
              <span>{{ lang === 'fa' ? '🇮🇷 فارسی (FA)' : lang === 'en' ? '🇬🇧 English (EN)' : '🇸🇦 العربية (AR)' }}</span>
            </button>
          </div>
        </div>

        <!-- Inputs for Active Language -->
        <div class="space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">عنوان منبع / راهنما ({{ activeLocaleTab.toUpperCase() }}):</label>
            <input
              v-model="editingItem.locales[activeLocaleTab].title"
              type="text"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              :placeholder="activeLocaleTab === 'fa' ? 'مثال: قالب تیغ استاندارد جعبه درب‌دار' : 'Enter resource title...'"
              :dir="activeLocaleTab === 'en' ? 'ltr' : 'rtl'"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">برچسب دسته‌بندی ترجمه شده ({{ activeLocaleTab.toUpperCase() }}):</label>
            <input
              v-model="editingItem.locales[activeLocaleTab].categoryLabel"
              type="text"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              :placeholder="activeLocaleTab === 'fa' ? 'قالب تیغ دایکات' : 'Dieline Template'"
              :dir="activeLocaleTab === 'en' ? 'ltr' : 'rtl'"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">توضیحات کوتاه ({{ activeLocaleTab.toUpperCase() }}):</label>
            <textarea
              v-model="editingItem.locales[activeLocaleTab].description"
              rows="2"
              class="w-full p-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
              :dir="activeLocaleTab === 'en' ? 'ltr' : 'rtl'"
            ></textarea>
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">متن کامل راهنما / توضیحات فنی ({{ activeLocaleTab.toUpperCase() }}):</label>
            <textarea
              v-model="editingItem.locales[activeLocaleTab].content"
              rows="6"
              class="w-full p-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
              :placeholder="activeLocaleTab === 'fa' ? 'دستورالعمل آماده‌سازی فایل، خطوط تیغ و استانداردهای چاپ...' : 'Detailed technical guidelines...'"
              :dir="activeLocaleTab === 'en' ? 'ltr' : 'rtl'"
            ></textarea>
          </div>
        </div>

        <!-- File Settings: Format, Size, Category, Slug -->
        <div class="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">دسته‌بندی کلی:</label>
            <select
              v-model="editingItem.category"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none font-d4"
            >
              <option value="catalogs">کاتالوگ‌های محصولات و نمونه‌ها</option>
              <option value="guides">راهنماهای فنی چاپ و رنگ</option>
              <option value="templates">قالب‌های تیغ دایکات (AI / PDF)</option>
              <option value="standards">استانداردها و گواهینامه‌ها</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">نامک انگلیسی در URL (Slug):</label>
            <input
              v-model="editingItem.slug"
              type="text"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              dir="ltr"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">فرمت فایل:</label>
            <input
              v-model="editingItem.fileFormat"
              type="text"
              placeholder="PDF / AI / PSD"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              dir="ltr"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">حجم فایل:</label>
            <input
              v-model="editingItem.fileSize"
              type="text"
              placeholder="مثال: 14.2 MB"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              dir="ltr"
            />
          </div>
        </div>

        <!-- Download URL & Visual Media Picker Tray -->
        <div class="pt-4 border-t border-white/10 space-y-3">
          <div class="flex items-center justify-between">
            <label class="font-bold text-zinc-200 text-xs font-d4">فایل دانلودی / تصویر شاخص:</label>
            <span class="text-[11px] font-mono text-emerald-400">{{ editingItem.downloadUrl }}</span>
          </div>

          <div class="h-36 overflow-y-auto rounded-2xl bg-zinc-950 border border-white/10 p-2.5 grid grid-cols-4 sm:grid-cols-8 gap-2 custom-scrollbar">
            <div
              v-for="item in galleryAssets"
              :key="item.url"
              @click="editingItem.downloadUrl = item.url"
              class="aspect-square rounded-xl bg-zinc-900 border overflow-hidden p-1 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
              :class="editingItem.downloadUrl === item.url ? 'border-emerald-500 shadow-md shadow-emerald-500/20' : 'border-white/10 hover:border-white/30'"
            >
              <img :src="item.url" :alt="item.filename" class="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const loading = ref(true)
const isEditingMode = ref(false)
const searchQuery = ref('')
const activeCategory = ref('all')
const activeLocaleTab = ref<'fa' | 'en' | 'ar'>('fa')
const galleryAssets = ref<any[]>([])

const resources = ref<any[]>([])

const categories = [
  { id: 'all', label: 'همه منابع' },
  { id: 'catalogs', label: 'کاتالوگ‌ها' },
  { id: 'guides', label: 'راهنماهای فنی چاپ' },
  { id: 'templates', label: 'قالب‌های تیغ (Die-Cuts)' },
  { id: 'standards', label: 'استانداردها و گواهینامه‌ها' }
]

function getCategoryCount(catId: string): number {
  if (catId === 'all') return resources.value.length
  return resources.value.filter(r => r.category === catId).length
}

const filteredResources = computed(() => {
  return resources.value.filter(r => {
    if (activeCategory.value !== 'all' && r.category !== activeCategory.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const title = (r.locales?.fa?.title || r.title || '').toLowerCase()
      const desc = (r.locales?.fa?.description || r.description || '').toLowerCase()
      const fmt = (r.fileFormat || '').toLowerCase()
      return title.includes(q) || desc.includes(q) || fmt.includes(q)
    }
    return true
  })
})

const editingItem = reactive<any>({
  id: '',
  slug: '',
  category: 'templates',
  categoryLabel: 'قالب تیغ',
  fileFormat: 'AI / PDF',
  fileSize: '5.0 MB',
  downloadUrl: '/images/products/1.png',
  locales: {
    fa: { title: '', categoryLabel: '', description: '', content: '' },
    en: { title: '', categoryLabel: '', description: '', content: '' },
    ar: { title: '', categoryLabel: '', description: '', content: '' }
  }
})

function openResourceStudio(item: any) {
  if (item) {
    Object.assign(editingItem, JSON.parse(JSON.stringify(item)))
    if (!editingItem.locales) {
      editingItem.locales = {
        fa: { title: item.title, categoryLabel: item.categoryLabel, description: item.description, content: '' },
        en: { title: item.title, categoryLabel: item.categoryLabel, description: item.description, content: '' },
        ar: { title: item.title, categoryLabel: item.categoryLabel, description: item.description, content: '' }
      }
    }
  } else {
    Object.assign(editingItem, {
      id: '',
      slug: `template-${Date.now()}`,
      category: 'templates',
      categoryLabel: 'قالب تیغ',
      fileFormat: 'AI / PDF',
      fileSize: '5.0 MB',
      downloadUrl: '/images/products/1.png',
      locales: {
        fa: { title: 'قالب تیغ جدید', categoryLabel: 'قالب تیغ دایکات', description: 'توضیحات کوتاه قالب...', content: 'دستورالعمل فنی و استانداردهای طراحی...' },
        en: { title: 'New Dieline Template', categoryLabel: 'Dieline Template', description: 'Brief template description...', content: 'Technical artwork guidelines...' },
        ar: { title: 'قالب تكسير جديد', categoryLabel: 'قالب دايكات', description: 'وصف موجز للقالب...', content: 'إرشادات التصميم الفني...' }
      }
    })
  }

  activeLocaleTab.value = 'fa'
  isEditingMode.value = true
}

async function saveResourceStudio() {
  editingItem.categoryLabel = editingItem.locales.fa.categoryLabel || editingItem.categoryLabel

  const payload = JSON.parse(JSON.stringify(editingItem))

  await $fetch('/api/admin/resources/save', {
    method: 'POST',
    body: payload
  }).catch(() => null)

  if (editingItem.id) {
    const idx = resources.value.findIndex(r => r.id === editingItem.id)
    if (idx !== -1) resources.value[idx] = payload
  } else {
    payload.id = `res-${Date.now()}`
    resources.value.push(payload)
  }

  isEditingMode.value = false
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'فایل و راهنما با موفقیت ذخیره گردید.' } }))
}

async function deleteResource(id: string) {
  await $fetch(`/api/admin/resources/${id}`, {
    method: 'DELETE'
  }).catch(() => null)

  resources.value = resources.value.filter(r => r.id !== id)
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'فایل با موفقیت حذف شد.' } }))
}

async function moveItem(index: number, direction: number) {
  const target = index + direction
  if (target < 0 || target >= filteredResources.value.length) return

  const itemA = filteredResources.value[index]
  const itemB = filteredResources.value[target]

  // Swap in main array
  const idxA = resources.value.findIndex(r => r.id === itemA.id)
  const idxB = resources.value.findIndex(r => r.id === itemB.id)
  if (idxA !== -1 && idxB !== -1) {
    const temp = resources.value[idxA]
    resources.value[idxA] = resources.value[idxB]
    resources.value[idxB] = temp
  }

  const ids = resources.value.map(r => r.id)
  await $fetch('/api/admin/resources/reorder', {
    method: 'POST',
    body: { ids }
  }).catch(() => null)

  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'ترتیب نمایش به‌روزرسانی شد.' } }))
}

async function loadData() {
  loading.value = true
  try {
    const [resRes, mediaRes]: any = await Promise.all([
      $fetch('/api/resources').catch(() => ({ items: [] })),
      $fetch('/api/admin/media').catch(() => ({ items: [] }))
    ])

    resources.value = resRes?.items || []
    galleryAssets.value = mediaRes?.items || []
  } catch (err) {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
