<!-- components/seo/InternalAuthorityPills.vue -->
<template>
  <nav
    :dir="isRTL ? 'rtl' : 'ltr'"
    :aria-label="navAriaLabel"
    class="w-full max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-12 py-1.5 sm:py-2 select-text"
  >
    <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
      <span class="text-[11px] sm:text-xs font-semibold text-white/70 font-d4 ml-1 flex items-center gap-1">
        <Icon name="mdi:compass-outline" class="w-3.5 h-3.5 opacity-80" />
        {{ hubTitle }}:
      </span>

      <NuxtLink
        v-for="(item, idx) in currentPills"
        :key="idx"
        :to="localePath(item.href)"
        :title="item.title"
        class="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-white/85 hover:text-white bg-white/8 hover:bg-white/18 border border-white/15 hover:border-emerald-300/40 rounded-full px-3 py-1 transition-all duration-200 shadow-xs hover:shadow-sm"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400/80"></span>
        <span class="font-d4">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '~/composables/useLocale'

const { language, localePath } = useLocale()

const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const navAriaLabel = computed(() => {
  if (language.value === 'EN') return 'Key Capabilities & Topic Navigation'
  if (language.value === 'AR') return 'الوصول السريع إلى الأقسام والخدمات'
  return 'دسترسی سریع به خدمات و نمونه‌های چاپ و بسته‌بندی'
})

const hubTitle = computed(() => {
  if (language.value === 'EN') return 'Production & Hubs'
  if (language.value === 'AR') return 'خطوط الإنتاج والتخصصات'
  return 'خطوط تولید و دسترسی مستقیم'
})

interface PillItem {
  label: string
  href: string
  title: string
}

const pillsFa: PillItem[] = [
  { label: 'جعبه‌های دارویی و بهداشتی', href: '/catalog', title: 'تولید انواع جعبه دارویی با مقوای ایندربرد بهداشتی' },
  { label: 'هاردباکس و بسته‌بندی لوکس', href: '/catalog', title: 'تولید جعبه‌های سخت و فانتزی با روکش‌های نفیس' },
  { label: 'چاپ افست ۵ رنگ هایدلبرگ', href: '/services/printing-and-packaging', title: 'خطوط چاپ افست ورقی پرسرعت و دقیق' },
  { label: 'سلفون، طلاکوب و خدمات تکمیلی', href: '/services/finishing-services', title: 'طلاکوب گرم، یووی سیلندری و پوشش سلفون' },
  { label: 'ماشین‌آلات و تجهیزات کارخانه', href: '/facilities', title: 'آشنایی با ماشین‌آلات دایکات بوبست و لیتوگرافی CTP' },
  { label: 'مشاوره فنی و نمونه‌سازی رایگان', href: '/consultation', title: 'محاسبه گرماژ مقوا و ساخت ماکت فیزیکی' },
  { label: 'دانلود قالب و فایل‌های راهنما', href: '/resources', title: 'مرکز دانلود خط تیغ جعبه و استانداردهای طراحی' },
  { label: 'استعلام قیمت و تماس با کارخانه', href: '/contact', title: 'خطوط مستقیم تماس با واحد فروش و کارشناسان فنی' }
]

const pillsEn: PillItem[] = [
  { label: 'Pharma & Sanitary Boxes', href: '/catalog', title: 'Certified hygienic folding boxboard packaging' },
  { label: 'Luxury Rigid & Magnetic Boxes', href: '/catalog', title: 'Premium custom rigid box engineering' },
  { label: 'Heidelberg 5-Color Offset', href: '/services/printing-and-packaging', title: 'High-precision industrial sheetfed offset printing' },
  { label: 'Foil Stamping & UV Varnishing', href: '/services/finishing-services', title: 'Hot foil, spot UV, and automated lamination' },
  { label: 'Industrial Machinery & Plant', href: '/facilities', title: 'Bobst die-cutters and thermal CTP platesetters' },
  { label: 'Free Prototyping & Consultation', href: '/consultation', title: 'Grammage selection and 48h physical dummy' },
  { label: 'Dieline Templates & Resources', href: '/resources', title: 'Download vector dielines and technical print guides' },
  { label: 'Contact Sales & Tehran Factory', href: '/contact', title: 'Direct quotation phone lines and plant location' }
]

const pillsAr: PillItem[] = [
  { label: 'علب الأدوية والمستحضرات المعتمدة', href: '/catalog', title: 'تصنيع علب الكرتون الصحي للأدوية والمستحضرات' },
  { label: 'علب الكرتون الصلب وهاردبوكس', href: '/catalog', title: 'علب فاخرة ومغناطيسية للمنتجات المميزة' },
  { label: 'طباعة أوفست ۵ ألوان هايدلبرغ', href: '/services/printing-and-packaging', title: 'طباعة أوفست صناعية عالية الدقة' },
  { label: 'بصمة حرارية ذهبية وسلفان', href: '/services/finishing-services', title: 'خدمات التكميل والبصمة وسلفان حراري' },
  { label: 'الآلات والتجهيزات الصناعية', href: '/facilities', title: 'ماكينات بوبست للقص وأجهزة CTP' },
  { label: 'استشارة فنية ونموذج أولي مجاني', href: '/consultation', title: 'هندسة العلب ونموذج أولي خلال ۴۸ ساعة' },
  { label: 'قوالب السكاكين وتنزيل الملفات', href: '/resources', title: 'مركز تنزيل قوالب وتصاميم العلب' },
  { label: 'اتصال مباشر واستعلام الأسعار', href: '/contact', title: 'خطوط الاتصال المباشرة وعنوان المصنع' }
]

const currentPills = computed(() => {
  if (language.value === 'EN') return pillsEn
  if (language.value === 'AR') return pillsAr
  return pillsFa
})
</script>
