<!-- pages/facilities/index.vue -->
<template>
  <div class="facilities-page min-h-screen bg-[#FBFBFA] pt-24 pb-20 px-4 sm:px-6 lg:px-8" :dir="isRTL ? 'rtl' : 'ltr'">
    <div class="max-w-7xl mx-auto space-y-16">
      
      <!-- Hero Header Section -->
      <div class="text-center max-w-4xl mx-auto space-y-5">
        <span
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20"
          v-editable="'badge'"
        >
          <Icon name="mdi:cog-outline" class="w-4 h-4 animate-spin" />
          {{ ui.badge || 'زیرساخت صنعتی و خطوط تولید چاپ نجم' }}
        </span>
        <h1
          class="text-3xl sm:text-5xl font-black text-gray-900 text-d4 tracking-tight leading-tight"
          v-editable="'title'"
        >
          {{ ui.title || 'امکانات، تجهیزات و ماشین‌آلات مدرن چاپ و بسته‌بندی' }}
        </h1>
        <p
          class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto"
          v-editable="'description'"
        >
          {{ ui.description || 'مجموعه‌ای یکپارچه از پیشرفته‌ترین ماشین‌آلات چاپ افست، لیتوگرافی هوشمند CTP، خطوط تمام‌اتوماتیک دایکات بوبست و خدمات تکمیلی پس از چاپ با بالاترین استانداردهای کیفی جهانی.' }}
        </p>

        <!-- Stats Bar -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div
            v-for="(st, idx) in statsList"
            :key="idx"
            class="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col items-center justify-center text-center"
          >
            <div class="text-2xl sm:text-3xl font-black text-najmgreen font-mono text-d4" v-editable="`stats.${idx}.value`">
              {{ st.value }}
            </div>
            <div class="text-[11px] sm:text-xs text-gray-600 font-semibold mt-1" v-editable="`stats.${idx}.label`">
              {{ st.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex justify-center overflow-x-auto gap-2 py-2">
        <button
          v-for="cat in categoriesList"
          :key="cat.key"
          @click="activeCategory = cat.key"
          class="px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap"
          :class="[
            activeCategory === cat.key
              ? 'bg-najmgreen text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Machinery & Facilities Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <article
          v-for="(m, idx) in filteredMachines"
          :key="m.id || idx"
          class="relative bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
        >
          <!-- In-place Card Actions (+ / -) -->
          <AdminArrayItemActions path="machines" :index="idx" />

          <div>
            <!-- Image / Media Container -->
            <div class="relative h-56 sm:h-64 bg-gray-100 overflow-hidden">
              <img
                :src="m.image"
                :alt="m.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span class="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                {{ m.tag || 'صنعتی' }}
              </span>
            </div>

            <!-- Content Details -->
            <div class="p-6 space-y-3.5 text-start">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-najmgreen transition-colors text-d4" v-editable="`machines.${idx}.title`">
                {{ m.title }}
              </h3>
              
              <div class="space-y-1.5 text-xs text-gray-600">
                <div class="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <Icon name="mdi:tune-variant" class="w-4 h-4 text-najmgreen shrink-0" />
                  <span v-editable="`machines.${idx}.spec`">{{ m.spec }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-gray-500">
                  <Icon name="mdi:speedometer" class="w-4 h-4 text-gray-400 shrink-0" />
                  <span v-editable="`machines.${idx}.speed`">{{ m.speed }}</span>
                </div>
              </div>

              <p class="text-xs text-gray-600 leading-relaxed pt-1" v-editable="`machines.${idx}.description`">
                {{ m.description }}
              </p>
            </div>
          </div>

          <!-- Bottom Action -->
          <div class="p-6 pt-0">
            <button
              @click="openModal()"
              class="w-full py-3 rounded-2xl bg-najmback hover:bg-emerald-50 hover:text-najmgreen text-gray-700 text-xs font-bold transition flex items-center justify-center gap-2 border border-gray-200 cursor-pointer"
            >
              <Icon name="mdi:calculator" class="w-4 h-4" />
              <span>{{ isRTL ? 'استعلام ظرفیت این خط' : 'Inquire Line Capacity' }}</span>
            </button>
          </div>
        </article>

        <!-- Placeholder Add Card -->
        <AdminAddCardPlaceholder path="machines" :label="isRTL ? 'افزودن دستگاه / خط تولید جدید' : 'Add New Machine / Line'" />
      </div>

      <!-- Factory Consultation & Tour CTA -->
      <div class="bg-najmgreen text-white rounded-3xl sm:rounded-[36px] p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-start">
        <div class="space-y-3 max-w-2xl">
          <span class="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 text-emerald-100 border border-white/20">
            بازدید حضوری و جلسه فنی
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-d4 leading-tight">
            {{ ui.consultationCta?.title || 'نیاز به بررسی فنی پروژه یا بازدید از کارخانه دارید؟' }}
          </h2>
          <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {{ ui.consultationCta?.subtitle || 'کارشناسان فنی و مهندسی بسته‌بندی نجم آماده پاسخگویی و هماهنگی جلسه حضوری هستند.' }}
          </p>
        </div>

        <div class="shrink-0 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <button
            @click="openModal()"
            class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-najmgreen font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition cursor-pointer text-d4"
          >
            {{ ui.consultationCta?.button || 'درخواست مشاوره و استعلام فنی' }}
          </button>
          <a
            href="tel:02144556677"
            class="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition text-center font-mono border border-white/20"
          >
            ۰۲۱ - ۴۴ ۵۵ ۶۶ ۷۷
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useLocale } from '~/composables/useLocale'
import { useConsultation } from '~/composables/useConsultation'

definePageMeta({
  name: 'امکانات و تجهیزات کارخانه - چاپ نجم',
  layout: 'default',
})

const { ui } = usePageUI('facilities')
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const { openModal } = useConsultation()

const activeCategory = ref('all')

const statsList = computed(() => ui.value?.stats || [
  { value: '+۱۰,۰۰۰', label: 'متر مربع مساحت خطوط تولید و انبارداری' },
  { value: '۱۸,۰۰۰', label: 'برگ در ساعت ظرفیت چاپ افست چندرنگ' },
  { value: '۹۹.۸٪', label: 'دقت و انطباق رنگی با استاندارد ISO 12647' },
  { value: '۲۴/۷', label: 'پایش کیفی مستمر و تحویل منظم سفارشات' }
])

const categoriesList = computed(() => ui.value?.categories || [
  { key: 'all', label: 'همه بخش‌ها' },
  { key: 'printing', label: 'چاپ افست مدرن' },
  { key: 'prepress', label: 'پیش از چاپ و لیتوگرافی' },
  { key: 'finishing', label: 'پس از چاپ و تکمیلی' },
  { key: 'quality', label: 'کنترل کیفیت و آزمایشگاه' },
  { key: 'logistics', label: 'انبارداری و لجستیک' }
])

const machinesList = computed(() => ui.value?.machines || [
  {
    id: 'heidelberg-xl-106',
    category: 'printing',
    title: 'ماشین چاپ افست هایدلبرگ Speedmaster XL 106',
    spec: '۶ رنگ همراه با برج لاک و ورنی پایه آب و UV',
    speed: 'ظرفیت ۱۸,۰۰۰ برگ در ساعت',
    description: 'مجهز به سیستم اسپکتروفتومتری هوشمند Inpress Control 3 برای تنظیم خودکار رجیستر و دانسیته رنگ بدون توقف ماشین.',
    image: '/images/sections/facilities/machines-1.avif',
    tag: 'چاپ صنعتی تیراژ بالا'
  },
  {
    id: 'heidelberg-suprasetter-ctp',
    category: 'prepress',
    title: 'پلیت‌ستر هایدلبرگ Suprasetter 106 CTP',
    spec: 'لیتوگرافی حرارتی با رزولوشن ۲۵۴۰ dpi',
    speed: 'تولید ۴۵ زینک در ساعت با فیلتر ترام هیبرید',
    description: 'پرتودهی لیزری با کالیبراسیون طیف نوری برای انتقال دقیق‌ترین ترام‌های تصویری و پایداری در طول تیراژهای سنگین.',
    image: '/images/sections/facilities/facilities-1.avif',
    tag: 'پیش از چاپ دیجیتال'
  },
  {
    id: 'bobst-novacut-106',
    category: 'finishing',
    title: 'دستگاه دایکات اتوماتیک Bobst Novacut 106 E',
    spec: 'قالب‌زنی، تیغ‌زنی، پوشال‌برداری و برجسته‌سازی',
    speed: 'سرعت ۸,۰۰۰ برگ در ساعت با دقت ±۰.۰۵ میلی‌متر',
    description: 'فشار یکنواخت تا ۳۰۰ تن برای برش دقیق انواع جعبه‌های دارویی، آرایشی، فودگرید و هاردباکس‌های سخت.',
    image: '/images/sections/facilities/facilities-1.avif',
    tag: 'تیغ و قالب‌زنی سوئیسی'
  },
  {
    id: 'heidelberg-diana-folder-gluer',
    category: 'finishing',
    title: 'خط جعبه‌چسبانی اتوماتیک هایدلبرگ Diana Easy 115',
    spec: 'چسب گرم و سرد، قفل کف، ۴ گوشه و لاک‌باتم',
    speed: 'سرعت خروجی تا ۳۰۰ متر در دقیقه',
    description: 'سیستم اسکن نوری برای بررسی چسب‌خوری بی‌نقص و حذف اتوماتیک جعبه‌های دارای خطای تولید.',
    image: '/images/sections/facilities/machines-1.avif',
    tag: 'مونتاژ و بسته‌بندی جعبه'
  },
  {
    id: 'thermal-velvet-laminator',
    category: 'finishing',
    title: 'خط سلفون‌کشی حرارتی اتوماتیک و مخملی (Soft-Touch)',
    spec: 'سلفون مات، براق، مخملی، ضدخش و متالایز',
    speed: 'حرارت کنترل‌شده هیدرولیک تا ۱۰۰ متر در دقیقه',
    description: 'چسبندگی بی‌نقص بدون ایجاد حباب روی انواع کاغذ و مقواهای سنگین حتی روی فرم‌های با تمپلات رنگی غلیظ.',
    image: '/images/sections/facilities/facilities-1.avif',
    tag: 'پوشش‌های لوکس'
  },
  {
    id: 'xrite-qa-spectro',
    category: 'quality',
    title: 'آزمایشگاه کنترل کیفیت و اسپکتروفتومتری X-Rite',
    spec: 'سنجش ترام، مقاومت سایش Sutherland و ترکیدگی مقوا',
    speed: 'انطباق تضمین‌شده با استانداردهای دارویی و غذایی',
    description: 'کالیبراسیون دوره‌ای بر اساس استانداردهای ایزو و تطابق صددرصدی رنگ چاپ با نمونه پروف دیجیتال تأییدشده.',
    image: '/images/sections/facilities/machines-1.avif',
    tag: 'تضمین کیفیت ISO'
  }
])

const filteredMachines = computed(() => {
  if (activeCategory.value === 'all') return machinesList.value
  return machinesList.value.filter(m => m.category === activeCategory.value)
})
</script>
