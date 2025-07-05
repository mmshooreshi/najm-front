<!-- pages/use.vue -->
<script lang="ts" setup>
import Imagez from '@/components/Base/BaseImage.vue'
import BaseAnimatedImage from '@/components/Base/BaseAnimatedImage.vue'
import BaseSkeleton from '@/components/Base/BaseSkeleton.vue'
import HoverMe from '@/components/Base/HoverMe.vue'
import Delay from '@/components/Base/Delay.vue'
import Delay2 from '@/components/Base/Delay2.vue'


const src = ref("https://avatars.githubusercontent.com/u/11247099?s=160&v=4")
const loaded = ref(false)


const j = Array.from({ length: 18 }, (_, i) => i)

const animationClasses = [
  'animated-bounce',
  'animated-flash',
  'animated-pulse',
  'animated-rubber-band',
  'animated-shake-x',
  'animated-shake-y',
  'animated-head-shake',
  'animated-swing',
  'animated-tada',
  'animated-wobble',
  'animated-jello',
  'animated-heart-beat',
  'animated-back-in-down',
  'animated-back-in-left',
  'animated-back-in-right',
  'animated-back-in-up',
  'animated-back-out-down',
  'animated-back-out-left',
  'animated-back-out-right',
  'animated-back-out-up',
  'animated-bounce-in'
]

function getRandomClass() {
  const i = Math.floor(Math.random() * animationClasses.length)
  return `animated ${animationClasses[i]}`
}

const randomClass = ref<string>('');

// Execute logic when the component is mounted
onMounted(() => {
  // randomClass.value = getRandomClass();
  randomClass.value = '';

});

</script>

<template>


  <Delay/>

<span class="absolute text-gray/50 text-xs top-0">  {{ randomClass }}</span>

<HoverMe/>
    <!-- <Delay2/> -->

  <div class="flex flex-wrap gap-0">


    <div
      class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-2"
      v-for="(i, index) in j"
      :key="index"
    >
      <!-- <BaseSkeleton :index="index" :randomClass="randomClass" /> -->
    </div>
  </div>

</template>

<style lang="scss" scoped>

</style>



