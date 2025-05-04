
<template>
  <div >
    <!-- border-t-2 border-red-500 -->
    <!-- <div class="border-t-2 border-red-500 fixed top-[65px] left-0 w-full  z-[9999] pointer-events-none">
  <p class="text-red-500 text-xs ml-2">rootMargin top (-200px)</p>
</div> -->

    <!-- <div class="fixed bottom-4 right-4 bg-white/90 p-4 rounded-xl shadow-md text-xs text-black z-50">
      <p><strong>Debug:</strong></p>
      <p><code>initialDelay</code>: {{ initialDelay }}</p>
      <p><code>Speed</code>: {{ speed }}</p>

      <p><code>isVisible</code>: {{ isVisible }}</p>
      <p><code>intersectionRatio</code>: {{ intersectionRatio.toFixed(2) }}</p>
      <p><code>playedOnce</code>: {{ playedOnce }}</p>
    </div> -->
    <section
      ref="sectionRef"
      class="rtl max-w-xl mx-auto space-y-0 p-0 sm:p-2 text-right leading-relaxed flex flex-wrap justify-center w-full "
      
      >
      <!--top classes can get these added tO: border border-4 border-black rounded-3xl -->
      <template v-for="(h, i) in highlights" :key="i">
        <div v-if="h.label === 'break'" class="w-full bg-blue"></div>
        <div v-else class="flex flex-row justify-start items-center text-nowrap">
          <span
            v-if="h.label !== '' && h.label !== 'end'"
            :ref="el => (highlightRefs[i] = el as HTMLElement)"
            class="inline-block rounded-xl px-2 py-1 text-2xl font-extrabold text-d4"
            :style="{
              backgroundColor: h.bgColor ?? '#6D28D9',
              color:           h.textColor ?? 'white',
              transform:       h.rotation ? `rotate(${h.rotation})` : undefined,
              'margin-right':  h.indent ?? '0px',
            }"
          >{{ h.label }}</span>
          <span v-else :style="{ 'margin-right': h.indent ?? '0px' }"></span>
          <span
            :ref="el => (typedRefs[i] = el as HTMLElement)"
            class="inline-block mx-0 text-2xl font-extrabold text-d4 whitespace-pre rtl"
          ></span>
        </div>
      </template>
      <div class="basis-full h-0"></div>
    </section>
    <div class="rtl flex flex-col w-full mt-8 max-w-xl mx-auto">
      <template v-for="(p, i) in paragraphes" :key="i">
        <p
          :ref="el => (paragraphRefs[i] = el as HTMLElement)"
          :class="[i === 0 ? 'font-extrabold' : '']"
          class="text-sm md:text-base text-center mb-4"
        ></p>
      </template>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import gsap, { Elastic } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'
import CustomEase from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

// Define custom easing curves for smoother animation
CustomEase.create("easeHighlightIn", "0.22, 1, 0.36, 1")    // gentle S-curve
CustomEase.create("easeHighlightOut", "0.5, 0, 0.75, 0")    // sharper fade-out curve
CustomEase.create("easeLineIn", "0.33, 1, 0.68, 1")         // smoother line reveal


// Replace or augment your custom eases:
CustomEase.create("springIn",  "0.5, 1.5, 0.5, 1") // try tweaking these
CustomEase.create("springOut", "0.5, 0.25, 0.75, 0.25")

const springEase = Elastic.easeOut.config(1, 0.4)

interface HighlightItem {
  label: string
  sentence?: string
  bgColor?: string
  textColor?: string
  rotation?: string
  indent?: string
}

interface ParagraphItem {
  sentence?: string
  delay?: string
}

const props = withDefaults(defineProps<{
  speed?: number
  highlights?: HighlightItem[]
  paragraphes?: ParagraphItem[]
  bounceScale?: number
  bounceDuration?: number
  start?: string
  scrub?: boolean | number
  markers?: boolean
  initialDelay?: number
}>(), {
  speed: 1,
  highlights: () => [],
  paragraphes: () => [],
  bounceScale: 1,
  bounceDuration: 0.5,
  start: 'top center',
  scrub: false,
  markers: true,
  initialDelay: 0
})

gsap.globalTimeline.timeScale(props.speed)


// Centralized animation settings
const animationConfig = {
  eases: {

    // highlight: { forward: "springIn", backward: "springOut" },
    // lines:     { forward: springEase,    backward: "power1.in" }

    highlight: { forward: "easeHighlightIn", backward: "easeHighlightOut" },
    lines:     { forward: "easeLineIn", backward: "power1.in" }
  },
  durations: {
    bounce:                 props.bounceDuration ?? 0.7,
    highlightScaleDown:     0.6,
    lineFull:               0.4,
    lineVertical:           0.4,
    lineVerticalLabel:      0.3,
    paragraphLine:          0.4,
    pause:                  0.4
  },
  staggers: {
    lineFull:  0.04,
    paragraph: 0.1
  }
}

const bounceScale   = props.bounceScale ?? 1.25
const start         = props.start       ?? 'top 45%'
const scrub         = props.scrub       ?? false

const sectionRef    = ref<HTMLElement>()
const highlightRefs = ref<HTMLElement[]>([])
const typedRefs     = ref<HTMLElement[]>([])
const paragraphRefs = ref<HTMLElement[]>([])

// Debug state
const isVisible = ref(false)
const intersectionRatio = ref(0)
let playedOnce = false

onMounted(async () => {
  await nextTick()
  const splits: SplitText[] = [] // track for reverting
  
  if (sectionRef.value) {
    gsap.set(sectionRef.value, { opacity: 0 })
  }


  function splitAndAnimateLines(
    type: 'full' | 'vertical',
    tl: GSAPTimeline,
    el: HTMLElement,
    { duration, stagger, at }: { duration?: number; stagger?: number; at?: string }
  ) {
    ;(el as any)._split?.revert()
    const split = new SplitText(el, { type: 'words', wordsClass: 'split-word' })
    splits.push(split)

    const dur = duration ?? (type === 'full' ? animationConfig.durations.lineFull : animationConfig.durations.lineVertical)
    const stag = stagger ?? (type === 'full' ? animationConfig.staggers.lineFull : 0)

    gsap.set(split.words, {
  clipPath: 'inset(0% 0% 100% 0%)',
  opacity:  0,
  yPercent: 100
})
tl.to(split.words, {
  clipPath: 'inset(0% 0% 0% 0%)',
  yPercent:  0,
  opacity:   1,
  stagger:   0.05,
  duration:  animationConfig.durations.lineVertical,
  ease:      animationConfig.eases.lines.forward
}, at)

  }
   const tlHighlights = gsap.timeline({
   defaults: { ease: animationConfig.eases.highlight.forward },
   paused: true,
 })
 // add a “blank” tween to wait for initialDelay seconds:
 if (props.initialDelay > 0) {
   tlHighlights.to({}, {
     duration: props.initialDelay,
     immediateRender: false    // ensure it doesn’t render immediately
   })
 }




  useIntersectionObserver(
  sectionRef,
  ([entry]) => {
    if (!sectionRef.value) return

    intersectionRatio.value = entry.intersectionRatio
    isVisible.value = entry.isIntersecting

    if (entry.isIntersecting) {
      // If visible (excluding top 64px), fade in

      if (sectionRef.value.style.opacity !== '1') {
      gsap.to(sectionRef.value, {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.out'
        })

      }


        tlHighlights.restart()
        tlHighlights.seek(0).play()
      // Play once
      if (!tlHighlights.isActive()) {
        


}
    } else {
      // When under sticky header — fade out
      gsap.to(sectionRef.value, {
        opacity: 0,
        duration: 0.6,
        ease: 'expo.out'
      })


    }
  },
  {
    threshold: 0.6, // Trigger on slight visibility
    rootMargin: "-65px 0px 0px 0px" // top offset simulating header height
  }
)

  // PASS 1: highlight bounce
  props.highlights.forEach((h, i) => {
    if (h.label === 'break') { tlHighlights.to({}, { duration: 0.1 }); return }
    if (h.label) {
      const labelName = `hl-${i}`
      tlHighlights.addLabel(labelName)
        .fromTo(
          highlightRefs.value[i]!,
          { scale: 0, opacity: 0 },
          { scale: bounceScale, opacity: 1, duration: animationConfig.durations.bounce,
            ease: animationConfig.eases.highlight.forward,
            easeBackwards: animationConfig.eases.highlight.backward
          }
        )
        .to(highlightRefs.value[i]!, {
          scale: 1,
          duration: animationConfig.durations.highlightScaleDown,
          ease: animationConfig.eases.highlight.forward,
          easeBackwards: animationConfig.eases.highlight.backward
        })
    }
  })

  // PASS 2: line reveals
  props.highlights.forEach((h, i) => {
    if (h.label === 'break') return
    const el = typedRefs.value[i]
    if (!el || !h.sentence) return
    el.innerHTML = h.sentence
    let atLabel: string
    if (h.label) atLabel = `hl-${i}`
    else {
      const next = props.highlights.map((hh, idx) => ({ hh, idx }))
        .find((x) => x.idx > i && x.hh.label !== '' && x.hh.label !== 'break')
      if (!next) return
      atLabel = `hl-${next.idx}`
    }
    splitAndAnimateLines('vertical', tlHighlights, el, {
      duration: h.label ? animationConfig.durations.lineVerticalLabel : animationConfig.durations.lineVertical,
      stagger: 0,
      at: h.label ? `${atLabel}+=0.1` : `${atLabel}-=0.2`
    })


  })

  // pause and paragraphs
  tlHighlights.to({}, { duration: animationConfig.durations.pause })
  props.paragraphes.forEach((p, i) => {
    if (p.delay) {
      const delaySec = parseFloat(p.delay) / (p.delay.endsWith('ms') ? 1000 : 1)
      tlHighlights.to({}, { duration: delaySec, immediateRender: false })
    }
    const el = paragraphRefs.value[i]
    if (p.sentence && el) {
      el.innerHTML = p.sentence
      splitAndAnimateLines('vertical', tlHighlights, el, {
        duration: animationConfig.durations.paragraphLine,
        stagger: animationConfig.staggers.paragraph,
        at: '>'
      })
    }
  })
})
</script>




<style scoped lang="scss">
section { direction: rtl; }
.split-line { display: block; overflow: hidden; }
.split-wor{  display: inline-block;  /* or block if you need each word on its own line */
  overflow: hidden;
}

</style>
