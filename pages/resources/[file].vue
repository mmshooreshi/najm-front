<!-- pages/resources/[file].vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
    <nav class="flex items-center gap-2 text-xs text-gray-500 mb-4">
      <NuxtLink to="/resources" class="hover:text-najmgreen">منابع و کاتالوگ‌ها</NuxtLink>
      <span>/</span>
      <span class="text-gray-800 font-semibold" v-editable="'title'">{{ currentResource.title }}</span>
    </nav>

    <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 space-y-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-najmgreen mb-2"
            v-editable="'categoryLabel'"
          >
            {{ currentResource.categoryLabel }}
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900" v-editable="'title'">
            {{ currentResource.title }}
          </h1>
        </div>
        <a
          :href="currentResource.downloadUrl || '#'"
          download
          class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition"
        >
          <Icon name="mdi:download" class="w-5 h-5" />
          <span>دانلود فایل ({{ currentResource.fileSize }})</span>
        </a>
      </div>

      <!-- Overview -->
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-900" v-editable="'overviewTitle'">
          {{ currentResource.overviewTitle || 'درباره این فایل' }}
        </h2>
        <p class="text-sm sm:text-base text-gray-700 leading-relaxed" v-editable="'description'">
          {{ currentResource.description }}
        </p>
      </div>

      <!-- File Specifications -->
      <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h3 class="text-sm font-bold text-gray-900 mb-4" v-editable="'specsTitle'">
          {{ currentResource.specsTitle || 'مشخصات و الزامات فنی' }}
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span class="block text-gray-500 mb-1">فرمت فایل:</span>
            <span class="font-bold text-gray-800" v-editable="'fileFormat'">{{ currentResource.fileFormat }}</span>
          </div>
          <div>
            <span class="block text-gray-500 mb-1">حجم فایل:</span>
            <span class="font-bold text-gray-800" v-editable="'fileSize'">{{ currentResource.fileSize }}</span>
          </div>
          <div>
            <span class="block text-gray-500 mb-1">سازگاری نرم‌افزاری:</span>
            <span class="font-bold text-gray-800" v-editable="'specs.software'">{{ currentResource.specs?.software || 'Adobe CC / Acrobat' }}</span>
          </div>
          <div>
            <span class="block text-gray-500 mb-1">آخرین بروزرسانی:</span>
            <span class="font-bold text-gray-800" v-editable="'specs.version'">{{ currentResource.specs?.version || '1404 / 2026' }}</span>
          </div>
        </div>
      </div>

      <!-- Guidelines checklist -->
      <div class="space-y-3" v-if="currentResource.guidelines?.length">
        <h3 class="text-sm font-bold text-gray-900" v-editable="'guidelinesTitle'">
          {{ currentResource.guidelinesTitle || 'نکات مهم قبل از ارسال فایل به چاپخانه:' }}
        </h3>
        <ul class="space-y-2 text-xs sm:text-sm text-gray-600 list-disc pr-5">
          <li
            v-for="(guide, i) in currentResource.guidelines"
            :key="i"
            v-editable="`guidelines.${i}`"
          >
            {{ guide }}
          </li>
        </ul>
      </div>

      <!-- Contact CTA -->
      <div class="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-xs text-gray-500" v-editable="'contactCta'">
          {{ currentResource.contactCta || 'نیاز به راهنمایی بیشتر یا طراحی قالب اختصاصی دارید؟' }}
        </span>
        <NuxtLink
          to="/contact"
          class="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition"
        >
          <span v-editable="'contactBtn'">{{ currentResource.contactBtn || 'تماس با واحد لیتوگرافی و طراحی' }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'

definePageMeta({
  name: 'جزئیات فایل راهنما - چاپ نجم',
  layout: 'default'
})

const route = useRoute()
const fileSlug = computed(() => (route.params.file as string) || '')
const pageSlug = computed(() => `resources-${fileSlug.value}`)

const { ui, allUi } = usePageUI(pageSlug.value)
useAdminEditable(pageSlug.value, allUi)

const fallbackResource = {
  title: 'راهنما و مشخصات فنی چاپ و قالب‌سازی',
  categoryLabel: 'مرکز دانلود',
  description: 'این سند حاوی استانداردهای فنی چاپ افست، دستورالعمل‌های آماده‌سازی خطوط تیغ و کنترل کیفیت خروجی است.',
  fileFormat: 'PDF / AI',
  fileSize: '5.2 MB',
  downloadUrl: '#',
  overviewTitle: 'درباره این فایل',
  specsTitle: 'مشخصات و الزامات فنی',
  specs: {
    software: 'Adobe CC / Acrobat',
    version: '1404 / 2026'
  },
  guidelinesTitle: 'نکات مهم قبل از ارسال فایل به چاپخانه:',
  guidelines: [
    'فونت‌های استفاده شده را حتماً به منحنی (Create Outlines / Convert to Curves) تبدیل کنید.',
    'تمامی تصاویر باید با مود رنگی CMYK و رزولوشن ۳۰۰DPI در فایل درج شده باشند.',
    'برای اقلام دارای قالب تیغ، لایه Die-Cut را با رنگ اسپات (Spot Color) مجزا و نامگذاری مشخص قرار دهید.'
  ],
  contactCta: 'نیاز به راهنمایی بیشتر یا طراحی قالب اختصاصی دارید؟',
  contactBtn: 'تماس با واحد لیتوگرافی و طراحی'
}

const currentResource = computed(() => {
  const dynamicUi = ui.value || {}
  if (dynamicUi && Object.keys(dynamicUi).length > 0 && dynamicUi.title) {
    return dynamicUi
  }
  return {
    ...fallbackResource,
    title: fileSlug.value.replace(/-/g, ' ') || fallbackResource.title
  }
})
</script>