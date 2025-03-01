<template>
  <!-- Outer container always fills its parent -->
  <div
  dir="rtl"
    ref="itemRef"
    class="py-4 md:py-0 accordion-item flex flex-col h-full cursor-pointer hover:bg-[#E5EDED]/100 text-d4 rounded-3xl bg-[#E5EDED]/50 transition-all duration-500 content-center"
    @click="$emit('toggle')"
  >
    <!-- Header: its margin-top will be animated to center or align to top -->
    
      <div ref="headerRef" :class="['header flex items-center justify-between px-6 transition-all duration-500', isOpen ? 'pt-6' : 'flex-1']"      >
      <span>{{ title }}</span>
      <svg
        class="icon"
        :class="{ open: isOpen }"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <!-- Content section: GSAP-controlled transition -->
    <transition
      css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="isOpen" ref="contentDiv" class="content px-6">
        <p>{{ content }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import gsap from "gsap";

const props = defineProps({
  title: String,
  content: String,
  isOpen: Boolean
});

const itemRef = ref(null);
const headerRef = ref(null);


// GSAP content transition functions
const beforeEnter = (el) => {
  el.style.height = "0px";
  el.style.opacity = "0";
};
const enter = (el, done) => {
  gsap.to(el, {
    height: el.scrollHeight,
    opacity: 1,
    duration: 0.5,
    ease: "expo.out",
    onComplete: () => {
      el.style.height = "auto";
      done();
    }
  });
};
const beforeLeave = (el) => {
  el.style.height = el.scrollHeight + "px";
  el.style.opacity = "1";
};
const leave = (el, done) => {
  gsap.to(el, {
    height: 0,
    opacity: 0,
    duration: 0.4,
    ease: "expo.in",
    onComplete: done
  });
};
const afterEnter = (el) => {};
const afterLeave = (el) => {};
</script>

<style scoped>
.accordion-item {
  /* Ensures the item always fills the parent's height */
}
.header {
  font-weight: bold;
}
.icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}
.icon.open {
  transform: rotate(45deg);
}
.content {
  overflow: hidden;
  font-size: 12px;
  padding-top: 10px;
}
.content p {
  margin: 15px 0;
}
</style>
