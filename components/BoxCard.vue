<template>
  <div class="relative p-6 py-0 w-screen max-w-screen scrollbar-hide overflow-visible px-0">
    <ClientOnly>
      <div class="mx-0 px-0 overflow-visible">
        <swiper-container
          ref="containerRefN"
          :init="true"
          :modules="[Autoplay]"
          :slides-per-view="'auto'"
          :space-between="16"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
        >
          <swiper-slide
            v-for="(box, index) in boxes"
            :key="index"
            class="w-64 mx-0 my-0"
            @click="selectedBox = index"
          >
            <div
              class="w-64 h-72 flex flex-col items-start justify-end bg-opacity-70 rounded-3xl px-4 cursor-pointer transition snap-center relative"
              :class="{
                'bg-yellow-300': selectedBox === index,
                'bg-yellow-200 border-transparent': selectedBox !== index
              }"
            >
              <!-- Background Image -->
              <img
                :src="box.image"
                :alt="box.name"
                class="absolute inset-0 w-full h-full object-cover rounded-3xl"
              />

              <!-- Overlay -->
              <div class="absolute inset-0 bg-black bg-opacity-20 rounded-3xl"></div>

              <!-- Display Button -->
              <button class="relative bottom-4 bg-white px-6 py-3 rounded-3xl text-sm shadow-md z-10">
                نمایش ابعاد
              </button>
            </div>

            <!-- Box Name -->
            <h3 class="text-base text-d4 font-bold mt-4">{{ box.name }}</h3>
            <p dir="rtl" class="text-sm text-d4 text-[#2F3136]">۵۰۰+ عدد</p>
          </swiper-slide>
          <swiper-slide class="w-12 mx-0 my-0">
          </swiper-slide>
        </swiper-container>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";

const containerRefN = ref(null);
const selectedBox = ref<number | null>(1);

// Define the Swiper instance
const boxes = ref([
  { name: "باکس قفلی", image: "/images/sections/swiperMain/P1.jpg" },
  { name: "باکس کیبوردی", image: "/images/sections/swiperMain/P2.jpg" },
  { name: "باکس دسته‌دار", image: "/images/sections/swiperMain/P3.jpg" },
  { name: "باکس ساکی", image: "/images/sections/swiperMain/P4.jpg" },
  { name: "باکس هدیه", image: "/images/sections/swiperMain/P5.jpg" },
  { name: "باکس کوچک", image: "/images/sections/swiperMain/P6.jpg" }
]);

onMounted(() => {
  console.log("Swiper initialized");
});
</script>

<style scoped>
/* Swiper container */
.swiper-container {
  overflow: visible;
}

/* Snapping effect */
.swiper-slide {
  scroll-snap-align: center;
  display: flex;
  justify-content: center;
  position: relative;
}

/* Smooth hover effect */
.swiper-slide:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease-in-out;
}

/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Pagination dots */
.swiper-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>
