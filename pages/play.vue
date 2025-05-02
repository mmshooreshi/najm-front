<template>
    <div class="p-4">
      <h1 class="text-xl font-bold mb-4">PocketBase Playground</h1>
  
      <!-- View Mode Toggle -->
      <div class="flex gap-4 mb-4">
        <button
          @click="viewMode = 'table'"
          :class="{ 'font-semibold underline': viewMode === 'table' }"
          class="px-3 py-1 border rounded"
        >
          Table View
        </button>
        <button
          @click="viewMode = 'json'"
          :class="{ 'font-semibold underline': viewMode === 'json' }"
          class="px-3 py-1 border rounded"
        >
          JSON View
        </button>
      </div>
  
      <div class="flex gap-4">
        <!-- Collections Sidebar -->
        <div class="w-1/4 border-r pr-4">
          <h2 class="font-semibold mb-2">Collections</h2>
          <ul>
            <li v-for="col in collections" :key="col.id" class="mb-1">
              <button
                @click="selectCollection(col)"
                class="text-blue-600 hover:underline"
              >
                {{ col.name }}
              </button>
            </li>
          </ul>
        </div>
  
        <!-- Main Content -->
        <div class="w-3/4">
          <div v-if="loading">Loading...</div>
  
          <div v-else-if="selectedCollection">
            <h2 class="font-semibold mb-2">{{ selectedCollection.name }} Records</h2>
  
            <!-- Table View -->
            <div v-if="viewMode === 'table'">
              <div class="ag-theme-alpine" style="height: 600px; width: 100%;">
                <ag-grid-vue
                  class="ag-grid"
                  :columnDefs="columnDefs"
                  :rowData="rowData"
                  :defaultColDef="defaultColDef"
                  :sideBar="sideBar"
                  @grid-ready="gridReady"
                ></ag-grid-vue>
              </div>
            </div>
  
            <!-- JSON View -->
            <div v-else>
              <JSONPretty :data="records" :deep="3" />
            </div>
          </div>
  
          <div v-else>
            <p>Select a collection to view its records.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import PocketBase from 'pocketbase'

  import 'ag-grid-community/styles/ag-grid.css'
  import 'ag-grid-community/styles/ag-theme-alpine.css'
  import JSONPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'
  import { ModuleRegistry } from 'ag-grid-community'
import { ClientSideRowModelModule } from 'ag-grid-community'

ModuleRegistry.registerModules([ ClientSideRowModelModule ])
import { AgGridVue } from 'ag-grid-vue3'
//   import { AgGridVue } from "@ag-grid-community/vue";


  // Initialize PocketBase client and set auth
  const pb = new PocketBase('https://aisland.co/najm/')
  pb.authStore.save(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc0NjIyMjc5NSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.Gg1dQmEYB4qTPzpMsJ8dXpM9h5tIpHfjR3K2osX9FRo',
    null
  )
  
  // Reactive State
  const collections = ref([])
  const selectedCollection = ref(null)
  const records = ref([])
  const loading = ref(false)
  const viewMode = ref('table')  // 'table' | 'json'
  
  // AG Grid Config
  const columnDefs = ref([])
  const rowData = ref([])
  const defaultColDef = { sortable: true, filter: true, resizable: true }
  const sideBar = { toolPanels: ['columns', 'filters'], defaultToolPanel: 'columns' }
  
  // Fit columns when grid is ready
const gridReady = ({ api }) => {
    api.sizeColumnsToFit();
  }
  
  // Fetch all collections
  const fetchCollections = async () => {
    try {
      collections.value = await pb.collections.getFullList()
    } catch (err) {
      console.error('Error fetching collections', err)
    }
  }
  
  // Select a collection and load its records
  const selectCollection = async (collection) => {
    selectedCollection.value = collection
    loading.value = true
  
    try {
      const result = await pb.collection(collection.name).getFullList({ sort: '-created' })
      records.value = result
  
      // Build column definitions dynamically
      if (records.value.length) {
        const keys = Object.keys(records.value[0])
        columnDefs.value = keys.map(key => ({ field: key, headerName: key }))
        rowData.value = records.value.map(r => r)
      } else {
        columnDefs.value = []
        rowData.value = []
      }
    } catch (err) {
      console.error('Error fetching records', err)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchCollections)
  </script>
  
  <style scoped>
  .ag-grid {
    height: 100%;
    width: 100%;
  }
  </style>
  