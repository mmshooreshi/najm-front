<!-- pages/help/faq.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen bg-najmback pb-20 sm:pb-28 text-gray-800">
    <!-- Header -->
    <header class="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
      <span class="inline-block px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4">
        {{ ui?.stats || 'مرکز راهنما و پاسخ به سوالات متداول' }}
      </span>
      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight text-d4">
        {{ ui?.title || 'پرسش‌های متداول (FAQ)' }}
      </h1>
      <p class="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
        {{ ui?.subtitle || 'پاسخ کامل به تمامی سوالات مرتبط با حداقل تیراژ، فرمت فایل‌های چاپی، زمان‌بندی تولید، نحوه ساخت ماکت اولیه و فرآیند ارسال سفارشات.' }}
      </p>

      <!-- Category Filter Tabs (Swipeable on mobile) -->
      <div class="flex items-center justify-center gap-1.5 sm:gap-2 pt-3 sm:pt-4 flex-wrap">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer text-d4"
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

    <!-- FAQ Accordion List -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
      <div
        v-for="(item, idx) in filteredFaqs"
        :key="item.id"
        class="bg-white rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs"
        :class="openIndex === idx ? 'border-najmgreen/50 ring-1 ring-najmgreen/10' : 'border-gray-200 hover:border-gray-300'"
      >
        <!-- Accordion Header Button (min-h 48px touch target) -->
        <button
          @click="toggleFaq(idx)"
          class="w-full p-4 sm:p-6 text-right flex items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none"
        >
          <div class="flex items-center gap-2.5 sm:gap-3">
            <span class="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-najmgrey text-najmgreen font-bold text-xs flex items-center justify-center font-mono shrink-0">
              ۰{{ idx + 1 }}
            </span>
            <h2 class="text-xs sm:text-base font-bold text-gray-900 text-d4 leading-snug">
              {{ item.question }}
            </h2>
          </div>
          <Icon
            :name="openIndex === idx ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0 transition-transform"
          />
        </button>

        <!-- Accordion Answer Body -->
        <div
          v-if="openIndex === idx"
          class="px-4 sm:px-6 pb-5 sm:pb-6 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 mt-1 sm:mt-2 pt-3 sm:pt-4 text-right"
        >
          <p class="whitespace-pre-line">{{ item.answer }}</p>
        </div>
      </div>
    </main>

    <!-- Bottom Contact Support -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-najmborder/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-right">
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-bold text-gray-900 text-d4">پاسخ سوال خود را نیافتید؟</h3>
          <p class="text-xs text-gray-500">کارشناسان فنی مجتمع چاپ نجم در تمامی روزهای کاری آماده پاسخگویی به شما هستند.</p>
        </div>
        <NuxtLink
          to="/contact"
          class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs transition shadow-xs whitespace-nowrap text-d4 text-center"
        >
          ارتباط با واحد پشتیبانی
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  name: 'مرکز راهنما و سوالات متداول - چاپ نجم',
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const { ui } = usePageUI('faq')
const selectedCategory = ref('all')
const openIndex = ref<number | null>(0)

function toggleFaq(idx: number) {
  openIndex.value = openIndex.value === idx ? null : idx
}

const categories = computed(() => ui.value?.categories || [
  { id: 'all', label: 'همه سوالات' },
  { id: 'ordering', label: 'ثبت سفارش و تیراژ' },
  { id: 'design', label: 'فایل‌ها و آماده‌سازی چاپ' },
  { id: 'production', label: 'تولید و نمونه‌گیری' },
  { id: 'shipping', label: 'ارسال و لجستیک' }
])

const faqsList = computed(() => ui.value?.faqs || [
  {
    id: 1,
    category: 'ordering',
    question: 'حداقل تیراژ سفارش برای جعبه‌های مقوایی و هاردباکس چقدر است؟',
    answer: 'برای جعبه‌های مقوایی افست (ایندربرد و پشت طوسی)، حداقل تیراژ اقتصادی ۱,۰۰۰ عدد و برای هاردباکس‌های سخت دست‌ساز و اتوماتیک حداقل تیراژ ۵۰۰ عدد می‌باشد.'
  },
  {
    id: 2,
    category: 'design',
    question: 'فایل‌های چاپی باید با چه فرمت و مشخصاتی ارسال شوند؟',
    answer: 'فایل‌ها ترجیحاً در فرمت PDF استاندارد چاپ (PDF/X-1a) یا فایل باز Adobe Illustrator (AI) ارسال شوند. رزولوشن تصاویر حداقل ۳۰۰DPI و CMYK باشد.'
  }
])

const filteredFaqs = computed(() => {
  if (selectedCategory.value === 'all') return faqsList.value
  return faqsList.value.filter((f: any) => f.category === selectedCategory.value)
})
</script>
