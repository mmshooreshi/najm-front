<!-- pages/catalog.vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4">
        کاتالوگ و نمونه‌کارهای رسمی
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight text-d4">
        کاتالوگ جامع محصولات چاپ و بسته‌بندی نجم
      </h1>
      <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
        مشاهده و دریافت نسخه دیجیتال (PDF) تمامی لاین‌های تولیدی، جعبه‌های دارویی، هاردباکس‌های لوکس، ساک‌های دستی و نمونه‌های چاپ افست.
      </p>
    </div>

    <!-- Featured Catalog Hero Card -->
    <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-najmborder/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div class="lg:col-span-5 rounded-2xl bg-najmgrey/60 border border-najmborder/40 p-6 flex flex-col items-center justify-center text-center space-y-4 relative group">
        <div class="w-48 h-64 rounded-xl bg-white shadow-md border border-gray-200 overflow-hidden flex flex-col justify-between p-4 group-hover:scale-105 transition-transform duration-300">
          <div class="space-y-1 text-right">
            <span class="text-[10px] font-bold text-najmgreen">نسخه ۲۰۲۶</span>
            <h3 class="text-xs font-extrabold text-gray-900 text-d4">کاتالوگ جامع چاپ نجم</h3>
          </div>
          <div class="w-12 h-12 rounded-xl bg-najmgrey text-najmgreen flex items-center justify-center mx-auto">
            <Icon name="mdi:book-open-page-variant-outline" class="w-6 h-6" />
          </div>
          <div class="text-[9px] text-gray-400 font-mono">NAJM PACKAGING & PRINTING</div>
        </div>
        <span class="text-xs text-gray-500 font-mono">حجم: ۱۴.۲ مگابایت • فرمت: PDF</span>
      </div>

      <div class="lg:col-span-7 space-y-5">
        <div>
          <span class="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-najmgrey text-gray-800 mb-2">
            مجموعه کامل ۲۰۲۶
          </span>
          <h2 class="text-2xl font-bold text-gray-900 text-d4 mb-2">
            کاتالوگ جامع خطوط تولید و مشخصات متریال
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            این کاتالوگ شامل راهنمای جامع انتخاب گرماژ مقوا (ایندربرد، پشت طوسی، کرافت)، مقایسه خدمات تکمیلی (سلفون مات، حرارتی، طلاکوب، یووی موضعی) و نمونه‌های اجرا شده جعبه‌های دارویی، غذایی و بهداشتی است.
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div class="p-3 bg-najmgrey/50 rounded-xl border border-najmborder/40">
            <span class="block text-gray-400 text-[10px] font-sans">تعداد صفحات:</span>
            <span class="font-bold text-gray-800">۴۸ صفحه تمام‌رنگ</span>
          </div>
          <div class="p-3 bg-najmgrey/50 rounded-xl border border-najmborder/40">
            <span class="block text-gray-400 text-[10px] font-sans">آخرین بازنگری:</span>
            <span class="font-bold text-gray-800">بهار ۱۴۰۵</span>
          </div>
          <div class="p-3 bg-najmgrey/50 rounded-xl border border-najmborder/40 col-span-2 sm:col-span-1">
            <span class="block text-gray-400 text-[10px] font-sans">رزولوشن:</span>
            <span class="font-bold text-gray-800">300 DPI High-Res</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href="#"
            download
            class="flex-1 py-3.5 px-6 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <Icon name="mdi:download" class="w-4 h-4" />
            دانلود مستقیم فایل کاتالوگ (PDF)
          </a>
          <NuxtLink
            to="/contact"
            class="py-3.5 px-6 rounded-2xl bg-najmgrey hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            درخواست نمونه فیزیکی (Sample Kit)
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Specialized Catalogs Grid -->
    <div class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 text-d4">کاتالوگ‌های تخصصی دسته‌بندی‌ها</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="cat in catalogsList"
          :key="cat.id"
          class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-najmgrey text-gray-700">
                {{ cat.badge }}
              </span>
              <span class="text-xs text-gray-400 font-mono">{{ cat.size }}</span>
            </div>

            <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Icon :name="cat.icon" class="w-6 h-6" />
            </div>

            <h3 class="text-base font-bold text-gray-900 mb-2 group-hover:text-najmgreen transition-colors text-d4">
              {{ cat.title }}
            </h3>
            <p class="text-xs text-gray-600 leading-relaxed mb-6">
              {{ cat.desc }}
            </p>
          </div>

          <div class="pt-4 border-t border-gray-100 flex items-center gap-3">
            <a
              :href="cat.downloadUrl || '#'"
              download
              class="w-full py-2.5 rounded-xl bg-najmgrey hover:bg-najmgreen hover:text-white text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Icon name="mdi:download" class="w-4 h-4" />
              دانلود کاتالوگ
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Sample Box CTA -->
    <div class="bg-najmgreen text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
      <div class="space-y-2 max-w-xl text-right">
        <h3 class="text-2xl font-bold text-d4">درخواست سمپل‌باکس و کیت نمونه‌های فیزیکی</h3>
        <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          برای لمس مستقیم بافت مقواها، تست پوشش‌های سلفونی و بررسی نمونه تیغ‌زنی‌ها، کیت نمونه رایگان ما را برای سازمان خود سفارش دهید.
        </p>
      </div>
      <NuxtLink
        to="/contact"
        class="px-8 py-3.5 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition shadow-xs whitespace-nowrap"
      >
        سفارش کیت نمونه فیزیکی
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'کاتالوگ محصولات - چاپ نجم',
  layout: 'default'
})

const catalogsList = [
  {
    id: 1,
    title: 'کاتالوگ هاردباکس و بسته‌بندی لوکس',
    desc: 'انواع جعبه‌های مگنتی، جعبه‌های کشویی، روکش‌های گالینگور و مخمل مناسب هدایای سازمانی و عطریات.',
    size: '۱۸.۵ مگابایت',
    badge: 'هاردباکس و لوکس',
    icon: 'mdi:package-variant-closed',
    downloadUrl: '#'
  },
  {
    id: 2,
    title: 'کاتالوگ جعبه‌های دارویی و بهداشتی',
    desc: 'راهنمای مقواهای ایندربرد بهداشتی، خطوط بریل استاندارد و ساختارهای قفل خودکار و دارویی.',
    size: '۱۱.۲ مگابایت',
    badge: 'دارو و بهداشت',
    icon: 'mdi:pill',
    downloadUrl: '#'
  },
  {
    id: 3,
    title: 'کاتالوگ ساک دستی و شاپینگ بگ',
    desc: 'تنوع ابعاد استاندارد، انواع بندهای کنفی و روبانی و جدول مقاومت وزنی کاغذهای گلاسه و کرافت.',
    size: '۸.۷ مگابایت',
    badge: 'ساک دستی',
    icon: 'mdi:shopping-outline',
    downloadUrl: '#'
  }
]
</script>
