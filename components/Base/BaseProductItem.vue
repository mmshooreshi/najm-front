<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Package } from '@/types'
import { gsap } from 'gsap'

/* -------------------------------------------------------------------------- */
/* Props & Emits                                                              */
/* -------------------------------------------------------------------------- */
const props = defineProps<{
  pkg: Package
  expanded: boolean
}>()

const emit = defineEmits(['toggleExpand'] as const)

/* -------------------------------------------------------------------------- */
/* Refs                                                                        */
/* -------------------------------------------------------------------------- */
const container = ref<HTMLElement | null>(null)
const itemEls   = ref<(HTMLElement | null)[]>([])
const tooltipIndex = ref<number | null>(null)

// random home positions (computed once client‑side)
const randomPositions = ref<{ x: number; y: number }[]>([])
// grid target positions when expanded
const gridPositions   = ref<{ x: number; y: number }[]>([])
// floating tweens so we can kill/restart
const floatingTweens  = ref<(gsap.core.Tween | null)[]>([])

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */
function createFloatingTween(idx: number) {
  const el = itemEls.value[idx]
  if (!el) return null
  return gsap.to(el, {
    y: "-=10",
    duration: 2 + Math.random(),
    ease: "none",
    repeat: -1,
    yoyo: true,
    delay: idx * 0.1,
  })
}

function positionElementsAtRandom() {
  itemEls.value.forEach((el, i) => {
    if (!el) return
    const pos = randomPositions.value[i]
    gsap.set(el, { x: pos.x, y: pos.y })
  })
}

function moveElementsToGrid() {
  itemEls.value.forEach((el, i) => {
    if (!el) return
    const target = gridPositions.value[i]
    gsap.to(el, { x: target.x, y: target.y, duration: 0.6, ease: "power1.out" })
  })
}

function restartFloating() {
  // kill any existing tweens first
  floatingTweens.value.forEach(t => t?.kill())
  floatingTweens.value = itemEls.value.map((_, i) => createFloatingTween(i))
}

/* -------------------------------------------------------------------------- */
/* Lifecycle                                                                   */
/* -------------------------------------------------------------------------- */
onMounted(() => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  randomPositions.value = props.pkg.products.map(() => ({
    x: Math.random() * (vw - 200),
    y: Math.random() * (vh - 300),
  }))

  // initial placement
  positionElementsAtRandom()
  // start bobbing
  restartFloating()
})

// recalc grid positions when expand turns true
watch(
  () => props.expanded,
  (isExpanded) => {
    if (isExpanded && container.value) {
      const ch = container.value.clientHeight
      const cardW = 150
      const gap = 16
      const bottomGap = 200

      gridPositions.value = props.pkg.products.map((_, i) => ({
        x: i * (cardW + gap),
        y: ch - bottomGap,
      }))

      // stop floating & move into grid
      floatingTweens.value.forEach(t => t?.kill())
      moveElementsToGrid()
    } else if (!isExpanded) {
      // back to random homes and restart floating
      positionElementsAtRandom()
      restartFloating()
    }
  },
  { immediate: false },
)

/* -------------------------------------------------------------------------- */
/* Events                                                                      */
/* -------------------------------------------------------------------------- */
function toggleExpand() {
  emit('toggleExpand')
}
</script>

<style scoped>
.package-slide {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

.product-wrapper {
  position: absolute;
  will-change: transform;
}

.product-img {
  max-width: 180px;
  height: auto;
  display: block;
  transition: transform 0.2s ease;
}
.product-img:hover {
  transform: scale(1.05);
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;
}
</style>
