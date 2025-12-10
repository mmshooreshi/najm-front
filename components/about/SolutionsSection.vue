<template>
  <section 
    id="solutions-trigger" 
    class="relative w-full bg-gray-50 overflow-hidden" 
    dir="rtl"
  >
    <div class="pinned-container w-full h-screen flex flex-col md:flex-row items-center justify-center relative px-6 md:px-20 max-w-[1440px] mx-auto">
      
      <div class="hidden md:flex flex-col gap-4 absolute left-10 z-20">
        <!-- <div 
          v-for="(item, index) in solutions" 
          :key="'ind-'+index"
          class="w-3 h-3 border border-najmgreen/50 rounded-sm transition-all duration-300"
          :class="currentIndex === index ? 'bg-najmgreen scale-125' : 'bg-transparent'"
        ></div> -->
      </div>

      <div class="w-full md:w-1/2 h-full flex flex-col justify-center relative z-10 order-2 md:order-1">
        <div 
          v-for="(item, index) in solutions" 
          :key="'text-'+index"
          class="solution-text absolute w-full md:w-4/5 flex flex-col gap-4 p-4 opacity-0 transform translate-y-10"
        >
          <h3 class="text-2xl md:text-4xl font-extrabold text-gray-800 leading-tight">
            {{ item.title }}
          </h3>
          <p class="text-base md:text-lg text-gray-600 leading-8 text-justify">
            {{ item.description }}
          </p>
        </div>
      </div>

      <div class="w-full md:w-1/2 h-[40vh] md:h-full flex items-center justify-center relative order-1 md:order-2">
        <div class="relative w-full max-w-md aspect-square md:max-w-lg md:h-[600px] flex items-center justify-center">
          
          <div 
            v-for="(item, index) in solutions" 
            :key="'img-'+index"
            class="solution-image-wrapper absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-white shadow-xl"
            style="opacity: 0; transform: scale(0.8);"
          >
            <img 
              :src="item.image || `https://placehold.co/600x600/f3f4f6/4ade80?text=${index+1}`" 
              alt="Solution Image" 
              class="w-full h-full object-cover"
            />

          </div>

          <div class="absolute -top-10 -right-10 w-20 h-20 bg-yellow-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>

        </div>
      </div>

    </div>
  </section>
  <div class="h-[400vh]"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// --- Data Mock ---
const solutions = ref([
  {
    title: 'خدمات صفر تا صد یکپارچه در یک مجموعه',
    description: 'ما تمام مسیر یک پروژه چاپ و بسته‌بندی را در یک مجموعه پوشش می‌دهیم؛ از مشاوره و طراحی اولیه تا آماده‌سازی فایل، انتخاب متریال، تولید، چاپ و تحویل نهایی. این یکپارچگی به معنی کنترل کامل روی کیفیت، زمان‌بندی و جزئیات اجراست. وقتی همه مراحل در یک مسیر مدیریت می‌شود، خطا کمتر، سرعت بالاتر و نتیجه دقیق‌تر خواهد بود.',
    image: 'images/about/solution-1.png' // Replace with actual paths
  },
  {
    title: 'پیدا کردن بهترین راهکارها در مسیر پروژه',
    description: 'هر پروژه چاپ و بسته‌بندی، قبل از اجرا نیاز به تصمیم‌های درست دارد. پیش از شروع تولید، هدف برند، نوع محصول، شرایط استفاده و محدودیت‌های اجرایی را بررسی می‌کنیم. به جای راه‌حل‌های آماده، مسیر اختصاصی هر پروژه را طراحی می‌کنیم؛ مسیری که بر اساس بودجه، تیراژ، زمان‌بندی و اثرگذاری واقعی در بازار انتخاب می‌شود.',
    image: 'images/about/solution-2.png'
  },
  {
    title: 'انعطاف‌پذیری و خلاقیت در حل چالش‌ها',
    description: 'ما پروژه‌ها را در قالب‌های خشک و محدود اجرا نمی‌کنیم. هر محدودیت، برای ما یک مسئله قابل حل است — نه یک مانع. وقتی با چالش‌هایی مثل محدودیت بودجه، زمان فشرده، تغییرات ناگهانی یا پیچیدگی فنی روبه‌رو می‌شویم، به جای توقف، راه‌حل‌های خلاقانه و اجرایی طراحی می‌کنیم.',
    image: 'images/about/solution-3.png'
  },
  {
    title: 'هزینه‌‌های بهینه و به‌صرفه نسبت به رقبا',
    description: 'نگاه ما به هزینه فقط «ارزان‌تر بودن» نیست؛ تمرکز ما روی «هوشمندانه خرج شدن» بودجه پروژه است. با انتخاب درست متریال، بهینه‌سازی تیراژ، مدیریت ضایعات و طراحی فنی دقیق، هزینه‌ها را بدون افت کیفیت کنترل می‌کنیم. نتیجه این رویکرد، پروژه‌هایی است که هم از نظر کیفیت در سطح بالا هستند و هم از نظر اقتصادی منطقی‌اند.',
    image: 'images/about/solution-4.png'
  }
])

const currentIndex = ref(0)
let ctx; 

onMounted(() => {
  ctx = gsap.context(() => {
    
    const totalSlides = solutions.value.length;
    // Each scene takes 100% of the viewport height. Total scroll distance = 400%
    const sceneDuration = 1; // Use a relative time unit for the timeline for clarity

    // 1. Pin the Section
    ScrollTrigger.create({
      trigger: "#solutions-trigger",
      start: "top top",
      end: `+=${totalSlides * 100}%`, // Dynamically set the end based on slide count
      pin: ".pinned-container",
      scrub: 0,
      // --- ADDED SNAPPING HERE ---
      snap: {
        snapTo: 1 / (totalSlides), // Snap points every 1/4 (0, 0.25, 0.5, 0.75)
        duration: { min: 0.3, max: 0.6 }, // How quickly the snap occurs (smoothness)
        ease: "power2.inOut" // Easing for the snap motion
      },
      
      onUpdate: (self) => {
        // Correctly calculate the active index based on scroll progress
        const idx = Math.min(
          totalSlides - 1, 
          Math.floor(self.progress * totalSlides)
        );
        currentIndex.value = idx;
      }
    });

    // 2. Animate Items Sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#solutions-trigger",
        start: "top top",
        end: `+=${totalSlides * 100}%`,
        scrub: 0,
      },
      // IMPORTANT: Set the first state immediately to fix the "empty at start" bug.
      // We set the initial text and image to be visible.
      paused: true, // Start paused to control setup below
    });

    const texts = gsap.utils.toArray('.solution-text');
    const images = gsap.utils.toArray('.solution-image-wrapper');
    
    // --- Initial State Setup (The Fix for showing the first slide immediately) ---
    // Make the first image and text visible immediately on load/scroll start
    gsap.set(texts[0], { opacity: 1, y: 0 });
    gsap.set(images[0], { opacity: 1, scale: 1, borderRadius: "24px" });
    // All other items remain hidden (which is the default in the template/CSS)


    // --- Slide Transitions Loop ---
    for (let i = 0; i < totalSlides; i++) {
      
      const ENTER_START = i * sceneDuration; // Where the new slide starts entering
      const EXIT_START = (i * sceneDuration) + (sceneDuration * 0.75); // 75% through the slide's time slot
      const NEXT_ENTER_START = (i + 1) * sceneDuration; // Where the next slide officially starts

      // The entrance animation for the current slide (starting from the second one)
      if (i > 0) {
        // TEXT: Enter (Swipe Up)
        tl.to(texts[i], {
          opacity: 1,
          y: 0,
          duration: sceneDuration * 0.25, // takes 25% of the total scene duration to enter
          ease: "power2.out",
          force3D: true,
        }, ENTER_START);

        // IMAGE: Enter (Scale/Radius change)
        // Reset initial large radius state
        gsap.set(images[i], { borderRadius: "150px" }); 
        tl.to(images[i], {
          opacity: 1,
          scale: 1,
          borderRadius: "24px", 
          duration: sceneDuration * 0.25,
          ease: "power3.out",
        force3D: true,
        }, ENTER_START);
      }
      
      // The exit animation for the current slide (only if it's not the last one)
      if (i < totalSlides - 1) {
         // TEXT: Exit (Go Up) - starts overlaying with the next slide's entrance
        tl.to(texts[i], {
          opacity: 0,
          y: -50,
          duration: sceneDuration * 0.25,
          ease: "power2.in"
        }, EXIT_START); // Start exit at 75% of the time slot

        // IMAGE: Exit
        tl.to(images[i], {
          opacity: 0,
          scale: 0.9,
          duration: sceneDuration * 0.25
        }, EXIT_START);
      }
    }
  });
})

onUnmounted(() => {
  ctx && ctx.revert();
})
</script>

<style scoped>
/* Hide scrollbar if needed, though usually handled by browser */
.pinned-container {
  /* Ensure it sits correctly */
  will-change: transform;
}
</style>