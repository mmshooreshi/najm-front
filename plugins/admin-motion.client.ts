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

  function findMotionContainer(el: HTMLElement | null): HTMLElement | null {
    if (!el || isInsideAdminUI(el)) return null

    // Check known motion containers or classes
    const container = el.closest(
      '.slider-container, .embla, .embla__viewport, [data-motion-container], [data-motion], .swiper, [data-carousel], .bok, .projects-intro'
    ) as HTMLElement | null

    if (container) return container

    // Check if element or parent has CSS animations or transitions active
    let curr: HTMLElement | null = el
    while (curr && curr !== document.body) {
      if (curr.hasAttribute('data-motion-container')) return curr
      const style = window.getComputedStyle(curr)
      if (style.animationName && style.animationName !== 'none') {
        return curr
      }
      curr = curr.parentElement
    }

    return null
  }

  // Mouse Move Scanner for Motion Containers in Edit Mode
  const onMouseMove = (e: MouseEvent) => {
    if (!state.canEdit || !state.editMode || state.mediaStudioOpen) return

    const target = e.target as HTMLElement
    if (!target || isInsideAdminUI(target)) return

    const container = findMotionContainer(target)
    if (container) {
      if (motionLeaveTimer) {
        clearTimeout(motionLeaveTimer)
        motionLeaveTimer = null
      }

      if (container !== activeMotionContainer) {
        activeMotionContainer = container
        // Auto-freeze motion when hovering into container in edit mode
        freezeMotion(container, false)
        window.dispatchEvent(new CustomEvent('admin:motion-container-hover', {
          detail: { container }
        }))
      }
    } else if (activeMotionContainer) {
      // Hovered outside motion container
      if (!motionLeaveTimer) {
        motionLeaveTimer = setTimeout(() => {
          if (activeMotionContainer) {
            unfreezeMotion(activeMotionContainer, false)
            activeMotionContainer = null
          }
          window.dispatchEvent(new CustomEvent('admin:motion-container-leave', {}))
        }, 200)
      }
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true })

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
