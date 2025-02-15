<template>
  <!-- Wrap everything in a relative container -->
  <div class="relative bg-gray/10 min-h-screen">
    <!-- SVG Background Gradient -->
    <svg
      class="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 616 613"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_587_4633)">
        <g clip-path="url(#paint0_angular_587_4633_clip_path)" data-figma-skip-parse="true">
          <g transform="matrix(-0.24931 -0.129803 0.0895757 -0.172046 330.702 263.87)">
            <foreignObject x="-1381.25" y="-1381.25" width="2762.5" height="2762.5">
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style="background: conic-gradient(from 90deg, rgba(88, 76, 198, 1) 0deg, rgba(145, 99, 224, 1) 178.2deg, rgba(245, 193, 121, 1) 360deg); width: 100%; height: 100%; opacity: 0.2"
              ></div>
            </foreignObject>
          </g>
        </g>
        <path
          d="M504.133 227.009C516.309 235.053 522.217 249.808 518.956 264.032L467.406 488.904C463.703 505.056 449.18 516.398 432.612 516.077L229.554 512.136L102.468 321.403C93.1703 307.448 95.0763 288.859 107.013 277.081L282.242 104.184C290.652 95.8862 303.723 94.6085 313.581 101.121L504.133 227.009Z"
          data-figma-gradient-fill='{"type":"GRADIENT_ANGULAR","stops":[{"color":{"r":0.3467,"g":0.2987,"b":0.7792,"a":1.0},"position":0.0},{"color":{"r":0.5706,"g":0.3920,"b":0.8792,"a":1.0},"position":0.495},{"color":{"r":0.9625,"g":0.7603,"b":0.4772,"a":1.0},"position":1.0}]}'
        />
      </g>
      <defs>
        <filter
          id="filter0_f_587_4633"
          x="0.59375"
          y="0.979736"
          width="615.248"
          height="611.103"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="48" result="effect1_foregroundBlur_587_4633" />
        </filter>
        <clipPath id="paint0_angular_587_4633_clip_path">
          <path
            d="M504.133 227.009C516.309 235.053 522.217 249.808 518.956 264.032L467.406 488.904C463.703 505.056 449.18 516.398 432.612 516.077L229.554 512.136L102.468 321.403C93.1703 307.448 95.0763 288.859 107.013 277.081L282.242 104.184C290.652 95.8862 303.723 94.6085 313.581 101.121L504.133 227.009Z"
          />
        </clipPath>
      </defs>
    </svg>

    <!-- Your Main Content (positioned above the background) -->
    <div class="mx-4 md:mx-8 2xl:mx-28 relative">
      <Header />
      <!-- Header Container (Frame 277 + 216 + 285 merged) -->
      <div
        class="absolute z-[1] flex flex-col items-center gap-8 rounded-bl-[25px] rounded-tl-[35px] rounded-tr-[35px] rounded-br-[35px] backdrop-blur-sm"
        style="left:16px; right:16px; top:68px; padding:64px 24px;"
      >
        <!-- Header Text -->
        <div class="w-[343px] h-[138px] text-center font-IRANSansX font-bold text-[35px] leading-[46px] text-black">
          یه راهکار خلاقانه برای چاپ و بسته‌بندی مورد نیاز شما
        </div>
        <!-- Floating Images -->
        <ImagesFloating />
      </div>

      <!-- Grid Layout -->
      <div class="grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12 h-screen">
        <div v-for="n in columns" :key="n" class="bg-red-200/0 text-center h-full">
          <!-- Content for column {{ n }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import Header from '~/components/Header.vue'
import ImagesFloating from '~/components/ImagesFloating.vue'

const { width } = useWindowSize()
const columns = computed(() => (width.value >= 1024 ? 12 : width.value >= 768 ? 8 : 4))
</script>
