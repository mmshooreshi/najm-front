<template>
  <div class="wrapper mt-64">
    <div class="quote text-d4" ref="quote">
      <p>زندگی یه بازیه… ولی مثل Dota، هیچ‌وقت نمی‌فهمی کی دقیقاً باختی.</p>
<p>هر صبح بیدار می‌شی با امید اینکه امروز maybe بهتر بازی کنی… بعد دوباره با یه تیم افتضاح match می‌شی.</p>
<p>عشق؟ اگه مثل هم‌تیمی‌های pub باشه، ترجیح می‌دم AFK بمونه.</p>
<p>همه می‌گن «مثبت باش»، ولی هیچ‌کس نمی‌گه وقتی mmr افتاد چطوری لبخند بزنی.</p>
<p>رویا؟ یه TI بردن. واقعیت؟ keyboard شکسته و یه مادر که فکر می‌کنه "دوتا" اسم یه درسه.</p>
<p>هر کسی یه advice داره، ولی وقتی تو بازی feed می‌دن، انگار mute شدن.</p>
<p>آینده؟ احتمالا یه سری reroll با همون نتیجه قبلی. ولی خب، حداقل low priority نیستم (هنوز).</p>
<p>ایمان؟ دارم… به IceFrog که شاید یه روز بالاخره بازی رو بالانس کنه.</p>
<p>امید؟ هر بار که وارد بازی می‌شم باهامه، تا وقتی یه sniper با jungler بیاد تو تیمم.</p>
<p>در کل؟ فقط می‌خوام یه بار win streak بگیرم که مامانم فکر کنه تو زندگی موفق شدم.</p>
</div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const quote = ref<HTMLElement | null>(null)

function setupSplits() {
  const el = quote.value
  if (!el) return

  // Reset previous animation
  if ((el as any).anim) {
    (el as any).anim.progress(1).kill()
    ;(el as any).split.revert()
  }

  ;(el as any).split = new SplitText(el, {
    type: 'lines',
    linesClass: 'split-line',
  })

  ;(el as any).anim = gsap.from((el as any).split.lines, {
    scrollTrigger: {
      trigger: el,
      toggleActions: 'restart pause resume reverse',
      start: 'center center',
      markers: true,
    },
    duration: 1,
    ease: 'back.out(1.7)',
    // y: 200,
    clipPath: 'inset(0 0 40% 0)',
    yPercent: 100, // start below
    opacity: 0,
    stagger: 0.05,
  })
}

onMounted(() => {
  ScrollTrigger.addEventListener('refresh', setupSplits)
  setupSplits()
})
</script>

<style scoped>
.wrapper {
  min-height: 200vh;
  background: #f5f5f5;
  font-family: sans-serif;
  direction: rtl;
  text-align: right;
}

.quote {
  max-width: 6000px;
  margin: 0 auto;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #333;
  position: relative;
  overflow: visible;
}

.split-line {
  display: block;
  overflow: hidden;
}
</style>
