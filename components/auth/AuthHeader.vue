<!-- components/AuthHeader.vue -->
<template>
  <div class="flex flex-col items-start rtl gap-9 text-center">
    <div class="flex p-5 self-center items-center justify-center rounded-full bg-[#E4F0DC]">
      <template v-if="isCustomIcon">
        <img
          :src="customIconSrc"
          class="h-12 w-12"
          alt=""
        />
      </template>
      <template v-else>
        <Icon
          :name="icon"
          class="h-12 w-12 text-[#3A7C2B]"
        />
      </template>
    </div>
    <div class="flex flex-col items-start text-right space-y-2 rtl">
      <h1 class="text-2xl font-extrabold leading-tight">{{ title }}</h1>
      <div class="text-xs leading-5 text-[#797B7D]">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  title: string
  subtitle?: string
}
const props = defineProps<Props>()

// 1. Glob-import all SVGs in assets/icons/Auth as URLs (bundled by Vite)
const svgModules = import.meta.glob('@/assets/icons/Auth/*.svg', { as: 'url', eager: true })
console.log(svgModules)
// 2. Build a map from filename (without extension) → URL
const iconMap: Record<string, string> = {}
for (const path in svgModules) {
  const m = path.match(/\/([\w-]+)\.svg$/)
  if (m) iconMap[m[1]] = svgModules[path] as string
}

// 3. Computed flags & src
const isCustomIcon = computed(() => Boolean(iconMap[props.icon]))
const customIconSrc = computed(() => iconMap[props.icon]!)
</script>
