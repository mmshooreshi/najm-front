<template>
  <div>
    <section
      ref="sectionRef"
      :dir="isRTL ? 'rtl' : 'ltr'"
      :class="[isRTL ? 'rtl text-right' : 'ltr text-left']"
      class="max-w-xl mx-auto space-y-0 p-0 sm:p-2 leading-relaxed flex flex-wrap justify-center w-full"
      :style="{ opacity: isInitialized ? 1 : 0 }"
    >
      <template v-for="(h, i) in highlights" :key="i">
        <div v-if="h.label === 'break'" class="basis-full w-full h-0"></div>
        <div v-else class="flex flex-row justify-start items-center text-nowrap">
          <span
            v-if="h.label !== '' && h.label !== 'end'"
            v-editable="`highlightedText.${i}.label`"
            :ref="el => (highlightRefs[i] = el as HTMLElement | null)"
            class="hero-highlight-pill inline-block rounded-xl px-2.5 py-1 text-2xl md:text-3xl font-black text-d4 cursor-pointer select-none"
            :class="{ 'is-active': activeHighlightIndex === i }"
            :style="{
              '--base-bg': h.bgColor ?? '#6D28D9',
              '--base-color': h.textColor ?? 'white',
              '--base-rot': h.rotation ?? '0deg',
              marginRight: h.indent ?? '0px',
            }"
            @click="toggleHighlight(i)"
          >{{ h.label }}</span>
          <span v-else :style="{ marginRight: h.indent ?? '0px' }"></span>

          <!-- sentence node is editable IN PLACE -->
          <span
            :ref="el => (typedRefs[i] = el as HTMLElement | null)"
            v-editable="`highlightedText.${i}.sentence`"
            class="inline-block mx-0 text-2xl md:text-3xl font-black text-d4 whitespace-pre"
          >{{ h.sentence || '' }}</span>
        </div>
      </template>
      <div class="basis-full h-0"></div>
    </section>

    <div class="flex flex-col w-full mt-8 max-w-xl mx-auto">
      <template v-for="(p, i) in paragraphes" :key="i">
        <p
          :ref="el => (paragraphRefs[i] = el as HTMLElement | null)"
          :class="[i === 0 ? 'font-extrabold' : '']"
          v-editable="`paragraphes.${i}.sentence`"
          class="text-sm md:text-base text-center mb-4"
        ></p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch, onBeforeUnmount } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import gsap, { Elastic } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'
import CustomEase from 'gsap/CustomEase'
import { useLocale } from '@/composables/useLocale'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

// Define natural fluid motion curves
CustomEase.create("fluidOut", "0.16, 1, 0.3, 1")
CustomEase.create("popSpring", "0.34, 1.45, 0.64, 1")

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
  bounceDuration: 0.48,
  start: 'top center',
  scrub: false,
  markers: true,
  initialDelay: 0
})

const isInitialized = ref(false)

// Centralized animation settings
const animationConfig = {
  eases: {
    highlight: { forward: "back.out(1.5)", backward: "power2.in" },
    lines: { forward: "power3.out", backward: "power2.in" }
  },
  durations: {
    bounce: 0.48,
    lineVertical: 0.42,
    paragraphLine: 0.38
  },
  staggers: {
    lineWords: 0.035,
    paragraph: 0.08
  }
}

const bounceScale = props.bounceScale ?? 1.25
const start = props.start ?? 'top 45%'
const scrub = props.scrub ?? false

const sectionRef = ref<HTMLElement | null>(null)
const highlightRefs = ref<(HTMLElement | null)[]>([])
const typedRefs = ref<(HTMLElement | null)[]>([])
const paragraphRefs = ref<(HTMLElement | null)[]>([])

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const activeHighlightIndex = ref<number | null>(null)

function toggleHighlight(index: number) {
  activeHighlightIndex.value = activeHighlightIndex.value === index ? null : index
}

let playedOnce = false
let stInstance: ScrollTrigger | null = null
let tlHighlights = gsap.timeline({
  defaults: { ease: animationConfig.eases.highlight.forward },
  paused: true,
})

function runHighlightAnimation() {
  const splits: SplitText[] = []

  tlHighlights.pause(0).clear()
  tlHighlights.timeScale(props.speed || 1)

  if (stInstance) {
    stInstance.kill()
  }

  function splitAndAnimateLines(
    type: 'full' | 'vertical',
    tl: GSAPTimeline,
    el: HTMLElement,
    { duration, stagger, at }: { duration?: number; stagger?: number; at?: string }
  ) {
    ;(el as any)._split?.revert()
    const split = new SplitText(el, { type: 'words', wordsClass: 'split-word' })
    el.removeAttribute('aria-label')
    ;(el as any)._split = split
    splits.push(split)

    gsap.set(split.words, {
      opacity: 0,
      yPercent: 65
    })
    tl.to(split.words, {
      yPercent: 0,
      opacity: 1,
      stagger: animationConfig.staggers.lineWords,
      duration: animationConfig.durations.lineVertical,
      ease: animationConfig.eases.lines.forward
    }, at)
  }

  // initial delay
  if (props.initialDelay > 0) {
    tlHighlights.to({}, {
      duration: props.initialDelay,
      immediateRender: false
    })
  }

  stInstance = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: start,
    scrub: scrub,
    markers: false,
    onEnter: () => {
      if (!playedOnce && sectionRef.value) {
        tlHighlights.play()
        playedOnce = true
      }
    },
    onEnterBack: () => {
      if (!playedOnce && sectionRef.value) {
        tlHighlights.play()
        playedOnce = true
      }
    }
  })

  // PASS 1: highlight bounce
  props.highlights.forEach((h, i) => {
    if (h.label === 'break') { tlHighlights.to({}, { duration: 0.05 }); return }
    if (h.label) {
      const labelName = `hl-${i}`
      tlHighlights.addLabel(labelName)
      if (h.label === 'end') return
      const target = highlightRefs.value[i]
      if (target) {
        const rot = h.rotation ? parseFloat(h.rotation) : 0
        tlHighlights.fromTo(
          target,
          { scale: 0, opacity: 0, rotate: rot - 6 },
          {
            scale: 1,
            opacity: 1,
            rotate: rot,
            duration: animationConfig.durations.bounce,
            ease: animationConfig.eases.highlight.forward,
            immediateRender: false,
            onComplete: () => {
              gsap.set(target, { clearProps: 'transform' })
            }
          }
        )
      }
    }
  })

  // PASS 2: line reveals
  props.highlights.forEach((h, i) => {
    if (h.label === 'break') return
    const el = typedRefs.value[i]
    if (!el || !h.sentence) return
    let atLabel: string
    if (h.label) atLabel = `hl-${i}`
    else {
      const next = props.highlights.map((hh, idx) => ({ hh, idx }))
        .find((x) => x.idx > i && x.hh.label !== '' && x.hh.label !== 'break')
      if (!next) return
      atLabel = `hl-${next.idx}`
    }
    splitAndAnimateLines('vertical', tlHighlights, el, {
      duration: animationConfig.durations.lineVertical,
      stagger: animationConfig.staggers.lineWords,
      at: h.label ? `${atLabel}+=0.12` : `${atLabel}-=0.08`
    })
  })

  // Pre-set targets so they are invisible before timeline starts
  highlightRefs.value.forEach((target, i) => {
    if (target) {
      const h = props.highlights[i]
      const rot = h?.rotation ? parseFloat(h.rotation) : 0
      gsap.set(target, { scale: 0, opacity: 0, rotate: rot })
    }
  })
  isInitialized.value = true

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
}

function resetAndRerun() {
  typedRefs.value.forEach(el => (el as any)?._split?.revert())
  paragraphRefs.value.forEach(el => (el as any)?._split?.revert())
  
  tlHighlights.pause(0).clear()
  playedOnce = false
  
  nextTick(() => {
    runHighlightAnimation()
    if (sectionRef.value && !playedOnce) {
      tlHighlights.play()
      playedOnce = true
    }
  })
}

watch(language, () => {
  resetAndRerun()
})

onMounted(async () => {
  if (typeof document !== 'undefined' && (document as any).fonts?.ready) {
    await (document as any).fonts.ready.catch(() => {})
  }
  await nextTick()
  runHighlightAnimation()

  if (sectionRef.value && !playedOnce) {
    tlHighlights.play()
    playedOnce = true
  }

  window.addEventListener('admin-edit-discarded', resetAndRerun)
})

onBeforeUnmount(() => {
  if (stInstance) stInstance.kill()
  window.removeEventListener('admin-edit-discarded', resetAndRerun)
})
</script>

<style scoped lang="scss">
section {
  direction: rtl;
}

.hero-highlight-pill {
  background-color: var(--base-bg);
  color: var(--base-color);
  transform: rotate(var(--base-rot)) scale(1);
  transform-origin: center center;
  /* Fluid spring transition: subtle pop and smooth color/rotation morph */
  transition: transform 0.42s cubic-bezier(0.34, 1.45, 0.64, 1),
              background-color 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.32s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.35s ease;
  will-change: transform;

  &:hover,
  &.is-active {
    background-color: #000000 !important;
    color: #ffffff !important;
    transform: rotate(0deg) scale(1.07) !important;
    box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.28);
  }

  &:active {
    transform: rotate(0deg) scale(1.02) !important;
  }
}

.split-line {
  display: block;
}

.split-word {
  display: inline-block;
  vertical-align: top;
  line-height: 1.35;
  padding: 0 1px;
}
</style>