
<template>
  <div
    role="status"
    class="w-full space-y-8 md:space-y-0 space-x-8 rtl:space-x-reverse flex items-center  rounded-3xl"
    v-motion-pop-visible-once
    :delay="getRandomDelay(index)"
  >
    <div
    :class="[!loaded ? 'skeleton' : '']"
      class="  relative   flex transition-all group hover:scale-110 duration-800 items-center justify-center w-full h-48 bg-gray-300 rounded-3xl overflow-hidden min-w-46 max-w-86 dark:bg-gray-700"
      
      :style="{ animationDelay: `${getRandomDelay2(index)}ms` }"
    >
      <Icon
      v-motion-pop                 v-show="!loaded && countdown> 3"

        name="mage:image"
        class="w-10 h-10 text-white/50 dark:text-gray-600 fixed "
        :customize="customize"
      />
      <div 
  class="h-48 absolute w-auto  right-0 transition-all duration-1000 left-0 bottom-0  bg-gray/20" 
  :style="'right: ' +( 100 - (((countdown) % 50)*2) )  + '%'"
></div>
<span class="absolute  font-mono text-xs bottom-2 scale-100 font-extrabold translate-y-0 text-gray-800/30 transition-all" :class="{'text-3xl bottom-unset scale-500 text-gray-800/10':countdown<4, '!scale-0':src}">
  {{ countdown<4? countdown : (c / 1000).toFixed(3) }}</span>



      <NuxtImg
      v-if="src"
      v-motion-pop-visible-once

    :src="src"
    :class="[!loaded ? '' : '', 'transition-all']"
    @load="loaded = true"
    class="h-full w-full transition-all duration-500 scale-120 group-hover:scale-100 object-cover "
  />

    </div>
    <span class="sr-only">Loading...</span>
  </div>
</template>



<script lang="ts" setup>
const props = defineProps<{
    index: number
  randomClass: string
  src: string
  imageDelay: number
}>()

const loaded = ref(false)

// 1) How long between each step
const BASE_DELAY_MS = 200

// 2) Deterministic, looping delay from 0→9
function getDelay(index: number) {
  return (index ) * BASE_DELAY_MS
}

function getRandomDelay(index: number) {
  
  const i = index % 1.5 * 200
  
  const j = index*100
  return i
}
function getRandomDelay2(index: number) {
  
  const i = index % 1.5 * 1600
  
  const j = index*100
  return i
}


const customize = (content: string, name: string, prefix: string, provider: string) => {

  return content
    .replace(/stroke-width="[^"]*"/g, `stroke-width="2"`) 
    
    // .replace(/stroke="[^"]*"/g, `stroke="#FF5733"`) // Change stroke color to red
    // .replace(/fill="[^"]*"/g, `fill="#FF5733"`) // Change fill color to red
    // .replace(/animation-duration="[^"]*"/g, `animation-duration="1s"`) // Change animation duration to 1s (for animated icons)
    // .replace(/opacity="[^"]*"/g, `opacity="0.8"`);// Change opacity to 0.8

    // Change stroke width to 2
}
// 1️⃣ Local, mutable copy of the incoming delay
const countdown = ref(props.imageDelay)
const c = ref(props.imageDelay)

// 2️⃣ Start ticking down as soon as we mount
onMounted(() => {
  const start = performance.now()

  function tick(now: number) {
    // elapsed ms
    const elapsed = now - start
    // remaining = initial - elapsed
    countdown.value = Math.floor(Math.max(0, props.imageDelay - elapsed) /1000)
    c.value = Math.floor(Math.max(0, props.imageDelay - elapsed))

    if (countdown.value > 0) {
      requestAnimationFrame(tick)
    }
  }

  requestAnimationFrame(tick)
})


</script>


<style scoped>
/* Base color for the shine */
--skeleton-shine-color: rgba(233, 236, 240, 1);

/* Container setup */
.skeleton {
  position: relative;
  overflow: hidden;          /* keep the shine inside rounded corners */
  border-radius: 8px;        /* smoother edges */
  background-color: #e9ecf0; /* fallback base color */
}

/* The moving shine */
.skeleton::before {
    border-radius: 1.3em;
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  will-change: background-position;

  /* more intermediate stops for a gentler fade */
  background-image: linear-gradient(
    135deg,
    rgba(233,236,240,0)   0%,
    rgba(233,236,240,0.4) 30%,
    rgba(233,236,240,1)   50%,
    rgba(233,236,240,0.4) 70%,
    rgba(233,236,240,0)   100%
  );
  background-size: 400% 400%;
  background-position: -200% center;
  animation: shimmer 2.8s infinite ease-in-out;
  opacity: 0.8;
}

/* Keyframes just slide the gradient */
@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}

@keyframes skeleton {
  0% {
    background-position: 200%;
  }

  to {
    background-position: -100%;

  }
}

.neumorph {
    transition: all 0.2s;
}
.neumorph:hover {
    scale: 0.95;
  background: #e0e0e0;
  /* heavier, softer shadows */
  box-shadow:
    12px 12px 32px rgba(0, 0, 0, 0.15),
   -12px -12px 32px rgba(255, 255, 255, 0.75);
  /* optional global blur if you want EVERYTHING a little soft-focus */
  /* filter: blur(1px); */
}


</style>
