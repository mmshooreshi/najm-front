<!-- // File: components/auth/AuthSocialButtons.vue -->
<script setup lang="ts">
interface Icon {
  alt: string
  src: string
}
interface Props {
  icons: Icon[]
}
const props = defineProps<Props>()
</script>

<template>
  <div class="flex flex-row-reverse justify-between gap-2  mt-4 ">
    <div
      v-for="(icon, i) in props.icons"
      :key="i"
      class="w-full cursor-pointer hover:opacity-80 transition bg-[#E5EDED] px-6 py-3 rounded-xl"
    >
      <img :src="icon.src" :alt="icon.alt" loading="lazy" class="w-6 h-6 mx-auto object-contain" />
    </div>
  </div>
</template>
