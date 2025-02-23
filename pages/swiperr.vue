<script setup lang="ts">
import { useSwiper } from '#imports';

const slides = ref(Array.from({ length: 5 }, (_, i) => i + 1));
const swiperRef = ref(null);

onMounted(() => {
  useSwiper(swiperRef, {
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
  });
});
</script>

<template>
  <main>
    <ClientOnly>
      <swiper-container ref="swiperRef" class="swiper" :loop="true" :autoplay="{ delay: 2000, disableOnInteraction: false }">
        <swiper-slide v-for="slide in slides" :key="slide" class="slide">
          {{ slide }}
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </main>
</template>

<style>
.swiper {
  width: 300px;
  height: 200px;
}

.slide {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  background: #007bff;
  color: white;
}
</style>
