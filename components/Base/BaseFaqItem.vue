<template>
    <div    :delay="index*100" class="py-1 text-sm text-d4 text-demibold">
      <!-- question row -->
      <!-- {{index}} -->

      <button
        class="w-full flex bg-transparent justify-between items-center text-right py-3 focus:outline-none"
        @click="toggle"
      >

        <span class="max-w-[95%] text-sm font-demibold text-[#2F3136]">
          {{ question }}
        </span>
        <svg
          ref="arrowRef"
          :style="arrowStyle"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-3 h-3"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
  
      <!-- answer panel -->
      <div
        ref="containerRef"
        :style="containerStyle"
        class="overflow-hidden"
      >
        <div
          ref="contentRef"
          class="mt-2 text-xs text-gray-600 text-right leading-relaxed mb-2"
        >
          {{ answer }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  
  const props = defineProps<{
    question: string
    answer: string
    index: number
    open: boolean
  }>()

  const emit = defineEmits(['toggle'] as const)


  
  const question = props.question
  const answer   = props.answer
  const index   = props.index


  // open state
  const open = ref(false)

  

function toggle() {
  emit('toggle')
}

  
  // refs
  const containerRef = ref<HTMLElement|null>(null)
  const contentRef   = ref<HTMLElement|null>(null)
  const arrowRef     = ref<SVGSVGElement|null>(null)
  
  // reactive styles
  const containerStyle = ref<Record<string,string>>({
    height:        '0px',
    opacity:       '0',
    transform:     'translateY(-10px)',
    transition:    'height 300ms ease, opacity 300ms ease, transform 300ms ease',
  })
  const arrowStyle = ref<Record<string,string>>({
    transform:     'rotate(0deg) scale(1)',
    transition:    'transform 300ms ease',
  })
  
  // animate on open/close
//   watch(open, async (isOpen) => {
  watch(() => props.open, async (isOpen) => {

    // wait until DOM updates
    await nextTick()
  
    if (isOpen && contentRef.value && containerRef.value) {
      // measure content height
      const fullH = contentRef.value.scrollHeight + 20
      containerStyle.value.height    = `${fullH}px`
      containerStyle.value.opacity   = '1'
      containerStyle.value.transform = 'translateY(0)'
      arrowStyle.value.transform     = 'rotate(45deg) scale(1.1)'
    } else {
      containerStyle.value.height    = '0px'
      containerStyle.value.opacity   = '0'
      containerStyle.value.transform = 'translateY(-10px)'
      arrowStyle.value.transform     = 'rotate(0deg) scale(1)'
    }
  }, { immediate: true })
  </script>
  
  <style scoped>
  /* no extra transitions here—everything is inline */
  </style>
  