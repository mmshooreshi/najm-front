<template>
    <div
      dir="rtl"
      class="max-w-screen text-d4 p-6 flex flex-col items-center bg-[#CBCBFB] rounded-3xl gap-6 pb-0 overflow-visible"
    >
      <!-- Title/description -->
      <div class="flex flex-col items-center gap-2">
        <h2 class="text-[20px] font-extrabold text-center">
          سفارش آسون، پیگیریِ آسون‌تر!
        </h2>
        <p class="text-sm text-center">
          وضعیت سفارشتو از لحظه‌ی ثبت تا تحویل روی یک تایم‌لاین دقیق ببین! هر مرحله که جلوتر بری، ما بهت اطلاع میدیم.
        </p>
      </div>
  
      <!-- Button -->
      <button
        class="hover:tracking-wide transition-all mx-auto mt-6 bg-white text-xs text-d4 font-semibold px-6 py-3 rounded-full"
      >
        پیگیری وضعیت سفارش
      </button>
  
      <!-- Circular Path Container (300x300) -->
      <div
        class="relative mt-8 flex justify-center items-center"
        style="width: 300px; height: 300px"
      >
        <!-- SVG Circle (ID = circlePath) -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 300 300"
          preserveAspectRatio="xMidYMid meet"
        >
          <!-- Circle path: center(150,150), radius=100 -->
          <path
            id="circlePath"
            fill="none"
            stroke="#ccc"
            stroke-width="1"
            d="
              M150,150
              m -100,0
              a 100,100 0 1,1 200,0
              a 100,100 0 1,1 -200,0
            "
          />
        </svg>
  
        <!-- Steps on the circle -->
        <div
          v-for="(step, index) in steps"
          :key="index"
          ref="stepRefs"
          class="absolute w-10 h-10 rounded-full bg-white shadow
                 flex items-center justify-center text-[10px] font-semibold
                 transition-all duration-300"
          :class="{
            'scale-110 opacity-100': index === activeIndex,
            'scale-100 opacity-50': index !== activeIndex
          }"
        >
          <!-- Pass active prop, if needed, or just show icon/text -->
          <FollowupItem
            :icon="step.icon"
            :text="step.text"
            :active="index === activeIndex"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import gsap from 'gsap'
  import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
  
  // Register MotionPathPlugin once
  gsap.registerPlugin(MotionPathPlugin)
  
  // Example Step Data
  import FollowupItem from '@/components/FollowupItem.vue'
  import orderIcon from '~/assets/icons/FollowUp/order-step-icon.svg'
  import designIcon from '~/assets/icons/FollowUp/design-step-icon.svg'
  import productionIcon from '~/assets/icons/FollowUp/production-step-icon.svg'
  import warehouseIcon from '~/assets/icons/FollowUp/warehouse-step-icon.svg'
  import truckIcon from '~/assets/icons/FollowUp/truck-step-icon.svg'
  import supportIcon from '~/assets/icons/FollowUp/support-step-icon.svg'
  
  const steps = [
    { icon: orderIcon, text: 'ثبت سفارش' },
    { icon: designIcon, text: 'طراحی' },
  ]
  
  // Refs to each step DOM element
  const stepRefs = ref([])
  
  // Each step’s progress along the circle (0..1)
  const progresses = steps.map((_, i) => i / steps.length)
  
  // Which step is "on top"
  const activeIndex = ref(0)
  
  /**
   * Places each step at its initial offset (no animation).
   */
  function initPositions() {
    stepRefs.value.forEach((stepEl, i) => {
      gsap.set(stepEl, {
        motionPath: {
          path: '#circlePath',
          align: '#circlePath',
          alignOrigin: [0.5, 0.5],
          start: progresses[i],
        },
      })
    })
    updateActiveIndex()
  }
  
  /**
   * Moves each step forward by 1 segment (1 / steps.length) with a short animation,
   * then updates whichever step is nearest to the top (offset ~ 0.25).
   */
  function moveStepsForward() {
    stepRefs.value.forEach((stepEl, i) => {
      const oldOffset = progresses[i]
      const newOffset = (oldOffset + 1 / steps.length) % 1
  
      gsap.to(stepEl, {
        duration: 0.5,
        ease: 'power1.out',
        motionPath: {
          path: '#circlePath',
          align: '#circlePath',
          alignOrigin: [0.5, 0.5],
          start: oldOffset,
          end: newOffset,
        },
        // When all animations are done, update active item
        onComplete: () => {
          // If this is the last step, update the 'activeIndex'
          if (i === steps.length - 1) {
            updateActiveIndex()
          }
        },
      })
  
      progresses[i] = newOffset
    })
  }
  
  /**
   * Figures out which offset is closest to 0.25 (the top of this circle).
   */
  function updateActiveIndex() {
    let bestDist = 999
    let bestI = 0
    progresses.forEach((p, i) => {
      // distance from 0.25
      let dist = Math.abs(p - 0.25)
      // handle wrap-around
      if (dist > 0.5) dist = 1 - dist
      if (dist < bestDist) {
        bestDist = dist
        bestI = i
      }
    })
    activeIndex.value = bestI
  }
  
  // On mount, place steps, then move+stop every 1 second
  onMounted(() => {
    initPositions()
  
    // Step forward every 1 second
    setInterval(() => {
      moveStepsForward()
    }, 1000)
  })
  </script>
  