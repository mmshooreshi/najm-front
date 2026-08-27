<!-- pages/history.vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-najmback pb-20 sm:pb-28 text-gray-800">
    <!-- Hero Header -->
    <header class="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-3 sm:space-y-4">
      <span class="inline-block px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4">
        {{ ui?.stats || 'روایت ۲۵ سال تعالی صنعتی (۱۹۹۹ — ۲۰۲۶)' }}
      </span>
      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight text-d4">
        {{ ui?.title || 'تاریخچه و مسیر تکامل چاپ و بسته‌بندی نجم' }}
      </h1>
      <p class="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
        {{ ui?.subtitle || 'داستان تبدیل یک کارگاه لیتوگرافی دقیق به یکی از مجهزترین مجتمع‌های چاپ افست و بسته‌بندی تخصصی کشور با اتکا به کیفیت، صداقت و فناوری روز دنیا.' }}
      </p>
    </header>

    <!-- Timeline Journey (Mobile-First Responsive Timeline) -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative border-r-2 border-najmgreen/20 pr-4 sm:pr-10 mr-2 sm:mr-8 space-y-12 sm:space-y-16">
        <!-- Milestone 1: 1999 -->
        <article class="relative group">
          <!-- Timeline Pin -->
          <div class="absolute -right-[23px] sm:-right-[49px] top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-3 sm:border-4 border-najmgreen flex items-center justify-center shadow-xs">
            <div class="w-1.5 h-1.5 rounded-full bg-najmgreen"></div>
          </div>

          <div class="space-y-2.5 text-right">
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span class="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-najmgreen text-white text-[11px] sm:text-xs font-bold font-mono">
                ۱۹۹۹ (۱۳۷۸)
              </span>
              <span class="text-[11px] sm:text-xs text-gray-500 font-bold text-d4">گام نخست • تاسیس کارگاه لیتوگرافی</span>
            </div>
            <h2 class="text-base sm:text-2xl font-bold text-gray-900 text-d4">
              آغاز مسیر با تمرکز بر تفکیک دقیق رنگ و آماده‌سازی زینک
            </h2>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
              مجموعه نجم با هدف ارائه خدمات پیش از چاپ با بالاترین دقت تفکیک رنگ در بازار چاپ تهران تاسیس شد. وسواس در آماده‌سازی زینک‌های بدون خطا، نخستین پیوند اعتماد میان نجم و ناشران و برندهای معتبر را رقم زد.
            </p>
          </div>
        </article>

        <!-- Milestone 2: 2005 -->
        <article class="relative group">
          <div class="absolute -right-[23px] sm:-right-[49px] top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-3 sm:border-4 border-najmgreen flex items-center justify-center shadow-xs">
            <div class="w-1.5 h-1.5 rounded-full bg-najmgreen"></div>
          </div>

          <div class="space-y-2.5 text-right">
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span class="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-najmgreen text-white text-[11px] sm:text-xs font-bold font-mono">
                ۲۰۰۵ (۱۳۸۴)
              </span>
              <span class="text-[11px] sm:text-xs text-gray-500 font-bold text-d4">ورود به صنعت چاپ ورقی</span>
            </div>
            <h2 class="text-base sm:text-2xl font-bold text-gray-900 text-d4">
              تجهیز نخستین خطوط چاپ افست ۴ رنگ و سلفون‌کشی حرارتی
            </h2>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
              با افزایش تقاضا، مجتمع به سایت صنعتی جدید نقل مکان کرد و نخستین ماشین چاپ ۴ رنگ هایدلبرگ به همراه خطوط سلفون‌کشی حرارتی راه‌اندازی شد تا فرآیند تولید از طراحی تا چاپ زیر یک سقف انجام پذیرد.
            </p>
          </div>
        </article>

        <!-- Milestone 3: 2012 -->
        <article class="relative group">
          <div class="absolute -right-[23px] sm:-right-[49px] top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-3 sm:border-4 border-najmgreen flex items-center justify-center shadow-xs">
            <div class="w-1.5 h-1.5 rounded-full bg-najmgreen"></div>
          </div>

          <div class="space-y-2.5 text-right">
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span class="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-najmgreen text-white text-[11px] sm:text-xs font-bold font-mono">
                ۲۰۱۲ (۱۳۹۱)
              </span>
              <span class="text-[11px] sm:text-xs text-gray-500 font-bold text-d4">انقلاب دیجیتال CTP</span>
            </div>
            <h2 class="text-base sm:text-2xl font-bold text-gray-900 text-d4">
              راه‌اندازی سیستم خروجی مستقیم به پلیت (Heidelberg CTP Suprasetter)
            </h2>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
              حذف کامل فیلم‌های لیتوگرافی سنتی و جایگزینی با پیشرفته‌ترین تکنولوژی لیزری حرارتی بدون شیمیایی، خطای انتقال ترام را به صفر رساند و کیفیت وضوح تصاویر را به ۲۵۴۰DPI ارتقا داد.
            </p>
          </div>
        </article>

        <!-- Milestone 4: 2017 -->
        <article class="relative group">
          <div class="absolute -right-[23px] sm:-right-[49px] top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-3 sm:border-4 border-najmgreen flex items-center justify-center shadow-xs">
            <div class="w-1.5 h-1.5 rounded-full bg-najmgreen"></div>
          </div>

          <div class="space-y-2.5 text-right">
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span class="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-najmgreen text-white text-[11px] sm:text-xs font-bold font-mono">
                ۲۰۱۷ (۱۳۹۶)
              </span>
              <span class="text-[11px] sm:text-xs text-gray-500 font-bold text-d4">بسته‌بندی لوکس و هاردباکس</span>
            </div>
            <h2 class="text-base sm:text-2xl font-bold text-gray-900 text-d4">
              افتتاح خطوط اختصاصی جعبه‌های سخت (Hardbox) و دایکات اتوماتیک بوبست
            </h2>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
              با تجهیز کارگاه تخصصی ساخت هاردباکس‌های مگنتی و کشویی و نصب دایکات‌های اتوماتیک Bobst با قدرت ۳۰۰ تن، نجم به یکی از پیشگامان تولید بسته‌بندی‌های صادراتی زعفران، عطر، شکلات و صنایع لوکس بدل شد.
            </p>
          </div>
        </article>

        <!-- Milestone 5: 2021 -->
        <article class="relative group">
          <div class="absolute -right-[23px] sm:-right-[49px] top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-3 sm:border-4 border-najmgreen flex items-center justify-center shadow-xs">
            <div class="w-1.5 h-1.5 rounded-full bg-najmgreen"></div>
          </div>

          <div class="space-y-2.5 text-right">
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span class="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-najmgreen text-white text-[11px] sm:text-xs font-bold font-mono">
                ۲۰۲۱ (۱۴۰۰)
              </span>
              <span class="text-[11px] sm:text-xs text-gray-500 font-bold text-d4">چاپ افست ۵ رنگ پیشرفته</span>
            </div>
            <h2 class="text-base sm:text-2xl font-bold text-gray-900 text-d4">
              نصب Heidelberg Speedmaster XL با کنترل رنگ آنلاین Prinect
            </h2>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
              خط ۵ رنگ با قابلیت چاپ همزمان رنگ‌های پنتون و ورنی محافظ با سرعت ۱۵,۰۰۰ برگ در ساعت به ناوگان افزوده شد تا ظرفیت تولید سالانه مجموعه به بیش از ۱۵ میلیون واحد جعبه و بسته‌بندی افزایش یابد.
            </p>
          </div>
        </article>

        <!-- Milestone 6: 2026 Today -->
        <article class="relative group">
          <div class="absolute -right-[23px] sm:-right-[49px] top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-najmgreen border-3 sm:border-4 border-emerald-200 flex items-center justify-center shadow-md">
            <div class="w-2 h-2 rounded-full bg-white animate-ping"></div>
          </div>

          <div class="space-y-2.5 text-right">
            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span class="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-emerald-600 text-white text-[11px] sm:text-xs font-bold font-mono">
                ۲۰۲۶ (امروز)
              </span>
              <span class="text-[11px] sm:text-xs text-emerald-800 font-bold text-d4">چشم‌انداز پایدار و نوآوری دیجیتال</span>
            </div>
            <h2 class="text-base sm:text-2xl font-bold text-gray-900 text-d4">
              سامانه هوشمند استعلام، متریال بازیافت‌پذیر سبز و حضور در بازارهای منطقه‌ای
            </h2>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
              امروز مجتمع چاپ و بسته‌بندی نجم به عنوان یک شریک تجاری معتمد، با بهره‌گیری از زیرساخت دیجیتال، مقواهای فودگرید بهداشتی و مرکب‌های سازگار با محیط‌زیست، مسیر خود را به سوی رهبری نوآوری در صنعت چاپ منطقه ادامه می‌دهد.
            </p>
          </div>
        </article>
      </div>
    </main>

    <!-- Bottom CTA Bar -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
      <div class="bg-najmgreen text-white rounded-3xl p-6 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="space-y-2" :class="isRTL ? 'text-right' : 'text-left'">
          <h3 class="text-lg sm:text-2xl font-bold text-d4">{{ ui?.ctaTitle || (isRTL ? 'پروژه چاپ یا بسته‌بندی بعدی خود را با ما آغاز کنید' : 'Start Your Next Packaging & Print Project With Us') }}</h3>
          <p class="text-xs text-emerald-100">{{ ui?.ctaDescription || (isRTL ? 'کارشناسان ما آماده ارائه مشاوره فنی در انتخاب متریال و بهینه‌سازی فرم‌های چاپی هستند.' : 'Our technical engineers are ready to consult on structural design, materials, and print optimization.') }}</p>
        </div>
        <NuxtLink
          to="/contact"
          class="w-full sm:w-auto text-center px-7 py-3 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition whitespace-nowrap shadow-xs text-d4"
        >
          {{ ui?.ctaBtn || (isRTL ? 'تماس و استعلام پروژه' : 'Contact & Project Inquiries') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  name: 'تاریخچه ۲۵ ساله - مجتمع چاپ نجم',
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const { ui } = usePageUI('history')
</script>
