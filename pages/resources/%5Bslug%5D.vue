<!-- pages/resources/[slug].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen bg-najmback pb-28 text-gray-800 select-none font-sans">
    <!-- Header -->
    <header class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <NuxtLink to="/" class="hover:text-najmgreen transition">{{ isRTL ? 'خانه' : 'Home' }}</NuxtLink>
        <span>/</span>
        <NuxtLink to="/resources" class="hover:text-najmgreen transition">{{ isRTL ? 'منابع و قالب‌ها' : 'Resources & Guides' }}</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-bold font-d4 break-words">{{ currentTitle }}</span>
      </nav>

      <span
        class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen font-d4 border border-najmgreen/20 break-words"
      >
        {{ currentCategory }}
      </span>

      <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight font-d4 break-words">
        {{ currentTitle }}
      </h1>

      <p class="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
        {{ currentDescription }}
      </p>

      <!-- Metadata Strip -->
      <div class="flex items-center gap-4 text-xs text-gray-500 border-y border-gray-200 py-3 flex-wrap">
        <span>{{ isRTL ? 'فرمت:' : 'Format:' }} <span class="font-bold text-gray-800 font-mono">{{ resourceData.fileFormat }}</span></span>
        <span>•</span>
        <span>{{ isRTL ? 'حجم فایل:' : 'File Size:' }} <span class="font-bold text-gray-800 font-mono">{{ resourceData.fileSize }}</span></span>
        <span>•</span>
        <span>{{ isRTL ? 'استاندارد لیتوگرافی ۲۰۲۶' : 'Lithography Standard 2026' }}</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" :class="isRTL ? 'text-right' : 'text-left'">
      <!-- Direct Download Box -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-najmgreen flex items-center justify-center flex-shrink-0">
            <Icon name="mdi:file-download-outline" class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 font-d4 break-words">
              {{ isRTL ? 'دانلود بسته کامل فایل فنی' : 'Download Complete Technical Package' }}
            </h3>
            <p class="text-xs text-gray-500 break-words mt-0.5">
              {{ isRTL ? 'شامل فایل‌های وکتور AI، PDF استاندارد چاپ و راهنمای خطوط تیغ' : 'Includes vector AI, print-ready PDF, and dieline tolerances' }}
            </p>
          </div>
        </div>

        <a
          :href="resourceData.downloadUrl || '#'"
          download
          class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-najmgreen hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs whitespace-nowrap font-d4 cursor-pointer"
        >
          <Icon name="mdi:download" class="w-4 h-4" />
          <span>{{ isRTL ? `دانلود مستقیم فایل (${resourceData.fileSize})` : `Direct Download (${resourceData.fileSize})` }}</span>
        </a>
      </div>

      <!-- Guidelines & Technical Content -->
      <div class="bg-white rounded-3xl p-6 sm:p-12 shadow-xs border border-gray-100 space-y-6 leading-relaxed text-sm sm:text-base text-gray-700">
        <h2 class="text-xl font-bold text-gray-900 font-d4 break-words">
          {{ isRTL ? 'دستورالعمل‌های فنی و ضوابط اجرایی' : 'Usage Guidelines & Technical Guidelines' }}
        </h2>

        <div v-if="currentContent" class="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {{ currentContent }}
        </div>

        <ul class="space-y-3 text-xs sm:text-sm text-gray-600 pt-2 border-t border-gray-100">
          <li
            v-for="(guide, i) in defaultGuidelines"
            :key="i"
            class="flex items-start gap-2.5 break-words"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-najmgreen mt-2 shrink-0"></span>
            <span class="flex-1">{{ guide }}</span>
          </li>
        </ul>
      </div>

      <!-- Contact CTA -->
      <div class="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-xs text-gray-500 break-words">
          {{ isRTL ? 'نیاز به راهنمایی بیشتر یا طراحی قالب اختصاصی دارید؟' : 'Need custom dieline engineering or artwork assistance?' }}
        </span>
        <NuxtLink
          to="/contact"
          class="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition whitespace-nowrap font-d4"
        >
          <span>{{ isRTL ? 'تماس با واحد لیتوگرافی و طراحی' : 'Contact Pre-Press Engineering' }}</span>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')

const activeLang = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  return (l === 'en' || l === 'ar' ? l : 'fa') as 'fa' | 'en' | 'ar'
})

const defaultGuidelines = computed(() => {
  if (activeLang.value === 'en') {
    return [
      'All vector dielines are defined in CMYK color mode; please do not convert to RGB.',
      'Die-cut lines are specified as spot color "DieCut" and crease lines as "Crease" with Overprint enabled.',
      'Maintain at least 3mm to 5mm bleed margin beyond the outer cut border.',
      'For pre-flight verification, submit your completed artwork to our pre-press team for complimentary proofing.'
    ]
  }
  if (activeLang.value === 'ar') {
    return [
      'تم تصميم قوالب الدايكات الفيكتور بنمط ألوان CMYK؛ يرجى عدم التحويل إلى RGB.',
      'تم تمييز خطوط القص بلون سبوت خاص DieCut وخطوط الطي بلون Crease مع تفعيل Overprint.',
      'يجب مراعاة هوامش أمان وزيادة قص (Bleed) بمقدار ۳ إلى ٥ مم من الحواف الخارجية.',
      'للفحص الفني النهائي، أرسل ملفك لفريق الليثوغرافيا للحصول على الموافقة الفنية مجاناً.'
    ]
  }
  return [
    'فایل‌های وکتور در فضای رنگی CMYK تنظیم شده‌اند؛ از تبدیل به RGB خودداری فرمایید.',
    'خطوط برش با رنگ اسپات DieCut و خطوط تا با رنگ Crease تفکیک شده و روی حالت Overprint قرار دارند.',
    'حداقل لبه برش (Bleed) در نظر گرفته شده ۳ تا ۵ میلیمتر از هر لبه بیرونی است.',
    'برای بررسی نهایی پیش از چاپ، فایل تکمیل‌شده را از طریق بخش استعلام برای کارشناسان لیتوگرافی ارسال نمایید.'
  ]
})

const resourceData = ref<any>({
  title: 'راهنمای آماده‌سازی فایل و مشخصات فنی چاپ',
  categoryLabel: 'راهنمای فنی',
  description: 'دستورالعمل خروجی استاندارد PDF/X-1a، تنظیم رزولوشن ۳۰۰DPI، درصد ترکیب رنگ مشکی پرکلاغی و تنظیمات Overprint برای لیتوگرافی CTP.',
  fileFormat: 'PDF / AI',
  fileSize: '4.8 MB',
  downloadUrl: '/images/products/1.png',
  locales: {
    fa: { title: 'راهنمای آماده‌سازی فایل و مشخصات فنی چاپ', categoryLabel: 'راهنمای فنی', description: 'دستورالعمل خروجی استاندارد PDF/X-1a و خطوط تیغ.', content: 'دستورالعمل کامل فنی برای چاپ بدون نقص.' },
    en: { title: 'Artwork Preparation Guide & Pre-Press Standards', categoryLabel: 'Technical Guide', description: 'PDF/X-1a output instructions and dieline setup.', content: 'Complete technical instructions for packaging designers.' },
    ar: { title: 'دليل إعداد ملفات التصميم وقواعد ما قبل الطباعة', categoryLabel: 'دليل فني', description: 'إرشادات تصدير ملفات PDF/X-1a وضبط قوالب الدايكات.', content: 'إرشادات فنية كاملة لتصميم عبوات التغليف الفاخرة.' }
  }
})

const currentTitle = computed(() => {
  return resourceData.value.locales?.[activeLang.value]?.title || resourceData.value.title || slug.value.replace(/-/g, ' ')
})

const currentCategory = computed(() => {
  return resourceData.value.locales?.[activeLang.value]?.categoryLabel || resourceData.value.categoryLabel || 'راهنمای فنی'
})

const currentDescription = computed(() => {
  return resourceData.value.locales?.[activeLang.value]?.description || resourceData.value.description || ''
})

const currentContent = computed(() => {
  return resourceData.value.locales?.[activeLang.value]?.content || resourceData.value.content || ''
})

async function fetchResource() {
  try {
    const res: any = await $fetch(`/api/resources/${slug.value}`)
    if (res?.item) {
      resourceData.value = res.item
    }
  } catch {}
}

onMounted(() => {
  fetchResource()
})
</script>
