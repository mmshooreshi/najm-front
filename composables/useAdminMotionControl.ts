// composables/useAdminMotionControl.ts
import { ref } from 'vue'
import {
  adminEditState as state,
  pauseMotionElement,
  resumeMotionElement,
  setGlobalMotionPaused,
  toggleGlobalMotionPaused,
  isElementMotionPaused
} from '@/store/adminEditStore'
import { logger } from '@/utils/logger'

export function useAdminMotionControl() {
  const MOTION_CONTAINER_SELECTOR = '.slider-container, .slider-inner, .embla, .embla__viewport, .swiper, [data-motion-container], [data-motion], .projects-intro, .bok'

  /**
   * Find motion ancestor container for an element (fast closest lookup)
   */
  function getMotionAncestors(el: HTMLElement | null): HTMLElement[] {
    if (!el) return []
    const container = el.closest(MOTION_CONTAINER_SELECTOR) as HTMLElement | null
    return container && container !== el ? [container] : []
  }

  /**
   * Freezes animation on a target container or element AND its motion parent:
   * 1. CSS animations & transitions (`.admin-motion-paused`)
   * 2. GSAP tweens associated with element
   * 3. Embla/Swiper carousel autoplay instances
   */
  function freezeMotion(el: HTMLElement | null, manualLock = false) {
    if (!el) return
    const elementsToFreeze = [el, ...getMotionAncestors(el)]

    for (const item of elementsToFreeze) {
      pauseMotionElement(item)
      if (manualLock) {
        item.setAttribute('data-motion-locked', 'true')
      }

      // GSAP pause on item itself (never querySelectorAll entire DOM subtree)
      try {
        const gsap = (window as any).gsap
        if (gsap) {
          const tweens = gsap.getTweensOf(item) || []
          tweens.forEach((t: any) => t?.pause?.())
        }
      } catch {}

      // Dispatch custom event for physics loops / carousels
      window.dispatchEvent(new CustomEvent('admin:motion-freeze', {
        detail: { el: item, locked: manualLock }
      }))
    }
  }

  /**
   * Resumes animation on a target container or element
   */
  function unfreezeMotion(el: HTMLElement | null, force = false) {
    if (!el) return
    const elementsToResume = [el, ...getMotionAncestors(el)]

    for (const item of elementsToResume) {
      if (!force && item.getAttribute('data-motion-locked') === 'true') {
        continue // Respect manual lock
      }

      item.removeAttribute('data-motion-locked')
      resumeMotionElement(item)

      // GSAP resume
      try {
        const gsap = (window as any).gsap
        if (gsap) {
          const tweens = gsap.getTweensOf(item) || []
          tweens.forEach((t: any) => t?.play?.())
        }
      } catch {}

      window.dispatchEvent(new CustomEvent('admin:motion-resume', {
        detail: { el: item }
      }))
    }
  }

  /**
   * Toggles pause/play on a target container
   */
  function toggleMotion(el: HTMLElement | null) {
    if (!el) return
    const currentlyPaused = isElementMotionPaused(el)
    if (currentlyPaused) {
      unfreezeMotion(el, true)
    } else {
      freezeMotion(el, true)
    }
  }

  return {
    freezeMotion,
    unfreezeMotion,
    toggleMotion,
    setGlobalMotionPaused,
    toggleGlobalMotionPaused,
    isElementMotionPaused,
    getMotionAncestors
  }
}
