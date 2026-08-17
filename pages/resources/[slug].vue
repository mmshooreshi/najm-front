<!-- pages/resources/[slug].vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-najmback pb-28 text-gray-800">
    <!-- Header -->
    <header class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 text-right">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-gray-500">
        <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
        <span>/</span>
        <NuxtLink to="/resources" class="hover:text-najmgreen">منابع و قالب‌ها</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-bold text-d4">{{ currentResource.title }}</span>
      </nav>

      <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen text-d4">
        {{ currentResource.categoryLabel }}
      </span>

      <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight text-d4">
        {{ currentResource.title }}
      </h1>

      <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
        {{ currentResource.description }}
      </p>

      <!-- Metadata Strip -->
      <div class="flex items-center gap-4 text-xs text-gray-500 border-y border-gray-200 py-3 font-mono">
        <span>فرمت: {{ currentResource.fileFormat }}</span>
        <span>•</span>
        <span>حجم فایل: {{ currentResource.fileSize }}</span>
        <span>•</span>
        <span>نسخه ۲۰۲۶</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <!-- Direct Download Box -->
      <div class="bg-white rounded-3xl p-8 shadow-xs border border-najmborder/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-right">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center flex-shrink-0">
            <Icon name="mdi:file-download-outline" class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 text-d4">دانلود بسته کامل فایل فنی</h3>
            <p class="text-xs text-gray-500">شامل فایل‌های وکتور AI، PDF استاندارد چاپ و راهنمای راهبری</p>
          </div>
        </div>

        <a
          :href="currentResource.downloadUrl || '#'"
          download
          class="px-8 py-3.5 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition shadow-xs whitespace-nowrap text-d4"
        >
          <Icon name="mdi:download" class="w-4 h-4" />
          <span>دانلود مستقیم فایل</span>
        </a>
      </div>

      <!-- Guidelines Details -->
      <div class="bg-white rounded-3xl p-6 sm:p-12 shadow-xs border border-najmborder/40 space-y-6 text-right leading-relaxed text-sm sm:text-base text-gray-700">
        <h2 class="text-xl font-bold text-gray-900 text-d4">راهنمای استفاده و ضوابط اجرایی</h2>
        <ul class="space-y-3 text-xs sm:text-sm text-gray-600 list-disc list-inside">
          <li>فایل‌های وکتور در فضای رنگی CMYK تنظیم شده‌اند؛ از تبدیل به RGB خودداری فرمایید.</li>
          <li>خطوط برش با رنگ اسپات DieCut و خطوط تا با رنگ Crease تفکیک شده و روی حالت Overprint قرار دارند.</li>
          <li>حداقل لبه برش (Bleed) در نظر گرفته شده ۳ میلیمتر از هر لبه بیرونی است.</li>
          <li>برای بررسی نهایی پیش از چاپ، فایل تکمیل‌شده را از طریق بخش استعلام برای کارشناسان لیتوگرافی ارسال نمایید.</li>
        </ul>
      </div>

      <!-- Related Resources Link -->
      <div class="flex items-center justify-between text-xs font-bold text-najmgreen text-d4 pt-4">
        <NuxtLink to="/guides" class="hover:underline flex items-center gap-1">
          <Icon name="mdi:arrow-right" class="w-4 h-4" />
          <span>مشاهده همه راهنماهای فنی</span>
        </NuxtLink>
        <NuxtLink to="/catalog" class="hover:underline flex items-center gap-1">
          <span>دانلود کاتالوگ جامع محصولات</span>
          <Icon name="mdi:arrow-left" class="w-4 h-4" />
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  name: 'جزئیات منبع فنی - چاپ نجم',
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')

const currentResource = computed(() => {
  return {
    title: 'راهنمای آماده‌سازی فایل و پروفایل رنگی CMYK در چاپ افست',
    categoryLabel: 'راهنمای فنی چاپ',
    description: 'دستورالعمل خروجی استاندارد PDF/X-1a، تنظیم رزولوشن ۳۰۰DPI، درصد ترکیب رنگ مشکی پرکلاغی و تنظیمات Overprint برای لیتوگرافی CTP.',
    fileFormat: 'PDF / AI Vector',
    fileSize: '4.8 MB',
    downloadUrl: '#'
  }
})
</script>
