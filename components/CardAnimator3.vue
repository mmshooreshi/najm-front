<template>
  <client-only>
    <div>
      <!-- 1) Intro blank screen -->
      <section class="h-screen bg-white"></section>

      <!-- 2) STACK Section -->
      <section
        ref="stackSection"
        class="h-screen bg-gray-100 relative overflow-visible"
      >
        <div class="absolute inset-0 pointer-events-none">
          <div
            v-for="(_, i) in cards"
            :key="i"
            ref="cardEls"
            class="card w-[350px] h-[400px] shadow-xl backdrop-blur-md rounded-xl flex items-center justify-center text-lg font-bold"
          >
            {{ i + 1 }}
          </div>
        </div>
      </section>

      <!-- 3) GRID Section -->
      <section ref="gridTrigger" class=" h-screen relative overflow-hidden">
        <div class="w-full  overflow-auto">
          <div class="flex flex-row gap-4 w-max ">
            <div
              v-for="(_, i) in cards"
              :key="i+1000"
              ref="targetEls"
              class="w-[350px] h-[400px] border-2 border-black rounded-xl"
            />
          </div>
        </div>
      </section>

      <!-- Final spacer -->
      <section class="h-screen bg-gray-300"></section>
    </div>
  </client-only>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = Array.from({ length: 6 })

const cardEls = ref([])
const targetEls = ref([])

const stackSection = ref(null)
const gridTrigger = ref(null)

onMounted(async () => {
  await nextTick()

  // INITIAL: Off-screen
  cardEls.value.forEach(el => {
    gsap.set(el, {
      x: '100vw',
      y: '50vh',
      opacity: 1,
      backgroundColor: 'transparent',
      borderColor: '#000',
      color: '#000',
      rotation: 0,
    })
  })

  const cardWidth = cardEls.value[0].offsetWidth

  // STACK animation
  gsap.timeline({
    scrollTrigger: {
      trigger: stackSection.value,
      start: 'top top',
      end: '+=400',
      scrub: false,
      pin: true,
      toggleActions: 'play none none reverse',
    },
  }).to(cardEls.value, {
    x: (i) => window.innerWidth / 2 - cardWidth / 2 - 200 + i * 60,
    y: (i) => 160 + i * 20,
    rotation: (i) => (i - (cards.length - 1) / 2) * 5 - 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderColor: '#14b8a6',
    color: '#14b8a6',
    ease: 'power3.out',
    stagger: 0.1,
  })

  // Get positions relative to current card positions
  const gridPositions = targetEls.value.map((target, i) => {
    const cardRect = cardEls.value[i].getBoundingClientRect()
    const stackSectionRect= stackSection.value.getBoundingClientRect()
    const gridSectionRect = gridTrigger.value.getBoundingClientRect()

    const targetRect = target.getBoundingClientRect()
    return {
      x: targetRect.left,
      y: 0 + stackSectionRect.height 
    }
  })

  // Animate to GRID
  gsap.timeline({
    scrollTrigger: {
      trigger: gridTrigger.value,
      start: 'top bottom',
      end: '+=400',
      scrub: false,
      toggleActions: 'play none none reverse',
    },
  }).to(cardEls.value, {
    x: (i) => gridPositions[i].x,
    y: (i) => gridPositions[i].y,
    rotation: 0,
    scale: 1,
    ease: 'power3.inOut',
  }, 0)
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped>
.card {
  position: absolute;
  width: 350px;
  height: 400px;
  transform-origin: center center;
  /* Default styles: blur, shadow, rounded, and center content */
  /* Color/border/bg are set via GSAP inline styles */
}
</style>
