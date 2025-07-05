<!-- components/Base/BaseFooterAccordion.vue -->
<template>
    <div
      class="group  bg-[#115247]/100  border border-transparent rounded-xl overflow-hidden transition-colors  "
      :class="{ '!border-primary-600': open }"
    >
      <!-- Header -->
      <button
        class="w-full flex transition-height duration-500 ease justify-between hover:bg-[#023028]/20 items-center py-4 px-6 text-sm gap-2 cursor-pointer"
        :class="{ 'bg-[#023028]/20': open }"
        @click="toggle"
      >
        <span class="text-white/80 group-hover:text-white/100 text-sm text-d4 text-demibold">{{ title }}</span>
  
        <!-- chevron -->
        <Icon
          name="mdi:chevron-down"
          class="w-5 h-5 text-white/80 group-hover:text-white/100 transition-transform duration-300"
          :style="{ transform: `rotate(${open ? 180 : 0}deg)` }"
        />
      </button>
  
      <!-- Sliding panel -->
      <div
        ref="contentRef"
        :style="contentStyles"
        class="overflow-hidden  ease transition-height duration-300  bg-[#115247]/100 "
      >
        <ul class="my-0">
          <div class="divide-y divide-white/20">
          <div class="hover:bg-white/10  text-center py-2 border-t border-t-0.5 border-white/20" v-for="item in items" :key="item.id">
            <NuxtLink
              :to="item.slug"
              class="block py-1 px-8 text-white/100 text-xs text-d4 text-demibold text-right "
            >
            <div class="w-max rounded-lg p-1">
            {{ item.name }}
          </div>
            </NuxtLink>
          </div>
        </div>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, watch, nextTick } from 'vue'
  
  interface Item {
    id: string
    name: string
    slug: string
  }
  
  const props = defineProps<{
  id: string
  title: string
  items: Item[]
  initialOpen?: boolean
  modelValue: boolean
}>()

  
  // const open = ref(props.initialOpen ?? false)
  const open = computed(() => props.modelValue)

  const contentRef = ref<HTMLElement | null>(null)
  
  /**
   * We animate height: 0 → scrollHeight → auto (and back)
   * to get a buttery-smooth accordion.
   */
  const contentStyles = reactive<{ height: string }>({ height: '0px' })
  
  /** helper that sets the inline height style for the transition */
  function setHeight(expand: boolean) {
    const el = contentRef.value
    if (!el) return
  
    if (expand) {
      // expand: 0 → explicit px → auto
      contentStyles.height = el.scrollHeight + 'px'
      // after the transition, allow natural height
      setTimeout(() => {
        if (open.value) contentStyles.height = 'auto'
      }, 300) // ← keep in sync with duration-300
    } else {
      // collapse: auto/px → px → 0
      if (contentStyles.height === 'auto') {
        contentStyles.height = el.scrollHeight + 'px'
        void el.offsetHeight // force re-flow
      }
      contentStyles.height = '0px'
    }
  }
  
  const emit = defineEmits<{
  (e: 'toggle', id: string): void
}>()

  watch(
    () => open.value,
    v => nextTick(() => setHeight(v)),
    { immediate: true }
  )
  
  function toggle() {
    // open.value = !open.value
    emit('toggle', props.id) // send id to parent
    console.log(props.id)

  }
  
  </script>
  