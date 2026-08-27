// plugins/admin-media.client.ts
import { defineNuxtPlugin } from '#app'
import { watch, type DirectiveBinding } from 'vue'
import {
  adminEditState as state,
  ensureBaseline,
  isMediaUrl,
  isChanged
} from '@/store/adminEditStore'
import { logger } from '@/utils/logger'

export default defineNuxtPlugin(nuxtApp => {
  // 1. Explicit Directive: v-media-editable="path"
  nuxtApp.vueApp.directive('media-editable', {
    mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
      const path = binding.value
      if (!path || path.startsWith('undefined') || path.startsWith('null')) return

      el.dataset.mediaPath = path
      el.classList.add('v-media-editable')

      const lang = state.language || 'fa'
      let initialUrl = ''

      if (el instanceof HTMLImageElement) {
        initialUrl = el.src || el.currentSrc
      } else {
        const img = el.querySelector('img')
        if (img) initialUrl = img.src || img.currentSrc
      }

      if (initialUrl) {
        ensureBaseline(path, lang, initialUrl)
      }

      const onMouseEnter = () => {
        if (!state.canEdit || !state.editMode) return
        window.dispatchEvent(new CustomEvent('admin:media-hover', {
          detail: { el, path, url: initialUrl }
        }))
      }

      const onMouseLeave = () => {
        window.dispatchEvent(new CustomEvent('admin:media-leave', {
          detail: { el, path }
        }))
      }

      el.addEventListener('mouseenter', onMouseEnter)
      el.addEventListener('mouseleave', onMouseLeave)

      ;(el as any)._adminMediaCleanup = () => {
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
      }
    },

    updated(el: HTMLElement, binding: DirectiveBinding<string>) {
      const path = binding.value
      if (!path) return
      el.dataset.mediaPath = path
    },

    unmounted(el: any) {
      el._adminMediaCleanup?.()
    }
  })

  // 2. Global Smart Media Auto-Scanner (Mouse & Mutation Tracking in Edit Mode)
  if (typeof window !== 'undefined') {
    let currentHoveredMedia: HTMLElement | null = null

    function scanElementForMedia(target: HTMLElement): { el: HTMLElement; path: string; url: string } | null {
      // Find closest media element
      let mediaEl: HTMLElement | null = null

      if (target instanceof HTMLImageElement || target.tagName === 'IMG' || target.tagName === 'SVG' || target.tagName === 'VIDEO') {
        mediaEl = target
      } else if (target.hasAttribute('data-media-path')) {
        mediaEl = target
      } else {
        const directImg = target.querySelector('img, svg, video')
        if (directImg && (target.clientWidth <= directImg.clientWidth + 20)) {
          mediaEl = directImg as HTMLElement
        }
      }

      if (!mediaEl) return null

      // Check for explicit or inherited edit path
      let path = mediaEl.getAttribute('data-media-path') || mediaEl.getAttribute('data-edit-path')
      if (!path) {
        const parentWithEditPath = mediaEl.closest('[data-edit-path], [data-media-path]')
        if (parentWithEditPath) {
          path = parentWithEditPath.getAttribute('data-media-path') || parentWithEditPath.getAttribute('data-edit-path')
        }
      }

      // If still no path, construct a readable path from ID, class, or src filename
      let url = ''
      if (mediaEl instanceof HTMLImageElement) {
        url = mediaEl.currentSrc || mediaEl.src
      } else {
        const img = mediaEl.querySelector('img')
        if (img) url = img.currentSrc || img.src
      }

      if (!path && url) {
        // e.g. "image:01.png"
        const cleanName = url.split('/').pop()?.split('?')[0] || 'media'
        path = `media.${cleanName}`
      }

      return {
        el: mediaEl,
        path: path || 'media.asset',
        url
      }
    }

    const onGlobalMouseMove = (e: MouseEvent) => {
      if (!state.canEdit || !state.editMode || state.mediaStudioOpen) return

      const target = e.target as HTMLElement
      if (!target) return

      // Don't trigger if hovering over admin docks or overlays
      if (target.closest('.admin-floating-dock, .media-hud, .admin-hover-badge')) return

      const scanned = scanElementForMedia(target)
      if (scanned && scanned.el !== currentHoveredMedia) {
        currentHoveredMedia = scanned.el
        window.dispatchEvent(new CustomEvent('admin:media-hover', {
          detail: { el: scanned.el, path: scanned.path, url: scanned.url }
        }))
      }
    }

    window.addEventListener('mousemove', onGlobalMouseMove, { passive: true })

    // Watch for edit mode toggle
    watch(() => state.editMode, (editMode) => {
      if (typeof document !== 'undefined') {
        document.body.classList.toggle('admin-media-edit-active', editMode)
      }
      if (process.dev && editMode) {
        logger.info('Admin:Media', 'Global Media Auto-Scanner Active')
      }
    })
  }
})
