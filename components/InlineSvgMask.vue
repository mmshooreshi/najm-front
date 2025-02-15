<template>
  <!-- Container with explicit size -->
  <div :style="{ position: 'relative', width: W + 'px', height: H + 'px' }">
    <!-- SVG with dynamically traced polygon (overlaid) -->
    <svg
      :width="W"
      :height="H"
      ref="svgEl"
      style="position: absolute; top: 0; left: 0; opacity:0;"
    >
      <polygon
        ref="polyEl"
        class="hover-poly"
        v-if="pts"
        :points="pts"
        :fill="hovered === 'top' ? 'green' : hovered === 'back' ? 'red' : 'black'"
        style="pointer-events: visiblePainted; fill-opacity: 0.5;"
      />
    </svg>

    <!-- Inline PNG image (underneath the SVG) -->
    <img
      ref="imgEl"
      :src="src"
      :width="W"
      :height="H"
      alt="Loaded PNG"
      style="position: relative; top: 0; left: 0; opacity: 100;"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({
  src: { type: String, required: true }
})
const emit = defineEmits(['hover', 'leave'])

// Reactive state for dimensions and polygon data.
const W = ref(0)
const H = ref(0)
const pts = ref('')
// Hover state: '' (not hovered), 'top' (on top), or 'back' (hovered but behind).
const hovered = ref('')

// Refs for SVG and image elements.
const svgEl = ref(null)
const polyEl = ref(null)
const imgEl = ref(null)

// Configurable alpha threshold to account for anti-aliasing (0-255).
const ALPHA_THRESHOLD = 50

/**
 * Simple 4-neighbor contour tracer.
 * Traces the binary mask 'm' and returns a string of points for the polygon.
 */
const trace = m => {
  const h = m.length, w = m[0].length;
  let s;
  // Find a starting pixel on the top or left boundary of the object.
  for (let y = 0; y < h && !s; y++) {
    for (let x = 0; x < w && !s; x++) {
      if (m[y][x] && (!m[y - 1]?.[x] || !m[y][x - 1])) {
        s = { x, y }
      }
    }
  }
  if (!s) return ''
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]],
    res = []
  let x = s.x,
    y = s.y,
    d = 0
  do {
    res.push(`${x + 0.5},${y + 0.5}`)
    let found = false
    for (let i = 0; i < 4; i++) {
      let nd = (d + i) % 4
      let nx = x + dirs[nd][0],
        ny = y + dirs[nd][1]
      if (nx >= 0 && ny >= 0 && nx < w && ny < h && m[ny][nx]) {
        x = nx
        y = ny
        d = (nd + 3) % 4
        found = true
        break
      }
    }
    if (!found) break
  } while (x !== s.x || y !== s.y)
  return res.join(' ')
}

/**
 * Fallback: Compute the bounding box of a binary mask.
 */
function boundingBox(m) {
  const h = m.length,
    w = m[0].length
  let minX = w,
    minY = h,
    maxX = 0,
    maxY = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (m[y][x]) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (minX > maxX || minY > maxY) return ''
  return `${minX},${minY} ${maxX + 1},${minY} ${maxX + 1},${maxY + 1} ${minX},${maxY + 1}`
}

/**
 * Loads a PNG image into a hidden canvas, builds a binary mask using the alpha channel,
 * and then traces its contour.
 */
function loadAndTraceImage(src) {
  const img = new Image()
  img.crossOrigin = "anonymous"
  img.src = src
  img.onload = () => {
    // Set dimensions based on the loaded image.
    W.value = img.width
    H.value = img.height

    const c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const d = ctx.getImageData(0, 0, img.width, img.height).data
    const m = []
    for (let y = 0; y < img.height; y++) {
      let row = []
      for (let x = 0; x < img.width; x++) {
        // Check if the alpha value is above the threshold.
        row.push(d[(y * img.width + x) * 4 + 3] > ALPHA_THRESHOLD)
      }
      m.push(row)
    }
    // Try to trace the shape.
    const traced = trace(m)
    pts.value = traced ? traced : boundingBox(m)
  }
  img.onerror = err => console.error("Error loading image:", err)
}

/**
 * Unified move handler for pointer and touch events on the SVG.
 */
function onMove(e) {
  let clientX, clientY
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    clientX = e.clientX
    clientY = e.clientY
  }
  if (!svgEl.value || !polyEl.value) return

  const pt = svgEl.value.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const svgP = pt.matrixTransform(svgEl.value.getScreenCTM().inverse())

  if (polyEl.value.isPointInFill(svgP)) {
    const elements = document.elementsFromPoint(clientX, clientY)
    const hoveredPolys = elements.filter(el =>
      el.classList && el.classList.contains('hover-poly')
    )
    if (hoveredPolys.length && hoveredPolys[0] === polyEl.value) {
      if (hovered.value !== 'top') {
        hovered.value = 'top'
        emit('hover', { src: props.src, state: 'top' })
      }
    } else {
      if (hovered.value !== 'back') {
        hovered.value = 'back'
        emit('leave', { src: props.src, state: 'back' })

      }
    }
  } else {
    if (hovered.value !== '') {
      hovered.value = ''
      emit('leave', props.src)
    }
  }
}

/**
 * Handler for touchend/touchcancel events on the SVG.
 */
function onTouchEnd() {
  // if (hovered.value !== '') {
  //   hovered.value = ''
  //   emit('leave', props.src)
  // }
}

onMounted(() => {
  // Attach event listeners for pointer and touch events.
  window.addEventListener('pointermove', onMove)
  window.addEventListener('touchmove', onMove)
  window.addEventListener('touchstart', onMove)
  window.addEventListener('touchend', onTouchEnd)
  window.addEventListener('touchcancel', onTouchEnd)

  // Load and trace the image if a source is provided.
  if (props.src) {
    loadAndTraceImage(props.src)
  }

  // Add hover listeners on the image element.
  if (imgEl.value) {
    imgEl.value.addEventListener('mouseenter', () => {
      imgEl.value.classList.add('png-hovered')
      emit('hover')
    })
    imgEl.value.addEventListener('mouseleave', () => {
      imgEl.value.classList.remove('png-hovered')
      emit('leave')
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchstart', onMove)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('touchcancel', onTouchEnd)
})
</script>

<style scoped>
/* When hovered, the inline PNG gets a dashed red outline and blue drop shadow. */
.png-hovered {
  /* outline: 2px dashed red; */
  /* filter: drop-shadow(10px 10px 50px blue); */
}
</style>
