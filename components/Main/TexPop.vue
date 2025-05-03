<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

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

const props = defineProps<{
  highlights: HighlightItem[]
  paragraphes: ParagraphItem[]
  bounceScale?: number
  bounceDuration?: number
  start?: string
  scrub?: boolean | number
}>()

const bounceScale    = props.bounceScale    ?? 1.25
const bounceDuration = props.bounceDuration ?? 0.7
const start          = props.start          ?? 'top 40%'
const scrub          = props.scrub          ?? false

const sectionRef     = ref<HTMLElement>()
const highlightRefs  = ref<HTMLElement[]>([])
const typedRefs      = ref<HTMLElement[]>([])
const paragraphRefs  = ref<HTMLElement[]>([])

/**
 * GSAP SplitText helper that reveals text line‑by‑line.
 */
function revealLines (el: HTMLElement, {
  duration = 0.4,
  stagger  = 0.04,
}: { duration?: number; stagger?: number } = {}) {
  if (!el) return

  // cleanup any previous split instance
  if ((el as any)._split) {
    (el as any)._split.revert()
  }

  const split = new SplitText(el, {
    type: 'lines',
    linesClass: 'split-line',
  })
  ;(el as any)._split = split

  gsap.set(split.lines, { clipPath: 'inset(0 0 100% 0)', yPercent: 100 })
  gsap.to(split.lines, {
    duration,
    ease: 'circ.out',
    clipPath: 'inset(0 0 0% 0)',
    yPercent: 0,
    stagger,
  })
}

onMounted(async () => {
  await nextTick()

  // store splits so we can revert on reverse
  const splits: SplitText[] = []

  /* ─── Helpers ───────────────────────────────────────────────────────────────── */
  function splitAndAnimateLines(
    type: 'full' | 'vertical',
    tl: GSAPTimeline,
    el: HTMLElement,
    { duration = 0.4, stagger = 0.04, at}: { duration?: number; stagger?: number; at?: string }
  ) {
    // clean up previous split if any
    ;(el as any)._split?.revert()
    const split = new SplitText(el, { type: 'lines', linesClass: 'split-line' })
    splits.push(split)

    // start each line clipped and below
    gsap.set(split.lines, { clipPath: type=='full' ? 'inset(30% 60% 30% 40%)':'inset(0% 0% 100% 0%)', opacity: 0, yPercent: type=='full' ? 0 : 100, xPercent: type=='full' ? 40 : 0})
    // animate into view as part of the timeline
    tl.to(split.lines, {
      clipPath: 'inset(0% 0% 0% 0%)',
      yPercent: 0,
      xPercent: 0,
      opacity: 1,
      duration,
      ease: 'power3.out',
      stagger,
    }, at)
  }

  /* ─── HIGHLIGHTS ───────────────────────────────────────────────────────────── */
  const tlHighlights = gsap.timeline({
    defaults: { ease: 'circ.out' },
    scrollTrigger: {
      trigger: sectionRef.value,
      start,
      scrub,
      markers: true,
      toggleActions: 'play none none reverse',
      onReverseComplete() {
        // when you scroll fully back, revert all splits
        splits.splice(0).forEach(s => s.revert())
      }
    },
  })

  props.highlights.forEach((h, i) => {
    if (h.label === 'break') {
      tlHighlights.to({}, { duration: 0.1 })
      return
    }

    // bounce in the label
    tlHighlights.fromTo(
      highlightRefs.value[i]!,
      { scale: 0, opacity: 0 },
      { scale: bounceScale, opacity: 1, duration: bounceDuration }
    )
    .to(highlightRefs.value[i]!, { scale: 1, duration: 0.3 })

    // split & animate the sentence lines exactly at the same time
    if (h.sentence && typedRefs.value[i]) {
      typedRefs.value[i].textContent = h.sentence
      splitAndAnimateLines('full' ,tlHighlights, typedRefs.value[i], {
        duration: 0.4,
        stagger: 0,

        at: '>-0.5'
      })
    }
  })

  /* ─── PARAGRAPHS ───────────────────────────────────────────────────────────── */
  const tlParagraphs = gsap.timeline({
    defaults: { ease: 'circ.out' },
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 30%',
      scrub,
      toggleActions: 'play none none reverse',
      onReverseComplete() {
        splits.splice(0).forEach(s => s.revert())
      }
    },
  })

  props.paragraphes.forEach((p, i) => {
    // optional delay tween
    if (p.delay) {
      const delaySec = parseFloat(p.delay) / (p.delay.endsWith('ms') ? 1000 : 1)
      tlParagraphs.to({}, { duration: delaySec })
    }

    // split & animate each paragraph’s lines
    if (p.sentence && paragraphRefs.value[i]) {
    //   paragraphRefs.value[i].textContent = p.sentence
      paragraphRefs.value[i].innerHTML = p.sentence

      splitAndAnimateLines('vertical',tlParagraphs, paragraphRefs.value[i], {
        duration: 0.4,
        stagger: 0.1,
        at: '>'
      })
    }
  })
})
</script>

<template>
  <div class="py-24 px-56 pt-68">
    <section
      ref="sectionRef"
      class="rtl mx-auto max-w-screen-md space-y-0 text-right leading-relaxed flex flex-wrap justify-start w-[43vw]"
    >
      <template v-for="(h, i) in highlights" :key="i">
        <!-- spacer row for line‑break markers -->
        <div v-if="h.label === 'break'"></div>

        <div v-else class="flex flex-row justify-start items-center">
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
          >
            {{ h.label }}
          </span>
          <span v-else :style="{ 'margin-right': h.indent ?? '0px' }"></span>

          <!-- sentence revealed via SplitText -->
          <span
            :ref="el => (typedRefs[i] = el as HTMLElement)"
            class="inline-block mx-1 text-2xl font-extrabold text-d4 whitespace-pre rtl"
          ></span>
        </div>
      </template>
      <div class="basis-full h-16"></div>
    </section>

    <!-- paragraphes -->
    <div class="rtl flex flex-col w-full">
      <template v-for="(p, i) in paragraphes" :key="i">
        <p
          :ref="el => (paragraphRefs[i] = el as HTMLElement)"
          :class="[i === 0 ? 'font-extrabold' : '']"
          class="text-base text-center mb-4"
        ></p>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
section {
  direction: rtl;
}

.split-line {
  display: block;
  overflow: hidden;
}
</style>
