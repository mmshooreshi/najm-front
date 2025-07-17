<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps<{
  path?: string
  playOn?: 'auto' | 'hover' | 'click'
  noise?: boolean
  colorFilter?: string
  gradient?: string
  alt?: string
}>()

const basePath     = computed(() => (props.path ?? 'media/01/avif-big').replace(/\/?$/, '/'))
const playMode     = computed(() => props.playOn ?? 'auto')
const useNoise     = computed(() => props.noise !== false)
const filterStyles = computed(() => props.colorFilter ?? '')
const gradientCSS  = computed(() => props.gradient ?? '')
const captionText  = computed(() => props.alt ?? '')

const imgEl   = ref<HTMLImageElement | null>(null)
const playing = ref(playMode.value === 'auto')

/* Swap static → animated on demand (hover / click) */
function start () { if (!playing.value) { imgEl.value!.src = `${basePath.value}animation.avif`; playing.value = true } }
function stop  () { if (playing.value)  { imgEl.value!.src = `${basePath.value}frame_000.avif`;  playing.value = false } }
function toggle () { playing.value ? stop() : start() }

onMounted(() => {
  if (!imgEl.value) return
  /* lazy decode only when visible */
  useIntersectionObserver(imgEl, ([e]) => {
    if (e.isIntersecting && playing.value) imgEl.value!.decoding = 'sync'
  })
})
</script>

<template>
  <figure
    class="relative inline-block"
    :style="{ filter: filterStyles, '--igrad': gradientCSS }"
    @mouseenter="playMode==='hover' && start()"
    @mouseleave="playMode==='hover' && stop()"
    @click="playMode==='click' && toggle()"
  >
    <picture>
      <source :srcset="`${basePath}animation.avif`" type="image/avif" />
      <source :srcset="`${basePath}animation.webp`" type="image/webp" />
      <img
        ref="imgEl"
        :src="playMode==='auto' ? `${basePath}animation.avif`
                                 : `${basePath}frame_000.avif`"
        :alt="captionText"
        loading="lazy"
        decoding="async"
        class="block w-full h-auto object-cover"
      />
    </picture>


    <div
      v-if="gradientCSS"
      class="pointer-events-none absolute inset-0"
      :style="{ backgroundImage: 'var(--igrad)' }"
    />

    <figcaption class="sr-only">{{ captionText }}</figcaption>
  </figure>
</template>
