<!-- components/MenuLevel.vue -->
<template>
    <div>
        
      <div v-for="item in items || []" :key="item.id" class="mb-1">
        <!-- only use the accordion when type=accordion -->
        
        <BaseAccordionGroupNew
        :activeFiltersCount="trueCounts[item.id]"
        :open=false
          v-if="item.type === 'accordion'"
          :title="item.name"
          :tabs="item.tabs"
          :panes="item.children"   
          class="border rounded overflow-hidden"
        >
          <!-- ② named slot for each pane when tabs=true -->
          <template #pane="{ pane }">
            <MenuLevel
              :items="pane.children"
              :parent-slug="fullSlug(pane)"
            />
          </template>
  
          <!-- ③ default-slot fallback (e.g. when tabs is false) -->
          <template #default>
            <MenuLevel
              :items="item.children"
              :parent-slug="fullSlug(item)"
            />
          </template>
        </BaseAccordionGroupNew>
  
        <!-- non-accordion items -->
        <div
          v-else-if="item.type === 'label'"
          class="text-gray-500 font-medium text-sm mt-4 mb-2"
        >
          {{ item.name }}
        </div>
  
        <NuxtLink
          v-else-if="item.type === 'link'"
          :to="fullSlug(item)"
          class="py-3 my-0  flex justify-between items-center"
        >
          <span>{{ item.name }}</span>
          <Icon name="mdi:arrow-left" class="w-6 h-6 " />
        </NuxtLink>

        <div
          v-else-if="item.type === 'filter'"
          :to="fullSlug(item)"
          @click="item.value=!item.value"
          class="py-0 my-2 flex gap-2 justify-start items-center"
        >
        

            <Icon v-if="item.value" name="mdi:checkbox-marked" class="w-6 h-6 text-black" />
            <Icon v-else name="mdi:checkbox-blank-outline"  class="w-6 h-6 text-[#A8ABAE] hover:text-gray-500" />
            
            <div :class="{'!text-black':item.value}" class="text-xs text-demibold group-hover:text-black/80 text-black/50">{{ item.name }}</div>
            <div class="text-xs text-demibold text-[#A8ABAE]">({{toPersianDigits(item.count)}} مدل)</div>

        </div>


        <NuxtLink
          v-else-if="item.type === 'link-simple'"
          :to="fullSlug(item)"
          class="py-0 my-3 px-5 flex gap-2 justify-start items-center"
        >
          <div  class="text-demibold hover:text-black/80 text-black">{{ item.name }}</div>
          <div v-if="item.count" class="text-demibold text-[#A8ABAE]">({{toPersianDigits(item.count)}} مدل)</div>

        </NuxtLink>
        <NuxtLink
          v-else-if="item.type === 'link-simple-xs'"
          :to="fullSlug(item)"
          class="py-0 my-3 px-5 flex gap-2 justify-start items-center"
        >
          <div  class="text-xs text-demibold hover:text-black/80 text-black">{{ item.name }}</div>
          <div v-if="item.count" class="text-xs text-demibold text-[#A8ABAE]">({{toPersianDigits(item.count)}} مدل)</div>

        </NuxtLink>


      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import BaseAccordionGroupNew from '~/components/Base/BaseAccordionGroupNew.vue'
  import MenuLevel from '~/components/MenuLevel.vue'
  import { toPersianDigits } from '~/utils/digits'

  const props = defineProps<{
    items?: Array<any>
    parentSlug?: string
  }>()
  
//   const fullSlug = (item: any) =>
//     props.parentSlug
//       ? `${props.parentSlug}/${item.slug}`
//       : `${item.slug}`

  
  const fullSlug = (item: any) =>
    props.parentSlug
      ? `${props.parentSlug}/${item.slug}`
      : `${item.slug}`


      function onAccordionOpen(itemId: string|number) {
        console.log(trueCounts,"itemId: ",itemId)
  const n = trueCounts.value[itemId] || 0
  console.log(`Accordion ${itemId} has ${n} active filters`)
}


// lazy, but correct
// helper to count grandchildren values
function countGrandchildrenTrue(children: Array<any> = []) {
  return children.reduce((sum, child) => {
    if (Array.isArray(child.children)) {
      // count all grandchildren with value === true
      sum += child.children.filter(gc => gc.value === true).length
      console.log(child.children.filter(gc => gc.value === true).length)

    }
    return sum
  }, 0)
}

const trueCounts = computed<Record<string|number, number>>(() =>
  (props.items || []).reduce((acc, item) => {
    if (item.type === 'accordion' && Array.isArray(item.children)) {
      acc[item.id] = countGrandchildrenTrue(item.children)
    }
    // console.log(item)
    return acc
  }, {} as Record<string|number, number>)
)
  </script>
  