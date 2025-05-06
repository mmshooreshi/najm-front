<template>
    <div class="flex flex-row w-full overflow-scroll">
      <div
        v-for="pkg in packages"
        :key="pkg.id"
        class="relative min-w-[400px] max-w-[500px] min-h-[400px] m-2 rounded-3xl p-2 bg-red"
      >
        <h2 class="mb-4">{{ pkg.name }}</h2>
        <div
          v-for="item in pkg.items"
          :key="item.id"
          class="group absolute cursor-pointer  transition-transform hover:scale-110"
          :style="{
            // top: item.specs.top + 'px',
            left: item.specs.left + 'px',
            width: item.specs.width + 'px',
            height: item.specs.height + 'px',
            transform: `rotate(${item.specs.rotate}deg)`,
            zIndex: item.specs.zIndex
          }"
        >
        
          <img
            v-memotion-pop-visible="{ xstart: -100, ystart: 100, delay: item.id * 0.05, duration: 0.3 }"
            :src="item.image"
            :alt="item.name"
            class="w-full h-full object-contain"
          />
          <p class="invisible group-hover:visible absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
            {{ item.name }}  t:{{ item.specs.top}}  l:{{ item.specs.left}}  w:{{ item.specs.width}}  h:{{ item.specs.height}}  rot:{{ item.specs.rotate}}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { usePackages } from '@/composables/usePackages'
  
  const { packages } = usePackages()
  </script>
  