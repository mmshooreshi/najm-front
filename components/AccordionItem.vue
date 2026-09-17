<!-- components/AccordionItem.vue -->
<!-- AccordionItem.vue -->
<template>
  <div
     v-memotion-pop-visible="{ delay: delay, duration: 0.3 }"
    dir="rtl"
    :dir="isRTL ? 'rtl' : 'ltr'" :class="[isRTL ? 'rtl text-right' : 'ltr text-left', { 'bg-transparent': isOpen, 'bg-[#EBF0F3]': !isOpen }]"
    class="border border-transparent hover:border-black/0 accordion-item rounded-xl overflow-hidden transition-colors duration-300"
    
    @click="$emit('toggle')"
  >
  <!-- Header padding: open = py-3, any other open exists & this closed = py-0, otherwise default py-3 -->
    <div
      class="header  flex pb-3 pt-3 items-center justify-between px-6 font-extrabold text-lg transition-all duration-300"
      :class="isOpen
        ? ''
        : (hasAnyOpen ? 'md:!pt-1' : '')"
    >
      <span v-editable="index !== undefined ? `accordion.${index}.title` : ''">{{ title }}</span>
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
      <div class="pb-6 md:pb-10 pt-0 px-6" :class="[isRTL ? 'pl-8 md:pl-16' : 'pr-8 md:pr-16']">
        <p v-editable="index !== undefined ? `accordion.${index}.content` : ''" class="leading-relaxed text-gray-600">{{ content }}</p>
        
        <!-- Subtle Organic Link Pill -->
        <div v-if="link && link.url" class="pt-3.5">
          <NuxtLink
            :to="localePath(link.url)"
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-najmgreen bg-najmgreen/10 hover:bg-najmgreen/20 border border-najmgreen/20 hover:border-najmgreen/40 transition-all duration-200 group shadow-2xs select-none"
            @click.stop
          >
            <span>{{ link.text }}</span>
            <svg
              class="w-3.5 h-3.5 transition-transform duration-200"
              :class="isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1 rotate-180'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import gsap from 'gsap'
import { useLocale } from '~/composables/useLocale'

const { language, localePath } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const props = defineProps<{
  title?: string
  content?: string
  isOpen?: boolean
  hasAnyOpen?: boolean
  delay?: number
  index?: number
  link?: { text: string; url: string }
}>()

const contentEl = ref(null)

watch(
  () => props.isOpen,
  async (open) => {
    await nextTick()
    const el = contentEl.value as HTMLElement | null
    if (!el) return

    if (open) {
      const fullH = el.scrollHeight
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: fullH,
          opacity: 1,
          ease: 'power2.out', // Changed from power2.inOut
          duration: 0.3,      // Changed from 0.6
          onComplete: () => (el.style.height = 'auto')
        }
      )
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        ease: 'power2.out', // Changed from power2.inOut
        duration: 0.3       // Changed from 0.6
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
