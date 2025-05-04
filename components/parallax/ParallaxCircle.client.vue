<template>
  <div>
    <!-- SVG Overlay -->
    <div ref="container" class="absolute top-0 left-0 w-full pointer-events-none overflow-visible z-50">
      <svg ref="svg" class="absolute top-0 left-0" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path
          ref="path"
          d="M100,0 C400,3000 200,6000 500,9000 C300,12000 800,15000 100,15000"
          fill="none"
          stroke="#DDF6C0"
          stroke-width="2"
        />
        <defs>
          <filter id="blurFilter">
            <feGaussianBlur ref="blurEl" in="SourceGraphic" stdDeviation="0" />
          </filter>
        </defs>
        <circle ref="circle" r="24" fill="#014439" filter="url(#blurFilter)" />
      </svg>
    </div>

    <!-- Controls -->
    <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 p-4 rounded shadow-lg z-60 pointer-events-auto">
      <div class="flex items-center space-x-2 mb-2">
        <button @click="prevFrame" class="px-2 py-1 bg-gray-200 rounded">Prev</button>
        <span>Frame {{ currentIndex + 1 }} / {{ frames.length }}</span>
        <button @click="nextFrame" class="px-2 py-1 bg-gray-200 rounded">Next</button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-700">Progress: {{ (currentFrame.progress * 100).toFixed(0) }}%</label>
          <input type="range" v-model.number="currentFrame.progress" min="0" max="1" step="0.01" class="w-64 h-1 bg-gray-200 rounded-lg appearance-none" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700">Y Offset: {{ currentFrame.yOffset }}</label>
          <input type="range" v-model.number="currentFrame.yOffset" :min="-500" :max="500" step="1" class="w-64 h-1 bg-gray-200 rounded-lg appearance-none" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700">Radius: {{ currentFrame.r }}</label>
          <input type="range" v-model.number="currentFrame.r" :min="0" :max="200" step="1" class="w-64 h-1 bg-gray-200 rounded-lg appearance-none" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700">Scale: {{ currentFrame.scale.toFixed(2) }}</label>
          <input type="range" v-model.number="currentFrame.scale" :min="0.1" :max="3" step="0.05" class="w-64 h-1 bg-gray-200 rounded-lg appearance-none" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700">Opacity: {{ currentFrame.opacity.toFixed(2) }}</label>
          <input type="range" v-model.number="currentFrame.opacity" min="0" max="1" step="0.01" class="w-64 h-1 bg-gray-200 rounded-lg appearance-none" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700">Blur: {{ currentFrame.blur }}</label>
          <input type="range" v-model.number="currentFrame.blur" :min="0" :max="100" step="1" class="w-64 h-1 bg-gray-200 rounded-lg appearance-none" />
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-medium text-gray-700">Fill:</span>
          <input type="color" v-model="currentFrame.fill" class="w-8 h-8 p-0 border-0" />
          <span class="text-xs">{{ currentFrame.fill }}</span>
        </div>
      </div>
      <div class="mt-2 flex space-x-2">
        <button @click="exportJSON" class="px-2 py-1 bg-blue-500 text-white rounded">Export JSON</button>
        <button @click="scrollToFrame" class="px-2 py-1 bg-green-500 text-white rounded">Go To</button>
      </div>
      <textarea v-model="jsonConfig" readonly class="w-full h-24 mt-2 p-1 text-xs font-mono bg-gray-50"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useWindowSize } from '@vueuse/core'

gsap.registerPlugin(ScrollTrigger)

const { height: winHeight, width: winWidth } = useWindowSize()
let docHeight = 0

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const splitColor = gsap.utils.splitColor
const toRgb = ([r, g, b]: number[]) => `rgb(${r},${g},${b})`

interface Frame {
  progress: number
  r: number
  fill: string
  opacity: number
  scale: number
  yOffset: number
  blur: number
}

const frames = reactive<Frame[]>(Array.from({ length: 10 }, (_, i) => ({
  progress: i / 9,
  r: 24,
  fill: '#014439',
  opacity: 1,
  scale: 1,
  yOffset: 0,
  blur: 0
})))

const currentIndex = ref(0)
const currentFrame = computed<Frame>({
  get: () => frames[currentIndex.value],
  set: v => frames[currentIndex.value] = v
})

const jsonConfig = ref('')
const updateJSON = () => { jsonConfig.value = JSON.stringify(frames, null, 2) }
const exportJSON = () => updateJSON()

function nextFrame() { if (currentIndex.value < frames.length - 1) currentIndex.value++; scrollToFrame() }
function prevFrame() { if (currentIndex.value > 0) currentIndex.value--; scrollToFrame() }

function scrollToFrame() {
  const y = currentFrame.value.progress * (docHeight - winHeight.value)
  window.scrollTo({ top: y, behavior: 'smooth' })
}

const container = ref<HTMLElement | null>(null)
const svg = ref<SVGSVGElement | null>(null)
const path = ref<SVGPathElement | null>(null)
const circle = ref<SVGCircleElement | null>(null)
const blurEl = ref<SVGFEGaussianBlurElement | null>(null)

let pathLength = 0
const lastProgress = ref(0)

function initialize() {
  if (!container.value || !svg.value || !path.value || !circle.value || !blurEl.value) return

  docHeight = document.documentElement.scrollHeight
  svg.value.style.width = `${winWidth.value}px`
  svg.value.style.height = `${docHeight}px`
  svg.value.setAttribute('viewBox', `0 0 ${winWidth.value} ${docHeight}`)
  container.value.style.height = `${docHeight}px`

  pathLength = path.value.getTotalLength()

  ScrollTrigger.create({
    trigger: container.value,
    start: 'top top',
    end: docHeight - winHeight.value,
    scrub: true,
    onUpdate(self) {
      const p = self.progress
      lastProgress.value = p

      let idx = frames.findIndex(f => f.progress > p)
      if (idx < 0) idx = frames.length - 1
      const prev = frames[Math.max(0, idx - 1)]
      const next = frames[idx]
      const t = next.progress > prev.progress ? (p - prev.progress) / (next.progress - prev.progress) : 0

      const rVal = lerp(prev.r * prev.scale, next.r * next.scale, t)
      const yOff = lerp(prev.yOffset, next.yOffset, t)
      const opa = lerp(prev.opacity, next.opacity, t)
      const blurVal = lerp(prev.blur, next.blur, t)
      const c0 = splitColor(prev.fill), c1 = splitColor(next.fill)
      const color = toRgb([lerp(c0[0], c1[0], t), lerp(c0[1], c1[1], t), lerp(c0[2], c1[2], t)])
      const pt = path.value.getPointAtLength(pathLength * p)

      gsap.to(circle.value, {
        overwrite: 'auto',
        attr: { cx: pt.x, cy: pt.y + yOff, r: rVal },
        fill: color,
        opacity: opa,
        duration: 0.2,
        ease: 'power1.out'
      })

      gsap.to(blurEl.value, {
        stdDeviation: blurVal,
        duration: 0.2,
        ease: 'power1.out'
      })

      updateJSON()
    }
  })
}

onMounted(() => {
  initialize()
  window.addEventListener('resize', initialize)

  watch(currentFrame, () => {
    const p = lastProgress.value
    if (path.value && circle.value) {
      const pt = path.value.getPointAtLength(pathLength * p)
      const f = currentFrame.value
      gsap.to(circle.value, {
        overwrite: 'auto',
        attr: { cx: pt.x, cy: pt.y + f.yOffset, r: f.r * f.scale },
        fill: f.fill,
        opacity: f.opacity,
        duration: 0.2,
        ease: 'power1.out'
      })
      gsap.to(blurEl.value, { stdDeviation: f.blur, duration: 0.2, ease: 'power1.out' })
    }
    updateJSON()
  }, { deep: true })
})

watch(frames, updateJSON, { deep: true })
</script>

<style scoped>
path, circle {
  will-change: transform;
}
textarea {
  background: #fafafa;
  border: 1px solid #ddd;
}
</style>
