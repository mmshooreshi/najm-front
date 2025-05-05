<template>
  <div
  v-motion-pop-visible
  :delay="delay"

    dir="rtl"
    ref="itemRef"
    class="transition-all  py-0 "
    :class="['accordion-item', { open: isOpen }]"
    @click="$emit('toggle')"
  >
    <div class="header py-3 px-6">
      <span>{{ title }}</span>
      <svg
        class="icon"
        :class="{ open: isOpen }"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div ref="contentEl" class="content">
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  title: String,
  content: String,
  isOpen: Boolean,
  delay: Number
})

const contentEl = ref(null)

watch(
  () => props.isOpen,
  async (open) => {
    const el = contentEl.value
    await nextTick()
    if (open) {
      const fullH = el.scrollHeight
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: fullH,
          opacity: 1,
          ease: 'power2.inOut',
          duration: 0.6,
          onComplete: () => el.style.height = 'auto'
        }
      )
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        ease: 'power2.inOut',
        duration: 0.6
      })
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.accordion-item {
  cursor: pointer;
  background: #EBF0F3;
  border-radius: 1rem;
  overflow: hidden;
  /* transition: background 0.3s; */
}
.accordion-item.open {
  background: transparent;
  /* margin-top: 0.5rem; */
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
}
.icon.open {
  transform: rotate(45deg);
}
.content {
  height: 0;
  opacity: 0;
  overflow: hidden;
  padding: 0 1.5rem;
  font-size: 0.875rem;
}
.content p {
  margin: 0.75rem 0;
}
</style>
