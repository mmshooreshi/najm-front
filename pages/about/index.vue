<!-- pages/about/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen bg-najmback text-gray-800 relative">
    <!-- Smart Floating Capsule Sub-Nav -->
    <div
      class="fixed top-20 inset-x-0 z-40 flex justify-center pointer-events-none"
      :class="[
        isReady ? 'transition-all duration-300' : '',
        navVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
      ]"
    >
      <nav class="pointer-events-auto bg-white/85 backdrop-blur-xl border border-white/80 shadow-lg rounded-full px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto max-w-[95vw]">
        <button
          v-for="item in sections"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="px-3.5 py-1.5 text-xs text-d4 rounded-full transition-all cursor-pointer whitespace-nowrap"
          :class="[
            activeSection === item.id
              ? 'bg-najmgreen text-white shadow-xs font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-black/5 font-medium'
          ]"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>

    <!-- Main Editorial Container -->
    <main class="pt-20 sm:pt-24 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 sm:space-y-28">
      <!-- Section 1: Hero & Vision (Scale & Staff) -->
      <section id="vision" class="scroll-mt-28 space-y-8 sm:space-y-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <!-- Text Lead -->
          <div class="lg:col-span-6 space-y-4 sm:space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
            <span
              class="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen text-d4 break-words"
              v-editable="'badge'"
            >
              {{ ui?.badge || 'درباره مجتمع چاپ و بسته‌بندی نجم' }}
            </span>
            <h1
              class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight text-d4 break-words"
              v-editable="'title'"
            >
              {{ ui?.title || 'نوآوری در چاپ افست، مهندسی در ساختار بسته‌بندی' }}
            </h1>
            <p
              class="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed break-words"
              v-editable="'story'"
            >
              {{ ui?.story || 'مجتمع چاپ نجم با اتکا به بیش از دو دهه سابقه صنعتی، تجهیز خطوط پیشرفته هایدلبرگ و سیستم‌های تمام‌اتوماتیک پس از چاپ، به عنوان بازوی اجرایی معتبرترین برندهای دارویی، آرایشی، غذایی و صادراتی کشور فعالیت می‌کند.' }}
            </p>
            
            <!-- Typographic Key Metrics -->
            <div class="grid grid-cols-3 gap-2 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-200 text-center" :class="isRTL ? 'sm:text-right' : 'sm:text-left'">
              <div class="space-y-1 p-2 sm:p-0 rounded-2xl bg-white/60 sm:bg-transparent border sm:border-0 border-gray-100">
                <div class="text-lg sm:text-2xl lg:text-3xl font-extrabold text-najmgreen text-d4 break-words" v-editable="'metrics.0.value'">{{ ui?.metrics?.[0]?.value || '+۲۵ سال' }}</div>
                <div class="text-[10px] sm:text-xs text-gray-500 break-words" v-editable="'metrics.0.label'">{{ ui?.metrics?.[0]?.label || 'سابقه مستمر' }}</div>
              </div>
              <div class="space-y-1 p-2 sm:p-0 rounded-2xl bg-white/60 sm:bg-transparent border sm:border-0 border-gray-100">
                <div class="text-lg sm:text-2xl lg:text-3xl font-extrabold text-najmgreen text-d4 break-words" v-editable="'metrics.1.value'">{{ ui?.metrics?.[1]?.value || '+۱۵M' }}</div>
                <div class="text-[10px] sm:text-xs text-gray-500 break-words" v-editable="'metrics.1.label'">{{ ui?.metrics?.[1]?.label || 'تیراژ سالانه' }}</div>
              </div>
              <div class="space-y-1 p-2 sm:p-0 rounded-2xl bg-white/60 sm:bg-transparent border sm:border-0 border-gray-100">
                <div class="text-lg sm:text-2xl lg:text-3xl font-extrabold text-najmgreen text-d4 break-words" v-editable="'metrics.2.value'">{{ ui?.metrics?.[2]?.value || '۹۹.۸٪' }}</div>
                <div class="text-[10px] sm:text-xs text-gray-500 break-words" v-editable="'metrics.2.label'">{{ ui?.metrics?.[2]?.label || 'انطباق رنگی' }}</div>
              </div>
            </div>
          </div>

          <!-- Hero Photography Asset -->
          <div class="lg:col-span-6">
            <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-xl aspect-[4/3] sm:aspect-[16/11] bg-gray-100 group">
              <img
                src="/images/about/staff.png"
                alt="تیم متخصص و خطوط تولید چاپ نجم"
                class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-white" :class="isRTL ? 'text-right' : 'text-left'">
                <div class="text-xs font-bold text-d4" v-editable="'heroStaffTitle'">{{ ui?.heroStaffTitle || (isRTL ? 'تیم متخصص مهندسی چاپ و تولید' : 'Technical Printing & Production Engineering Team') }}</div>
                <div class="text-[10px] text-white/80" v-editable="'heroStaffSub'">{{ ui?.heroStaffSub || (isRTL ? 'مجتمع تخصصی چاپ و بسته‌بندی نجم' : 'Najm Printing & Packaging Complex') }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Team & Engineering Leads -->
      <section id="story" class="scroll-mt-28 space-y-10">
        <div class="space-y-3 max-w-2xl" :class="isRTL ? 'text-right' : 'text-left'">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgrey text-gray-800 text-d4" v-editable="'teamBadge'">
            {{ ui?.teamBadge || 'سرمایه انسانی و تخصص فنی' }}
          </span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-gray-900 text-d4" v-editable="'teamTitle'">
            {{ ui?.teamTitle || 'تیم متخصص؛ هدایت‌گران کیفیت در چاپ نجم' }}
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed" v-editable="'teamDescription'">
            {{ ui?.teamDescription || 'از لیتوگرافی و تفکیک دقیق ترام‌های رنگی تا تنظیم دانسیته مرکب روی خطوط ۵ رنگ هایدلبرگ و نظارت بر تیغ‌زنی میکرونی دایکات.' }}
          </p>
        </div>

        <!-- 3-Column Frameless Portrait Showcase -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(person, pIdx) in (ui?.team || defaultTeam)" :key="pIdx" class="relative space-y-4 group">
            <!-- Team Member Action [+] / [-] -->
            <AdminArrayItemActions path="team" :index="pIdx" />

            <div class="aspect-square rounded-3xl overflow-hidden shadow-sm bg-white relative">
              <img
                :src="person.image"
                :alt="person.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-najmgreen text-white text-[10px] font-bold text-d4 shadow-xs" v-editable="`team.${pIdx}.role`">
                {{ person.role }}
              </span>
            </div>
            <div class="space-y-1" :class="isRTL ? 'text-right' : 'text-left'">
              <h3 class="text-base font-bold text-gray-900 text-d4" v-editable="`team.${pIdx}.title`">{{ person.title }}</h3>
              <p class="text-xs text-gray-500 leading-relaxed" v-editable="`team.${pIdx}.desc`">{{ person.desc }}</p>
            </div>
          </div>

          <AdminAddCardPlaceholder path="team" label="افزودن عضو جدید به تیم" />
        </div>
      </section>

      <!-- Section 3: Facilities Showcase -->
      <section id="facility" class="scroll-mt-28 space-y-10">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="space-y-2" :class="isRTL ? 'text-right' : 'text-left'">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgrey text-gray-800 text-d4" v-editable="'facilityBadge'">
              {{ ui?.facilityBadge || 'ناوگان ماشین‌آلات صنعتی' }}
            </span>
            <h2 class="text-2xl sm:text-4xl font-extrabold text-gray-900 text-d4" v-editable="'facilityTitle'">
              {{ ui?.facilityTitle || 'تجهیزات مدرن چاپ افست و خطوط تکمیلی' }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 max-w-md leading-relaxed" :class="isRTL ? 'text-right' : 'text-left'" v-editable="'facilityDescription'">
            {{ ui?.facilityDescription || 'سرمایه‌گذاری پیوسته در تکنولوژی‌های هایدلبرگ و بوبست ضامن دقت میکرونی و سرعت صنعتی در تحویل سفارشات است.' }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(machine, mIdx) in (ui?.machines || defaultMachines)"
            :key="mIdx"
            class="space-y-3 group"
          >
            <div class="aspect-[16/10] rounded-3xl overflow-hidden shadow-sm bg-white p-2">
              <img :src="machine.image" :alt="machine.title" class="w-full h-full object-cover rounded-2xl group-hover:scale-104 transition-transform duration-500" loading="lazy" />
            </div>
            <div class="space-y-1" :class="isRTL ? 'text-right' : 'text-left'">
              <span class="text-[10px] font-bold text-najmgreen text-d4" v-editable="`machines.${mIdx}.brand`">{{ machine.brand }}</span>
              <h3 class="text-base font-bold text-gray-900 text-d4" v-editable="`machines.${mIdx}.title`">{{ machine.title }}</h3>
              <p class="text-xs text-gray-500 leading-relaxed" v-editable="`machines.${mIdx}.desc`">{{ machine.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 4: Timeline Evolution -->
      <section id="timeline" class="scroll-mt-28 space-y-10">
        <div class="space-y-3 max-w-2xl" :class="isRTL ? 'text-right' : 'text-left'">
          <h2 class="text-2xl sm:text-4xl font-extrabold text-gray-900 text-d4" v-editable="'timelineTitle'">
            {{ ui?.timelineTitle || 'مسیر تکامل و پیشرفت تکنولوژی نجم' }}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(t, idx) in (ui?.timeline || defaultTimeline)"
            :key="idx"
            class="relative bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3 flex flex-col justify-between group"
            :class="isRTL ? 'text-right' : 'text-left'"
          >
            <!-- Timeline Action [+] / [-] -->
            <AdminArrayItemActions path="timeline" :index="idx" />

            <div class="space-y-2">
              <div class="text-2xl font-black text-najmgreen font-mono text-d4" v-editable="`timeline.${idx}.year`">{{ t.year }}</div>
              <h3 class="text-sm font-bold text-gray-900 text-d4" v-editable="`timeline.${idx}.title`">{{ t.title }}</h3>
              <p class="text-xs text-gray-600 leading-relaxed" v-editable="`timeline.${idx}.desc`">{{ t.desc }}</p>
            </div>
          </div>

          <AdminAddCardPlaceholder path="timeline" :label="isRTL ? 'افزودن رویداد زمانی جدید' : 'Add New Timeline Event'" />
        </div>
      </section>

      <!-- Section 5: Consultation CTA Banner -->
      <section id="aboutus" class="scroll-mt-28 bg-najmgreen text-white rounded-3xl sm:rounded-[36px] p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8" :class="isRTL ? 'text-right' : 'text-left'">
        <div class="space-y-3 max-w-2xl">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-d4 leading-tight" v-editable="'ctaTitle'">
            {{ ui?.ctaTitle || 'آماده‌اید بسته‌بندی محصول خود را به سطح بالاتری ببرید؟' }}
          </h2>
          <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed" v-editable="'ctaDescription'">
            {{ ui?.ctaDescription || 'با مهندسان ساختار و کارشناسان رنگ نجم مشورت کنید و نمونه اولیه فیزیکی رایگان دریافت نمایید.' }}
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <NuxtLink
            to="/consultation"
            class="px-8 py-4 rounded-2xl bg-white text-najmgreen font-bold text-xs sm:text-sm hover:bg-emerald-50 transition text-center shadow-xs whitespace-nowrap text-d4"
            v-editable="'ctaBtn'"
          >
            {{ ui?.ctaBtn || (isRTL ? 'درخواست مشاوره و استعلام فنی' : 'Request Technical Consultation') }}
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition text-center border border-white/20 whitespace-nowrap text-d4"
            v-editable="'ctaCatalogBtn'"
          >
            {{ ui?.ctaCatalogBtn || (isRTL ? 'دانلود کاتالوگ جامع' : 'Download Full Catalog') }}
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  name: 'درباره ما - چاپ و بسته‌بندی نجم',
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const { ui, allUi } = usePageUI('about')
useAdminEditable('about', allUi)

const sections = computed(() => ui.value?.nav || [
  { id: 'vision', label: 'معرفی' },
  { id: 'story', label: 'تیم فنی' },
  { id: 'facility', label: 'ماشین‌آلات' },
  { id: 'timeline', label: 'مسیر تکامل' },
  { id: 'aboutus', label: 'بازدید' }
])

const defaultTeam = [
  {
    role: 'پیش از چاپ',
    title: 'واحد لیتوگرافی و تفکیک رنگ CTP',
    desc: 'کنترل تفکیک رنگ‌های پنتون، تهیه زینک‌های حرارتی با ترام میکرونی و کالیبراسیون پروفایل چاپی.',
    image: '/images/about/person-1.png'
  },
  {
    role: 'خطوط چاپ',
    title: 'اپراتوری خطوط افست ۵ رنگ',
    desc: 'پایش دانسیته مرکب، تنظیم تعادل آب و الکل و تثبیت کیفیت چاپ در تیراژهای میلیونی تجاری.',
    image: '/images/about/person-2.png'
  },
  {
    role: 'پس از چاپ',
    title: 'تست مقاومت و خطوط تکمیلی',
    desc: 'نظارت بر تیغ‌زنی بدون پلیسه، سلفون‌کشی حرارتی و چسب لاک‌باتم اتوماتیک با تست‌های آزمایشگاهی.',
    image: '/images/about/person-3.png'
  }
]

const defaultMachines = [
  {
    brand: 'HEIDELBERG SPEEDMASTER',
    title: 'چاپ افست ۵ رنگ ورقی',
    desc: 'کنترل رنگ آنلاین Prinect و قابلیت چاپ همزمان رنگ‌های پنتون و ورنی.',
    image: '/images/about/machines-1.png'
  },
  {
    brand: 'BOBST DIE-CUTTING',
    title: 'دایکات و پوشال‌برداری اتوماتیک',
    desc: 'تیغ‌زنی، خط‌تا و برجسته‌سازی انواع مقوای ایندربرد و فلوت‌دار با دقت بالا.',
    image: '/images/about/machines-2.png'
  },
  {
    brand: 'HEIDELBERG SUPRASETTER',
    title: 'خروجی مستقیم زینک حرارتی (CTP)',
    desc: 'تولید زینک‌های بدون شیمیایی با تفکیک ترام ۱ الی ۹۹ درصد با رزولوشن ۲۵۴۰DPI.',
    image: '/images/about/machines-3.png'
  }
]

const defaultTimeline = [
  { year: '۱۳۷۸', title: 'تاسیس و راه‌اندازی کارگاه افست', desc: 'شروع فعالیت با یک دستگاه چاپ ۲ رنگ و تمرکز بر کارهای تجاری.' },
  { year: '۱۳۸۸', title: 'توسعه خطوط بسته‌بندی جعبه‌های دارویی', desc: 'افزایش خطوط ۵ رنگ هایدلبرگ و ورود به صنعت سلامت و داروسازی.' },
  { year: '۱۳۹۶', title: 'احداث واحد تخصصی هاردباکس', desc: 'راه‌اندازی خطوط اتوماتیک جعبه‌های سخت و مقوای فشرده لوکس.' },
  { year: '۱۴۰۴', title: 'استقرار استاندارد‌های چاپ سبز و هوشمند', desc: 'به‌کارگیری مرکب‌های گیاهی، خطوط تمام اتوماتیک بازرسی چشمی و سیستم‌های مدیریت یکپارچه.' }
]

const activeSection = ref('vision')
const navVisible = ref(true)
const isReady = ref(false)
const isNavBypassing = ref(false)
let lastScrollY = 0

function handleScrollDirection() {
  if (typeof window === 'undefined') return
  const currentY = window.scrollY
  
  if (currentY < 180) {
    navVisible.value = true
  } else if (currentY > lastScrollY + 12) {
    navVisible.value = false
  } else if (currentY < lastScrollY - 8) {
    navVisible.value = true
  }
  
  lastScrollY = currentY
}

function scrollToSection(id: string) {
  isNavBypassing.value = true
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -90
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    })
  }
  activeSection.value = id

  setTimeout(() => {
    isNavBypassing.value = false
  }, 1000)
}

onMounted(async () => {
  await nextTick()
  lastScrollY = window.scrollY
  window.addEventListener('scroll', handleScrollDirection, { passive: true })

  setTimeout(() => {
    isReady.value = true
  }, 400)

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { rootMargin: '-20% 0px -60% 0px' }
  )

  sections.value.forEach(s => {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScrollDirection)
  }
})
</script>
