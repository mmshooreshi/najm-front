<template>
    <div
      ref="slider"
      class="slider-container relative w-full h-[70vh] touch-none"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousemove="throttledMouseMove"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="slider-inner absolute flex">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="image-item absolute"
          :style="getStyle(image, index)"
          @mouseenter="() => handleElementHover(image)"
          @mouseleave="() => resetElement(image)"
        >
          <img
            :src="`/images/${image.src}`"
            :alt="image.name"
            class="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useWindowSize, useThrottleFn } from '@vueuse/core'
  
  /* -------------------------------------------------------------------------
     Image Data – Adjust as needed!
  -------------------------------------------------------------------------- */
  const images = [
    { name: "Open Paper Box", src: "open-paper-box-mockup-half-side-view-2-8943.png", width: 145, height: 152, left: -52, top: 91, rotate: -12, zIndex: 1 },
    { name: "Kraft Paper Mailing Box", src: "kraft-paper-open-mailing-box-mockup-2-6737.png", width: 239, height: 210, left: 74, top: -4, rotate: 8, zIndex: 2 },
    { name: "Free Coffee Branding", src: "Free-Coffee-Branding-PSD-Mockup-1.png", width: 167, height: 167, left: 180, top: 106, rotate: -8, zIndex: 3 },
    { name: "Free Coffee Cup Paper Holder", src: "Free-Coffee-Cup-Paper-Holder-Mockup-1.png", width: 158, height: 189, left: 264, top: 66, rotate: 15, zIndex: 4 },
    { name: "Free Lunch Kraft Paper Bag", src: "Free-Lunch-Kraft-Paper-Bag-Mockup-1.png", width: 122, height: 216, left: 429, top: 42, rotate: 10, zIndex: 5 },
    { name: "Free Facial Tissue Box", src: "Free-Facial-Tissue-Box-Mockup-1.png", width: 181, height: 153, left: 460, top: 140, rotate: 7, zIndex: 6 },
    { name: "Kraft Paper Shopping Bag", src: "free-kraft-paper-shopping-bag-mockup-1.png", width: 123, height: 220, left: 588, top: 37, rotate: -6, zIndex: 7 },
    { name: "Floating Square Gift Box", src: "floating-square-gIft-box-mockup-2-6828.png", width: 156, height: 152, left: 720, top: 132, rotate: -10, zIndex: 8 },
    { name: "Cardboard Paper Box with Handle", src: "cardboard-paper-box-with-handle-mockup-2-10296.png", width: 178, height: 168, left: 768, top: 42, rotate: 5, zIndex: 9 },
    { name: "Free Floating Hardcover Book", src: "Free-Floating-Hardcover-Book-Mockup-1.png", width: 140, height: 194, left: 916, top: 100, rotate: -5, zIndex: 10 },
    { name: "Open Paper Box", src: "open-paper-box-mockup-half-side-view-2-8943.png", width: 144, height: 151, left: 1002, top: 175, rotate: -8, zIndex: 11 },
    { name: "Kraft Paper Shopping Bag", src: "free-kraft-paper-shopping-bag-mockup-1.png", width: 141, height: 221, left: 1120, top: 18, rotate: 2, zIndex: 12 },
    { name: "Free Coffee Branding", src: "Free-Coffee-Branding-PSD-Mockup-1.png", width: 168, height: 167, left: 1269, top: 117, rotate: -6, zIndex: 13 },
    { name: "Floating Square Gift Box", src: "floating-square-gIft-box-mockup-2-6828.png", width: 156, height: 152, left: 1331, top: 20, rotate: -12, zIndex: 14 },
    { name: "Kraft Paper Mailing Box", src: "kraft-paper-open-mailing-box-mockup-2-6737.png", width: 216, height: 190, left: 1406, top: 49, rotate: 5, zIndex: 15 },
    { name: "Free Lunch Kraft Paper Bag", src: "Free-Lunch-Kraft-Paper-Bag-Mockup-1.png", width: 138, height: 218, left: 1577, top: 25, rotate: -4, zIndex: 16 },
    { name: "Free Facial Tissue Box", src: "Free-Facial-Tissue-Box-Mockup-1.png", width: 181, height: 153, left: 1591, top: 184, rotate: 7, zIndex: 17 },
    { name: "Free Coffee Cup Paper Holder", src: "Free-Coffee-Cup-Paper-Holder-Mockup-1.png", width: 158, height: 189, left: 1717, top: 77, rotate: 15, zIndex: 18 },
    { name: "Free Floating Hardcover Book", src: "Free-Floating-Hardcover-Book-Mockup-1.png", width: 140, height: 194, left: 1862, top: 111, rotate: -5, zIndex: 19 },
    { name: "Cardboard Paper Box with Handle", src: "cardboard-paper-box-with-handle-mockup-2-10296.png", width: 181, height: 168, left: 1946, top: 116, rotate: 6, zIndex: 20 }
  ]
  
  /* -------------------------------------------------------------------------
     Loop & Tolerance Setup
  -------------------------------------------------------------------------- */
  // Compute boundaries from original positions.
  const minLeft = Math.min(...images.map(img => img.left))
  const maxRight = Math.max(...images.map(img => img.left + img.width))
  const trackWidth = maxRight - minLeft
  const MARGIN = -300  // Allow images to leave the scene by this margin before wrapping
  
  // Global translation value.
  const translateX = ref(0)
  
  // Global time for oscillation effects.
  const globalTime = ref(0)
  
  /**
   * getEffectiveX()
   * Given an image's original left and a movement factor,
   * calculate the new x position by applying the global translation.
   * Uses a tolerance (MARGIN) before wrapping.
   */
  function getEffectiveX(imageLeft, factor) {
    let x = imageLeft + translateX.value * factor
    while (x < minLeft - MARGIN) {
      x += trackWidth
    }
    while (x > minLeft + trackWidth + MARGIN) {
      x -= trackWidth
    }
    return x
  }
  
  /* -------------------------------------------------------------------------
     Parallax Factor
  -------------------------------------------------------------------------- */
  const getParallaxFactor = (index) => {
    const factors = [0.95, 1.0, 1.05]
    return factors[index % factors.length]
  }
  
  /* -------------------------------------------------------------------------
     Global State & Interaction
  -------------------------------------------------------------------------- */
  const slider = ref(null)
  const { width } = useWindowSize()
  const baseSpeed = ref(-0.5)
  const acceleratedSpeed = -0.7
  // Accelerate only on hover.
  const isHovered = ref(false)
  const isSwiping = ref(false)
  const speed = computed(() => (isHovered.value ? acceleratedSpeed : baseSpeed.value))
  const mouseEffect = ref({ x: 0, y: 0 })
  
  /* -------------------------------------------------------------------------
     Compute Style for Each Image with Subtle Vertical & Size Oscillation
  -------------------------------------------------------------------------- */
  const getStyle = (image, index) => {
    // const factor = getParallaxFactor(index)
    const factor = 1

    const effectiveX = getEffectiveX(image.left, factor)
    // Subtle vertical movement: each image gets its own oscillation speed and phase.
    // const verticalAmplitude = 10 // pixels
    const verticalAmplitude = 0 // pixels
    const verticalSpeed = 5 * factor
    const verticalOffset = Math.sin(globalTime.value * verticalSpeed + index) * verticalAmplitude
    // Subtle size oscillation:
    // const scaleAmplitude = 0.1
    const scaleAmplitude = 0
    const scaleSpeed = 5 * factor
    const scaleOffset = 1 + Math.sin(globalTime.value * scaleSpeed + index) * scaleAmplitude
    return {
      width: `${image.width}px`,
      height: `${image.height}px`,
      left: `${effectiveX}px`,
      top: `${image.top + verticalOffset}px`,
      transform: `rotate(${image.rotate}deg) scale(${(image.scale || 1) * scaleOffset}) translate(${mouseEffect.value.x}px, ${mouseEffect.value.y}px)`,
      transition: 'transform 0.3s ease-out, z-index 0.3s ease-out',
      position: 'absolute',
      zIndex: image.zIndex
    }
  }
  
  /* -------------------------------------------------------------------------
     Animation Loop – Auto–Scroll, Inertia & Global Time Update
  -------------------------------------------------------------------------- */
    let animationFrameId
    let lastFrameTime = performance.now()
    const animate = () => {
    const now = performance.now()
    const dt = now - lastFrameTime
    const dtSec = dt / 1000
    lastFrameTime = now
    
    // Update global time.
    globalTime.value += dtSec
    
    // Auto-scroll / swipe inertia.
    if (!isSwiping.value) {
        if (swipeInertiaActive.value) {
        translateX.value += swipeVelocity.value * dt
        swipeVelocity.value *= 0.995 // decay
        if (Math.abs(swipeVelocity.value) < 0.02) {
            swipeInertiaActive.value = false
            swipeVelocity.value = speed.value
        }
        } else {
        translateX.value += speed.value
        }
    }
    
    // ----- Repulsion Physics Update -----
    // Loop through every pair of images.
    for (let i = 0; i < images.length; i++) {
        for (let j = i + 1; j < images.length; j++) {
        const imgA = images[i]
        const imgB = images[j]
        const factorA = getParallaxFactor(i)
        const factorB = getParallaxFactor(j)
        
        // Calculate the center positions of each image (including repulsion offset).
        const centerAX = getEffectiveX(imgA.left, factorA) + (imgA.offsetX || 0) + imgA.width / 2
        const centerAY = imgA.top + (imgA.offsetY || 0) + imgA.height / 2
        const centerBX = getEffectiveX(imgB.left, factorB) + (imgB.offsetX || 0) + imgB.width / 2
        const centerBY = imgB.top + (imgB.offsetY || 0) + imgB.height / 2
        
        const dx = centerAX - centerBX
        const dy = centerAY - centerBY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Approximate each image’s "radius" (half the average of width and height).
        const radiusA = (imgA.width + imgA.height) / 4
        const radiusB = (imgB.width + imgB.height) / 4
        const minDist = radiusA + radiusB
        
        // If images are too close, calculate repulsion.
        if (distance < minDist && distance > 0) {
            const overlap = minDist - distance
            const repulsionStrength = 200 // Adjust to tune the repulsion force.
            const force = repulsionStrength * overlap
            const fx = (dx / distance) * force
            const fy = (dy / distance) * force
            
            // Update velocities (apply opposite forces to each image).
            imgA.vx = (imgA.vx || 0) + fx * dtSec
            imgA.vy = (imgA.vy || 0) + fy * dtSec
            imgB.vx = (imgB.vx || 0) - fx * dtSec
            imgB.vy = (imgB.vy || 0) - fy * dtSec
        }
        }
    }
    
    // Update each image's repulsion offset based on velocity and apply damping.
    const damping = 0.9 // Adjust for smoother or snappier damping.
    images.forEach(image => {
        image.offsetX = (image.offsetX || 0) + (image.vx || 0) * dtSec
        image.offsetY = (image.offsetY || 0) + (image.vy || 0) * dtSec
        image.vx = (image.vx || 0) * damping
        image.vy = (image.vy || 0) * damping
    })
    
    // --------------------------------------
    
    animationFrameId = requestAnimationFrame(animate)
    }

  
  /* -------------------------------------------------------------------------
     Swipe Inertia Variables
  -------------------------------------------------------------------------- */
  const swipeVelocity = ref(0)
  const lastTouchX = ref(0)
  const lastTouchTime = ref(0)
  const swipeInertiaActive = ref(false)
  
  /* -------------------------------------------------------------------------
     Event Handlers – Mouse, Touch, & Hover Effects
  -------------------------------------------------------------------------- */
  const handleMouseEnter = () => { isHovered.value = true }
  const handleMouseLeave = () => { isHovered.value = false; mouseEffect.value = { x: 0, y: 0 } }
  const handleMouseMove = (event) => {
    if (!slider.value) return
    const rect = slider.value.getBoundingClientRect()
    const offsetX = (((event.clientX - rect.left) - rect.width / 2) / (rect.width / 2)) * 10
    const offsetY = (((event.clientY - rect.top) - rect.height / 2) / (rect.height / 2)) * 10
    mouseEffect.value = { x: offsetX, y: offsetY }
  }
  const throttledMouseMove = useThrottleFn(handleMouseMove, 16)
  
  // Touch handling with inertia.
  let startTouchX = 0
  let startTranslateX = 0
  const handleTouchStart = (event) => {
    isSwiping.value = true
    swipeInertiaActive.value = false
    startTouchX = event.touches[0].clientX
    startTranslateX = translateX.value
    lastTouchX.value = event.touches[0].clientX
    lastTouchTime.value = performance.now()
  }
  const handleTouchMove = (event) => {
    const currentX = event.touches[0].clientX
    const currentTime = performance.now()
    const delta = currentX - startTouchX
    translateX.value = startTranslateX + delta
    const dt = currentTime - lastTouchTime.value
    if (dt > 0) {
      swipeVelocity.value = (currentX - lastTouchX.value) / dt
    }
    lastTouchX.value = currentX
    lastTouchTime.value = currentTime
  }
  const handleTouchEnd = () => {
    isSwiping.value = false
    swipeInertiaActive.value = true
  }
  
  /* -------------------------------------------------------------------------
     Image Hover Effects
  -------------------------------------------------------------------------- */
  const handleElementHover = (image) => {
    image.scale = 1.1
    if (image.baseZIndex === undefined) image.baseZIndex = image.zIndex
    image.zIndex = image.baseZIndex + 10
  }
  const resetElement = (image) => {
    image.scale = 1
    if (image.baseZIndex !== undefined) image.zIndex = image.baseZIndex
  }
  
  /* -------------------------------------------------------------------------
     Lifecycle Hooks
  -------------------------------------------------------------------------- */
  onMounted(() => {
    animate()
  })
  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
  })
  </script>
  
  <style scoped>
  .slider-container {
    left: 0;
    width: 100vw;
    overflow-x: clip;
    overflow-y: unset;

    /* background-color: red; */
  }
  .slider-inner {
    position: absolute;
    display: flex;
  }
  .image-item {
    position: absolute;
    transition: transform 0.3s ease-out, z-index 0.3s ease-out;
    will-change: transform;
  }
  </style>
  