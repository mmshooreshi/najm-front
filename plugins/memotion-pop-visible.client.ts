// plugins/memotion-pop-visible.client.ts
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
  ystart?: number
  xstart?: number

}

const popVisible: Directive<HTMLElement, PopOptions> = {
  mounted(el, binding: DirectiveBinding<PopOptions>) {
    // const { delay = 0, duration = 0.6, ease = 'power2.out' } = binding.value || {}
    CustomEase.create('smoothPop', '0.25, 0.1, 0.25, 1')  // ease-in-out cubic-bezier
    const { delay = 0, duration = 0.6, ease = 'smoothPop', ystart = 20, xstart = 0 } = binding.value || {}


    

    // Start hidden
    gsap.set(el, { opacity: 0, scale: 0, y: ystart, x: xstart })

    // Observe visibility
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, { opacity: 1, scale: 1, y: 0, x:0, delay, duration, ease })
        } else {
          
          // reset so we can replay
          // gsap.set(el, { opacity: 0, scale: 0.8, y: ystart })
        }
      },
      { threshold: 0.01 }
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
  delay?: number;      // seconds before starting
  duration?: number;   // total seconds of the spring in-animation
  yStart?: number;     // px below its resting spot
  elasticity?: number; // strength of the spring (1 = full amplitude, smaller = tighter)
  rootSelector?: string; // CSS selector for custom IntersectionObserver root
}

export const popSpring: Directive<HTMLElement, PopSpringOptions> = {
  mounted(el, binding) {
    const {
      delay = 0,
      duration = 0.8,
      yStart = 100,
      elasticity = 0.6,
      rootSelector
    } = binding.value || {};

    // initial state
    gsap.set(el, { autoAlpha: 0, scale: 0.8, y: yStart });

    // animate in function
    const animateIn = () => {
      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { autoAlpha: 0, scale: 0.8, y: yStart },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          delay,
          duration,
          ease: `elastic.out(1, ${elasticity})`
        }
      );
    };

    // observer callback
    const onIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) animateIn();
        else gsap.set(el, { autoAlpha: 0, scale: 0.8, y: yStart });
      });
    };

    // detect custom root (e.g. carousel viewport) or default to viewport
    const root = rootSelector
      ? document.querySelector(rootSelector)
      : null;

    const observer = new IntersectionObserver(onIntersect, {
      root: root as Element,
      threshold: 0.1
    });

    observer.observe(el);
    (el as any).__popSpringObserver = observer;
  },

  beforeUnmount(el) {
    (el as any).__popSpringObserver?.disconnect();
  }
};





/**
 * v-pop-cards: Animates cards popping in
 * Usage: <div v-pop-cards="{ delay: idx*0.2, duration:0.8 }">...</div>
 */
const popCards: Directive<HTMLElement, { delay?: number; duration?: number }> = {
  mounted(el, binding) {
    // register our custom ease if not already
    if (!gsap.parseEase('customPop')) {
      CustomEase.create('customPop', '0.3,0.5,0.2,1')
    }

    const { delay = 0, duration = 0.8 } = binding.value || {}

    // initial styles
    gsap.set(el, { autoAlpha: 0, scale: 0, transformOrigin: 'center center' })
    const img = el.querySelector<HTMLImageElement>('img')
    if (img) {
      gsap.set(img, { scale: 1.3, transformOrigin: 'center center' })
    }

    // red dot
    const dot = document.createElement('div')
    Object.assign(dot.style, {
      position: 'absolute',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: 'red',
      pointerEvents: 'none',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(0)',
      zIndex: '10',
    })
    el.style.position = 'relative'
    el.appendChild(dot)

    // side bars
    const sides = ['top', 'right', 'bottom', 'left'] as const
    const bars = sides.map(side => {
      const bar = document.createElement('div')
      Object.assign(bar.style, {
        position: 'absolute',
        backgroundColor: 'red',
        opacity: '0',
        zIndex: '9',
      })
      if (side === 'top' || side === 'bottom') {
        Object.assign(bar.style, { height: '4px', width: '100%', left: '0', [side]: '0' })
      } else {
        Object.assign(bar.style, { width: '4px', height: '100%', top: '0', [side]: '0' })
      }
      el.appendChild(bar)
      return bar
    })

    // build timeline
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'customPop' } })
    tl.to(el, { autoAlpha: 1, scale: 1, duration, delay })
    if (img) {
      tl.to(img, { scale: 1, duration: duration * 1.2 }, `-=${duration * 0.6}`)
    }
    tl.to(dot, { scale: 1, duration: 0.3 }, `-=${duration * 0.4}`)
    bars.forEach((bar, i) => {
      const speed = duration * (0.5 + Math.random() * 0.5)
      tl.to(bar, { opacity: 1, duration: speed }, `-=${duration * 0.7 + i * 0.1}`)
    })

    // observe visibility: play when ≥0.1% visible, reset when 0% visible
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.target !== el) continue
          if (entry.intersectionRatio > 0) {
            tl.play()
          } else {
            tl.pause().seek(0)
          }
        }
      },
      { threshold: [0] }
    )
    observer.observe(el)

    // store for cleanup
    ;(el as any).__popCardsObserver = observer
  },

  beforeUnmount(el) {
    const obs = (el as any).__popCardsObserver as IntersectionObserver
    if (obs) obs.disconnect()
  },
}


/**
 * v-pop-cards: Animates cards popping in with debug controls,
 * red indicator, and side extensions.
 * Usage: <div v-pop-cards="{ delay: idx*0.2, duration:0.8 }">...</div>
 */
const popCardsPrev: Directive<HTMLElement, { delay?: number; duration?: number }> = {
  mounted(el, binding) {
    // Setup custom ease once
    if (!gsap.parseEase('customPop')) {
      CustomEase.create('customPop', '0.3, 0.5, 0.2, 1')
    }
    const { delay = 0, duration = 0.8 } = binding.value || {}

    // Prepare element
    gsap.set(el, { autoAlpha: 0, scale: 0, transformOrigin: 'center center' })
    const img = el.querySelector<HTMLImageElement>('img')
    if (img) {
      gsap.set(img, { scale: 1.3, transformOrigin: 'center center' })
    }
    

    // Create red dot
    const dot = document.createElement('div')
    // Object.assign(dot.style, {
    //   position: 'absolute',
    //   width: '50px',
    //   height: '50px',
    //   borderRadius: '50%',
    //   backgroundColor: 'red',
    //   pointerEvents: 'none',
    //   top: '50%',
    //   left: '50%',
    //   transform: 'translate(-50%, -50%) scale(0)',
    //   zIndex: '10'
    // })
    el.style.position = 'relative'
    el.appendChild(dot)

    // Create side bars
    const sides: ('top'|'right'|'bottom'|'left')[] = ['top','right','bottom','left']
    const bars: HTMLElement[] = sides.map(side => {
      const bar = document.createElement('div')
      Object.assign(bar.style, {
        position: 'absolute',
        backgroundColor: 'red',
        opacity: '0',
        zIndex: '9'
      })
      if (side === 'top' || side === 'bottom') {
        bar.style.height = '4px'
        bar.style.width = '100%'
        bar.style.left = '0'
        bar.style[side] = '0'
      } else {
        bar.style.width = '4px'
        bar.style.height = '100%'
        bar.style.top = '0'
        bar.style[side] = '0'
      }
      el.appendChild(bar)
      return bar
    })

    // Timeline
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'customPop' } })
    tl.to(el, { autoAlpha: 1, scale: 1, duration, delay })
    if (img) {
      tl.to(img, { scale: 1, duration: duration * 1.2 }, `-=${duration * 0.6}`)
    }
    tl.to(dot, { scale: 1, duration: 0.3 }, `-=${duration * 0.4}`)
    // bars.forEach((bar, i) => {
    //   const speed = duration * (0.5 + Math.random() * 0.5)
    //   tl.to(bar, { opacity: 1, duration: speed }, `-=${duration * 0.7 + i * 0.1}`)
    // })

    // Intersection observer for auto-play & reset
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === el) {
          if (entry.isIntersecting) tl.play()
          else tl.pause().seek(0)
        }
      })
    }, { threshold: 0.01 })
    observer.observe(el)

    // Debug controls
    const controls = document.createElement('div')
    Object.assign(controls.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      display: 'flex',
      gap: '4px',
      zIndex: '20'
    })
    type Action = 'play'|'restart'|'reverse'|'reset'
    const actions: Action[] = ['play','restart','reverse','reset']
    actions.forEach(action => {
      const btn = document.createElement('button')
      btn.textContent = action
      btn.style.padding = '4px'
      btn.addEventListener('click', () => {
        switch (action) {
          case 'play': tl.play(); break
          case 'restart': tl.restart(); break
          case 'reverse': tl.reverse(); break
          case 'reset': tl.pause().seek(0); break
        }
      })
      // controls.appendChild(btn)
    })
    el.appendChild(controls)

    // Store observer for cleanup
    ;(el as any).__popCardsObserver = observer
  },
  beforeUnmount(el) {
    const obs = (el as any).__popCardsObserver as IntersectionObserver
    if (obs) obs.disconnect()
  }
}

/**
 * Directive for text bubbles with staggered delay relative to parent cards.
 * Usage: v-pop-text="{ delay: 0.3, duration: 0.5 }"
 */
const popText: Directive<HTMLElement, { delay?: number; duration?: number }> = {
  mounted(el, binding: DirectiveBinding<{ delay?: number; duration?: number }>) {
    CustomEase.create('smoothFade', '0.4, 0, 0.2, 1')
    const { delay = 0.3, duration = 0.5 } = binding.value || {}

    gsap.set(el, { opacity: 0, y: 20 })

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, { opacity: 1, y: 0, delay, duration, ease: 'smoothFade' })
        } else {
          gsap.set(el, { opacity: 0, y: 20 })
        }
      },
      { threshold: 0.1 }
    )

    obs.observe(el)
    ;(el as any).__popTextObserver = obs
  },

  beforeUnmount(el) {
    ;(el as any).__popTextObserver?.disconnect()
  }
}


export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('memotion-pop-visible', popVisible)
  nuxtApp.vueApp.directive('memotion-pop-pop', popPop)
  nuxtApp.vueApp.directive('memotion-pop-spring', popSpring)
  nuxtApp.vueApp.directive('memotion-pop-cards', popCards)
  nuxtApp.vueApp.directive('memotion-pop-text', popText)


})

