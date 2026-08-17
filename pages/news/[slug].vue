<!-- pages/news/[slug].vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-najmback pb-28 text-gray-800">
    <!-- Header -->
    <header class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 text-right">
      <nav class="flex items-center gap-2 text-xs text-gray-500">
        <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
        <span>/</span>
        <NuxtLink to="/news" class="hover:text-najmgreen">اخبار</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-bold text-d4">{{ currentNews.title }}</span>
      </nav>

      <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen text-d4">
        {{ currentNews.category }}
      </span>

      <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight text-d4">
        {{ currentNews.title }}
      </h1>

      <div class="flex items-center gap-3 text-xs text-gray-400 border-y border-gray-200 py-3 font-mono">
        <Icon name="mdi:calendar-outline" class="w-4 h-4 text-najmgreen" />
        <span>انتشار: {{ currentNews.date }}</span>
        <span>•</span>
        <span>روابط عمومی مجتمع چاپ نجم</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="rounded-3xl overflow-hidden shadow-sm aspect-[16/9] bg-white border border-najmborder/40 p-3">
        <img
          :src="currentNews.image"
          :alt="currentNews.title"
          class="w-full h-full object-cover rounded-2xl"
        />
      </div>

      <div class="bg-white rounded-3xl p-6 sm:p-12 shadow-xs border border-najmborder/40 space-y-6 text-right leading-relaxed text-sm sm:text-base text-gray-700">
        <p class="text-base sm:text-lg font-bold text-gray-900 leading-relaxed text-d4 border-r-4 border-najmgreen pr-4">
          {{ currentNews.excerpt }}
        </p>

        <p class="text-xs sm:text-sm text-gray-600 leading-loose">
          در راستای توسعه مداوم خطوط تولید و پاسخگویی به تقاضای فزاینده بازار بسته‌بندی‌های دارویی و صادراتی، مجتمع چاپ نجم برنامه‌های توسعه‌ای خود را با شتابی دوچندان پیگیری می‌کند. این دستاورد حاصل همراهی و اعتماد کارفرمایان و برندهای ارجمند در سراسر کشور است.
        </p>

        <p class="text-xs sm:text-sm text-gray-600 leading-loose">
          جهت هماهنگی جلسات حضوری و بازدید از خطوط تولید جدید، می‌توانید با واحد روابط عمومی و توسعه بازار مجتمع تماس حاصل فرمایید.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  name: 'خبر و اطلاعیه - چاپ نجم',
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')

const currentNews = computed(() => {
  return {
    title: 'حضور پرشور مجتمع چاپ نجم در سی‌امین نمایشگاه بین‌المللی چاپ و بسته‌بندی تهران',
    excerpt: 'رونمایی از جدیدترین ساختارهای هاردباکس‌های مگنتی هوشمند، جعبه‌های فودگرید بهداشتی و سامانه آنلاین استعلام سفارشات در سالن اصلی.',
    category: 'رویداد و نمایشگاه',
    image: '/images/about/staff.png',
    date: '۲۸ اردیبهشت ۱۴۰۴'
  }
})
</script>
