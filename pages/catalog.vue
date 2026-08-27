<!-- pages/catalog.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <span
        class="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4 break-words"
        v-editable="'badge'"
      >
        {{ uiContent.badge }}
      </span>
      <h1
        class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight text-d4 leading-tight break-words"
        v-editable="'title'"
      >
        {{ uiContent.title }}
      </h1>
      <p
        class="text-xs sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto break-words"
        v-editable="'description'"
      >
        {{ uiContent.description }}
      </p>
    </div>

    <!-- Featured Catalog Hero Card -->
    <div class="bg-white rounded-3xl p-5 sm:p-10 shadow-xs border border-najmborder/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div class="lg:col-span-5 rounded-2xl bg-najmgrey/60 border border-najmborder/40 p-6 flex flex-col items-center justify-center text-center space-y-4 relative group">
        <div class="w-44 sm:w-48 h-60 sm:h-64 rounded-xl bg-white shadow-md border border-gray-200 overflow-hidden flex flex-col justify-between p-4 group-hover:scale-105 transition-transform duration-300">
          <div class="space-y-1" :class="isRTL ? 'text-right' : 'text-left'">
            <span class="text-[10px] font-bold text-najmgreen" v-editable="'featured.tag'">{{ uiContent.featured.tag }}</span>
            <h3 class="text-xs font-extrabold text-gray-900 text-d4" v-editable="'featured.coverTitle'">{{ uiContent.featured.coverTitle }}</h3>
          </div>
          <div class="w-12 h-12 rounded-xl bg-najmgrey text-najmgreen flex items-center justify-center mx-auto">
            <Icon name="mdi:book-open-page-variant-outline" class="w-6 h-6" />
          </div>
          <div class="text-[9px] text-gray-400 font-mono">NAJM PACKAGING & PRINTING</div>
        </div>
        <span class="text-xs text-gray-500 font-mono break-words">
          {{ uiContent.featured.fileSize }} • {{ uiContent.featured.fileFormat }}
        </span>
      </div>

      <div class="lg:col-span-7 space-y-5" :class="isRTL ? 'text-right' : 'text-left'">
        <div>
          <span
            class="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-najmgrey text-gray-800 mb-2"
            v-editable="'featured.badge'"
          >
            {{ uiContent.featured.badge }}
          </span>
          <h2
            class="text-xl sm:text-2xl font-bold text-gray-900 text-d4 mb-2 leading-snug break-words"
            v-editable="'featured.title'"
          >
            {{ uiContent.featured.title }}
          </h2>
          <p
            class="text-xs sm:text-sm text-gray-600 leading-relaxed break-words"
            v-editable="'featured.description'"
          >
            {{ uiContent.featured.description }}
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
          <div class="p-3 bg-najmgrey/50 rounded-xl border border-najmborder/40">
            <span class="block text-gray-400 text-[10px]">صفحات / Pages:</span>
            <span class="font-bold text-gray-800 break-words" v-editable="'featured.pagesCount'">{{ uiContent.featured.pagesCount }}</span>
          </div>
          <div class="p-3 bg-najmgrey/50 rounded-xl border border-najmborder/40">
            <span class="block text-gray-400 text-[10px]">بازنگری / Edition:</span>
            <span class="font-bold text-gray-800 break-words" v-editable="'featured.lastUpdate'">{{ uiContent.featured.lastUpdate }}</span>
          </div>
          <div class="p-3 bg-najmgrey/50 rounded-xl border border-najmborder/40 col-span-2 sm:col-span-1">
            <span class="block text-gray-400 text-[10px]">وضوح / Res:</span>
            <span class="font-bold text-gray-800 break-words" v-editable="'featured.resolution'">{{ uiContent.featured.resolution }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            :href="uiContent.featured.downloadUrl || '#'"
            download
            class="flex-1 py-3 px-5 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition text-center"
          >
            <Icon name="mdi:download" class="w-4 h-4" />
            <span v-editable="'featured.downloadBtn'">{{ uiContent.featured.downloadBtn }}</span>
          </a>
          <NuxtLink
            to="/contact"
            class="py-3 px-5 rounded-2xl bg-najmgrey hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
          >
            <span v-editable="'featured.sampleBtn'">{{ uiContent.featured.sampleBtn }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Specialized Catalogs Grid -->
    <div class="space-y-6">
      <h2
        class="text-xl sm:text-2xl font-bold text-gray-900 text-d4 break-words"
        :class="isRTL ? 'text-right' : 'text-left'"
        v-editable="'gridTitle'"
      >
        {{ uiContent.gridTitle }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <div
          v-for="(cat, idx) in uiContent.catalogs"
          :key="cat.id || idx"
          class="relative bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
          :class="isRTL ? 'text-right' : 'text-left'"
        >
          <!-- In-place Card Array Actions (+ / -) -->
          <AdminArrayItemActions path="catalogs" :index="idx" />

          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-najmgrey text-gray-700 break-words" v-editable="`catalogs.${idx}.badge`">
                {{ cat.badge }}
              </span>
              <span class="text-xs text-gray-400 font-mono" v-editable="`catalogs.${idx}.size`">{{ cat.size }}</span>
            </div>

            <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-4 group-hover:scale-105 transition-transform" :class="isRTL ? 'mr-0' : 'ml-0'">
              <Icon :name="cat.icon || 'mdi:book-outline'" class="w-6 h-6" />
            </div>

            <h3 class="text-base font-bold text-gray-900 mb-2 group-hover:text-najmgreen transition-colors text-d4 break-words" v-editable="`catalogs.${idx}.title`">
              {{ cat.title }}
            </h3>
            <p class="text-xs text-gray-600 leading-relaxed mb-6 break-words" v-editable="`catalogs.${idx}.desc`">
              {{ cat.desc }}
            </p>
          </div>

          <div class="pt-4 border-t border-gray-100 flex items-center gap-3">
            <a
              :href="cat.downloadUrl || '#'"
              download
              class="w-full py-2.5 rounded-xl bg-najmgrey hover:bg-najmgreen hover:text-white text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Icon name="mdi:download" class="w-3.5 h-3.5" />
              <span>{{ isRTL ? 'دانلود نسخه PDF' : 'Download PDF' }}</span>
            </a>
          </div>
        </div>

        <!-- Add New Catalog Card Placeholder -->
        <AdminAddCardPlaceholder path="catalogs" :label="isRTL ? 'افزودن کاتالوگ جدید' : 'Add New Catalog'" />
      </div>
    </div>

    <!-- Request Sample Box CTA -->
    <div class="bg-najmgreen text-white rounded-3xl p-6 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
      <div class="space-y-2 max-w-xl" :class="isRTL ? 'text-right' : 'text-left'">
        <h3 class="text-xl sm:text-2xl font-bold text-d4 break-words" v-editable="'cta.title'">
          {{ uiContent.cta.title }}
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed break-words" v-editable="'cta.description'">
          {{ uiContent.cta.description }}
        </p>
      </div>
      <NuxtLink
        to="/contact"
        class="px-7 py-3 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition shadow-xs whitespace-nowrap"
      >
        <span v-editable="'cta.button'">{{ uiContent.cta.button }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const { ui, allUi } = usePageUI('catalog')
useAdminEditable('catalog', allUi)

const fallbackCatalog = {
  badge: 'کاتالوگ و نمونه‌کارهای رسمی',
  title: 'کاتالوگ جامع محصولات چاپ و بسته‌بندی نجم',
  description: 'مشاهده و دریافت نسخه دیجیتال (PDF) تمامی لاین‌های تولیدی، جعبه‌های دارویی، هاردباکس‌های لوکس، ساک‌های دستی و نمونه‌های چاپ افست.',
  featured: {
    badge: 'مجموعه کامل ۲۰۲۶',
    tag: 'نسخه ۲۰۲۶',
    coverTitle: 'کاتالوگ جامع چاپ نجم',
    title: 'کاتالوگ جامع خطوط تولید و مشخصات متریال',
    description: 'این کاتالوگ شامل راهنمای جامع انتخاب گرماژ مقوا، مقایسه خدمات تکمیلی و نمونه‌های اجرا شده جعبه‌های دارویی، غذایی و بهداشتی است.',
    fileSize: '۱۴.۲ مگابایت',
    fileFormat: 'PDF',
    pagesCount: '۴۸ صفحه تمام‌رنگ',
    lastUpdate: 'بهار ۱۴۰۵',
    resolution: '300 DPI High-Res',
    downloadBtn: 'دانلود مستقیم فایل کاتالوگ (PDF)',
    sampleBtn: 'درخواست نمونه فیزیکی (Sample Kit)',
    downloadUrl: '#'
  },
  gridTitle: 'کاتالوگ‌های تخصصی دسته‌بندی‌ها',
  catalogs: [
    {
      id: 1,
      badge: 'بسته‌بندی سخت',
      title: 'کاتالوگ هاردباکس و بسته‌بندی لوکس',
      desc: 'نمونه ساختارهای مگنتی، کشویی، روکش‌های مخمل و جلوه‌های طلاکوب اختصاصی مناسب برندهای لوکس.',
      size: '۱۸.۵ مگابایت',
      icon: 'mdi:package-variant-closed',
      downloadUrl: '#'
    },
    {
      id: 2,
      badge: 'صنایع سلامت',
      title: 'کاتالوگ جعبه‌های دارویی و بهداشتی',
      desc: 'استانداردهای مقوای ایندربرد بهداشتی، خطوط بریل (Braille) و سیستم‌های کنترل اصالت محصول.',
      size: '۹.۴ مگابایت',
      icon: 'mdi:medical-bag',
      downloadUrl: '#'
    },
    {
      id: 3,
      badge: 'تبلیغات و فروشگاه',
      title: 'کاتالوگ ساک‌های دستی و پاکت کرافت',
      desc: 'انواع ساک‌های خرید گلاسه و کرافت، بندهای فانتزی و تحمل وزن تا ۵ کیلوگرم ویژه فروشگاه‌ها.',
      size: '۶.۸ مگابایت',
      icon: 'mdi:shopping-outline',
      downloadUrl: '#'
    }
  ],
  cta: {
    title: 'درخواست سمپل‌باکس و کیت نمونه‌های فیزیکی',
    description: 'برای لمس مستقیم بافت مقواها، تست پوشش‌های سلفونی و بررسی نمونه تیغ‌زنی‌ها، کیت نمونه رایگان ما را برای سازمان خود سفارش دهید.',
    button: 'سفارش کیت نمونه فیزیکی'
  }
}

const uiContent = computed(() => {
  return {
    ...fallbackCatalog,
    ...(ui.value || {})
  }
})
</script>
