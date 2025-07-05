// plugins/floating.client.ts
import type { Directive, DirectiveBinding } from 'vue'

const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 }

interface FloatingOptions {
    delay?: number;      // seconds before starting
    duration?: number;   // total seconds of the spring in-animation
    yStart?: number;     // px below its resting spot
    elasticity?: number; // strength of the spring (1 = full amplitude, smaller = tighter)
    rootSelector?: string; // CSS selector for custom IntersectionObserver root
  }
  
  
export const floating: Directive<HTMLElement, FloatingOptions> = {
    
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const duration = binding.value?.duration || 3
    const distance = binding.value?.distance || 10

    // attach inline keyframe styles
    el.style.setProperty(
      '--float-distance', `${distance}px`
    )
    el.style.setProperty(
      '--float-duration', `${duration}s`
    )

    // when in view, add class to start animation
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('floating')
      } else {
        el.classList.remove('floating')
      }
    }, observerOptions)

    io.observe(el)
    ;(el as any).__floatingObserver = io
  },
  unmounted(el: HTMLElement) {
    ;(el as any).__floatingObserver.disconnect()
  }
}




export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('memotion-pop-visible', floating)

})


