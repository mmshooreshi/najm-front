<!-- components/admin/AdminArrayItemActions.vue -->
<template>
  <div
    v-if="isEditMode"
    class="admin-item-actions inline-flex items-center gap-1 bg-zinc-950/90 text-white rounded-lg p-0.5 border border-white/20 shadow-md backdrop-blur-md select-none z-30 transition-all hover:scale-105"
    :class="positionClass"
    @click.stop
  >
    <!-- Add Item After Button -->
    <button
      type="button"
      @click="addAfter(index)"
      class="w-5 h-5 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
      title="افزودن آیتم جدید بعد از این مورد (+)"
    >
      +
    </button>

    <!-- Delete Item Button -->
    <button
      type="button"
      @click="removeAt(index)"
      class="w-5 h-5 rounded bg-rose-600/80 hover:bg-rose-500 text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
      title="حذف این مورد (-)"
    >
      −
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminArray } from '~/composables/useAdminArray'

const props = withDefaults(defineProps<{
  path: string
  index: number
  position?: 'top-left' | 'top-right' | 'inline'
}>(), {
  position: 'top-left'
})

const { isEditMode, addAfter, removeAt } = useAdminArray(props.path)

const positionClass = computed(() => {
  if (props.position === 'top-left') return 'absolute top-2 left-2'
  if (props.position === 'top-right') return 'absolute top-2 right-2'
  return 'relative'
})
</script>
