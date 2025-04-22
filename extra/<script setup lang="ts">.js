<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useMotionProperties, withSpring, ReduceMotion } from '@vueuse/motion'

// … your props/emit/contentRef/containerRef setup …

// 1️⃣ Create motionProperties (initial height = 0)
const { motionProperties } = useMotionProperties(containerRef, { height: 0 })

// 2️⃣ Remove useSpring entirely. Instead, define an animateHeight helper:
const animateHeight = (to: number) => {
  // withSpring returns a reactive motion value; we assign it directly
  motionProperties.height = withSpring(to, {
    duration: 1301,
    dampingRatio: 0.7,
    stiffness: 418,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
    reduceMotion: ReduceMotion.System,
  })
}

// 3️⃣ On expand/collapse, measure and call animateHeight
const update = async () => {
  await nextTick()
  const el = contentRef.value
  const target = props.expanded && el ? el.scrollHeight : 0
  animateHeight(target)
}

watch(() => props.expanded, update, { immediate: true })
onMounted(update)

// … rest of your code …
</script>
