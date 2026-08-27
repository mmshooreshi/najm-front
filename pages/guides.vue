<!-- pages/guides.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12 select-none font-sans">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <span
        class="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 font-d4 break-words"
        v-editable="'badge'"
      >
        {{ localizedData.badge }}
      </span>
      <h1
        class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-d4 leading-tight break-words"
        v-editable="'title'"
      >
        {{ localizedData.title }}
      </h1>
      <p
        class="text-xs sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto break-words"
        v-editable="'description'"
      >
        {{ localizedData.description }}
      </p>
    </div>

    <!-- Key Principles Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="(principle, idx) in localizedData.principles"
        :key="idx"
        class="relative bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-100 space-y-3 hover:shadow-md transition-shadow"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-najmgreen flex items-center justify-center">
          <Icon :name="principle.icon || 'mdi:palette-swatch-outline'" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-gray-900 font-d4 break-words" v-editable="`principles.${idx}.title`">
          {{ principle.title }}
        </h3>
        <p class="text-xs text-gray-600 leading-relaxed break-words" v-editable="`principles.${idx}.desc`">
          {{ principle.desc }}
        </p>
      </div>
    </div>

    <!-- Detailed Guides Breakdown -->
    <div class="space-y-6">
      <h2
        class="text-xl sm:text-2xl font-bold text-gray-900 font-d4 break-words"
        :class="isRTL ? 'text-right' : 'text-left'"
        v-editable="'guidesTitle'"
      >
        {{ localizedData.guidesTitle }}
      </h2>

      <div class="space-y-4">
        <div
          v-for="(guide, idx) in localizedData.guides"
          :key="guide.id || idx"
          class="relative bg-white rounded-3xl p-5 sm:p-8 shadow-xs border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 hover:shadow-md transition-all duration-300 group"
          :class="isRTL ? 'text-right' : 'text-left'"
        >
          <div class="space-y-2 max-w-3xl">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-najmgreen font-d4 border border-emerald-500/20 break-words" v-editable="`guides.${idx}.category`">
                {{ guide.category }}
              </span>
              <span class="text-xs text-gray-400 font-mono" v-editable="`guides.${idx}.readTime`">{{ guide.readTime }}</span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-gray-900 font-d4 break-words group-hover:text-najmgreen transition-colors" v-editable="`guides.${idx}.title`">
              {{ guide.title }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed break-words" v-editable="`guides.${idx}.summary`">
              {{ guide.summary }}
            </p>
          </div>

          <div class="flex flex-row sm:flex-col items-center gap-2 flex-shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
            <NuxtLink
              :to="`/resources/${guide.fileSlug}`"
              class="px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-bold text-center transition flex-1 sm:w-full whitespace-nowrap font-d4"
            >
              {{ isRTL ? 'مطالعه مقاله' : 'Read Guide' }}
            </NuxtLink>
            <a
              :href="guide.pdfUrl || '#'"
              download
              class="px-5 py-2.5 rounded-xl bg-najmgreen text-white hover:bg-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-1 transition flex-1 sm:w-full shadow-xs whitespace-nowrap font-d4 cursor-pointer"
            >
              <Icon name="mdi:download" class="w-4 h-4" />
              <span>{{ isRTL ? 'دانلود PDF' : 'Download PDF' }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Technical Support Contact -->
    <div class="bg-najmgreen text-white rounded-3xl p-6 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
      <div class="space-y-2 max-w-xl" :class="isRTL ? 'text-right' : 'text-left'">
        <h3 class="text-xl sm:text-2xl font-bold font-d4 break-words" v-editable="'cta.title'">
          {{ localizedData.cta.title }}
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed break-words" v-editable="'cta.description'">
          {{ localizedData.cta.description }}
        </p>
      </div>
      <NuxtLink
        to="/contact"
        class="px-7 py-3 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition shadow-xs whitespace-nowrap font-d4"
      >
        <span v-editable="'cta.button'">{{ localizedData.cta.button }}</span>
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

const activeLang = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  return (l === 'en' || l === 'ar' ? l : 'fa') as 'fa' | 'en' | 'ar'
})

const dictionaries: Record<'fa' | 'en' | 'ar', any> = {
  fa: {
    badge: 'راهنماهای فنی و استانداردهای چاپ',
    title: 'راهنمای آماده‌سازی فایل و اصول پیش از چاپ',
    description: 'دستورالعمل‌های استاندارد برای طراحان گرافیک و مدیران تولید جهت آماده‌سازی بی‌نقص فایل‌های چاپی، پروفایل رنگی، لبه برش و خروجی زینک CTP.',
    principles: [
      { icon: 'mdi:palette-swatch-outline', title: 'مد رنگی CMYK', desc: 'تمام فایل‌ها باید در مد CMYK خروجی گرفته شوند. فایل‌های RGB در چاپ افست دچار تغییر فاحش رنگ خواهند شد.' },
      { icon: 'mdi:ruler-square', title: 'لبه برش (Bleed ۳ تا ۵ میل)', desc: 'برای جلوگیری از ایجاد سفیدی لبه کار در هنگام برش و دایکات، پس‌زمینه‌ها باید حداقل ۳ تا ۵ میلیمتر خارج از خط تیغ امتداد یابند.' },
      { icon: 'mdi:image-filter-hdr', title: 'رزولوشن ۳۰۰DPI', desc: 'تصاویر و عکس‌های استفاده‌شده باید در اندازه واقعی با حداقل رزولوشن ۳۰۰ پیکسل بر اینچ ذخیره شوند.' },
      { icon: 'mdi:format-font', title: 'تبدیل فونت به منحنی (Curve)', desc: 'برای جلوگیری از به‌هم‌ریختگی قلم‌ها در لیتوگرافی، تمامی متون در ایلاستریتور و ایندیزاین باید Create Outlines شوند.' }
    ],
    guidesTitle: 'مجموعه مقالات و فایل‌های راهنمای کاربردی',
    guides: [
      { id: 1, category: 'رنگ و لیتوگرافی', readTime: '۵ دقیقه مطالعه', title: 'دستورالعمل کامل تنظیم رنگ مشکی پرکلاغی (Rich Black) در چاپ افست', summary: 'برای دستیابی به مشکی عمیق و یکدست بدون تداخل رنگی، از ترکیب C:60 M:40 Y:40 K:100 برای سطوح بزرگ و K:100 خالص برای متون ریز استفاده نمایید.', fileSlug: 'guide-cmyk-color-profile', pdfUrl: '#' },
      { id: 2, category: 'قالب و تیغ دایکات', readTime: '۴ دقیقه مطالعه', title: 'استانداردهای تنظیم خط تا، خط برش و زبانه چسب در جعبه‌های دارویی', summary: 'خطوط تا باید با پنتون اختصاصی و لایه مجزا تعریف شده و حداقل فاصله زبانه چسب ۱۲ میلی‌متر در نظر گرفته شود.', fileSlug: 'guide-bleed-and-margins', pdfUrl: '#' }
    ],
    cta: {
      title: 'نیاز به بررسی تخصصی فایل قبل از چاپ دارید؟',
      description: 'کارشناسان فنی پیش از چاپ مجتمع نجم، فایل‌های طراحی شما را به صورت رایگان بررسی و گزارش خطای تفکیک رنگ و قالب تیغ را صادر می‌کنند.',
      button: 'درخواست بررسی رایگان فایل'
    }
  },
  en: {
    badge: 'Technical Pre-Press Guidelines',
    title: 'Artwork Preparation & File Optimization Guide',
    description: 'Industry-standard guidelines for packaging designers to prepare flawless artwork, CMYK color profiles, bleeds, and CTP lithography plates.',
    principles: [
      { icon: 'mdi:palette-swatch-outline', title: 'CMYK Color Mode', desc: 'All artworks must be created in CMYK mode. RGB colors will experience dramatic shifts when printed on offset presses.' },
      { icon: 'mdi:ruler-square', title: 'Bleed Margins (3-5mm)', desc: 'Extend all background graphics at least 3mm to 5mm beyond the final trim line to prevent unprinted white edges.' },
      { icon: 'mdi:image-filter-hdr', title: '300 DPI Resolution', desc: 'Ensure all raster images and photos are linked at 100% scale with a minimum resolution of 300 pixels per inch.' },
      { icon: 'mdi:format-font', title: 'Convert Fonts to Outlines', desc: 'Convert all typography to vector curves/outlines in Illustrator and InDesign to prevent missing font errors.' }
    ],
    guidesTitle: 'Technical Articles & Step-by-Step Guides',
    guides: [
      { id: 1, category: 'Color & CTP', readTime: '5 min read', title: 'Rich Black Formula Setup for Large Solid Backgrounds', summary: 'Use C:60 M:40 Y:40 K:100 for deep uniform black coverage on paperboard, and pure K:100 for fine body copy.', fileSlug: 'guide-cmyk-color-profile', pdfUrl: '#' },
      { id: 2, category: 'Dielines & Die-Cut', readTime: '4 min read', title: 'Crease Lines, Die-Cut & Glue Flap Specifications', summary: 'Define crease and cut lines on separate spot-color layers with minimum 12mm glue flap allowances.', fileSlug: 'guide-bleed-and-margins', pdfUrl: '#' }
    ],
    cta: {
      title: 'Need Expert File Verification Before Printing?',
      description: 'Our pre-press engineers inspect your packaging artwork files for color separation, dieline accuracy, and resolution for free.',
      button: 'Request Free File Audit'
    }
  },
  ar: {
    badge: 'الأدلة الفنية ومعايير الطباعة',
    title: 'دليل إعداد ملفات التصميم وقواعد ما قبل الطباعة',
    description: 'المعايير المعتمدة للمصممين ومديري الإنتاج لضمان الجودة الفائقة للألوان وهوامش القص والدايكات.',
    principles: [
      { icon: 'mdi:palette-swatch-outline', title: 'نمط ألوان CMYK', desc: 'يجب تصدير جميع الملفات بنمط CMYK، حيث تتغير ألوان RGB بشكل كبير عند الطباعة الأوفست.' },
      { icon: 'mdi:ruler-square', title: 'هوامش القص (Bleed ۳-٥ مم)', desc: 'تمديد الخلفيات لمسافة ۳ إلى ٥ مم خارج خط السكين لمنع ظهور حواف بيضاء أثناء التكسير.' },
      { icon: 'mdi:image-filter-hdr', title: 'دقة الصور ۳۰۰ DPI', desc: 'يجب أن تكون الصور المستخدمة بحجمها الطبيعي بدقة لا تقل عن ۳۰۰ بكسل في البوصة.' },
      { icon: 'mdi:format-font', title: 'تحويل الخطوط إلى منحنيات', desc: 'تحويل جميع النصوص إلى Outlines لتفادي مشاكل الخطوط المفقودة في الليثوغرافيا.' }
    ],
    guidesTitle: 'المقالات والأدلة الفنية المعتمدة',
    guides: [
      { id: 1, category: 'الألوان والليثوغرافيا', readTime: 'قراءة ٥ دقائق', title: 'دليل ضبط اللون الأسود الغني (Rich Black) في طباعة الأوفست', summary: 'استخدم تركيبة C:60 M:40 Y:40 K:100 للمساحات الكبيرة و K:100 للنصوص الدقيقة.', fileSlug: 'guide-cmyk-color-profile', pdfUrl: '#' },
      { id: 2, category: 'قوالب الدايكات', readTime: 'قراءة ٤ دقائق', title: 'معايير ضبط خطوط الطي والقص ولسان الغراء للعلب الدوائية', summary: 'تحديد خطوط الطي في طبقات مستقلة بألوان خاصة وترك مسافة ۱۲ مم للغراء.', fileSlug: 'guide-bleed-and-margins', pdfUrl: '#' }
    ],
    cta: {
      title: 'هل تحتاج إلى فحص فني لملفك قبل بدء الطباعة؟',
      description: 'يقوم مهندسو مجمع نجم بفحص ملفات التصميم وقوالب الدايكات مجاناً وإصدار تقرير المطابقة.',
      button: 'طلب فحص الملف مجاناً'
    }
  }
}

const localizedData = computed(() => {
  return {
    ...dictionaries[activeLang.value],
    ...(ui.value || {})
  }
})
</script>
