<!-- components/about/SolutionsShowcase.vue -->
<template>
  <div dir="rtl" class="w-full space-y-12">
    <!-- Section Title & Narrative Lead -->
    <div class="space-y-3 max-w-2xl text-right">
      <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen text-d4">
        مزیت‌های رقابتی و استانداردهای تولید
      </span>
      <h2 class="text-2xl sm:text-4xl font-extrabold text-gray-900 text-d4 leading-tight">
        راهکارها و رویکرد ما در اجرای پروژه‌ها
      </h2>
      <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
        از مرحله ایده و طراحی ساختاری تا تحویل تیراژهای میلیونی، نگاه ما بر پایه دقت مهندسی، کاهش ضایعات و تضمین خروجی بی‌نقص استوار است.
      </p>
    </div>

    <!-- Fluid Interactive Showcase (No heavy card frames, no scroll-locking jumps) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
      <!-- Right: Interactive Step Timeline (6 cols) -->
      <div class="lg:col-span-6 space-y-4 order-2 lg:order-1">
        <div
          v-for="(item, idx) in solutions"
          :key="item.id"
          @click="setActiveIndex(idx)"
          class="p-5 sm:p-6 rounded-3xl transition-all duration-300 cursor-pointer text-right group relative overflow-hidden"
          :class="[
            activeIndex === idx
              ? 'bg-white shadow-md border-r-4 border-najmgreen'
              : 'hover:bg-white/60 opacity-70 hover:opacity-100'
          ]"
        >
          <!-- Step Header -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <span
                class="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-d4 transition-colors"
                :class="activeIndex === idx ? 'bg-najmgreen text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'"
              >
                ۰{{ idx + 1 }}
              </span>
              <h3
                class="text-base sm:text-lg font-bold text-d4 transition-colors"
                :class="activeIndex === idx ? 'text-gray-900' : 'text-gray-700'"
              >
                {{ item.title }}
              </h3>
            </div>
            <Icon
              :name="activeIndex === idx ? 'mdi:check-circle' : 'mdi:circle-outline'"
              class="w-4 h-4 transition-colors"
              :class="activeIndex === idx ? 'text-najmgreen' : 'text-gray-300 group-hover:text-gray-400'"
            />
          </div>

          <!-- Body Description with Smooth Height Transition -->
          <div
            class="transition-all duration-400 overflow-hidden"
            :class="activeIndex === idx ? 'max-h-60 opacity-100 mt-3 pt-2 border-t border-gray-100' : 'max-h-0 opacity-0'"
          >
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {{ item.body }}
            </p>
          </div>

          <!-- Active Timer Line Bar -->
          <div
            v-if="activeIndex === idx"
            class="absolute bottom-0 right-0 h-0.5 bg-najmgreen transition-all duration-100"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
      </div>

      <!-- Left: Frameless Hero Visual with Smooth Cross-fade (6 cols) -->
      <div class="lg:col-span-6 order-1 lg:order-2">
        <div class="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-lg bg-gray-100">
          <transition-group name="fade-slide">
            <div
              v-for="(item, idx) in solutions"
              v-show="activeIndex === idx"
              :key="item.id"
              class="absolute inset-0 w-full h-full"
            >
              <img
                :src="'/' + item.image.replace(/^\//, '')"
                :alt="item.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

              <!-- Floating Metadata Pill -->
              <div class="absolute bottom-4 right-4 left-4 text-white flex items-center justify-between pointer-events-none">
                <div class="space-y-0.5">
                  <div class="text-xs font-bold text-d4">{{ item.title }}</div>
                  <div class="text-[10px] text-white/80">مجتمع تخصصی چاپ و بسته‌بندی نجم</div>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold font-mono">
                  ۰{{ idx + 1 }} / ۰{{ solutions.length }}
                </span>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Solution {
  id: string
  title: string
  body: string
  image: string
}

const solutions: Solution[] = [
  {
    id: 'full-service',
    title: 'خدمات صفر تا صد یکپارچه در یک مجتمع صنعتی',
    body: `ما تمام مسیر یک پروژه چاپ و بسته‌بندی را درون یک مجموعه پوشش می‌دهیم؛ از مشاوره مهندسی و طراحی ساختار جعبه تا لیتوگرافی CTP، چاپ افست ۵ رنگ، سلفون‌کشی، دایکات و جعبه‌چسبانی اتوماتیک.\nاین یکپارچگی به معنی نظارت مستقیم بر دقت تیغ، انطباق رنگ و تحویل به‌موقع است.`,
    image: 'images/about/solution-1.png'
  },
  {
    id: 'best-path',
    title: 'طراحی اختصاصی ساختار و انتخاب هوشمندانه متریال',
    body: `پیش از شروع تولید، شرایط فیزیکی محصول، وزن، مسیرهای حمل‌ونقل و بازارهای هدف بررسی می‌شود.\nبه جای قالب‌های تکراری، ساختار بهینه را با متریال متناسب (ایندربرد، کرافت، فلوت‌دار یا هاردباکس) طراحی می‌کنیم تا بیشترین مقاومت و زیبایی حاصل شود.`,
    image: 'images/about/solution-2.png'
  },
  {
    id: 'flex-creativity',
    title: 'انعطاف‌پذیری و حل چالش‌های پیچیده تولید',
    body: `هر محدودیت فنی در ابعاد، گرماژ یا پوشش‌های تکمیلی برای ما یک مسئله قابل حل است.\nبا بهره‌گیری از تیم کارشناسی ارشد و تجهیزات مکمل، سفارشات خاص با ساختارهای دشوار را با بالاترین کیفیت به سرانجام می‌رسانیم.`,
    image: 'images/about/solution-3.png'
  },
  {
    id: 'smart-cost',
    title: 'بهینه‌سازی اقتصادی و کاهش ضایعات کاغذ و مقوا',
    body: `نگاه ما به هزینه، مدیریت علمی و هوشمندانه متریال است.\nبا طراحی چیدمان دقیق فرم‌ها (Imposition) در لیتوگرافی، دورریز مقوا را به حداقل رسانده و قیمت تمام‌شده هر واحد جعبه را برای برند شما مقرون‌به‌صرفه می‌سازیم.`,
    image: 'images/about/solution-4.png'
  }
]

const activeIndex = ref(0)
const progressPercent = ref(0)
let timer: any = null
const duration = 6000 // 6s per slide

function startTimer() {
  stopTimer()
  progressPercent.value = 0
  const step = 50
  timer = setInterval(() => {
    progressPercent.value += (step / duration) * 100
    if (progressPercent.value >= 100) {
      activeIndex.value = (activeIndex.value + 1) % solutions.length
      progressPercent.value = 0
    }
  }, step)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function setActiveIndex(idx: number) {
  activeIndex.value = idx
  startTimer()
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
