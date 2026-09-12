<!-- components/rotatory.vue -->
<template>
  <button
    @click="openModal()"
    type="button"
    style="background-color: #014439 !important;"
    :aria-label="ariaLabel"
    class="rotatory-btn group relative flex items-center justify-center overflow-hidden rounded-full bg-najmgreen text-white transition-all duration-300 ease-in-out hover:bg-black hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl w-18 h-18 md:w-24 md:h-24 cursor-pointer"
  >
    <!-- Rotating text along a circular path (Dynamic rotation class applied here) -->
    <svg
      :class="['text-circle w-full h-full', spinDirectionClass]"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path
          id="circlePath"
          d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
        />
      </defs>

      <!-- Outer ConsulText -->
      <g class="outerConsul" :style="outerStyle">
        <component :is="activeConsulText" />
      </g>

      <!-- Inner ConsulText rotated 180° -->
      <g class="innerConsul" :style="innerStyle">
        <component :is="activeConsulText" />
      </g>
    </svg>

    <!-- Icon container -->
    <div
      class="absolute flex items-center justify-center overflow-hidden bg-white text-najmgreen rounded-full w-8 h-8 md:w-10 md:h-10"
    >
      <!-- Send icon -->
      <svg
        class="send absolute w-[12px] h-[14px] md:w-[14px] md:h-[16px] transform transition-transform duration-300 ease-in-out group-hover:-translate-x-[150%] group-hover:-translate-y-[150%] -scale-x-100"
        viewBox="0 0 14 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
          fill="currentColor"
        />
      </svg>
      <!-- Copy icon -->
      <svg
        class="copy absolute w-[12px] h-[14px] md:w-[14px] md:h-[16px] transform translate-x-[150%] translate-y-[150%] transition-transform duration-300 ease-in-out delay-100 group-hover:translate-x-0 group-hover:translate-y-0 -scale-x-100"
        viewBox="0 0 14 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
          fill="black"
        />
      </svg>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ConsulTextFa from '~/assets/svg/ConsulText.svg'
import ConsulTextEn from '~/assets/svg/ConsulText-en.svg'
import ConsulTextAr from '~/assets/svg/ConsulText-ar.svg'
import { useConsultation } from '~/composables/useConsultation'
import { useLocale } from '~/composables/useLocale'

const { openModal } = useConsultation()
const { language } = useLocale()

// Define the TypeScript type for your calibration object
type CalibrationConfig = {
  scaleX: number
  scaleY: number
  x: number
  y: number
  rotateOffset: number
}

// Map the calibrations to a string key so TS accepts language.value
const calibrations: Record<string, CalibrationConfig> = {
  FA: { scaleX: 0.7, scaleY: 0.7, x: -5, y: -44, rotateOffset: 0 },
  EN: { scaleX: 0.8, scaleY: 0.76, x: -1, y: -42, rotateOffset: 0 },
  AR: { scaleX: 0.8, scaleY: 0.9, x: 0, y: -48, rotateOffset: 0 }
}

const activeConsulText = computed(() => {
  if (language.value === 'EN') return ConsulTextEn
  if (language.value === 'AR') return ConsulTextAr
  return ConsulTextFa
})

// Dynamically select the rotation class based on the language
const spinDirectionClass = computed(() => {
  return language.value === 'EN' ? 'animSpinCw' : 'animSpinCcw'
})

const currentCalibration = computed(() => {
  return calibrations[language.value] || calibrations['FA']
})

const outerStyle = computed(() => {
  const { scaleX, scaleY, x, y, rotateOffset } = currentCalibration.value
  return {
    transform: `rotate(${0 + rotateOffset}deg) translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`
  }
})

const innerStyle = computed(() => {
  const { scaleX, scaleY, x, y, rotateOffset } = currentCalibration.value
  return {
    transform: `rotate(${180 + rotateOffset}deg) translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`
  }
})

const ariaLabel = computed(() => {
  if (language.value === 'EN') return 'Free Consultation & Price Quote'
  if (language.value === 'AR') return 'استشارة مجانية واستعلام عن الأسعار'
  return 'مشاوره رایگان و استعلام قیمت'
})
</script>

<style scoped>
.rotatory-btn {
  background-color: #014439 !important;
}

/* Anti-clockwise spin for FA/AR */
.animSpinCcw {
  animation: spinCcw 8s linear infinite;
  will-change: transform;
}
@keyframes spinCcw {
  to { transform: rotate(-360deg); }
}

/* Clockwise spin for EN */
.animSpinCw {
  animation: spinCw 8s linear infinite;
  will-change: transform;
}
@keyframes spinCw {
  to { transform: rotate(360deg); }
}

/* Force RTL on SVG text */
.text-circle {
  direction: rtl;
  unicode-bidi: bidi-override;
}

/* Position both text groups around the 200×200 viewBox’s true center */
.outerConsul,
.innerConsul {
  /* center at (100,100) in your viewBox */
  transform-origin: 100px 100px;
  /* Transitions make tweaking values in DevTools look smooth */
  transition: transform 0.3s ease; 
}
</style>