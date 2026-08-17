<!-- pages/help/faq.vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-najmback pb-28 text-gray-800">
    <!-- Header -->
    <header class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-4">
      <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4">
        مرکز راهنما و پاسخ به سوالات متداول
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight text-d4">
        پرسش‌های متداول (FAQ)
      </h1>
      <p class="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
        پاسخ کامل به تمامی سوالات مرتبط با حداقل تیراژ، فرمت فایل‌های چاپی، زمان‌بندی تولید، نحوه ساخت ماکت اولیه و فرآیند ارسال سفارشات.
      </p>

      <!-- Category Filter Tabs -->
      <div class="flex items-center justify-center gap-2 pt-4 flex-wrap">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer text-d4"
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
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      <div
        v-for="(item, idx) in filteredFaqs"
        :key="item.id"
        class="bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs"
        :class="openIndex === idx ? 'border-najmgreen/50 ring-1 ring-najmgreen/10' : 'border-gray-200 hover:border-gray-300'"
      >
        <!-- Accordion Header Button -->
        <button
          @click="toggleFaq(idx)"
          class="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 cursor-pointer"
        >
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-xl bg-najmgrey text-najmgreen font-bold text-xs flex items-center justify-center font-mono">
              ۰{{ idx + 1 }}
            </span>
            <h2 class="text-sm sm:text-base font-bold text-gray-900 text-d4">
              {{ item.question }}
            </h2>
          </div>
          <Icon
            :name="openIndex === idx ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            class="w-5 h-5 text-gray-500 shrink-0 transition-transform"
          />
        </button>

        <!-- Accordion Answer Body -->
        <div
          v-if="openIndex === idx"
          class="px-6 pb-6 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 mt-2 pt-4 text-right"
        >
          <p class="whitespace-pre-line">{{ item.answer }}</p>
        </div>
      </div>
    </main>

    <!-- Bottom Contact Support -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div class="bg-white rounded-3xl p-8 sm:p-10 border border-najmborder/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-right">
        <div class="space-y-1">
          <h3 class="text-base font-bold text-gray-900 text-d4">پاسخ سوال خود را نیافتید؟</h3>
          <p class="text-xs text-gray-500">کارشناسان فنی مجتمع چاپ نجم در تمامی روزهای کاری آماده پاسخگویی به شما هستند.</p>
        </div>
        <NuxtLink
          to="/contact"
          class="px-6 py-3 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs transition shadow-xs whitespace-nowrap text-d4"
        >
          ارتباط با واحد پشتیبانی
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  name: 'مرکز راهنما و سوالات متداول - چاپ نجم',
  layout: 'default'
})

const selectedCategory = ref('all')
const openIndex = ref<number | null>(0)

function toggleFaq(idx: number) {
  openIndex.value = openIndex.value === idx ? null : idx
}

const categories = [
  { id: 'all', label: 'همه سوالات' },
  { id: 'ordering', label: 'ثبت سفارش و تیراژ' },
  { id: 'design', label: 'فایل‌ها و آماده‌سازی چاپ' },
  { id: 'production', label: 'تولید و نمونه‌گیری' },
  { id: 'shipping', label: 'ارسال و لجستیک' }
]

const faqs = [
  {
    id: 1,
    category: 'ordering',
    question: 'حداقل تیراژ سفارش برای جعبه‌های مقوایی و هاردباکس چقدر است؟',
    answer: 'برای جعبه‌های مقوایی افست (ایندربرد و پشت طوسی)، حداقل تیراژ اقتصادی ۱,۰۰۰ عدد و برای هاردباکس‌های سخت دست‌ساز و اتوماتیک حداقل تیراژ ۵۰۰ عدد می‌باشد. سفارش در تیراژهای بالاتر هزینه قالب و تنظیم لیتوگرافی را سرشکن کرده و قیمت واحد را به شدت کاهش می‌دهد.'
  },
  {
    id: 2,
    category: 'design',
    question: 'فایل‌های چاپی باید با چه فرمت و مشخصاتی ارسال شوند؟',
    answer: 'فایل‌ها ترجیحاً در فرمت PDF استاندارد چاپ (PDF/X-1a) یا فایل باز Adobe Illustrator (AI) ارسال شوند. رزولوشن تصاویر حداقل ۳۰۰DPI، سیستم رنگی حتماً CMYK، فونت‌ها به خطوط برداری تبدیل (Create Outlines) شده و خطوط تیغ و تا در یک لایه اختصاصی با رنگ اسپات مجزا قرار گیرند.'
  },
  {
    id: 3,
    category: 'design',
    question: 'میزان لبه برش (Bleed) استاندارد چقدر باید در نظر گرفته شود؟',
    answer: 'برای تمامی کارهای بسته‌بندی، ساک‌های دستی و کاتالوگ‌ها، حداقل ۳ الی ۵ میلیمتر لبه برش (Bleed) از هر طرف ضروری است تا در هنگام تیغ‌زنی و برش، سفیدی در لبه کار ایجاد نشود.'
  },
  {
    id: 4,
    category: 'production',
    question: 'فرآیند ساخت ماکت و نمونه فیزیکی پیش از چاپ اصلی چگونه است؟',
    answer: 'پیش از آغاز چاپ تیراژ، ماکت سه‌بعدی تیغ‌زده‌شده از متریال انتخابی (Mockup بدون چاپ) جهت تست ابعاد، جای‌گیری محصول و استحکام برای مشتری تولید و ارسال می‌گردد. همچنین در صورت نیاز، نمونه چاپی دیجیتال (پروف دیجیتال رنگ) برای تطابق تقریبی رنگ ارائه می‌شود.'
  },
  {
    id: 5,
    category: 'production',
    question: 'زمان‌بندی معمول برای تولید و تحویل سفارشات چقدر است؟',
    answer: 'سفارشات جعبه‌های مقوایی معمولاً بین ۵ الی ۷ روز کاری و سفارشات هاردباکس و ساختارهای خاص بین ۱۰ الی ۱۴ روز کاری پس از تایید نهایی طرح و ماکت تحویل داده می‌شوند. در صورت نیاز به تولید فوری، امکان هماهنگی شیفت ویژه وجود دارد.'
  },
  {
    id: 6,
    category: 'shipping',
    question: 'نحوه بسته‌بندی و ارسال سفارشات به تهران و سایر استان‌ها چگونه است؟',
    answer: 'تمامی سفارشات در کارتن‌های ۵ لایه مستحکم همراه با شرینک نایلونی بسته‌بندی می‌شوند تا در برابر ضربه و رطوبت کاملاً محافظت شوند. ارسال برای تهران با ناوگان اختصاصی و برای شهرستان‌ها از طریق باربری‌های معتبر و ترانزیت کانتینری انجام می‌پذیرد.'
  }
]

const filteredFaqs = computed(() => {
  if (selectedCategory.value === 'all') return faqs
  return faqs.filter(f => f.category === selectedCategory.value)
})
</script>
