<!-- components/drawer.vue -->
<template>
    <div class=" w-full h-full">
      <!-- Hamburger button that morphs into close icon, always on top -->
      <button
        class="menu"
        :class="{ opened: open }"
        @click="toggle"
        :aria-expanded="open.toString()"
        aria-label="Main Menu"
      >
        <svg width="24" height="24" viewBox="0 0 100 100">
          <path
            class="line line1"
            d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
          />
          <path
            class="line line2"
            d="M 20,50 H 80"
          />
          <path
            class="line line3"
            d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
          />
        </svg>
      </button>
  
      <!-- Full screen sliding drawer -->
      <transition name="slide-full">
        <div v-if="open" class=" absolute h-screen w-screen inset-0 bg-white z-50 flex flex-col pt-24">
          <div class="drawer-body flex-1 overflow-auto p-6">
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  const open = ref(false);
  function toggle() {
    open.value = !open.value;
  }
  </script>
  
  <style scoped>
  .menu {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex; 
    position: fixed;
    /* top: 1rem;
    right: 1rem; */
    z-index: 60;
  }
  .line {
    fill: none;
    stroke: black;
    stroke-width: 6;
    transition: stroke-dasharray 600ms cubic-bezier(0.4,0,0.2,1), stroke-dashoffset 600ms cubic-bezier(0.4,0,0.2,1);
  }
  .line1 {
    stroke-dasharray: 60 207;
  }
  .line2 {
    stroke-dasharray: 60 60;
  }
  .line3 {
    stroke-dasharray: 60 207;
  }
  .opened .line1 {
    stroke-dasharray: 90 207;
    stroke-dashoffset: -134;
  }
  .opened .line2 {
    stroke-dasharray: 1 60;
    stroke-dashoffset: -30;
  }
  .opened .line3 {
    stroke-dasharray: 90 207;
    stroke-dashoffset: -134;
  }
  
  /* Slide-full transition */
  .slide-full-enter-from {
    transform: translateY(-100%);
    opacity: 0;
  }
  .slide-full-enter-to {
    transform: translateY(0);
    opacity: 1;
  }
  .slide-full-leave-from {
    transform: translateY(0);
    opacity: 1;
  }
  .slide-full-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }
  .slide-full-enter-active,
  .slide-full-leave-active {
    transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease;
  }
  </style>
  