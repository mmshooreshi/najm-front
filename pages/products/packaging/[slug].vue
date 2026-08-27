<!-- pages/products/packaging/[slug].vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12 bg-najmback">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-xs text-gray-500 mb-6" :class="isRTL ? 'text-right' : 'text-left'">
      <NuxtLink to="/" class="hover:text-najmgreen transition">{{ isRTL ? 'خانه' : 'Home' }}</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen transition">{{ isRTL ? 'محصولات' : 'Products' }}</NuxtLink>
      <span>/</span>
      <span class="text-gray-800 font-medium">{{ isRTL ? 'بسته‌بندی و جعبه‌سازی' : 'Packaging & Boxes' }}</span>
    </nav>

    <!-- Main Product Card / Hero -->
    <div class="bg-white rounded-3xl p-5 sm:p-10 shadow-xs border border-najmborder/40 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <!-- Media Gallery -->
      <div class="space-y-4">
        <div class="aspect-4/3 rounded-2xl overflow-hidden bg-najmgrey relative group border border-najmborder/30">
          <img
            :src="selectedImage || product.image || '/images/products/cardboard-boxes.png'"
            :alt="product.title"
            class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          />
          <div class="absolute top-3 right-3">
            <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-najmgreen shadow-xs border border-gray-100" v-editable="'badge'">
              {{ product.badge || (isRTL ? 'تولید صنعتی' : 'Industrial Run') }}
            </span>
          </div>
        </div>

        <div v-if="product.gallery?.length" class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="(img, idx) in product.gallery"
            :key="idx"
            @click="selectedImage = img"
            class="w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0"
            :class="selectedImage === img ? 'border-najmgreen' : 'border-transparent opacity-70 hover:opacity-100'"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Info & Details -->
      <div class="space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
        <div class="space-y-2">
          <span class="text-xs font-bold text-najmgreen tracking-wide text-d4" v-editable="'category'">{{ product.category }}</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 text-d4 leading-tight break-words" v-editable="'title'">{{ product.title }}</h1>
          <p
            class="text-xs sm:text-sm text-gray-600 leading-relaxed break-words"
            v-editable="'description'"
          >
            {{ product.description }}
          </p>
        </div>

        <!-- Badges / Key Specs -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
            <span class="block text-[11px] text-gray-500 mb-0.5">{{ isRTL ? 'حداقل تیراژ:' : 'Min Run:' }}</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 text-d4 break-words" v-editable="'minOrder'">{{ product.minOrder }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
            <span class="block text-[11px] text-gray-500 mb-0.5">{{ isRTL ? 'زمان تحویل:' : 'Lead Time:' }}</span>
            <span class="text-xs sm:text-sm font-bold text-gray-900 text-d4 break-words" v-editable="'leadTime'">{{ product.leadTime }}</span>
          </div>
          <div class="p-3.5 rounded-2xl bg-najmgrey/60 border border-najmborder/40 col-span-2 sm:col-span-1">
            <span class="block text-[11px] text-gray-500 mb-0.5">{{ isRTL ? 'نوع چاپ:' : 'Press / Method:' }}</span>
            <span class="text-xs sm:text-sm font-bold text-najmgreen text-d4 break-words" v-editable="'printType'">{{ product.printType || (isRTL ? 'افست ۵ رنگ هایدلبرگ' : 'Heidelberg 5-Color Offset') }}</span>
          </div>
        </div>

        <!-- Material & Finishing options -->
        <div class="space-y-2.5 pt-2">
          <h3 class="text-xs font-bold text-gray-900 tracking-wider text-d4 break-words" v-editable="'materialsTitle'">
            {{ product.materialsTitle || (isRTL ? 'متریال و گرماژهای قابل سفارش:' : 'Available Materials & Calipers:') }}
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
            {{ product.finishesTitle || (isRTL ? 'خدمات تکمیلی پس از چاپ:' : 'Post-Press Finishing Options:') }}
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
            <span v-editable="'inquiryBtn'">{{ product.inquiryBtn || (isRTL ? 'درخواست استعلام قیمت و ابعاد' : 'Request Quote & Custom Sizing') }}</span>
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="py-3 px-5 rounded-2xl bg-najmgrey hover:bg-gray-200 text-gray-800 font-bold text-xs text-center transition flex items-center justify-center gap-2 text-d4"
          >
            <Icon name="mdi:download" class="w-4 h-4 text-najmgreen" />
            <span v-editable="'downloadDieCutBtn'">{{ product.downloadDieCutBtn || (isRTL ? 'دانلود کاتالوگ و قالب تیغ' : 'Download Catalog & Die-Lines') }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Technical Specs & Features Detail -->
    <div class="bg-white rounded-3xl p-5 sm:p-10 shadow-xs border border-najmborder/40 space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
      <h2 class="text-lg font-bold text-gray-900 text-d4 break-words">{{ isRTL ? 'مشخصات فنی و استانداردهای تولید' : 'Technical Specifications & Production Standards' }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div class="flex justify-between py-3 border-b border-gray-100 flex-wrap gap-2">
          <span class="text-gray-500">{{ isRTL ? 'قابلیت سفارشی‌سازی ابعاد:' : 'Custom Dimensions:' }}</span>
          <span class="font-semibold text-gray-800 break-words" v-editable="'specs.dimensions'">{{ product.specs?.dimensions || (isRTL ? 'کاملاً نامحدود بر اساس ساختار محصول شما' : 'Customizable to exact product dimensions') }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100 flex-wrap gap-2">
          <span class="text-gray-500">{{ isRTL ? 'تست استحکام و مقاومت:' : 'Strength & Crush Testing:' }}</span>
          <span class="font-semibold text-gray-800 break-words" v-editable="'specs.strength'">{{ product.specs?.strength || (isRTL ? 'تست فشار و خمش استاندارد (BCT / ECT)' : 'Standard ECT/BCT compression & crush certified') }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100 flex-wrap gap-2">
          <span class="text-gray-500">{{ isRTL ? 'نوع چسب و اتصال:' : 'Adhesion & Joint:' }}</span>
          <span class="font-semibold text-gray-800 break-words" v-editable="'specs.glue'">{{ product.specs?.glue || (isRTL ? 'چسب گرم و سرد خطی / لاک‌باتم اتوماتیک' : 'Automated Hot/Cold Melt & Crash-Lock Gluing') }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-100 flex-wrap gap-2">
          <span class="text-gray-500">{{ isRTL ? 'پوشش‌های محافظتی:' : 'Protective Coatings:' }}</span>
          <span class="font-semibold text-gray-800 break-words" v-editable="'specs.coating'">{{ product.specs?.coating || (isRTL ? 'سلفون مات، براق، ضدخش و واتربیس' : 'Thermal Matte/Gloss/Anti-scratch Lamination & Aqueous') }}</span>
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