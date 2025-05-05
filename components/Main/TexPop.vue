<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'
import CustomEase from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

// Define custom easing curves for smoother animation
CustomEase.create("easeHighlightIn", "0.22, 1, 0.36, 1")    // gentle S-curve
CustomEase.create("easeHighlightOut", "0.5, 0, 0.75, 0")    // sharper fade-out curve
CustomEase.create("easeLineIn", "0.33, 1, 0.68, 1")         // smoother line reveal

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
const isVisible = ref(false)
const intersectionRatio = ref(0)

const props = withDefaults(defineProps<{
  highlights?: HighlightItem[]
  paragraphes?: ParagraphItem[]
  bounceScale?: number
  bounceDuration?: number
  start?: string
  scrub?: boolean | number
  markers?: boolean
}>(), {
  highlights: () => [],
  paragraphes: () => [],
  bounceScale: 1,
  bounceDuration: 0.5,
  start: 'top center',
  scrub: false,
  markers: false
})

// Centralized animation settings
const animationConfig = {
  eases: {
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

onMounted(async () => {
  await nextTick()
  const splits: SplitText[] = [] // track for reverting
  if (sectionRef.value) gsap.set(sectionRef.value, { opacity: 0 })
// watch visibility
useIntersectionObserver(
  sectionRef,
  ([entry]) => {
    intersectionRatio.value = entry.intersectionRatio
    isVisible.value         = entry.isIntersecting

    console.log('Visible?', isVisible.value, 'Ratio:', intersectionRatio.value)

    if (entry.isIntersecting) {
      // fade in container
      gsap.to(sectionRef.value, { opacity: 1, duration: 0.5, ease: 'power1.out' })
      // restart & play your timeline
      tlHighlights.restart()
    } else {
      // fade out container
      gsap.to(sectionRef.value, { opacity: 0, duration: 0.4, ease: 'power1.in' })
      // reverse in case mid-play
      tlHighlights.reverse()
    }
  },
  {
    threshold: 0.6,
    rootMargin: '-65px 0px 0px 0px',
  }
)

  function splitAndAnimateLines(
    type: 'full' | 'vertical',
    tl: GSAPTimeline,
    el: HTMLElement,
    { duration, stagger, at }: { duration?: number; stagger?: number; at?: string }
  ) {
    ;(el as any)._split?.revert()
    const split = new SplitText(el, { type: 'lines', linesClass: 'split-line' })
    splits.push(split)

    const dur = duration ?? (type === 'full' ? animationConfig.durations.lineFull : animationConfig.durations.lineVertical)
    const stag = stagger ?? (type === 'full' ? animationConfig.staggers.lineFull : 0)

    gsap.set(split.lines, {
      clipPath: type === 'full' ? 'inset(30% 60% 30% 40%)' : 'inset(0% 0% 50% 0%)',
      opacity:  0,
      yPercent: type === 'full' ? 0 : 100,
      xPercent: type === 'full' ? 40 : 0,
    })
    tl.to(
      split.lines,
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        yPercent: 0,
        xPercent: 0,
        opacity:  1,
        duration: dur,
        ease:     animationConfig.eases.lines.forward,
        easeBackwards: animationConfig.eases.lines.backward,
        stagger:  stag,
      },
      at
    )
  }

  const tlHighlights = gsap.timeline({
    defaults: { ease: animationConfig.eases.highlight.forward },
    // scrollTrigger: {
    //   trigger: sectionRef.value,
    //   start,
    //   scrub,
    //   markers: props.markers,
    //   toggleActions: 'play none none reverse',
    //   onEnter(self) {
    //     // bring back full opacity…
    //     gsap.set(sectionRef.value, { opacity: 1 });
    //     // …and rewind the timeline to its very start
    //     self.animation.restart();
    // },
    // onLeaveBack(self) {
    //     gsap.to(sectionRef.value, { opacity: 0, duration: 0.4, ease: 'power1.out' });
    // },

    //   onReverseComplete() {
    //     splits.splice(0).forEach((s) => s.revert())
    //   },
    // },
  })
  tlHighlights.pause()


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

<template>
  <!-- py-24 px-0 sm:px-2 lg:px-56 pt-88 -->
  <div class="">
    <section
      ref="sectionRef"
      class="rtl max-w-xl mx-auto space-y-0 p-0 sm:p-2 text-right leading-relaxed flex flex-wrap justify-center w-full "
      
      >
      <!--top classes can get these added tO: border border-4 border-black rounded-3xl -->
      <template v-for="(h, i) in highlights" :key="i">
        <div v-if="h.label === 'break'" class="w-full bg-blue"></div>
        <div v-else class="flex flex-row justify-start items-center text-nowrap">
          <span
            v-if="h.label !== ''"
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

<style scoped lang="scss">
section { direction: rtl; }
.split-line { display: block; overflow: hidden; }
</style>
