<!-- components/sections/jadid.vue -->
<template>
    <div class="flex flex-col w-full h-auto gap-[236px] p-6 bg-[url('https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/frame-33.png')] bg-cover rounded-[25px]">
      <!-- Header section -->
      <div class="flex flex-row items-center  bg-[#daebd0]/100  rounded-[25px] border border-[#c2d3d1] p-3 px-6 w-fit">
        <img 
          src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/arrow-up.png" 
          alt="arrow" 
          class="w-6 h-6 cursor-pointer hover:opacity-80"
          @click="handleArrowClick"
        />
        <span class="text-black font-semibold text-base mr-2 font-['IRANSansX']">انواع تقویم رومیزی</span>
      </div>
  
      <!-- Calendar types list -->
      <div class="flex flex-col gap-[175px] items-center">
        <div 
          class="flex flex-row items-center rounded-[25px] border border-[#c2d3d1] p-3 px-6 cursor-pointer hover:bg-gray-50"
          @click="handleCalendarClick"
        >
          <img 
            src="https://dashboard.codeparrot.ai/api/image/Z8MAvVj1kitRpYP1/frame-32.png" 
            alt="calendar" 
            class="w-[192px] h-[21px]"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const handleArrowClick = () => {
    // Handle arrow click event
    console.log('Arrow clicked')
  }
  
  const handleCalendarClick = () => {
    // Handle calendar selection
    console.log('Calendar type selected')
  }
  </script>
  
  <style scoped>
  .font-['IRANSansX'] {
    font-family: 'IRANSansX', sans-serif;
  }
  </style>
  
  