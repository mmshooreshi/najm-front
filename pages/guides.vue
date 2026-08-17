<!-- pages/guides.vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4">
        راهنماهای فنی و استانداردهای چاپ
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight text-d4">
        راهنمای آماده‌سازی فایل و اصول پیش از چاپ
      </h1>
      <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
        دستورالعمل‌های استاندارد برای طراحان گرافیک و مدیران تولید جهت آماده‌سازی بی‌نقص فایل‌های چاپی، پروفایل رنگی، لبه برش و خروجی زینک CTP.
      </p>
    </div>

    <!-- Key Principles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
          <Icon name="mdi:palette-swatch-outline" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-gray-900 text-d4">مد رنگی CMYK</h3>
        <p class="text-xs text-gray-600 leading-relaxed">
          تمام فایل‌ها باید در مد CMYK خروجی گرفته شوند. فایل‌های RGB در چاپ افست دچار تغییر فاحش رنگ خواهند شد.
        </p>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
          <Icon name="mdi:ruler-square" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-gray-900 text-d4">لبه برش (Bleed ۳ تا ۵ میل)</h3>
        <p class="text-xs text-gray-600 leading-relaxed">
          برای جلوگیری از ایجاد سفیدی لبه کار در هنگام برش و دایکات، پس‌زمینه‌ها باید حداقل ۳ تا ۵ میلیمتر خارج از خط تیغ امتداد یابند.
        </p>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
          <Icon name="mdi:image-filter-hdr" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-gray-900 text-d4">رزولوشن ۳۰۰DPI</h3>
        <p class="text-xs text-gray-600 leading-relaxed">
          تصاویر و عکس‌های استفاده‌شده باید در اندازه واقعی با حداقل رزولوشن ۳۰۰ پیکسل بر اینچ ذخیره شوند.
        </p>
      </div>

      <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
          <Icon name="mdi:format-font" class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-gray-900 text-d4">تبدیل فونت به منحنی (Curve)</h3>
        <p class="text-xs text-gray-600 leading-relaxed">
          برای جلوگیری از به‌هم‌ریختگی قلم‌ها در لیتوگرافی، تمامی متون در ایلاستریتور و ایندیزاین باید Create Outlines شوند.
        </p>
      </div>
    </div>

    <!-- Detailed Guides Breakdown -->
    <div class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 text-d4">مجموعه مقالات و فایل‌های راهنمای کاربردی</h2>
      <div class="space-y-4">
        <div
          v-for="guide in guidesList"
          :key="guide.id"
          class="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-najmborder/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-all duration-300"
        >
          <div class="space-y-2 max-w-3xl">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-najmgrey text-gray-800">
                {{ guide.category }}
              </span>
              <span class="text-xs text-gray-400 font-mono">{{ guide.readTime }}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 text-d4">{{ guide.title }}</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {{ guide.summary }}
            </p>
          </div>

          <div class="flex sm:flex-col items-center gap-2 flex-shrink-0">
            <NuxtLink
              :to="`/resources/${guide.fileSlug}`"
              class="px-6 py-2.5 rounded-xl bg-najmgrey hover:bg-najmgreen hover:text-white text-gray-800 text-xs font-bold text-center transition w-full"
            >
              مطالعه راهنما
            </NuxtLink>
            <a
              :href="guide.pdfUrl || '#'"
              download
              class="px-6 py-2.5 rounded-xl bg-najmgreen text-white hover:bg-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1 transition w-full shadow-xs"
            >
              <Icon name="mdi:download" class="w-4 h-4" />
              دانلود PDF
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Technical Support Contact -->
    <div class="bg-najmgreen text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
      <div class="space-y-2 max-w-xl text-right">
        <h3 class="text-2xl font-bold text-d4">نیاز به بررسی فنی فایل طراحی خود دارید؟</h3>
        <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          کارشناسان واحد لیتوگرافی و پیش از چاپ نجم فایل شما را از نظر تفکیک رنگ، خطوط تیغ و گرماژ بررسی نموده و تاییدیه فنی ارائه می‌دهند.
        </p>
      </div>
      <NuxtLink
        to="/contact"
        class="px-8 py-3.5 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition shadow-xs whitespace-nowrap"
      >
        ارسال فایل برای بررسی فنی
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'راهنماهای فنی چاپ - چاپ نجم',
  layout: 'default'
})

const guidesList = [
  {
    id: 1,
    title: 'دستورالعمل کامل تنظیم رنگ مشکی پرکلاغی (Rich Black) در چاپ افست',
    category: 'رنگ و لیتوگرافی',
    readTime: '۵ دقیقه مطالعه',
    fileSlug: 'guide-cmyk-color-profile',
    summary: 'برای دستیابی به مشکی عمیق و یکدست بدون تداخل رنگی، از ترکیب C:60 M:40 Y:40 K:100 برای سطوح بزرگ و K:100 خالص برای متون ریز استفاده نمایید.',
    pdfUrl: '#'
  },
  {
    id: 2,
    title: 'استانداردهای ساخت خطوط تیغ، خط‌تا و برجسته‌سازی در ایلاستریتور',
    category: 'قالب و تیغ‌زنی',
    readTime: '۷ دقیقه مطالعه',
    fileSlug: 'guide-bleed-and-margins',
    summary: 'نحوه تعریف رنگ‌های اسپات (Spot Color) مجزا برای خط برش (Die-line)، خط تا (Crease) و طلاکوب (Hot-foil) با قابلیت Overprint.',
    pdfUrl: '#'
  },
  {
    id: 3,
    title: 'راهنمای انتخاب گرماژ و متریال مقوا متناسب با وزن و کاربری محصول',
    category: 'متریال و کاغذ',
    readTime: '۴ دقیقه مطالعه',
    fileSlug: 'catalog-general-2026',
    summary: 'تفاوت‌های ساختاری مقوای ایندربرد (FBB)، پشت طوسی (Duplex Board) و مقواهای فلوتدار E-Flute در مقاومت فشاری و قابلیت خم‌شدن.',
    pdfUrl: '#'
  }
]
</script>
