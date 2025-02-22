<template>
  <div dir="rtl" class="text-d4 accordion-item">
    <div class="header" @click="toggle" :class="{'text-[#1B670E]':isOpen}">
      <span>{{ title }}</span>
      <svg
        class="icon"
        :class="{ open: isOpen }"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <transition
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <!-- v-show controls whether the content is rendered -->
      <div v-show="isOpen" ref="contentDiv" class="content">
        <p>{{ content }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

const props = defineProps({
  title: String,
  content: String
});

const isOpen = ref(false);
const contentDiv = ref(null);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const enter = (el) => {
  // start from zero height and opacity
  el.style.height = "0px";
  el.style.opacity = "0";
  // force reflow so the starting style is applied
  el.offsetHeight;
  const height = el.scrollHeight;
  el.style.transition = "height 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease";
  el.style.height = height + "px";
  el.style.opacity = "1";
};

const afterEnter = (el) => {
  // clear inline height so that it can adjust if content changes
  el.style.height = "auto";
  el.style.transition = "";
};

const leave = (el) => {
  // set height to current pixel value before collapsing
  el.style.height = el.scrollHeight + "px";
  el.style.opacity = "1";
  // force reflow to register the current height
  el.offsetHeight;
  el.style.transition = "height 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease";
  el.style.height = "0px";
  el.style.opacity = "0";
};

const afterLeave = (el) => {
  el.style.transition = "";
};
</script>

<style scoped>

.accordion-item {
  /* border-bottom: 1px solid #ddd; */
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  /* background: #f8f8f8; */
  cursor: pointer;
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
  /* background: white; */
  padding: 0 15px;
  font-size: 12px;
  
}
.content p {
  margin: 15px 0;
}
</style>
