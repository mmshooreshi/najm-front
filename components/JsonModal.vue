<template>
  <div>
    <button @click="open = true" class="px-4 py-2 bg-green-600 text-white rounded">
      View Products JSON
    </button>

    <!-- Modal backdrop -->
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="open = false"
      >
        <!-- Modal content -->
        <div class="bg-white rounded shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-auto p-6 relative">
          <button
            @click="open = false"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          <h2 class="text-xl mb-4">Products JSON</h2>
          <!-- the actual collapsible JSON viewer -->
          <json-pretty
            :data="data"
            :deep="3"
            :show-line-number="false"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

defineProps<{
  data: unknown
}>()

const open = ref(false)
</script>
