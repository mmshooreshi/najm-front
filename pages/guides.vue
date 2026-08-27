<!-- pages/guides.vue -->
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

    <!-- Key Principles Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="(principle, idx) in uiContent.principles"
        :key="idx"
        class="relative bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-najmborder/40 space-y-3"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <!-- Card Action [+] / [-] -->
        <AdminArrayItemActions path="principles" :index="idx" />

        <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
          <Icon :name="principle.icon || 'mdi:palette-swatch-outline'" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-gray-900 text-d4 break-words" v-editable="`principles.${idx}.title`">
          {{ principle.title }}
        </h3>
        <p class="text-xs text-gray-600 leading-relaxed break-words" v-editable="`principles.${idx}.desc`">
          {{ principle.desc }}
        </p>
      </div>

      <AdminAddCardPlaceholder path="principles" label="افزودن اصل فنی جدید" />
    </div>

    <!-- Detailed Guides Breakdown -->
    <div class="space-y-6">
      <h2
        class="text-xl sm:text-2xl font-bold text-gray-900 text-d4 break-words"
        :class="isRTL ? 'text-right' : 'text-left'"
        v-editable="'guidesTitle'"
      >
        {{ uiContent.guidesTitle }}
      </h2>
      <div class="space-y-4">
        <div
          v-for="(guide, idx) in uiContent.guides"
          :key="guide.id || idx"
          class="relative bg-white rounded-3xl p-5 sm:p-8 shadow-xs border border-najmborder/40 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 hover:shadow-md transition-all duration-300"
          :class="isRTL ? 'text-right' : 'text-left'"
        >
          <!-- Card Action [+] / [-] -->
          <AdminArrayItemActions path="guides" :index="idx" />

          <div class="space-y-2 max-w-3xl">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-najmgrey text-gray-800 break-words" v-editable="`guides.${idx}.category`">
                {{ guide.category }}
              </span>
              <span class="text-xs text-gray-400 font-mono" v-editable="`guides.${idx}.readTime`">{{ guide.readTime }}</span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-gray-900 text-d4 break-words" v-editable="`guides.${idx}.title`">
              {{ guide.title }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed break-words" v-editable="`guides.${idx}.summary`">
              {{ guide.summary }}
            </p>
          </div>

          <div class="flex flex-row sm:flex-col items-center gap-2 flex-shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
            <NuxtLink
              :to="`/resources/${guide.fileSlug}`"
              class="px-5 py-2.5 rounded-xl bg-najmgrey hover:bg-najmgreen hover:text-white text-gray-800 text-xs font-bold text-center transition flex-1 sm:w-full whitespace-nowrap"
            >
              مطالعه / Read
            </NuxtLink>
            <a
              :href="guide.pdfUrl || '#'"
              download
              class="px-5 py-2.5 rounded-xl bg-najmgreen text-white hover:bg-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1 transition flex-1 sm:w-full shadow-xs whitespace-nowrap"
            >
              <Icon name="mdi:download" class="w-4 h-4" />
              <span>دانلود PDF</span>
            </a>
          </div>
        </div>

        <AdminAddCardPlaceholder path="guides" label="افزودن راهنمای فنی جدید" />
      </div>
    </div>

    <!-- Technical Support Contact -->
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

const { ui, allUi } = usePageUI('guides')
useAdminEditable('guides', allUi)

const fallbackGuides = {
  badge: 'راهنماهای فنی و استانداردهای چاپ',
  title: 'راهنمای آماده‌سازی فایل و اصول پیش از چاپ',
  description: 'دستورالعمل‌های استاندارد برای طراحان گرافیک و مدیران تولید جهت آماده‌سازی بی‌نقص فایل‌های چاپی، پروفایل رنگی، لبه برش و خروجی زینک CTP.',
  principles: [
    {
      icon: 'mdi:palette-swatch-outline',
      title: 'مد رنگی CMYK',
      desc: 'تمام فایل‌ها باید در مد CMYK خروجی گرفته شوند. فایل‌های RGB در چاپ افست دچار تغییر فاحش رنگ خواهند شد.'
    },
    {
      icon: 'mdi:ruler-square',
      title: 'لبه برش (Bleed ۳ تا ۵ میل)',
      desc: 'برای جلوگیری از ایجاد سفیدی لبه کار در هنگام برش و دایکات، پس‌زمینه‌ها باید حداقل ۳ تا ۵ میلیمتر خارج از خط تیغ امتداد یابند.'
    },
    {
      icon: 'mdi:image-filter-hdr',
      title: 'رزولوشن ۳۰۰DPI',
      desc: 'تصاویر و عکس‌های استفاده‌شده باید در اندازه واقعی با حداقل رزولوشن ۳۰۰ پیکسل بر اینچ ذخیره شوند.'
    },
    {
      icon: 'mdi:format-font',
      title: 'تبدیل فونت به منحنی (Curve)',
      desc: 'برای جلوگیری از به‌هم‌ریختگی قلم‌ها در لیتوگرافی، تمامی متون در ایلاستریتور و ایندیزاین باید Create Outlines شوند.'
    }
  ],
  guidesTitle: 'مجموعه مقالات و فایل‌های راهنمای کاربردی',
  guides: [
    {
      id: 1,
      category: 'رنگ و لیتوگرافی',
      readTime: '۵ دقیقه مطالعه',
      title: 'دستورالعمل کامل تنظیم رنگ مشکی پرکلاغی (Rich Black) در چاپ افست',
      summary: 'برای دستیابی به مشکی عمیق و یکدست بدون تداخل رنگی، از ترکیب C:60 M:40 Y:40 K:100 برای سطوح بزرگ و K:100 خالص برای متون ریز استفاده نمایید.',
      fileSlug: 'guide-cmyk-color-profile',
      pdfUrl: '#'
    },
    {
      id: 2,
      category: 'قالب و تیغ‌زنی',
      readTime: '۷ دقیقه مطالعه',
      title: 'استانداردهای ساخت خطوط تیغ، خط‌تا و برجسته‌سازی در ایلاستریتور',
      summary: 'نحوه تفکیک لایه‌های وکتور، اختصاص رنگ‌های اسپات به خطوط برش و خط‌تا و تنظیم Overprint روی لایه‌های تکمیلی.',
      fileSlug: 'template-tuck-end-box',
      pdfUrl: '#'
    },
    {
      id: 3,
      category: 'متریال و گرماژ',
      readTime: '۶ دقیقه مطالعه',
      title: 'راهنمای انتخاب گرماژ مناسب مقوا بر اساس ابعاد و وزن محصول',
      summary: 'بررسی مقاومت فشاری BCT و ECT در مقواهای ایندربرد، کرافت دوبلکس و فلوتینگ‌های E و B جهت حفاظت از محتویات بسته.',
      fileSlug: 'catalog-general-2026',
      pdfUrl: '#'
    }
  ],
  cta: {
    title: 'نیاز به بررسی فنی فایل طراحی خود دارید؟',
    description: 'کارشناسان واحد لیتوگرافی و پیش از چاپ نجم فایل شما را از نظر تفکیک رنگ، خطوط تیغ و گرماژ بررسی نموده و تاییدیه فنی ارائه می‌دهند.',
    button: 'ارسال فایل برای بررسی فنی'
  }
}

const uiContent = computed(() => {
  return {
    ...fallbackGuides,
    ...(ui.value || {})
  }
})
</script>
