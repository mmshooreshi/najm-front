<!-- components/ScrollWrapperW-webp.vue -->
<template>
  <div>
    <div ref="stackSection">
      <SceneCardsIntro />
<!-- {{ stackIds }} -->

      <div  @click="cycleStack"
      class="flex w-full h-[350px] -mt-4 md:h-[500px]  relative">
<div
  v-for="(card, i) in cardStates"
  :key="card.id"
  :data-id="card.id"
  :style="{ zIndex: cardStates.length - i, backgroundColor: card.bgColor }"
  class="stack-card w-min shadow-sm backdrop-blur-sm relative flex-none max-h-[300px] md:max-h-[400px] rounded-[1.5rem] overflow-visible rtl"
>
  <img
    :src="card.play ? card.loop : card.loop"
    :alt="card.text"
    v-motion="{ initial: { scale: 0.8 }, visible: { scale: 1 }, duration: 100 }"
    class="object-cover h-[full] w-min rounded-[1.5rem] md:-mt-24"
    placeholder="false"
  />
</div>

      </div>
    </div>

    <div ref="gridSection">
      <!-- <SceneProjects :stackIds="stackIds"/> -->
      <SceneProjects :stackIds="stackIds" @visibleStackChanged="updateStackIds" />

    </div>
  </div>
</template>

<script setup lang="ts">
/* ───────────────── imports ────────────────────────────────────────── */
import {
  ref, reactive, computed, watch, nextTick,
  onMounted, onBeforeUnmount, inject
} from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
gsap.registerPlugin(ScrollTrigger, Flip)

import SceneCardsIntro from '@/components/scenes/SceneCardsIntro.vue'
import SceneProjects   from '@/components/scenes/SceneProjects.vue'


function updateCardPositions() {
  const stacks = orderedStacks()
  const cardW = stacks[0]?.offsetWidth ?? 0

  stacks.forEach((el, i) => {
    gsap.to(el, {
      x: innerWidth / 2 - cardW * 1.1 / 2,
      y: (i * -10) + 60,
      rotation: i * 5 - 20,
      duration: 0.5,
      ease: 'power3.out'
    })
  })
}

async function cycleStack() {
  if (showAll.value) return

  // grab all cards in v-for order
  const before = gsap.utils.toArray<HTMLElement>('.stack-card')
  if (!before.length) return
  const topEl = before[0]

  const fadeDur  = 0.3
  const shiftDur = 0.3

  // 1) fade out the top card
  await gsap.to(topEl, {
    opacity: 0,
    duration: fadeDur,
    ease: 'power1.out'
  }).then()

  // 2) rotate the data array
  const moved = cardStates.shift()
  if (moved) cardStates.push(moved)

  // 3) wait for DOM to reflect new order
  await nextTick()

  // 4) animate EVERY card into its new x/y/rotation
  const after = gsap.utils.toArray<HTMLElement>('.stack-card')
  if (!after.length) return
  const w = after[0].offsetWidth
  gsap.to(after, {
    x: () => innerWidth/2 - (w * 1.1)/2,
    y: (i) => i * -10 + 60,
    rotation: (i) => i * 5 - 20,
    duration: shiftDur,
    ease: 'power3.inOut',
    stagger: 0.03
  })

  // 5) fade the moved card back in (it’s now the last element)
  const bottomEl = after[after.length - 1]
  gsap.set(bottomEl, { opacity: 0 })
  gsap.to(bottomEl, {
    opacity: 1,
    duration: fadeDur,
    delay: shiftDur,
    ease: 'power1.in'
  })
}


/* ───────────────── types ──────────────────────────────────────────── */
interface Card { id:number; poster:string; loop:string; bgColor?:string; text:string }
interface CardState extends Card { play:boolean }

function updateStackIds(newIds: number[]) {
  stackIds.value = newIds
}


/* ───────────────── refs to template sections ──────────────────────── */
const stackSection = ref<HTMLElement|null>(null)
const gridSection  = ref<HTMLElement|null>(null)

/* ───────────────── data from parent ───────────────────────────────── */
const homeUI   = inject<any>('homeUI') ?? {}
const rawCards = computed<Card[]>(() => homeUI.value?.sceneProjects?.cards ?? [])

/* ───────────────── constants ──────────────────────────────────────── */
const FIRST_IDS = [1,2,3,4,5]          // the five shown first
const FIRST_SET = new Set(FIRST_IDS)
const stackIds = ref<number[]>([])
const stackSize = ref(5) // Change this value anywhere and the stack will respond
const cardOpacity = ""
/* ───────────────── reactive state ─────────────────────────────────── */
const showAll    = ref(false)          // flips when grid enters view
const cardStates = reactive<CardState[]>([])

/* keep cardStates in sync with rawCards + showAll */ 
// watch([rawCards, showAll], async () => {
//   const source = showAll.value
//     ? [...rawCards.value].sort((a,b)=>a.id-b.id)    // all cards ascending
//     : rawCards.value.filter(c => FIRST_SET.has(c.id))

//   const mapped = source.map(c => ({ ...c, play: showAll.value }))
//   cardStates.splice(0, cardStates.length, ...mapped)
//   await nextTick()                                   // DOM is ready for GSAP
// }, { immediate:true })

// Example color palette extracted from your image
const colorPalette = [
  "#8FBC8F", // Greenish
  "#E7A7A7", // Pinkish
  "#A4A4D3", // Lavender
  "#C3C3B4", // Beige
  "#D6D6D6", // Light Gray
  "#D6D9D1", // Light Yellowish
  "#C5C6F1", // Light Blue
  "#88A8B6", // Tealish
];

// these are now commented but working (come back later):
// watch([rawCards, showAll], async () => {
//   const sorted = [...rawCards.value].sort((a, b) => a.id - b.id)

//   let source: Card[] = []

//   if (showAll.value) {
//     source = sorted
//   } else {
//     // const maxStartIndex = Math.max(0, sorted.length - 5)
//     // const randomStart = Math.floor(Math.random() * (maxStartIndex + 1))
//     // source = sorted.slice(randomStart, randomStart + 5)
//     // stackIds.value = source.map(c => c.id)

//     if (stackIds.value.length==0){
//     const maxStartIndex = Math.max(0, sorted.length - stackSize.value)
//     const randomStart = Math.floor(Math.random() * (maxStartIndex + 1))
//     source = sorted.slice(randomStart, randomStart + stackSize.value)

//     } else {
//       source = sorted.filter(c => stackIds.value.includes(c.id))
//       stackIds.value = source.map(c => c.id)

//     }


    

//   }

//   const mapped = source.map(c => ({ ...c, play: showAll.value }))
//   cardStates.splice(0, cardStates.length, ...mapped)

//   await nextTick()
// }, { immediate: true })

watch([rawCards, showAll], async () => {
  const sorted = [...rawCards.value].sort((a, b) => a.id - b.id);

  let source: Card[] = [];

  if (showAll.value) {
    source = sorted;
  } else {
    if (stackIds.value.length == 0) {
      const maxStartIndex = Math.max(0, sorted.length - stackSize.value);
      const randomStart = Math.floor(Math.random() * (maxStartIndex + 1));
      source = sorted.slice(randomStart, randomStart + stackSize.value);
    } else {
      source = sorted.filter((c) => stackIds.value.includes(c.id));
      stackIds.value = source.map((c) => c.id);
    }
  }

  const mapped = source.map((c, index) => {
    // Assign a background color from the colorPalette array
    const bgColor = colorPalette[index % colorPalette.length]; // Ensure we don't exceed the palette

    return { ...c, play: showAll.value, bgColor };
  });

  cardStates.splice(0, cardStates.length, ...mapped);

  await nextTick();
}, { immediate: true });

/* ───────────────── helper: always return stacks / targets in id order */
function orderedStacksPREV (): HTMLElement[] {
  return gsap.utils.toArray<HTMLElement>('.stack-card')
           .sort((a,b)=>Number(a.dataset.id)-Number(b.dataset.id))
}

function orderedStacks(): HTMLElement[] {
  return gsap.utils.toArray<HTMLElement>('.stack-card')
}

function orderedTargets (): HTMLElement[] {
  return gsap.utils.toArray<HTMLElement>('.embl-card')
           .sort((a,b)=>Number(a.dataset.id)-Number(b.dataset.id))
}


/* ───────────────── GSAP / ScrollTrigger setup ─────────────────────── */
onMounted(async () => {
  await nextTick()

  /* initial live lists + sizes */
  const stacks0   = orderedStacks()
  const targets0  = orderedTargets()
  const parents   = stacks0.map(el => el.parentElement!)
  const cardW     = targets0[0]?.offsetWidth  ?? 0
  const cardH     = targets0[0]?.offsetHeight ?? 0
  const stackWrap = stackSection.value!.querySelector('.flex')!

  /* initial off‑screen position for first cards */
  gsap.set(stacks0, { x:'100vw', y:'50vh', width:cardW, height:cardH })
  stacks0.forEach((el,i)=>{
    gsap.set(el,{ backgroundColor:cardStates[i].bgColor ? cardStates[i].bgColor+cardOpacity : 'transparent' })
  })

  /* stack entrance timeline */
  gsap.timeline({
    scrollTrigger:{
      trigger: stackSection.value,
      start:   'top-=40% top',
      end:     '+=300',
      //toggleActions:'play none none reverse',
      toggleActions: 'play none none none',
      once: true,
      scroller:'#smooth-wrapper'
    }
  }).add(() => updateCardPositions()).to(stacks0,{
    x: () => innerWidth/2 - cardW*1.1/2,
    y: (i:number)=> (i*-10) + 60,
    rotation:(i:number)=> i*5 - 20,
    ease:'power3.out',
    stagger:{ each:.2, from:'start' }
  })

  /* FLIP between stack <-> grid */
  ScrollTrigger.create({
    trigger: gridSection.value,
    start:   'top 50%',
    end:     '+=200',
    scrub:   true,
    scroller:'#smooth-wrapper',

    /* ── enter grid (show all) ─────────────────────────────────────── */
async onEnter() {
  showAll.value = true
  await nextTick()

  const stacks  = orderedStacks()
  const targets = orderedTargets()
  const cardW   = targets[0]?.offsetWidth  ?? 0
  const cardH   = targets[0]?.offsetHeight ?? 0

  // 1) Snap cards 6–32 into place instantly
  // const snapCards = stacks.slice(5)

  
  
  function getTargetById(id: number): HTMLElement | undefined {
    return gsap.utils.toArray<HTMLElement>('.embl-card')
      .find(el => Number(el.dataset.id) === id)
  }
  const animCards = stacks.filter(el =>
    stackIds.value.includes(Number(el.dataset.id))
  )
  const snapCards = stacks.filter(el =>
    !stackIds.value.includes(Number(el.dataset.id))
  )


  snapCards.forEach((el, idx) => {
    // const tgt = targets[5 + idx]
    const tgt = targets[stackSize.value + idx]

    // tgt.appendChild(el)

    gsap.set(el, {
      backgroundColor:cardStates[idx].bgColor ? cardStates[idx].bgColor+cardOpacity : 'transparent',
      x:        0,
      y:        0,
      rotation: 0,
      width:    cardW,
      height:   cardH
    })
  })// Snap non-animated cards into place
snapCards.forEach((el) => {
  const cardId = Number(el.dataset.id)
  const tgt = getTargetById(cardId)
  if (!tgt) return
  tgt.appendChild(el)
  gsap.set(el, {
    backgroundColor: cardStates.find(c => c.id === cardId)?.bgColor ? cardStates.find(c => c.id === cardId)?.bgColor+cardOpacity : 'transparent',
    x: 0,
    y: 0,
    rotation: 0,
    width: cardW,
    height: cardH
  })
})

// Animate only stack cards
const state = Flip.getState(animCards)

animCards.forEach((el) => {
  const cardId = Number(el.dataset.id)
  const tgt = getTargetById(cardId)
  if (!tgt) return
  tgt.appendChild(el)
  gsap.to(el, {
    backgroundColor: cardStates.find(c => c.id === cardId)?.bgColor  ? cardStates.find(c => c.id === cardId)?.bgColor+cardOpacity : 'transparent',
    duration: 0.4
  })
})

gsap.set(animCards, {
  x: 0,
  y: 0,
  rotation: 0,
  width: cardW,
  height: cardH
})

Flip.from(state, {
  absolute: false,
  duration: 1,
  ease: 'power3.inOut',
  stagger: { each: 0.1, from: 'start' },
  clearProps: 'transform'
})

// gsap.fromTo(animCards, 
//   { opacity: 0 },
//   { opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.05 }
// )


},


    /* ── leave grid (back to stack) ────────────────────────────────── */
    async onLeaveBack () {
      showAll.value = false
      await nextTick()

      const stacks = orderedStacks()
      const state  = Flip.getState(stacks)

      stacks.forEach((el,i)=>{
        parents[i].appendChild(el)                    // original order
        el.style.position = 'absolute'
        gsap.set(el,{ backgroundColor:cardStates[i].bgColor ? cardStates[i].bgColor+cardOpacity: 'transparent' })
      })

      gsap.set(stacks,{
        x: () => innerWidth/2 - cardW*1.1/2,
y: (i:number)=> (i*-10) + 60,
    rotation:(i:number)=> i*5 - 20,      })
      Flip.from(state,{
        absolute:true, duration:.8, ease:'power3.out',
        stagger:{ each:.1, from:'start' }
      })

      gsap.fromTo(stacks, 
  { opacity: 0 },
  { opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.05 }
)

    }
  })
})

onBeforeUnmount(()=>ScrollTrigger.getAll().forEach(t=>t.kill()))

defineExpose({ stackSize }) // if accessing from parent

</script>


<style scoped>
.stack-card{
  position:absolute;
  /* height:400px; */
  transform-origin:center right;
  z-index:-1;
}
</style>
