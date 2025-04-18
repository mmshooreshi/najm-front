<template>
  <div class="bg-white p-6 py-3 rounded-3xl space-y-4">
    <!-- Collapse Header -->
    <div
      class="group flex justify-between items-center cursor-pointer"
      @click="collapsed = !collapsed"
    >
      <h2 class="text-sm font-semibold">{{ title }}</h2>
      <ChevronDownIcon
        class="transition-transform duration-300"
        :class="{ 'rotate-180': !collapsed }"
      />
    </div>

    <!-- Slide Transition with JS hooks -->
    <Transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div
        v-if="!collapsed"
        ref="contentRef"
        class="overflow-hidden space-y-4"
      >
        <!-- Tabs (optional) -->
        <div
          v-if="tabs?.length"
          class="flex w-max mx-auto items-center justify-between p-1 rounded-full border border-gray-300 text-xs"
        >
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="px-6 py-2 rounded-full font-medium text-center bg-transparent"
            :class="
              activeTab === tab.key
                ? '!bg-[#014439] text-white'
                : 'text-gray-700'
            "
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Filter Items -->
        <div class="text-xs space-y-2 text-right">
          <label
            v-for="item in shownItems"
            :key="item.label"
            class="flex justify-between gap-2 h-6"
          >
            <span>
              {{ item.label }}
              <span class="m-1 text-gray-400">({{ item.count }} آیتم)</span>
            </span>
            <input type="checkbox" class="form-checkbox" />
          </label>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import ChevronDownIcon from '~/assets/icons/chevron-down-icon.svg'

// Types
interface Tab { key: string; label: string }
interface FilterItem { label: string; count: number; tab?: string }

// Props
defineProps<{ title: string; tabs?: Tab[]; items: FilterItem[]; isCollapsed?: boolean }>()
const props = defineProps()

// State
const collapsed = ref(props.isCollapsed ?? true)
const activeTab = ref(props.tabs?.[0]?.key || '')
const contentRef = ref<HTMLElement>()

// Computed
const shownItems = computed(() =>
  props.tabs?.length
    ? props.items.filter(i => i.tab === activeTab.value)
    : props.items
)

// JS Hook Functions
function beforeEnter(el: HTMLElement) {
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.overflow = 'hidden'
  el.style.transition = ''
}

function enter(el: HTMLElement, done: () => void) {
  nextTick(() => {
    const fullHeight = el.scrollHeight + 'px'
    el.style.transition = 'height 300ms ease, opacity 300ms ease'
    el.style.height = fullHeight
    el.style.opacity = '1'
    const cleanup = (e: TransitionEvent) => {
      if (e.propertyName === 'height') {
        el.removeEventListener('transitionend', cleanup)
        done()
      }
    }
    el.addEventListener('transitionend', cleanup)
  })
}

function afterEnter(el: HTMLElement) {
  el.style.height = ''
  el.style.opacity = ''
  el.style.overflow = ''
  el.style.transition = ''
}

function beforeLeave(el: HTMLElement) {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  el.style.overflow = 'hidden'
  el.style.transition = ''
}

function leave(el: HTMLElement, done: () => void) {
  nextTick(() => {
    el.style.transition = 'height 300ms ease, opacity 300ms ease'
    el.style.height = '0px'
    el.style.opacity = '0'
    const cleanup = (e: TransitionEvent) => {
      if (e.propertyName === 'height') {
        el.removeEventListener('transitionend', cleanup)
        done()
      }
    }
    el.addEventListener('transitionend', cleanup)
  })
}

function afterLeave(el: HTMLElement) {
  el.style.height = ''
  el.style.opacity = ''
  el.style.overflow = ''
  el.style.transition = ''
}
</script>
