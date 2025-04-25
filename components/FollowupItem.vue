<template>
    <div
      class="cursor-pointer flex flex-col items-center gap-2"
      :style="customStyle"
    >
      <!-- Text -->
      <p
        class="text-sm text-black text-nowrap transition-all"
        :class="{ 'font-extrabold': active || isHovered, 'font-medium': !active && !isHovered }"
      >
        {{ text }}
      </p>
  
      <!-- Icon Wrapper -->
      <div
        class="relative flex items-center justify-center p-2 rounded-full shadow-md transition-all duration-500"
        :class="{
          'bg-[#D3DAFE]/100 p-6': active || isHovered,
          'bg-[#EAFED3]': !active && !isHovered
        }"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <!-- If icon is an .svg path, use <img :src="icon" /> -->
        <component
          :is="icon"
          class="text-[#5A5A5A] transition-all duration-500"
          :class="{ 'scale-150': active || isHovered }"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const isHovered = ref(false);
  
  defineProps<{
    icon: any;
    text: string;
    active: boolean;
    customStyle?: Record<string, any>; // if you want to pass style from parent
  }>();
  </script>
  