<script lang="ts" setup>
import Imagez from '@/components/Base/BaseImage.vue'
import BaseAnimatedImage from '@/components/Base/BaseAnimatedImage.vue'
import BaseSkeleton from '@/components/Base/BaseSkeleton.vue'
import BaseSkeleton2 from '@/components/Base/BaseSkeleton2.vue'


const src = ref("https://avatars.githubusercontent.com/u/11247099?s=160&v=4")
const loaded = ref(false)


const j = Array.from({ length: 48 }, (_, i) => i)

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
const imageSrcs = ref<string[]>(Array(j.length).fill(''))
const imageDelays = ref<number[]>(Array(j.length).fill(0))

// Execute logic when the component is mounted
onMounted(() => {
  j.forEach((_, i) => {
    const delay = i*1000 + Math.random() * 300 // between 10 and 500
    imageDelays.value[i] = delay
    setTimeout(() => {
      imageSrcs.value[i] ='/images/products/test.png'
    }, delay-1000)
  })
})


</script>

<template>



  <div class="flex flex-wrap gap-0">
    <span class="absolute text-gray/50 text-xs top-0">  {{ randomClass }}</span>


    <div
      class="w-full flex-1 p-2"
      v-for="(i, index) in j"
      :key="index"
      
    >
      <BaseSkeleton v-if="i%2" :imageDelay="imageDelays[index]"  :src="imageSrcs[index]"  :index="index" :randomClass="randomClass" />

      <BaseSkeleton2 v-else  :imageDelay="imageDelays[index]"  :src="imageSrcs[index]"  :index="index" :randomClass="randomClass" />

    </div>
  </div>

</template>

<style lang="scss" scoped>

</style>



