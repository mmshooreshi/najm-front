<!-- components/ScrollWrapper.vue -->
<template>
  <div>
    <div class="bg-blue " ref="stackSection">
      <SceneCardsIntro />
      <div class="flex w-full h-[500px] bg-red relative">

        <div
        v-for="(card, i) in cards"
        :key="i"
        class="stack-card relative flex-none w-4/5  max-h-[400px] max-w-[500px] rounded-[1.5rem] overflow-visible rtl"
      >          <NuxtImg
            :src="card.image"
            :alt="card.text"
            v-motion
            :initial="{scale: 0.8}"
            :visible="{scale: 1}"
            :duration="100"
            class="object-cover h-full w-full scale-100 rounded-[1.5rem]"
          />
          <div   v-motion
            :initial="{scale: 0}"
            :visible="{scale: 1}"
            :duration="100" :delay="1" class="absolute bottom-6 right-6 bg-[#D6E6E3] px-3 py-2 rounded-[1.5625rem] rounded-br-[0.3125rem] max-h-[85px]  max-w-[210px]  md:max-w-[260px] text-xs md:text-sm md:font-medium text-d4">
            {{ card.text }}
          </div>

      </div>

      </div>
      
      <!-- make sure your <StackedCards /> is in here -->


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


const stackSection = ref<HTMLElement | null>(null)
const gridSection  = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()

  // grab your DOM nodes
  const stacks  = Array.from(document.querySelectorAll<HTMLElement>('.stack-card'))
  const targets = Array.from(document.querySelectorAll<HTMLElement>('.embl-card'))
  // 1) INITIAL STATE: off-screen center
  gsap.set(stacks, {
    x: '100vw',
    y: '50vh',
    opacity: 1,
    rotation: 0,
  })

  // const cardWidth = stacks[0].offsetWidth
  const cardWidth =300;
  // 2) STACK ANIMATION: pinned for 400px
  gsap.timeline({
    scrollTrigger: {
      trigger: stackSection.value,
      start: 'top-=40% top',
      end: '+=400',
      pin: false,
      scrub: false,
      toggleActions: 'play none none reverse',
      markers: false,
      scroller: '#smooth-wrapper' 

    }
  }).to(stacks, {
    opacity: 1,
    x: (i) => window.innerWidth/2 - cardWidth/2 - 200 + i * 20,
    y: (i) => 160 + i * 2 -100,
    rotation: (i) => (i - (stacks.length-1)/2)*2 - 14,
    ease: 'power3.out',
    stagger: 0.1,
  })

    // 3) FLIP into the grid
    ScrollTrigger.create({
    trigger: gridSection.value,
    start: 'top bottom',
    end: '+=200',
    scrub: true,
    scroller: '#smooth-wrapper',
    toggleActions: 'play none none reverse',
    markers: true,
    onEnter: () => {
      // capture the current “stacked” layout
      const state = Flip.getState(stacks)

      // move each stackCard into its matching emblemCard container
      stacks.forEach((card, i) => {
        targets[i].appendChild(card)
      })

      // animate from old state → new state
      Flip.from(state, {
        absolute: true,
        ease: 'power3.inOut',
        duration: 1,
      })
    }
  })


  // 3) CALCULATE TARGET POSITIONS
  // const gridPositions = targets.map(t => {
  //   const rect = t.getBoundingClientRect()
  //   console.log({ x: rect.left, y: rect.top+ window.scrollY } )
  //   return { x: rect.left, y: rect.top }  // absolute page pos
  // })
  const gridPositions = targets.map(t => {
  const bounds = t.getBoundingClientRect()
  const scrollY = ScrollTrigger.scrollerProxy('#smooth-wrapper')?.scrollTop || window.scrollY
  return {
    x: bounds.left,
    y: bounds.top + scrollY,
  }
})

  // 4) TRANSITION INTO PLACE
//   gsap.timeline({
//     scrollTrigger: {
//       trigger: gridSection.value,
//       start: 'top bottom',
//       // end: '+=400',
//       scrub: true,
//       toggleActions: 'play none none reverse',
//       markers: true,
//       scroller: '#smooth-wrapper' 

//     }
//   }).to(stacks, {
//     x: (i) => gridPositions[cards.length - i-1].x,
//     y: (i) => gridPositions[cards.length - i-1].y,
//     rotation: 0,
//     stagger: {
//     each: 0.3,
//     from: 'end'       // ← play the last card first
//   },
//     scale: 1,
//     ease: 'power3.inOut',
//   }, 0)
// })
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})


const cards = [
  { id: 1,  image: '/images/sections/cards/1.png',  text: 'یه جعبه می‌خوام که از محصولم محافظت کنه تا توی انبار و هنگام ارسال آسیبی نبینه.' },
  { id: 2,  image: '/images/sections/cards/2.png',  text: 'برام مهمه که لیبل‌ها دقیق باشن، چون باید بره انبارداری مرکزی.' },
  { id: 3,  image: '/images/sections/cards/3.png',  text: 'بسته‌بندی باید در حدی تمیز و مرتب باشه که حس پرمیوم بده، بدون نیاز به بازنگری.' },
  { id: 4,  image: '/images/sections/cards/4.png',  text: 'جعبه‌ها باید مستقیم برن تو قفسه، زمان بازچینی ندارم.' },
  { id: 5,  image: '/images/sections/cards/5.png',  text: 'چاپ متن‌ها و نمودارهای آموزشی باید با دقت کامل باشه، چون مخاطب جزئی‌نگره.' },
  { id: 6,  image: '/images/sections/cards/6.png',  text: 'باید مطمئن باشم استانداردهای چاپ و بسته‌بندی بین‌المللی رعایت می‌شه.' },
  { id: 7,  image: '/images/sections/cards/7.png',  text: 'تجربه بدی داشتم، رنگ نهایی هیچ‌وقت مثل طراحی من نشده.' },
  { id: 8,  image: '/images/sections/cards/8.png',  text: 'باید با ظاهر بسته‌بندیم مخاطب جذب شه، نمی‌خوام مثل بقیه باشم.' },
  { id: 9,  image: '/images/sections/cards/9.png',  text: 'دنبال یه جعبه‌ خاص‌ام که باز شدنش حس غافلگیری بده.' },
  { id: 10, image: '/images/sections/cards/1.png', text: 'بسته‌بندی من باید هم خوش‌دست باشه هم سریع باز شه، چون مشتری عجوله.' }
]


</script>



<style scoped>
.stack-card {
  position: absolute;
  height: 400px;
  transform-origin: center center;
  /* Default styles: blur, shadow, rounded, and center content */
  /* Color/border/bg are set via GSAP inline styles */
}

</style>
