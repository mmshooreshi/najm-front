<template>
    <client-only>
      <div>
        <!-- 0) Intro blank screen -->
        <section class="h-screen bg-white"></section>
  
        <!-- 1) Stack Cards Section -->
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
  
        <!-- 2) Grid Target Section -->
        <section
          ref="gridSection"
          class="h-screen bg-gray-200 flex flex-col items-center justify-end relative -z-10"
        >
          <div
            ref="gridTarget"
            class="relative bg-red w-full h-[500px] mb-20 pointer-events-none"
          />
        </section>
  
        <!-- 3) Horizontal Scroll Section -->
        <section ref="horizSection" class="h-screen overflow-hidden bg-gray-100 relative">
          <div ref="horizContainer" class="w-full h-full relative">
            <div
              ref="cardsRow"
              class="ml-6 mr-0 absolute top-1/2 left-0 transform -translate-y-1/2 flex space-x-4"
            >
              <div
                v-for="(_, i) in cards"
                :key="i"
                class="w-[350px] h-[400px] bg-black/50 shadow-xl border border-teal text-teal backdrop-blur-md rounded-xl flex items-center justify-center text-lg font-bold"
              >
                {{ i + 1 }}
              </div>
            </div>
          </div>
        </section>
  
        <!-- 4) After -->
        <section class="h-[5000px] bg-white"></section>
      </div>
    </client-only>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  
  const cards = Array.from({ length: 6 })
  
  // for stack & grid
  const cardEls     = ref([])
  cardEls.value    = Array(cards.length).fill(null)
  const stackSection = ref(null)
  const gridSection  = ref(null)
  const gridTarget   = ref(null)
  const cardsGroup   = ref(null)
  
  // for horizontal scroll
  const horizSection   = ref(null)
  const horizContainer = ref(null)
  const cardsRow       = ref(null)
  
  onMounted(async () => {
    await nextTick()
    gsap.registerPlugin(ScrollTrigger)
  
    // 1) INITIAL (offscreen)
    cardEls.value.forEach((el) => {
      gsap.set(el, { opacity: 0, x: '100vw', y: -300 })
    })
  
    const cardWidth = cardEls.value[0]?.offsetWidth ?? 350
  
    // 2) STACK Timeline
    const tlStack = gsap.timeline()
    tlStack.to(cardEls.value, {
      x: i => -cardWidth/2 - ((cards.length - i)**1.5)*5 + 50,
      y: -160,
      opacity: 1,
      rotation: i => (i - cards.length/2)*2,
      stagger: 0.2,
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
      markers: false,
    })
  
    // 3) GRID Timeline
    const tlGrid = gsap.timeline({ paused: true })
    const cols     = cards.length
    const spacingX = 360
  
    ScrollTrigger.create({
      id: 'GRID',
      trigger: gridSection.value,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      animation: tlGrid,
      onRefresh: () => {
        tlGrid.clear()
        const rect = gridTarget.value.getBoundingClientRect()
        cards.forEach((_, i) => {
          const col = i % cols
          const x = rect.left + col*spacingX - window.innerWidth/2 + spacingX/2
          tlGrid.to(cardEls.value[i], {
            x,
            y: 400,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.inOut'
          }, 0)
        })
      }
    })
  
    // 4) HORIZONTAL SCROLL
    await nextTick()
    const totalDistance = cardsRow.value.scrollWidth - horizContainer.value.clientWidth + 100
  
    gsap.to(cardsRow.value, {
      x: -totalDistance,
      ease: 'none',
      scrollTrigger: {
        id: 'HORIZONTAL',
        trigger: horizSection.value,
        start: 'top top',
        end: () => `+=${totalDistance}`,
        scrub: true,
        pin: true,
        pinSpacing: false,
        markers: false,
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
  