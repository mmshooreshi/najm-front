<template>
  <div>
    <!-- 1) Intro blank screen -->
    <section class="h-screen bg-blue"></section>

    <!-- 2) Scroll here to STACK your cards -->
    <section
      ref="stackTrigger"
      class="h-screen bg-gray-100 flex items-center justify-center"
    >
      <p class="text-xl">Scroll here to STACK ↙️</p>

      <div
    ref="cardsGroup"
    class=" top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
  >
    <div
      v-for="(_, i) in cards"
      :key="i"
      :ref="el => cardEls[i] = el"
      class="card absolute w-[350px] h-[400px] bg-black/50 border border-teal text-teal backdrop-blur-md shadow-xl rounded-xl flex items-center justify-center text-lg font-bold"
    >
      Card {{ i + 1 }}
    </div>
  </div>

    </section>

    <!-- 3) Scroll here to GRID your cards -->
    <section
      ref="gridTrigger"
      class="h-screen bg-gray-200 flex items-center justify-center"
    >
      <p class="text-xl">Scroll here to GRID ↘️</p>
    </section>
  </div>

  <!-- Fixed card layer on top -->
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// -- refs & data
const cards        = Array.from({ length: 6 })
const cardEls      = ref([])      // reactive array of card DOM nodes
cardEls.value = Array(cards.length).fill(null)

const stackTrigger = ref(null)
const gridTrigger  = ref(null)

onMounted(async () => {

  // wait for DOM refs to populate
  await nextTick()
  console.log('▶️ cardEls:', cardEls.value)

  // 1) INITIAL STATE: send cards off-screen, invisible
  cardEls.value.forEach((el, i) => {
    gsap.set(el, {
      opacity: 0,
      x:       (i % 2 === 0 ? '100vw' : '100vw'),
      y:       `${(i - (cards.length-1)/2) * 50}px`
    })
  })

  // compute gap based on actual width + 20px
  const cardWidth = cardEls.value[0].offsetWidth
  const gap       = cardWidth + 20
  console.log(`ℹ️ cardWidth=${cardWidth}px, gap=${gap}px`)

  // 2) STACK timeline
  const tlStack = gsap.timeline({ paused: true })
    .to(cardEls.value, {
      x:       (i) => -cardWidth/2 - ((6-i)**1.5)*10,
      y:       (i) => i*10 - 160, 
      opacity: 1,
      scale:   1,
      rotation: (i) => ([0, 1, 2,3, 4, 5, 6][i]-5)*2, 
      stagger: 0.1,
      duration: 0.8,
      ease:    'power3.out',
      onStart: () => console.log('▶️ tlStack.play()'),
      onReverseComplete: () => console.log('↩️ tlStack.reverse()'),
    })

  const st = ScrollTrigger.create({
    trigger:  stackTrigger.value,
    start:    'top 40%',
    end:      'bottom top',
    onEnter:  () => tlStack.play(),
    onLeaveBack: () => tlStack.reverse(),
    markers:  true,
    id:       'STACK',
    onRefresh(self) {
      console.log(`🔄 STACK refresh — start=${self.start}, end=${self.end}`)
    }
  })

  // 3) GRID timeline
  const tlGrid = gsap.timeline({ paused: true })
  cardEls.value.forEach((el, i) => {
    const x = (i - (cards.length-1)/2) * gap
    tlGrid.to(el, {
      x,
      y:        0,
      scale:    1,
      duration: 1,
      rotation: 0,
      ease:     'power4.inOut',
      onStart:  () => console.log(`▶️ tlGrid card ${i+1}`),
      onReverseComplete: () => console.log(`↩️ tlGrid.reverse() card ${i+1}`),
    }, 0)
  })

  ScrollTrigger.create({
    trigger:  gridTrigger.value,
    start:    'top 40%',
    end:      'bottom top',
    onEnter:  () => {
      console.log('▶️ Grid trigger onEnter')
      tlGrid.play()
    },
    onLeaveBack: () => {
      console.log('↩️ Grid trigger onLeaveBack')
      tlGrid.reverse()
    },
    markers:  true,
    id:       'GRID',
    onRefresh(self) {
      console.log(`🔄 GRID refresh — start=${self.start}, end=${self.end}`)
    }
  })
})
</script>

<style>
.card {
  transform-origin: center center;
}
</style>
