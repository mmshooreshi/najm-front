<!-- components/Base/BaseDropDown.vue -->
<template>
    <div ref="root" :class="['inline-block relative', containerClass]">
      <button
        type="button"
        @click="open = !open"
        :class="['flex items-center px-3 py-1 rounded-lg transition', buttonClass]"
        :aria-expanded="open"
      >
        <slot name="label">
          {{ label }}
        </slot>
        <slot name="icon">
          <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 7l5 5 5-5H5z"/>
          </svg>
        </slot>
      </button>
  
      <transition name="fade">
        <ul
          v-if="open"
          :class="['absolute mt-2 z-10 bg-white border rounded-md shadow-lg overflow-hidden', menuClass]"
        >
          <li
            v-for="item in items"
            :key="item[itemValueKey]"
            @click="select(item)"
            :class="['px-4 py-2 cursor-pointer transition', itemClass]"
          >
            <slot name="item" :item="item">
              {{ item[itemLabelKey] }}
            </slot>
          </li>
        </ul>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue'
  
  type Item = Record<string, any>
  
  const props = defineProps<{
    /** Shown in the button if no `label` slot is provided */
    label?: string
    /** Array of items; can be any shape */
    items: Item[]
    /** Key to read the label from each item */
    itemLabelKey?: string
    /** Key to read the unique value from each item */
    itemValueKey?: string
    containerClass?: string | string[]
    buttonClass?: string | string[]
    menuClass?: string | string[]
    itemClass?: string | string[]
    initialOpen?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'select', item: Item): void
    (e: 'update:open', v: boolean): void
  }>()
  
  const open = ref(props.initialOpen ?? false)
  const root = ref<HTMLElement>()
  
  // close on outside click
  function onClickOutside(e: MouseEvent) {
    if (root.value && !root.value.contains(e.target as Node)) {
      open.value = false
      emit('update:open', false)
    }
  }
  onMounted(() => document.addEventListener('click', onClickOutside))
  onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
  
  const itemLabelKey = props.itemLabelKey ?? 'label'
  const itemValueKey = props.itemValueKey ?? 'value'
  
  function select(item: Item) {
    emit('select', item)
    open.value = false
    emit('update:open', false)
  }
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active { transition: opacity .2s }
  .fade-enter-from, .fade-leave-to { opacity: 0 }
  </style>
  