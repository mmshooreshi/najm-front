<!-- components/admin/AdminArrayItemActions.vue -->
<template>
  <div
    v-if="isEditMode"
    class="admin-item-actions inline-flex items-center gap-1 bg-zinc-950/95 text-white rounded-xl p-1 border border-white/20 shadow-xl backdrop-blur-xl select-none z-30 transition-all duration-150"
    :class="positionClass"
    @click.stop
  >
    <!-- Drag Handle / Reorder Indicator -->
    <div
      class="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-zinc-200 cursor-grab active:cursor-grabbing flex items-center justify-center"
      title="برای جابجایی بکشید و رها کنید (Drag to Reorder)"
      draggable="true"
      @dragstart="onDragStart"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
      </svg>
    </div>

    <!-- Move Up Button -->
    <button
      v-if="index > 0"
      type="button"
      @click="moveUp(index)"
      class="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition cursor-pointer"
      title="انتقال به بالا (Move Up)"
    >
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
      </svg>
    </button>

    <!-- Move Down Button -->
    <button
      v-if="total === undefined || index < total - 1"
      type="button"
      @click="moveDown(index, total)"
      class="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition cursor-pointer"
      title="انتقال به پایین (Move Down)"
    >
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Archive Item Button -->
    <button
      type="button"
      @click="archive(index)"
      class="p-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
      title="انتقال این مورد به آرشیو (Archive)"
    >
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
      <span class="hidden sm:inline">آرشیو</span>
    </button>

    <!-- Delete Button (with Confirmation Popover) -->
    <div class="relative">
      <button
        type="button"
        @click="showConfirm = !showConfirm"
        class="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 border border-rose-500/35 transition cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
        title="حذف این مورد (Delete)"
      >
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span class="hidden sm:inline">حذف</span>
      </button>

      <!-- Confirmation Popover -->
      <transition name="popover-fade">
        <div
          v-if="showConfirm"
          class="absolute top-full right-0 mt-1.5 w-48 p-2 rounded-xl bg-zinc-950 border border-rose-500/40 shadow-2xl z-50 text-right flex flex-col gap-1.5"
          @click.stop
        >
          <p class="text-[11px] text-zinc-300 font-medium leading-tight">آیا از حذف این مورد اطمینان دارید؟</p>
          <div class="flex items-center gap-1.5 justify-end mt-1">
            <button
              type="button"
              @click="handleConfirmedDelete"
              class="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold transition cursor-pointer"
            >
              بله، حذف
            </button>
            <button
              type="button"
              @click="showConfirm = false"
              class="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] transition cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminArray } from '~/composables/useAdminArray'

const props = withDefaults(defineProps<{
  path: string
  index: number
  total?: number
  slug?: string
  position?: 'top-left' | 'top-right' | 'inline'
}>(), {
  position: 'top-left'
})

const showConfirm = ref(false)

const { isEditMode, moveUp, moveDown, archive, removeAt } = useAdminArray(props.path, props.slug)

const positionClass = computed(() => {
  if (props.position === 'top-left') return 'absolute top-2 left-2'
  if (props.position === 'top-right') return 'absolute top-2 right-2'
  return 'relative inline-flex'
})

function handleConfirmedDelete() {
  showConfirm.value = false
  removeAt(props.index)
}

function onDragStart(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      path: props.path,
      index: props.index,
      slug: props.slug
    }))
    e.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<style scoped>
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}
</style>
