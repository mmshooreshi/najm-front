<!-- pages/products/printing/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12 select-none font-sans">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs text-gray-500" :class="isRTL ? 'text-right' : 'text-left'">
      <NuxtLink to="/" class="hover:text-najmgreen transition">{{ isRTL ? 'خانه' : 'Home' }}</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen transition">{{ isRTL ? 'محصولات' : 'Products' }}</NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-bold font-d4">{{ localizedHeader.badge }}</span>
    </nav>

    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 font-d4">
        {{ localizedHeader.badge }}
      </span>
      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-d4 leading-tight">
        {{ localizedHeader.title }}
      </h1>
      <p class="text-xs sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
        {{ localizedHeader.description }}
      </p>
    </div>

    <!-- Sub-Category Filter Bar -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
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

      <NuxtLink
        to="/consultation"
        class="px-5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-najmgreen border border-najmgreen/30 text-xs font-bold font-d4 transition-all"
      >
        <span>{{ isRTL ? 'استعلام قیمت چاپ افست' : 'Offset Printing Quote' }}</span>
      </NuxtLink>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="p-16 text-center text-gray-400 text-xs font-d4">
      {{ isRTL ? 'در حال بارگذاری خدمات چاپ...' : 'Loading printing catalog...' }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="item in filteredItems"
        :key="item.id"
        class="bg-white rounded-3xl overflow-hidden shadow-xs border border-gray-100 flex flex-col justify-between hover:shadow-lg hover:border-cyan-500/30 transition-all duration-300 group"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <!-- Photo -->
        <div class="relative h-56 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
          <img
            :src="item.image"
            :alt="getItemTitle(item)"
            class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />

          <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-cyan-700 border border-gray-200 font-d4">
            {{ getItemCategory(item) }}
          </span>
        </div>

        <!-- Info -->
        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <h3 class="text-base font-bold text-gray-900 group-hover:text-najmgreen transition-colors font-d4 leading-snug">
              {{ getItemTitle(item) }}
            </h3>

            <div class="flex flex-wrap gap-1.5 pt-0.5">
              <span class="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-700 font-d4">
                {{ item.paperType }}
              </span>
              <span v-if="item.binding" class="px-2 py-0.5 rounded-md bg-purple-50 text-[10px] text-purple-700 font-d4 border border-purple-200">
                {{ item.binding }}
              </span>
              <span class="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-mono text-gray-500">
                تیراژ: {{ item.minQty }}
              </span>
            </div>

            <p class="text-xs text-gray-600 leading-relaxed line-clamp-2 pt-1">
              {{ getItemDescription(item) }}
            </p>
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
            <NuxtLink
              :to="`/products/printing/${item.slug}`"
              class="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold text-center transition font-d4"
            >
              {{ isRTL ? 'مشاهده جزئیات' : 'View Details' }}
            </NuxtLink>

            <NuxtLink
              to="/consultation"
              class="py-2.5 px-4 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition shadow-xs font-d4"
            >
              <span>{{ isRTL ? 'سفارش' : 'Order' }}</span>
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const loading = ref(true)
const activeCategory = ref('all')
const items = ref<any[]>([])

const activeLang = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  return (l === 'en' || l === 'ar' ? l : 'fa') as 'fa' | 'en' | 'ar'
})

const localizedHeader = computed(() => {
  if (activeLang.value === 'en') {
    return {
      badge: 'Commercial & Offset Printing Services',
      title: 'Catalogs, Executive Folders, Planners & Corporate Stationery',
      description: 'Precision 5-color Heidelberg offset printing with inline coating, hot melt PUR binding, and custom spot UV finishing.'
    }
  }
  if (activeLang.value === 'ar') {
    return {
      badge: 'خدمات الطباعة التجارية والأوفست',
      title: 'الكتالوجات، المجلدات الإدارية، المفكرات والمطبوعات الرسمية',
      description: 'طباعة هايدلبرغ ٥ ألوان عالية الدقة مع التجليد الحراري والتشطيبات الفاخرة للشركات والمؤسسات.'
    }
  }
  return {
    badge: 'خدمات چاپ افست و اوراق تجاری',
    title: 'چاپ کاتالوگ‌های چندلت، فولدرهای مدیریتی، سررسید و ست اداری',
    description: 'خطوط چاپ افست ۵ رنگ هایدلبرگ مجهز به برج ورنی، صحافی چسب گرم PUR و طلاکوب اختصاصی با تفکیک رنگ استاندارد اروپایی.'
  }
})

const categories = computed(() => {
  if (activeLang.value === 'en') {
    return [
      { key: 'all', label: 'All Print Products' },
      { key: 'catalog_brochure', label: 'Catalogs & Brochures' },
      { key: 'folder_stationery', label: 'Folders & Stationery' },
      { key: 'calendar_planner', label: 'Planners & Calendars' },
      { key: 'business_card', label: 'Business Cards' },
      { key: 'label_sticker', label: 'Roll Labels' }
    ]
  }
  if (activeLang.value === 'ar') {
    return [
      { key: 'all', label: 'جميع المطبوعات' },
      { key: 'catalog_brochure', label: 'الكتالوجات والبروشورات' },
      { key: 'folder_stationery', label: 'المجلدات والأوراق الرسمية' },
      { key: 'calendar_planner', label: 'المفكرات السنوية' },
      { key: 'business_card', label: 'بطاقات العمل' },
      { key: 'label_sticker', label: 'الملصقات' }
    ]
  }
  return [
    { key: 'all', label: 'همه اوراق چاپی' },
    { key: 'catalog_brochure', label: 'کاتالوگ و بروشور' },
    { key: 'folder_stationery', label: 'فولدر و ست اداری' },
    { key: 'calendar_planner', label: 'سررسید و تقویم' },
    { key: 'business_card', label: 'کارت ویزیت لوکس' },
    { key: 'label_sticker', label: 'لیبل و استیکر' }
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

const filteredItems = computed(() => {
  return items.value.filter((it) => {
    if (it.division && it.division !== 'printing') return false
    if (activeCategory.value !== 'all' && it.category !== activeCategory.value) return false
    return true
  })
})

async function fetchProducts() {
  loading.value = true
  try {
    const res: any = await $fetch('/api/products?division=printing')
    items.value = res?.items || []
  } catch {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>
