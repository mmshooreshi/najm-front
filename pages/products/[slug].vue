<!-- pages/products/[slug].vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 bg-najmback">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-gray-500">
      <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen">محصولات</NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-bold text-d4">{{ currentProduct.name }}</span>
    </nav>

    <!-- Product Hero Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-najmborder/40 items-start">
      <!-- Media Gallery -->
      <div class="lg:col-span-6 space-y-4">
        <div class="rounded-3xl overflow-hidden bg-[#F7F9FA] border border-najmborder/40 aspect-square flex items-center justify-center relative group p-6">
          <img
            :src="selectedImage || currentProduct.image"
            :alt="currentProduct.name"
            class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <span class="absolute top-4 right-4 px-3 py-1 rounded-full bg-najmgreen text-white text-xs font-bold text-d4 shadow-2xs">
            کیفیت صنعتی
          </span>
        </div>

        <div v-if="currentProduct.gallery?.length" class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="(img, idx) in currentProduct.gallery"
            :key="idx"
            @click="selectedImage = img"
            class="w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all bg-[#F7F9FA] p-1.5 cursor-pointer"
            :class="selectedImage === img || (!selectedImage && idx === 0) ? 'border-najmgreen ring-2 ring-najmgreen/20' : 'border-gray-200 hover:border-gray-300'"
          >
            <img :src="img" :alt="currentProduct.name" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Product Meta & Highlights -->
      <div class="lg:col-span-6 space-y-6">
        <div>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 mb-2 text-d4">
            {{ currentProduct.categoryLabel || 'محصولات چاپ و بسته‌بندی' }}
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 text-d4 leading-tight">
            {{ currentProduct.name }}
          </h1>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {{ currentProduct.description }}
          </p>
        </div>

        <!-- Badges / Key Specs -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-right">
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
            <span class="block text-[11px] text-gray-500 mb-0.5">حداقل تیراژ:</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 text-d4">{{ currentProduct.minOrder }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
            <span class="block text-[11px] text-gray-500 mb-0.5">زمان تحویل:</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 text-d4">{{ currentProduct.leadTime }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40 col-span-2 sm:col-span-1">
            <span class="block text-[11px] text-gray-500 mb-0.5">دستگاه چاپ:</span>
            <span class="text-xs sm:text-sm font-bold text-najmgreen text-d4">هایدلبرگ ۵ رنگ ورقی</span>
          </div>
        </div>

        <!-- Material & Finishing options -->
        <div v-if="currentProduct.materials?.length" class="space-y-2.5 pt-2">
          <h3 class="text-xs font-bold text-gray-900 tracking-wider text-d4">متریال و گرماژهای قابل اجرا:</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="mat in currentProduct.materials"
              :key="mat"
              class="px-3 py-1.5 rounded-xl bg-najmgrey text-gray-800 text-xs font-medium border border-najmborder/40"
            >
              {{ mat }}
            </span>
          </div>
        </div>

        <div v-if="currentProduct.finishes?.length" class="space-y-2.5">
          <h3 class="text-xs font-bold text-gray-900 tracking-wider text-d4">خدمات تکمیلی پس از چاپ:</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="finish in currentProduct.finishes"
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
            استعلام تیراژ و قیمت
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="py-3.5 px-6 rounded-2xl bg-najmgrey hover:bg-gray-200 text-gray-800 font-bold text-xs text-center transition flex items-center justify-center gap-2 text-d4"
          >
            <Icon name="mdi:download" class="w-4 h-4 text-najmgreen" />
            دانلود کاتالوگ جامع
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
  name: 'جزئیات محصول - چاپ نجم',
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')
const selectedImage = ref<string | null>(null)

const defaultProduct = {
  name: 'جعبه مقوایی و هاردباکس تخصصی',
  categoryLabel: 'بسته‌بندی مقوایی',
  description: 'تولید انواع جعبه‌های دارویی، آرایشی، فست‌فود و هاردباکس‌های مگنتی با استانداردهای بین‌المللی چاپ و خط‌برش دقیق.',
  minOrder: '۱,۰۰۰ عدد',
  leadTime: '۷ روز کاری',
  image: '/images/svg/open-paper-box-mockup-half-side-view-2-8943.svg',
  gallery: [
    '/images/svg/open-paper-box-mockup-half-side-view-2-8943.svg',
    '/images/svg/floating-square-gIft-box-mockup-2-6828.svg',
    '/images/svg/free-kraft-paper-shopping-bag-mockup-1.svg',
    '/images/svg/Free-Facial-Tissue-Box-Mockup-1.svg'
  ],
  materials: ['ایندربرد ۲۵۰ الی ۳۵۰ گرم', 'کرافت سنگین', 'مقوای فلوت‌دار سه لایه', 'گلاسه سنگین'],
  finishes: ['سلفون مات و براق حرارتی', 'یووی موضعی برجسته', 'طلاکوب و نقره‌کوب گرم', 'برجسته‌سازی امباس']
}

const currentProduct = computed(() => defaultProduct)
</script>
