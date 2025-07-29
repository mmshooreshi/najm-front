<!-- pages/webp2.vue -->
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Image‑Based Video Gallery</h1>
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      <div
        v-for="(item, idx) in videoList"
        :key="idx"
        :class="['rounded overflow-hidden shadow-lg p-2', bgClasses[idx % bgClasses.length]]"
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

// define a palette of pastel bg classes
const bgClasses = [
  'bg-pink-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-indigo-100',
  'bg-teal-100',
]

onMounted(async () => {
  try {
    const res   = await fetch('/videos/manifest.json')
    if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`)
    const files = await res.json()

    videoList.value = files.map((f, i) => {
      const num = f.replace('.webp','.avif')
      return {
        src:    `/videos/${f}`,               
        poster: `/videos/posters/${num}`      
      }
    })

    hoverStates.value = videoList.value.map(() => false)

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
  background-color: transparent;
}
</style>
