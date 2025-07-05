<!-- components/motions/PlusMinuxMorph.vue -->
<template>
    <button
      class="plus-minus "
      type="button"
      :class="{ active }"
      @click="$emit('update:click')"
    >
      <span></span>
      <span></span>
    </button>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{ 
    /** When true, shows the “minus” state; when false, shows the “plus” */ 
    active: boolean 
  }>()
  
//   const emit = defineEmits<['click']>()
  </script>
  
  <style scoped>
  .plus-minus {
    width: 18px;
    height: 18px;
    border: none;
    padding: 0;
    background: transparent;
    position: relative;
    cursor: pointer;
  }
  
  .plus-minus span {
    position: absolute;
    transition: transform 300ms, opacity 300ms;
    background: black;
    border-radius: 8px;
  }
  
  /* vertical line */
  .plus-minus span:first-child {
    top: 25%;
    bottom: 25%;
    width: 8%;
    left: 46%;
  } 
  
  /* horizontal line */
  .plus-minus span:last-child {
    left: 25%;
    right: 25%;
    height: 8%;
    top: 46%;
  }
  
  /* when active, hide the vertical bar and rotate the horizontal into a minus */
  .plus-minus.active span:last-child {
    transform: scaleY(0);
    opacity: 0;
  }
  
  .plus-minus.active span:first-child {
    /* keep it horizontal — you could also animate width if you like */
    transform: rotate(90deg);
  }
  </style>
  