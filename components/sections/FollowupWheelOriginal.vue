<!-- components/sections/FollowupWheelOriginal.vue -->
<template>
    <div
      dir="rtl"
      class="max-w-screen text-d4 p-6 flex flex-col items-center  bg-[#CBCBFB]/100  rounded-3xl gap-6 pb-0 overflow-visible"
    >
      <!-- Title/description -->
      <div class="flex flex-col items-center gap-2">
        <h2 class="text-[20px] font-extrabold text-center">
          سفارش آسون، پیگیریِ آسون‌تر!
        </h2>
        <p class="text-sm text-center">
          وضعیت سفارشتو از لحظه‌ی ثبت تا تحویل روی یک تایم‌لاین دقیق ببین! هر مرحله که جلوتر بری، ما بهت اطلاع
          میدیم.
        </p>
      </div>
  
      <!-- Button -->
      <button
        class="hover:tracking-wide transition-all mx-auto mt-6 bg-white text-xs text-d4 font-semibold px-6 py-3 rounded-full"
      >
        پیگیری وضعیت سفارش
      </button>
  
      <!-- Main container -->
      <div class="w-full max-w-md relative mt-8">
        <img :src="contoursPath" alt="contours" class="w-full h-auto block" />
  
        <!-- The steps positioned on a circle -->
        <div class="circle-container">
          <StepItem
            v-for="(step, index) in steps"
            :key="index"
            :icon="step.icon"
            :text="step.text"
            :style="stepStyle(index)"
            :active=false
            class="step"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import StepItem from '@/components/FollowupItem.vue';
  
  const contoursPath = '/images/sections/followup/contours.svg';
  
  import orderIcon from '~/assets/icons/FollowUp/order-step-icon.svg';
  import designIcon from '~/assets/icons/FollowUp/design-step-icon.svg';
  import productionIcon from '~/assets/icons/FollowUp/production-step-icon.svg';
  import warehouseIcon from '~/assets/icons/FollowUp/warehouse-step-icon.svg';
  import truckIcon from '~/assets/icons/FollowUp/truck-step-icon.svg';
  import supportIcon from '~/assets/icons/FollowUp/support-step-icon.svg';
  
  const steps = [
    { icon: orderIcon, text: 'ثبت سفارش' },
    { icon: designIcon, text: 'طراحی' },
    { icon: productionIcon, text: 'تولید' },
    { icon: warehouseIcon, text: 'انبار' },
    { icon: truckIcon, text: 'ارسال' },
    { icon: supportIcon, text: 'پشتیبانی' },
  ];
  
  const stepCount = steps.length;
  const radius = 240; // Radius in pixels (adjust to fit your container)
  const rotation = ref(0); // This will hold our continuously updated angle
  
  let animationFrame: number;
  const speed = 0.5; // Radians per second
  
  onMounted(() => {
    let lastTimestamp = performance.now();
    const update = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000; // Convert to seconds
      lastTimestamp = timestamp;
      rotation.value += speed * delta;
      animationFrame = requestAnimationFrame(update);
    };
    animationFrame = requestAnimationFrame(update);
  });
  
  onUnmounted(() => {
    cancelAnimationFrame(animationFrame);
  });
  
  /**
   * Computes the style for each step so they follow the circle.
   * Each step is positioned at an angle equal to:
   *   (angle per step * index) + (continuous rotation offset)
   */
  function stepStyle(index: number) {
    const anglePerStep = (2 * Math.PI) / stepCount;
    const angle = anglePerStep * index + rotation.value;
    return {
      position: 'absolute',
      left: `calc(50% + ${Math.cos(angle) * radius}px)`,
      top: `calc(50% - ${Math.sin(angle) * radius}px)`,
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.5s ease',
    };
  }
  </script>
  
  <style scoped>
  .circle-container {
    position: absolute;
    width: 0px;
    height: 0px;
    background-color: red;
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .step {
    transition: all 0.5s ease;
  }
  </style>
  