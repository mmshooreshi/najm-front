<template>
  <div class="group relative w-full h-[500px] z-50 overflow-hidden rounded-3xl">
    <!-- Base slot content -->
    <div class="w-full h-full absolute z-50">

      <slot />

      <div :class="[toFade ? 'scale-0' : '']" class="transition-all duration-200 easeflex flex-col h-full justify-between p-6 ">
        <div class="flex justify-between items-center">
          <button  class="text-nowrap text-black hover:scale-105 transition-all cursor-pointer bg-white/80 hover:bg-white   rounded-[25px] py-2 px-4 text-d4 text-demibold text-sm">{{name}}</button>
          <div class="transform scale-50   opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 ease-out">
           <HaArrow />
        </div>
        </div>
        <div class="flex justify-between items-center">
          <!-- <HaArrow/><HaArrow/><HaArrow/> -->
        </div>
        <div class="flex justify-between items-center">
          <!-- <HaArrow/><HaArrow/><HaArrow/> -->
          <button class="transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100  transition-all duration-200 ease-out  text-black  hover:scale-105 transition-all cursor-pointer bg-white/80 hover:bg-white   rounded-[25px] py-2 px-4 text-d4 font-medium text-xs">{{toPersianDigits(items.length)}} آیتم</button>

        </div>
      </div>
    </div>

    <!-- Overlay items -->
    <div
      v-for="item in items"
      :key="item.id"
      class="absolute pointer-events-auto cursor-pointer"
      :style="getStyle(item.specs)"
      >
      <!--  -->
      <NuxtImg
        :src="item.image"
        :alt="item.alt ?? item.name"
        @click="editItem(item)"
        :class="editingItem?.id === item.id ? 'border border-teal rounded-3xl' : ''"
        class="w-full h-full object-contain"
      />
    </div>

    <!-- Editor pane -->
    <Teleport v-if="editingItem" to="body">

      {{editingItem}}

      <div class="fixed bottom-0 w-full bg-white/90 p-4 border-t backdrop-blur">
        <h4 class="font-medium mb-2">Edit Specs — {{ editingItem.name }}</h4>
        <div class="flex flex-wrap gap-6">
          {{editingItem.specs}}
          {{imageNumber}}
          <!-- <div v-for="field in fields" :key="field.key" class="flex flex-col">
            <label class="text-sm font-semibold">{{ field.label }}</label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="editingItem.specs[field.key]"
                type="number"
                class="border p-1 rounded w-16"
              />
              <input
                type="range"
                :min="field.min"
                :max="field.max"
                :step="field.step"
                v-model.number="editingItem.specs[field.key]"
                class="flex-1"
              />
            </div>
          </div> -->
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button @click="resetSpecs" class="px-3 py-1 bg-gray-500 text-white rounded">
            Reset
          </button>
          <button @click="closeEditor" class="px-3 py-1 bg-blue-600 text-white rounded">
            Done
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import HaArrow from '@/components/Base/HaArrow.vue'
import { toPersianDigits } from '~/utils/digits'

interface Specs {
  x: number
  y: number
  width: number
  height: number
  rotate: number
  zIndex: number
}

interface Item {
  id: number | string
  name: string
  alt?: string
  image: string
  specs: Specs
}

type SpecKey = keyof Specs

const props = defineProps<{ items: Item[], name: String , currentPackage: Object, toFade: Boolean}>()

const editingItem = ref<Item | null>(null)
const defaultSpecs = ref<Specs | null>(null)

const fields: Array<{
  key: SpecKey
  label: string
  min: number
  max: number
  step: number
}> = [
  { key: 'x',      label: 'X Position (%)', min: -200, max: 200, step: 1 },
  { key: 'y',      label: 'Y Position (%)', min: -200, max: 200, step: 1 },
  { key: 'width',  label: 'Width (px)',     min:   50, max: 200, step: 1 },
  { key: 'height', label: 'Height (px)',    min:   50, max: 200, step: 1 },
  { key: 'rotate', label: 'Rotate (deg)',   min:  -30, max:  30, step: 1 },
]
const imageNumber = ref(1)

// Deep-copy defaults and normalize any unit’d inputs to plain numbers
function editItem(item: Item) {
  console.log(item)
  defaultSpecs.value = JSON.parse(JSON.stringify(item.specs))
  // Normalize to numbers
  for (const key of Object.keys(item.specs) as SpecKey[]) {
    const raw = String(item.specs[key])
    const num = parseFloat(raw.replace(/[^\d\.-]/g, ''))
    item.specs[key] = isNaN(num) ? 200 : num
  }
  editingItem.value = item

  const m = item.image.match(/\/(\d+)\.png$/)
  imageNumber.value = m ? parseInt(m[1], 10) : 1

}

function resetSpecs() {
  if (editingItem.value && defaultSpecs.value) {
    editingItem.value.specs = { ...defaultSpecs.value }
  }
}

function closeEditor() {
  editingItem.value = null
}

// Only append units to true numbers; pass other strings through unchanged
function getStyle(specs: Specs) {
  const toCss = (
    val: number | string,
    unit: 'px' | '%' = 'px'
  ) => (typeof val === 'number' ? `${val}${unit}` : val)

  return {
    top:      toCss(specs.y, '%'),
    left:     toCss(specs.x, '%'),
    width:    toCss(specs.width, 'px'),
    height:   toCss(specs.height, 'px'),
    transform: `rotate(${specs.rotate}deg)`,
    transformOrigin: 'center',
    zIndex:   specs.zIndex,
  }
}

// Keyboard-driven adjustments
function onKeyDown(e: KeyboardEvent) {
  if (!editingItem.value) return
  e.preventDefault()

  const s = editingItem.value.specs
  const step = e.shiftKey ? 10 : 1
  console.log(e.key)
  switch (e.key) {
    case 'ArrowUp':    s.y     -= step; break
    case 'ArrowDown':  s.y     += step; break
    case 'ArrowLeft':  s.x     -= step; break
    case 'ArrowRight': s.x     += step; break
    case '+': case '=': 
      s.width  += step
      s.height += step
      break
    case '-':
      s.width  = Math.max(0, s.width - step)
      s.height = Math.max(0, s.height - step)
      break
    case 'r':
      s.rotate = (s.rotate + step + 360) % 360
      break
    case 'R':
      s.rotate = (s.rotate + step + 360) % 360
      break
    case ' ':
      s.zIndex = (s.zIndex || 0) - 1
      break
    case 'Meta':
      s.zIndex = (s.zIndex || 0) + 1
      break
      
  
  
    case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8':
      imageNumber.value = parseInt(e.key, 10)
      editingItem.value.image = `/images/main/${imageNumber.value}.png`
      break

    // ZERO: bump +1, modulo 12
    case '0':
    imageNumber.value = imageNumber.value == 16 ? 1 : (imageNumber.value % 17 )+1
    editingItem.value.image = `/images/main/${imageNumber.value}.png`
      break

    case '9':
      imageNumber.value = imageNumber.value == 1 ? 16 : (imageNumber.value % 17 )-1
      editingItem.value.image = `/images/main/${imageNumber.value}.png`
      break

    }
}

// Attach/detach listener based on editing state
watch(editingItem, (val) => {
  if (val) window.addEventListener('keydown', onKeyDown)
  else   window.removeEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
:host { display: block; }
</style>
