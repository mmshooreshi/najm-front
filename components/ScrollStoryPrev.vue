<template>
  <!-- Wrapper provides real scroll distance for the intro scrub -->
  <section ref="wrapper" class="storyWrapper">
    <!-- The "stage" is what stays in view during the sequence -->
    <div ref="stage" class="stage">
      <div ref="intro" class="intro">
        <h1 class="headline">Centered intro text</h1>
        <p class="sub">Scroll to begin</p>
      </div>

      <div class="slides">
        <figure
          v-for="(src, i) in images"
          :key="src"
          :ref="(el) => setSlideEl(el, i)"
          class="slide"
          aria-hidden="true"
        >
          <img :src="src" alt="" />
        </figure>
      </div>
    </div>
  </section>

  <!-- Content after (so you can see scroll re-enabled at the end) -->
  <section class="after">
    <h2>Next content</h2>
    <p>The page becomes scrollable again after the last image.</p>
    <div style="height: 150vh;"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const images = [
  '/images/about/solution-1.png',
  '/images/about/solution-2.png',
  '/images/about/solution-3.png',
  '/images/about/solution-4.png',
]

const wrapper = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const intro = ref<HTMLElement | null>(null)

const slideEls = ref<HTMLElement[]>([])
function setSlideEl(el: Element | null, i: number) {
  if (!el) return
  slideEls.value[i] = el as HTMLElement
}

/** GSAP modules (loaded client-only) */
let gsap: any
let ScrollTrigger: any
let Observer: any

/** Instances */
let entranceST: any = null
let sectionST: any = null
let observer: any = null

/** State */
let animating = false
let currentIndex = 0
let lockedMode = false
let savedScrollY = 0
let wrapperTopY = 0
let wrapperEndY = 0

function lockBodyScroll() {
  savedScrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${savedScrollY}px`
  document.body.style.width = '100%'
}

function unlockBodyScroll() {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, savedScrollY)
}

function setInitialVisualState() {
  slideEls.value.forEach((el) => {
    gsap.set(el, { yPercent: 100, opacity: 0, zIndex: 0 })
  })

  if (slideEls.value[0]) gsap.set(slideEls.value[0], { opacity: 1, zIndex: 1 })
  if (intro.value) gsap.set(intro.value, { opacity: 1 })
  currentIndex = 0
}

function resetToEnd() {
  const last = slideEls.value.length - 1
  currentIndex = last

  if (intro.value) gsap.set(intro.value, { opacity: 0 })

  slideEls.value.forEach((el) => {
    gsap.set(el, { opacity: 0, yPercent: -100, zIndex: 0 })
  })

  const lastEl = slideEls.value[last]
  if (lastEl) gsap.set(lastEl, { opacity: 1, yPercent: 0, zIndex: 1 })
}

function enableLockedMode() {
  if (lockedMode) return
  lockedMode = true

  if (stage.value) stage.value.classList.add('isFixed')

  const w = wrapper.value!
  const wTop = w.getBoundingClientRect().top + window.scrollY
  wrapperTopY = wTop
  wrapperEndY = wTop + w.offsetHeight

  lockBodyScroll()

  observer = Observer.create({
    target: window,
    type: 'wheel,touch,pointer',
    preventDefault: true,
    tolerance: 12,
    wheelSpeed: 1,
    onDown: () => step(1),
    onUp: () => step(-1),
  })
}

function disableLockedModeAndContinueDown() {
  observer?.kill()
  observer = null

  if (stage.value) stage.value.classList.remove('isFixed')
  unlockBodyScroll()

  // move past the wrapper so normal scroll continues
  window.scrollTo({ top: wrapperEndY + 2, behavior: 'smooth' })
}

function disableLockedModeAndContinueUp() {
  observer?.kill()
  observer = null

  if (stage.value) stage.value.classList.remove('isFixed')
  unlockBodyScroll()

  // allow intro scrub again
  entranceST?.enable()

  // place at end of intro scrub so scrolling up reverses it
  window.scrollTo({
    top: wrapperTopY + window.innerHeight - 2,
    behavior: 'auto',
  })
}

function step(dir: 1 | -1) {
  if (!lockedMode || animating) return

  const next = currentIndex + dir

  // exit upward (back to normal scrolling to the top)
  if (next < 0) {
    lockedMode = false
    disableLockedModeAndContinueUp()
    return
  }

  // exit downward after the last slide
  if (next >= slideEls.value.length) {
    finishSequence()
    return
  }

  transitionTo(next, dir)
}

function transitionTo(nextIndex: number, dir: 1 | -1) {
  const curr = slideEls.value[currentIndex]
  const next = slideEls.value[nextIndex]
  if (!curr || !next) return

  animating = true

  gsap.set(next, {
    yPercent: dir === 1 ? 100 : -100,
    opacity: 1,
    zIndex: 2,
  })
  gsap.set(curr, { zIndex: 1 })

  gsap.timeline({
    defaults: { duration: 0.9, ease: 'power3.inOut' },
    onComplete: () => {
      currentIndex = nextIndex
      gsap.set(curr, { opacity: 0, zIndex: 0 })
      gsap.set(next, { zIndex: 1 })
      animating = false
    },
  })
    .to(curr, { yPercent: dir === 1 ? -100 : 100, opacity: 0 }, 0)
    .to(next, { yPercent: 0, opacity: 1 }, 0)
}

function finishSequence() {
  const last = slideEls.value[currentIndex]
  if (!last) {
    lockedMode = false
    disableLockedModeAndContinueDown()
    return
  }

  animating = true
  gsap.timeline({
    defaults: { duration: 0.9, ease: 'power3.inOut' },
    onComplete: () => {
      animating = false
      lockedMode = false
      disableLockedModeAndContinueDown()
    },
  }).to(last, { yPercent: -100, opacity: 0 })
}

onMounted(async () => {
  // client-only GSAP imports (prevents SSR breakage)
  const gsapMod = await import('gsap')
  gsap = gsapMod.gsap || gsapMod.default || gsapMod

  const stMod = await import('gsap/ScrollTrigger')
  ScrollTrigger = stMod.default || stMod.ScrollTrigger || stMod

  const obMod = await import('gsap/Observer')
  Observer = obMod.default || obMod.Observer || obMod

  gsap.registerPlugin(ScrollTrigger, Observer)

  await nextTick()

  if (!wrapper.value || !stage.value || !intro.value) return
  if (slideEls.value.length !== images.length) return

  setInitialVisualState()

  // Intro scrub timeline
  const tl = gsap.timeline()
  tl.to(intro.value, { opacity: 0, duration: 0.35 }, 0)
  tl.to(slideEls.value[0], { yPercent: 0, opacity: 1, ease: 'power3.out', duration: 1 }, 0)

  entranceST = ScrollTrigger.create({
    id: 'intro-scrub',
    trigger: wrapper.value,
    start: 'top top',
    end: () => `+=${window.innerHeight}`,
    scrub: 1,
    animation: tl,
    onUpdate: (self: any) => {
      if (!lockedMode && self.progress >= 0.999) {
        entranceST?.disable(false)
        enableLockedMode()
      }
    },
  })

  // Boundary trigger: ensures re-entry from BELOW works
  sectionST = ScrollTrigger.create({
    trigger: wrapper.value,
    start: 'top top',
    // important: cover the full wrapper while sticky is active
    end: 'bottom top',

    onEnterBack: () => {
      // re-entering from below: show last slide centered, lock, and allow stepping up
      resetToEnd()
      entranceST?.disable(false)
      enableLockedMode()
    },

    // If you want to guarantee a clean replay when re-entering from above after leaving:
    onEnter: () => {
      // Optional: only reset when entering from above and we're not already mid-lock
      if (!lockedMode) {
        setInitialVisualState()
        entranceST?.enable()
      }
    },
  })

  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  sectionST?.kill()
  sectionST = null
  entranceST?.kill()
  entranceST = null
  observer?.kill()
  observer = null

  if (lockedMode) {
    lockedMode = false
    if (stage.value) stage.value.classList.remove('isFixed')
    unlockBodyScroll()
  }
})
</script>

<style scoped>
.storyWrapper {
  /* Provides the scroll distance for the intro scrub */
  height: 200vh;
}

.stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #0b0b0b;
  color: #fff;
  touch-action: none; /* important when preventing default on touch/pointer */
}

.stage.isFixed {
  /* Used when body is locked; keep it steady in viewport */
  position: fixed;
  inset: 0;
  z-index: 50;
}

.intro {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  padding: 2rem;
  z-index: 10;
  pointer-events: none;
}

.headline {
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.1;
  margin: 0;
}
.sub {
  margin: 1rem 0 0;
  opacity: 0.75;
}

.slides {
  position: absolute;
  inset: 0;
}

.slide {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  opacity: 0;
  transform: translateZ(0);
  will-change: transform, opacity;
}

.slide img {
  width: min(86vw, 920px);
  height: min(70vh, 640px);
  object-fit: cover;
  border-radius: 18px;
}

.after {
  padding: 6rem 1.5rem;
}
</style>
