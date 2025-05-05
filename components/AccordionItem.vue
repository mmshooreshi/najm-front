<!-- AccordionItem.vue -->
<template>
  <div
    v-motion-pop-visible
    :delay="delay"
    dir="rtl"
    class="border border-transparent hover:border-black/0 accordion-item rounded-xl overflow-hidden transition-colors duration-300"
    :class="{ 'bg-transparent': isOpen, 'bg-[#EBF0F3]': !isOpen }"
    @click="$emit('toggle')"
  >
  <!-- Header padding: open = py-3, any other open exists & this closed = py-0, otherwise default py-3 -->
    <div
      class="header  flex pb-3 pt-3 items-center justify-between px-6 font-extrabold text-lg transition-all duration-300"
      :class="isOpen
        ? ''
        : (hasAnyOpen ? 'md:!pt-1' : '')"
    >
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
    <div ref="contentEl" class="content overflow-hidden text-xs font-medium">
      <div class="pb-6 md:pb-12 pt-0 px-6 pl-8 md:pl-16">
        <p>{{ content }}</p>
      </div>
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
  hasAnyOpen: Boolean,
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
          onComplete: () => (el.style.height = 'auto')
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
  line-height: 18px;
}
</style>
