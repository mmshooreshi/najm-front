<!-- components/admin/AdminArrayInsertLine.vue -->
<template>
  <div
    v-if="isEditMode"
    class="admin-insert-line relative flex items-center justify-center my-1.5 py-1 z-20 group/insert select-none cursor-pointer transition-all duration-200"
    :class="customClass"
    @click.stop="handleInsert"
  >
    <!-- Subtle Dashed Divider Line -->
    <div class="absolute inset-x-0 h-px bg-transparent group-hover/insert:bg-emerald-500/50 border-t border-dashed border-emerald-500/20 group-hover/insert:border-emerald-500/80 transition-all"></div>

    <!-- Center [+] Action Pill -->
    <div
      class="relative z-10 px-2.5 py-0.5 rounded-full bg-zinc-900/90 group-hover/insert:bg-emerald-600 text-zinc-400 group-hover/insert:text-white border border-emerald-500/30 group-hover/insert:border-emerald-400 text-xs font-semibold flex items-center gap-1 shadow-sm transition-all transform scale-90 group-hover/insert:scale-100"
    >
      <span class="text-xs font-bold leading-none">+</span>
      <span class="text-[10px] hidden group-hover/insert:inline">افزودن در این موقعیت</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminArray } from '~/composables/useAdminArray'

const props = withDefaults(defineProps<{
  path: string
  insertIndex: number
  slug?: string
  customClass?: string
}>(), {
  slug: '',
  customClass: ''
})

const { isEditMode, addAfter } = useAdminArray(props.path, props.slug)

function handleInsert() {
  // insertIndex - 1 inserts right before index
  addAfter(props.insertIndex - 1)
}
</script>
