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
      <!-- Settings Button -->
      <button
        @click="showSettings = true"
        class="absolute top-4 right-4 z-[1000] bg-blue-500 text-white px-3 py-1 rounded"
      >
        Settings
      </button>
  
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
  
    <!-- Settings Modal -->
    <div
      v-if="showSettings"
      class="fixed inset-0 flex items-center justify-center z-[999] bg-black bg-opacity-50"
    >
      <div class="bg-white p-4 rounded-lg w-80 space-y-3">
        <h2 class="text-xl font-bold mb-4">Settings</h2>
        <div class="space-y-2">
          <label class="block">
            Base Speed:
            <input
              type="number"
              v-model.number="baseSpeed"
              step="0.1"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Accelerated Speed:
            <input
              type="number"
              v-model.number="acceleratedSpeed"
              step="0.1"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Vertical Amplitude:
            <input
              type="number"
              v-model.number="verticalAmplitude"
              step="1"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Vertical Speed Factor:
            <input
              type="number"
              v-model.number="verticalSpeedFactor"
              step="1"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Scale Amplitude:
            <input
              type="number"
              v-model.number="scaleAmplitude"
              step="0.1"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Scale Speed Factor:
            <input
              type="number"
              v-model.number="scaleSpeedFactor"
              step="1"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Repulsion Strength:
            <input
              type="number"
              v-model.number="repulsionStrength"
              step="10"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Damping:
            <input
              type="number"
              v-model.number="damping"
              step="0.05"
              min="0"
              max="1"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Inertia Friction:
            <input
              type="number"
              v-model.number="inertiaFriction"
              step="0.001"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Inertia Threshold:
            <input
              type="number"
              v-model.number="inertiaThreshold"
              step="0.01"
              class="w-full border rounded p-1"
            />
          </label>
  
          <!-- New hover effect settings -->
          <label class="block">
            Hover Transition Duration (s):
            <input
              type="number"
              v-model.number="hoverTransitionDuration"
              step="0.1"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Hover Z-Index Offset:
            <input
              type="number"
              v-model.number="hoverZIndexOffset"
              step="1"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Hover Z-Index Delay (ms):
            <input
              type="number"
              v-model.number="hoverZIndexDelay"
              step="50"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Non-Hovered Blur Amount (px):
            <input
              type="number"
              v-model.number="nonHoveredBlur"
              step="1"
              class="w-full border rounded p-1"
            />
          </label>
          <label class="block">
            Non-Hovered Opacity:
            <input
              type="number"
              v-model.number="nonHoveredOpacity"
              step="0.1"
              min="0"
              max="1"
              class="w-full border rounded p-1"
            />
          </label>
        </div>
        <button
          @click="showSettings = false"
          class="mt-4 bg-blue-500 text-white rounded px-4 py-2"
        >
          Close
        </button>
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
  const MARGIN = -300 // Allow images to leave the scene by this margin before wrapping
  
  // Global translation value.
  const translateX = ref(0)
  
  // Global time for oscillation effects.
  const globalTime = ref(0)
  
  /* -------------------------------------------------------------------------
     Exposed Variables for Controls
  -------------------------------------------------------------------------- */
  const baseSpeed = ref(-0.5)
  const acceleratedSpeed = ref(-0.7)
  
  const verticalAmplitude = ref(0)         // pixels
  const verticalSpeedFactor = ref(5)         // multiplier for vertical oscillation
  
  const scaleAmplitude = ref(0)              // e.g., 0.1 = 10% size change
  const scaleSpeedFactor = ref(5)            // multiplier for scaling oscillation
  
  const repulsionStrength = ref(200)         // force multiplier for repulsion
  const damping = ref(0.9)                   // damping factor for repulsion velocity
  
  // Inertia settings:
  const inertiaFriction = ref(0.695)         // Friction factor per frame
  const inertiaThreshold = ref(0.02)         // Minimum velocity threshold
  
  // New settings for hover effects:
  const hoverTransitionDuration = ref(0.3)   // seconds for transform, opacity & filter transitions
  const hoverZIndexOffset = ref(10)          // additional z-index for hovered element
  const hoverZIndexDelay = ref(150)          // delay (ms) before raising z-index
  const nonHoveredBlur = ref(3)              // blur amount (px) for non-hovered images
  const nonHoveredOpacity = ref(0.6)         // opacity for non-hovered images when one is hovered
  
  /* -------------------------------------------------------------------------
     Modal Visibility
  -------------------------------------------------------------------------- */
  const showSettings = ref(false)
  
  /* -------------------------------------------------------------------------
     Global State & Interaction
  -------------------------------------------------------------------------- */
  const slider = ref(null)
  const { width } = useWindowSize()
  const isHovered = ref(false)
  const isSwiping = ref(false)
  const speed = computed(() =>
    isHovered.value ? acceleratedSpeed.value : baseSpeed.value
  )
  const mouseEffect = ref({ x: 0, y: 0 })
  
  /* -------------------------------------------------------------------------
     Compute Style for Each Image with Oscillation and Hover Effects
  -------------------------------------------------------------------------- */
  const getStyle = (image, index) => {
    const factor = 1 // you can adjust the factor as needed
    const effectiveX = getEffectiveX(image.left, factor)
    const verticalSpeed = verticalSpeedFactor.value * factor
    const verticalOffset = Math.sin(globalTime.value * verticalSpeed + index) * verticalAmplitude.value
    const scaleSpeed = scaleSpeedFactor.value * factor
    const scaleOffset = 1 + Math.sin(globalTime.value * scaleSpeed + index) * scaleAmplitude.value
  
    // Use the extra rotation if defined (from hover) otherwise base rotation.
    const rotation = image.hoverRotate !== undefined ? image.hoverRotate : image.rotate
  
    const style = {
      width: `${image.width}px`,
      height: `${image.height}px`,
      left: `${effectiveX}px`,
      top: `${image.top + verticalOffset}px`,
      transform: `rotate(${rotation}deg) scale(${(image.scale || 1) * scaleOffset}) translate(${mouseEffect.value.x}px, ${mouseEffect.value.y}px)`,
      transition: `transform ${hoverTransitionDuration.value}s ease-out, box-shadow ${hoverTransitionDuration.value}s ease-out, opacity ${hoverTransitionDuration.value}s ease-out, filter ${hoverTransitionDuration.value}s ease-out`,
      position: 'absolute',
      zIndex: image.zIndex
    }
  
    // If any image is hovered and this one isn’t the hovered one, apply blur and fade.
    if (images.some(img => img.hovered) && !image.hovered) {
      style.filter = `blur(${nonHoveredBlur.value}px)`
      style.opacity = nonHoveredOpacity.value
    } else {
      style.filter = 'none'
      style.opacity = 1
    }
  
    return style
  }
  
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
     Animation Loop – Auto–Scroll, Inertia, Global Time, & Repulsion
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
        swipeVelocity.value *= inertiaFriction.value
        if (Math.abs(swipeVelocity.value) < inertiaThreshold.value) {
          swipeInertiaActive.value = false
          swipeVelocity.value = speed.value
        }
      } else {
        translateX.value += speed.value
      }
    }
  
    // ----- Repulsion Physics Update -----
    for (let i = 0; i < images.length; i++) {
      for (let j = i + 1; j < images.length; j++) {
        const imgA = images[i]
        const imgB = images[j]
        const centerAX = getEffectiveX(imgA.left, 1) + (imgA.offsetX || 0) + imgA.width / 2
        const centerAY = imgA.top + (imgA.offsetY || 0) + imgA.height / 2
        const centerBX = getEffectiveX(imgB.left, 1) + (imgB.offsetX || 0) + imgB.width / 2
        const centerBY = imgB.top + (imgB.offsetY || 0) + imgB.height / 2
  
        const dx = centerAX - centerBX
        const dy = centerAY - centerBY
        const distance = Math.sqrt(dx * dx + dy * dy)
  
        const radiusA = (imgA.width + imgA.height) / 4
        const radiusB = (imgB.width + imgB.height) / 4
        const minDist = radiusA + radiusB
  
        if (distance < minDist && distance > 0) {
          const overlap = minDist - distance
          const force = repulsionStrength.value * overlap
          const fx = (dx / distance) * force
          const fy = (dy / distance) * force
  
          imgA.vx = (imgA.vx || 0) + fx * dtSec
          imgA.vy = (imgA.vy || 0) + fy * dtSec
          imgB.vx = (imgB.vx || 0) - fx * dtSec
          imgB.vy = (imgB.vy || 0) - fy * dtSec
        }
      }
    }
  
    images.forEach(image => {
      image.offsetX = (image.offsetX || 0) + (image.vx || 0) * dtSec
      image.offsetY = (image.offsetY || 0) + (image.vy || 0) * dtSec
      image.vx = (image.vx || 0) * damping.value
      image.vy = (image.vy || 0) * damping.value
    })
  
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
  const handleMouseEnter = () => {
    isHovered.value = true
  }
  const handleMouseLeave = () => {
    isHovered.value = false
    mouseEffect.value = { x: 0, y: 0 }
  }
  const handleMouseMove = (event) => {
    if (!slider.value) return
    const rect = slider.value.getBoundingClientRect()
    const offsetX =
      (((event.clientX - rect.left) - rect.width / 2) / (rect.width / 2)) * 10
    const offsetY =
      (((event.clientY - rect.top) - rect.height / 2) / (rect.height / 2)) * 10
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
    // Increase the scale when hovered.
    image.scale = 1.2
    // Add an extra rotation for the hover effect.
    image.hoverRotate = image.rotate + 10
    image.hovered = true
    if (image.baseZIndex === undefined) image.baseZIndex = image.zIndex
    // Delay raising z-index to allow a smooth transition.
    setTimeout(() => {
      if (image.hovered) {
        image.zIndex = image.baseZIndex + hoverZIndexOffset.value
      }
    }, hoverZIndexDelay.value)
  }
  
  const resetElement = (image) => {
    image.scale = 1
    image.hoverRotate = undefined
    image.hovered = false
    image.zIndex = image.baseZIndex
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
  }
  .slider-inner {
    position: absolute;
    display: flex;
  }
  .image-item {
    position: absolute;
    transition-property: transform, box-shadow, opacity, filter;
    /* The duration and easing are controlled via inline style from settings. */
    will-change: transform, opacity, filter;
  }
  </style>
  