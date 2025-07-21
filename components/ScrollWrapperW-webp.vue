<template>
  <div>
    <div ref="stackSection">
      <SceneCardsIntro />
      <div class="flex w-full h-[500px] relative">
        <div
          v-for="(card, i) in cards"
          :key="card.id"
          :class="[
            'stack-card relative flex-none w-full max-h-[400px] max-w-[500px] rounded-[1.5rem] overflow-visible rtl p-6',
            bgClasses[i % bgClasses.length]
          ]"
        >
        <!-- {{active}} -->
          <!-- fill card with poster or animated WebP -->
          <img
            :src="active[i] ? card.src : card.poster "
            :alt="card.text"
            class="object-cover w-full h-full rounded-[1.5rem] absolute inset-0"
            loading="eager"
            fetchpriority="high"
          />

          <div
            v-motion
            :initial="{ scale: 0.8 }"
            :visible="{ scale: 1 }"
            :duration="100"
            class="absolute bottom-6 right-6 bg-white bg-opacity-70 px-3 py-2 rounded-[1.5625rem] rounded-br-[0.3125rem] max-h-[85px] max-w-[260px] text-xs md:text-sm font-medium text-gray-800"
          >
            {{ card.text }}
          </div>
        </div>
      </div>
    </div>

    <div ref="gridSection">
      <SceneProjects />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

import SceneCardsIntro from '@/components/scenes/SceneCardsIntro.vue'
import SceneProjects  from '@/components/scenes/SceneProjects.vue'
// import { NuxtImg }    from '#components'

gsap.registerPlugin(ScrollTrigger, Flip)

const stackSection = ref<HTMLElement | null>(null)
const gridSection  = ref<HTMLElement | null>(null)

// pastel background classes
const bgClasses = [
  'bg-pink-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-indigo-100',
  'bg-teal-100'
]

// cards: id, animated WebP src, AVIF poster, and text
const cards = [
  { id: 1, src: '/videos/19.webp', poster: '/videos/posters/19.avif', text: 'یه جعبه می‌خوام که از محصولم محافظت کنه تا توی انبار و هنگام ارسال آسیبی نبینه.' },
  { id: 2, src: '/videos/20.webp', poster: '/videos/posters/20.avif', text: 'برام مهمه که لیبل‌ها دقیق باشن، چون باید بره انبارداری مرکزی.' },
  { id: 3, src: '/videos/21.webp', poster: '/videos/posters/21.avif', text: 'بسته‌بندی باید در حدی تمیز و مرتب باشه که حس پرمیوم بده، بدون نیاز به بازنگری.' },
  { id: 4, src: '/videos/22.webp', poster: '/videos/posters/22.avif', text: 'جعبه‌ها باید مستقیم برن تو قفسه، زمان بازچینی ندارم.' },
  { id: 5, src: '/videos/23.webp', poster: '/videos/posters/23.avif', text: 'چاپ متن‌ها و نمودارهای آموزشی باید با دقت کامل باشه، چون مخاطب جزئی‌نگره.' },
  { id: 6, src: '/videos/24.webp', poster: '/videos/posters/24.avif', text: 'باید مطمئن باشم استانداردهای چاپ و بسته‌بندی بین‌المللی رعایت می‌شه.' },
  { id: 7, src: '/videos/25.webp', poster: '/videos/posters/25.avif', text: 'تجربه بدی داشتم، رنگ نهایی هیچ‌وقت مثل طراحی من نشده.' },
  { id: 8, src: '/videos/26.webp', poster: '/videos/posters/26.avif', text: 'باید با ظاهر بسته‌بندیم مخاطب جذب شه، نمی‌خوام مثل بقیه باشم.' },
  // { id: 10, src: '/videos/28.webp', poster: '/videos/posters/28.avif', text: 'بسته‌بندی من باید هم خوش‌دست باشه هم سریع باز شه، چون مشتری عجوله.' }
  { id: 9, src: '/videos/27.webp', poster: '/videos/posters/27.avif', text: 'دنبال یه جعبه‌ خاص‌ام که باز شدنش حس غافلگیری بده.' },
]

// track which card is currently “active” (showing animation)
const active = ref<boolean[]>(cards.map(() => false))

onMounted(async () => {
  await nextTick()

  // preload each AVIF & WebP exactly once
  cards.forEach(c => {
    const p1 = document.createElement('link')
    p1.rel = 'preload'; p1.as = 'image'; p1.href = c.poster
    document.head.appendChild(p1)

    const p2 = document.createElement('link')
    p2.rel = 'preload'; p2.as = 'image'; p2.href = c.src
    p2.fetchPriority = 'high'
    document.head.appendChild(p2)
  })

  // GSAP stack + Flip setup (unchanged)
  const stacks  = gsap.utils.toArray<HTMLElement>('.stack-card')
  const targets = gsap.utils.toArray<HTMLElement>('.embl-card')
  const cardWidth  = targets[0]?.offsetWidth  ?? 0
  const cardHeight = targets[0]?.offsetHeight ?? 0
  const originalParents = stacks.map(el => el.parentElement!)

  gsap.set(stacks, {
    x: '100vw', y: '50vh',
    width:  cardWidth, height: cardHeight,
    opacity: 1, rotation: 0
  })

  gsap.timeline({
    scrollTrigger: {
      trigger: stackSection.value,
      start:   'top-=40% top',
      end:     '+=400',
      toggleActions: 'play none none reverse',
      scroller: '#smooth-wrapper'
    }
  }).to(stacks, {
    x: () => window.innerWidth/2 - cardWidth*1.1/2 ,
    y: 0, rotation: i => i*1 -10,
    ease: 'power3.out',
    stagger: { each: 0.2, from: 'start' }
  })

  ScrollTrigger.create({
    trigger:  gridSection.value,
    start:    'top 50%', end: '+=200',
    scrub:    true,
    scroller: '#smooth-wrapper',
    onEnter: () => {
      const state = Flip.getState(stacks)
      stacks.forEach((c,i) => targets[i].appendChild(c))
      gsap.set(stacks, { x:0, y:0, rotation:0, width:cardWidth, height:cardHeight })
      Flip.from(state, {
        absolute: false,
        ease:     'power3.inOut',
        duration: 1,
        stagger:  { each:0.1, from:'start' },
        clearProps: 'transform'
      })
    },
    onLeaveBack: () => {
      const state = Flip.getState(stacks)
      stacks.forEach((c,i) => {
        originalParents[i].appendChild(c)
        c.style.position = 'absolute'
      })
      gsap.set(stacks, {
        x: () => window.innerWidth/2 - cardWidth*1.1/2,
        y: 0, rotation: i => i*1 -10
      })
      Flip.from(state, {
        absolute:  true,
        duration:  0.8,
        ease:      'power3.out',
        stagger:   { each:0.1, from:'start' }
      })
    }
  })

  // ScrollTrigger per card to toggle active[i]
  stacks.forEach((el, i) => {
    ScrollTrigger.create({
      trigger:     el,
      start:       'top 80%',
      end:         'bottom 20%',
      onEnter:     () => (active.value[i] = true),
      onLeave:     () => (active.value[i] = false),
      onEnterBack: () => (active.value[i] = true),
      onLeaveBack: () => (active.value[i] = false),
      scroller:    '#smooth-wrapper'
    })
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
