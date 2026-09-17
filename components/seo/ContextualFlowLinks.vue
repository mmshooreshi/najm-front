<!-- components/seo/ContextualFlowLinks.vue -->
<template>
  <section
    v-if="flowLinks.length > 0"
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="w-full my-8 select-text"
    aria-label="Industrial Workflow & Complementary Capabilities"
  >
    <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-5 sm:p-7 border border-najmborder/40 shadow-xs space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-najmgreen animate-pulse"></span>
          <h3 class="text-xs sm:text-sm font-bold text-gray-900 font-d4">
            {{ sectionHeader.title }}
          </h3>
        </div>
        <span class="text-[11px] text-gray-400 font-d4">
          {{ sectionHeader.subtitle }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <NuxtLink
          v-for="(link, idx) in flowLinks"
          :key="idx"
          :to="localePath(link.href)"
          class="group p-3.5 rounded-2xl bg-najmgrey/50 hover:bg-najmgreen/5 border border-najmborder/30 hover:border-najmgreen/40 transition-all duration-200 flex items-start gap-3 text-right"
          :class="isRTL ? 'text-right' : 'text-left'"
        >
          <div class="w-9 h-9 rounded-xl bg-white text-najmgreen flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-105 transition-transform shadow-2xs">
            <Icon :name="link.icon || 'mdi:link-variant'" class="w-4 h-4" />
          </div>

          <div class="space-y-0.5 min-w-0 flex-1">
            <span class="block text-[10px] font-bold text-najmgreen uppercase tracking-wider font-mono">
              {{ link.stepLabel }}
            </span>
            <span class="block text-xs font-bold text-gray-900 group-hover:text-najmgreen transition-colors font-d4 truncate">
              {{ link.title }}
            </span>
            <span class="block text-[11px] text-gray-500 line-clamp-1 leading-normal">
              {{ link.desc }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '~/composables/useLocale'

const props = withDefaults(
  defineProps<{
    currentSlug?: string
    type?: 'blog' | 'service' | 'product-packaging' | 'product-printing' | 'product-industry' | 'resource'
  }>(),
  {
    currentSlug: '',
    type: 'blog'
  }
)

const { language, localePath } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

interface FlowLinkItem {
  stepLabel: string
  title: string
  desc: string
  href: string
  icon: string
}

const sectionHeader = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') {
    if (props.type === 'blog') return { title: 'Associated Vector Dielines & Production Facilities', subtitle: 'Technical companion resources for this guide' }
    if (props.type === 'service') return { title: 'Next Stage in Manufacturing Workflow', subtitle: 'Integrated pre-press & post-press chain' }
    if (props.type === 'resource') return { title: 'Direct Production & Prototyping Options', subtitle: 'Fabricate this packaging structure' }
    return { title: 'Complementary Finishing & Printing Capabilities', subtitle: 'Technical production extensions' }
  }
  if (lang === 'AR') {
    if (props.type === 'blog') return { title: 'القوالب وخطوط الإنتاج المرتبطة بهذا الدليل', subtitle: 'الموارد الفنية المساندة للتصنيع' }
    if (props.type === 'service') return { title: 'المرحلة التالية في خط الإنتاج الصناعي', subtitle: 'سلسلة متكاملة من التصميم حتى التسليم' }
    if (props.type === 'resource') return { title: 'خيارات التصنيع والنمذجة لهذا القالب', subtitle: 'تحويل القالب الرقمي إلى عبوة واقعية' }
    return { title: 'خدمات التكميل وخطوط الطباعة المرافقة', subtitle: 'قدرات صناعية متكاملة' }
  }
  if (props.type === 'blog') return { title: 'قالب‌های تیغ و خطوط تولید مرتبط با این مقاله', subtitle: 'ابزارهای مهندسی و منابع مکمل ساختاری' }
  if (props.type === 'service') return { title: 'فرآیند تکمیلی و مراحل پیوسته تولید', subtitle: 'زنجیره متصل خدمات از طراحی تا بسته‌بندی نهایی' }
  if (props.type === 'resource') return { title: 'تولید فیزیکی و نمونه‌سازی این قالب', subtitle: 'تبدیل فایل وکتور به ماکت فیزیکی و تولید صنعتی' }
  return { title: 'خطوط چاپ، خدمات تکمیلی و استعلام متریال', subtitle: 'توانمندی‌های مهندسی و تجهیزات مستقر' }
})

const flowLinks = computed<FlowLinkItem[]>(() => {
  const lang = (language.value || 'FA').toUpperCase()
  const slug = props.currentSlug || ''

  // 1. Blog Article Contextual Links
  if (props.type === 'blog') {
    if (slug.includes('inboard') || slug.includes('greyboard')) {
      if (lang === 'EN') {
        return [
          { stepLabel: 'Vector Dieline', title: 'Tuck-End Box Template (AI/PDF)', desc: 'Standard pharmaceutical carton vector dieline', href: '/resources/template-tuck-end-box', icon: 'mdi:file-cad' },
          { stepLabel: 'Manufacturing', title: 'Folding Cartons & Pharma Boxes', desc: 'Certified sanitary Ivory board carton packaging', href: '/products/packaging/boxes', icon: 'mdi:package-variant' },
          { stepLabel: 'Pre-Press', title: 'Bleed & Crease Line Guide', desc: 'Pre-press margin setups for die-cut matrix', href: '/resources/guide-bleed-and-margins', icon: 'mdi:ruler-square' }
        ]
      }
      if (lang === 'AR') {
        return [
          { stepLabel: 'قالب الدايكات', title: 'قالب علب الكرتون الصيدلاني (AI/PDF)', desc: 'ملف فيكتور جاهز للعلب الدوائية والغذائية', href: '/resources/template-tuck-end-box', icon: 'mdi:file-cad' },
          { stepLabel: 'التصنيع', title: 'تصنيع علب الكرتون القابل للطي', desc: 'كرتون إنفربورد صحي معتمد للأدوية والأغذية', href: '/products/packaging/boxes', icon: 'mdi:package-variant' },
          { stepLabel: 'ما قبل الطباعة', title: 'دليل هوامش القص وخطوط الطي', desc: 'معايير إعداد الملفات لسكاكين الدايكات', href: '/resources/guide-bleed-and-margins', icon: 'mdi:ruler-square' }
        ]
      }
      return [
        { stepLabel: 'دانلود خط تیغ', title: 'قالب وکتور جعبه مقوایی دارویی (AI/PDF)', desc: 'قالب استاندارد جعبه درب‌دار دارویی و بهداشتی', href: '/resources/template-tuck-end-box', icon: 'mdi:file-cad' },
        { stepLabel: 'خط تولید', title: 'تولید جعبه‌های مقوایی ایندربرد', desc: 'جعبه‌سازی بهداشتی و دارویی با قفل اتوماتیک', href: '/products/packaging/boxes', icon: 'mdi:package-variant' },
        { stepLabel: 'راهنمای فنی', title: 'دستورالعمل تنظیم لبه برش و خط تا', desc: 'تنظیم فاصله خط تا و زبانه چسب در فایل طراحی', href: '/resources/guide-bleed-and-margins', icon: 'mdi:ruler-square' }
      ]
    }

    if (slug.includes('luxury') || slug.includes('hardbox')) {
      if (lang === 'EN') {
        return [
          { stepLabel: 'Vector Dieline', title: 'Magnetic Rigid Box Template', desc: 'Book-style magnetic luxury hardbox dieline', href: '/resources/template-magnetic-rigid-box', icon: 'mdi:file-cad' },
          { stepLabel: 'Post-Press', title: 'Lamination, Hot Foil & Spot UV', desc: 'Automated thermal velvet lamination and gold foiling', href: '/services/finishing-services', icon: 'mdi:gold' },
          { stepLabel: 'Prototyping', title: 'Free 48h Physical Sample Dummy', desc: 'Test structural fit with custom foam inserts', href: '/consultation', icon: 'mdi:cube-scan' }
        ]
      }
      if (lang === 'AR') {
        return [
          { stepLabel: 'قالب الدايكات', title: 'قالب علب الهاردبوكس المغناطيسية', desc: 'ملف فيكتور للعلب الصلبة الفاخرة على شكل كتاب', href: '/resources/template-magnetic-rigid-box', icon: 'mdi:file-cad' },
          { stepLabel: 'ما بعد الطباعة', title: 'خدمات التذهيب والسلفان المخملي', desc: 'بصمة حرارية ذهبية وسلفان مات فاخر', href: '/services/finishing-services', icon: 'mdi:gold' },
          { stepLabel: 'النمذجة', title: 'ماكيت فیزيائي مجاني خلال ۴۸ ساعة', desc: 'اختبار دقة المقاسات وحشوات الفوم', href: '/consultation', icon: 'mdi:cube-scan' }
        ]
      }
      return [
        { stepLabel: 'دانلود خط تیغ', title: 'قالب هاردباکس کتابی مگنتی (AI/PDF)', desc: 'قالب وکتور جعبه سخت لوکس زعفران، عطر و هدیه', href: '/resources/template-magnetic-rigid-box', icon: 'mdi:file-cad' },
        { stepLabel: 'خدمات تکمیلی', title: 'سلفون مخملی، طلاکوب و یووی موضعی', desc: 'جلوه‌های ویژه پس از چاپ و خطوط جعبه‌چسبانی', href: '/services/finishing-services', icon: 'mdi:gold' },
        { stepLabel: 'نمونه‌سازی', title: 'درخواست ماکت فیزیکی رایگان ۴۸ ساعته', desc: 'بررسی ابعاد واقعی و جایگذاری فوم‌های محافظ', href: '/consultation', icon: 'mdi:cube-scan' }
      ]
    }

    // Default blog article companion
    if (lang === 'EN') {
      return [
        { stepLabel: 'Color Profiles', title: 'CMYK Rich Black Setup Guide', desc: 'ICC color separation and litho plate curves', href: '/resources/guide-cmyk-color-profile', icon: 'mdi:palette-swatch' },
        { stepLabel: 'Offset Press', title: 'Heidelberg 5-Color Sheetfed Printing', desc: 'Online Prinect spectrophotometer color matching', href: '/services/printing-and-packaging', icon: 'mdi:printer' },
        { stepLabel: 'Catalog', title: 'General Packaging Catalog 2026', desc: 'Full range of boxboard calipers and structures', href: '/resources/catalog-general-2026', icon: 'mdi:book-open-page-variant' }
      ]
    }
    return [
      { stepLabel: 'پروفایل رنگی', title: 'راهنمای تنظیم رنگ مشکی پرکلاغی CMYK', desc: 'ترکیب استاندارد رنگ‌ها و تفکیک رنگ لیتوگرافی', href: '/resources/guide-cmyk-color-profile', icon: 'mdi:palette-swatch' },
      { stepLabel: 'خط چاپ افست', title: 'چاپ افست ۵ رنگ هایدلبرگ Speedmaster', desc: 'کنترل آنلاین رنگ با استاندارد کیفی ISO 12647-2', href: '/services/printing-and-packaging', icon: 'mdi:printer' },
      { stepLabel: 'کاتالوگ جامع', title: 'دانلود کاتالوگ بسته‌بندی و خدمات ۲۰۲۶', desc: 'مشخصات کامل انواع جعبه و خدمات کارخانه', href: '/resources/catalog-general-2026', icon: 'mdi:book-open-page-variant' }
    ]
  }

  // 2. Service Pages Contextual Links
  if (props.type === 'service') {
    if (slug === 'design-and-layout') {
      return [
        { stepLabel: 'مرحله بعد', title: 'لیتوگرافی دیجیتال CTP و زینک لیزری', desc: 'انتقال فایل به پلیت‌های بدون شیمیایی Heidelberg', href: '/services/lithography-and-plates', icon: 'mdi:laser-pointer' },
        { stepLabel: 'قالب‌های آماده', title: 'مرکز دانلود قالب‌های تیغ استاندارد', desc: 'فایل‌های آماده AI و PDF انواع جعبه‌های دارویی و لوکس', href: '/resources', icon: 'mdi:file-cad' },
        { stepLabel: 'ماکت‌سازی', title: 'درخواست ماکت فیزیکی رایگان', desc: 'ساخت نمونه آزمایشی ابعاد پیش از تیراژ نهایی', href: '/consultation', icon: 'mdi:cube-scan' }
      ]
    }
    if (slug === 'lithography-and-plates') {
      return [
        { stepLabel: 'مرحله بعد', title: 'چاپ افست ۵ رنگ هایدلبرگ', desc: 'خطوط ورقی پرسرعت با کنترل طیف‌سنجی رنگ', href: '/services/printing-and-packaging', icon: 'mdi:printer' },
        { stepLabel: 'راهنمای رنگ', title: 'پروفایل رنگی و استانداردهای تفکیک CMYK', desc: 'تنظیمات ترام و فایل خروجی استاندارد چاپ', href: '/resources/guide-cmyk-color-profile', icon: 'mdi:palette-swatch' },
        { stepLabel: 'ماشین‌آلات', title: 'تجهیزات لیتوگرافی و پلیت‌ستر CTP', desc: 'آشنایی با سیستم Suprasetter هایدلبرگ مستقر', href: '/facilities', icon: 'mdi:cog' }
      ]
    }
    if (slug === 'printing-and-packaging') {
      return [
        { stepLabel: 'مرحله بعد', title: 'سلفون حرارتی، طلاکوب و دایکات بوبست', desc: 'خدمات تکمیلی پس از چاپ و خطوط جعبه‌چسبانی', href: '/services/finishing-services', icon: 'mdi:gold' },
        { stepLabel: 'تجهیزات کارخانه', title: 'مشخصات خط چاپ ۵ رنگ Speedmaster', desc: 'سرعت ۱۵,۰۰۰ برگ و چاپ همزمان رنگ‌های ساختگی', href: '/facilities', icon: 'mdi:factory' },
        { stepLabel: 'محصولات', title: 'انواع جعبه‌های مقوایی دارویی و صادراتی', desc: 'مشخصات فنی و گرماژهای قابل سفارش', href: '/products/packaging/boxes', icon: 'mdi:package-variant' }
      ]
    }
    if (slug === 'finishing-services') {
      return [
        { stepLabel: 'مرحله بعد', title: 'انبارداری، استرچ پالت و ارسال', desc: 'بسته‌بندی مقاوم ضد رطوبت و ناوگان لجستیک', href: '/services/storage-and-warehousing', icon: 'mdi:warehouse' },
        { stepLabel: 'محصولات لوکس', title: 'تولید هاردباکس و جعبه‌های سخت فانتزی', desc: 'ترکیب طلاکوب، سلفون مخملی و فوم‌های مخملی', href: '/products/packaging/boxes', icon: 'mdi:crown' },
        { stepLabel: 'کاتالوگ جامع', title: 'دانلود کاتالوگ بسته‌بندی لوکس', desc: 'آرشیو نمونه‌های اجراشده و روکش‌های نفیس', href: '/resources/catalog-luxury-packaging', icon: 'mdi:book-open-page-variant' }
      ]
    }
    // Default service fallback
    return [
      { stepLabel: 'خطوط چاپ', title: 'چاپ افست ۵ رنگ هایدلبرگ', desc: 'تولید تیراژهای صنعتی با استاندارد ISO 12647-2', href: '/services/printing-and-packaging', icon: 'mdi:printer' },
      { stepLabel: 'خدمات پس از چاپ', title: 'سلفون حرارتی، طلاکوب و دایکات', desc: 'طلاکوب گرم، یووی سیلندری و پوشش‌های محافظ', href: '/services/finishing-services', icon: 'mdi:gold' },
      { stepLabel: 'مشاوره فنی', title: 'استعلام قیمت و مشاوره مهندسی محصول', desc: 'محاسبه بهینه ابعاد، گرماژ و قیمت رقابتی', href: '/consultation', icon: 'mdi:phone' }
    ]
  }

  // 3. Product Packaging Contextual Links
  if (props.type === 'product-packaging') {
    return [
      { stepLabel: 'تجهیزات تولید', title: 'خط چاپ ۵ رنگ هایدلبرگ و دایکات بوبست', desc: 'مشاهده ماشین‌آلات تولید و ظرفیت روزانه کارخانه', href: '/facilities', icon: 'mdi:factory' },
      { stepLabel: 'خدمات تکمیلی', title: 'سلفون مات، براق، طلاکوب و یووی برجسته', desc: 'جلوه‌های بصری و پوشش‌های بهداشتی فودگرید', href: '/services/finishing-services', icon: 'mdi:gold' },
      { stepLabel: 'نمونه‌سازی', title: 'درخواست ماکت فیزیکی سه‌بعدی رایگان', desc: 'تست قالب فیزیکی ظرف ۴۸ ساعت کاری', href: '/consultation', icon: 'mdi:cube-scan' }
    ]
  }

  // 4. Resource / Template Contextual Links
  if (props.type === 'resource') {
    return [
      { stepLabel: 'تولید صنعتی', title: 'استعلام تولید و تیراژ این قالب', desc: 'تولید با مقوای ایندربرد بهداشتی و چاپ ۵ رنگ', href: '/products/packaging/boxes', icon: 'mdi:package-variant' },
      { stepLabel: 'نمونه اولیه', title: 'ساخت ماکت فیزیکی رایگان ظرف ۴۸ ساعت', desc: 'بررسی دقیق خط تا و تناسب با محصول شما', href: '/consultation', icon: 'mdi:cube-scan' },
      { stepLabel: 'راهنمای طراحی', title: 'اصول تنظیم رنگ CMYK و لبه‌های برش', desc: 'دستورالعمل آماده‌سازی بی‌نقص فایل چاپ', href: '/resources/guides', icon: 'mdi:book-open-outline' }
    ]
  }

  return []
})
</script>
