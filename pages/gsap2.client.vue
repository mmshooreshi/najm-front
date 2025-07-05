<!-- pages/gsap2.client.vue -->
<template>
  <div dir="rtl" class="max-w-screen text-d4 p-6 flex flex-col items-center  bg-[#CBCBFB]/100  rounded-3xl gap-6 pb-0 overflow-visible">
    <h2 class="text-[20px] font-extrabold text-center">سفارش آسون، پیگیریِ آسون‌تر!</h2>
    <p class="text-sm text-center">
      وضعیت سفارشتو از لحظه‌ی ثبت تا تحویل روی یک تایم‌لاین دقیق ببین! هر مرحله که جلوتر بری، ما بهت اطلاع میدیم.
    </p>
    <button class="hover:tracking-wide transition bg-white text-xs text-d4 font-semibold px-6 py-3 rounded-full">
      پیگیری وضعیت سفارش
    </button>

    <div class="relative mt-8 w-full bg-red-400" >
      <!-- inject raw svg here -->
      <div v-html="circlePathRaw"></div>

      <div
        v-for="(step, idx) in steps"
        :key="idx"
        ref="stepElements"
        class="absolute w-10 h-10 flex items-center justify-center"
        style="top:50%; left:50%; transform: translate(-50%, -50%)"
      >
        <FollowupItem :icon="step.icon" :text="step.text" :active="steps.length - activeIndex - 1 === idx" />
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue and Nuxt imports


// Import raw SVG markup explicitly (important for correct DOM injection)
import circlePathRaw from '~/assets/svg/circlePath.svg?raw'

// Carefully import icons
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
  { icon: productionIcon, text: 'تولید' },
  { icon: warehouseIcon, text: 'انبار' },
  { icon: truckIcon, text: 'ارسال' },
  { icon: supportIcon, text: 'پشتیبانی' },
]

const stepElements = ref([])
const activeIndex = ref(0)

const duration = 2
let offset = 3

function animate() {
  activeIndex.value = (activeIndex.value + 1) % steps.length

  stepElements.value.forEach((el, i) => {
    useGSAP().to(el, {
     duration,
     ease: 'expo.inOut',
     motionPath: {
       path: '#circlePath',
       align: '#circlePath', 
       alignOrigin: [0.5, 0.5], // CRITICAL FOR PROPER CENTER ALIGNMENT
       start: (offset + i) / steps.length,
       end: (offset + i + 1) / steps.length,
     },
   })
  })

  offset = (offset + 1) % steps.length
  setTimeout(animate, duration * 1000)
}

onMounted(async () => {
  await nextTick()

  stepElements.value.forEach((el, i) => {
    useGSAP().set(el, {
     motionPath: {
       path: '#circlePath',
       align: '#circlePath',
       alignOrigin: [0.5, 0.5], // THIS FIXES IT → aligns element center to path
       start: i / steps.length
     }
   })  })

  animate()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn&display=swap');

* {
  font-family: 'Vazirmatn', sans-serif;
}

/* Styling for active state if needed */
.active {
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>