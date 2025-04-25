<template>
  <div class="bg-white  p-6 py-3 rounded-3xl space-y-4">
    <!-- Collapse Header -->
    <div class="group flex justify-between items-center cursor-pointer" @click="collapsed = !collapsed">
      <h2 class="text-sm font-semibold">{{ title }}</h2>
      <ChevronDownIcon class="transition-transform duration-300" :class="{ 'rotate-180': !collapsed }" />
    </div>

    <!-- Slide Transition -->
    <Transition
@before-enter="beforeEnter"
@enter="enter"
@after-enter="afterEnter"
@before-leave="beforeLeave"
@leave="leave"
@after-leave="afterLeave"
>

      <div v-show="!collapsed" class="overflow-hidden space-y-4" ref="contentRef">
        <!-- Tabs (optional) -->
        <div v-if="tabs?.length" class="flex w-max mx-auto items-center justify-between p-1 rounded-full border border-gray-300 text-xs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="px-6 py-2 rounded-full font-medium text-center bg-transparent"
            :class="activeTab === tab.key ? '!bg-[#014439]/100 text-white' : 'text-gray-700'"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Filter Items -->
        <div class="text-xs space-y-2 text-right">
          <template v-for="item in shownItems" :key="item.label">
            <label class="flex justify-between gap-2 h-6">
              <span>{{ item.label }} <span class="m-1 text-gray-400">({{ item.count }} آیتم)</span></span>
              <input type="checkbox" class="form-checkbox" />
            </label>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ChevronDownIcon from '~/assets/icons/chevron-down-icon.svg'

type Tab = {
  key: string
  label: string
}

type FilterItem = {
  label: string
  count: number
  tab?: string
}

const props = defineProps<{
  title: string
  tabs?: Tab[]
  items: FilterItem[]
  isCollapsed?: boolean
}>()

const collapsed = ref(props.isCollapsed ?? true)
const activeTab = ref(props.tabs?.[0]?.key || '')

const contentRef = ref<HTMLElement | null>(null)

function beforeEnter(el: Element) {
const elHtml = el as HTMLElement
elHtml.style.height = '0px'
elHtml.style.opacity = '0'
elHtml.style.overflow = 'hidden'
}

function enter(el: Element) {
const elHtml = el as HTMLElement
const height = elHtml.scrollHeight

elHtml.style.transition = 'height 300ms ease, opacity 300ms ease'
requestAnimationFrame(() => {
  elHtml.style.height = `${height}px`
  elHtml.style.opacity = '1'
})
}

function afterEnter(el: Element) {
const elHtml = el as HTMLElement
elHtml.style.height = 'auto'
elHtml.style.transition = ''
elHtml.style.overflow = ''
elHtml.style.opacity = ''
}

function beforeLeave(el: Element) {
const elHtml = el as HTMLElement
elHtml.style.height = `${elHtml.scrollHeight}px`
elHtml.style.opacity = '1'
elHtml.style.overflow = 'hidden'
elHtml.style.transition = ''
}

function leave(el: Element) {
const elHtml = el as HTMLElement

// force reflow
void elHtml.offsetHeight

elHtml.style.transition = 'height 300ms ease, opacity 300ms ease'
elHtml.style.height = '0px'
elHtml.style.opacity = '0'
}

function afterLeave(el: Element) {
const elHtml = el as HTMLElement
elHtml.style.transition = ''
elHtml.style.height = ''
elHtml.style.opacity = ''
elHtml.style.overflow = ''
}


const shownItems = computed(() => {
  if (!props.tabs?.length) return props.items
  return props.items.filter(i => i.tab === activeTab.value)
})


</script>





