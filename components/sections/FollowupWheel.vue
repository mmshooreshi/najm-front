<template>
    <!-- Container is always in the DOM, but initially hidden with opacity-0 -->
    <div
    dir="rtl"
      :class="{'opacity-0': !ready}"
      class="max-w-screen mx-auto text-d4 p-6 flex flex-col items-center bg-[#CBCBFB] rounded-3xl gap-6 pb-0 overflow-hidden transition-opacity duration-300"
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
      <button class="hover:tracking-wide transition-all mx-auto mt-0 bg-white text-xs text-d4 font-semibold px-6 py-3 rounded-full">
        پیگیری وضعیت سفارش
      </button>
  
      <!-- Main container -->
      <div class="relative mt-16 w-full max-w-md">
        <!-- Inject raw SVG -->
        <div v-html="circlePathRaw" class="absolute w-full scale-110 opacity-0"></div>
        <img :src="contoursPath" alt="contours" class="w-full h-auto block" />
  
        <!-- Each step is positioned along the circle -->
        <div
          v-for="(step, idx) in steps"
          :key="idx"
          ref="stepElements"
          class="absolute w-10 h-10 flex items-center justify-center"
          style="top:50%; left:50%; transform: translate(-50%, -50%)"
        >
          <FollowupItem
            :icon="step.icon"
            :text="step.text"
            :active="steps.length - activeIndex - 1 === idx"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, nextTick, onMounted } from 'vue';
  import FollowupItem from '@/components/FollowupItem.vue';
  import circlePathRaw from '~/assets/svg/circlePath.svg?raw';
  
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
  
  const stepElements = ref([]);
  const activeIndex = ref(0);
  const ready = ref(false);
  
  const duration = 2;
  let offset = 1;
  
  function animate() {
    // Update activeIndex with a 500ms delay relative to animation start
    setTimeout(() => {
      activeIndex.value = (activeIndex.value + 1) % steps.length;
    }, 500);
  
    stepElements.value.forEach((el, i) => {
      useGSAP().to(el, {
        duration,
        ease: 'expo.inOut',
        motionPath: {
          path: '#circlePath',
          align: '#circlePath',
          alignOrigin: [0.5, 0.5],
          start: (offset + i) / steps.length,
          end: (offset + i + 1) / steps.length,
        },
      });
    });
  
    offset = (offset + 1) % steps.length;
    setTimeout(animate, duration * 1000);
  }
  
  onMounted(async () => {
    // Wait for the DOM to update so that stepElements are available
    await nextTick();
  
    // Set initial positions for each step element immediately with GSAP
    stepElements.value.forEach((el, i) => {
      useGSAP().set(el, {
        motionPath: {
          path: '#circlePath',
          align: '#circlePath',
          alignOrigin: [0.5, 0.5],
          start: i / steps.length,
        },
      });
    });
  
    // Once GSAP has positioned everything, reveal the container
    ready.value = true;
    animate();
  });
  </script>
  
  <style scoped>
  .opacity-0 {
    opacity: 0;
  }
  </style>
  