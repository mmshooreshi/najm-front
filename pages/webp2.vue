<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Image‑Based Video Gallery</h1>
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(item, idx) in videoList"
        :key="idx"
        class="rounded overflow-hidden shadow-lg"
      >
        <img
          :src="hoverStates[idx] ? item.src : item.poster"
          fetchpriority="high"
          loading="eager"
          class="w-full h-auto bg-transparent"
          @mouseenter="hoverStates[idx] = true"
          @mouseleave="hoverStates[idx] = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const videoList   = ref([])
const hoverStates = ref([])

onMounted(async () => {
  try {
    const res   = await fetch('/videos/manifest.json')
    if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`)
    const files = await res.json()  // e.g. ["19.webp","20.webp",…]
    
    videoList.value = files.map((f, i) => {
      const num = String(i + 1).padStart(2, '0')
      return {
        src:    `/videos/${f}`,               // animated WebP
        poster: `/videos/posters/${num}.avif` // static AVIF
      }
    })

    // initialize hover flags
    hoverStates.value = videoList.value.map(() => false)

    // **Preload every WebP** at high priority
    videoList.value.forEach(item => {
      const link = document.createElement('link')
      link.rel       = 'preload'
      link.as        = 'image'
      link.href      = item.src
      link.fetchpriority = 'high'
      document.head.appendChild(link)
    })

  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
img {
  display: block;
  object-fit: cover;
  background-color: transparent; /* preserve alpha */
}
</style>
