<!-- components/admin/AdminMotionPill.client.vue -->
<template>
  <div v-if="state.canEdit && state.editMode" data-admin-ui="true">
    <teleport to="body">
      <transition name="admin-pill">
        <div
          v-if="isVisible && activeContainerEl"
          ref="pillEl"
          data-admin-ui="true"
          class="admin-motion-pill fixed z-[999994] select-none pointer-events-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-950/95 text-white border shadow-xl backdrop-blur-xl transition-all duration-150 text-[11px]"
          :class="isPaused ? 'border-amber-500/40 text-amber-300 ring-1 ring-amber-500/30' : 'border-white/15 text-zinc-300'"
          :style="pillStyle"
          @mouseenter="onPillEnter"
          @mouseleave="onPillLeave"
        >
          <!-- Status Dot -->
          <span
            class="w-2 h-2 rounded-full shrink-0"
            :class="isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'"
          ></span>

          <!-- Label -->
          <span class="font-medium text-[10px] uppercase font-mono tracking-wider">
            {{ isPaused ? 'Motion Paused' : 'Motion Active' }}
          </span>

          <!-- Toggle Button -->
          <button
            type="button"
            class="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer flex items-center justify-center"
            :title="isPaused ? 'Click to Resume Animation (Play)' : 'Click to Freeze Animation (Pause)'"
            @click.stop="toggleMotion(activeContainerEl)"
          >
            <AdminIcon :name="isPaused ? 'play' : 'pause'" class="w-3 h-3 text-white" />
          </button>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import {
  adminEditState as state,
  isElementMotionPaused
} from '@/store/adminEditStore'
import { useAdminMotionControl } from '@/composables/useAdminMotionControl'
import AdminIcon from '~/components/admin/AdminIcon.vue'

const { toggleMotion } = useAdminMotionControl()

const pillEl = ref<HTMLElement | null>(null)
const activeContainerEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let hideTimer: any = null
let isHoveringPill = false

const isPaused = computed(() => {
  if (!activeContainerEl.value) return state.isMotionPausedGlobally
  return isElementMotionPaused(activeContainerEl.value)
})

const pillStyle = reactive({
  top: '0px',
  left: '0px',
  transform: 'translate3d(0, 0, 0)'
})

function updatePosition() {
  if (!activeContainerEl.value) return
  const rect = activeContainerEl.value.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) {
    isVisible.value = false
    return
  }

  const margin = 10
  const pillW = pillEl.value?.offsetWidth || 135
  const pillH = pillEl.value?.offsetHeight || 28

  // Position at top-right corner of motion container
  let top = rect.top + 8
  let left = rect.right - pillW - 8

  // Viewport bounds checking
  if (left + pillW > window.innerWidth - margin) {
    left = window.innerWidth - pillW - margin
  }
  if (left < margin) {
    left = margin
  }
  if (top < margin) {
    top = margin
  }
  if (top + pillH > window.innerHeight - margin) {
    top = window.innerHeight - pillH - margin
  }

  pillStyle.top = `${Math.round(top)}px`
  pillStyle.left = `${Math.round(left)}px`
}

function showForContainer(container: HTMLElement) {
  if (!state.canEdit || !state.editMode || state.mediaStudioOpen) return
  if (hideTimer) clearTimeout(hideTimer)

  activeContainerEl.value = container
  isVisible.value = true
  requestAnimationFrame(updatePosition)
}

function scheduleHide() {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (!isHoveringPill) {
      isVisible.value = false
      activeContainerEl.value = null
    }
  }, 350)
}

function onPillEnter() {
  isHoveringPill = true
  if (hideTimer) clearTimeout(hideTimer)
}

function onPillLeave() {
  isHoveringPill = false
  scheduleHide()
}

onMounted(() => {
  const onMotionHover = (e: any) => {
    if (e.detail?.container) {
      showForContainer(e.detail.container)
    }
  }

  const onMotionLeave = () => {
    scheduleHide()
  }

  const onScrollOrResize = () => {
    if (isVisible.value) updatePosition()
  }

  window.addEventListener('admin:motion-container-hover', onMotionHover)
  window.addEventListener('admin:motion-container-leave', onMotionLeave)
  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize, { passive: true })

  ;(window as any)._adminMotionPillCleanup = () => {
    window.removeEventListener('admin:motion-container-hover', onMotionHover)
    window.removeEventListener('admin:motion-container-leave', onMotionLeave)
    window.removeEventListener('scroll', onScrollOrResize)
    window.removeEventListener('resize', onScrollOrResize)
  }
})

onBeforeUnmount(() => {
  ;(window as any)._adminMotionPillCleanup?.()
})
</script>

<style scoped>
.admin-pill-enter-active,
.admin-pill-leave-active {
  transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.admin-pill-enter-from,
.admin-pill-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}
</style>
