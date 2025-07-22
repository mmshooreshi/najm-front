<!-- components/ScrollWrapperW.vue -->
<template>
  <div>
    <div class=" " ref="stackSection">
      <SceneCardsIntro />
      <div class="flex w-full h-[500px] relative">

        <div
        v-for="(card, i) in  cards"
        :key="i"
        class="stack-card relative flex-none w-full  max-h-[400px] max-w-[500px] rounded-[1.5rem] overflow-visible rtl">          
        
        <NuxtImg
            :src="card.image"
            :alt="card.text"
            v-motion
            :initial="{scale: 0.8}"
            :visible="{scale: 1}"
            :duration="100"

            class="object-cover h-full w-full scale-100 rounded-[1.5rem]"
          />
          <!-- <div   v-motion
            :initial="{scale: 0}"
            :visible="{scale: 1}"
            :duration="100" :delay="1" class="absolute bottom-6 right-6 bg-[#D6E6E3] px-3 py-2 rounded-[1.5625rem] rounded-br-[0.3125rem] max-h-[85px]  max-w-[210px]  md:max-w-[260px] text-xs md:text-sm md:font-medium text-d4">
            {{ card.text }}
          </div>
 -->
      </div>

      </div>
      

    </div>

    <div class="" ref="gridSection">
      <SceneProjects />
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)

import SceneCardsIntro from '@/components/scenes/SceneCardsIntro.vue'
import SceneProjects  from '@/components/scenes/SceneProjects.vue'

interface Card {
  id: number
  image: string      // fallback static image if you still want it
  poster?: string     // still frame while stacked
  loop?: string       // looped video for grid view
  bgColor?: string    // accent colour for grid card
  text: string
}

const stackSection = ref<HTMLElement | null>(null)
const gridSection  = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()

  // grab your DOM nodes
  const stacks  = gsap.utils.toArray<HTMLElement>('.stack-card')
  const targets = gsap.utils.toArray<HTMLElement>('.embl-card')
  const cardWidth = targets[0]?.offsetWidth ?? 0
  const cardHeight = targets[0]?.offsetHeight ?? 0

  const count = stacks.length
  // store each card’s original parent so we can move it back
  const originalParents = stacks.map(card => card.parentElement!)

  // 1) INITIAL STATE: off-screen center
  gsap.set(stacks, {
    x: '100vw',
    y: '50vh',
    width: cardWidth,
    height: cardHeight,
    opacity: 1,
    rotation: 0,
  })
 const z=0;
  // 2) STACK ANIMATION: pinned for 400px
  const stackTl = gsap.timeline({
    scrollTrigger: {
      trigger: stackSection.value,
      start: 'top-=40% top',
      end: '+=400',
      pin: false,
      toggleActions: 'play none none reverse',
      scroller: '#smooth-wrapper',
      scrub: false,
    }
  }).to(stacks, {
    x: (i) => 1 * (window.innerWidth/2) - (cardWidth*1.1/2) ,
    y: (i) => 0,
    rotation: (i)=> i*1 -10,
    // rotation: (i) => (i - (count-1)/2) * 4,
    ease: 'power3.out',
    stagger: {     // ← and here
      each: 0.2,
      from: 'start'
    }

  })

  // 2) your FLIP trigger
ScrollTrigger.create({
  trigger:   gridSection.value,
  start:     'top 50%',
  end:       '+=200',
  scrub:     true,
  scroller:  '#smooth-wrapper',
  onEnter: () => {
    const state = Flip.getState(stacks)
    stacks.forEach((c,i) => {targets[i].appendChild(c)

                
  const img = c.querySelector('img')
  if (img) {
    gsap.to(img, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    })
  }
    })
    

    gsap.set(stacks, {
    x:       0,
    y:    0,
    rotation:0,
     width: cardWidth,
    height: cardHeight
  })



    const flipTl = Flip.from(state, {
      absolute: false,
      ease:     'power3.inOut',
      duration: 1,
      stagger: {         // ← add this
      each: 0.1,       // 100ms between cards
      from: 'start',    // or 'end', 'center', an index, etc.
    },
    clearProps: 'transform'            // once done, strip out inline pos/transform
    })



  },
  onLeaveBack: () => {
    // 1) move them back to their original container & restore absolute

      // 1) capture current (grid) positions
      const state = Flip.getState(stacks)

      // 2) move them back
      stacks.forEach((c,i) => {
        originalParents[i].appendChild(c)
        c.style.position = 'absolute'

      })

      // 3) re-apply the stacked transforms *exactly* as in stackTl’s end
      gsap.set(stacks, {
        x: (i) => 1 * (window.innerWidth/2) - (cardWidth*1.1/2) ,
        y: (i) => 0,
    rotation: (i)=> i*1 -10,
      })

      // 4) Flip from grid → stack
      const flipBack =Flip.from(state, {
        absolute:  true,
        duration:  0.8,
        ease:      'power3.out',
        stagger: {     // ← and here
      each: 0.1,
      from: 'start'
    }


      })
  }
})


})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})

const homeUI = inject<any>('homeUI') ?? {}
const cards = computed(() => (homeUI?.value?.sceneProjects?.cards ?? []) as Card[])


</script>
<style scoped>
.stack-card {
  position: absolute;
  height: 400px;
  transform-origin: center right;
  z-index: -1;
  /* Default styles: blur, shadow, rounded, and center content */
  /* Color/border/bg are set via GSAP inline styles */
}


</style>
