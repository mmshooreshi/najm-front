<template>
  <!-- CLICK ANYWHERE TO TOGGLE -->
  <div ref="container" class="package-slide" @click="toggleExpand">
    <div
      v-for="(product,i) in pkg.products"
      :key="product.id"
      :ref="el => (itemEls[i] = el as HTMLElement | null)"
      class="card"
      @mouseenter="() => (tooltipIdx = i)"
      @mouseleave="() => (tooltipIdx = null)"
    >
      <img :src="product.image" :alt="product.name" />
      <span v-if="tooltipIdx===i" class="tooltip">{{ product.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import type { Package } from '@/types'
import { gsap } from 'gsap'

/* ------------------------------------------------------------------ */
/* props / emits                                                      */
/* ------------------------------------------------------------------ */
const props = defineProps<{ pkg: Package; expanded: boolean }>()
const emit  = defineEmits(['toggleExpand'] as const)

/* ------------------------------------------------------------------ */
/* constants                                                          */
/* ------------------------------------------------------------------ */
const CARD_W = 160
const CARD_H = 190
const GAP    = 24
const BOTTOM = 24            // bottom inner padding

/* ------------------------------------------------------------------ */
/* refs                                                               */
/* ------------------------------------------------------------------ */
const container  = ref<HTMLElement|null>(null)
const itemEls    = ref<(HTMLElement|null)[]>([])
const tooltipIdx = ref<number|null>(null)

/* ------------------------------------------------------------------ */
/* stores & tweens                                                    */
/* ------------------------------------------------------------------ */
const floatTweens: gsap.core.Tween[] = []
const startPos = ref<{x:number;y:number}[]>([])
const gridPos  = ref<{x:number;y:number}[]>([])

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */
function killFloats () { floatTweens.forEach(t=>t.kill()); floatTweens.length=0 }

function computeStart () {
  if(!container.value) return
  // collapse width first so random maths uses viewport width, not giant grid width
  gsap.set(container.value,{width:'100%'})
  const {width,height} = container.value.getBoundingClientRect()
  startPos.value = props.pkg.products.map(()=>({
    x: Math.random()*Math.max(width - CARD_W,0),
    y: Math.random()*Math.max(height-CARD_H-BOTTOM,0)
  }))
}

function computeGrid () {
  if(!container.value) return
  const {height} = container.value.getBoundingClientRect()
  gridPos.value  = props.pkg.products.map((_,i)=>({
    x: i*(CARD_W+GAP),
    y: height - CARD_H - BOTTOM
  }))
  const totalW = (props.pkg.products.length-1)*(CARD_W+GAP)+CARD_W
  gsap.set(container.value,{width: totalW})
}

function placeAtStart(){
  itemEls.value.forEach((el,i)=> el && gsap.set(el,startPos.value[i]))
}

function floatCards(){
  killFloats()
  itemEls.value.forEach((el,i)=>{
    if(!el) return
    floatTweens.push(
      gsap.to(el,{
        y:"+=12",
        duration:2+Math.random(),
        ease:"sine.inOut",
        yoyo:true,
        repeat:-1,
        delay:i*0.05
      })
    )
  })
}

function glideToGrid(){
  itemEls.value.forEach((el,i)=> el && gsap.to(el,{...gridPos.value[i],duration:0.6,ease:"power2.out"}))
}

/* ------------------------------------------------------------------ */
/* lifecycle                                                          */
/* ------------------------------------------------------------------ */
onMounted(async()=>{
  await nextTick()
  computeStart()
  placeAtStart()
  floatCards()
})

watch(()=>props.expanded,async exp=>{
  await nextTick()
  if(!container.value) return
  if(exp){
    computeGrid()
    killFloats()
    glideToGrid()
  }else{
    computeStart()
    gsap.to(itemEls.value,{
      x:(i:number)=>startPos.value[i].x,
      y:(i:number)=>startPos.value[i].y,
      duration:0.4,
      ease:"power2.out",
      onComplete: floatCards
    })
  }
})

function toggleExpand(){ emit('toggleExpand') }
</script>

<style scoped>
.package-slide{
  position:relative;
  width:100%;
  height:100%;
  overflow-x:auto;      /* allow horizontal scroll when grid wider */
  overflow-y:hidden;
  cursor:pointer;
  scroll-behavior:smooth;

  
}
.card{
  position:absolute;
  width:160px;height:190px;
  display:flex;align-items:center;justify-content:center;
  will-change:transform;
}
.card img{max-width:100%;max-height:100%;object-fit:contain;pointer-events:none;}
.tooltip{
  position:absolute;bottom:100%;left:50%;transform:translateX(-50%);
  background:rgba(0,0,0,.75);color:#fff;padding:2px 6px;border-radius:4px;font-size:.75rem;white-space:nowrap;user-select:none;
}



.package-slide {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}
.package-slide.expanded {
  display: flex;
  align-items: flex-end;
  overflow-x: auto;
  padding: 1rem;
}
.product-wrapper {
  position: absolute;
  will-change: transform;
  transition: transform 0.4s ease;
}
.package-slide.expanded .product-wrapper {
  position: static;
  margin-right: 1rem;
}
.floating-item {
  display: block;
  max-width: 200px;
  height: auto;
  transition: transform 0.3s ease; /* Smooth transformation on hover */
}

.floating-item:hover {
  transform: scale(1.05); /* Slight scaling effect */
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  pointer-events: none;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease; /* Smooth fade-in transition */
}

.tooltip:hover {
  opacity: 1; /* Make tooltip visible */
}

</style>




