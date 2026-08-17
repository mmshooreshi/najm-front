<!-- pages/products/packaging/[slug].vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-gray-500">
      <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen">محصولات</NuxtLink>
      <span>/</span>
      <span class="text-gray-400">بسته‌بندی</span>
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
            تولید اختصاصی
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
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-najmgreen mb-2">
            دسته‌بندی بسته‌بندی و جعبه‌سازی
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
            <span class="block text-[11px] text-gray-500 mb-0.5">نوع چاپ:</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900">افست ۵ رنگ هایدلبرگ</span>
          </div>
        </div>

        <!-- Material & Finishing options -->
        <div class="space-y-3 pt-2">
          <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">متریال و گرماژهای قابل سفارش:</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="mat in product.materials"
              :key="mat"
              class="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-medium"
            >
              {{ mat }}
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider">خدمات تکمیلی پس از چاپ:</h3>
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
            درخواست استعلام قیمت و ابعاد
          </NuxtLink>
          <NuxtLink
            to="/resources"
            class="py-3.5 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm text-center transition flex items-center justify-center gap-2"
          >
            <Icon name="mdi:download" class="w-4 h-4" />
            دانلود قالب تیغ (Die-Cut)
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Technical Specs & Features Detail -->
    <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 space-y-6">
      <h2 class="text-xl font-bold text-gray-900">مشخصات فنی و استانداردهای تولید</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div class="flex justify-between py-3 border-b border-gray-100">
          <span class="text-gray-500">قابلیت سفارشی‌سازی ابعاد:</span>
          <span class="font-semibold text-gray-800">کاملاً نامحدود بر اساس ساختار محصول شما</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100">
          <span class="text-gray-500">تست استحکام و مقاومت:</span>
          <span class="font-semibold text-gray-800">تست فشار و خمش (BCT / ECT)</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100">
          <span class="text-gray-500">نوع چسب و اتصال:</span>
          <span class="font-semibold text-gray-800">چسب گرم و سرد خطی / لاک‌باتم اتوماتیک</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100">
          <span class="text-gray-500">پوشش‌های محافظتی:</span>
          <span class="font-semibold text-gray-800">سلفون مات، براق، ضدخش و واتربیس</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  name: 'جزئیات بسته‌بندی - چاپ نجم',
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')
const selectedImage = ref<string | null>(null)

const packagingDatabase: Record<string, any> = {
  boxes: {
    name: 'انواع جعبه‌های مقوایی و هاردباکس',
    description: 'تولید انواع جعبه‌های درب دارویی، قفل خودکار (لاک باتم)، کشویی، کیبوردی و هاردباکس مگنتی با بالاترین کیفیت تیغ‌زنی و چاپ.',
    minOrder: '۱,۰۰۰ عدد',
    leadTime: '۷ الی ۱۰ روز کاری',
    image: '/images/products/test.png',
    gallery: ['/images/products/test.png'],
    materials: ['مقوای ایندربرد (۲۵0 تا ۳۵۰ گرم)', 'مقوای پشت طوسی', 'کرافت سنگین', 'مقوای فانتزی و فلوت دار'],
    finishes: ['سلفون مات / براق', 'یووی موضعی برجسته', 'طلاکوب و نقره‌کوب گرم', 'امباس و برجسته‌سازی']
  },
  'shopping-bags': {
    name: 'ساک‌های دستی کاغذی و مقوایی (شاپینگ بگ)',
    description: 'ساک دستی تبلیغاتی و فروشگاهی با انواع بند کنفی، روبانی و کاغذی با تقویت کف و دسته‌ها برای تحمل وزن بالا.',
    minOrder: '۵۰۰ عدد',
    leadTime: '۵ الی ۷ روز کاری',
    image: '/images/products/test.png',
    gallery: ['/images/products/test.png'],
    materials: ['گلاسه ۱۷۰ تا ۲۵۰ گرم', 'کرافت سوئدی', 'مقوای کارتی'],
    finishes: ['سلفون حرارتی', 'طلاکوب روی لوگو', 'یووی شنی و موضعی']
  }
}

const product = computed(() => {
  const s = slug.value
  if (packagingDatabase[s]) return packagingDatabase[s]
  return {
    name: s.replace(/-/g, ' '),
    description: 'تولید تخصصی بسته‌بندی با کیفیت صادراتی و خطوط اختصاصی چاپ و تیغ‌زنی مجتمع نجم.',
    minOrder: '۱,۰۰۰ عدد',
    leadTime: '۷ روز کاری',
    image: '/images/products/test.png',
    gallery: ['/images/products/test.png'],
    materials: ['مقوای ایندربرد', 'کرافت', 'گلاسه سنگین'],
    finishes: ['سلفون مات', 'یووی موضعی', 'طلاکوب']
  }
})
</script>