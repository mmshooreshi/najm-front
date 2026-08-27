<!-- pages/resources/[slug].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen bg-najmback pb-28 text-gray-800">
    <!-- Header -->
    <header class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
        <span>/</span>
        <NuxtLink to="/resources" class="hover:text-najmgreen">منابع و قالب‌ها</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-bold text-d4 break-words" v-editable="'title'">{{ currentResource.title }}</span>
      </nav>

      <span
        class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen text-d4 break-words"
        v-editable="'categoryLabel'"
      >
        {{ currentResource.categoryLabel }}
      </span>

      <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight text-d4 break-words" v-editable="'title'">
        {{ currentResource.title }}
      </h1>

      <p class="text-xs sm:text-sm text-gray-600 leading-relaxed break-words" v-editable="'description'">
        {{ currentResource.description }}
      </p>

      <!-- Metadata Strip -->
      <div class="flex items-center gap-4 text-xs text-gray-500 border-y border-gray-200 py-3 flex-wrap">
        <span>فرمت: <span class="font-bold text-gray-800" v-editable="'fileFormat'">{{ currentResource.fileFormat }}</span></span>
        <span>•</span>
        <span>حجم فایل: <span class="font-bold text-gray-800" v-editable="'fileSize'">{{ currentResource.fileSize }}</span></span>
        <span>•</span>
        <span v-editable="'specs.version'">{{ currentResource.specs?.version || 'نسخه ۲۰۲۶' }}</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" :class="isRTL ? 'text-right' : 'text-left'">
      <!-- Direct Download Box -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-najmborder/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center flex-shrink-0">
            <Icon name="mdi:file-download-outline" class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 text-d4 break-words" v-editable="'downloadBoxTitle'">
              {{ currentResource.downloadBoxTitle || 'دانلود بسته کامل فایل فنی' }}
            </h3>
            <p class="text-xs text-gray-500 break-words" v-editable="'downloadBoxSubtitle'">
              {{ currentResource.downloadBoxSubtitle || 'شامل فایل‌های وکتور AI، PDF استاندارد چاپ و راهنمای راهبری' }}
            </p>
          </div>
        </div>

        <a
          :href="currentResource.downloadUrl || '#'"
          download
          class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs whitespace-nowrap text-d4"
        >
          <Icon name="mdi:download" class="w-4 h-4" />
          <span>دانلود مستقیم فایل ({{ currentResource.fileSize }})</span>
        </a>
      </div>

      <!-- Guidelines Details -->
      <div class="bg-white rounded-3xl p-6 sm:p-12 shadow-xs border border-najmborder/40 space-y-6 leading-relaxed text-sm sm:text-base text-gray-700">
        <h2 class="text-xl font-bold text-gray-900 text-d4 break-words" v-editable="'guidelinesTitle'">
          {{ currentResource.guidelinesTitle || 'راهنمای استفاده و ضوابط اجرایی' }}
        </h2>
        <ul class="space-y-3 text-xs sm:text-sm text-gray-600">
          <li
            v-for="(guide, i) in (currentResource.guidelines || defaultGuidelines)"
            :key="i"
            class="relative flex items-start gap-2 break-words group"
          >
            <!-- In-place Item Action [+] / [-] -->
            <AdminArrayItemActions path="guidelines" :index="i" />

            <span class="w-1.5 h-1.5 rounded-full bg-najmgreen mt-2 shrink-0"></span>
            <span class="flex-1" v-editable="`guidelines.${i}`">{{ guide }}</span>
          </li>
        </ul>

        <AdminAddCardPlaceholder path="guidelines" label="افزودن بند راهنمای جدید" customClass="min-h-[60px] p-2" />
      </div>

      <!-- Contact CTA -->
      <div class="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-xs text-gray-500 break-words" v-editable="'contactCta'">
          {{ currentResource.contactCta || 'نیاز به راهنمایی بیشتر یا طراحی قالب اختصاصی دارید؟' }}
        </span>
        <NuxtLink
          to="/contact"
          class="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition whitespace-nowrap"
        >
          <span v-editable="'contactBtn'">{{ currentResource.contactBtn || 'تماس با واحد لیتوگرافی و طراحی' }}</span>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')
const pageSlug = computed(() => `resources-${slug.value}`)

const { ui, allUi } = usePageUI(pageSlug.value)
useAdminEditable(pageSlug.value, allUi)

const defaultGuidelines = [
  'فایل‌های وکتور در فضای رنگی CMYK تنظیم شده‌اند؛ از تبدیل به RGB خودداری فرمایید.',
  'خطوط برش با رنگ اسپات DieCut و خطوط تا با رنگ Crease تفکیک شده و روی حالت Overprint قرار دارند.',
  'حداقل لبه برش (Bleed) در نظر گرفته شده ۳ میلیمتر از هر لبه بیرونی است.',
  'برای بررسی نهایی پیش از چاپ، فایل تکمیل‌شده را از طریق بخش استعلام برای کارشناسان لیتوگرافی ارسال نمایید.'
]

const fallbackResource = {
  title: 'راهنمای آماده‌سازی فایل و مشخصات فنی چاپ',
  categoryLabel: 'راهنمای فنی',
  description: 'دستورالعمل خروجی استاندارد PDF/X-1a، تنظیم رزولوشن ۳۰۰DPI، درصد ترکیب رنگ مشکی پرکلاغی و تنظیمات Overprint برای لیتوگرافی CTP.',
  fileFormat: 'PDF / AI Vector',
  fileSize: '4.8 MB',
  downloadUrl: '#',
  downloadBoxTitle: 'دانلود بسته کامل فایل فنی',
  downloadBoxSubtitle: 'شامل فایل‌های وکتور AI، PDF استاندارد چاپ و راهنمای راهبری',
  guidelinesTitle: 'راهنمای استفاده و ضوابط اجرایی',
  guidelines: defaultGuidelines,
  contactCta: 'نیاز به راهنمایی بیشتر یا طراحی قالب اختصاصی دارید؟',
  contactBtn: 'تماس با واحد لیتوگرافی و طراحی'
}

const currentResource = computed(() => {
  const dynamicUi = ui.value || {}
  if (dynamicUi && Object.keys(dynamicUi).length > 0 && dynamicUi.title) {
    return {
      ...fallbackResource,
      ...dynamicUi
    }
  }
  return {
    ...fallbackResource,
    title: slug.value.replace(/-/g, ' ') || fallbackResource.title
  }
})
</script>

