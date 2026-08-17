<!-- pages/resources/index.vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <span class="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-najmgreen/10 text-najmgreen">
        مرکز منابع و راهنماهای فنی چاپ نجم
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
        کاتالوگ‌ها، قالب‌های تیغ و راهنماهای طراحی
      </h1>
      <p class="text-base text-gray-600 leading-relaxed">
        تمامی فایل‌های مورد نیاز طراحان، مدیران محصول و تولید، شامل استانداردهای رنگ، قالب‌های تیغ و کاتالوگ‌های جامع محصولات به صورت مستقیم قابل دانلود است.
      </p>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex justify-center overflow-x-auto gap-2 py-2">
      <button
        v-for="cat in categories"
        :key="cat.key"
        @click="activeCategory = cat.key"
        class="px-5 py-2 rounded-2xl text-xs font-semibold transition-all duration-200"
        :class="[
          activeCategory === cat.key
            ? 'bg-najmgreen text-white shadow-sm'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        ]"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Resources Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="item in filteredResources"
        :key="item.id"
        class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gray-100 text-gray-600">
              {{ item.categoryLabel }}
            </span>
            <span class="text-xs text-gray-400 font-mono ltr">{{ item.fileSize }} • {{ item.fileFormat }}</span>
          </div>

          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-najmgreen flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Icon :name="item.icon" class="w-6 h-6" />
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-najmgreen transition-colors">
            {{ item.title }}
          </h3>
          <p class="text-xs text-gray-600 leading-relaxed mb-6">
            {{ item.description }}
          </p>
        </div>

        <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
          <NuxtLink
            :to="`/resources/${item.slug}`"
            class="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold text-center transition"
          >
            مشاهده جزئیات
          </NuxtLink>
          <a
            :href="item.downloadUrl || '#'"
            download
            class="py-2.5 px-4 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Icon name="mdi:download" class="w-4 h-4" />
            دانلود
          </a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  name: 'منابع و کاتالوگ‌ها - چاپ نجم',
  layout: 'default'
})

const categories = [
  { key: 'all', label: 'همه منابع' },
  { key: 'catalogs', label: 'کاتالوگ‌ها' },
  { key: 'guides', label: 'راهنماهای فنی چاپ' },
  { key: 'templates', label: 'قالب‌های تیغ (Die-Cuts)' },
  { key: 'standards', label: 'استانداردها و گواهینامه‌ها' }
]

const activeCategory = ref('all')

const resources = [
  {
    id: 1,
    slug: 'catalog-general-2026',
    title: 'کاتالوگ جامع محصولات و خدمات چاپ نجم',
    category: 'catalogs',
    categoryLabel: 'کاتالوگ',
    description: 'معرفی خطوط تولید چاپ افست، انواع جعبه‌های مقوایی، هاردباکس، ساک‌های دستی و نمونه‌های تولیدی سال جاری.',
    fileFormat: 'PDF',
    fileSize: '14.2 MB',
    icon: 'mdi:book-open-page-variant-outline',
    downloadUrl: '#'
  },
  {
    id: 2,
    slug: 'catalog-luxury-packaging',
    title: 'کاتالوگ بسته‌بندی‌های لوکس و هاردباکس',
    category: 'catalogs',
    categoryLabel: 'کاتالوگ',
    description: 'نمونه ساختارهای ویژه جعبه‌های مگنتی، کشویی، روکش‌دار و جلوه‌های طلاکوب و یووی موضعی.',
    fileFormat: 'PDF',
    fileSize: '18.5 MB',
    icon: 'mdi:package-variant-closed',
    downloadUrl: '#'
  },
  {
    id: 3,
    slug: 'guide-cmyk-color-profile',
    title: 'راهنمای آماده‌سازی فایل و پروفایل رنگی CMYK',
    category: 'guides',
    categoryLabel: 'راهنمای فنی',
    description: 'دستورالعمل خروجی PDF/X-1a، تنظیم رزولوشن ۳۰۰DPI، درصد ترکیب رنگ مشکی پرکلاغی و Overprint.',
    fileFormat: 'PDF',
    fileSize: '3.8 MB',
    icon: 'mdi:palette-swatch-outline',
    downloadUrl: '#'
  },
  {
    id: 4,
    slug: 'guide-bleed-and-margins',
    title: 'راهنمای لبه برش (Bleed)، خط تا و محدوده امن',
    category: 'guides',
    categoryLabel: 'راهنمای فنی',
    description: 'استانداردهای تنظیم ۳ تا ۵ میلیمتر Bleed برای جعبه‌ها و بروشورها جهت جلوگیری از سفیدی لبه کار.',
    fileFormat: 'PDF',
    fileSize: '2.1 MB',
    icon: 'mdi:ruler-square',
    downloadUrl: '#'
  },
  {
    id: 5,
    slug: 'template-tuck-end-box',
    title: 'قالب تیغ استاندارد جعبه درب‌دار (Tuck-End)',
    category: 'templates',
    categoryLabel: 'قالب تیغ',
    description: 'فایل برداری وکتور خطوط تیغ، خط‌تا و زبانه چسب در فرمت‌های Adobe Illustrator و PDF.',
    fileFormat: 'AI / PDF',
    fileSize: '5.4 MB',
    icon: 'mdi:vector-square',
    downloadUrl: '#'
  },
  {
    id: 6,
    slug: 'template-auto-bottom-box',
    title: 'قالب تیغ جعبه قفل خودکار (Auto-Bottom)',
    category: 'templates',
    categoryLabel: 'قالب تیغ',
    description: 'ساختار استاندارد مناسب خطوط پرکنی سریع دارویی و بهداشتی با مقاومت کف بالا.',
    fileFormat: 'AI / PDF',
    fileSize: '6.1 MB',
    icon: 'mdi:cube-outline',
    downloadUrl: '#'
  },
  {
    id: 7,
    slug: 'standards-eco-inks',
    title: 'گواهی استفاده از مرکب‌های گیاهی و متریال بهداشتی',
    category: 'standards',
    categoryLabel: 'گواهینامه',
    description: 'تاییدیه‌های بهداشتی تماس غیرمستقیم با غذا و دارو و استفاده از مواد تجزیه‌پذیر.',
    fileFormat: 'PDF',
    fileSize: '1.9 MB',
    icon: 'mdi:certificate-outline',
    downloadUrl: '#'
  }
]

const filteredResources = computed(() => {
  if (activeCategory.value === 'all') return resources
  return resources.filter(r => r.category === activeCategory.value)
})
</script>