<template>
  <section 
    id="solutions-trigger" 
    class="relative w-full bg-gray-50 overflow-hidden" 
    dir="rtl"
  >
    <div class="pinned-container w-full h-screen flex flex-col md:flex-row items-center justify-center relative px-6 md:px-20 max-w-[1440px] mx-auto">
      
      <div class="hidden md:flex flex-col gap-4 absolute left-10 z-20">
        <div 
          v-for="(item, index) in solutions" 
          :key="'ind-'+index"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="currentIndex === index ? 'bg-green-500 scale-150' : 'bg-gray-300'"
        ></div>
      </div>

      <div class="w-full md:w-1/2 h-full flex flex-col justify-center relative z-10 order-2 md:order-1 pointer-events-none">
        <div class="relative w-full h-[300px] md:h-[400px] flex items-center">
          <div 
            v-for="(item, index) in solutions" 
            :key="'text-'+index"
            class="solution-text absolute top-0 w-full md:w-4/5 flex flex-col gap-4 p-4"
          >
            <h3 class="text-2xl md:text-4xl font-extrabold text-gray-800 leading-tight">
              {{ item.title }}
            </h3>
            <p class="text-base md:text-lg text-gray-600 leading-8 text-justify">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>

      <div class="w-full md:w-1/2 h-[40vh] md:h-full flex items-center justify-center relative order-1 md:order-2">
        <div class="relative w-full max-w-md aspect-square md:max-w-lg md:h-[500px] flex items-center justify-center">
          
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-50 animate-pulse z-0"></div>

          <div 
            v-for="(item, index) in solutions" 
            :key="'img-'+index"
            class="solution-image-wrapper absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-white shadow-2xl rounded-3xl z-10 will-change-transform"
          >
            <img 
              :src="item.image || `https://placehold.co/600x600/f3f4f6/4ade80?text=${index+1}`" 
              alt="Solution Image" 
              class="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>

    </div>
  </section>
  <div class="h-[50vh]"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// --- Data ---
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
    
    const texts = gsap.utils.toArray('.solution-text');
    const images = gsap.utils.toArray('.solution-image-wrapper');
    const total = solutions.value.length;

    // --- 1. Initial Setup ---
    gsap.set(texts, { autoAlpha: 0, y: 50 }); 
    gsap.set(texts[0], { autoAlpha: 1, y: 0 });

    gsap.set(images, { zIndex: i => i });
    gsap.set(images, { autoAlpha: 0, scale: 0.8, yPercent: 100 }); 
    gsap.set(images[0], { autoAlpha: 1, scale: 1, yPercent: 0 });

    // --- 2. The Timeline ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#solutions-trigger",
        start: "top top",
        // SHORTENED DISTANCE: Makes it highly sensitive. 
        // Lower percentage = less scrolling needed to finish.
        end: `+=${total * 50}%`, 
        pin: ".pinned-container",
        // INSTANT RESPONSE: Removes the "heavy" resistance feeling.
        scrub: 0, 
        snap: {
          snapTo: "labels", 
          // DIRECTIONAL SNAP: The key feature. 
          // Even a 1px scroll down triggers the snap to the NEXT slide.
          directional: true, 
          duration: { min: 0.2, max: 0.4 }, // Fast snap duration
          delay: 0, // Snap immediately when scroll stops (no wait)
          ease: "power1.inOut"
        },
        onUpdate: (self) => {
            // Update active index for the dots
            // We map the progress (0 to 1) to the slide index (0 to total-1)
            const idx = Math.round(self.progress * (total - 1));
            // Only update if changed to avoid unnecessary re-renders
            if (currentIndex.value !== idx) {
              currentIndex.value = idx;
            }
        }
      }
    });

    // Add label for start
    tl.addLabel("slide-0");

    for (let i = 1; i < total; i++) {
      const prevText = texts[i - 1];
      const prevImg = images[i - 1];
      const currText = texts[i];
      const currImg = images[i];

      // Animations - Tuned for speed
      tl.to(prevText, { y: -30, autoAlpha: 0, duration: 0.3, ease: "power1.in" }, ">")
        .to(currText, { y: 0, autoAlpha: 1, duration: 0.3, ease: "power1.out" }, "<+0.05");

      tl.to(prevImg, { scale: 0.95, autoAlpha: 0, duration: 0.3 }, "<"); 
      tl.to(currImg, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.4, ease: "power2.out" }, "<");

      tl.addLabel(`slide-${i}`);
    }
  });
})

onUnmounted(() => {
  ctx && ctx.revert();
})
</script>

<style scoped>
.will-change-transform {
  will-change: transform, opacity;
}
</style>