<!-- pages/services/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen bg-najmback pb-24 text-gray-800">
    <!-- Hero Section -->
    <section class="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div class="bg-white rounded-3xl p-5 sm:p-12 shadow-xs border border-najmborder/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
        <div class="space-y-3 max-w-2xl" :class="isRTL ? 'text-right' : 'text-left'">
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4 break-words"
          >
            {{ headerContent.badge }}
          </span>
          <h1
            class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight text-d4 break-words"
          >
            {{ headerContent.title }}
          </h1>
          <p
            class="text-xs sm:text-sm text-gray-600 leading-relaxed break-words"
          >
            {{ headerContent.description }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
          <NuxtLink
            to="/facilities"
            class="w-full sm:w-auto py-3 px-5 rounded-2xl bg-najmgrey hover:bg-gray-200 text-gray-800 text-center font-bold text-xs text-d4 transition"
          >
            {{ isRTL ? 'تجهیزات و ماشین‌آلات' : 'Machinery & Plant' }}
          </NuxtLink>
          <NuxtLink
            to="/consultation"
            class="w-full sm:w-auto py-3 px-5 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white text-center font-bold text-xs text-d4 transition shadow-xs"
          >
            {{ isRTL ? 'مشاوره و نمونه‌سازی' : 'Free Consultation' }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <article
          v-for="service in servicesList"
          :key="service.slug"
          class="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-najmborder/40 hover:shadow-md hover:border-najmgreen transition-all duration-300 flex flex-col justify-between group"
          :class="isRTL ? 'text-right' : 'text-left'"
        >
          <div class="space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-najmgreen flex items-center justify-center group-hover:scale-105 transition-transform">
              <Icon :name="service.icon" class="w-6 h-6" />
            </div>

            <div class="space-y-1.5">
              <span class="text-[11px] font-bold text-najmgreen text-d4">{{ service.step }}</span>
              <h2 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-najmgreen transition-colors font-d4 leading-snug break-words">
                <NuxtLink :to="localePath('/services/' + service.slug)">
                  {{ service.title }}
                </NuxtLink>
              </h2>
            </div>

            <p class="text-xs text-gray-600 leading-relaxed break-words">
              {{ service.desc }}
            </p>

            <div class="space-y-1.5 pt-2">
              <div v-for="(item, i) in service.features" :key="i" class="flex items-center gap-2 text-xs text-gray-700">
                <span class="w-1.5 h-1.5 rounded-full bg-najmgreen shrink-0"></span>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-100 mt-6">
            <NuxtLink
              :to="localePath('/services/' + service.slug)"
              class="w-full block py-2.5 rounded-xl bg-najmgrey group-hover:bg-najmgreen group-hover:text-white text-gray-800 text-xs font-bold text-center transition font-d4"
            >
              {{ isRTL ? 'مشاهده جزئیات و مشخصات فنی' : 'View Technical Details' }}
            </NuxtLink>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '~/composables/useLocale'
import { useAppSeo } from '~/composables/useAppSeo'

definePageMeta({
  name: 'خدمات تخصصی چاپ و بسته‌بندی - چاپ نجم',
  layout: 'default'
})

const { language, localePath } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const headerContent = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') {
    return {
      badge: 'Integrated Industrial Services',
      title: 'Commercial Offset Printing & Luxury Packaging Services',
      description: 'Full-cycle production infrastructure from pre-press CTP lithography to high-speed 5-color Heidelberg presses and automated post-press converting.'
    }
  }
  if (lang === 'AR') {
    return {
      badge: 'الخدمات الصناعية المتكاملة',
      title: 'خدمات طباعة الأوفست والتغليف الفاخر الشاملة',
      description: 'خطوط إنتاج متكاملة تبدأ من تصميم الهياكل وليثوغرافيا CTP وحتى طباعة هايدلبرغ ۵ ألوان وعمليات التشطيب والدايكات.'
    }
  }
  return {
    badge: 'خدمات صنعتی و مهندسی چاپ',
    title: 'خدمات تخصصی چاپ افست و جعبه‌سازی صنعتی',
    description: 'زنجیره کامل تولید از طراحی ساختاری و لیتوگرافی CTP حرارتی تا چاپ ورقی ۵ رنگ هایدلبرگ، سلفون حرارتی و دایکات اتوماتیک بوبست زیر یک سقف.'
  }
})

const servicesList = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') {
    return [
      {
        slug: 'design-and-layout',
        icon: 'mdi:ruler-square-compass',
        step: 'Stage 01 • Pre-Press',
        title: 'Structural Design & Dieline Engineering',
        desc: 'Precision packaging dielines, 3D prototyping, and layout optimization to eliminate material waste.',
        features: ['CAD Structural Dielines', 'Complimentary 48h Physical Dummy', 'Automated Sheet Imposition']
      },
      {
        slug: 'lithography-and-plates',
        icon: 'mdi:laser-pointer',
        step: 'Stage 02 • Lithography',
        title: 'CTP Thermal Laser Platesetting',
        desc: 'Direct-to-plate Heidelberg Suprasetter technology delivering 2540 DPI dot sharpness without chemical drift.',
        features: ['Chemical-Free Thermal Plates', 'ISO 12647-2 Color Calibration', 'Dot Retention Guarantee']
      },
      {
        slug: 'printing-and-packaging',
        icon: 'mdi:printer',
        step: 'Stage 03 • Press',
        title: '5-Color Sheetfed Offset Printing',
        desc: 'Heidelberg Speedmaster XL 5-color printing with online spectrophotometer for certified color stability.',
        features: ['Pantone & Spot Color Inks', 'In-line Protective Coating', '15,000 Sheets/Hour Throughput']
      },
      {
        slug: 'finishing-services',
        icon: 'mdi:gold',
        step: 'Stage 04 • Post-Press',
        title: 'Lamination, Hot Foil & Die-Cutting',
        desc: 'Automated thermal lamination (matte/gloss/soft-touch), hot foil stamping, embossing, and Bobst high-speed die-cutting.',
        features: ['Thermal Soft-Touch Lamination', 'High-Speed Automated Bobst Die-Cut', 'Spot & Sand UV Varnishing']
      },
      {
        slug: 'storage-and-warehousing',
        icon: 'mdi:warehouse',
        step: 'Stage 05 • Logistics',
        title: 'Palletizing, Warehousing & Distribution',
        desc: 'Moisture-proof stretch wrapping, automated palletization, and timed scheduled deliveries across Iran and regional ports.',
        features: ['Automated Stretch Wrapping', 'Safe Long-Term Storage', 'Express Logistics Fleet']
      }
    ]
  }
  if (lang === 'AR') {
    return [
      {
        slug: 'design-and-layout',
        icon: 'mdi:ruler-square-compass',
        step: 'المرحلة ٠١ • ما قبل الطباعة',
        title: 'التصميم وهندسة الهياكل وقوالب الدايكات',
        desc: 'تصميم دقيق لخطوط السكاکین، نماذج ثلاثية الأبعاد، وتوزيع النماذج لتقليل هدر الورق.',
        features: ['تصميم قوالب السكاكين CAD', 'ماكيت فیزيائي مجاني خلال ۴۸ ساعة', 'توزيع النماذج آلياً']
      },
      {
        slug: 'lithography-and-plates',
        icon: 'mdi:laser-pointer',
        step: 'المرحلة ٠٢ • الليثوغرافيا',
        title: 'الليثوغرافيا الرقمية وصفائح CTP الحرارية',
        desc: 'تقنية هايدلبرغ Suprasetter بدقة ۲۵۴۰ DPI بدون وسائط كيميائية مع ثبات كامل لنقاط الترام.',
        features: ['صفائح حرارية دقيقة بدون كيميائيات', 'معايرة لونیة وفق ISO 12647-2', 'دقة تفريغ الألوان']
      },
      {
        slug: 'printing-and-packaging',
        icon: 'mdi:printer',
        step: 'المرحلة ٠٣ • الطباعة',
        title: 'طباعة أوفست ۵ ألوان هايدلبرغ',
        desc: 'ماكينات هايدلبرغ سبيدماستر مع نظام تحكم لوني رقمي متطور لأعلى ثبات لوني.',
        features: ['طباعة ألوان بانتون الخاصة', 'ورنيش حماية مائي فوري', 'سرعة ۱۵,۰۰۰ فرخ بالساعة']
      },
      {
        slug: 'finishing-services',
        icon: 'mdi:gold',
        step: 'المرحلة ٠٤ • ما بعد الطباعة',
        title: 'خدمات التشطيب، السلفان والتذهيب والدايكات',
        desc: 'سلفان حراري مخملي ومات، بصمة حرارية ذهبية، يو في موضعي، وتكسير بماكينات بوبست.',
        features: ['سلفان حراري مخملي مات وبراق', 'تكسير آلي دقيق بماكينات بوبست', 'طلاكوب وبصمة حرارية']
      },
      {
        slug: 'storage-and-warehousing',
        icon: 'mdi:warehouse',
        step: 'المرحلة ٠٥ • اللوجستيات',
        title: 'التخزين والتغليف والخدمات اللوجستية',
        desc: 'تغليف وتشتريج محكم مقاوم للرطوبة وتوزيع منتظم للطلبات.',
        features: ['تغليف سترتش آلي على طبالي', 'مستودعات آمنة ومكيفة', 'أسطول شحن سريع']
      }
    ]
  }
  return [
    {
      slug: 'design-and-layout',
      icon: 'mdi:ruler-square-compass',
      step: 'مرحله ۰۱ • پیش از چاپ',
      title: 'طراحی ساختاری، مهندسی خط تیغ و ماکت‌سازی',
      desc: 'ترسیم دقیق خطوط تیغ و تا، شبیه‌سازی سه‌بعدی و چیدمان بهینه فرم‌های چاپی جهت به حداقل رساندن پرتی مقوا.',
      features: ['طراحی خط تیغ استاندارد CAD', 'ساخت ماکت فیزیکی ظرف ۴۸ ساعت', 'فرم‌بندی نرم‌افزاری بهینه']
    },
    {
      slug: 'lithography-and-plates',
      icon: 'mdi:laser-pointer',
      step: 'مرحله ۰۲ • لیتوگرافی',
      title: 'لیتوگرافی دیجیتال CTP و تهیه زینک‌های لیزری',
      desc: 'خروجی مستقیم پلیت بدون استفاده از فیلم با دستگاه Heidelberg Suprasetter با وضوح ۲۵۴۰DPI و ترام‌گذاری دقیق.',
      features: ['پلیت‌ستر حرارتی بدون شیمیایی', 'کالیبراسیون استاندارد ISO 12647-2', 'حفظ دقیق ترام‌های هایلایت']
    },
    {
      slug: 'printing-and-packaging',
      icon: 'mdi:printer',
      step: 'مرحله ۰۳ • چاپ افست',
      title: 'چاپ افست ورقی ۵ رنگ هایدلبرگ و جعبه‌سازی',
      desc: 'خطوط چاپ افست هایدلبرگ Speedmaster با کنترل آنلاین رنگ Prinect جهت تضمین ثبات رنگ در کل تیراژ.',
      features: ['چاپ همزمان رنگ‌های ساختگی پنتون', 'ورنی پایه‌آب محافظ روی خط', 'سرعت تولید ۱۵,۰۰۰ برگ در ساعت']
    },
    {
      slug: 'finishing-services',
      icon: 'mdi:gold',
      step: 'مرحله ۰۴ • پس از چاپ',
      title: 'سلفون حرارتی، طلاکوب گرم، یووی و دایکات',
      desc: 'خطوط سلفون‌کشی اتوماتیک Auto-band، طلاکوب، یووی سیلندری و دایکات‌های تمام‌اتوماتیک Bobst با قدرت ۳۰۰ تن.',
      features: ['سلفون مات، براق و مخملی (سافت تاچ)', 'دایکات پرسرعت بوبست با دقت صدم میلیمتر', 'طلاکوب، نقره‌کوب و یووی موضعی']
    },
    {
      slug: 'storage-and-warehousing',
      icon: 'mdi:warehouse',
      step: 'مرحله ۰۵ • بسته‌بندی و ارسال',
      title: 'تسمه‌کشی، شرینک پالت، انبارداری و لجستیک',
      desc: 'بسته‌بندی استاندارد صادراتی، استرچ پالت ضد رطوبت و ارسال زمان‌بندی‌شده به سراسر کارخانجات کشور.',
      features: ['استرچ‌پیچ اتوماتیک پالت‌ها', 'امکان نگهداری امانی سفارشات در انبار', 'ناوگان اختصاصی حمل و تحویل']
    }
  ]
})

useAppSeo({
  title: computed(() => headerContent.value.title + ' | مجتمع چاپ نجم'),
  description: computed(() => headerContent.value.description),
  type: 'service',
  slug: 'services'
})
</script>
