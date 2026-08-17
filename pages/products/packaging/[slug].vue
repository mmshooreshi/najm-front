<!-- pages/products/packaging/[slug].vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 bg-najmback">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-gray-500">
      <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen">محصولات</NuxtLink>
      <span>/</span>
      <span class="text-gray-400">بسته‌بندی</span>
      <span>/</span>
      <span class="text-gray-900 font-bold text-d4">{{ product.name }}</span>
    </nav>

    <!-- Product Hero Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-najmborder/40 items-start">
      <!-- Media Gallery -->
      <div class="lg:col-span-6 space-y-4">
        <div class="rounded-3xl overflow-hidden bg-[#F7F9FA] border border-najmborder/40 aspect-square flex items-center justify-center relative group p-6">
          <img
            :src="selectedImage || product.image"
            :alt="product.name"
            class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <span class="absolute top-4 right-4 px-3 py-1 rounded-full bg-najmgreen text-white text-xs font-bold text-d4 shadow-2xs">
            تولید اختصاصی
          </span>
        </div>

        <div v-if="product.gallery?.length" class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="(img, idx) in product.gallery"
            :key="idx"
            @click="selectedImage = img"
            class="w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all bg-[#F7F9FA] p-1.5 cursor-pointer"
            :class="selectedImage === img || (!selectedImage && idx === 0) ? 'border-najmgreen ring-2 ring-najmgreen/20' : 'border-gray-200 hover:border-gray-300'"
          >
            <img :src="img" :alt="product.name" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Product Meta & Highlights -->
      <div class="lg:col-span-6 space-y-6">
        <div>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 mb-2 text-d4">
            دسته‌بندی بسته‌بندی و جعبه‌سازی
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 text-d4 leading-tight">
            {{ product.name }}
          </h1>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- Badges / Key Specs -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-right">
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
            <span class="block text-[11px] text-gray-500 mb-0.5">حداقل تیراژ:</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 text-d4">{{ product.minOrder }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
            <span class="block text-[11px] text-gray-500 mb-0.5">زمان تحویل:</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 text-d4">{{ product.leadTime }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40 col-span-2 sm:col-span-1">
            <span class="block text-[11px] text-gray-500 mb-0.5">نوع چاپ:</span>
            <span class="text-xs sm:text-sm font-bold text-najmgreen text-d4">افست ۵ رنگ هایدلبرگ</span>
          </div>
        </div>

        <!-- Material & Finishing options -->
        <div class="space-y-2.5 pt-2">
          <h3 class="text-xs font-bold text-gray-900 tracking-wider text-d4">متریال و گرماژهای قابل سفارش:</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="mat in product.materials"
              :key="mat"
              class="px-3 py-1.5 rounded-xl bg-najmgrey text-gray-800 text-xs font-medium border border-najmborder/40"
            >
              {{ mat }}
            </span>
          </div>
        </div>

        <div class="space-y-2.5">
          <h3 class="text-xs font-bold text-gray-900 tracking-wider text-d4">خدمات تکمیلی پس از چاپ:</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="finish in product.finishes"
              :key="finish"
              class="px-3 py-1.5 rounded-xl bg-najmgrey text-gray-800 text-xs font-medium border border-najmborder/40"
            >
              {{ finish }}
            </span>
          </div>
        </div>

        <!-- Action CTA -->
        <div class="pt-4 flex flex-col sm:flex-row gap-3">
          <NuxtLink
            to="/contact"
            class="flex-1 py-3.5 px-6 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs text-center shadow-xs transition text-d4"
          >
            درخواست استعلام قیمت و ابعاد
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="py-3.5 px-6 rounded-2xl bg-najmgrey hover:bg-gray-200 text-gray-800 font-bold text-xs text-center transition flex items-center justify-center gap-2 text-d4"
          >
            <Icon name="mdi:download" class="w-4 h-4 text-najmgreen" />
            دانلود کاتالوگ و قالب تیغ
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Technical Specs & Features Detail -->
    <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-najmborder/40 space-y-6">
      <h2 class="text-lg font-bold text-gray-900 text-d4">مشخصات فنی و استانداردهای تولید</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div class="flex justify-between py-3 border-b border-gray-100">
          <span class="text-gray-500">قابلیت سفارشی‌سازی ابعاد:</span>
          <span class="font-semibold text-gray-800">کاملاً نامحدود بر اساس ساختار محصول شما</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100">
          <span class="text-gray-500">تست استحکام و مقاومت:</span>
          <span class="font-semibold text-gray-800">تست فشار و خمش استاندارد (BCT / ECT)</span>
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
const slug = computed(() => (route.params.slug as string) || 'boxes')
const selectedImage = ref<string | null>(null)

const packagingDatabase: Record<string, any> = {
  boxes: {
    name: 'انواع جعبه‌های مقوایی و هاردباکس',
    description: 'تولید انواع جعبه‌های درب دارویی، قفل خودکار (لاک‌باتم)، کشویی، کیبوردی و هاردباکس مگنتی با بالاترین کیفیت تیغ‌زنی و چاپ.',
    minOrder: '۱,۰۰۰ عدد',
    leadTime: '۷ الی ۱۰ روز کاری',
    image: '/images/svg/open-paper-box-mockup-half-side-view-2-8943.svg',
    gallery: [
      '/images/svg/open-paper-box-mockup-half-side-view-2-8943.svg',
      '/images/svg/floating-square-gIft-box-mockup-2-6828.svg',
      '/images/svg/cardboard-paper-box-with-handle-mockup-2-10296.svg',
      '/images/svg/kraft-paper-open-mailing-box-mockup-2-6737.svg'
    ],
    materials: ['مقوای ایندربرد (۲۵۰ تا ۳۵۰ گرم)', 'مقوای پشت طوسی فشرده', 'کرافت سنگین', 'مقوای فانتزی و فلوت‌دار'],
    finishes: ['سلفون مات / براق حرارتی', 'یووی موضعی برجسته', 'طلاکوب و نقره‌کوب گرم', 'امباس و برجسته‌سازی']
  },
  'shopping-bags': {
    name: 'ساک‌های دستی کاغذی و مقوایی (شاپینگ بگ)',
    description: 'ساک دستی تبلیغاتی و فروشگاهی با انواع بند کنفی، روبانی و کاغذی با تقویت کف و دسته‌ها برای تحمل وزن بالا.',
    minOrder: '۵۰۰ عدد',
    leadTime: '۵ الی ۷ روز کاری',
    image: '/images/svg/free-kraft-paper-shopping-bag-mockup-1.svg',
    gallery: [
      '/images/svg/free-kraft-paper-shopping-bag-mockup-1.svg',
      '/images/svg/Free-Lunch-Kraft-Paper-Bag-Mockup-1.svg'
    ],
    materials: ['گلاسه ۱۷۰ تا ۲۵۰ گرم', 'کرافت سوئدی', 'مقوای کارتی'],
    finishes: ['سلفون حرارتی', 'طلاکوب روی لوگو', 'یووی شنی و موضعی']
  }
}

const product = computed(() => {
  const s = slug.value
  if (packagingDatabase[s]) return packagingDatabase[s]
  return packagingDatabase['boxes']
})
</script>