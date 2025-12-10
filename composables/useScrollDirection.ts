import { ref, onMounted, onUnmounted } from 'vue'
import { scrollDirection } from '~/composables/useScrollStore'

export function useScrollDirection(threshold = 10) {
  const direction = ref<'up' | 'down'>('up')
  const lastY = ref(0)

  const onScroll = () => {
    const currentY = window.scrollY
    const diff = currentY - lastY.value

    // Ignore micro-deltas
    if (Math.abs(diff) < threshold) return

    // Always treat top of page as "up"
    if (currentY < 80) {
      direction.value = 'up'
      scrollDirection.value = 'up'
      return
    }

    const newDir = diff > 0 ? 'down' : 'up'
    direction.value = newDir
    scrollDirection.value = newDir

    lastY.value = currentY
  }

  onMounted(() => {
    lastY.value = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { direction }
}
