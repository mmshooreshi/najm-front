// ~/plugins/motion-pop-visible.client.ts
import type { Directive, DirectiveBinding } from 'vue'
import { gsap } from 'gsap'
import CustomEase from 'gsap/CustomEase'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


gsap.registerPlugin(MotionPathPlugin)
gsap.registerPlugin(ScrollTrigger)

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



interface PopUpOptions {
  delay?: number    // seconds
  duration?: number // seconds (total pop-in time)
  overshoot?: number// px to jump above
}

const popPop: Directive<HTMLElement, PopUpOptions> = {
  mounted(el, { value }) {
    // create a nice overshoot ease
    CustomEase.create('popUpEase', '0.25, 1.5, 0.5, 1')
    const {
      delay = 0,
      duration = 0.6,
      overshoot = 10
    } = value || {}

    // start hidden and just below its final spot
    gsap.set(el, { opacity: 0, scale: 0, y: 20 })

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline({ delay })
          // 1) pop up past the target (overshoot), scaling and fading in
          tl.to(el, {
            y: -overshoot,
            scale: 1.2,
            opacity: 1,
            duration: duration * 0.6,
            ease: 'popUpEase'
          })
          // 2) settle back down to y=0 and scale=1
          .to(el, {
            y: 0,
            scale: 1,
            duration: duration * 0.4,
            ease: 'power1.out'
          })
        } else {
          // reset so it can play again
          gsap.set(el, { clearProps: 'all' })
          gsap.set(el, { opacity: 0, scale: 0, y: 20 })
        }
      },
      { threshold: 0.1 }
    )

    obs.observe(el)
    ;(el as any).__popUpObs = obs
  },

  beforeUnmount(el) {
    ;(el as any).__popUpObs?.disconnect()
  }
}

interface PopSpringOptions {
  delay?: number      // seconds before starting
  duration?: number   // total seconds of the spring in-animation
  yStart?: number     // px below its resting spot
  elasticity?: number // strength of the spring (1 = full amplitude, smaller = tighter)
}

const popSpring: Directive<HTMLElement, PopSpringOptions> = {
  mounted(el, { value }) {
    const {
      delay = 0,
      duration = 0.8,
      yStart = 50,
      elasticity = 0.6
    } = value || {}

    // put it down below, invisible and shrunken
    gsap.set(el, { opacity: 0, scale: 0.8, y: yStart })

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // one tween to pop up, fade in, and spring!
          gsap.to(el, {
            opacity: 1,
            scale: 1,
            y: -100,
            delay,
            duration,
            ease: `elastic.out(1, ${elasticity})`
          })
        } else {
          // reset to initial for replay
          gsap.set(el, { opacity: 0, scale: 0.8, y: yStart })
        }
      },
      { threshold: 0.1 }
    )

    obs.observe(el)
    ;(el as any).__popSpringObs = obs
  },

  beforeUnmount(el) {
    ;(el as any).__popSpringObs?.disconnect()
  }
}



interface PopSpringOptions {
  delay?: number
  duration?: number
  yStart?: number
  elasticity?: number
}

const popSpringSc: Directive<HTMLElement, PopSpringOptions> = {
  mounted(el, { value }) {
    const {
      delay = 0,
      duration = 1,
      yStart = 50,
      elasticity = 0.6
    } = value || {}

    // set starting state
    gsap.set(el, { opacity: 0, scale: 0.8, y: yStart })

    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play none none reset',
        markers: true
      },
      opacity: 1,
      scale: 1,
      y: 0,
      delay,
      duration,
      ease: `elastic.out(1, ${elasticity})`
    })
  },

  beforeUnmount(el) {
    // kill any ScrollTrigger linked to this element
    ScrollTrigger.getAll()
      .filter(st => st.trigger === el)
      .forEach(st => st.kill())
  }
}


export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('memotion-pop-visible', popVisible)
  nuxtApp.vueApp.directive('memotion-pop-pop', popPop)
  nuxtApp.vueApp.directive('memotion-pop-spring', popSpring)
  nuxtApp.vueApp.directive('memotion-pop-springsc', popSpringSc)


})

