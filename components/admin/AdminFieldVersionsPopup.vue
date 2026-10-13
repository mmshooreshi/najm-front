<!-- components/admin/AdminFieldVersionsPopup.vue -->
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
          class="relative w-full max-w-md rounded-2xl bg-[#0e1715] border border-white/15 p-5 shadow-2xl shadow-black/80 flex flex-col gap-4 z-10 max-h-[85vh] overflow-hidden"
        >
          <!-- Header -->
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-najmgreen/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white tracking-tight">
                  تاریخچه تغییرات
                </h3>
                <p class="text-[11px] text-zinc-400 font-mono dir-ltr text-right truncate max-w-[240px]">
                  {{ path }}
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

          <!-- Original / Baseline Quick Reset -->
          <div
            v-if="originalValue !== undefined"
            class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
          >
            <div class="flex flex-col gap-0.5 min-w-0 flex-1 ml-2">
              <span class="text-[10px] text-zinc-400 font-medium">نسخه اولیه ذخیره شده در سرور:</span>
              <span class="text-zinc-200 font-semibold truncate">{{ originalValue || '(خالی)' }}</span>
            </div>
            <button
              type="button"
              @click="onRevertToOriginal"
              class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-400 text-[11px] font-bold transition-all shrink-0 cursor-pointer"
            >
              بازگردانی اصل
            </button>
          </div>

          <!-- Versions List -->
          <div class="flex-1 overflow-y-auto space-y-2 pr-1 custom-scroll min-h-[140px] max-h-[320px]">
            <div
              v-if="versionList.length === 0"
              class="flex flex-col items-center justify-center py-8 text-center text-zinc-500 text-xs"
            >
              <svg class="w-8 h-8 mb-2 opacity-40 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>هنوز تغییری برای این بخش ثبت نشده است</span>
            </div>

            <div
              v-for="(ver, vIdx) in versionList"
              :key="vIdx"
              class="group/ver p-3 rounded-xl border transition-all flex items-center justify-between gap-3"
              :class="isCurrent(ver.value) ? 'bg-emerald-950/30 border-emerald-500/40 shadow-xs' : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'"
            >
              <div class="flex flex-col gap-1 min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span
                    class="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                    :class="badgeClass(ver.type)"
                  >
                    {{ badgeLabel(ver.type) }}
                  </span>
                  <span class="text-[10px] text-zinc-400">
                    {{ formatDate(ver.date) }}
                  </span>
                  <span
                    v-if="isCurrent(ver.value)"
                    class="text-[9px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded-full"
                  >
                    نسخه فعلی
                  </span>
                </div>
                <div class="text-xs text-zinc-200 font-medium break-words line-clamp-2">
                  {{ ver.value || '(خالی)' }}
                </div>
              </div>

              <button
                v-if="!isCurrent(ver.value)"
                type="button"
                @click="onRestore(ver.value)"
                class="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer"
              >
                انتخاب این نسخه
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
            <span>تعداد نسخه‌ها: {{ versionList.length }}</span>
            <button
              type="button"
              @click="onClose"
              class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  adminEditState as state,
  getVersions,
  restoreVersion,
  revertPath
} from '@/store/adminEditStore'

const props = defineProps<{
  modelValue: boolean
  path: string
  lang?: string
  slug?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'restored', val: string): void
}>()

const activeLang = computed(() => (props.lang || state.language || 'fa').toLowerCase())

const cleanPath = computed(() => {
  if (props.path.includes(':')) {
    return props.path.split(':').slice(1).join(':')
  }
  return props.path
})

const effectiveSlug = computed(() => {
  if (props.slug) return props.slug
  if (props.path.includes(':')) return props.path.split(':')[0]
  return state.slug || 'home'
})

const originalValue = computed(() => {
  const rec = state.changes[cleanPath.value]?.[activeLang.value]
  return rec?.original
})

const currentValue = computed(() => {
  const rec = state.changes[cleanPath.value]?.[activeLang.value]
  return rec?.draft ?? rec?.value ?? originalValue.value
})

const versionList = computed(() => {
  const list = getVersions(cleanPath.value, activeLang.value)
  // Show most recent first
  return [...list].reverse()
})

function isCurrent(val: string): boolean {
  return val === currentValue.value
}

function badgeClass(type: string): string {
  switch (type) {
    case 'saved':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    case 'draft':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    case 'revert':
      return 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    default:
      return 'bg-zinc-700/50 text-zinc-300 border border-zinc-600/30'
  }
}

function badgeLabel(type: string): string {
  switch (type) {
    case 'saved':
      return 'ذخیره شده'
    case 'draft':
      return 'پیش‌نویس'
    case 'revert':
      return 'بازگردانده'
    default:
      return type
  }
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return ''
  }
}

function onClose() {
  emit('update:modelValue', false)
}

function onRestore(val: string) {
  restoreVersion(cleanPath.value, activeLang.value, val)
  emit('restored', val)
  emit('update:modelValue', false)
}

function onRevertToOriginal() {
  revertPath(cleanPath.value, activeLang.value)
  emit('restored', originalValue.value || '')
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

.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
}
</style>
