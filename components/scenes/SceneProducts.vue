<!-- components/scenes/SceneProducts.vue -->
<!-- SceneProducts.vue -->
<template>
  <div class="rtl snap-start flex flex-col flex-grow w-full h-full gap-12 pt-12">
    <SceneHeading hideLabel :data="data" align="center" />

    <!-- Type Toggle -->
    <div class="w-max mx-auto cursor-pointer">
      <button
        v-for="type in types"
        :key="type"
        @click.prevent="toggleType(type)"
        class="mx-1 px-6 py-[15px] rounded-[35px] text-sm transition-all"
        :class="[selectedType === type
          ? 'bg-najmgreen text-white'
          : 'bg-transparent text-black hover:bg-gray-300/40']"
      >
        {{ data.types[type]}}
      </button>
    </div>

     <!-- Tabs -->
     <div class="relative h-8 lg:h-28">
  <div
    ref="tabsContainer"
    class="tabs-container w-screen lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:w-screen flex flex-nowrap lg:flex-wrap gap-2 whitespace-nowrap lg:whitespace-normal overflow-x-auto lg:overflow-visible px-4 pl-2 pr-4 translate-x-4 py-2 justify-start lg:justify-center"
    >
    <button
      v-for="(group, i) in uniqueGroups"
      :key="`${selectedType}-${group}-${i}`"
      @click="selectTab(i, group)"
      class="transition-all rounded-3xl border text-xs px-6 py-3 hover:bg-najmgreen/10 hover:scale-105"
      :class="[activeTab === i
        ? 'border-[#C2D3D1] !bg-najmgreen !text-white'
        : 'border-[#C2D3D1] text-gray-700']"
    >
      {{ group }}
    </button>
  </div>
</div>
    <!-- Product Carousel -->
    <ClientOnly>
      <EmbleProductCards
        ref="productsRef"
        :selectedType="selectedType"
        controls="dots"
        position="center"
        :products="filteredProducts"
      />
    </ClientOnly>

   

    <!-- JSON Modal -->
    <!-- <JsonModal :data="products" :key="`${selectedType}-${activeGroup}-json`" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, type Ref } from 'vue'
import SceneHeading from '~/components/scenes/SceneHeading.client.vue'
import EmbleProductCards from '@/components/cards/EmbleProductCards.vue'
import JsonModal from '@/components/JsonModal.vue'
import { useProductsAll } from '@/composables/useProductsAll'

interface Product {
  id: number
  type: string
  group: string
  name: string
  subtitle: string
  price: string
  buttonText: string
  image: string
}

const dataPrev = {
  label: 'محصولات',
  header: 'بهترینِ خودت باش!<mobile> توی هر صنعتی، هر برندی، هر مناسبتی',
  description1:
    'چاپ و بسته‌بندی در هر پروژه‌ا‌ی و هر برندی، در هر صنعتی و برای هر مصرفی، نیازهای خاص خودش رو داره و ما این را به خوبی درک می‌کنیم. به جای محدودیت، ما به دنبال یافتن بهترین راه‌حل برای اجرای ایده‌های شما هستیم.',
  description2: '',
}

const homeUI = inject<any>('homeUI') ?? {}
const data = computed(() => homeUI?.value?.sceneProducts ?? {})


const types = ['printing','packaging']
const selectedType = ref<string>(types[0])
const activeGroup = ref<string>('')
const productsRef = ref<InstanceType<typeof EmbleProductCards> | null>(null)
const PosRef = ref<'Start' | 'End'>('Start')
const { products } = useProductsAll() as { products: Ref<Product[]> }

// Toggle between types and reset group
function toggleType(type: string) {
  if (selectedType.value === type) {
    PosRef.value === 'Start'
      ?  (PosRef.value = 'End') && productsRef.value?.scrollToEnd()
      : (PosRef.value = 'Start') && productsRef.value?.scrollToStart() 
  } else {
    selectedType.value = type
    PosRef.value = 'Start'

    activeGroup.value = ''
    activeTab.value = -1

    productsRef.value?.scrollToStart()
    selectTab(-1,'')
    // reset to first group when type changes
    // activeGroup.value = uniqueGroups.value[0]

  }
}

// Filter by type, then group
const filteredByType = computed<Product[]>(() =>
  products.value.filter(p => p.type === selectedType.value)
)

// Unique groups based on type
const uniqueGroups = computed<string[]>(() => {
  const groups = filteredByType.value.map(p => p.group)
  return Array.from(new Set(groups))
})

// Final filtered products
const filteredProducts = computed(() => {
  return activeGroup.value
    ? filteredByType.value.filter(p => p.group === activeGroup.value)
    : filteredByType.value
})

// Tabs state
const activeTab = ref<number>(0)
watch(activeTab, () => { /* reset any item selection if needed */ })

const tabsContainer = ref<HTMLElement | null>(null)
// Select group tab
function selectTab(index: number, group: string) {
  if (activeTab.value !== index) {
    activeTab.value = index
    activeGroup.value = group
  } else {
    // deselect and reset to first tab
    activeTab.value = -1
    // activeGroup.value = uniqueGroups.value[0]
    activeGroup.value = ''
    index=0
  }

  nextTick(() => {
    const target = activeGroup.value ? index : 0
    const btn = tabsContainer.value
      ?.querySelectorAll('button')[target]
    btn?.scrollIntoView({
      behavior: 'smooth',
      block:    'nearest',
      inline:   'start',
    })

  })
}
</script>


<style>
.slides-wrapper {
  /* force a fixed height so the page doesn’t “shrink” during the fade */
}

/* Out-in fade on the whole wrapper */
.fade-list-enter-active,
.fade-list-leave-active {
  transition: opacity .3s ease;
}

.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
}



.tabs-container::-webkit-scrollbar {
  display: none; /* For Chrome, Safari */
}

.tabs-container {
  -ms-overflow-style: none;  /* IE/Edge */
  scrollbar-width: none;     /* Firefox */
}

</style>