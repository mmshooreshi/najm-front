<!-- components/RecordDrawer.vue -->
<script setup lang="ts">
/**
 * RecordDrawer.vue — v2
 * Fixes DataCloneError (structuredClone can’t copy File, Proxy, etc.).
 * We now deep‑clone PocketBase records with JSON stringify, which is safe
 * for primitive field types we edit here.
 */
import { Dialog, DialogPanel, DialogOverlay } from '@headlessui/vue'

const props = defineProps<{ collection: string; record?: any; icon?: string }>()
const emit  = defineEmits<{ saved: [] }>()

const open = ref(false)

/**
 * 1. Load schema once the drawer opens (for dynamic fields)
 */
const schema = ref<any[]>([])
watch(open, async (v) => {
  if (!v) return
  const { fields } = await $fetch(`/api/admin/pb/schema`, {
    params: { name: props.collection }
  })
  schema.value = fields
  resetForm()
})

/**
 * 2. Form state — JSON‑clone to avoid DataCloneError
 */
const form = reactive<Record<string, any>>({})
function resetForm () {
  Object.assign(form, JSON.parse(JSON.stringify(props.record || {})))
}

/**
 * 3. Persist
 */
async function save () {
  const url  = '/api/admin/pb/collection'
  const opts = props.record
    ? { method: 'PATCH', params: { name: props.collection, id: props.record.id }, body: form }
    : { method: 'POST',  params: { name: props.collection },                  body: form }

  await $fetch(url, opts)
  open.value = false
  emit('saved')
}
</script>

<template>
  <!-- trigger -->
  <button @click="open = true" class="inline-flex items-center gap-1 whitespace-nowrap">
    <Icon :name="icon || (props.record ? 'mdi:pencil' : 'mdi:plus')" />
    <span v-if="!icon">{{ props.record ? 'Edit' : 'Add' }}</span>
  </button>

  <!-- drawer -->
  <Dialog :open="open" @close="open = false" class="relative z-40">
    <DialogOverlay class="fixed inset-0 bg-black/50" />
    <DialogPanel class="fixed right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl">
      <h2 class="mb-4 text-lg font-bold">
        {{ props.record ? 'Edit' : 'Create' }} {{ props.collection }}
      </h2>

      <form @submit.prevent="save" class="space-y-4">
        <div v-for="fld in schema" :key="fld.name">
          <label class="mb-1 block text-xs font-medium">{{ fld.name }}</label>
          <input v-model="form[fld.name]" class="input w-full" />
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" class="btn" @click="open=false">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </DialogPanel>
  </Dialog>
</template>
