<!-- components/admin/AdminAddCardPlaceholder.vue -->
<template>
  <button
    v-if="isEditMode"
    type="button"
    @click="appendNew"
    class="admin-add-placeholder min-h-[110px] rounded-3xl border-2 border-dashed border-emerald-500/50 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 p-5 flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs hover:scale-[1.01] select-none"
    :class="customClass"
  >
    <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
      +
    </div>
    <span class="text-xs font-bold">{{ label || 'افزودن آیتم جدید به این لیست' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useAdminArray } from '~/composables/useAdminArray'

const props = withDefaults(defineProps<{
  path: string
  slug?: string
  label?: string
  customClass?: string
}>(), {
  label: '',
  customClass: ''
})

const { isEditMode, appendNew } = useAdminArray(props.path, props.slug)
</script>
