<!-- pages/blog/index.vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-najmback pb-28 text-gray-800">
    <!-- Header -->
    <header class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
      <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4">
        دانشنامه و مقالات تخصصی چاپ و بسته‌بندی
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight text-d4">
        وبلاگ تخصصی مجتمع چاپ نجم
      </h1>
      <p class="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
        جدیدترین مقالات، راهنماهای انتخاب متریال مقوا، تکنیک‌های پیشرفته پس از چاپ، مقایسه‌های فنی و استانداردهای طراحی بسته‌بندی صادراتی.
      </p>

      <!-- Category Filter Pills -->
      <div class="flex items-center justify-center gap-2 pt-4 flex-wrap">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer text-d4"
          :class="[
            selectedCategory === cat.id
              ? 'bg-najmgreen text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-najmborder/60'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>
    </header>

    <!-- Articles Grid -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="bg-white rounded-3xl overflow-hidden shadow-xs border border-najmborder/40 hover:shadow-md hover:border-najmgreen transition-all duration-300 flex flex-col justify-between group"
        >
          <div class="space-y-4">
            <!-- Article Image -->
            <NuxtLink :to="`/blog/${post.slug}`" class="block aspect-[16/10] overflow-hidden bg-gray-100 relative">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-najmgreen text-white text-[10px] font-bold text-d4 shadow-xs">
                {{ post.categoryLabel }}
              </span>
            </NuxtLink>

            <!-- Content Details -->
            <div class="p-6 pt-0 space-y-3 text-right">
              <div class="flex items-center gap-2 text-[11px] text-gray-400">
                <span>{{ post.date }}</span>
                <span>•</span>
                <span>زمان مطالعه: {{ post.readTime }}</span>
              </div>

              <h2 class="text-base sm:text-lg font-bold text-gray-900 text-d4 group-hover:text-najmgreen transition-colors leading-snug">
                <NuxtLink :to="`/blog/${post.slug}`">
                  {{ post.title }}
                </NuxtLink>
              </h2>

              <p class="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                {{ post.excerpt }}
              </p>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-100 text-xs font-bold text-najmgreen text-d4">
            <NuxtLink :to="`/blog/${post.slug}`" class="hover:underline flex items-center gap-1">
              <span>مطالعه کامل مقاله</span>
              <Icon name="mdi:arrow-left" class="w-4 h-4" />
            </NuxtLink>
            <span class="text-gray-400 font-normal text-[11px]">نویسنده: {{ post.author }}</span>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  name: 'وبلاگ و مقالات آموزشی - چاپ نجم',
  layout: 'default'
})

const selectedCategory = ref('all')

const categories = [
  { id: 'all', label: 'همه مقالات' },
  { id: 'materials', label: 'متریال و انواع مقوا' },
  { id: 'packaging', label: 'طراحی ساختار بسته‌بندی' },
  { id: 'finishing', label: 'تکنیک‌های چاپ و پس از چاپ' },
  { id: 'export', label: 'استانداردهای صادراتی' }
]

const posts = [
  {
    id: 1,
    slug: 'inboard-vs-greyboard-packaging',
    title: 'مقایسه جامع مقوای ایندربرد و پشت طوسی در بسته‌بندی دارویی و بهداشتی',
    excerpt: 'کدام مقوا برای بسته‌بندی محصولات شما مناسب‌تر است؟ بررسی تفاوت‌های بهداشتی، گرماژ، سفتی و رفتار مقوا در برابر رطوبت و تیغ دایکات.',
    category: 'materials',
    categoryLabel: 'متریال و مقوا',
    image: '/images/svg/open-paper-box-mockup-half-side-view-2-8943.svg',
    date: '۲۵ اردیبهشت ۱۴۰۴',
    readTime: '۶ دقیقه',
    author: 'مهندسی متریال نجم'
  },
  {
    id: 2,
    slug: 'luxury-hardbox-finishing-guide',
    title: 'راهنمای انتخاب سلفون مخملی، یووی موضعی و طلاکوب در ساخت هاردباکس',
    excerpt: 'چگونه با ترکیب جلوه‌های ویژه پس از چاپ، ارزش ادراک‌شده برند را ارتقا دهیم؟ نکات کلیدی برای جلوگیری از خطای هم‌پوشانی طلا و سلفون.',
    category: 'finishing',
    categoryLabel: 'تکنیک‌های چاپ',
    image: '/images/svg/floating-square-gIft-box-mockup-2-6828.svg',
    date: '۱۸ اردیبهشت ۱۴۰۴',
    readTime: '۸ دقیقه',
    author: 'تیم تحقیق و توسعه'
  },
  {
    id: 3,
    slug: 'offset-vs-digital-printing-guide',
    title: 'تفاوت چاپ افست ورقی و چاپ دیجیتال در تیراژهای صنعتی و تجاری',
    excerpt: 'تحلیل دقیق نقطه سربی (Break-even Point) اقتصادی در انتخاب میان افست و دیجیتال بر اساس تیراژ، سرعت، ثبات رنگ و سایز فرم.',
    category: 'finishing',
    categoryLabel: 'تکنیک‌های چاپ',
    image: '/images/sections/printing/Free_Stationery_Mockup_psd-960x640.jpg',
    date: '۱۰ اردیبهشت ۱۴۰۴',
    readTime: '۵ دقیقه',
    author: 'سرپرست خطوط افست'
  },
  {
    id: 4,
    slug: 'packaging-design-export-standards',
    title: 'اصول طراحی بسته‌بندی صادراتی برای بازارهای حوزه خلیج فارس و اوراسیا',
    excerpt: 'از استانداردهای ابعاد پالت‌های باربری تا انتخاب مرکب‌های مقاوم به نور خورشید و تست مقاومت کارتن‌های ایفلوت در مسیرهای طولانی ترانزیت.',
    category: 'export',
    categoryLabel: 'صادرات',
    image: '/images/svg/cardboard-paper-box-with-handle-mockup-2-10296.svg',
    date: '۲ اردیبهشت ۱۴۰۴',
    readTime: '۷ دقیقه',
    author: 'واحد توسعه صادرات'
  },
  {
    id: 5,
    slug: 'auto-bottom-vs-straight-tuck-boxes',
    title: 'بررسی ساختار جعبه لاک‌باتم (Auto-Bottom) در مقایسه با جعبه‌های درب دارویی',
    excerpt: 'چرا کارخانجات بزرگ دارویی و آرایشی استفاده از ساختار جعبه لاک‌باتم را برای افزایش راندمان خطوط بسته‌بندی ترجیح می‌دهند؟',
    category: 'packaging',
    categoryLabel: 'طراحی ساختار',
    image: '/images/svg/kraft-paper-open-mailing-box-mockup-2-6737.svg',
    date: '۲۲ فروردین ۱۴۰۴',
    readTime: '۵ دقیقه',
    author: 'واحد طراحی قالب'
  },
  {
    id: 6,
    slug: 'eco-friendly-kraft-packaging-trends',
    title: 'روند صعودی بسته‌بندی‌های سبز و مقواهای کرافت بازیافت‌پذیر در سال ۲۰۲۶',
    excerpt: 'چگونه برندهای پیشرو با جایگزینی پلاستیک با کاغذهای کرافت و مرکب‌های پایه سویا، وفاداری مشتریان نسل جدید را جلب می‌کنند.',
    category: 'materials',
    categoryLabel: 'متریال و مقوا',
    image: '/images/svg/free-kraft-paper-shopping-bag-mockup-1.svg',
    date: '۱۵ فروردین ۱۴۰۴',
    readTime: '۶ دقیقه',
    author: 'دپارتمان پایداری'
  }
]

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') return posts
  return posts.filter(p => p.category === selectedCategory.value)
})
</script>
