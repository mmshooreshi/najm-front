<!-- components/admin/AdminArrayArchiveModal.vue -->
<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none"
        @click.self="$emit('close')"
      >
        <div class="relative w-full max-w-lg bg-zinc-950 text-white rounded-3xl border border-white/15 shadow-2xl p-5 md:p-6 flex flex-col max-h-[85vh] text-right">
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-white/10">
            <div class="flex items-center gap-2">
              <span class="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </span>
              <div>
                <h3 class="text-base font-bold text-zinc-100">آرشیو موارد «{{ path }}»</h3>
                <p class="text-xs text-zinc-400">موارد بایگانی شده در این بخش قابل بازگردانی هستند</p>
              </div>
            </div>

            <button
              type="button"
              @click="$emit('close')"
              class="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Archived Items List -->
          <div class="flex-1 overflow-y-auto py-4 space-y-3">
            <div v-if="!archivedItems || archivedItems.length === 0" class="text-center py-10 text-zinc-500 text-sm">
              هیچ موردی در آرشیو این بخش وجود ندارد
            </div>

            <div
              v-for="(item, idx) in archivedItems"
              :key="idx"
              class="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-white/20 transition flex items-center justify-between gap-3"
            >
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-zinc-200 truncate">
                  {{ getItemTitle(item) }}
                </h4>
                <p v-if="getItemDesc(item)" class="text-xs text-zinc-400 line-clamp-2 mt-0.5">
                  {{ getItemDesc(item) }}
                </p>
              </div>

              <!-- Restore Button -->
              <button
                type="button"
                @click="handleRestore(idx)"
                class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>بازگردانی به لیست</span>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>تعداد موارد آرشیو: {{ archivedItems.length }}</span>
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { useAdminArray } from '~/composables/useAdminArray'

const props = defineProps<{
  open: boolean
  path: string
  slug?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { archivedItems, restore } = useAdminArray(props.path, props.slug)

function getItemTitle(item: any): string {
  if (typeof item === 'string') return item
  if (item && typeof item === 'object') {
    return item.title || item.question || item.name || item.header || 'آیتم آرشیو شده'
  }
  return 'آیتم آرشیو شده'
}

function getItemDesc(item: any): string {
  if (item && typeof item === 'object') {
    return item.desc || item.description || item.answer || item.subtitle || ''
  }
  return ''
}

function handleRestore(idx: number) {
  restore(idx)
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
