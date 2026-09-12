<!-- components/rotatory.vue -->
<template>
    <button
      @click="openModal()"
      type="button"
      style="background-color: #014439 !important;"
      :aria-label="ariaLabel"
      class="rotatory-btn group relative flex items-center justify-center overflow-hidden rounded-full bg-najmgreen text-white transition-all duration-300 ease-in-out hover:bg-black hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl w-18 h-18 md:w-24 md:h-24 cursor-pointer"
    >
      <!-- Rotating text along a circular path -->
      <svg
      
        class="text-circle w-full h-full animSpin"
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
        <g class="outerConsul transform">
          <component :is="activeConsulText" />
        </g>
  
        <!-- Inner ConsulText rotated 180° -->
        <g class="innerConsul transform">
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

  const activeConsulText = computed(() => {
    if (language.value === 'EN') return ConsulTextEn
    if (language.value === 'AR') return ConsulTextAr
    return ConsulTextFa
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
/* Slow anti-clockwise spin */
.animSpin {
  animation: spinn 8s linear infinite;
  will-change: transform;
}
@keyframes spinn {
  to { transform: rotate(-360deg); }
}

/* Force RTL on SVG text */
.text-circle {
  direction: rtl;
  unicode-bidi: bidi-override;
}

/* Position both text groups around the 200×200 viewBox’s true center */
/* — no more media queries or pixel hacks — */
.outerConsul,
.innerConsul {
  /* center at (100,100) in your viewBox */
  transform-origin: 100px 100px;
}

.outerConsul {
  /* sit at 12 o’clock, then shrink to 70% */
  transform: rotate(0deg) translate(-5px, -44px) scale(0.7);
}

.innerConsul {
  /* flip upside-down at 6 o’clock, then shrink to 70% */
  transform: rotate(180deg) translate(-5px, -44px) scale(0.7);
}



</style>

  