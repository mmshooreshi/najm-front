<!-- pages/webp.vue -->
<template>
  <div class="p-4">
    <!-- <h1 class="text-2xl font-bold mb-4">Image‑Based Video Gallery</h1> -->
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(video, idx) in videoList"
        :key="idx"
        class="rounded-2xl overflow-hidden "
      >
        <img
          :src="hoverStates[idx] ? video.src : video.poster"
          preload="metadata"
          class="w-full h-auto bg-transparent transition-all"
          @mouseenter="hoverStates[idx] = true"
          @mouseleave="hoverStates[idx] = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const videoList = ref([])
const hoverStates = ref([])

onMounted(async () => {
  try {
    const res = await fetch('/videos/manifest.json')
    if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`)
    const files = await res.json()  // e.g. ["19.webp","20.webp",…]
    videoList.value = files.map((f, i) => {
      const num = f.replace('.webp','.avif')
      return {
        src:    `/videos/${f}`,               // animated WebP
        poster: `/videos/posters/${num}` // static AVIF
      }
    })
    // initialize hover flags
    hoverStates.value = videoList.value.map(() => false)
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
img {
  display: block;
  object-fit: cover;
  background-color: transparent; /* ensure any alpha shows through */
}
</style>
