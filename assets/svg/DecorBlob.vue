<!-- components/DecorBlobSvg.vue -->
<template>
  <svg
    width="63"
    height="56"
    viewBox="0 0 63 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="w-full h-14 -mt-2 mr-24"
  >
    <!-- Bubble -------------------------------------------------------- -->
    <path
      class="heartbeat fill-primary"
      d="M1.75253 22.9091C0.784635 20.3229 2.09656 17.4417 4.6828 16.4738L29.9699 7.01011C40.3149 3.13853 51.8397 8.38623 55.7113 18.7312C59.5829 29.0762 54.3351 40.6009 43.9902 44.4725L37.4343 46.9261C24.5031 51.7656 10.0971 45.2059 5.2576 32.2747L1.75253 22.9091Z"
    />

    <!-- Dots ----------------------------------------------------------- -->
    <rect
      v-for="(dot, i) in dots"
      :key="i"
      class="apple-dot fill-white"
      :x="dot.x - 1"
      :y="dot.y - 3"
      width="4"
      height="4"
      rx="2"
      :transform="`rotate(${rotation} ${dot.x} ${dot.y})`"
      :style="{ animationDelay: `${dot.delay}ms` }"
    />
  </svg>
</template>

<script setup>
/* Rotation of the baseline the dots sit on */
const rotation = -20

/* Dot positions + stagger (0 / 200 / 400 ms) */
const dots = [
  { x: 21, y: 29, delay:   0 },
  { x: 28, y: 26, delay: 200 },
  { x: 36, y: 23, delay: 400 }
]
</script>

<style scoped>
/* ----------------------------------------------------- */
/*  Apple‑style typing dots                              */
/* ----------------------------------------------------- */
@keyframes applePulse {
  0%, 60%, 100% { opacity: 0.3; transform: scale(0.75); }
  30%           { opacity: 1;   transform: scale(1);    }
}

.apple-dot {
  /* default look BEFORE animation starts (fixes “untidy” flash) */
  opacity: 0.3;
  transform: scale(0.75);

  transform-box: fill-box;
  transform-origin: center;

  animation: applePulse 1.2s ease-in-out infinite;
  animation-fill-mode: both;          /* <= keeps first keyframe during delay */
  will-change: transform, opacity;
}

/* ----------------------------------------------------- */
/*  Bubble heartbeat                                     */
/* ----------------------------------------------------- */
@keyframes heartbeat {
  0%, 100% { transform: scale(1);   }
  50%      { transform: scale(1.05); }
}

.heartbeat {
  transform-box: fill-box;
  transform-origin: center;

  /* locked base state so blob never flashes */
  transform: scale(1);

  animation: heartbeat 2.4s ease-in-out infinite;
  animation-fill-mode: both;
  will-change: transform;
}

/* Tailwind helper for the blob colour (swap to match theme) */
.fill-primary { fill: #014439; }
</style>
