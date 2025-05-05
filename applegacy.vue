<template>
  <div class="overflow-visible">
    <NuxtLayout >

      <NuxtPage :page-key="route.name" />

      </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import '@unocss/reset/normalize.css'
import '@unocss/reset/tailwind.css'

import { onMounted } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
const route = useRoute()
onMounted(() => {
  useGSAP().registerPlugin(ScrollTrigger)
})




// const { $lenis } = useNuxtApp()

// function scrollToTop () {
//   $lenis.scrollTo(0, { duration: 1 })
// }

</script>


<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}


.swiper-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}


.swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.7);
  opacity: 100%;
  border-radius: 50%;

  /* Use flexbox and inline-block to avoid shifting */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  transition: 
    width 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
    border-radius 0.4s ease,
    background-color 0.4s ease,
    margin 0.4s ease,
    transform 0.2s ease;
}

.swiper-pagination-bullet:hover {
  transform: scale(1.4);
  margin: 0 6px !important;

}

.swiper-pagination-bullet-active {
  width: 20px;
  background: rgb(102, 186, 88);
  border-radius: 10px;
  margin: 0 1px !important;

  /* Ensures the expansion is center-based */
  flex-grow: 0;
}



</style>