import { onMounted, onUnmounted } from 'vue'
import { scrollDirection } from '~/composables/useScrollStore'

let subscriberCount = 0
let lastY = 0
let ticking = false

const update = (threshold = 10) => {
  if (typeof window === 'undefined') return
  const currentY = window.scrollY
  const diff = currentY - lastY

  // Ignore micro-deltas
  if (Math.abs(diff) < threshold) {
    ticking = false
    return
  }

  // Always treat top of page as "up"
  if (currentY < 80) {
    scrollDirection.value = 'up'
    lastY = currentY
    ticking = false
    return
  }

  const newDir = diff > 0 ? 'down' : 'up'
  scrollDirection.value = newDir

  lastY = currentY
  ticking = false
}

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => update(10))
    ticking = true
  }
}

export function useScrollDirection(threshold = 10) {
  onMounted(() => {
    if (typeof window === 'undefined') return
    if (subscriberCount === 0) {
      lastY = window.scrollY
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    subscriberCount++
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    subscriberCount--
    if (subscriberCount <= 0) {
      subscriberCount = 0
      window.removeEventListener('scroll', onScroll)
    }
  })

  return { direction: scrollDirection }
}
