<!-- components/about/AboutGsapPinnedSection.vue -->
<template>
  <div
    ref="trackRef"
    dir="rtl"
    class="relative w-full"
    :style="{ height: `${slides.length * 100}vh` }"
  >
    <!-- Sticky Firmly Locked Viewport Stage (100% locked until all slides are scrolled) -->
    <div class="sticky top-20 h-[calc(100vh-6rem)] w-full flex flex-col justify-between rounded-3xl bg-neutral-900 text-white overflow-hidden shadow-2xl p-6 sm:p-10 lg:p-14 border border-white/10">
      <!-- Background Ambient Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(1,68,57,0.45),rgba(0,0,0,0))] pointer-events-none"></div>

      <!-- Top Section Bar -->
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div class="space-y-1.5 text-right">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 text-d4">
            رویکرد و استانداردهای تولید
          </span>
          <h2 class="text-xl sm:text-3xl font-extrabold text-white text-d4 tracking-tight">
            راهکارها و مزیت‌های محوری چاپ نجم
          </h2>
        </div>

        <!-- Step Pill Badge & Progress Bar -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-neutral-400">گام ۰{{ currentStep + 1 }} از ۰{{ slides.length }}</span>
          <div class="w-28 h-2 rounded-full bg-white/10 overflow-hidden relative">
            <div
              class="absolute inset-y-0 right-0 bg-emerald-400 rounded-full transition-all duration-150"
              :style="{ width: `${progress * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Main Locked Stage: Slide Content & Media -->
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-4">
        <!-- Right: Text Narrative (6 cols) -->
        <div class="lg:col-span-6 space-y-6 text-right order-2 lg:order-1 relative min-h-[220px] flex flex-col justify-center">
          <div
            v-for="(slide, idx) in slides"
            :key="slide.id"
            class="transition-all duration-500 ease-out"
            :class="[
              currentStep === idx
                ? 'opacity-100 translate-y-0 pointer-events-auto block'
                : 'opacity-0 translate-y-4 pointer-events-none hidden'
            ]"
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
          <div class="flex items-center gap-2.5 pt-4 border-t border-white/10">
            <button
              v-for="(slide, idx) in slides"
              :key="slide.id"
              @click="jumpToStep(idx)"
              class="h-1.5 rounded-full transition-all duration-400 cursor-pointer"
              :class="currentStep === idx ? 'w-12 bg-emerald-400' : 'w-3 bg-white/20 hover:bg-white/40'"
              :title="slide.title"
            ></button>
          </div>
        </div>

        <!-- Left: Visual Asset Showcase (6 cols) -->
        <div class="lg:col-span-6 order-1 lg:order-2">
          <div class="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-800 border border-white/10 shadow-2xl">
            <div
              v-for="(slide, idx) in slides"
              :key="slide.id"
              class="absolute inset-0 w-full h-full transition-all duration-500 ease-out"
              :class="[
                currentStep === idx
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-95 z-0 pointer-events-none'
              ]"
            >
              <img
                :src="'/' + slide.image.replace(/^\//, '')"
                :alt="slide.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              
              <div class="absolute bottom-3.5 right-4 left-4 flex items-center justify-between text-white pointer-events-none">
                <span class="text-xs font-bold text-d4 text-emerald-300">{{ slide.title }}</span>
                <span class="text-[10px] text-white/70 font-mono">۰{{ idx + 1 }} / ۰{{ slides.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Status Bar -->
      <div class="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/10 pt-3">
        <span class="text-neutral-400">برای مرور راهکارها به اسکرول ادامه دهید</span>
        <span class="text-emerald-400/90 font-medium">مجتمع تخصصی چاپ و بسته‌بندی نجم</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

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
    body: `ما تمام مسیر یک پروژه چاپ و بسته‌بندی را درون یک مجموعه پوشش می‌دهیم؛ از مشاوره و طراحی ساختاری تا لیتوگرافی CTP، چاپ افست ۵ رنگ هایدلبرگ، سلفون‌کشی حرارتی، دایکات و جعبه‌چسبانی اتوماتیک.\nاین یکپارچگی ضامن نظارت مستقیم بر دقت تیغ، انطباق کامل رنگ و زمان‌بندی دقیق تحویل است.`,
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

const trackRef = ref<HTMLElement | null>(null)
const currentStep = ref(0)
const progress = ref(0)

function handleScroll() {
  if (!trackRef.value || typeof window === 'undefined') return

  const rect = trackRef.value.getBoundingClientRect()
  const totalTravel = trackRef.value.offsetHeight - window.innerHeight
  if (totalTravel <= 0) return

  // How far user has scrolled into this section
  const scrolled = -rect.top
  const rawProgress = Math.max(0, Math.min(1, scrolled / totalTravel))
  progress.value = rawProgress

  const step = Math.min(slides.length - 1, Math.floor(rawProgress * slides.length))
  if (step !== currentStep.value) {
    currentStep.value = step
  }
}

function jumpToStep(idx: number) {
  if (!trackRef.value || typeof window === 'undefined') return
  const totalTravel = trackRef.value.offsetHeight - window.innerHeight
  const stepRatio = idx / (slides.length - 1)
  const targetY = trackRef.value.offsetTop + stepRatio * totalTravel
  window.scrollTo({ top: targetY, behavior: 'smooth' })
}

onMounted(async () => {
  await nextTick()
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
  }
})
</script>
