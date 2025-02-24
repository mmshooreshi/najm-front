<template>
    <div
      class="flex flex-col items-center gap-2 animate-pulse-alt" 
      :style="customStyle"
    >
      <!-- Text -->
      <p
        class="text-sm text-black text-nowrap" 
        :class="{ 'font-extrabold animate-pulse-alt': active, 'font-medium': !active }"
      >
        {{ text }}
      </p>
  
      <!-- Icon Wrapper -->
      <div
        class="relative flex items-center justify-center p-2 rounded-full  shadow-md transition-all duration-500"
        :class="{
          'bg-[#D3DAFE] p-6': active,
          'bg-[#EAFED3]': !active
        }"
      >
        <!-- If icon is an .svg path, use <img :src="icon" /> -->
        <component :is="icon" class="text-[#5A5A5A]  transition-all duration-500" :class="{'scale-150':active}" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    icon: any;
    text: string;
    active: boolean;
    customStyle?: Record<string, any>; // if you want to pass style from parent
  }>();
  </script>
  