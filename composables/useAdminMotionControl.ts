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
  /**
   * Find all motion ancestor containers for an element
   */
  function getMotionAncestors(el: HTMLElement | null): HTMLElement[] {
    const list: HTMLElement[] = []
    if (!el) return list

    let curr: HTMLElement | null = el.parentElement
    while (curr && curr !== document.body) {
      if (
        curr.classList.contains('slider-container') ||
        curr.classList.contains('slider-inner') ||
        curr.classList.contains('embla') ||
        curr.classList.contains('embla__viewport') ||
        curr.classList.contains('swiper') ||
        curr.hasAttribute('data-motion-container') ||
        curr.hasAttribute('data-motion') ||
        curr.classList.contains('projects-intro') ||
        curr.classList.contains('bok')
      ) {
        list.push(curr)
      } else {
        const style = window.getComputedStyle(curr)
        if (style.animationName && style.animationName !== 'none') {
          list.push(curr)
        }
      }
      curr = curr.parentElement
    }
    return list
  }

  /**
   * Freezes animation on a target container or element AND all its motion parents:
   * 1. CSS animations & transitions (`.admin-motion-paused`)
   * 2. GSAP tweens associated with element, children, and ancestors
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

      // GSAP pause
      try {
        const gsap = (window as any).gsap
        if (gsap) {
          const tweens = gsap.getTweensOf(item) || []
          const childTweens = gsap.getTweensOf(item.querySelectorAll('*')) || []
          ;[...tweens, ...childTweens].forEach((t: any) => t?.pause?.())
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
          const childTweens = gsap.getTweensOf(item.querySelectorAll('*')) || []
          ;[...tweens, ...childTweens].forEach((t: any) => t?.play?.())
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
