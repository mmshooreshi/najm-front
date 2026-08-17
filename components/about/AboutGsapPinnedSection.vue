<!-- components/about/AboutGsapPinnedSection.vue -->
<template>
  <section
    ref="pinWrapperRef"
    dir="rtl"
    class="relative w-full overflow-hidden bg-neutral-900 text-white rounded-3xl my-12"
  >
    <!-- Background Ambient Glow -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(1,68,57,0.4),rgba(255,255,255,0))] pointer-events-none"></div>

    <!-- Pinned Viewport Container -->
    <div
      ref="pinContentRef"
      class="min-h-screen w-full flex flex-col justify-between py-12 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto relative z-10"
    >
      <!-- Top Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div class="space-y-2 text-right">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 text-d4">
            رویکرد و استانداردهای تولید
          </span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-white text-d4 tracking-tight">
            راهکارها و مزیت‌های محوری چاپ نجم
          </h2>
        </div>

        <!-- Dynamic Counter -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-neutral-400">گام‌های تحول صنعتی</span>
          <div class="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-400 font-mono text-sm font-bold border border-white/10">
            ۰{{ currentStep + 1 }} / ۰{{ slides.length }}
          </div>
        </div>
      </div>

      <!-- Main Stage: Slide Content & Media (Frameless GSAP Animation) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-auto py-8">
        <!-- Right: Text Narrative (6 cols) -->
        <div class="lg:col-span-6 space-y-6 text-right order-2 lg:order-1 relative min-h-[260px] flex flex-col justify-center">
          <div
            v-for="(slide, idx) in slides"
            :key="slide.id"
            :ref="el => textSlideRefs[idx] = el as HTMLElement"
            class="transition-opacity duration-300"
            :class="currentStep === idx ? 'block' : 'hidden'"
          >
            <div class="flex items-center gap-2 mb-3">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs font-mono text-emerald-400 font-bold">۰{{ idx + 1 }} — راهکار اختصاصی</span>
            </div>

            <h3 class="text-2xl sm:text-3xl font-extrabold text-white text-d4 leading-snug mb-4">
              {{ slide.title }}
            </h3>

            <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {{ slide.body }}
            </p>
          </div>

          <!-- Step Progress Trackers -->
          <div class="flex items-center gap-3 pt-6 border-t border-white/10">
            <button
              v-for="(slide, idx) in slides"
              :key="slide.id"
              @click="goToSlide(idx)"
              class="h-1.5 rounded-full transition-all duration-400 cursor-pointer"
              :class="currentStep === idx ? 'w-12 bg-emerald-400' : 'w-3 bg-white/20 hover:bg-white/40'"
              :title="slide.title"
            ></button>
          </div>
        </div>

        <!-- Left: Visual Asset Showcase with Morph & Scale (6 cols) -->
        <div class="lg:col-span-6 order-1 lg:order-2">
          <div class="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-neutral-800 border border-white/10 shadow-2xl">
            <div
              v-for="(slide, idx) in slides"
              :key="slide.id"
              :ref="el => imgSlideRefs[idx] = el as HTMLElement"
              class="absolute inset-0 w-full h-full transition-opacity duration-500 ease-out"
              :class="currentStep === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'"
            >
              <img
                :src="'/' + slide.image.replace(/^\//, '')"
                :alt="slide.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              
              <div class="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white pointer-events-none">
                <span class="text-xs font-bold text-d4 text-emerald-300">{{ slide.title }}</span>
                <span class="text-[11px] text-white/70 font-mono">NAJM PACKAGING 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Hint Bar -->
      <div class="flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/10 pt-4">
        <span>برای مرور راهکارها به اسکرول ادامه دهید</span>
        <span class="font-mono text-emerald-400">GSAP PINNED TIMELINE</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Slide {
  id: string
  title: string
  body: string
  image: string
}

const slides: Slide[] = [
  {
    id: 'full-service',
    title: 'خدمات صفر تا صد یکپارچه در یک مجتمع صنعتی',
    body: `ما تمام مسیر یک پروژه چاپ و بسته‌بندی را در یک مجتمع پوشش می‌دهیم؛ از مشاوره و طراحی ساختاری تا لیتوگرافی CTP، چاپ افست ۵ رنگ هایدلبرگ، سلفون‌کشی حرارتی، دایکات و جعبه‌چسبانی اتوماتیک.\nاین یکپارچگی ضامن نظارت مستقیم بر دقت تیغ، انطباق کامل رنگ و زمان‌بندی دقیق تحویل است.`,
    image: 'images/about/solution-1.png'
  },
  {
    id: 'best-path',
    title: 'طراحی اختصاصی ساختار و انتخاب هوشمندانه متریال',
    body: `پیش از شروع تولید، شرایط فیزیکی محصول، وزن، مقاومت به سایش و الزامات انبارداری و صادرات ارزیابی می‌شود.\nبه جای راه‌حل‌های تکراری، ساختار بهینه را بر پایه مقواهای ایندربرد، کرافت، فلوت‌دار یا هاردباکس مهندسی می‌کنیم.`,
    image: 'images/about/solution-2.png'
  },
  {
    id: 'flex-creativity',
    title: 'انعطاف‌پذیری و حل چالش‌های پیچیده تولید',
    body: `هر محدودیت در تیراژ، فرم هندسی یا پوشش‌های تکمیلی برای ما یک مسئله مهندسی قابل حل است.\nبا بهره‌گیری از تجربه ۲۵ ساله و تجهیزات تکمیلی، سفارشات خاص با ساختارهای دشوار را با بالاترین کیفیت به سرانجام می‌رسانیم.`,
    image: 'images/about/solution-3.png'
  },
  {
    id: 'smart-cost',
    title: 'بهینه‌سازی اقتصادی و کاهش ضایعات کاغذ و مقوا',
    body: `تمرکز ما روی مدیریت علمی و هوشمندانه مصرف کاغذ و مقوا است.\nبا چیدمان دقیق فرم‌ها در لیتوگرافی (Imposition)، دورریز متریال را به حداقل رسانده و قیمت تمام‌شده هر جعبه را برای برند شما به‌صرفه می‌سازیم.`,
    image: 'images/about/solution-4.png'
  }
]

const pinWrapperRef = ref<HTMLElement | null>(null)
const pinContentRef = ref<HTMLElement | null>(null)
const currentStep = ref(0)
const textSlideRefs = ref<HTMLElement[]>([])
const imgSlideRefs = ref<HTMLElement[]>([])

let scrollTriggerInstance: ScrollTrigger | null = null

function goToSlide(idx: number) {
  currentStep.value = idx
}

onMounted(() => {
  if (process.client) {
    gsap.registerPlugin(ScrollTrigger)

    const wrapper = pinWrapperRef.value
    const content = pinContentRef.value
    if (!wrapper || !content) return

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top+=70',
      end: () => `+=${slides.length * 550}`,
      pin: content,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress
        const count = slides.length
        const index = Math.min(count - 1, Math.floor(p * count))
        if (index !== currentStep.value) {
          currentStep.value = index
        }
      }
    })
  }
})

onUnmounted(() => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
    scrollTriggerInstance = null
  }
})
</script>
