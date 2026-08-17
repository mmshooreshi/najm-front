<!-- components/about/AboutGsapPinnedSection.vue -->
<template>
  <div
    ref="sectionContainerRef"
    dir="rtl"
    class="relative w-full"
    :style="{ height: `${slides.length * 90}vh` }"
  >
    <!-- Sticky Pinned Viewport Stage (Physically locked to viewport while scrolling through 360vh track) -->
    <div
      class="sticky top-20 h-[calc(100vh-6.5rem)] w-full flex flex-col justify-between rounded-3xl bg-neutral-900 text-white overflow-hidden shadow-2xl p-6 sm:p-10 lg:p-12 border border-white/10"
    >
      <!-- Background Radial Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(1,68,57,0.45),rgba(0,0,0,0))] pointer-events-none"></div>

      <!-- Top Section Bar -->
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div class="space-y-1 text-right">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 text-d4">
            رویکرد و استانداردهای تولید
          </span>
          <h2 class="text-xl sm:text-3xl font-extrabold text-white text-d4 tracking-tight">
            راهکارها و مزیت‌های محوری چاپ نجم
          </h2>
        </div>

        <!-- Step Pill Counter & Progress Line -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-neutral-400">راهکار ۰{{ activeIndex + 1 }} از ۰{{ slides.length }}</span>
          <div class="flex items-center gap-1.5">
            <div
              v-for="(_, idx) in slides"
              :key="idx"
              class="h-2 rounded-full transition-all duration-300"
              :class="activeIndex === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-white/20'"
            ></div>
          </div>
        </div>
      </div>

      <!-- Main Stage: Slide Content & Media -->
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-2">
        <!-- Right: Text Narrative (6 cols) -->
        <div class="lg:col-span-6 space-y-5 text-right order-2 lg:order-1 relative min-h-[220px] flex flex-col justify-center">
          <transition name="slide-fade" mode="out-in">
            <div :key="currentSlide.id" class="space-y-4">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-xs font-mono text-emerald-400 font-bold">۰{{ activeIndex + 1 }} — راهکار اختصاصی</span>
              </div>

              <h3 class="text-2xl sm:text-3xl font-extrabold text-white text-d4 leading-snug">
                {{ currentSlide.title }}
              </h3>

              <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                {{ currentSlide.body }}
              </p>
            </div>
          </transition>

          <!-- Step Progress Trackers -->
          <div class="flex items-center gap-2.5 pt-4 border-t border-white/10">
            <button
              v-for="(slide, idx) in slides"
              :key="slide.id"
              @click="jumpToStep(idx)"
              class="h-2 rounded-full transition-all duration-300 cursor-pointer"
              :class="activeIndex === idx ? 'w-12 bg-emerald-400' : 'w-3 bg-white/20 hover:bg-white/40'"
              :title="slide.title"
            ></button>
          </div>
        </div>

        <!-- Left: Visual Asset Showcase (6 cols) -->
        <div class="lg:col-span-6 order-1 lg:order-2">
          <div class="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-800 border border-white/10 shadow-2xl">
            <transition name="image-morph" mode="out-in">
              <div :key="currentSlide.id" class="relative w-full h-full">
                <img
                  :src="'/' + currentSlide.image.replace(/^\//, '')"
                  :alt="currentSlide.title"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                
                <div class="absolute bottom-3.5 right-4 left-4 flex items-center justify-between text-white pointer-events-none">
                  <span class="text-xs font-bold text-d4 text-emerald-300">{{ currentSlide.title }}</span>
                  <span class="text-[10px] text-white/70 font-mono">۰{{ activeIndex + 1 }} / ۰{{ slides.length }}</span>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Bottom Hint Bar -->
      <div class="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/10 pt-3">
        <span>برای مرور راهکارها به اسکرول ادامه دهید (گام ۰{{ activeIndex + 1 }} از ۰{{ slides.length }})</span>
        <span class="text-emerald-400/90 font-medium">مجتمع تخصصی چاپ و بسته‌بندی نجم</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    isBypassing?: boolean
  }>(),
  {
    isBypassing: false
  }
)

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

const sectionContainerRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const currentSlide = computed(() => slides[activeIndex.value] || slides[0])

function handleScroll() {
  if (props.isBypassing || !sectionContainerRef.value || typeof window === 'undefined') return

  const rect = sectionContainerRef.value.getBoundingClientRect()
  const totalTravel = sectionContainerRef.value.offsetHeight - window.innerHeight
  if (totalTravel <= 0) return

  // Scrolled distance into the section
  const scrolled = -rect.top
  const progress = Math.max(0, Math.min(1, scrolled / totalTravel))

  const step = Math.min(slides.length - 1, Math.floor(progress * slides.length))
  if (step !== activeIndex.value) {
    activeIndex.value = step
  }
}

function jumpToStep(idx: number) {
  if (!sectionContainerRef.value || typeof window === 'undefined') return
  const totalTravel = sectionContainerRef.value.offsetHeight - window.innerHeight
  const stepRatio = idx / (slides.length - 1)
  const targetY = sectionContainerRef.value.offsetTop + stepRatio * totalTravel
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

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.image-morph-enter-active,
.image-morph-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.image-morph-enter-from {
  opacity: 0;
  transform: scale(0.96);
}
.image-morph-leave-to {
  opacity: 0;
  transform: scale(1.04);
}
</style>
