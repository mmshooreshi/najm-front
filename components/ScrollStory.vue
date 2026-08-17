<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin' // Used for smooth exit

gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin)

const images = [
    '/images/about/solution-1.png',
    '/images/about/solution-2.png',
    '/images/about/solution-3.png',
    '/images/about/solution-4.png',
]

const containerRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const imagesRef = ref<HTMLImageElement[]>([])

const setImageRef = (el: HTMLImageElement | null, index: number) => {
    if (el) imagesRef.value[index] = el
}

let ctx: gsap.Context

onMounted(() => {
    ctx = gsap.context(() => {

        // --- 1. CONFIGURATION ---
        const SLIDE_DURATION = 0.4 // Slower = Smoother
        const SLIDE_EASE = 'easeOutQuart' // 'sine.inOut' or 'power1.inOut' are the smoothest curves

        // The Master Timeline (Paused, we control time manually)
        const tl = gsap.timeline({
            paused: true,
            defaults: {
                duration: SLIDE_DURATION,
                ease: SLIDE_EASE
            }
        })

        // --- 2. BUILD ANIMATION ---
        // Init state: Text visible, Images down
        gsap.set(imagesRef.value, { yPercent: 300, opacity: 1, filter: 'blur(10px)', scale: 0.5  })

        // Label 0: Start
        tl.addLabel('step-0')

        // Step 1: Text leaves, Image 1 enters
        tl.to(textRef.value, { y: -250, opacity: 0, filter: 'blur(5px)', scale: 1.2, duration: SLIDE_DURATION * 0.9 })
            .to(imagesRef.value[0], { yPercent: 0, filter: 'none', scale: 1, duration: SLIDE_DURATION }, '<')
        tl.addLabel('step-1')

        // Steps 2..N: Image Swaps
        for (let i = 1; i < images.length; i++) {
            const prevImg = imagesRef.value[i - 1]
            const currentImg = imagesRef.value[i]

            // Previous image moves UP and fades
            tl.to(prevImg, { yPercent: -150,  opacity: 0,  scale: 0.9, filter: 'blur(20px)'  }, `>`)
            // Current image moves UP from bottom (overlapping slightly for smoothness)
            tl.to(currentImg, { yPercent: 0, filter: 'none', scale: 1 }, `<`)

            tl.addLabel(`step-${i + 1}`)
        }

        // Final Step: Last image leaves
        tl.to(imagesRef.value[images.length - 1], { yPercent: -100, opacity: 0 })
        tl.addLabel('end')


        // --- 3. THE BRAIN (Observer) ---
        const totalSteps = images.length + 1 // +1 because of the intro text step
        let currentIndex = 0
        let isAnimating = false // THE GUARD
        let gestureLocked = false
        let unlockTO: any
        const QUIET_MS = 0 // increase to 320–450 if you still get momentum re-triggers

        let activeEl: HTMLElement | HTMLImageElement | null = null

        const getActiveImage = () => {
            const imgIndex = currentIndex - 1 // step-1 => image[0]
            return imgIndex >= 0 && imgIndex < imagesRef.value.length ? imagesRef.value[imgIndex] : null
        }

        const armUnlock = () => {
            clearTimeout(unlockTO)
            unlockTO = setTimeout(() => {
                if (isAnimating) return armUnlock() // don't unlock mid-tween
                gestureLocked = false
            }, QUIET_MS)
        }


        const isTouchLike = (self: any) =>
            self.event?.type?.includes('touch') || self.event?.pointerType === 'touch'

        const next = () => {
            if (currentIndex < totalSteps) {
                currentIndex++
                gotoStep(currentIndex)
            } else {
                isAnimating = true
                const st = ScrollTrigger.getById('pinned-trigger')
                if (st) {
                    gsap.to(window, {
                        scrollTo: st.end + 1,
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onComplete: () => { isAnimating = false },
                    })
                }
            }
        }

        const prev = () => {
            if (currentIndex > 0) {
                currentIndex--
                gotoStep(currentIndex)
            } else {
                isAnimating = true
                const st = ScrollTrigger.getById('pinned-trigger')
                if (st) {
                    gsap.to(window, {
                        scrollTo: st.start - 50,
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onComplete: () => { isAnimating = false },
                    })
                }
            }
        }

        // Helper: Safely animate to index
        const gotoStep = (index: number) => {
            // 1. LOCK: Stop all input immediately
            isAnimating = true

            const label = index === totalSteps ? 'end' : `step-${index}`

            tl.tweenTo(label, {
                duration: SLIDE_DURATION,
                ease: SLIDE_EASE,
                onComplete: () => {
                    // 2. UNLOCK: Only after animation is 100% done
                    isAnimating = false
                }
            })
        }
let touchConsumed = false

Observer.create({
  target: containerRef.value,
  type: 'touch,pointer',
  preventDefault: true,
  tolerance: 10,

  onPress: () => { touchConsumed = false },
  onRelease: () => { touchConsumed = false },

  onDown: (self: any) => {
    if (isAnimating || touchConsumed) return
    touchConsumed = true
    // for touch, your direction swap logic:
    prev()
  },

  onUp: (self: any) => {
    if (isAnimating || touchConsumed) return
    touchConsumed = true
    next()
  },
})

Observer.create({
  target: containerRef.value,
  type: 'wheel',
  preventDefault: true,

  // Key idea: make this big enough that inertia doesn't cross it,
  // but a deliberate scroll does. You'll have to tune per device.
  tolerance: 200,

  // optional: reduces sensitivity further (tune as needed)
  wheelSpeed: 0,

  onDown: () => {
    console.log("DOWN")
    if (isAnimating) return
    console.log("change step")
    next()
  },
  onUp: () => {
    console.log("UP")
    if (isAnimating) return
    console.log("change step")
    prev()
  },
})

        // Observer.create({
        //     target: containerRef.value,
        //     type: 'wheel,touch,pointer',
        //     preventDefault: true, // We hijack ALL scroll in this section
        //     tolerance: 50,        // Sensitivity buffer
        //     onDown: (self: any) => {
        //         console.log("down", "gestureLocked: ", gestureLocked, "isAnimating: ", isAnimating)
        //         armUnlock()
        //         if (isAnimating || gestureLocked) return
        //         gestureLocked = true

        //         isTouchLike(self) ? prev() : next()   // FIX: touch direction swap
        //     },
        //     onUp: (self: any) => {
        //         console.log("up", "gestureLocked: ", gestureLocked, "isAnimating: ", isAnimating)
        //         armUnlock()
        //         if (isAnimating || gestureLocked) return
        //         gestureLocked = true
        //         isTouchLike(self) ? next() : prev()   // FIX: touch direction swap
        //     },
        //     onPress: (self: any) => {
        //         if (!isTouchLike(self)) return
        //         activeEl = getActiveImage()
        //         if (!activeEl) return
        //         gsap.to(activeEl, { scale: 1.06, duration: 0.12, ease: 'sine.out', overwrite: 'auto' })
        //     },

        //     onDrag: (self: any) => {
        //         if (!isTouchLike(self) || !activeEl) return
        //         // “bounce under finger”: follow the finger with a soft lag
        //         gsap.to(activeEl, {
        //             x: self.deltaX * 0.35,
        //             y: self.deltaY * 0.35,
        //             duration: 0.12,
        //             ease: 'power2.out',
        //             overwrite: 'auto',
        //         })
        //     },

        //     onRelease: (self: any) => {
        //         if (!isTouchLike(self) || !activeEl) return
        //         gsap.to(activeEl, {
        //             x: 0,
        //             y: 0,
        //             scale: 1,
        //             duration: 0.35,
        //             ease: 'elastic.out(1, 0.45)',
        //             overwrite: 'auto',
        //         })
        //         activeEl = null
        //     },

        // })

        // --- 4. THE ANCHOR (Pinning) ---
        ScrollTrigger.create({
            id: 'pinned-trigger',
            trigger: containerRef.value,
            start: 'top top',
            end: '+=1', // We don't need scroll distance, just the pin
            pin: true,
            scrub: false, // Strictly controlled by Observer
        })

    }, containerRef.value!)
})

onUnmounted(() => {
    ctx.revert()
})
</script>

<template>
    <div class="page-wrapper">

        <div ref="containerRef" class="pinned-container">
            <div class="grid-stack">

                <div ref="textRef" class="intro-text grid-item">
                    <h1>The Story</h1>
                    <p>Scroll to explore</p>
                </div>

                <img v-for="(src, i) in images" :key="i" :src="src"
                    :ref="(el) => setImageRef(el as HTMLImageElement, i)" class="story-img grid-item" alt="Solution" />

            </div>
        </div>

        <div class="spacer">
            <h2>End of Story</h2>
        </div>

    </div>
</template>

<style scoped>
/* Same CSS - No changes needed here */
* {
    box-sizing: border-box;
}

.page-wrapper {
    background-color: #050505;
    color: white;
    width: 100%;
    overflow-x: hidden;
}

.pinned-container {
    height: 100dvh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
}

.grid-stack {
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    grid-template-areas: "stack";
}

.grid-item {
    grid-area: stack;
    will-change: transform;
}

.intro-text {
    text-align: center;
    z-index: 10;
}

.intro-text h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.story-img {
    width: 90%;
    max-width: 300px;
    aspect-ratio: 6/7;
    object-fit: cover;
    border-radius: 25px;
    /* box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6); */
    z-index: 20;
}

.spacer {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111;
}
</style>