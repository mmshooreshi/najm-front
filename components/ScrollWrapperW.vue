<!-- components/ScrollWrapperW.vue -->
<template>
  <div>
    <!-- STACK SECTION -->
    <div ref="stackSection">
      <SceneCardsIntro />

      <div class="flex w-full h-[500px] relative">
        <div
          v-for="(card, i) in cards"
          :key="card.id ?? i"
          class="stack-card relative flex-none w-full max-h-[400px] max-w-[500px] rounded-[1.5rem] overflow-visible rtl"
        >
          <NuxtImg
            :src="card.image"
            :alt="card.text"
            v-motion
            :initial="{ scale: 0.8 }"
            :visible="{ scale: 1 }"
            :duration="100"
            class="object-cover h-full w-full rounded-[1.5rem]"
          />
        </div>
      </div>
    </div>

    <!-- GRID SECTION -->
    <div ref="gridSection">
      <SceneProjects />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  nextTick,
  onBeforeUnmount,
  computed,
  inject,
} from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

import SceneCardsIntro from '@/components/scenes/SceneCardsIntro.vue'
import SceneProjects from '@/components/scenes/SceneProjects.vue'

gsap.registerPlugin(ScrollTrigger, Flip)

interface Card {
  id: number
  image: string
  text: string
}

const stackSection = ref<HTMLElement | null>(null)
const gridSection = ref<HTMLElement | null>(null)

const homeUI = inject<any>('homeUI')

const cards = computed<Card[]>(() => {
  return (homeUI?.value?.sceneProjects?.cards ?? []) as Card[]
})

onMounted(async () => {
  await nextTick()

  const stackEls = gsap.utils.toArray<HTMLElement>('.stack-card')
  const targetEls = gsap.utils.toArray<HTMLElement>('.embl-card')

  if (!stackEls.length || !targetEls.length) return

  const cardWidth = targetEls[0].offsetWidth ?? 0
  const cardHeight = targetEls[0].offsetHeight ?? 0
  const originalParents = stackEls
    .map(el => el.parentElement)
    .filter((el): el is HTMLElement => !!el)

  const centerX = window.innerWidth / 2

  // INITIAL STATE: cards off-screen to the right
  gsap.set(stackEls, {
    x: '100vw',
    y: '50vh',
    width: cardWidth,
    height: cardHeight,
    opacity: 1,
    rotation: 0,
  })

  // STACK FAN ANIMATION
  gsap.timeline({
    scrollTrigger: {
      trigger: stackSection.value,
      start: 'top-=40% top',
      end: '+=400',
      pin: false,
      toggleActions: 'play none none reverse',
      scroller: '#smooth-wrapper',
      scrub: false,
    },
  }).to(stackEls, {
    x: () => centerX - (cardWidth * 1.1) / 2,
    y: 0,
    rotation: i => i * 1 - 10,
    ease: 'power3.out',
    stagger: {
      each: 0.2,
      from: 'start',
    },
  })

  // FLIP TO GRID
  ScrollTrigger.create({
    trigger: gridSection.value,
    start: 'top 50%',
    end: '+=200',
    scrub: true,
    scroller: '#smooth-wrapper',

    onEnter() {
      const state = Flip.getState(stackEls)

      stackEls.forEach((cardEl, i) => {
        const target = targetEls[i]
        if (!target) return

        target.appendChild(cardEl)

        const img = cardEl.querySelector('img')
        if (img) {
          gsap.to(img, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
          })
        }
      })

      gsap.set(stackEls, {
        x: 0,
        y: 0,
        rotation: 0,
        width: cardWidth,
        height: cardHeight,
      })

      Flip.from(state, {
        absolute: false,
        ease: 'power3.inOut',
        duration: 1,
        stagger: {
          each: 0.1,
          from: 'start',
        },
        clearProps: 'transform',
      })
    },

    onLeaveBack() {
      const state = Flip.getState(stackEls)

      stackEls.forEach((cardEl, i) => {
        const parent = originalParents[i]
        if (!parent) return

        parent.appendChild(cardEl)
        cardEl.style.position = 'absolute'
      })

      const centerX = window.innerWidth / 2

      gsap.set(stackEls, {
        x: () => centerX - (cardWidth * 1.1) / 2,
        y: 0,
        rotation: i => i * 1 - 10,
      })

      Flip.from(state, {
        absolute: true,
        duration: 0.8,
        ease: 'power3.out',
        stagger: {
          each: 0.1,
          from: 'start',
        },
      })
    },
  })
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped>
.stack-card {
  position: absolute;
  height: 400px;
  transform-origin: center right;
  z-index: -1;
}
</style>
