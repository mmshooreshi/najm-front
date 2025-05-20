<template>
  <client-only>
    <div>
      <!-- Intro blank screen -->
      <section class="h-screen bg-white"></section>

      <!-- Stack Cards Section -->
      <section ref="stackSection" class="h-screen bg-gray-100 relative">
        <div
          ref="cardsGroup"
          class="absolute overflow-visible inset-0 pointer-events-none"
        >
          <div
            v-for="(_, i) in cards"
            :key="i"
            :ref="el => (cardEls[i] = el)"
            class="card w-[350px] h-[400px] bg-black/50 shadow-xl border border-teal text-teal backdrop-blur-md rounded-xl flex items-center justify-center text-lg font-bold"
          >
            {{ i + 1 }}
          </div>
        </div>
      </section>

      <!-- Grid Target Section -->
      <section
        ref="gridSection"
        class="h-screen bg-gray-200 flex flex-col items-center justify-end relative -z-10"
      >
        <div
          ref="gridTarget"
          class="relative bg-red w-full h-[500px] mb-20 pointer-events-none"
        />
      </section>
    </div>
  </client-only>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const cards = Array.from({ length: 6 })
const cardEls = ref([])
cardEls.value = Array(cards.length).fill(null)

const stackSection = ref(null)
const gridSection = ref(null)
const gridTarget = ref(null)

onMounted(async () => {
  await nextTick()
  gsap.registerPlugin(ScrollTrigger)

  // INITIAL position: offscreen
  cardEls.value.forEach((el, i) => {
    gsap.set(el, {
      opacity: 0,
      x: '100vw',
      y: -300
    })
  })

  const cardWidth = cardEls.value[0]?.offsetWidth ?? 350

  // TIMELINE: Stack Animation
  const tlStack = gsap.timeline()
  tlStack.to(cardEls.value, {
    x: (i) => -cardWidth / 2 - ((6 - i) ** 1.5) * 5 + 50,
    y: -160,
    opacity: 1,
    stagger: 0.2,
    rotation: (i) => (i - 3) * 2,
    duration: 0.8,
    ease: 'power3.out'
  })

  ScrollTrigger.create({
    id: 'STACK',
    trigger: stackSection.value,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    pin: true,
    anticipatePin: 1,
    animation: tlStack,
    markers: false
  })

  // TIMELINE: Grid Transition
  const tlGrid = gsap.timeline({ paused: true })

  const cols = 6
  const spacingX = 360
  const spacingY = 420

  ScrollTrigger.create({
    id: 'GRID',
    trigger: gridSection.value,
    start: 'top bottom',
    end: 'top top',
    scrub: true,
    animation: tlGrid,
    onRefresh: () => {
      tlGrid.clear()

      const targetRect = gridTarget.value.getBoundingClientRect()

      cards.forEach((_, i) => {
        const row = Math.floor(i / cols)
        const col = i % cols

        const x = targetRect.left + col * spacingX + spacingX / 2
        const y = targetRect.top 

        tlGrid.to(cardEls.value[i], {
          x: x - window.innerWidth / 2,
          y: y ,
          rotation: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.inOut'
        }, 0)
      })
    }
  })
})
</script>

<style scoped>
.card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
}
</style>
