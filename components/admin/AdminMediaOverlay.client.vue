<!-- components/admin/AdminMediaOverlay.client.vue -->
<template>
  <div v-if="state.canEdit && state.editMode" data-admin-ui="true">
    <teleport to="body">
      <!-- Media Foreground Pattern Mask + Minimal Centered Pencil -->
      <div
        v-if="isVisible && targetEl && !state.mediaStudioOpen"
        ref="overlayContainerEl"
        data-admin-ui="true"
        class="admin-media-overlay-hud media-hud fixed z-[999990] pointer-events-auto flex items-center justify-center select-none cursor-pointer"
        :style="containerStyle"
        @mouseenter="onOverlayEnter"
        @mouseleave="onOverlayLeave"
        @click.stop="openStudioDirectly"
      >
        <!-- Subtle Green/Amber Overlay Mask with Cool Modern Diagonal Pattern Stripes -->
        <div
          class="absolute inset-0 rounded-2xl transition-opacity duration-200 pointer-events-none"
          :class="isModified
            ? 'admin-media-pattern-amber opacity-90'
            : 'admin-media-pattern-green opacity-80'"
        ></div>

        <!-- Centered Glowing Pencil Badge & Format -->
        <div class="relative z-10 flex items-center gap-2" @click.stop="openStudioDirectly">
          <button
            type="button"
            class="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xl border border-white/25"
            :class="isModified
              ? 'bg-amber-500/90 text-zinc-950 shadow-amber-500/30'
              : 'bg-najmgreen/90 text-white shadow-emerald-950/50 hover:bg-najmgreen'"
            :title="isModified ? 'تصویر تغییر یافته • برای ویرایش کلیک کنید' : 'ویرایش تصویر (کلیک کنید)'"
          >
            <AdminIcon name="pencil" class="w-5 h-5" />
          </button>

          <!-- Format Tag (Subtle pill next to pencil) -->
          <span class="px-2 py-1 rounded-xl bg-zinc-950/80 border border-white/15 text-[10px] font-mono font-bold text-zinc-200 backdrop-blur-md">
            {{ mediaFormat }}
          </span>

          <!-- Quick Revert (if modified) -->
          <button
            v-if="isModified"
            type="button"
            @click.stop="handleRevert"
            class="p-2 rounded-full bg-rose-500/80 text-white hover:bg-rose-600 transition-colors shadow-lg cursor-pointer"
            title="بازگشت به تصویر اولیه"
          >
            <AdminIcon name="undo" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  adminEditState as state,
  openMediaStudio,
  revertPath,
  isChanged,
  clearMediaSelection
} from '@/store/adminEditStore'
import { useAdminMotionControl } from '@/composables/useAdminMotionControl'
import AdminIcon from '~/components/admin/AdminIcon.vue'

const { freezeMotion, unfreezeMotion } = useAdminMotionControl()

const overlayContainerEl = ref<HTMLElement | null>(null)
const targetEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const currentPath = ref('')
const currentUrl = ref('')
const mediaFormat = ref('IMG')
const dimensions = reactive({ w: 0, h: 0 })
let hideTimeout: any = null
let isHovering = false
let animFrameId: number | null = null

const isModified = computed(() => {
  if (!currentPath.value) return false
  return isChanged(currentPath.value, state.language || 'fa')
})

const containerStyle = reactive({
  top: '0px',
  left: '0px',
  width: '0px',
  height: '0px'
})

function updatePosition() {
  if (!targetEl.value) return
  const rect = targetEl.value.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) {
    isVisible.value = false
    return
  }

  // Snap directly to the element's exact bounding box with NO sliding glide across the screen
  containerStyle.top = `${Math.round(rect.top)}px`
  containerStyle.left = `${Math.round(rect.left)}px`
  containerStyle.width = `${Math.round(rect.width)}px`
  containerStyle.height = `${Math.round(rect.height)}px`
}

function startTracking() {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  const track = () => {
    if (isVisible.value && targetEl.value) {
      updatePosition()
      animFrameId = requestAnimationFrame(track)
    }
  }
  animFrameId = requestAnimationFrame(track)
}

function showForElement(el: HTMLElement, path = '', url = '') {
  if (!state.canEdit || !state.editMode || state.mediaStudioOpen) return
  if (hideTimeout) clearTimeout(hideTimeout)

  targetEl.value = el
  currentPath.value = path || el.getAttribute('data-media-path') || el.getAttribute('data-edit-path') || ''

  // Freeze motion on this element and parents while interacting
  freezeMotion(el, true)

  // Resolve media URL & dimensions
  let resolvedUrl = url
  if (!resolvedUrl) {
    if (el instanceof HTMLImageElement) {
      resolvedUrl = el.currentSrc || el.src
      dimensions.w = el.naturalWidth || el.width
      dimensions.h = el.naturalHeight || el.height
    } else {
      const img = el.querySelector('img')
      if (img) {
        resolvedUrl = img.currentSrc || img.src
        dimensions.w = img.naturalWidth || img.width
        dimensions.h = img.naturalHeight || img.height
      }
    }
  }

  currentUrl.value = resolvedUrl

  const clean = (resolvedUrl || '').split('?')[0].toLowerCase()
  const ext = clean.split('.').pop()
  if (ext && ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg', 'psd', 'ai', 'pdf'].includes(ext)) {
    mediaFormat.value = ext.toUpperCase()
  } else {
    mediaFormat.value = 'IMG'
  }

  updatePosition()
  isVisible.value = true
  startTracking()
}

function openStudioDirectly() {
  if (!targetEl.value && !currentUrl.value) return
  isVisible.value = false
  openMediaStudio({
    path: currentPath.value,
    el: targetEl.value,
    url: currentUrl.value,
    meta: {
      format: mediaFormat.value.toLowerCase(),
      width: dimensions.w,
      height: dimensions.h
    }
  })
}

function handleRevert() {
  if (!currentPath.value) return
  revertPath(currentPath.value, state.language || 'fa')
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: `تصویر "${currentPath.value}" به نسخه اولیه بازگشت.` } }))
}

function scheduleHide() {
  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    if (!isHovering && !state.selectedMediaElement) {
      if (targetEl.value) {
        unfreezeMotion(targetEl.value, false)
      }
      isVisible.value = false
      targetEl.value = null
      if (animFrameId) cancelAnimationFrame(animFrameId)
    }
  }, 200)
}

function onOverlayEnter() {
  isHovering = true
  if (hideTimeout) clearTimeout(hideTimeout)
}

function onOverlayLeave() {
  isHovering = false
  scheduleHide()
}

// Watch selected element in admin store
watch(() => state.selectedMediaElement, (selEl) => {
  if (selEl) {
    showForElement(selEl, state.selectedMediaPath || '', '')
  } else if (!isHovering) {
    if (targetEl.value) {
      unfreezeMotion(targetEl.value, false)
    }
    isVisible.value = false
    targetEl.value = null
  }
})

onMounted(() => {
  const onMediaHover = (e: any) => {
    const detail = e.detail || {}
    if (detail.el) {
      showForElement(detail.el, detail.path, detail.url)
    }
  }

  const onMediaLeave = () => {
    scheduleHide()
  }

  window.addEventListener('admin:media-hover', onMediaHover)
  window.addEventListener('admin:media-leave', onMediaLeave)

  ;(window as any)._adminMediaOverlayCleanup = () => {
    window.removeEventListener('admin:media-hover', onMediaHover)
    window.removeEventListener('admin:media-leave', onMediaLeave)
    if (animFrameId) cancelAnimationFrame(animFrameId)
  }
})

onBeforeUnmount(() => {
  ;(window as any)._adminMediaOverlayCleanup?.()
})
</script>

<style scoped>
/* Cool Subtle Emerald Diagonal Pattern Stripes */
.admin-media-pattern-green {
  background-color: rgba(1, 68, 57, 0.4);
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(16, 185, 129, 0.18) 0,
    rgba(16, 185, 129, 0.18) 8px,
    transparent 8px,
    transparent 16px
  );
  backdrop-filter: blur(1.5px);
}

/* Subtle Amber Diagonal Pattern Stripes when modified */
.admin-media-pattern-amber {
  background-color: rgba(180, 83, 9, 0.4);
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(245, 158, 11, 0.22) 0,
    rgba(245, 158, 11, 0.22) 8px,
    transparent 8px,
    transparent 16px
  );
  backdrop-filter: blur(1.5px);
}
</style>
