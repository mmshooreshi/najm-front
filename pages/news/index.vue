<!-- pages/news/index.vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-najmback pb-28 text-gray-800">
    <!-- Header -->
    <header class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
      <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4">
        اخبار و رویدادهای مجتمع چاپ نجم
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight text-d4">
        آخرین اخبار و اطلاعیه‌های صنعتی
      </h1>
      <p class="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
        گزارش حضور در نمایشگاه‌های بین‌المللی چاپ و بسته‌بندی، تجهیز خطوط تولید جدید و توسعه ناوگان لجستیک مجتمع نجم.
      </p>
    </header>

    <!-- News Grid -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="item in newsList"
          :key="item.id"
          class="bg-white rounded-3xl overflow-hidden shadow-xs border border-najmborder/40 hover:shadow-md hover:border-najmgreen transition-all duration-300 flex flex-col justify-between group"
        >
          <div class="space-y-4">
            <!-- News Thumbnail -->
            <NuxtLink :to="`/news/${item.slug}`" class="block aspect-[16/10] overflow-hidden bg-gray-100 relative">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-najmgreen text-white text-[10px] font-bold text-d4 shadow-xs">
                {{ item.category }}
              </span>
            </NuxtLink>

            <!-- News Details -->
            <div class="p-6 pt-0 space-y-3 text-right">
              <div class="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                <Icon name="mdi:calendar-outline" class="w-3.5 h-3.5" />
                <span>{{ item.date }}</span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-gray-900 text-d4 group-hover:text-najmgreen transition-colors leading-snug">
                <NuxtLink :to="`/news/${item.slug}`">
                  {{ item.title }}
                </NuxtLink>
              </h2>

              <p class="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                {{ item.excerpt }}
              </p>
            </div>
          </div>

          <!-- Card Action -->
          <div class="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-100 text-xs font-bold text-najmgreen text-d4">
            <NuxtLink :to="`/news/${item.slug}`" class="hover:underline flex items-center gap-1">
              <span>مشاهده بیانیه کامل</span>
              <Icon name="mdi:arrow-left" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'اخبار و رویدادها - چاپ نجم',
  layout: 'default'
})

const newsList = [
  {
    id: 1,
    slug: 'tehran-pack-print-expo-2026',
    title: 'حضور پرشور مجتمع چاپ نجم در سی‌امین نمایشگاه بین‌المللی چاپ و بسته‌بندی تهران',
    excerpt: 'رونمایی از جدیدترین ساختارهای هاردباکس‌های مگنتی هوشمند، جعبه‌های فودگرید بهداشتی و سامانه آنلاین استعلام سفارشات در سالن اصلی.',
    category: 'رویداد و نمایشگاه',
    image: '/images/about/staff.png',
    date: '۲۸ اردیبهشت ۱۴۰۴'
  },
  {
    id: 2,
    slug: 'heidelberg-new-press-installation',
    title: 'تجهیز خط دوم چاپ افست ۵ رنگ هایدلبرگ Speedmaster در سایت شماره ۲ نجم',
    excerpt: 'با راه‌اندازی این خط، ظرفیت تحویل سفارشات فوری بسته‌بندی دارویی و بهداشتی مجموعه تا ۴۰ درصد افزایش یافت.',
    category: 'توسعه کارخانه',
    image: '/images/about/machines-1.png',
    date: '۱۵ اردیبهشت ۱۴۰۴'
  },
  {
    id: 3,
    slug: 'iso-12647-color-certificate-renewal',
    title: 'تمدید گواهینامه بین‌المللی انطباق رنگ چاپ افست ISO 12647-2 برای سال ۲۰۲۶',
    excerpt: 'ممیزی جامع سیستم‌های لیتوگرافی CTP و دانسیتومتری آنلاین چاپخانه نجم با بالاترین امتیاز استاندارد کیفی به پایان رسید.',
    category: 'استاندارد و کیفیت',
    image: '/images/about/machines-small-1.png',
    date: '۳ اردیبهشت ۱۴۰۴'
  }
]
</script>
