<template>
  <div class="grid grid-cols-12 gap-6 rtl">
    <!-- Filters -->
    <aside class="col-span-12 sm:col-span-6 md:col-span-3 space-y-1">

    <FilterCollapse
      v-for="(filter, index) in filters"
      :key="index"
      :title="filter.title"
      :tabs="filter.tabs"
      :isCollapsed="filter.isCollapsed"
      :items="filter.items"
    />
  </aside>
    <!-- Product Grid -->
    <section class="col-span-12 sm:col-span-6  md:col-span-9">
      <slot name="products" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import ChevronDownIcon from "~/assets/icons/chevron-down-icon.svg";
import FilterCollapse from '@/components/filters/FilterCollapse.vue'

const filters = [
  {
    title: 'نوع محصول',
    isCollapsed: false,
    tabs: [
      { key: 'applications', label: 'کاربردها' },
      { key: 'industries', label: 'صنعت‌ها' }
    ],
    items: [
      { label: 'سازمانی و اداری', count: 16, tab: 'applications' },
      { label: 'تبلیغاتی و بازاریابی', count: 8, tab: 'applications' },
      { label: 'صنعتی و فنی', count: 6, tab: 'applications' },
      { label: 'لوکس و هدیه', count: 22, tab: 'applications' },
      { label: 'ماشین‌آلات', count: 9, tab: 'industries' },
      { label: 'مواد غذایی', count: 4, tab: 'industries' },
    ]
  },
  {
    title: 'رنگ محصول',
    isCollapsed: true,
    items: [
      { label: 'مشکی', count: 14 },
      { label: 'سفید', count: 22 },
      { label: 'طلایی', count: 6 },
    ]
  },
  {
    title: 'جنس جعبه',
    isCollapsed: true,
    items: [
      { label: 'مقوایی', count: 10 },
      { label: 'چوبی', count: 7 },
      { label: 'پلاستیکی', count: 3 },
    ]
  },
  {
    title: 'نوع چاپ',
    isCollapsed: true,
    items: [
      { label: 'افست', count: 12 },
      { label: 'دیجیتال', count: 9 },
    ]
  },
  {
    title: 'مناسبت‌ها',
    isCollapsed: true,
    items: [
      { label: 'نوروز', count: 5 },
      { label: 'یلدا', count: 7 },
      { label: 'تبریک', count: 10 },
    ]
  }
]

const activeTab = ref<'applications' | 'industries'>('applications')
const isCollapsed = ref(false)
const contentRef = ref<HTMLElement | null>(null)

// Slide transition functions
function beforeEnter(el: Element) {
  const element = el as HTMLElement
  element.style.height = '0'
}

function enter(el: Element) {
  const element = el as HTMLElement
  const scrollHeight = element.scrollHeight
  element.style.transition = 'height 0.3s ease'
  element.style.height = scrollHeight + 'px'
}

function beforeLeave(el: Element) {
  const element = el as HTMLElement
  element.style.height = element.scrollHeight + 'px'
  element.style.transition = 'height 0.3s ease'
}

function leave(el: Element) {
  const element = el as HTMLElement
  element.style.height = '0'
}
</script>











