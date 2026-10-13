<!-- components/admin/AdminDestinationModal.vue -->
<template>
  <Teleport to="body">
    <transition name="admin-modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999999] flex items-center justify-center p-4 select-none"
        dir="rtl"
        @keydown.esc="onClose"
      >
        <!-- Soft backdrop -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          @click="onClose"
        />

        <!-- Card Container -->
        <div
          class="relative w-full max-w-sm rounded-2xl bg-[#0e1715] border border-white/15 p-5 shadow-2xl shadow-black/80 flex flex-col gap-4 z-10"
        >
          <!-- Header -->
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-najmgreen/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white tracking-tight">
                  ویرایش آدرس مقصد
                </h3>
                <p v-if="itemName" class="text-xs text-zinc-300 font-medium truncate max-w-[200px]">
                  {{ itemName }}
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="onClose"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body / Input -->
          <div class="flex flex-col gap-2">
            <label class="text-xs text-zinc-400 font-medium">
              آدرس یا مسیر مقصد (Slug / URL):
            </label>
            <div class="relative flex items-center">
              <input
                ref="inputRef"
                v-model="inputVal"
                type="text"
                dir="ltr"
                placeholder="/services/offset یا https://..."
                @keydown.enter.prevent="onSave"
                class="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/20 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>

            <!-- Quick Suggestions -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <button
                v-for="sug in suggestions"
                :key="sug"
                type="button"
                @click="inputVal = sug"
                class="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-emerald-400 border border-white/10 transition cursor-pointer font-mono"
              >
                {{ sug }}
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              @click="onClose"
              class="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              انصراف
            </button>

            <button
              type="button"
              @click="onSave"
              class="px-4 py-1.5 rounded-xl text-xs font-bold bg-najmgreen hover:bg-[#0a4037] text-white transition-all cursor-pointer shadow-sm"
            >
              ثبت آدرس
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: boolean
  currentSlug: string
  itemName?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'save', val: string): void
}>()

const inputVal = ref(props.currentSlug || '/')
const inputRef = ref<HTMLInputElement | null>(null)

const suggestions = [
  '/',
  '/catalog',
  '/services',
  '/products',
  '/about',
  '/contact'
]

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      inputVal.value = props.currentSlug || '/'
      nextTick(() => {
        inputRef.value?.focus()
        inputRef.value?.select()
      })
    }
  }
)

function onClose() {
  emit('update:modelValue', false)
}

function onSave() {
  let val = inputVal.value.trim()
  if (!val) val = '/'
  emit('save', val)
  emit('update:modelValue', false)
}
</script>

<style scoped>
.admin-modal-fade-enter-active,
.admin-modal-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.admin-modal-fade-enter-from,
.admin-modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
