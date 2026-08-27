<!-- pages/resources/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12 select-none">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <span
        class="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 font-d4 break-words"
        v-editable="'badge'"
      >
        {{ localizedHeader.badge }}
      </span>
      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-d4 leading-tight break-words" v-editable="'title'">
        {{ localizedHeader.title }}
      </h1>
      <p class="text-xs sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto break-words" v-editable="'description'">
        {{ localizedHeader.description }}
      </p>
    </div>

    <!-- Search & Category Filter Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative w-full sm:w-80">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="isRTL ? 'جستجو در منابع و قالب‌ها...' : 'Search resources & dielines...'"
          class="w-full h-10 pr-9 pl-4 rounded-2xl bg-white border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-najmgreen shadow-xs"
        />
        <Icon name="mdi:magnify" class="w-4 h-4 text-gray-400 absolute right-3 top-3" />
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex overflow-x-auto gap-2 py-1 whitespace-nowrap custom-scrollbar w-full sm:w-auto">
        <button
          v-for="cat in categories"
          :key="cat.key"
          @click="activeCategory = cat.key"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer font-d4 shrink-0"
          :class="[
            activeCategory === cat.key
              ? 'bg-najmgreen text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          ]"
        >
          <span>{{ cat.label }}</span>
        </button>
      </div>
    </div>

    <!-- Resources Grid -->
    <div v-if="loading" class="p-16 text-center text-gray-400 text-xs font-d4">
      {{ isRTL ? 'در حال بارگذاری فایل‌ها...' : 'Loading resources...' }}
    </div>

    <div v-else-if="filteredResources.length === 0" class="p-16 text-center text-gray-400 text-xs font-d4">
      {{ isRTL ? 'موردی در این دسته‌بندی یافت نشد.' : 'No items found in this category.' }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="item in filteredResources"
        :key="item.id"
        class="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300 group"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-najmgreen font-d4 border border-emerald-500/20">
              {{ getItemCategory(item) }}
            </span>
            <span class="text-xs text-gray-400 font-mono" dir="ltr">{{ item.fileSize }} &middot; {{ item.fileFormat }}</span>
          </div>

          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-najmgreen flex items-center justify-center group-hover:scale-105 transition-transform">
            <Icon :name="item.icon || 'mdi:download'" class="w-6 h-6" />
          </div>

          <h3 class="text-base font-bold text-gray-900 group-hover:text-najmgreen transition-colors font-d4 leading-snug">
            {{ getItemTitle(item) }}
          </h3>

          <p class="text-xs text-gray-600 leading-relaxed line-clamp-3">
            {{ getItemDescription(item) }}
          </p>
        </div>

        <div class="flex items-center gap-3 pt-5 border-t border-gray-100 mt-5">
          <NuxtLink
            :to="`/resources/${item.slug}`"
            class="flex-1 py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-bold text-center transition font-d4"
          >
            {{ isRTL ? 'مشاهده جزئیات' : 'View Details' }}
          </NuxtLink>
          <a
            :href="item.downloadUrl || '#'"
            download
            class="py-2.5 px-4 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs font-d4 cursor-pointer"
          >
            <Icon name="mdi:download" class="w-4 h-4" />
            <span>{{ isRTL ? 'دانلود' : 'Download' }}</span>
          </a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const { ui, allUi } = usePageUI('resources')
useAdminEditable('resources', allUi)

const loading = ref(true)
const searchQuery = ref('')
const activeCategory = ref('all')
const liveResources = ref<any[]>([])

const activeLang = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  return (l === 'en' || l === 'ar' ? l : 'fa') as 'fa' | 'en' | 'ar'
})

const localizedHeader = computed(() => {
  if (activeLang.value === 'en') {
    return {
      badge: ui.value?.badgeEn || 'Najm Technical Resources & Design Hub',
      title: ui.value?.titleEn || 'Catalogs, Dieline Templates & File Prep Guides',
      description: ui.value?.descriptionEn || 'Direct vector dieline downloads (AI/PDF), standardized Fogra color profiles, and comprehensive production catalogs for packaging designers and engineers.'
    }
  }
  if (activeLang.value === 'ar') {
    return {
      badge: ui.value?.badgeAr || 'مركز الموارد والأدلة الفنية لمجمع نجم',
      title: ui.value?.titleAr || 'الكتالوجات وقوالب الدايكات وأدلة التصميم',
      description: ui.value?.descriptionAr || 'تحميل مباشر لملفات قوالب التكسير الفيكتور (AI/PDF)، بروفايلات الألوان القياسية والكتالوجات الشاملة للمصممين والمهندسين.'
    }
  }
  return {
    badge: ui.value?.badge || 'مرکز منابع و راهنماهای فنی چاپ نجم',
    title: ui.value?.title || 'کاتالوگ‌ها، قالب‌های تیغ و راهنماهای طراحی',
    description: ui.value?.description || 'تمامی فایل‌های مورد نیاز طراحان، مدیران محصول و تولید، شامل استانداردهای رنگ، قالب‌های تیغ و کاتالوگ‌های جامع محصولات به صورت مستقیم قابل دانلود است.'
  }
})

const categories = computed(() => {
  if (activeLang.value === 'en') {
    return [
      { key: 'all', label: 'All Resources' },
      { key: 'catalogs', label: 'Catalogs' },
      { key: 'guides', label: 'Technical Guides' },
      { key: 'templates', label: 'Dielines (AI/PDF)' },
      { key: 'standards', label: 'Standards' }
    ]
  }
  if (activeLang.value === 'ar') {
    return [
      { key: 'all', label: 'جميع المصادر' },
      { key: 'catalogs', label: 'الكتالوجات' },
      { key: 'guides', label: 'الأدلة الفنية' },
      { key: 'templates', label: 'قوالب الدايكات' },
      { key: 'standards', label: 'المعايير والشهادات' }
    ]
  }
  return [
    { key: 'all', label: 'همه منابع' },
    { key: 'catalogs', label: 'کاتالوگ‌ها' },
    { key: 'guides', label: 'راهنماهای فنی چاپ' },
    { key: 'templates', label: 'قالب‌های تیغ (Die-Cuts)' },
    { key: 'standards', label: 'استانداردها و گواهینامه‌ها' }
  ]
})

function getItemTitle(item: any): string {
  return item.locales?.[activeLang.value]?.title || item.title || ''
}

function getItemCategory(item: any): string {
  return item.locales?.[activeLang.value]?.categoryLabel || item.categoryLabel || item.category || ''
}

function getItemDescription(item: any): string {
  return item.locales?.[activeLang.value]?.description || item.description || ''
}

const filteredResources = computed(() => {
  return liveResources.value.filter((r) => {
    if (activeCategory.value !== 'all' && r.category !== activeCategory.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const title = getItemTitle(r).toLowerCase()
      const desc = getItemDescription(r).toLowerCase()
      return title.includes(q) || desc.includes(q) || (r.fileFormat || '').toLowerCase().includes(q)
    }
    return true
  })
})

async function fetchResources() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/resources')
    liveResources.value = res?.items || []
  } catch {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchResources()
})
</script>