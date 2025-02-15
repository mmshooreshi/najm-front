<template>
  <!-- Render dynamically traced polygon -->
  <svg :width="W" :height="H" ref="svgEl">
    <polygon
      ref="polyEl"
      v-if="pts"
      :points="pts"
      :fill="hovered ? 'green' : 'black'"
      style="pointer-events: auto; fill-opacity: 0.5;"
    />
  </svg>

  <!-- Render the external SVG inline (if needed) -->
  <!--
  <div ref="svgContainer" v-if="svgContent" v-html="svgContent"></div>
  -->
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

// Define props and also define the events this component can emit.
const props = defineProps({ src: String })
const emit = defineEmits(['hover', 'leave'])

// Reactive state for image dimensions and polygon data.
const W = ref(0)
const H = ref(0)
const pts = ref('')
// Instead of a string value, we use a simple Boolean for hover state.
const hovered = ref(false)

const svgEl = ref(null)
const polyEl = ref(null)
const svgContent = ref('') // For external SVG (if used)
const svgContainer = ref(null)

// Minimal 4-neighbor contour tracer that finds a border and walks around it.
const trace = m => {
  const h = m.length, w = m[0].length; 
  let s;
  for (let y = 0; y < h && !s; y++) 
    for (let x = 0; x < w && !s; x++) 
      if (m[y][x] && (!m[y-1]?.[x] || !m[y][x-1])) s = { x, y }
  if (!s) return ''
  const dirs = [[1,0],[0,1],[-1,0],[0,-1]], res = []
  let x = s.x, y = s.y, d = 0
  do {
    res.push(`${x+0.5},${y+0.5}`)
    let found = false
    for (let i = 0; i < 4; i++) {
      let nd = (d + i) % 4, nx = x + dirs[nd][0], ny = y + dirs[nd][1]
      if (nx >= 0 && ny >= 0 && nx < w && ny < h && m[ny][nx]) { 
        x = nx; y = ny; d = (nd+3)%4; 
        found = true; 
        break 
      }
    }
    if (!found) break
  } while (x !== s.x || y !== s.y)
  return res.join(' ')
}

/**
 * Global pointermove handler that checks if the pointer is inside the polygon’s fill.
 * We use a reactive "hovered" flag so that we emit events only when the state changes.
 */
function onPointerMove(e) {
  if (!svgEl.value || !polyEl.value) return

  // Create an SVGPoint from screen coordinates.
  const pt = svgEl.value.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY

  // Transform it into the SVG coordinate system.
  const svgP = pt.matrixTransform(svgEl.value.getScreenCTM().inverse())

  // Check if the point is inside the polygon.
  if (polyEl.value.isPointInFill(svgP)) {
    if (!hovered.value) {
      hovered.value = true
      emit('hover', props.src)  // Emit the hover event with the image (src) as payload.
    }
  } else {
    if (hovered.value) {
      hovered.value = false
      emit('leave', props.src)  // Emit the leave event.
    }
  }
}

onMounted(async () => {
  // Listen globally on pointermove.
  window.addEventListener('pointermove', onPointerMove)

  // If an external SVG is provided via props.src, load and inject it.
  if (props.src) {
    try {
      const response = await fetch(props.src)
      svgContent.value = await response.text()
      await nextTick()

      const svgInside = svgContainer.value?.querySelector('svg')
      if (svgInside) {
        svgInside.style.pointerEvents = 'visiblePainted' // Only painted areas are interactive.

        // Optionally, add similar hover/leave listeners to polygons inside the external SVG.
        const polygons = svgInside.querySelectorAll('polygon')
        polygons.forEach(polygon => {
          polygon.style.transition = 'fill 0.2s ease'

          polygon.addEventListener('mouseenter', (e) => {
            // For example purposes, change fill and/or emit events as needed.
            polygon.style.fill = 'green'
          })

          polygon.addEventListener('mouseleave', () => {
            polygon.style.fill = 'black'
          })
        })
      }
    } catch (error) {
      console.error('Error loading external SVG:', error)
    }
  }

  // Load the image to build the alpha mask, then trace its contour.
  const img = new Image()
  img.crossOrigin = "anonymous"
  img.src = props.src
  img.onload = () => {
    W.value = img.width
    H.value = img.height
    const c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const d = ctx.getImageData(0, 0, img.width, img.height).data, m = []
    for (let y = 0; y < img.height; y++) {
      let row = []
      for (let x = 0; x < img.width; x++) 
        row.push(d[(y * img.width + x) * 4 + 3] > 0)
      m.push(row)
    }
    pts.value = trace(m)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
})
</script>
