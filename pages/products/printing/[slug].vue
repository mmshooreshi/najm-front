<!-- pages/products/printing/[slug].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs text-gray-500 flex-wrap" :class="isRTL ? 'text-right' : 'text-left'">
      <NuxtLink to="/" class="hover:text-najmgreen transition">{{ isRTL ? 'خانه' : 'Home' }}</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen transition">{{ isRTL ? 'محصولات' : 'Products' }}</NuxtLink>
      <span>/</span>
      <span class="text-gray-400">{{ isRTL ? 'چاپ تجاری و اداری' : 'Commercial & Office Printing' }}</span>
      <span>/</span>
      <span class="text-gray-900 font-semibold break-words" v-editable="'name'">{{ product.name }}</span>
    </nav>

    <!-- Product Hero Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 bg-white rounded-3xl p-5 sm:p-10 shadow-xs border border-najmborder/40 items-start">
      <!-- Media Gallery -->
      <div class="lg:col-span-6 space-y-4">
        <div class="rounded-3xl overflow-hidden bg-najmgrey/50 border border-najmborder/40 aspect-square flex items-center justify-center relative group p-4 sm:p-6">
          <NuxtImg
            :src="selectedImage || product.image || '/images/products/catalog.jpg'"
            :alt="product.name"
            class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <span class="absolute top-4 right-4 px-3 py-1 rounded-full bg-najmgreen text-white text-xs font-bold text-d4 shadow-2xs">
            {{ isRTL ? 'چاپ افست هایدلبرگ' : 'Heidelberg Offset' }}
          </span>
        </div>

        <div v-if="product.gallery?.length" class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="(img, idx) in product.gallery"
            :key="idx"
            @click="selectedImage = img"
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all bg-najmgrey/40 p-1 cursor-pointer"
            :class="selectedImage === img || (!selectedImage && idx === 0) ? 'border-najmgreen ring-2 ring-najmgreen/20' : 'border-gray-200 hover:border-gray-300'"
          >
            <NuxtImg :src="img" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Product Meta & Highlights -->
      <div class="lg:col-span-6 space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
        <div>
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 mb-2 break-words"
            v-editable="'badge'"
          >
            {{ product.badge || (isRTL ? 'خدمات چاپ تجاری، اداری و کاتالوگ' : 'Commercial, Office & Catalog Printing') }}
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
          <div class="p-3.5 rounded-2xl bg-najmgrey/50 border border-najmborder/40">
            <span class="block text-[11px] text-gray-500 mb-0.5">{{ isRTL ? 'حداقل تیراژ:' : 'Min Run:' }}</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 break-words" v-editable="'minOrder'">{{ product.minOrder }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-najmgrey/50 border border-najmborder/40">
            <span class="block text-[11px] text-gray-500 mb-0.5">{{ isRTL ? 'زمان تحویل:' : 'Lead Time:' }}</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 break-words" v-editable="'leadTime'">{{ product.leadTime }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-najmgrey/50 border border-najmborder/40 col-span-2 sm:col-span-1">
            <span class="block text-[11px] text-gray-500 mb-0.5">{{ isRTL ? 'نوع چاپ:' : 'Press / Method:' }}</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 break-words" v-editable="'printType'">{{ product.printType || (isRTL ? 'افست ۵ رنگ هایدلبرگ' : 'Heidelberg 5-Color Offset') }}</span>
          </div>
        </div>

        <!-- Paper Types -->
        <div class="space-y-2.5 pt-2">
          <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider text-d4 break-words" v-editable="'papersTitle'">
            {{ product.papersTitle || (isRTL ? 'انواع کاغذ و گرماژ قابل سفارش:' : 'Paper Grades & Weights:') }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(paper, i) in (product.papers || [])"
              :key="i"
              class="px-3 py-1.5 rounded-xl bg-najmgrey text-gray-800 text-xs font-medium border border-najmborder/40 break-words"
              v-editable="`papers.${i}`"
            >
              {{ paper }}
            </span>
          </div>
        </div>

        <!-- Finishing -->
        <div class="space-y-2.5">
          <h3 class="text-xs font-bold text-gray-900 uppercase tracking-wider text-d4 break-words" v-editable="'finishesTitle'">
            {{ product.finishesTitle || (isRTL ? 'پوشش‌ها و صحافی:' : 'Finishing & Binding:') }}
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
            class="flex-1 py-3 px-5 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs text-center shadow-xs transition"
          >
            <span v-editable="'inquiryBtn'">{{ product.inquiryBtn || (isRTL ? 'استعلام تیراژ و قیمت چاپ' : 'Request Print Quote') }}</span>
          </NuxtLink>
          <NuxtLink
            to="/resources/guide-cmyk-color-profile"
            class="py-3 px-5 rounded-2xl bg-najmgrey hover:bg-gray-200 text-gray-800 font-bold text-xs text-center transition flex items-center justify-center gap-2"
          >
            <Icon name="mdi:palette-swatch-outline" class="w-4 h-4" />
            <span v-editable="'guideBtn'">{{ product.guideBtn || (isRTL ? 'راهنمای تنظیم رنگ CMYK' : 'CMYK Color Guide') }}</span>
          </NuxtLink>
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
const slug = computed(() => (route.params.slug as string) || 'letterhead')
const pageSlug = computed(() => `products-printing-${slug.value}`)

const { ui, allUi } = usePageUI(pageSlug.value)
useAdminEditable(pageSlug.value, allUi)

const selectedImage = ref<string | null>(null)

const fallbackPrinting = {
  name: 'سربرگ و ست اداری اختصاصی',
  badge: 'خدمات چاپ تجاری، اداری و کاتالوگ',
  description: 'چاپ سربرگ A4 و A5 بر روی انواع کاغذ تحریر ۸۰ و ۱۰۰ گرم خارجی و کاغذهای کتان و فانتزی با ثبات رنگی دقیق سازمانی.',
  minOrder: '۱,۰۰۰ برگ',
  leadTime: '۳ الی ۵ روز کاری',
  printType: 'افست ۵ رنگ هایدلبرگ',
  papersTitle: 'انواع کاغذ و گرماژ قابل سفارش:',
  papers: [
    'تحریر ۸۰ گرم اندونزی',
    'تحریر ۱۰۰ گرم کتان فابریانو',
    'کاغذ کتان آلمانی ۱۲۰ گرم',
    'کاغذ فانتزی بافت‌دار زبر'
  ],
  finishesTitle: 'پوشش‌ها و صحافی:',
  finishes: [
    'چاپ پنتون اختصاصی',
    'طلاکوب / نقره‌کوب لوگو',
    'برجسته‌سازی (Emboss)',
    'سرچسب و پرفراژ'
  ],
  inquiryBtn: 'استعلام تیراژ و قیمت چاپ',
  guideBtn: 'راهنمای تنظیم رنگ CMYK',
  image: '/images/products/letterhead.jpg'
}

const product = computed(() => {
  return {
    ...fallbackPrinting,
    ...(ui.value || {}),
    name: ui.value?.name || slug.value.replace(/-/g, ' ') || fallbackPrinting.name
  }
})
</script>