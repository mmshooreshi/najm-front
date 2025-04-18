<template>
  <div :class="['relative inline-block', containerClass]">
    <button
      type="button"
      @click="open = !open"
      :class="['p-2 rounded transition', buttonClass]"
      aria-label="Toggle Menu"
    >
      <slot name="icon">
        <!-- Default burger icon -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </slot>
    </button>

    <transition name="slide-fade">
      <div
        v-if="open"
        :class="['absolute right-0 z-10 mt-2 bg-white border rounded-md shadow-lg py-2', menuClass]"
      >
        <slot name="list">
          <a
            v-for="item in items"
            :key="item[itemValueKey]"
            :href="item.href"
            :class="['block px-4 py-2 transition', itemClass]"
          >
            {{ item[itemLabelKey] }}
          </a>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

type MenuItem = { href: string } & Record<string, any>

const props = defineProps<{
  items: MenuItem[]
  itemLabelKey?: string
  itemValueKey?: string
  containerClass?: string | string[]
  buttonClass?: string | string[]
  menuClass?: string | string[]
  itemClass?: string | string[]
  initialOpen?: boolean
}>()

const open = ref(props.initialOpen ?? false)
const itemLabelKey = props.itemLabelKey ?? 'label'
const itemValueKey = props.itemValueKey ?? 'value'
</script>

<style scoped>
.slide-fade-enter-active { transition: all .2s ease }
.slide-fade-leave-active { transition: all .15s ease }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-5px) }
</style>
