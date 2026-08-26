<!-- pages/products/packaging/[slug].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12 bg-najmback">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
      <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen">محصولات</NuxtLink>
      <span>/</span>
      <span class="text-gray-400">بسته‌بندی و جعبه‌سازی</span>
      <span>/</span>
      <span class="text-gray-900 font-bold text-d4 break-words" v-editable="'name'">{{ product.name }}</span>
    </nav>

    <!-- Product Hero Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 bg-white rounded-3xl p-5 sm:p-10 shadow-xs border border-najmborder/40 items-start">
      <!-- Media Gallery -->
      <div class="lg:col-span-6 space-y-4">
        <div class="rounded-3xl overflow-hidden bg-[#F7F9FA] border border-najmborder/40 aspect-square flex items-center justify-center relative group p-4 sm:p-6">
          <img
            :src="selectedImage || product.image || '/images/products/boxes.jpg'"
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
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all bg-[#F7F9FA] p-1.5 cursor-pointer"
            :class="selectedImage === img || (!selectedImage && idx === 0) ? 'border-najmgreen ring-2 ring-najmgreen/20' : 'border-gray-200 hover:border-gray-300'"
          >
            <img :src="img" :alt="product.name" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Product Meta & Highlights -->
      <div class="lg:col-span-6 space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
        <div>
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 mb-2 text-d4 break-words"
            v-editable="'badge'"
          >
            {{ product.badge || 'دسته‌بندی بسته‌بندی و جعبه‌سازی' }}
          </span>
          <h1
            class="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 text-d4 leading-tight break-words"
            v-editable="'name'"
          >
            {{ product.name }}
          </h1>
          <p
            class="text-xs sm:text-base text-gray-600 leading-relaxed break-words"
            v-editable="'description'"
          >
            {{ product.description }}
          </p>
        </div>

        <!-- Badges / Key Specs -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
            <span class="block text-[11px] text-gray-500 mb-0.5">حداقل تیراژ / Min:</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 text-d4 break-words" v-editable="'minOrder'">{{ product.minOrder }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
            <span class="block text-[11px] text-gray-500 mb-0.5">زمان تحویل / Time:</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 text-d4 break-words" v-editable="'leadTime'">{{ product.leadTime }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40 col-span-2 sm:col-span-1">
            <span class="block text-[11px] text-gray-500 mb-0.5">نوع چاپ / Press:</span>
            <span class="text-xs sm:text-sm font-bold text-najmgreen text-d4 break-words" v-editable="'printType'">{{ product.printType || 'افست ۵ رنگ هایدلبرگ' }}</span>
          </div>
        </div>

        <!-- Material & Finishing options -->
        <div class="space-y-2.5 pt-2">
          <h3 class="text-xs font-bold text-gray-900 tracking-wider text-d4 break-words" v-editable="'materialsTitle'">
            {{ product.materialsTitle || 'متریال و گرماژهای قابل سفارش:' }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(mat, i) in (product.materials || [])"
              :key="i"
              class="px-3 py-1.5 rounded-xl bg-najmgrey text-gray-800 text-xs font-medium border border-najmborder/40 break-words"
              v-editable="`materials.${i}`"
            >
              {{ mat }}
            </span>
          </div>
        </div>

        <div class="space-y-2.5">
          <h3 class="text-xs font-bold text-gray-900 tracking-wider text-d4 break-words" v-editable="'finishesTitle'">
            {{ product.finishesTitle || 'خدمات تکمیلی پس از چاپ:' }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(finish, i) in (product.finishes || [])"
              :key="i"
              class="px-3 py-1.5 rounded-xl bg-najmgrey text-gray-800 text-xs font-medium border border-najmborder/40 break-words"
              v-editable="`finishes.${i}`"
            >
              {{ finish }}
            </span>
          </div>
        </div>

        <!-- Action CTA -->
        <div class="pt-4 flex flex-col sm:flex-row gap-3">
          <NuxtLink
            to="/contact"
            class="flex-1 py-3 px-5 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs text-center shadow-xs transition text-d4"
          >
            <span v-editable="'inquiryBtn'">{{ product.inquiryBtn || 'درخواست استعلام قیمت و ابعاد' }}</span>
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="py-3 px-5 rounded-2xl bg-najmgrey hover:bg-gray-200 text-gray-800 font-bold text-xs text-center transition flex items-center justify-center gap-2 text-d4"
          >
            <Icon name="mdi:download" class="w-4 h-4 text-najmgreen" />
            <span v-editable="'downloadDieCutBtn'">{{ product.downloadDieCutBtn || 'دانلود کاتالوگ و قالب تیغ' }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Technical Specs & Features Detail -->
    <div class="bg-white rounded-3xl p-5 sm:p-10 shadow-xs border border-najmborder/40 space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
      <h2 class="text-lg font-bold text-gray-900 text-d4 break-words">مشخصات فنی و استانداردهای تولید</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div class="flex justify-between py-3 border-b border-gray-100 flex-wrap gap-2">
          <span class="text-gray-500">قابلیت سفارشی‌سازی ابعاد:</span>
          <span class="font-semibold text-gray-800 break-words" v-editable="'specs.dimensions'">{{ product.specs?.dimensions || 'کاملاً نامحدود بر اساس ساختار محصول شما' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100 flex-wrap gap-2">
          <span class="text-gray-500">تست استحکام و مقاومت:</span>
          <span class="font-semibold text-gray-800 break-words" v-editable="'specs.strength'">{{ product.specs?.strength || 'تست فشار و خمش استاندارد (BCT / ECT)' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100 flex-wrap gap-2">
          <span class="text-gray-500">نوع چسب و اتصال:</span>
          <span class="font-semibold text-gray-800 break-words" v-editable="'specs.glue'">{{ product.specs?.glue || 'چسب گرم و سرد خطی / لاک‌باتم اتوماتیک' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100 flex-wrap gap-2">
          <span class="text-gray-500">پوشش‌های محافظتی:</span>
          <span class="font-semibold text-gray-800 break-words" v-editable="'specs.coating'">{{ product.specs?.coating || 'سلفون مات، براق، ضدخش و واتربیس' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || 'boxes')
const pageSlug = computed(() => `products-packaging-${slug.value}`)

const { ui, allUi } = usePageUI(pageSlug.value)
useAdminEditable(pageSlug.value, allUi)

const selectedImage = ref<string | null>(null)

const fallbackPackaging = {
  name: 'جعبه‌های مقوایی دارویی، بهداشتی و غذایی',
  badge: 'دسته‌بندی بسته‌بندی و جعبه‌سازی',
  description: 'تولید انواع جعبه‌های مقوایی تاشو (Folding Cartons) با خطوط تیغ دقیق، قفل لاک‌باتم اتوماتیک و مقوای ایندربرد بهداشتی فودگرید.',
  minOrder: '۳,۰۰۰ عدد',
  leadTime: '۷ الی ۱۰ روز کاری',
  printType: 'افست ۵ رنگ هایدلبرگ',
  materialsTitle: 'متریال و گرماژهای قابل سفارش:',
  materials: [
    'ایندربرد بهداشتی ۲۵۰ تا ۳۵۰ گرم',
    'پشت طوسی دوبلکس ۲۸۰ تا ۴۰۰ گرم',
    'کرافت سنگین طبیعی ۲۳۰ تا ۳۰۰ گرم',
    'مقوای متالایز نقره‌ای و طلایی'
  ],
  finishesTitle: 'خدمات تکمیلی پس از چاپ:',
  finishes: [
    'سلفون حرارتی مات و براق',
    'یووی موضعی و شنی',
    'طلاکوب و نقره‌کوب دیجیتال',
    'خطوط بریل دارویی (Braille)'
  ],
  specs: {
    dimensions: 'کاملاً نامحدود بر اساس ساختار محصول شما',
    strength: 'تست فشار و خمش استاندارد (BCT / ECT)',
    glue: 'چسب گرم و سرد خطی / لاک‌باتم اتوماتیک',
    coating: 'سلفون مات، براق، ضدخش و واتربیس'
  },
  inquiryBtn: 'درخواست استعلام قیمت و ابعاد',
  downloadDieCutBtn: 'دانلود کاتالوگ و قالب تیغ',
  image: '/images/products/boxes.jpg'
}

const product = computed(() => {
  return {
    ...fallbackPackaging,
    ...(ui.value || {}),
    name: ui.value?.name || slug.value.replace(/-/g, ' ') || fallbackPackaging.name
  }
})
</script>