<!-- pages/products/printing/[slug].vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-gray-500">
      <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen">محصولات</NuxtLink>
      <span>/</span>
      <span class="text-gray-400">چاپ تجاری و اداری</span>
      <span>/</span>
      <span class="text-gray-900 font-semibold">{{ product.name }}</span>
    </nav>

    <!-- Product Hero Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 items-start">
      <!-- Media Gallery -->
      <div class="lg:col-span-6 space-y-4">
        <div class="rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center relative group">
          <NuxtImg
            :src="selectedImage || product.image"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span class="absolute top-4 right-4 px-3 py-1 rounded-full bg-najmgreen text-white text-xs font-semibold">
            چاپ افست پیشرفته
          </span>
        </div>

        <div v-if="product.gallery?.length" class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="(img, idx) in product.gallery"
            :key="idx"
            @click="selectedImage = img"
            class="w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all"
            :class="selectedImage === img ? 'border-najmgreen ring-2 ring-najmgreen/20' : 'border-gray-200 hover:border-gray-300'"
          >
            <NuxtImg :src="img" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Product Meta & Highlights -->
      <div class="lg:col-span-6 space-y-6">
        <div>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-2">
            خدمات چاپ تجاری، اداری و کاتالوگ
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {{ product.name }}
          </h1>
          <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- Badges / Key Specs -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div class="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span class="block text-[11px] text-gray-500 mb-0.5">حداقل تیراژ:</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 font-mono">{{ product.minOrder }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span class="block text-[11px] text-gray-500 mb-0.5">زمان تحویل:</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900">{{ product.leadTime }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 col-span-2 sm:col-span-1">
            <span class="block text-[11px] text-gray-500 mb-0.5">نوع کاغذ:</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900">گلاسه، تحریر و کتان</span>
          </div>
        </div>

        <!-- Paper Types -->
        <div class="space-y-3 pt-2">
          <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">انواع کاغذ و گرماژ قابل سفارش:</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="paper in product.papers"
              :key="paper"
              class="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-medium"
            >
              {{ paper }}
            </span>
          </div>
        </div>

        <!-- Finishing -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">پوشش‌ها و صحافی:</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="finish in product.finishes"
              :key="finish"
              class="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-medium"
            >
              {{ finish }}
            </span>
          </div>
        </div>

        <!-- Action CTA -->
        <div class="pt-4 flex flex-col sm:flex-row gap-3">
          <NuxtLink
            to="/contact"
            class="flex-1 py-3.5 px-6 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-semibold text-sm text-center shadow-sm transition"
          >
            استعلام تیراژ و قیمت چاپ
          </NuxtLink>
          <NuxtLink
            to="/resources"
            class="py-3.5 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm text-center transition flex items-center justify-center gap-2"
          >
            <Icon name="mdi:palette-swatch-outline" class="w-4 h-4" />
            راهنمای تنظیم رنگ CMYK
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  name: 'جزئیات چاپ - چاپ نجم',
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')
const selectedImage = ref<string | null>(null)

const printingDatabase: Record<string, any> = {
  letterhead: {
    name: 'سربرگ و ست اداری اختصاصی',
    description: 'چاپ سربرگ A4 و A5 بر روی انواع کاغذ تحریر ۸۰ و ۱۰۰ گرم خارجی و کاغذهای کتان و فانتزی با ثبات رنگی دقیق سازمانی.',
    minOrder: '۱,۰۰۰ برگ',
    leadTime: '۳ الی ۵ روز کاری',
    image: '/images/products/test.png',
    gallery: ['/images/products/test.png'],
    papers: ['تحریر ۸۰ گرم اندونزی', 'تحریر ۱۰۰ گرم', 'کتان آلمان ۱۲۰ گرم', 'کرافت'],
    finishes: ['چاپ تک‌رنگ و ۴ رنگ اختصاصی', 'طلاکوب آرم و لوگو', 'برجسته‌سازی (امباس)']
  },
  envelopes: {
    name: 'پاکت‌نامه و پاکت A4 اداری',
    description: 'تولید انواع پاکت ملخی، پاکت A4 و A5 با چسب درب اختصاصی، آستر داخلی چاپی و مقاومت بالا در حمل اوراق اداری.',
    minOrder: '۱,۰۰۰ عدد',
    leadTime: '۵ الی ۷ روز کاری',
    image: '/images/products/test.png',
    gallery: ['/images/products/test.png'],
    papers: ['تحریر ۱۰۰ و ۱۲۰ گرم', 'گلاسه ۱۳۵ و ۱۵۰ گرم', 'کتان کهلر'],
    finishes: ['چسب دوطرفه آماده درب پاکت', 'چاپ داخل پاکت (Security Pattern)', 'طلاکوب']
  },
  'business-cards': {
    name: 'کارت ویزیت‌های خاص و مدیریتی',
    description: 'تنوع گسترده کارت‌های ویزیت لمینت برجسته، سلفون مخملی، طلاکوب گرم، PVC و لترپرس روی مقواهای گرماژ بالا.',
    minOrder: '۵۰۰ عدد',
    leadTime: '۳ الی ۶ روز کاری',
    image: '/images/products/test.png',
    gallery: ['/images/products/test.png'],
    papers: ['ایندربرد ۳۵۰ گرم', 'کتان فابریانو', 'گلاسه ۳۰۰ گرم دبل', 'PVC مات و شفاف'],
    finishes: ['سلفون مخملی (Soft Touch)', 'یووی موضعی شنی', 'لبه‌رنگ طلایی و نقره‌ای']
  },
  'brochures-catalogs': {
    name: 'بروشور و کاتالوگ‌های صنعتی و تبلیغاتی',
    description: 'چاپ کاتالوگ‌های چندصفحه‌ای با انواع صحافی منگنه ساده، منگنه لوپ، چسب گرم و فنر دوبل با پوشش‌های سلفون و یووی.',
    minOrder: '۵۰۰ جلد',
    leadTime: '۷ الی ۱۰ روز کاری',
    image: '/images/products/test.png',
    gallery: ['/images/products/test.png'],
    papers: ['گلاسه ۱۳۵ تا ۳۰۰ گرم', 'کاغذهای بافت‌دار و بازیافتی'],
    finishes: ['صحافی چسب گرم اتوماتیک PUR', 'سلفون مات حرارتی', 'یووی موضعی روی جلد']
  }
}

const product = computed(() => {
  const s = slug.value
  if (printingDatabase[s]) return printingDatabase[s]
  return {
    name: s.replace(/-/g, ' '),
    description: 'چاپ با بالاترین کیفیت تفکیک رنگ و استاندارد افست هایدلبرگ در چاپ نجم.',
    minOrder: '۱,۰۰۰ عدد',
    leadTime: '۵ روز کاری',
    image: '/images/products/test.png',
    gallery: ['/images/products/test.png'],
    papers: ['گلاسه', 'تحریر', 'کتان'],
    finishes: ['سلفون', 'یووی', 'طلاکوب']
  }
})
</script>