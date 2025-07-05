<!-- pages/admin/c/[name].vue -->
<!-- pages/admin/c/[name].vue -->
<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const route = useRoute()
const col = computed(() => route.params.name as string)

const page  = ref(1)
const per   = 25

const { data, refresh } = await useAsyncData(
  () =>
    $fetch('/api/admin/pb/collection', {
       params: { name: col.value, page: page.value, per }
    }),
  { watch: [page, col] }
)



const records = computed(() => data.value ?? [])

async function remove(id: string) {
  if (!confirm('Delete record?')) return

  await $fetch('/api/admin/pb/collection', {
    method: 'DELETE',
    params: { name: col.value, id }   // ⚠️ must be the raw string
  })

  refresh()
}

</script>



<template>
  <h1 class="mb-4 text-2xl font-bold">{{ col }}</h1>

  <!-- CREATE / REFRESH -->
  <div class="mb-2 flex items-center gap-2">
    <button class="btn" @click="refresh">↻ Refresh</button>
    
    <RecordDrawer :collection="col" @saved="refresh" />
  </div>

  <!-- TABLE -->
  <div class="relative overflow-x-auto rounded-lg border bg-white shadow">
    <table class="min-w-full text-sm">
      <thead class="bg-gray-100 text-gray-600">
        <tr>
          <th class="px-4 py-2 text-left">full</th>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Created</th>
          <th class="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in records?.items" :key="r.id" class="border-t">
            {{r}}
          <td class="px-4 py-2">{{ r.id }}</td>
          <td class="px-4 py-2">{{ new Date(r.created).toLocaleString() }}</td>
          <td class="px-4 py-2 space-x-2 rtl:space-x-reverse">
            <RecordDrawer :collection="col" :record="r" icon="mdi:pencil" @saved="refresh" />
            <button class="hover:text-red-600" @click="remove(r.id)">
              <Icon name="mdi:delete-outline" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PAGINATION -->
  <div class="mt-4 flex items-center gap-2">
    <button :disabled="page===1" @click="page--">Prev</button>
    <span>Page {{ page }}</span>
    <button :disabled="records?.items?.length < per" @click="page++">Next</button>
  </div>
</template>
