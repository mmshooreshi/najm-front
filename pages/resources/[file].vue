<!-- pages/resources/[file].vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
    <nav class="flex items-center gap-2 text-xs text-gray-500 mb-4">
      <NuxtLink to="/resources" class="hover:text-najmgreen">منابع و کاتالوگ‌ها</NuxtLink>
      <span>/</span>
      <span class="text-gray-800 font-semibold">{{ currentResource.title }}</span>
    </nav>

    <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 space-y-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-najmgreen mb-2">
            {{ currentResource.categoryLabel }}
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {{ currentResource.title }}
          </h1>
        </div>
        <a
          :href="currentResource.downloadUrl || '#'"
          download
          class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Icon name="mdi:download" class="w-5 h-5" />
          دانلود فایل ({{ currentResource.fileSize }})
        </a>
      </div>

      <!-- Overview -->
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-900">درباره این فایل</h2>
        <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
          {{ currentResource.description }}
        </p>
      </div>

      <!-- File Specifications -->
      <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h3 class="text-sm font-bold text-gray-900 mb-4">مشخصات و الزامات فنی</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span class="block text-gray-500 mb-1">فرمت فایل:</span>
            <span class="font-bold text-gray-800 font-mono">{{ currentResource.fileFormat }}</span>
          </div>
          <div>
            <span class="block text-gray-500 mb-1">حجم فایل:</span>
            <span class="font-bold text-gray-800 font-mono">{{ currentResource.fileSize }}</span>
          </div>
          <div>
            <span class="block text-gray-500 mb-1">سازگاری نرم‌افزاری:</span>
            <span class="font-bold text-gray-800">Adobe CC / Acrobat</span>
          </div>
          <div>
            <span class="block text-gray-500 mb-1">آخرین بروزرسانی:</span>
            <span class="font-bold text-gray-800 font-mono">2026 / 1404</span>
          </div>
        </div>
      </div>

      <!-- Guidelines checklist -->
      <div class="space-y-3">
        <h3 class="text-sm font-bold text-gray-900">نکات مهم قبل از ارسال فایل به چاپخانه:</h3>
        <ul class="space-y-2 text-xs sm:text-sm text-gray-600 list-disc pr-5">
          <li>فونت‌های استفاده شده را حتماً به منحنی (Create Outlines / Convert to Curves) تبدیل کنید.</li>
          <li>تمامی تصاویر باید با مود رنگی CMYK و رزولوشن ۳۰۰DPI در فایل درج شده باشند.</li>
          <li>برای اقلام دارای قالب تیغ، لایه Die-Cut را با رنگ اسپات (Spot Color) مجزا و نامگذاری مشخص قرار دهید.</li>
        </ul>
      </div>

      <!-- Contact CTA -->
      <div class="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-xs text-gray-500">نیاز به راهنمایی بیشتر یا طراحی قالب اختصاصی دارید؟</span>
        <NuxtLink
          to="/contact"
          class="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition"
        >
          تماس با واحد لیتوگرافی و طراحی
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  name: 'جزئیات فایل راهنما - چاپ نجم',
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => (route.params.file as string) || '')

const fallbackResource = {
  title: 'راهنما و مشخصات فنی چاپ و قالب‌سازی',
  categoryLabel: 'مرکز دانلود',
  description: 'این سند حاوی استانداردهای فنی چاپ افست، دستورالعمل‌های آماده‌سازی خطوط تیغ و کنترل کیفیت خروجی است.',
  fileFormat: 'PDF / AI',
  fileSize: '5.2 MB',
  downloadUrl: '#'
}

const resourcesMap: Record<string, typeof fallbackResource> = {
  'catalog-general-2026': {
    title: 'کاتالوگ جامع محصولات و خدمات چاپ نجم',
    categoryLabel: 'کاتالوگ',
    description: 'معرفی جامع خطوط تولید چاپ افست، انواع جعبه‌های مقوایی، هاردباکس، ساک‌های دستی و نمونه‌های تولیدی سال جاری با تصاویر و توضیحات کامل.',
    fileFormat: 'PDF',
    fileSize: '14.2 MB',
    downloadUrl: '#'
  },
  'catalog-luxury-packaging': {
    title: 'کاتالوگ بسته‌بندی‌های لوکس و هاردباکس',
    categoryLabel: 'کاتالوگ',
    description: 'نمونه ساختارهای ویژه جعبه‌های مگنتی، کشویی، روکش‌دار و جلوه‌های طلاکوب و یووی موضعی مناسب برندهای لوکس.',
    fileFormat: 'PDF',
    fileSize: '18.5 MB',
    downloadUrl: '#'
  },
  'guide-cmyk-color-profile': {
    title: 'راهنمای آماده‌سازی فایل و پروفایل رنگی CMYK',
    categoryLabel: 'راهنمای فنی',
    description: 'دستورالعمل خروجی استاندارد PDF/X-1a، تنظیم رزولوشن ۳۰۰DPI، درصد ترکیب رنگ مشکی پرکلاغی و نکات Overprint.',
    fileFormat: 'PDF',
    fileSize: '3.8 MB',
    downloadUrl: '#'
  },
  'template-tuck-end-box': {
    title: 'قالب تیغ استاندارد جعبه درب‌دار (Tuck-End)',
    categoryLabel: 'قالب تیغ',
    description: 'فایل برداری وکتور خطوط تیغ، خط‌تا و زبانه چسب در فرمت‌های Adobe Illustrator و PDF آماده جایگذاری طرح.',
    fileFormat: 'AI / PDF',
    fileSize: '5.4 MB',
    downloadUrl: '#'
  }
}

const currentResource = computed(() => {
  return resourcesMap[slug.value] || {
    ...fallbackResource,
    title: slug.value.replace(/-/g, ' ') || fallbackResource.title
  }
})
</script>