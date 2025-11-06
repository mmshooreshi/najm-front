<!-- components/ScrollWrapperW-webp.vue -->
<template>
  <section
    ref="sectionEl"
    class="relative h-screen overflow-visible"
  >
    <!-- Layer 1: Cards intro + stacked cards -->
    <div class="absolute inset-0 overflow-visible">
      <!-- Intro of cards -->
      <div
        ref="introWrap"
        class="absolute inset-x-0 top-0 flex flex-col justify-center items-center pt-16"
      >
        <SceneCardsIntro />
      </div>

      <!-- Stack area (cards under intro) -->
      <div
        ref="stackLayerEl"
        class="flex w-full h-[350px] md:h-[500px] relative mt-32 justify-center"
      >
        <div
          v-for="(card, i) in cardStates"
          :key="card.id"
          :data-id="card.id"
          :style="{ zIndex: i, backgroundColor: card.bgColor }"
          class="-z-10 stack-card w-min shadow-sm backdrop-blur-sm relative flex-none max-h-[300px] md:max-h-[400px] rounded-[1.5rem] overflow-visible rtl"
        >
          <img
            :src="card.loop"
            :alt="card.text"
            class="object-cover h-full w-min rounded-[1.5rem] md:-mt-24"
            placeholder="false"
          />
        </div>
      </div>
    </div>

    <!-- Layer 2: Projects overlaid (absolute) -->
    <div
      ref="projectsWrap"
      class="absolute inset-0 overflow-visible"
    >
      <div class="absolute inset-0 pt-12">
        <SceneProjects
          :stackIds="stackIds"
          @visibleStackChanged="updateStackIds"
        />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  inject,
} from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Flip } from "gsap/Flip"

import SceneCardsIntro from "@/components/scenes/SceneCardsIntro.vue"
import SceneProjects from "@/components/scenes/SceneProjects.vue"

gsap.registerPlugin(ScrollTrigger, Flip)

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface Card {
  id: number
  loop: string
  text: string
}

interface CardState extends Card {
  bgColor: string
}

/* -------------------------------------------------------------------------- */
/* Refs & injected data                                                       */
/* -------------------------------------------------------------------------- */
const sectionEl = ref<HTMLElement | null>(null)
const stackLayerEl = ref<HTMLElement | null>(null)
const projectsWrap = ref<HTMLElement | null>(null)
const introWrap = ref<HTMLElement | null>(null)

const homeUI = inject<any>("homeUI") ?? {}

/* -------------------------------------------------------------------------- */
/* Data + stack logic                                                         */
/* -------------------------------------------------------------------------- */

const colorPalette = [
  "#8FBC8F",
  "#E7A7A7",
  "#A4A4D3",
  "#C3C3B4",
  "#D6D6D6",
  "#D6D9D1",
  "#C5C6F1",
  "#88A8B6",
]

// how many cards are actually visible in the stack
const MAX_STACK = 5

const stackIds = ref<number[]>([])
const cardStates = reactive<CardState[]>([])

/**
 * Raw cards from global UI state
 */
const rawCards = computed<Card[]>(() => homeUI.value?.sceneProjects?.cards ?? [])

/**
 * Data wiring:
 * - Use ALL cards as stackIds (no slice here)
 * - cardStates contains ALL cards
 */
watch(
  rawCards,
  cards => {
    const sorted = [...cards].sort((a, b) => a.id - b.id)
    if (!sorted.length) return

    // Initialize stackIds ONCE with all card ids
    if (!stackIds.value.length) {
      stackIds.value = sorted.map(c => c.id)
    }

    updateCardStates()
  },
  { immediate: true }
)

watch(stackIds, () => {
  updateCardStates()
})

function updateCardStates() {
  const sorted = [...rawCards.value].sort((a, b) => a.id - b.id)
  if (!sorted.length || !stackIds.value.length) return

  const source = sorted.filter(c => stackIds.value.includes(c.id))
  if (!source.length) return

  const mapped: CardState[] = source.map((c, index) => ({
    ...c,
    bgColor: colorPalette[index % colorPalette.length],
  }))

  cardStates.splice(0, cardStates.length, ...mapped)
}

/**
 * Keep ALL cards in stackIds, only reorder by the ids coming
 * from SceneProjects (visible/emphasized ones).
 */
function updateStackIds(newIds: number[]) {
  if (!newIds || !newIds.length) return

  const allIds =
    stackIds.value.length > 0
      ? [...stackIds.value]
      : [...rawCards.value].sort((a, b) => a.id - b.id).map(c => c.id)

  // Front-load the new ids, keep the rest in their original order
  const rest = allIds.filter(id => !newIds.includes(id))
  stackIds.value = [...newIds, ...rest]
}

/* small helper: ids that are allowed to be in the visual stack */
function getTopStackIds(): number[] {
  return stackIds.value.slice(0, MAX_STACK)
}

/* -------------------------------------------------------------------------- */
/* DOM helpers                                                                */
/* -------------------------------------------------------------------------- */
function getStacks(): HTMLElement[] {
  if (!sectionEl.value) return []
  return gsap
    .utils
    .toArray<HTMLElement>(".stack-card", sectionEl.value)
    .sort((a, b) => Number(a.dataset.id) - Number(b.dataset.id))
}

function getEmblTargets(): HTMLElement[] {
  if (!sectionEl.value) return []
  return gsap.utils.toArray<HTMLElement>(".embl-card", sectionEl.value)
}

function getProjectsIntroEls(): HTMLElement[] {
  if (!projectsWrap.value) return []
  return Array.from(
    projectsWrap.value.querySelectorAll<HTMLElement>(".projects-intro")
  )
}

/**
 * Kill ALL tweens affecting the stack cards
 */
function killStackTweens() {
  const stacks = getStacks()
  if (!stacks.length) return
  gsap.killTweensOf(stacks)
}

/* -------------------------------------------------------------------------- */
/* Layout + animation helpers                                                 */
/* -------------------------------------------------------------------------- */
let cardW = 0
let cardH = 0
let stackTimeline: gsap.core.Timeline | null = null
let pinnedTrigger: ScrollTrigger | null = null

function ensureCardSize() {
  if (cardW && cardH) return
  const targets = getEmblTargets()
  cardW = targets[0]?.offsetWidth ?? 240
  cardH = targets[0]?.offsetHeight ?? 160
}

/** Create (not store) a new stack timeline (from off-screen into stack) */
function createStackTimeline() {
  const stacks = getStacks()
  if (!stacks.length) return null
  ensureCardSize()

  const offscreenY = window.innerHeight + cardH // start below viewport
  const baseY = 270 // base Y for stacked cards

  const topIds = getTopStackIds()
  const order = new Map<number, number>()
  topIds.forEach((id, idx) => order.set(id, idx))

  // generic centering + size for all cards
  gsap.set(stacks, {
    left: "50%",
    xPercent: -50,
    width: cardW,
    height: cardH,
  })

  const tl = gsap.timeline({ paused: true })

  stacks.forEach(el => {
    const id = Number(el.dataset.id)
    const idx = order.get(id)

    if (idx == null) {
      // NOT part of visual stack: keep hidden offscreen at bottom
      gsap.set(el, {
        y: offscreenY,
        rotation: 0,
        opacity: 0,
      })
      return
    }

    const stackY = baseY + idx * -10

    tl.fromTo(
      el,
      {
        y: offscreenY,
        rotation: 0,
        opacity: 0,
      },
      {
        y: stackY,
        rotation: idx * 5 - 20,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      },
      idx * 0.15
    )
  })

  return tl
}

/** Stack IN: rebuild fresh timeline and play */
function stackIn() {
  const stacks = getStacks()
  if (!stacks.length) return

  killStackTweens()

  if (stackTimeline) {
    stackTimeline.kill()
    stackTimeline = null
  }

  stackTimeline = createStackTimeline()
  stackTimeline?.play(0)
}

/** Stack OUT: tween only the top stack cards back off-screen */
function stackOut() {
  const stacks = getStacks()
  if (!stacks.length) return
  ensureCardSize()

  killStackTweens()
  if (stackTimeline) {
    stackTimeline.kill()
    stackTimeline = null
  }

  const offscreenY = window.innerHeight + cardH
  const topIds = getTopStackIds()
  const activeStacks = stacks.filter(el =>
    topIds.includes(Number(el.dataset.id))
  )

  if (!activeStacks.length) return

  gsap.to(activeStacks, {
    y: offscreenY,
    rotation: 0,
    opacity: 0,
    duration: 0.6,
    ease: "power3.in",
    overwrite: "auto",
  })
}

/* --- FLIP: stack ↔ grid --------------------------------------------------- */

function flipStackToGrid() {
  const stacks = getStacks()
  const targets = getEmblTargets()
  if (!stacks.length || !targets.length) return
  ensureCardSize()

  // Kill leftover motion before FLIP
  killStackTweens()

  const targetMap = new Map<number, HTMLElement>()
  targets.forEach(el => {
    const id = Number(el.dataset.id)
    if (!Number.isNaN(id)) targetMap.set(id, el)
  })

  // Only FLIP stacks that actually have a target
  const stacksWithTarget = stacks.filter(el =>
    targetMap.has(Number(el.dataset.id))
  )
  if (!stacksWithTarget.length) return

  const state = Flip.getState(stacksWithTarget)

  stacksWithTarget.forEach(el => {
    const id = Number(el.dataset.id)
    const tgt = targetMap.get(id)!
    tgt.appendChild(el)
    el.style.position = "relative"
    el.style.top = "0"
    el.style.left = "0"
    el.style.zIndex = "1"
    
  })

  // ✅ IMPORTANT: force everything fully visible in grid mode
  gsap.set(stacksWithTarget, {
    x: 0,
    y: 0,
    xPercent: 0,
    rotation: 0,
    width: cardW,
    height: cardH,
    autoAlpha: 1,   // ← THIS LINE FIXES THE “images not render” issue
  })

  Flip.from(state, {
    duration: 0.8,
    ease: "power3.inOut",
    clearProps: "transform",
    // (optional) if you want opacity also cleared:
    // clearProps: "transform,opacity"
  })

  // Optional: hide any orphan stacks without a target
  const orphans = stacks.filter(
    el => !targetMap.has(Number(el.dataset.id))
  )
  if (orphans.length) {
    gsap.set(orphans, { autoAlpha: 0 })
  }
}


function flipGridToStack() {
  const stacks = getStacks()
  const overlay = stackLayerEl.value
  if (!stacks.length || !overlay) return
  ensureCardSize()

  killStackTweens()

  const state = Flip.getState(stacks)

  const baseY = 270
  const offscreenY = window.innerHeight + cardH
  const topIds = getTopStackIds()
  const order = new Map<number, number>()
  topIds.forEach((id, idx) => order.set(id, idx))

  stacks.forEach(el => {
    const id = Number(el.dataset.id)
    const idx = order.get(id)
    const isActive = idx != null

    overlay.appendChild(el)
    el.style.position = "absolute"
    el.style.top = "0"
    el.style.left = "50%"

    gsap.set(el, {
      width: cardW,
      height: cardH,
      xPercent: -50,
      x: 0,
      y: isActive ? baseY + idx! * -10 : offscreenY,
      rotation: isActive ? idx! * 5 - 20 : 0,
      autoAlpha: isActive ? 1 : 0,
      zIndex: isActive ? String(idx) : "-1",
    })
  })

  Flip.from(state, {
    duration: 0.8,
    ease: "power3.inOut",
    clearProps: "transform",
  })
}

/* -------------------------------------------------------------------------- */
/* ScrollTriggers: pin + phased animation                                     */
/* -------------------------------------------------------------------------- */
onMounted(async () => {
  await nextTick()

  const section = sectionEl.value
  if (!section) return

  if (introWrap.value) {
    gsap.set(introWrap.value, { opacity: 1 })
  }
  const pIntros = getProjectsIntroEls()
  if (pIntros.length) {
    gsap.set(pIntros, { opacity: 0 })
  }

  // initial state: all stack cards off-screen at bottom & centered
  const initStacks = getStacks()
  if (initStacks.length) {
    ensureCardSize()
    gsap.set(initStacks, {
      opacity: 0,
      left: "50%",
      xPercent: -50,
      width: cardW,
      height: cardH,
      y: window.innerHeight + cardH,
    })
  }

  // 1) Main pinned trigger
  pinnedTrigger = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "+=300%",
    pin: true,
    scrub: false,
    scroller: "#smooth-wrapper",
  })

  let hasStacked = false
  let hasUnstacked = false
  let hasFlippedToGrid = false
  let hasFlippedBackToStack = false

  // 2) Controller
  ScrollTrigger.create({
    trigger: section,
    start: "top-=10% top",
    end: "+=300%",
    scroller: "#smooth-wrapper",
    onUpdate: self => {
      const p = self.progress

      const phase1Threshold = 0.15
      const phase2Threshold = 0.55

      if (p > phase1Threshold && !hasStacked) {
        stackIn()
        hasStacked = true
        hasUnstacked = false
      } else if (p <= phase1Threshold && !hasUnstacked) {
        stackOut()
        hasUnstacked = true
        hasStacked = false
      }

      if (p > phase2Threshold && !hasFlippedToGrid) {
        if (!hasStacked) {
          stackIn()
          hasStacked = true
          hasUnstacked = false
        }
        if (stackTimeline) {
          stackTimeline.pause()
          stackTimeline.progress(1)
        }

        flipStackToGrid()

        if (introWrap.value) {
          gsap.to(introWrap.value, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          })
        }

        const intros = getProjectsIntroEls()
        if (intros.length) {
          gsap.to(intros, {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          })
        }

        hasFlippedToGrid = true
        hasFlippedBackToStack = false
      } else if (p <= phase2Threshold && !hasFlippedBackToStack) {
        flipGridToStack()

        if (introWrap.value) {
          gsap.to(introWrap.value, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          })
        }

        const intros = getProjectsIntroEls()
        if (intros.length) {
          gsap.to(intros, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          })
        }

        hasFlippedBackToStack = true
        hasFlippedToGrid = false
      }
    },
  })

  ScrollTrigger.addEventListener("refreshInit", () => {
    ensureCardSize()
    const stacks = getStacks()
    if (stacks.length) {
      gsap.set(stacks, { width: cardW, height: cardH })
    }
  })
})

onBeforeUnmount(() => {
  if (pinnedTrigger) pinnedTrigger.kill()
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped>
.stack-card {
  position: absolute;
  transform-origin: center right;
  /* z-index handled via inline style / GSAP */
}
</style>
