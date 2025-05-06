// ~/plugins/motion-pop-visible.client.ts
import type { Directive, DirectiveBinding } from 'vue'
import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'

interface PopOptions {
  delay?: number    // seconds
  duration?: number // seconds
  ease?: string     // GSAP easing string
}

const popVisible: Directive<HTMLElement, PopOptions> = {
  mounted(el, binding: DirectiveBinding<PopOptions>) {
    // const { delay = 0, duration = 0.6, ease = 'power2.out' } = binding.value || {}
    CustomEase.create('smoothPop', '0.25, 0.1, 0.25, 1')  // ease-in-out cubic-bezier
    const { delay = 0, duration = 0.6, ease = 'smoothPop' } = binding.value || {}


    

    // Start hidden
    gsap.set(el, { opacity: 0, scale: 0.8, y: 80 })

    // Observe visibility
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, { opacity: 1, scale: 1, y: 0, delay, duration, ease })
        } else {
          // reset so we can replay
          gsap.set(el, { opacity: 0, scale: 0.8, y: 20 })
        }
      },
      { threshold: 0.1 }
    )

    obs.observe(el)
    ;(el as any).__popVisObserver = obs
  },

  beforeUnmount(el) {
    ;(el as any).__popVisObserver?.disconnect()
  }
}

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('memotion-pop-visible', popVisible)
})
