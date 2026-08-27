// plugins/admin-media.client.ts
import { defineNuxtPlugin } from '#app'
import { watch, type DirectiveBinding } from 'vue'
import {
  adminEditState as state,
  ensureBaseline,
  selectMediaElement,
  clearMediaSelection
} from '@/store/adminEditStore'
import { logger } from '@/utils/logger'

export default defineNuxtPlugin(nuxtApp => {
  // Helper to check if an element is inside any admin UI or control
  function isInsideAdminUI(target: HTMLElement | null): boolean {
    if (!target) return false
    return !!(
      target.closest('[data-admin-ui="true"]') ||
      target.closest('.admin-media-overlay-hud') ||
      target.closest('.media-hud') ||
      target.closest('.admin-floating-dock') ||
      target.closest('.admin-edit-bar') ||
      target.closest('.admin-hover-badge') ||
      target.closest('.admin-modal') ||
      target.closest('.toast-container') ||
      target.closest('.admin-item-actions') ||
      target.closest('.admin-add-placeholder') ||
      target.closest('button') ||
      target.closest('.iconify')
    )
  }

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

      const onMouseEnter = (e: MouseEvent) => {
        if (!state.canEdit || !state.editMode || state.mediaStudioOpen || isInsideAdminUI(el)) return
        window.dispatchEvent(new CustomEvent('admin:media-hover', {
          detail: { el, path, url: initialUrl }
        }))
      }

      const onClick = (e: MouseEvent) => {
        if (!state.canEdit || !state.editMode || isInsideAdminUI(el)) return
        e.stopPropagation()
        selectMediaElement(el, path, initialUrl)
        window.dispatchEvent(new CustomEvent('admin:media-hover', {
          detail: { el, path, url: initialUrl, locked: true }
        }))
      }

      el.addEventListener('mouseenter', onMouseEnter)
      el.addEventListener('click', onClick)

      ;(el as any)._adminMediaCleanup = () => {
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('click', onClick)
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

  // 2. Global Smart Media Auto-Scanner (Mouse, Click & Selection Tracking in Edit Mode)
  if (typeof window !== 'undefined') {
    let currentHoveredMedia: HTMLElement | null = null

    function scanElementForMedia(target: HTMLElement): { el: HTMLElement; path: string; url: string } | null {
      if (isInsideAdminUI(target)) return null

      // Exclude standalone icons, SVGs or small glyphs
      if (target.tagName === 'svg' || target.classList.contains('iconify') || target.tagName === 'path') {
        return null
      }

      let mediaEl: HTMLElement | null = null

      if (target instanceof HTMLImageElement || target.tagName === 'IMG' || target.tagName === 'PICTURE' || target.tagName === 'VIDEO') {
        // Exclude tiny icon-sized images
        if (target.clientWidth > 24 && target.clientHeight > 24) {
          mediaEl = target
        }
      } else if (target.hasAttribute('data-media-path')) {
        mediaEl = target
      } else {
        // Check for direct child img
        const directImg = target.querySelector('img, picture, video')
        if (directImg && directImg.clientWidth > 32 && (target.clientWidth <= directImg.clientWidth + 24)) {
          mediaEl = directImg as HTMLElement
        }
      }

      if (!mediaEl || isInsideAdminUI(mediaEl)) return null

      let path = mediaEl.getAttribute('data-media-path') || mediaEl.getAttribute('data-edit-path')
      if (!path) {
        const parentWithEditPath = mediaEl.closest('[data-edit-path], [data-media-path]')
        if (parentWithEditPath && !isInsideAdminUI(parentWithEditPath as HTMLElement)) {
          path = parentWithEditPath.getAttribute('data-media-path') || parentWithEditPath.getAttribute('data-edit-path')
        }
      }

      let url = ''
      if (mediaEl instanceof HTMLImageElement) {
        url = mediaEl.currentSrc || mediaEl.src
      } else {
        const img = mediaEl.querySelector('img')
        if (img) url = img.currentSrc || img.src
      }

      if (!path && url) {
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
      if (!target || isInsideAdminUI(target)) return

      const scanned = scanElementForMedia(target)
      if (scanned && scanned.el !== currentHoveredMedia) {
        currentHoveredMedia = scanned.el
        window.dispatchEvent(new CustomEvent('admin:media-hover', {
          detail: { el: scanned.el, path: scanned.path, url: scanned.url }
        }))
      }
    }

    const onGlobalClick = (e: MouseEvent) => {
      if (!state.canEdit || !state.editMode || state.mediaStudioOpen) return

      const target = e.target as HTMLElement
      if (!target || isInsideAdminUI(target)) return

      const scanned = scanElementForMedia(target)
      if (scanned) {
        selectMediaElement(scanned.el, scanned.path, scanned.url)
        window.dispatchEvent(new CustomEvent('admin:media-hover', {
          detail: { el: scanned.el, path: scanned.path, url: scanned.url, locked: true }
        }))
      }
    }

    window.addEventListener('mousemove', onGlobalMouseMove, { passive: true })
    window.addEventListener('click', onGlobalClick, { capture: true })

    // Watch for edit mode toggle
    watch(() => state.editMode, (editMode) => {
      if (typeof document !== 'undefined') {
        document.body.classList.toggle('admin-media-edit-active', editMode)
        if (!editMode) {
          clearMediaSelection()
        }
      }
      if (process.dev && editMode) {
        logger.info('Admin:Media', 'Global Media Auto-Scanner Active')
      }
    })
  }
})
