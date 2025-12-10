<template>
  <section 
    id="solutions-trigger" 
    class="relative w-full bg-gray-50 overflow-hidden" 
    dir="rtl"
  >
    <div class="pinned-container w-full h-screen flex flex-col md:flex-row items-center justify-center relative px-6 md:px-20 max-w-[1440px] mx-auto">
      
      <div class="w-full md:w-1/2 h-full flex flex-col justify-center relative z-10 order-2 md:order-1 pointer-events-none">
        <div class="relative w-full h-[300px] md:h-[400px] flex items-center">
          <div 
            v-for="(item, index) in solutions" 
            :key="'text-'+index"
            class="solution-text absolute top-0 w-full md:w-4/5 flex flex-col gap-4 p-4 will-change-transform"
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
          
          <div class="relative w-full h-full overflow-visible">
             <div 
              v-for="(item, index) in solutions" 
              :key="'img-'+index"
              class="solution-image-wrapper absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-white shadow-2xl will-change-transform"
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

    </div>
  </section>
  <div class="h-[400vh]"></div> 
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// No need for ScrollToPlugin in this clean snap approach

gsap.registerPlugin(ScrollTrigger)

const solutions = ref([
  {
    title: 'خدمات صفر تا صد یکپارچه در یک مجموعه',
    description: 'ما تمام مسیر یک پروژه چاپ و بسته‌بندی را در یک مجموعه پوشش می‌دهیم؛ از مشاوره و طراحی اولیه تا آماده‌سازی فایل، انتخاب متریال، تولید، چاپ و تحویل نهایی. این یکپارچگی به معنی کنترل کامل روی کیفیت، زمان‌بندی و جزئیات اجراست. وقتی همه مراحل در یک مسیر مدیریت می‌شود، خطا کمتر، سرعت بالاتر و نتیجه دقیق‌تر خواهد بود.',
    image: 'images/about/solution-1.png'
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
let ctx; 

onMounted(() => {
  ctx = gsap.context(() => {
    
    const texts = gsap.utils.toArray('.solution-text');
    const images = gsap.utils.toArray('.solution-image-wrapper');
    const total = solutions.value.length;

    // --- 1. Initial State Setup ---
    gsap.set(texts, { autoAlpha: 0, y: 30 }); 
    gsap.set(texts[0], { autoAlpha: 1, y: 0 });

    gsap.set(images, { zIndex: i => i });
    gsap.set(images, { yPercent: 100, borderRadius: "50%", opacity: 0 });
    gsap.set(images[0], { yPercent: 0, borderRadius: "24px", opacity: 1, zIndex: 10 });

    // --- 2. The Master Timeline ---
    const tl = gsap.timeline();

    // The duration of the content transition (text/image)
    const contentDuration = 0.6;

    for (let i = 1; i < total; i++) {
      const prevText = texts[i - 1];
      const prevImg = images[i - 1];
      const currText = texts[i];
      const currImg = images[i];

      // Use a label to segment the timeline for pinning/snapping
      tl.addLabel(`slide-${i}`, `+=${i === 1 ? 0 : 1}`); // Each transition starts 1 unit after the previous one ends

      // --- Text Sequencing (No Overlap) ---
      
      tl.to(prevText, { y: -30, autoAlpha: 0, duration: 0.2, ease: "power1.in" }, `slide-${i}`)
        .to(currText, { y: 0, autoAlpha: 1, duration: 0.3, ease: "power1.out" }, `slide-${i}+=0.2`); 

      // --- Image Slide Transition (Runs parallel to the text sequence) ---
      
      // Exiting Image
      tl.to(prevImg, { 
        yPercent: -100, borderRadius: "50%", opacity: 0,
        duration: contentDuration, ease: "power2.inOut"
      }, `slide-${i}`); 

      // Entering Image
      tl.fromTo(currImg, 
        { yPercent: 100, borderRadius: "50%", opacity: 0, zIndex: i + 10 },
        { yPercent: 0, borderRadius: "24px", opacity: 1,
        duration: contentDuration, ease: "power2.inOut" 
      }, `slide-${i}`); 
    }
    
    // --- 3. ScrollTrigger Configuration (The Control Mechanism) ---
    ScrollTrigger.create({
      trigger: "#solutions-trigger",
      start: "top top",
      // End is now 300% (4 slides = 3 transitions * 100vh scroll space)
      end: `+=${(total - 1) * 100}%`, 
      pin: ".pinned-container",
      animation: tl, // Attach the master timeline
      // INSTANT MOTION: Scroll controls animation directly (no lag)
      scrub: 0, 
      // SNAP: Ensures it lands exactly on a slide. total-1 transitions means 4 snap points (0, 1/3, 2/3, 1)
      snap: {
        snapTo: 1 / (total - 1), 
        duration: { min: 0.6, max: 0.8 }, // Quick snap duration for feeling of continuation
        delay: 0.05, // Small delay to prevent jitter, but not noticeable
        ease: "power2.inOut"
      },
      // markers: true
    });
  });
})

onUnmounted(() => {
  ctx && ctx.revert();
})
</script>

<style scoped>
.will-change-transform {
  will-change: transform, opacity, border-radius;
}
</style>