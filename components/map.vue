<template>
    <div>
      <!-- Map Thumbnail -->
      <div  v-motion-pop-visible
        class=" relative mx-0 md:mx-8 md:my-4 h-[300px] max-h-[300px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-200"
        @click="openMap"
      >
        <MarkerIcon class="absolute top-[48%] left-[48%] z-10" />
        <!-- <MapboxMap 
          style="position: absolute; width: 100%; height: 100%;"
          map-id="<MAP_ID>"
          :options="{
            style: 'mapbox://styles/mmshooreshi/cm9xbga9n009p01sictvq5wgu',
            center: [51.306003, 35.6735325],
            zoom: 11
          }"
        /> -->
      </div>
  
      <!-- Fullscreen Map Modal -->
      <div
      v-if="isFullScreen"
      class="fixed inset-0 z-50 bg-white dark:bg-black h-screen flex flex-col"
      >
        <div class="flex justify-end p-4">
          <Icon
            name="mdi:close"
            class="text-3xl text-black cursor-pointer"
            @click="closeMap"
          />
        </div>
        <div    
        class="flex-1 h-[100vh] relative">
          <!-- <MapboxMap
            style="position: absolute; width: 100%; height: 100%;"
            map-id="<MAP_ID>"
            :options="{
              style: 'mapbox://styles/mmshooreshi/cm9xbga9n009p01sictvq5wgu',
              center: [51.306003, 35.6735325],
              zoom: 16
            }"
          /> -->
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import MarkerIcon from '~/assets/icons/marker-icon.svg'

  const isFullScreen = ref(false)
  
  const openMap = () => {
    isFullScreen.value = true
  }
  
  const closeMap = () => {
    isFullScreen.value = false
  }
  </script>

  <style scoped>
.cliplip{
  clip-path: inset(0px 0px 50px 0px);
}

  </style>
  