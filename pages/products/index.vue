<!-- pages/products/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen bg-najmback pb-24">
    <!-- Hero Section -->
    <section class="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div class="bg-white rounded-3xl p-5 sm:p-12 shadow-xs border border-najmborder/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
        <div class="space-y-3 max-w-2xl" :class="isRTL ? 'text-right' : 'text-left'">
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4 break-words"
            v-editable="'badge'"
          >
            {{ uiContent.badge }}
          </span>
          <h1
            class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight text-d4 break-words"
            v-editable="'title'"
          >
            {{ uiContent.title }}
          </h1>
          <p
            class="text-xs sm:text-sm text-gray-600 leading-relaxed break-words"
            v-editable="'description'"
          >
            {{ uiContent.description }}
          </p>
        </div>

        <!-- Quick Search & Actions -->
        <div class="w-full lg:w-80 space-y-3 shrink-0">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="uiContent.searchPlaceholder || 'جستجوی نام محصول...'"
              class="w-full pl-10 pr-4 py-3 rounded-2xl bg-najmgrey/50 border border-najmborder/60 text-xs text-gray-900 focus:bg-white focus:border-najmgreen focus:outline-none transition shadow-inner"
            />
            <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          <div class="flex items-center gap-2 text-xs">
            <NuxtLink
              to="/catalog"
              class="flex-1 py-2.5 px-3 rounded-xl bg-najmgrey hover:bg-gray-200 text-gray-800 text-center font-bold text-d4 transition"
            >
              <span v-editable="'downloadCatalogBtn'">{{ uiContent.downloadCatalogBtn || 'دانلود کاتالوگ PDF' }}</span>
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="flex-1 py-2.5 px-3 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white text-center font-bold text-d4 transition shadow-xs"
            >
              <span v-editable="'quoteBtn'">{{ uiContent.quoteBtn || 'استعلام تیراژ' }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Filter Toolbar & View Mode Switcher -->
    <section class="sticky top-16 z-20 bg-white/90 backdrop-blur-md border-y border-najmborder/40 shadow-2xs py-3 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Category Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap w-full md:w-auto pb-1 md:pb-0 navcont">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer text-d4"
            :class="[
              selectedCategory === cat.id
                ? 'bg-najmgreen text-white shadow-xs'
                : 'bg-najmgrey text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Controls: Sorter & Grid/List View -->
        <div class="flex items-center justify-between w-full md:w-auto gap-3 shrink-0">
          <!-- Sort Dropdown -->
          <div class="flex items-center gap-1.5 text-xs text-gray-600">
            <span class="text-d4 font-bold hidden sm:inline">مرتب‌سازی:</span>
            <select
              v-model="sortBy"
              class="px-3 py-1.5 rounded-xl bg-najmgrey/80 border border-najmborder/40 text-xs font-bold text-gray-800 focus:outline-none focus:border-najmgreen transition cursor-pointer text-d4"
            >
              <option value="popular">محبوب‌ترین و پرفروش</option>
              <option value="minQtyAsc">حداقل تیراژ (کم به زیاد)</option>
              <option value="leadTime">سریع‌ترین زمان تولید</option>
            </select>
          </div>

          <!-- View Mode -->
          <div class="flex items-center gap-1 bg-najmgrey p-1 rounded-xl">
            <button
              @click="viewMode = 'grid'"
              class="p-1.5 rounded-lg transition cursor-pointer"
              :class="viewMode === 'grid' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
              title="نمای شبکه‌ای"
            >
              <Icon name="mdi:view-grid" class="w-4 h-4" />
            </button>
            <button
              @click="viewMode = 'list'"
              class="p-1.5 rounded-lg transition cursor-pointer"
              :class="viewMode === 'list' ? 'bg-white text-najmgreen shadow-xs' : 'text-gray-500 hover:text-gray-900'"
              title="نمای لیست و مقایسه"
            >
              <Icon name="mdi:view-list" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Products Grid / List View Container -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <!-- Active Results Count -->
      <div class="flex items-center justify-between mb-6 text-xs text-gray-500">
        <span>نمایش <strong class="text-gray-900 font-bold font-mono">{{ filteredProducts.length }}</strong> محصول تخصصی</span>
        <span v-if="searchQuery" class="text-najmgreen">
          فیلتر شده بر اساس عبارت «{{ searchQuery }}»
          <button @click="searchQuery = ''" class="mr-1 text-red-500 hover:underline">× پاکسازی</button>
        </span>
      </div>

      <!-- GRID VIEW -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="prod in filteredProducts"
          :key="prod.id"
          class="bg-white rounded-3xl p-4 border border-najmborder/40 shadow-xs hover:shadow-md hover:border-najmgreen transition-all duration-300 flex flex-col justify-between group"
        >
          <div class="space-y-3">
            <!-- Product Mockup Visual with Badges -->
            <div class="relative aspect-square rounded-2xl bg-[#F7F9FA] border border-gray-100 overflow-hidden flex items-center justify-center p-4">
              <img
                :src="prod.image"
                :alt="prod.title"
                class="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <span class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold text-gray-800 border border-gray-200 text-d4 shadow-2xs">
                {{ prod.categoryLabel }}
              </span>
              <span v-if="prod.badge" class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-najmgreen text-white text-[10px] font-bold text-d4 shadow-2xs">
                {{ prod.badge }}
              </span>
            </div>

            <!-- Product Title & Details -->
            <div class="space-y-1.5 text-right">
              <h3 class="text-sm sm:text-base font-bold text-gray-900 text-d4 group-hover:text-najmgreen transition-colors leading-snug">
                {{ prod.title }}
              </h3>
              <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {{ prod.description }}
              </p>
            </div>

            <!-- Technical Specifications Tags -->
            <div class="pt-2 border-t border-gray-100 space-y-1.5 text-[11px]">
              <div class="flex items-center justify-between text-gray-600">
                <span class="text-gray-400">متریال:</span>
                <span class="font-bold text-gray-800">{{ prod.material }}</span>
              </div>
              <div class="flex items-center justify-between text-gray-600">
                <span class="text-gray-400">حداقل سفارش:</span>
                <span class="font-bold text-najmgreen">{{ prod.minQty }}</span>
              </div>
              <div class="flex items-center justify-between text-gray-600">
                <span class="text-gray-400">زمان تحویل:</span>
                <span class="text-gray-700">{{ prod.leadTime }}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
            <NuxtLink
              :to="prod.to || '/contact'"
              class="flex-1 py-2 px-3 rounded-xl bg-najmgrey hover:bg-najmgreen hover:text-white text-gray-800 text-xs font-bold text-center transition text-d4"
            >
              مشاهده و سفارش
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="p-2 rounded-xl bg-najmgrey hover:bg-gray-200 text-gray-700 transition"
              title="درخواست استعلام قیمت فوری"
            >
              <Icon name="mdi:phone-outline" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- LIST VIEW -->
      <div v-else class="space-y-4">
        <div
          v-for="prod in filteredProducts"
          :key="prod.id"
          class="bg-white rounded-3xl p-5 border border-najmborder/40 shadow-xs hover:border-najmgreen transition-all flex flex-col md:flex-row items-center justify-between gap-6 group"
        >
          <!-- Left Visual & Basic Info -->
          <div class="flex items-center gap-5 w-full md:w-auto">
            <div class="w-24 h-24 rounded-2xl bg-[#F7F9FA] border border-gray-100 overflow-hidden flex items-center justify-center p-2 shrink-0">
              <img :src="prod.image" :alt="prod.title" class="w-full h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <div class="space-y-1 text-right">
              <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 text-d4">
                {{ prod.categoryLabel }}
              </span>
              <h3 class="text-base font-bold text-gray-900 text-d4 group-hover:text-najmgreen transition">
                {{ prod.title }}
              </h3>
              <p class="text-xs text-gray-500 max-w-md line-clamp-1">
                {{ prod.description }}
              </p>
            </div>
          </div>

          <!-- Middle Technical Details -->
          <div class="grid grid-cols-3 gap-4 text-xs w-full md:w-auto text-center border-t md:border-t-0 md:border-r border-gray-100 pt-3 md:pt-0 pr-0 md:pr-6">
            <div>
              <div class="text-[10px] text-gray-400">متریال پایه</div>
              <div class="font-bold text-gray-800 text-d4">{{ prod.material }}</div>
            </div>
            <div>
              <div class="text-[10px] text-gray-400">حداقل تیراژ</div>
              <div class="font-bold text-najmgreen text-d4">{{ prod.minQty }}</div>
            </div>
            <div>
              <div class="text-[10px] text-gray-400">زمان تحویل</div>
              <div class="font-bold text-gray-800 text-d4">{{ prod.leadTime }}</div>
            </div>
          </div>

          <!-- Right Action CTA -->
          <div class="flex items-center gap-2 w-full md:w-auto shrink-0">
            <NuxtLink
              :to="prod.to || '/contact'"
              class="flex-1 md:flex-initial py-2.5 px-5 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white text-xs font-bold text-center transition text-d4 shadow-xs"
            >
              مشاهده و استعلام
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="bg-white rounded-3xl p-16 text-center space-y-4 border border-najmborder/40">
        <Icon name="mdi:package-variant-closed-remove" class="w-12 h-12 text-gray-300 mx-auto" />
        <h3 class="text-base font-bold text-gray-900 text-d4">محصولی با این مشخصات یافت نشد</h3>
        <p class="text-xs text-gray-500">لطفاً فیلترها را تغییر داده یا از کلمات کلیدی دیگری در جستجو استفاده نمایید.</p>
        <button
          @click="selectedCategory = 'all'; searchQuery = ''"
          class="px-5 py-2 rounded-xl bg-najmgrey hover:bg-gray-200 text-xs font-bold text-gray-800 text-d4 transition"
        >
          مشاهده همه محصولات
        </button>
      </div>
    </section>

    <!-- Bottom Advisory Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div class="bg-najmgreen text-white rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="space-y-3 max-w-2xl text-right">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 text-d4">
            سفارشات ابعاد و قالب اختصاصی
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-d4 leading-tight">
            نیاز به طراحی قالب اختصاصی و متریال خاص دارید؟
          </h2>
          <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            تیم مهندسی بسته‌بندی نجم آماده است تا بر اساس ابعاد دقیق محصول شما، ماکت سه‌بعدی و نمونه اولیه فیزیکی (Mockup) را پیش از آغاز چاپ تولید نماید.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <NuxtLink
            to="/contact"
            class="px-7 py-3.5 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition text-center shadow-xs whitespace-nowrap text-d4"
          >
            مشاوره مهندسی بسته‌بندی
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition text-center border border-white/20 whitespace-nowrap text-d4"
          >
            دریافت سمپل‌باکس
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDynamicProducts } from '~/composables/useDynamicData'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const searchQuery = ref('')
const selectedCategory = ref('all')
const sortBy = ref('popular')
const viewMode = ref<'grid' | 'list'>('grid')

const { ui, allUi } = usePageUI('products')
useAdminEditable('products', allUi)

const fallbackProductsUI = {
  badge: 'کاتالوگ محصولات و خدمات اختصاصی',
  title: 'محصولات چاپ، ساخت جعبه و بسته‌بندی',
  description: 'از جعبه‌های دارویی و بهداشتی استاندارد تا هاردباکس‌های لوکس مگنتی، ساک‌های دستی و اوراق تجاری؛ تمامی محصولات با بالاترین دقت رنگی، متریال درجه‌یک و خطوط تولید تمام‌اتوماتیک تولید می‌شوند.',
  searchPlaceholder: 'جستجوی نام محصول، متریال یا نوع جعبه...',
  downloadCatalogBtn: 'دانلود کاتالوگ PDF',
  quoteBtn: 'استعلام تیراژ'
}

const uiContent = computed(() => {
  return {
    ...fallbackProductsUI,
    ...(ui.value || {})
  }
})

const { products: remoteProducts } = useDynamicProducts(selectedCategory, searchQuery, sortBy)

const categories = [
  { id: 'all', label: 'همه محصولات' },
  { id: 'boxes', label: 'جعبه و بسته‌بندی مقوایی' },
  { id: 'hardbox', label: 'هاردباکس و جعبه لوکس' },
  { id: 'shopping-bags', label: 'ساک دستی کاغذی' },
  { id: 'catalogs', label: 'کاتالوگ و بروشور صنعتی' },
  { id: 'stationery', label: 'ست اداری و اوراق تجاری' },
  { id: 'labels', label: 'لیبل و بسته‌بندی خاص' }
]

interface ProductItem {
  id: number
  category: string
  categoryLabel: string
  title: string
  description: string
  material: string
  minQty: string
  minQtyNum: number
  leadTime: string
  leadTimeDays: number
  image: string
  badge?: string
  to?: string
}

const productList: ProductItem[] = [
  {
    id: 1,
    category: 'boxes',
    categoryLabel: 'جعبه مقوایی',
    title: 'جعبه مقوایی دارویی و بهداشتی',
    description: 'تولید انواع جعبه‌های دارویی، آرایشی و غذایی با قفل لاک‌باتم اتوماتیک و خط‌برش میکرونی.',
    material: 'ایندربرد ۳۰۰ تا ۴۰۰ گرم',
    minQty: '۱,۰۰۰ عدد',
    minQtyNum: 1000,
    leadTime: '۵ الی ۷ روز کاری',
    leadTimeDays: 7,
    image: '/images/svg/open-paper-box-mockup-half-side-view-2-8943.svg',
    badge: 'پرفروش‌ترین',
    to: '/products/packaging/boxes'
  },
  {
    id: 2,
    category: 'hardbox',
    categoryLabel: 'هاردباکس لوکس',
    title: 'هاردباکس مگنتی و دوتکه صادراتی',
    description: 'جعبه‌های سخت با مغزی مقوای کرجی فشرده و روکش‌های گلاسه طلاکوب، مخمل و چرم مصنوعی.',
    material: 'مقوای سخت ۲ میلی‌متر',
    minQty: '۵۰۰ عدد',
    minQtyNum: 500,
    leadTime: '۱۰ الی ۱۴ روز کاری',
    leadTimeDays: 14,
    image: '/images/svg/floating-square-gIft-box-mockup-2-6828.svg',
    badge: 'کیفیت صادراتی',
    to: '/products/packaging/boxes'
  },
  {
    id: 3,
    category: 'shopping-bags',
    categoryLabel: 'ساک دستی',
    title: 'ساک دستی کاغذی گلاسه و کرافت',
    description: 'بگ‌های خرید لوکس مجهز به تقویت کفی و لبه با دسته‌های روبانی، کنفی و پیچی مقاوم.',
    material: 'گلاسه ۲۰۰ گرم / کرافت',
    minQty: '۵۰۰ عدد',
    minQtyNum: 500,
    leadTime: '۷ الی ۱۰ روز کاری',
    leadTimeDays: 10,
    image: '/images/svg/free-kraft-paper-shopping-bag-mockup-1.svg',
    to: '/products/packaging/boxes'
  },
  {
    id: 4,
    category: 'boxes',
    categoryLabel: 'جعبه دستمال و مصرفی',
    title: 'جعبه دستمال کاغذی و بسته‌بندی فست‌فود',
    description: 'مقواهای بهداشتی فودگرید استاندارد با سلفون مات و یووی ضدروغن و ضدآب.',
    material: 'ایندربرد فودگرید مجاز',
    minQty: '۲,۰۰۰ عدد',
    minQtyNum: 2000,
    leadTime: '۶ الی ۸ روز کاری',
    leadTimeDays: 8,
    image: '/images/svg/Free-Facial-Tissue-Box-Mockup-1.svg',
    to: '/products/packaging/boxes'
  },
  {
    id: 5,
    category: 'boxes',
    categoryLabel: 'کارتن پستی',
    title: 'جعبه کارتن پستی و ایفلوت ایکامرس',
    description: 'کارتن‌های سه لایه E-Flute با مقاومت فشاری بالا مناسب ارسال سفارشات آنلاین و پستی.',
    material: 'ایفلوت کرافت سه لایه',
    minQty: '۱,۰۰۰ عدد',
    minQtyNum: 1000,
    leadTime: '۵ الی ۷ روز کاری',
    leadTimeDays: 7,
    image: '/images/svg/kraft-paper-open-mailing-box-mockup-2-6737.svg',
    to: '/products/packaging/boxes'
  },
  {
    id: 6,
    category: 'catalogs',
    categoryLabel: 'کاتالوگ و کتابچه',
    title: 'کاتالوگ لوکس جلد سخت و چسب گرم PUR',
    description: 'چاپ ۵ رنگ کاتالوگ صنعتی با صحافی چسب گرم PUR، سلفون مخملی و یووی موضعی برجسته.',
    material: 'گلاسه ۲۰۰ + جلد سخت',
    minQty: '۳۰۰ جلد',
    minQtyNum: 300,
    leadTime: '۸ الی ۱۰ روز کاری',
    leadTimeDays: 10,
    image: '/images/svg/Free-Floating-Hardcover-Book-Mockup-1.svg',
    badge: 'صحافی PUR',
    to: '/products/packaging/boxes'
  },
  {
    id: 7,
    category: 'stationery',
    categoryLabel: 'ست اداری',
    title: 'سربرگ، پاکت و ست اوراق تجاری',
    description: 'چاپ ست کامل اداری شامل سربرگ A4 و A5، پاکت‌نامه ملخی درب چسبی و فولدر جیب‌دار.',
    material: 'کاغذ تحریر ۱۰۰g و کتان',
    minQty: '۱,۰۰۰ برگ',
    minQtyNum: 1000,
    leadTime: '۴ الی ۶ روز کاری',
    leadTimeDays: 6,
    image: '/images/sections/printing/Scene_Creator_Business_Stationery.jpg',
    to: '/products/packaging/boxes'
  },
  {
    id: 8,
    category: 'labels',
    categoryLabel: 'بسته‌بندی اختصاصی',
    title: 'هولدر کاغذی لیوان و ظروف بیرون‌بر',
    description: 'هولدرهای ارگونومیک بیرون‌بر با دایکات دسته‌دار از جنس کرافت فشرده مقاوم به وزن.',
    material: 'کرافت سنگین بازیافت‌پذیر',
    minQty: '۱,۰۰۰ عدد',
    minQtyNum: 1000,
    leadTime: '۵ الی ۷ روز کاری',
    leadTimeDays: 7,
    image: '/images/svg/Free-Coffee-Cup-Paper-Holder-Mockup-1.svg',
    to: '/products/packaging/boxes'
  },
  {
    id: 9,
    category: 'boxes',
    categoryLabel: 'جعبه دسته‌دار',
    title: 'جعبه دسته‌دار فانتزی و هدایای تبلیغاتی',
    description: 'جعبه‌های دسته‌دار یکپارچه بدون نیاز به چسب با سیستم مونتاژ سریع و آسان.',
    material: 'ایندربرد ۳۵۰ گرم دوبلکس',
    minQty: '۱,۰۰۰ عدد',
    minQtyNum: 1000,
    leadTime: '۶ الی ۸ روز کاری',
    leadTimeDays: 8,
    image: '/images/svg/cardboard-paper-box-with-handle-mockup-2-10296.svg',
    to: '/products/packaging/boxes'
  },
  {
    id: 10,
    category: 'labels',
    categoryLabel: 'پکیجینگ کافه و فود',
    title: 'بسته‌بندی پاکت دان قهوه و پاکت پنجره‌دار',
    description: 'پاکت‌های ایستاده زیپ‌کیپ و کاغذی با لایه داخلی متالایز ضدبو و حفظ تازگی.',
    material: 'کرافت + لایه فویل متالایز',
    minQty: '۱,۰۰۰ عدد',
    minQtyNum: 1000,
    leadTime: '۷ الی ۹ روز کاری',
    leadTimeDays: 9,
    image: '/images/svg/Free-Coffee-Branding-PSD-Mockup-1.svg',
    to: '/products/packaging/boxes'
  },
  {
    id: 11,
    category: 'shopping-bags',
    categoryLabel: 'بگ کرافت غذا',
    title: 'پاکت کرافت فست‌فود و دلیوری بدون دسته',
    description: 'بگ‌های غذایی بهداشتی با ته صاف (Square Bottom) با چاپ تک تا چهار رنگ گیاهی.',
    material: 'کاغذ کرافت ۷۰ الی ۹۰ گرم',
    minQty: '۲,۰۰۰ عدد',
    minQtyNum: 2000,
    leadTime: '۵ الی ۷ روز کاری',
    leadTimeDays: 7,
    image: '/images/svg/Free-Lunch-Kraft-Paper-Bag-Mockup-1.svg',
    to: '/products/packaging/boxes'
  },
  {
    id: 12,
    category: 'stationery',
    categoryLabel: 'اوراق تبلیغاتی',
    title: 'فولدر اداری جیب‌دار و بروشور ۳ لتی',
    description: 'فولدرهای نگهدارنده اسناد با قالب قفل سرخود و جای کارت ویزیت اختصاصی.',
    material: 'گلاسه ۳۰۰ گرم + سلفون مات',
    minQty: '۵۰۰ عدد',
    minQtyNum: 500,
    leadTime: '۵ الی ۷ روز کاری',
    leadTimeDays: 7,
    image: '/images/sections/printing/Free_Stationery_Mockup_psd-960x640.jpg',
    to: '/products/packaging/boxes'
  }
]

const filteredProducts = computed(() => {
  let list = [...productList]

  // Category filter
  if (selectedCategory.value !== 'all') {
    list = list.filter((p) => p.category === selectedCategory.value)
  }

  // Search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
    )
  }

  // Sort
  if (sortBy.value === 'minQtyAsc') {
    list.sort((a, b) => a.minQtyNum - b.minQtyNum)
  } else if (sortBy.value === 'leadTime') {
    list.sort((a, b) => a.leadTimeDays - b.leadTimeDays)
  }

  return list
})
</script>

<style scoped>
.navcont {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.navcont::-webkit-scrollbar {
  display: none;
}
</style>