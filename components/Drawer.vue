<!-- /components/Drawer.vue -->
<template>
    <div class="drawer-container">
      <!-- Hamburger button -->
  
             
      <div class="hamburger-icon flex-col" :class="{'flex-row':open}" >
        <span class="icon icon-1" :class="{ 'open': open }"></span>
        <span class="icon icon-2" :class="{ 'open': open }"></span>
        <span class="icon icon-3" :class="{ 'open ': open }"></span>
      </div>

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
//   import { ref } from 'vue'
  
//   const open = ref(false)
  

// Accept an `open` prop and emit `update:open` so parent can v-model it
const props = defineProps<{ open: boolean }>()
const emit  = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

// Mirror prop into a local computed so we can `toggle()` it
const open = computed({
  get:  () => props.open,
  set: (v: boolean) => emit('update:open', v),
})

function toggle() {
  open.value = !open.value
}


// close if the click came from inside an <a> (e.g. a NuxtLink)
    function maybeClose(e: MouseEvent) {
        console.log(e.target)
  if ((e.target as HTMLElement).closest('a')) {
    // open.value = false
  }
}
  </script>
  
  <style scoped lang="scss">
  .drawer-container {

  }
  
  .hamburger-icon {
    position: relative;
    top: 10%;
    left: 3%;
    // width: 60px;
    // height: 60px;
    display: flex;
    z-index: 100;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
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
  top:      0;
  right:     15vw;
  width:    85vw;
  height:   100vh;
  background: white;
  display:  flex;
  flex-direction: column;
  }
  
  .drawer-body {
    top: 0px;
    
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    
  }
  
  /* Slide-full transition classes */
  .slide-full-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }
  .slide-full-enter-to {
    transform: translateX(0);
    opacity: 1;
  }
  .slide-full-leave-from {
    transform: translateX(0);
    opacity: 1;
  }
  .slide-full-leave-to {
    transform: translateX(-100%);
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
  