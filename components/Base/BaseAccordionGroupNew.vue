<!-- components/Base/BaseAccordionGroupNew.vue -->
<template>
  <div
    class="group transition-all duration-300 bg-gray-50/90 hover:bg-gray-100/90 border border-gray-200/80 rounded-2xl overflow-hidden mb-3"
    :class="{ '!border-najmgreen/40 shadow-xs bg-white': openValue }"
  >
    <!-- Header / Trigger -->
    <button
      type="button"
      class="w-full flex items-center justify-between py-3.5 px-4 sm:px-5 text-sm font-bold text-gray-800 transition-colors select-none cursor-pointer active:scale-[0.99]"
      :class="{ '!text-najmgreen': openValue }"
      @click="toggleOpen"
    >
      <div class="flex items-center gap-2">
        <span>{{ title }}</span>
        <span
          v-if="activeFiltersCount > 0"
          class="text-[11px] font-semibold bg-najmgreen text-white px-2 py-0.5 rounded-full"
        >
          {{ toPersianDigits(activeFiltersCount) }}
        </span>
      </div>

      <Icon
        name="mdi:chevron-down"
        class="w-5 h-5 text-gray-400 transition-transform duration-300 origin-center"
        :class="{ 'rotate-180 !text-najmgreen': openValue }"
      />
    </button>

    <!-- CSS Grid Expansion (Zero scroll traps, instantaneous & smooth!) -->
    <div
      class="grid transition-[grid-template-rows] duration-300 ease-out"
      :style="{ gridTemplateRows: openValue ? '1fr' : '0fr' }"
    >
      <div class="overflow-hidden">
        <div class="px-3 pb-4 pt-1">
          <!-- Panes / Tabs -->
          <div v-if="tabs && panes?.length">
            <nav class="flex w-max max-w-full overflow-x-auto mx-auto items-center justify-between p-1 mb-4 rounded-full border border-gray-200 bg-gray-100/80 text-xs gap-1">
              <button
                v-for="(pane, idx) in panes"
                :key="pane.slug || idx"
                type="button"
                @click="activeTab = idx"
                class="px-4 sm:px-6 py-1.5 rounded-full font-bold text-center transition-all duration-200 cursor-pointer whitespace-nowrap"
                :class="activeTab === idx ? 'bg-najmgreen text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'"
              >
                {{ pane.name }}
              </button>
            </nav>
            <slot name="pane" :pane="panes[activeTab]" />
          </div>

          <!-- Default content slot -->
          <div v-else>
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { toPersianDigits } from '~/utils/digits'

const props = withDefaults(
  defineProps<{
    title: string
    tabs?: boolean
    open?: boolean
    activeFiltersCount?: number
    panes?: Array<{ name: string; slug: string }>
  }>(),
  {
    open: false,
    tabs: false,
    activeFiltersCount: 0,
    panes: () => []
  }
)

const openValue = ref(props.open)
const activeTab = ref(0)

function toggleOpen() {
  openValue.value = !openValue.value
}

watch(() => props.open, (v) => {
  if (v !== undefined) {
    openValue.value = v
  }
})
</script>
  