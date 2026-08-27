<!-- pages/blog/[slug].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen bg-najmback pb-28 text-gray-800">
    <!-- Article Header -->
    <header class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <NuxtLink to="/" class="hover:text-najmgreen transition">{{ isRTL ? 'خانه' : 'Home' }}</NuxtLink>
        <span>/</span>
        <NuxtLink to="/blog" class="hover:text-najmgreen transition">{{ isRTL ? 'وبلاگ' : 'Blog' }}</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-bold text-d4 break-words" v-editable="'title'">{{ currentPost.title }}</span>
      </nav>

      <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen text-d4 break-words" v-editable="'categoryLabel'">
        {{ currentPost.categoryLabel }}
      </span>

      <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight text-d4 break-words" v-editable="'title'">
        {{ currentPost.title }}
      </h1>

      <div class="flex items-center gap-4 text-xs text-gray-500 border-y border-gray-200 py-3 flex-wrap">
        <div class="flex items-center gap-1.5">
          <Icon name="mdi:account-outline" class="w-4 h-4 text-najmgreen" />
          <span class="font-bold text-gray-700" v-editable="'author'">{{ currentPost.author }}</span>
        </div>
        <span>•</span>
        <div class="flex items-center gap-1.5">
          <Icon name="mdi:calendar-outline" class="w-4 h-4" />
          <span v-editable="'date'">{{ currentPost.date }}</span>
        </div>
        <span>•</span>
        <div class="flex items-center gap-1.5">
          <Icon name="mdi:clock-outline" class="w-4 h-4" />
          <span>{{ isRTL ? 'زمان مطالعه:' : 'Read Time:' }} <span v-editable="'readTime'">{{ currentPost.readTime }}</span></span>
        </div>
      </div>
    </header>

    <!-- Main Article Body -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <!-- Feature Image -->
      <div class="rounded-3xl overflow-hidden shadow-sm aspect-[16/9] bg-white border border-najmborder/40 p-4 flex items-center justify-center">
        <img
          :src="currentPost.image"
          :alt="currentPost.title"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Editorial Paragraphs -->
      <div class="bg-white rounded-3xl p-6 sm:p-12 shadow-xs border border-najmborder/40 space-y-8 text-right leading-relaxed text-sm sm:text-base text-gray-700">
        <p class="text-base sm:text-lg font-bold text-gray-900 leading-relaxed text-d4 border-r-4 border-najmgreen pr-4 break-words" v-editable="'excerpt'">
          {{ currentPost.excerpt }}
        </p>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-gray-900 text-d4 break-words" v-editable="'section1Title'">
            {{ currentPost.section1Title || '۱. اهمیت انتخاب متریال متناسب با کاربرد نهایی' }}
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 leading-loose break-words" v-editable="'section1Body'">
            {{ currentPost.section1Body || 'در صنعت چاپ و بسته‌بندی مدرن، انتخاب اشتباه نوع مقوا می‌تواند هزینه‌های گزافی را در خطوط پرکنی اتوماتیک، مقاومت کارتن در چیدمان پالت یا رفتار متریال در شرایط دمایی و رطوبتی مختلف به همراه داشته باشد. مقوای ایندربرد (FBB) با ساختار چند لایه خمیر شیمیایی و مکانیکی، بالاترین سفتی (Stiffness) و دانسیته را نسبت به وزن خود ارائه می‌دهد.' }}
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-gray-900 text-d4 break-words" v-editable="'section2Title'">
            {{ currentPost.section2Title || '۲. رفتارهای فنی در تیغ‌زنی، خط‌تا و چسب لاک‌باتم' }}
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 leading-loose break-words" v-editable="'section2Body'">
            {{ currentPost.section2Body || 'خط‌تا (Creasing) بدون شکستگی الیاف نیازمند کالیبراسیون دقیق کانال ماتریس دایکات متناسب با ضخامت میکرونی مقوا است. در خطوط جعبه‌چسبانی با سرعت ۵۰,۰۰۰ جعبه در ساعت، سرعت جذب چسب و انعطاف زبانه‌ها نقشی حیاتی در جلوگیری از توقف خطوط تولید بازی می‌کند.' }}
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-xl font-bold text-gray-900 text-d4 break-words" v-editable="'section3Title'">
            {{ currentPost.section3Title || '۳. توصیه‌های مهندسی چاپ مجتمع نجم' }}
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 leading-loose break-words" v-editable="'section3Body'">
            {{ currentPost.section3Body || 'پیش از نهایی‌سازی سفارشات در تیراژهای بالا، همواره ساخت ماکت سه‌بعدی بدون چاپ و تست پرکنی فیزیکی با محصول واقعی پیشنهاد می‌شود. کارشناسان ما در مجتمع نجم آماده‌اند تا فرمولاسیون دقیق گرماژ و ابعاد را متناسب با نیاز برند شما تنظیم نمایند.' }}
          </p>
        </section>
      </div>

      <!-- Author Bio & CTAs -->
      <div class="bg-najmgreen text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-right">
        <div class="space-y-2">
          <h3 class="text-lg font-bold text-d4 break-words" v-editable="'ctaTitle'">
            {{ currentPost.ctaTitle || 'نیاز به مشاوره فنی در انتخاب متریال پروژه دارید؟' }}
          </h3>
          <p class="text-xs text-emerald-100 break-words" v-editable="'ctaDesc'">
            {{ currentPost.ctaDesc || 'تیم مهندسی بسته‌بندی نجم آماده پاسخگویی به پرسش‌های فنی و ارسال سمپل‌باکس است.' }}
          </p>
        </div>
        <NuxtLink
          to="/contact"
          class="px-6 py-3 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition whitespace-nowrap shadow-xs text-d4"
        >
          <span v-editable="'ctaBtn'">{{ currentPost.ctaBtn || 'درخواست مشاوره رایگان' }}</span>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'

definePageMeta({
  name: 'مقاله تخصصی وبلاگ - چاپ نجم',
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')
const pageSlug = computed(() => `blog-${slug.value}`)

const { ui, allUi } = usePageUI(pageSlug.value)
useAdminEditable(pageSlug.value, allUi)

const fallbackPost = {
  title: 'مقایسه جامع مقوای ایندربرد و پشت طوسی در بسته‌بندی دارویی و بهداشتی',
  excerpt: 'بررسی تفاوت‌های بهداشتی، گرماژ، سفتی و رفتار مقوا در برابر رطوبت و تیغ دایکات در خطوط بسته‌بندی تمام‌اتوماتیک.',
  categoryLabel: 'متریال و مقوا',
  image: '/images/svg/open-paper-box-mockup-half-side-view-2-8943.svg',
  date: '۲۵ اردیبهشت ۱۴۰۴',
  readTime: '۶ دقیقه',
  author: 'واحد مهندسی متریال نجم'
}

const currentPost = computed(() => {
  return {
    ...fallbackPost,
    ...(ui.value || {})
  }
})
</script>
