<template>
  <div class="p-0">
    <!-- Header / Toggle -->
    <button
      @click="open = !open"
      class="flex items-center space-x-2 font-mono text-sm"
    >
      <svg
        :class="{'rotate-90': open}"
        class="h-4 w-4 transition-transform duration-200"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5l7 7-7 7" />
      </svg>
      <span class="text-lg font-semibold">AuthStore State</span>
    </button>

    <!-- Collapsible Content -->
    <transition
      enter-from="max-h-0 opacity-0"
      enter-to="max-h-[500px] opacity-100"
      leave-from="max-h-[500px] opacity-100"
      leave-to="max-h-0 opacity-0"
      class="overflow-hidden transition-all duration-300"
    >
      <div v-show="open" class="mt-4 font-mono text-sm space-y-2">
        <div><strong>token:</strong> {{ auth.token }}</div>
        <div><strong>isValid:</strong> {{ auth.isValid }}</div>
        <div><strong>isSuperuser:</strong> {{ auth.isSuperuser }}</div>
        <div><strong>model:</strong>
          <pre class="whitespace-pre-wrap">{{ auth.model }}</pre>
        </div>
        <div><strong>record:</strong>
          <pre class="whitespace-pre-wrap">{{ auth.record }}</pre>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePBAuthStore } from '~/composables/usePBAuthStore'

const auth = usePBAuthStore()
const open = ref(false)
</script>
