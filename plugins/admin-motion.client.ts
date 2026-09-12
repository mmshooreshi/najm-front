// plugins/admin-motion.client.ts
import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import {
  adminEditState as state,
  isElementMotionPaused,
  setGlobalMotionPaused,
  toggleGlobalMotionPaused
} from '@/store/adminEditStore'
import { useAdminMotionControl } from '@/composables/useAdminMotionControl'
import { logger } from '@/utils/logger'

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const { freezeMotion, unfreezeMotion } = useAdminMotionControl()

  let activeMotionContainer: HTMLElement | null = null
  let motionLeaveTimer: any = null

  function isInsideAdminUI(target: HTMLElement | null): boolean {
    if (!target) return false
    return !!(
      target.closest('[data-admin-ui="true"]') ||
      target.closest('.admin-media-overlay-hud') ||
      target.closest('.admin-motion-pill') ||
      target.closest('.media-hud') ||
      target.closest('.admin-floating-dock') ||
      target.closest('.admin-hover-badge') ||
      target.closest('.admin-modal') ||
      target.closest('.toast-container')
    )
  }

  const MOTION_SELECTOR = '.slider-container, .embla, .embla__viewport, [data-motion-container], [data-motion], .swiper, [data-carousel], .bok, .projects-intro'

  function findMotionContainer(el: HTMLElement | null): HTMLElement | null {
    if (!el || isInsideAdminUI(el)) return null
    return el.closest(MOTION_SELECTOR) as HTMLElement | null
  }

  // Use pointerover (only fires when entering an element) instead of mousemove (fires every pixel)
  let lastTarget: HTMLElement | null = null

  const onPointerOver = (e: PointerEvent) => {
    if (!state.canEdit || !state.editMode || state.mediaStudioOpen) return

    const target = e.target as HTMLElement
    if (!target || target === lastTarget || isInsideAdminUI(target)) return
    lastTarget = target

    const container = findMotionContainer(target)
    if (container) {
      if (motionLeaveTimer) {
        clearTimeout(motionLeaveTimer)
        motionLeaveTimer = null
      }

      if (container !== activeMotionContainer) {
        activeMotionContainer = container
        freezeMotion(container, false)
        window.dispatchEvent(new CustomEvent('admin:motion-container-hover', {
          detail: { container }
        }))
      }
    } else if (activeMotionContainer) {
      if (!motionLeaveTimer) {
        motionLeaveTimer = setTimeout(() => {
          if (activeMotionContainer) {
            unfreezeMotion(activeMotionContainer, false)
            activeMotionContainer = null
          }
          window.dispatchEvent(new CustomEvent('admin:motion-container-leave', {}))
        }, 150)
      }
    }
  }

  window.addEventListener('pointerover', onPointerOver, { passive: true })

  // Listen to Edit Mode changes
  watch(() => state.editMode, (editMode) => {
    if (!editMode && activeMotionContainer) {
      unfreezeMotion(activeMotionContainer, true)
      activeMotionContainer = null
    }
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('admin-motion-active', editMode)
    }
    if (process.dev && editMode) {
      logger.info('Admin:Motion', 'Motion Auto-Freeze & Controller Active')
    }
  })
})
