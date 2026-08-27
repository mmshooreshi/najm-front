<!-- components/admin/AdminAddCardPlaceholder.vue -->
<template>
  <button
    v-if="isEditMode"
    type="button"
    @click="appendNew"
    class="admin-add-placeholder min-h-[120px] rounded-3xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 p-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:scale-[1.01]"
    :class="customClass"
  >
    <div class="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg">
      +
    </div>
    <span class="text-xs font-bold">{{ label || 'افزودن آیتم / کارت جدید به این لیست' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useAdminArray } from '~/composables/useAdminArray'

const props = withDefaults(defineProps<{
  path: string
  label?: string
  customClass?: string
}>(), {
  label: '',
  customClass: ''
})

const { isEditMode, appendNew } = useAdminArray(props.path)
</script>
