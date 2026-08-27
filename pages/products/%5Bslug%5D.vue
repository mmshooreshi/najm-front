<!-- pages/products/[slug].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 select-none font-sans">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-gray-500" :class="isRTL ? 'text-right' : 'text-left'">
      <NuxtLink to="/" class="hover:text-najmgreen">{{ isRTL ? 'خانه' : 'Home' }}</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen">{{ isRTL ? 'محصولات' : 'Products' }}</NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-bold font-d4">{{ currentTitle }}</span>
    </nav>

    <!-- Product Hero Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-gray-100 items-start">
      <!-- Media Gallery -->
      <div class="lg:col-span-6 space-y-4">
        <div class="rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center relative group p-6">
          <img
            :src="selectedImage || currentImage"
            :alt="currentTitle"
            class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <span class="absolute top-4 right-4 px-3 py-1 rounded-full bg-najmgreen text-white text-xs font-bold font-d4 shadow-xs">
            {{ isRTL ? 'کیفیت صنعتی' : 'Industrial Grade' }}
          </span>
        </div>

        <div v-if="galleryImages.length" class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="(img, idx) in galleryImages"
            :key="idx"
            @click="selectedImage = img"
            class="w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all bg-gray-50 p-1.5 cursor-pointer"
            :class="selectedImage === img || (!selectedImage && idx === 0) ? 'border-najmgreen ring-2 ring-najmgreen/20' : 'border-gray-200 hover:border-gray-300'"
          >
            <img :src="img" :alt="currentTitle" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Product Meta & Highlights -->
      <div class="lg:col-span-6 space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
        <div>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 mb-2 font-d4">
            {{ currentCategory }}
          </span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 font-d4 leading-tight">
            {{ currentTitle }}
          </h1>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {{ currentDescription }}
          </p>
        </div>

        <!-- Badges / Key Specs -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div class="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span class="block text-[11px] text-gray-500 mb-0.5">{{ isRTL ? 'حداقل تیراژ:' : 'Min Run:' }}</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 font-d4">{{ currentProduct.minQty || (isRTL ? '۱,۰۰۰ عدد' : '1,000 pcs') }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <span class="block text-[11px] text-gray-500 mb-0.5">{{ isRTL ? 'زمان تحویل:' : 'Lead Time:' }}</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 font-d4">{{ currentProduct.leadTime || (isRTL ? '۷ روز کاری' : '7 Working Days') }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 col-span-2 sm:col-span-1">
            <span class="block text-[11px] text-gray-500 mb-0.5">{{ isRTL ? 'دستگاه چاپ:' : 'Press Line:' }}</span>
            <span class="text-xs sm:text-sm font-bold text-najmgreen font-d4">{{ isRTL ? 'هایدلبرگ ۵ رنگ' : 'Heidelberg 5-Color' }}</span>
          </div>
        </div>

        <!-- Material & Finishing options -->
        <div class="space-y-2.5 pt-2">
          <h3 class="text-xs font-bold text-gray-900 tracking-wider font-d4">{{ isRTL ? 'متریال و گرماژهای قابل اجرا:' : 'Available Materials & Substrates:' }}</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(mat, i) in materialsList"
              :key="i"
              class="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 font-d4"
            >
              {{ mat }}
            </span>
          </div>
        </div>

        <div class="space-y-2.5">
          <h3 class="text-xs font-bold text-gray-900 tracking-wider font-d4">{{ isRTL ? 'خدمات تکمیلی پس از چاپ:' : 'Finishing & Special FX:' }}</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(finish, i) in finishesList"
              :key="i"
              class="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 font-d4"
            >
              {{ finish }}
            </span>
          </div>
        </div>

        <!-- Action CTA -->
        <div class="pt-4 flex flex-col sm:flex-row gap-3">
          <NuxtLink
            to="/consultation"
            class="flex-1 py-3.5 px-6 rounded-2xl bg-najmgreen hover:bg-emerald-700 text-white font-bold text-xs text-center shadow-xs transition font-d4"
          >
            {{ isRTL ? 'استعلام تیراژ و قیمت' : 'Request Quotation' }}
          </NuxtLink>
          <NuxtLink
            to="/resources"
            class="py-3.5 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs text-center transition flex items-center justify-center gap-2 font-d4"
          >
            <Icon name="mdi:download" class="w-4 h-4 text-najmgreen" />
            <span>{{ isRTL ? 'دانلود قالب تیغ و کاتالوگ' : 'Download Dielines & Specs' }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')
const selectedImage = ref<string | null>(null)
const matchedProduct = ref<any | null>(null)

const activeLang = computed(() => {
  const l = (language.value || 'fa').toLowerCase()
  return (l === 'en' || l === 'ar' ? l : 'fa') as 'fa' | 'en' | 'ar'
})

const fallbackProduct = {
  name: 'جعبه مقوایی و هاردباکس تخصصی',
  categoryLabel: 'بسته‌بندی مقوایی',
  description: 'تولید انواع جعبه‌های دارویی، آرایشی، فست‌فود و هاردباکس‌های مگنتی با استانداردهای بین‌المللی چاپ و خط‌برش دقیق.',
  minQty: '۱,۰۰۰ عدد',
  leadTime: '۷ روز کاری',
  image: '/images/products/boxes.jpg',
  locales: {
    fa: { title: 'جعبه مقوایی و هاردباکس تخصصی', categoryLabel: 'بسته‌بندی مقوایی', description: 'تولید انواع جعبه‌های دارویی، آرایشی، فست‌فود و هاردباکس‌های مگنتی با استانداردهای بین‌المللی.' },
    en: { title: 'Custom Paperboard & Rigid Boxes', categoryLabel: 'Paperboard Packaging', description: 'High-precision folding cartons, pharmaceutical packaging, food containers, and magnetic gift boxes.' },
    ar: { title: 'علب كرتونية وهاردبوكس تخصصية', categoryLabel: 'تغليف كرتوني فاخر', description: 'تصنيع علب الأدوية ومستحضرات التجميل والعلب المغناطيسية الفاخرة.' }
  }
}

const currentProduct = computed(() => {
  return matchedProduct.value || fallbackProduct
})

const currentTitle = computed(() => {
  return currentProduct.value.locales?.[activeLang.value]?.title || currentProduct.value.title || currentProduct.value.name || slug.value.replace(/-/g, ' ')
})

const currentCategory = computed(() => {
  return currentProduct.value.locales?.[activeLang.value]?.categoryLabel || currentProduct.value.categoryLabel || 'بسته‌بندی و چاپ'
})

const currentDescription = computed(() => {
  return currentProduct.value.locales?.[activeLang.value]?.description || currentProduct.value.description || ''
})

const currentImage = computed(() => {
  return currentProduct.value.image || '/images/products/boxes.jpg'
})

const galleryImages = computed(() => {
  if (currentProduct.value.gallery?.length) return currentProduct.value.gallery
  return [currentImage.value]
})

const materialsList = computed(() => {
  if (activeLang.value === 'en') {
    return ['SBS Paperboard 250-350g', 'Heavy Kraft 230-300g', '3-Ply Fluted Corrugated', 'Heavy Coated Artpaper']
  }
  if (activeLang.value === 'ar') {
    return ['كرتون إنفوبورد ۲٥۰-۳٥۰ جم', 'كرافت طبيعي سميك', 'كرتون مصفح ۳ طبقات', 'ورق كوشيه فاخر']
  }
  return ['ایندربرد ۲۵۰ الی ۳۵۰ گرم', 'کرافت سنگین طبیعی', 'مقوای فلوت‌دار سه لایه', 'گلاسه سنگین ۳۰۰ گرم']
})

const finishesList = computed(() => {
  if (activeLang.value === 'en') {
    return ['Matte & Gloss Thermal Lamination', 'Tactile Spot UV', 'Hot Foil Stamping (Gold/Silver)', 'Braille & Embossing']
  }
  if (activeLang.value === 'ar') {
    return ['سلوفان مطفي ولامع حراري', 'يو في موضعي بارز', 'بصمة حرارية ذهبية وفضية', 'بروز وطباعة برايل']
  }
  return ['سلفون مات و براق حرارتی', 'یووی موضعی برجسته', 'طلاکوب و نقره‌کوب گرم', 'برجسته‌سازی امباس و خط بریل']
})

async function fetchProduct() {
  try {
    const res: any = await $fetch('/api/products')
    if (res?.items?.length) {
      const found = res.items.find((it: any) => it.slug === slug.value || it.id === slug.value)
      if (found) matchedProduct.value = found
    }
  } catch {}
}

onMounted(() => {
  fetchProduct()
})
</script>
