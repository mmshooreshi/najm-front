<template>
    <div style="position: relative; padding: 2rem;">
      <!-- Button/Icon that toggles the popup -->
      <button ref="iconRef" @click="togglePopup" style="cursor: pointer; padding: 0.5rem 1rem;">
        Open Popup
      </button>
  
      <!-- The popup is wrapped in a transition for GSAP animations -->
      <transition
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <div
          v-show="isShown"
          v-click-outside="closePopup"
          ref="popupRef"
          class="popup"
          :style="popupStyle"
        >
          <!-- Empty popup content -->
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue';
  import { gsap } from 'gsap';
  
  const isShown = ref(false);
  const iconRef = ref(null);
  const popupRef = ref(null);
  
  // Inline style object to position the popup
  const popupStyle = ref({
    position: 'absolute',
    transformOrigin: 'center center',
  });
  
  // Toggle popup visibility and update its position
  const togglePopup = async () => {
    isShown.value = !isShown.value;
    await nextTick();
    updatePopupPosition();
  };
  
  // Close the popup (for click-outside)
  const closePopup = () => {
    isShown.value = false;
  };
  
  // Position the popup so that it's centered on the icon
  const updatePopupPosition = () => {
    if (iconRef.value && popupRef.value) {
      const iconRect = iconRef.value.getBoundingClientRect();
      const popupRect = popupRef.value.getBoundingClientRect();
      const top = iconRect.top + iconRect.height / 2 - popupRect.height / 2 + window.scrollY;
      const left = iconRect.left + iconRect.width / 2 - popupRect.width / 2 + window.scrollX;
      popupStyle.value.top = `${top}px`;
      popupStyle.value.left = `${left}px`;
    }
  };
  
  // GSAP animation hooks for the transition
  const beforeEnter = (el) => {
    gsap.set(el, { scale: 0, opacity: 0 });
  };
  
  const enter = (el, done) => {
    gsap.to(el, { scale: 1, opacity: 1, duration: 0.3, ease: 'power1.out', onComplete: done });
  };
  
  const leave = (el, done) => {
    gsap.to(el, { scale: 0, opacity: 0, duration: 0.3, ease: 'power1.in', onComplete: done });
  };
  </script>
  
  <!-- Local click-outside directive -->
  <script>
  export default {
    directives: {
      clickOutside: {
        beforeMount(el, binding) {
          el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
              binding.value();
            }
          };
          document.addEventListener('mousedown', el.clickOutsideEvent);
        },
        unmounted(el) {
          document.removeEventListener('mousedown', el.clickOutsideEvent);
        },
      },
    },
  };
  </script>
  
  <style scoped>
  .popup {
    background: white;
    border: 1px solid #ccc;
    padding: 1rem;
    min-width: 200px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  </style>
  