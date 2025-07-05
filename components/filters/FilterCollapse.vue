<!-- components/filters/FilterCollapse.vue -->
<template>
  <div class=" p-6 py-3 rounded-3xl space-y-4 flex flex-col">

    <!-- Header -->
    <button
      class="group flex flex-row w-full justify-between items-center cursor-pointer"
      type="button"
      @click.prevent="toggle"

    >
      <h2 class="text-sm font-semibold">{{ title }}</h2>
      <!-- <ChevronDownIcon
        class="transition-transform duration-300"
        :class="{ 'rotate-180': !collapsed }"
      /> -->
     <div class="flex-grow w-min bg-red"></div>

      <div class="p-1 px-2 text-xs rounded-3xl bg-[#F1F5F9]/100">{{  }} ۸</div>
      <div class="w-max m-auto">      <PlusMinusMorph
        :active="!collapsed"
        class="transition-transform duration-300"
      /></div>


    </button>

    <!-- Slide Transition -->
    <Transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-if="!collapsed" ref="contentRef" class="space-y-4">
        <!-- Tabs -->
        <div
          v-show="tabs?.length"
          class="mt-6 flex w-max mx-auto items-center justify-between p-1 rounded-full border border-gray-300 text-xs "
        >
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click.stop="selectTab(tab.key)"
            class="px-6 py-2 rounded-full font-medium text-center transition-colors cursor-pointer"
            :class="activeTab === tab.key ? 'bg-[#014439]/100 text-white/100' : 'text-gray-700'"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Filter Items -->
        <div  class="text-xs space-y-2 bg-red mt-6">
          <div
            v-for="item in filteredItems"
            :key="item.label"
            class="flex flex-row items-center justify-around gap-4"
          >
            
              <Checkbox4 v-model="selected[item.label]"  label="" class="form-checkbox" >
              {{ item.label }}
              <span class="mx-1 text-gray-400">({{ item.count }} آیتم)</span>
            </Checkbox4>
          
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import ChevronDownIcon from '~/assets/icons/chevron-down-icon.svg';
import PlusMinusMorph from '@/components/motions/PlusMinuxMorph.vue'
import Checkbox4 from '@/components/motions/CheckBox.vue'

type Tab = { key: string; label: string };
type FilterItem = { label: string; count: number; tab?: string };

const props = defineProps<{
  title: string;
  tabs?: Tab[];
  items: FilterItem[];
  isCollapsed?: boolean;
}>();

// Reactive state
const collapsed = ref(props.isCollapsed ?? true);
const activeTab = ref(props.tabs?.[0]?.key ?? '');

// Maintain checkbox state
const selected = ref<Record<string, boolean>>({});
props.items.forEach(i => { selected.value[i.label] = false; });

// Ref for content container
const contentRef = ref<HTMLElement | null>(null);

// Computed filtered items by active tab
const filteredItems = computed(() => {
  if (!props.tabs?.length) return props.items;
  return props.items.filter(i => i.tab === activeTab.value);
});

// Watch for tabs change to reset activeTab
watch(() => props.tabs, (newTabs) => {
  if (newTabs?.length) activeTab.value = newTabs[0].key;
});

// Methods
function toggle() {
  collapsed.value = !collapsed.value;
}
function selectTab(key: string) {
  
  activeTab.value = key;
  console.log(activeTab.value)
}

// Transition hooks for smooth collapse/expand
function beforeEnter(el: Element) {
  const elHtml = el as HTMLElement;
  elHtml.style.height = '0';
  elHtml.style.opacity = '0';
  elHtml.style.overflow = 'hidden';
}
function enter(el: Element, done: () => void) {
  const elHtml = el as HTMLElement;
  const height = elHtml.scrollHeight;
  elHtml.style.transition = 'height 300ms ease, opacity 300ms ease';
  requestAnimationFrame(() => {
    elHtml.style.height = `${height}px`;
    elHtml.style.opacity = '1';
  });
  setTimeout(done, 300);
}
function afterEnter(el: Element) {
  const elHtml = el as HTMLElement;
  elHtml.style.height = 'auto';
  elHtml.style.overflow = '';
  elHtml.style.transition = '';
  elHtml.style.opacity = '';
}
function beforeLeave(el: Element) {
  const elHtml = el as HTMLElement;
  elHtml.style.height = `${elHtml.scrollHeight}px`;
  elHtml.style.opacity = '1';
  elHtml.style.overflow = 'hidden';
}
function leave(el: Element, done: () => void) {
  const elHtml = el as HTMLElement;
  void elHtml.offsetHeight;
  elHtml.style.transition = 'height 300ms ease, opacity 300ms ease';
  elHtml.style.height = '0';
  elHtml.style.opacity = '0';
  setTimeout(done, 300);
}
function afterLeave(el: Element) {
  const elHtml = el as HTMLElement;
  elHtml.style.height = '';
  elHtml.style.opacity = '';
  elHtml.style.overflow = '';
  elHtml.style.transition = '';
}
</script>
