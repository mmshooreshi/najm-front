<!-- components/scenes/labelz.vue -->
<template>
  <div class="w-full h-29 overflow-visible relative flex flex-col items-center justify-center gap-2 group">
    <div
      v-for="(lbl, idx) in labelsList"
      :key="idx"
      class="label absolute rounded-[12px] transition-all text-2xl duration-500 text-d4 px-3 py-0 font-extrabold cursor-pointer select-none"
      :class="{
        '!delay-0 scale-80 z-10 top-0 flash-blur': nextIndex === idx,
        '!delay-0 z-30 opacity-100 top-8 py-1 rounded-2xl ring-2 ring-white/30': activeIndex === idx,
        '!delay-0 scale-80 z-20 opacity-100 top-18': prevIndex === idx,
        '!delay-0 z-0 scale-50 top-9 opacity-0': next2Index === idx,
        '!delay-0 z-0 scale-50 top-10 opacity-0': next3Index === idx
      }"
      :style="{ background: activeIndex === idx ? (lbl.bg || '#B9ADFF') : 'lightgray' }"
      v-editable="`sceneFacilities.labels.${idx}.text`"
      @click="handleLabelClick(idx)"
      @focus="handleLabelFocus(idx)"
      @blur="handleLabelBlur"
    >
      {{ lbl.text }}
    </div>

    <!-- Interactive Play / Pause Control Button -->
    <button
      type="button"
      @click.stop="togglePlay"
      :title="isPaused ? 'پخش خودکار چرخش' : 'توقف موقت چرخش'"
      class="absolute -bottom-1 left-2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center text-xs transition-all z-40 backdrop-blur-xs cursor-pointer opacity-40 hover:opacity-100 group-hover:opacity-100"
    >
      <Icon :name="isPaused ? 'mdi:play' : 'mdi:pause'" class="w-3.5 h-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  labels?: { text: string; bg: string }[]
}>()

const labelsList = computed(() => props.labels && props.labels.length > 0 ? props.labels : [
  { text: 'تجربه و تخصص', bg: '#B9ADFF' },
  { text: 'دقت و سرعت', bg: '#FFEBB7' },
  { text: 'یکپارچگی در فرایند', bg: '#F4FFD0' },
  { text: 'تعادل بین کیفیت و هزینه', bg: '#ADFAFF' },
  { text: 'انعطاف‌پذیری در اجرا', bg: '#FFD0F4' }
])

const activeIndex = ref(0)
const isPaused = ref(false)
let userInteracting = false
let resumeTimer: any = null

const count = computed(() => labelsList.value.length || 1)
const prevIndex = computed(() => (activeIndex.value - 1 + count.value) % count.value)
const nextIndex = computed(() => (activeIndex.value + 1) % count.value)
const next2Index = computed(() => (activeIndex.value + 2) % count.value)
const next3Index = computed(() => (activeIndex.value + 3) % count.value)

let intervalId: any = null

function startTimer() {
  stopTimer()
  if (isPaused.value || count.value <= 1) return
  intervalId = window.setInterval(() => {
    activeIndex.value = nextIndex.value
  }, 1200)
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function togglePlay() {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    stopTimer()
  } else {
    userInteracting = false
    startTimer()
  }
}

function handleLabelClick(idx: number) {
  activeIndex.value = idx
  isPaused.value = true
  stopTimer()
}

function handleLabelFocus(idx: number) {
  userInteracting = true
  activeIndex.value = idx
  stopTimer()
}

function handleLabelBlur() {
  userInteracting = false
  clearTimeout(resumeTimer)
  resumeTimer = setTimeout(() => {
    if (!userInteracting && !isPaused.value) {
      startTimer()
    }
  }, 2500)
}

function onAdminStateChange(e: any) {
  const detail = e?.detail
  if (detail?.active && detail?.path?.includes('labels')) {
    const match = detail.path.match(/labels\.(\d+)/)
    if (match) {
      const idx = parseInt(match[1], 10)
      if (idx >= 0 && idx < count.value) {
        activeIndex.value = idx
      }
    }
    isPaused.value = true
    stopTimer()
  }
}

onMounted(() => {
  startTimer()
  if (typeof window !== 'undefined') {
    window.addEventListener('najm:admin-editing-state', onAdminStateChange)
  }
})

onBeforeUnmount(() => {
  stopTimer()
  clearTimeout(resumeTimer)
  if (typeof window !== 'undefined') {
    window.removeEventListener('najm:admin-editing-state', onAdminStateChange)
  }
})
</script>

<style scoped>
.label {
  display: inline-block;
  transform-origin: center center;
}

@keyframes blurToClear {
  0% { filter: blur(0px); }
  50% { filter: blur(3px); }
  100% { filter: blur(0); }
}
.flash-blur {
  animation: blurToClear 0.35s ease;
}
</style>
  