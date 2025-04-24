
<!-- components/HamburgerMenu.vue -->
<template>
  <div
  @pointerdown="toggleMenu"

    class="hh w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-gray-200 transition-all duration-400 ease-in-out hover:bg-gray-300/25 hover:text-gray-900 cursor-pointer"
    ref="menuContainer"
  >
    <Drawer v-model:open="menuOpen">
      <Menu @click="handleWrapperClick" />
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollLock } from '@vueuse/core'
import Drawer from '@/components/Drawer.vue'
import Menu from '@/components/Menu.vue'

const props = defineProps<{ menuOpen: boolean }>()
const emit = defineEmits<{
  (e: 'update:menuOpen', value: boolean): void
}>()

const menuOpen = ref(props.menuOpen)
const menuContainer = ref<HTMLElement | null>(null)
const isLocked = useScrollLock(menuContainer)

function toggleMenu(event?: PointerEvent) {
  // Cast to HTMLElement so we can use classList
  const target = event?.target as HTMLElement | null;
  
  // If there's no element or it doesn't have the .hh class, do nothing
  if (!target?.classList.contains('hh')) {
    console.log("cant:", target);
    return;
  }

  console.log("toggled by:", target);
  menuOpen.value = !menuOpen.value;
  emit('update:menuOpen', menuOpen.value);
}

function handleWrapperClick(event: PointerEvent) {
  console.log("wrapper clicked by: ", event.target)
  if ((event.target as HTMLElement).closest('a')) {
    menuOpen.value = false;
    return;
  }
  event.stopPropagation()
}

// function handleWrapperClick(event: PointerEvent) {
//   console.log("wrapper clicked by: ", event.target)
//   if ((event.target as HTMLElement).closest('a')) return
//   event.stopPropagation()
// }
</script>
