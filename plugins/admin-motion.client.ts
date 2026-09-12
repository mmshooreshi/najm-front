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

  // Motion control is now purely user-directed via AdminEditBar (⌘P or dock button)
  // Zero mousemove/pointerover listeners = zero CPU overhead

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
