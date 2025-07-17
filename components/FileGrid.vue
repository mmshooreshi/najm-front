<!-- components/FileGrid.vue -->
<template>

    <!-- CREATE VIDEO BUTTON -->
  <button
    v-if="selected.size > 1"
    @click="$router.push({ name:'VideoEditor', query:{ ids:[...selected].join(',') } })"
    class="fixed z-50 bottom-6 right-6 bg-teal-600 text-white px-6 py-3 shadow-lg hover:bg-teal-500 transition hidden md:block rounded-2xl">
    🎬  Create video ({{ selected.size }})
  </button>

  <!-- Sort by Name button -->
  <div class="w-full flex justify-start gap-1 mb-2  pl-3">
    <button
      @click="sortByName"
      class="bg-gray-200 hover:bg-gray-300 text-sm p-1 rounded-xl shadow-sm"
    >
      
<Icon
  class="w-7 h-7 -mb-1 transition"
  :name="allSorted === 'asc'
          ? 'tabler:sort-ascending-numbers'
          : allSorted === 'desc'
            ? 'tabler:sort-descending-numbers'
            : 'tdesign:no-expression'"
/>
    </button>

 <button
  @click="selectAll"
  class="bg-gray-200 hover:bg-gray-300 text-sm p-1 rounded-xl shadow-sm"
>
  <Icon
    class="w-7 h-7 -mb-1 transition"
    :name="allSelected ? 'fluent:select-all-off-16-regular' : 'fluent:select-all-on-16-regular'"
  />
</button>

  </div>


    <!-- DRAGGABLE WRAPS THE THUMB GRID -->
  <client-only>
    <draggable
      v-model="internalFiles"
      item-key="id"
      class="mt-0 flex flex-wrap gap-3 p-1"
      tag="div"
      ghost-class="dragGhost"    
      chosen-class="dragChosen"
      @end="onReorder"
    >
    <template #item="{ element:file }">
      <div class="relative">
        <div
          @click="select(file)"
          :class="[
            'transition-all cursor-pointer ring-4 shadow rounded-2xl overflow-hidden',
            selected.has(file.id)
              ? 'ring-teal-500/60'
              : 'ring-black/10 hover:ring-teal-400/50'
          ]"
        >
          <img
            :src="getUrl(file)"
            class="block h-32 w-auto object-cover transition-opacity duration-500"
            :class="loaded.has(file.id) ? 'opacity-100' : 'opacity-0 blur-md'"
            @load="loaded.add(file.id)"
          />
        </div>

        <div class="absolute top-1 right-1 flex space-x-1">
          <button
            @click.stop="$emit('info', file)"
            class="w-5 h-5 pt-1 aspect-square flex items-center justify-center
                    shadow-sm rounded-2xl
                  transition-transform duration-200 ease-out
                  hover:scale-130 hover:text-teal
                  active:scale-95
                  focus:outline-none text-white"
          ><Icon name="hugeicons:information-square"/></button>

          <button
            @click.stop="renameFileDeep(file)"
            class="w-5 h-5 pt-1  aspect-square flex items-center justify-center
                    shadow-sm rounded-2xl
                  transition-transform duration-200 ease-out
                  hover:scale-130 hover:text-purple
                  active:scale-95
                  focus:outline-none text-white"
          ><Icon name="hugeicons:pencil-edit-02"/></button>

          <button
            @click.stop="deleteFile(file)"
            class="w-5 h-5 pt-1  aspect-square flex items-center justify-center
                    shadow-sm rounded-2xl
                  transition-transform duration-200 ease-out
                    hover:scale-130 hover:text-pink
                  active:scale-95
                  focus:outline-none text-white"
          ><Icon name="hugeicons:delete-02"/></button>
        </div>

        <div class="mt-1 text-xs text-center whitespace-nowrap">{{ file.filename }}</div>
      </div>
    </template>
  </draggable>
</client-only>

  
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePocketBase } from '~/plugins/pb.client'
import { useRoute, useRouter } from 'vue-router'

/* ░░ vuedraggable loaded only on client to avoid SSR crash ░░ */
const draggable = defineAsyncComponent(() => import('vuedraggable'))

// Props & emits
const props = defineProps<{ files: any[] }>()
const emit = defineEmits(['refresh' , 'info','reorder'])

// State
const selected = ref<Set<string>>(new Set())
const loaded = ref<Set<string>>(new Set())

// PocketBase & router
const pb = usePocketBase()
const route = useRoute()
const router = useRouter()


/* ADD: expose an event when order changes */
function onReorder () {
  emit('reorder', internalFiles.value.map(f => f.id))
}

/* INTERNAL working copy so we can mutate the list that
   comes in as a (readonly) prop */
const internalFiles = ref<any[]>([])
watch(
  () => props.files,
  n => (internalFiles.value = [...n]),
  { immediate: true }
)

// Reflect folder path in URL query
watch(
  () => route.query.path,
  path => {
    // trigger refresh if path changes externally
    emit('refresh')
  }
)

function select(file: any) {
  if (selected.value.has(file.id)) selected.value.delete(file.id)
  else selected.value.add(file.id)
}

function getUrl(file: any) {
  return pb.files.getURL(file, file.file)
}

async function deleteFile(file: any) {
  if (!confirm(`Delete file "${file.filename}"?`)) return
  await pb.collection('media_files').delete(file.id)
  emit('refresh')
}

async function renameFile(file: any) {
  const newName = prompt('Rename file', file.filename)?.trim()
  if (!newName) return
  await pb.collection('media_files').update(file.id, { filename: newName })
  emit('refresh')
}


async function renameFileDeep(file: any) {
  const newName = prompt('New filename', file.filename)?.trim()
  if (!newName) return

  // 1. download the existing file blob
  const url = getUrl(file)
  const resp = await fetch(url)
  if (!resp.ok) throw new Error('Could not fetch file for rename')

  const blob = await resp.blob()

  // 2. wrap it in a File with the new name
  const newFile = new File([blob], newName, { type: file.mime })

  // 3. send a multipart-form update to PocketBase
  const formData = new FormData()
  formData.append('file', newFile)
  // (Optionally you can still send filename metadata too)
  formData.append('filename', newName)

  await pb.collection('media_files').update(file.id, formData)

  emit('refresh')
}


type SortState = 'asc' | 'desc' | ''
const allSorted = ref<SortState>('')     // '' = unsorted (original)
const originalOrder = ref<any[]>([])     // new

watch(
  () => props.files,
  n => {
    internalFiles.value = [...n]
    originalOrder.value = [...n]         // capture original unsorted order
  },
  { immediate: true }
)


function sortByName() {
  if (allSorted.value === '') {
    internalFiles.value.sort((a, b) =>
      (a.filename || '').localeCompare(b.filename || '')
    )
    allSorted.value = 'asc'
  } else if (allSorted.value === 'asc') {
    internalFiles.value.sort((a, b) =>
      (b.filename || '').localeCompare(a.filename || '')
    )
    allSorted.value = 'desc'
  } else {
    internalFiles.value = [...originalOrder.value]
    allSorted.value = ''
  }
  onReorder()
}



const allSelected = computed(() =>
  internalFiles.value.length > 0 &&
  internalFiles.value.every(f => selected.value.has(f.id))
)


function selectAll() {
  if (allSelected.value) {
    selected.value.clear()
  } else {
    for (const f of internalFiles.value) {
      selected.value.add(f.id)
    }
  }
}

</script>



<style scoped>
.image-pixelated { image-rendering: pixelated; }

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
