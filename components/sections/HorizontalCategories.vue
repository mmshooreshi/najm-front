<!-- components/sections/HorizontalCategories.vue -->
<template>
    <div dir="rtl" class="flex flex-col items-start mt-6 py-6 w-screen max-w-screen overflow-x-auto absolute scrollbar-hide  -mx-8 md:mx-0 md:px-8  -translate-x-4 md:translate-x-0">
      <!-- Scrollable Container -->
      <div class="flex overflow-visible w-full whitespace-nowrap w-max px-0 scrollbar-hide gap-1">
        <button 
          v-for="(item, index) in categories" 
          :key="index" 
          class="transition-all flex tex-demibold text-d4 text-xs justify-center items-center px-4 py-4 border border-[#C2D3D1] bg-white/50 rounded-full min-w-[60px] cursor-pointer hover:bg-gray-200 transition"
          :class="{ 'font-bold !bg-gray/20': categoryStore.selectedCategory === item }"
          @click="categoryStore.setCategory(item)"

        >
          {{ item }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useCategoryStore } from "@/store/category";

  // Define reactive state
  const selectedCategory = ref<string>("صنعت،تکنولوژی و اکوسیستم");
  const categories = ref<string[]>([
    "همه",
    "غذا، نوشیدنی و رستوران",
    "آرایشی و بهداشتی",
    "پزشکی و دارویی",
    "صنعت،تکنولوژی و اکوسیستم",
    "جواهرات و زیورآلات",
    "فناوری و الکترونیک",
    "هدیه و مناسبتی",
    "بازاریابی و عمومی"
  ]);
  const categoryStore = useCategoryStore();

  </script>
  
  <style scoped>
 

  .scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

  </style>
  