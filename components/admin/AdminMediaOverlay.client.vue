<!-- components/admin/AdminMediaOverlay.client.vue -->
<template>
  <div v-if="state.canEdit && state.editMode" data-admin-ui="true">
    <teleport to="body">
      <!-- Floating Media In-Place HUD Overlay -->
      <transition name="media-hud">
        <div
          v-if="isVisible && targetEl"
          ref="overlayEl"
          data-admin-ui="true"
          class="admin-media-overlay-hud media-hud fixed z-[999995] select-none pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-950/95 text-white border border-white/20 shadow-2xl backdrop-blur-xl transition-all duration-150"
          :style="hudStyle"
          @mouseenter="onOverlayEnter"
          @mouseleave="onOverlayLeave"
        >
          <!-- Media Tag & Format Badge -->
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono">
            <span
              class="w-2 h-2 rounded-full"
              :class="isModified ? 'bg-amber-400 animate-pulse' : (isSelected ? 'bg-emerald-400 ring-2 ring-emerald-400/40' : 'bg-emerald-400')"
            ></span>
            <span class="font-bold text-zinc-200 uppercase">{{ mediaFormat }}</span>
            <span v-if="dimensions.w" class="text-zinc-400 text-[10px]">{{ dimensions.w }}×{{ dimensions.h }}</span>
          </div>

          <!-- Quick Action 1: Open Full Media Studio -->
          <button
            type="button"
            class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs shadow-emerald-900/40 transition-all cursor-pointer"
            title="Open In-Place Media Studio (Crop, Filters, Lighting, Compression)"
            @click.stop="handleOpenStudio('adjust')"
          >
            <AdminIcon name="sparkles" class="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>

          <!-- Quick Action 2: Crop -->
          <button
            type="button"
            class="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Crop & Resize Geometry"
            @click.stop="handleOpenStudio('crop')"
          >
            <AdminIcon name="crop" class="w-3.5 h-3.5" />
          </button>

          <!-- Quick Action 3: Quick Upload / Replace -->
          <button
            type="button"
            class="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Upload New Media (Dropzone with Live Progress)"
            @click.stop="handleOpenStudio('upload')"
          >
            <AdminIcon name="upload" class="w-3.5 h-3.5" />
          </button>

          <!-- Quick Action 4: Media Gallery -->
          <button
            type="button"
            class="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Select from PocketBase Media Gallery"
            @click.stop="handleOpenStudio('gallery')"
          >
            <AdminIcon name="photo" class="w-3.5 h-3.5" />
          </button>

          <!-- Quick Action 5: Revert to Original Baseline (if modified) -->
          <button
            v-if="isModified"
            type="button"
            class="flex items-center gap-1 px-2 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Revert to Original First Version"
            @click.stop="handleRevert"
          >
            <AdminIcon name="undo" class="w-3 h-3" />
            <span>Revert</span>
          </button>

          <!-- Quick Action 6: Copy Path -->
          <button
            v-if="currentPath"
            type="button"
            class="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
            :title="`Copy path: ${currentPath}`"
            @click.stop="handleCopyPath"
          >
            <AdminIcon name="copy" class="w-3.5 h-3.5" />
          </button>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  adminEditState as state,
  openMediaStudio,
  revertPath,
  isChanged
} from '@/store/adminEditStore'
import AdminIcon from '~/components/admin/AdminIcon.vue'

const overlayEl = ref<HTMLElement | null>(null)
const targetEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isLocked = ref(false)
const currentPath = ref('')
const currentUrl = ref('')
const mediaFormat = ref('IMAGE')
const dimensions = reactive({ w: 0, h: 0 })
let hideTimeout: any = null
let isHoveringOverlay = false

const isModified = computed(() => {
  if (!currentPath.value) return false
  return isChanged(currentPath.value, state.language || 'fa')
})

const isSelected = computed(() => {
  return targetEl.value && state.selectedMediaElement === targetEl.value
})

const hudStyle = reactive({
  top: '0px',
  left: '0px',
  transform: 'translate3d(0, 0, 0)'
})

function updatePosition() {
  if (!targetEl.value) return
  const rect = targetEl.value.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) {
    if (!isLocked.value) isVisible.value = false
    return
  }

  const margin = 8
  const hudW = overlayEl.value?.offsetWidth || 300
  const hudH = overlayEl.value?.offsetHeight || 40

  let top = 0
  let left = 0

  // If media is tall enough, overlay inside top of image directly
  if (rect.height >= 60 && rect.width >= 180) {
    top = rect.top + 8
    // Center overlay horizontally over the media
    left = rect.left + (rect.width - hudW) / 2
  } else {
    // If small, float above media
    top = rect.top - hudH - 8
    if (top < margin) {
      top = rect.bottom + 8
    }
    left = rect.left + 4
  }

  // Clamping within viewport
  if (left + hudW > window.innerWidth - margin) {
    left = window.innerWidth - hudW - margin
  }
  left = Math.max(margin, left)
  top = Math.max(margin, Math.min(window.innerHeight - hudH - margin, top))

  hudStyle.top = `${Math.round(top)}px`
  hudStyle.left = `${Math.round(left)}px`
}

function showForElement(el: HTMLElement, path = '', url = '', locked = false) {
  if (!state.canEdit || !state.editMode) return
  if (hideTimeout) clearTimeout(hideTimeout)

  targetEl.value = el
  if (locked) isLocked.value = true
  currentPath.value = path || el.getAttribute('data-media-path') || el.getAttribute('data-edit-path') || ''

  // Determine media URL
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
      } else {
        const bg = window.getComputedStyle(el).backgroundImage
        if (bg && bg !== 'none') {
          const match = bg.match(/url\(['"]?(.*?)['"]?\)/)
          if (match) resolvedUrl = match[1]
        }
      }
    }
  }

  currentUrl.value = resolvedUrl

  // Format detection
  const clean = (resolvedUrl || '').split('?')[0].toLowerCase()
  const ext = clean.split('.').pop()
  if (ext && ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg', 'psd', 'ai', 'pdf'].includes(ext)) {
    mediaFormat.value = ext.toUpperCase()
  } else {
    mediaFormat.value = 'IMG'
  }

  isVisible.value = true
  requestAnimationFrame(updatePosition)
}

function scheduleHide() {
  if (isLocked.value || (state.selectedMediaElement && state.selectedMediaElement === targetEl.value)) return
  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    if (!isHoveringOverlay && !isLocked.value && !state.selectedMediaElement) {
      isVisible.value = false
      targetEl.value = null
    }
  }, 220)
}

function onOverlayEnter() {
  isHoveringOverlay = true
  if (hideTimeout) clearTimeout(hideTimeout)
}

function onOverlayLeave() {
  isHoveringOverlay = false
  scheduleHide()
}

function handleOpenStudio(initialTab = 'adjust') {
  if (!targetEl.value && !currentUrl.value) return
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
  window.dispatchEvent(new CustomEvent('admin:media-studio-tab', { detail: { tab: initialTab } }))
}

function handleRevert() {
  if (!currentPath.value) return
  revertPath(currentPath.value, state.language || 'fa')
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', text: `Reverted media "${currentPath.value}"` } }))
}

function handleCopyPath() {
  if (navigator.clipboard?.writeText && currentPath.value) {
    navigator.clipboard.writeText(currentPath.value)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `Copied path: ${currentPath.value}` } }))
  }
}

// Watch selected element in admin store
watch(() => state.selectedMediaElement, (selEl) => {
  if (selEl) {
    isLocked.value = true
    showForElement(selEl, state.selectedMediaPath || '', '', true)
  } else {
    isLocked.value = false
    scheduleHide()
  }
})

// Global Event Listeners
onMounted(() => {
  const onMediaHover = (e: any) => {
    const detail = e.detail || {}
    if (detail.el) {
      showForElement(detail.el, detail.path, detail.url, !!detail.locked)
    }
  }

  const onMediaLeave = () => {
    scheduleHide()
  }

  const onScrollOrResize = () => {
    if (isVisible.value) updatePosition()
  }

  window.addEventListener('admin:media-hover', onMediaHover)
  window.addEventListener('admin:media-leave', onMediaLeave)
  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize, { passive: true })

  ;(window as any)._adminMediaOverlayCleanup = () => {
    window.removeEventListener('admin:media-hover', onMediaHover)
    window.removeEventListener('admin:media-leave', onMediaLeave)
    window.removeEventListener('scroll', onScrollOrResize)
    window.removeEventListener('resize', onScrollOrResize)
  }
})

onBeforeUnmount(() => {
  ;(window as any)._adminMediaOverlayCleanup?.()
})
</script>

<style scoped>
.media-hud-enter-active,
.media-hud-leave-active {
  transition: opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.media-hud-enter-from,
.media-hud-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.96);
}
</style>
