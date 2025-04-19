<template>
    <div class="drawer-container">
      <!-- Hamburger button -->
      <div class="hamburger-icon flex-col" :class="{'flex-row':open}" @click="toggle">
        <span class="icon icon-1" :class="{ 'open': open }"></span>
        <span class="icon icon-2" :class="{ 'open': open }"></span>
        <span class="icon icon-3" :class="{ 'open ': open }"></span>
      </div>
  
      <!-- Full-screen sliding drawer -->
      <transition name="slide-full">
        <div v-if="open" class="drawer-panel">
          <div class="drawer-body">
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const open = ref(false)
  
  function toggle() {
    open.value = !open.value
  }
  </script>
  
  <style scoped lang="scss">
  .drawer-container {
    // position: relative;
    // width: 100%;
    // height: 100%;
  }
  
  .hamburger-icon {
    position: relative;
    top: 10%;
    left: 3%;
    // width: 60px;
    // height: 60px;
    display: flex;

    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    z-index: 1000;
  
    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    }
  }
  
  .icon {
  display: block;
  width: 18px;
  height: 1.5px;
  background-color: black;
  border-radius: 0.75px;
  transition: transform 0.2s ease-in-out;
  margin: 2.5px 0;

  /* ensure all bars can scale from center */
  transform-origin: center center;
}



  .icon-1.open {
    transform-origin: center center; /* default, but you can tweak */
  transform: translateY(6.5px) rotate(45deg);

    
  }
  
/* DEFAULT state for the middle bar */
.icon-2 {
    transform-origin: center center;

    transition: transform 0.2s ease-in-out;
  transform: scaleX(1);
}

/* when open, shrink it from both ends */
.icon-2.open {
  transform: scaleX(0);
  /* remove opacity hack if you left it commented: */
  /* opacity: 1; */
}
  
  .icon-3.open {
    transform-origin: center center; /* default, but you can tweak */
  transform: translateY(-6.5px) rotate(-45deg);

  }
  
  .drawer-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    z-index: 50;
    display: flex;
    flex-direction: column;
    padding-top: 6rem;
  }
  
  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }
  
  /* Slide-full transition classes */
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
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
  }




button,
a,
[role="button"],
[tabindex],
input,
textarea,
select,
label,
* {
    -webkit-tap-highlight-color: transparent;
}


* {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

  </style>
  