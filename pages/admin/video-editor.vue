<!-- pages/admin/video-editor.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePocketBase } from '~/plugins/pb.client'
import SpeedCurve from '@/components/SpeedCurve.vue'

/* ░░ vuedraggable loaded only on client to avoid SSR crash ░░ */
const draggable = defineAsyncComponent(() => import('vuedraggable'))
const playProgress = ref(0)  // 0 to 1

const route   = useRoute()
const router  = useRouter()
const pb      = usePocketBase()

/* ───── load the frames we were given via ?ids=1,2,3 ─── */
const frames      = ref<any[]>([])
const hidden      = ref<Set<string>>(new Set())   // toggle frame visibility
const playing     = ref(true)
const fps         = ref(5)
const loop        = ref(false)
const pingPong    = ref(true)
const rampCurve   = ref<[number, number][]>([[0,0],[1,1]])  // naive 2‑point linear

async function fetchFrames () {
  const ids = (route.query.ids as string || '').split(',').filter(Boolean)
  if (!ids.length) return router.replace({ name:'MediaLab' })

  frames.value = await Promise.all(
    ids.map(id => pb.collection('media_files').getOne(id))
  )
}

onMounted(fetchFrames)

/* ───── derived preview source ─── */
const orderedFrames = computed(() =>
  frames.value.filter(f => !hidden.value.has(f.id))
)

/* very naive preview loop using <img> swapping */
let interval:number|undefined

const activeFrameId = ref<string | null>(null)


watch([playing, orderedFrames, fps, pingPong], () => {
  clearInterval(interval)
  if (!playing.value || !orderedFrames.value.length) {
    activeFrameId.value = null
    return
  }

  let dir = 1, i = 0
interval = window.setInterval(() => {
  const el = document.getElementById('preview') as HTMLImageElement
  if (!el) return

  el.src = pb.files.getURL(orderedFrames.value[i], orderedFrames.value[i].file)
  // Set active frame index for UI highlight
  
  activeFrameId.value = orderedFrames.value[i]?.id || null


  // Update play progress between 0 and 1
  const total = orderedFrames.value.length
  if (total > 1) playProgress.value = i / (total - 1)

  // Ping-pong or loop logic
  if (pingPong.value) {
    if (i === total - 1) dir = -1
    if (i === 0) dir = 1
    i += dir
  } else {
    i = (i + 1) % total
  }
}, 1000 / fps.value)
})

function downloadJSON () {
  const data = {
    frames : orderedFrames.value.map(f => ({ id:f.id, url:pb.files.getURL(f,f.file) })),
    fps    : fps.value,
    loop   : loop.value,
    pingPong : pingPong.value,
    rampCurve : rampCurve.value,
  }
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'})
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'video‑preset.json'
  a.click(); URL.revokeObjectURL(a.href)
}


definePageMeta({
  // middleware: ['auth'],
  name: 'VideoEditor',
  layout: 'raw'
})
</script>

<template>
  <section class="flex flex-col md:flex-row h-full">
    <!-- ░░ Left: Frame strip ░░ -->
    <aside class="w-full md:w-max overflow-auto border-r border-gray-200 p-1 pr-4 space-y-4">
      <h2 class="font-semibold text-lg flex justify-between items-center">
        Frames
        <span class="text-xs text-gray-500">{{ frames.length }}</span>
      </h2>

      <draggable
        v-model="frames"
        item-key="id"
        ghost-class="dragGhost"
        chosen-class="dragChosen"
        class="space-y-3 transition-all"
      >
        <template #item="{ element:f, index }">
          <div class="hover:ring-teal-800/50 hover:scale-105 transition-all cursor-pointer relative rounded-lg overflow-hidden shadow-sm ring-2 w-max"
               :class="[
  activeFrameId === f.id
    ? 'scale-105 ring-pink-800/50'
    : hidden.has(f.id)
      ? 'ring-red-400 opacity-50'
      : 'ring-gray-200'
]">

            <img
              :src="pb.files.getURL(f, f.file)"
              class="object-cover w-24 h-full "
            />
            <div class="absolute top-1 right-1 flex space-x-1">
              <button
                @click="hidden.has(f.id) ? hidden.delete(f.id) : hidden.add(f.id)"
                class="w-5 h-5 flex items-center justify-center bg-white/80 rounded-full
                       hover:bg-teal-600 hover:text-white transition text-gray-700">
                <icon :name="hidden.has(f.id) ? 'heroicons:eye-closed' : 'heroicons:eye'" />
              </button>
            </div>
            <p class="text-center text-xs mt-0 truncate px-1">{{ index+1 }} – {{ f.filename }}</p>
          </div>
        </template>
      </draggable>
    </aside>

    <!-- ░░ Center: Preview + Graph ░░ -->
    <main class="flex-1 flex flex-col overflow-auto">
      <!-- preview pane -->
      <div class="flex-1 flex max-h-[60vh] items-center justify-center ">
        <img id="preview" class="max-h-[50vh] mb-4 max-w-full object-contain rounded-xl" />
      </div>

      <!-- graph pane (placeholder) -->
      <!-- <div class="h-40 bg-white border-t border-gray-200 p-4">
        <h3 class="font-semibold text-sm mb-2">Speed‑ramp curve (placeholder)</h3>
        <div class="h-full rounded-lg border-2 border-dashed border-teal-300 flex items-center justify-center text-gray-400">
          _graph UI here (drag points to edit curve)_
        </div>
      </div> -->

      <!-- graph pane (now functional) -->
      <div class="h-max max-h-[10vh]  border-t border-gray-200 p-4">
        <h3 class="font-semibold text-sm mb-2">Speed‑ramp curve</h3>
        <div class="h-max max-h-[20vh] pb-4 p-2 m-4 rounded-lg border border-gray-300">
          <!-- {{rampCurve}} -->
          <SpeedCurve :points="rampCurve" :progress="playProgress" />

        </div>
      </div>

    </main>

    <!-- ░░ Right: Settings ░░ -->
    <aside class="w-full md:w-64 border-l border-gray-200 p-4 space-y-4">
      <h2 class="font-semibold text-lg">Settings</h2>

      <label class="block text-sm font-medium">FPS
        <input type="number" v-model.number="fps"
               class="mt-1 p-2 bg-black/10 w-full rounded-md border-gray-300" min="1" max="60">
      </label>

      <label class="flex items-center space-x-2">
        <input type="checkbox" v-model="loop" class="rounded">
        <span>Loop</span>
      </label>

      <label class="flex items-center space-x-2">
        <input type="checkbox" v-model="pingPong" class="rounded">
        <span>Ping‑pong</span>
      </label>

      <button
        @click="playing = !playing"
        class="w-full py-2 rounded-md text-white font-semibold
               transition" :class="playing ? 'bg-red-600 hover:bg-red-500'
                                        : 'bg-teal-600 hover:bg-teal-500'">
        {{ playing ? 'Stop preview' : 'Play preview' }}
      </button>

      <button
        @click="downloadJSON"
        class="w-full py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition">
        ⬇️  Export preset
      </button>
    </aside>
  </section>
</template>

<style scoped>


/* SortableJS helper classes (no Tailwind spaces in names) */
.dragGhost  {           /* replicates "opacity-60 ring-4 ring-teal-400/50" */
  opacity: .0;
  /* border-radius: 1rem; */
  /* box-shadow: 0 0 0 4px rgba(45, 212, 191, .5); */
}
.dragChosen {           /* item currently picked up */
  transform: scale(1.03);
  /* border-radius: 1rem; */
  /* box-shadow: 0 0 0 4px rgba(13, 148, 136, .6); */
}
</style>
