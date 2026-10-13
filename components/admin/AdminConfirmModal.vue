<!-- components/admin/AdminConfirmModal.vue -->
<template>
  <Teleport to="body">
    <transition name="admin-modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 select-none"
        dir="rtl"
        @keydown.esc="onCancel"
      >
        <!-- Soft backdrop overlay -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          @click="onCancel"
        />

        <!-- Minimal Modal Card -->
        <div
          class="relative w-full max-w-sm rounded-2xl bg-[#0e1715] border border-white/15 p-5 shadow-2xl shadow-black/80 flex flex-col gap-4 z-10 transition-all duration-200"
        >
          <!-- Header with small icon -->
          <div class="flex items-start gap-3">
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              :class="danger ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' : 'bg-najmgreen/15 text-emerald-400 border border-emerald-500/20'"
            >
              <svg v-if="danger" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div class="flex flex-col gap-1 min-w-0 flex-1">
              <h3 class="text-sm font-bold text-white tracking-tight">
                {{ title || 'تأیید عملیات' }}
              </h3>
              <p class="text-xs text-zinc-300 leading-relaxed font-medium">
                {{ message }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              @click="onCancel"
              class="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              {{ cancelLabel || 'انصراف' }}
            </button>

            <button
              type="button"
              @click="onConfirm"
              class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              :class="danger ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-najmgreen hover:bg-[#0a4037] text-white'"
            >
              <span>{{ confirmLabel || 'تأیید و ادامه' }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
  }>(),
  {
    title: 'تأیید عملیات',
    confirmLabel: 'تأیید و ادامه',
    cancelLabel: 'انصراف',
    danger: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

function onConfirm() {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<style scoped>
.admin-modal-fade-enter-active,
.admin-modal-fade-leave-active {
  transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.admin-modal-fade-enter-from,
.admin-modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
