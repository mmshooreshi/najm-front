<!-- components/new/SelectBox.vue -->
<template>
    <div class="relative w-full">
      <!-- Selected Option -->
      <div
        class="flex justify-between items-center px-6 py-4 border rounded-[15px] bg-white cursor-pointer  hover:shadow-md transition-all"
        @click="toggleDropdown"
        ref="trigger"
      >
        <span class="text-gray-700 text-[12px] font-semibold">{{ selectedOption.label }}</span>
        <span :class="['transition-transform', { 'rotate-180': isOpen }]">
            <ChevronDownIcon/>
        </span>
      </div>
  
      <!-- Dropdown Menu -->
      <div
        v-show="isOpen"
        class="absolute w-full mt-2 bg-white border border-[#014439] rounded-lg shadow-xl overflow-hidden z-50"
        ref="dropdown"
        style="top: 100%; left: 0;"
      >
        <ul class="max-h-60 overflow-y-auto">
          <li
            v-for="(option, index) in options"
            :key="option.value"
            @click="selectOption(option)"
            @keydown.enter="selectOption(option)"
            @mouseover="hoverIndex = index"
            :class="[
              'px-4 py-2 text-sm cursor-pointer transition-all',
              hoverIndex === index ? 'bg-[#014439]/100 text-[#66BA58]' : 'hover:bg-gray-100'
            ]"
            tabindex="0"
          >
            <slot name="option" :option="option">
              {{ option.label }}
            </slot>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, nextTick } from "vue";
  import gsap from "gsap";
  import ChevronDownIcon from "~/assets/icons/chevron-down-icon.svg";

  const props = defineProps({
    options: { type: Array, required: true },
    modelValue: { type: [String, Number], default: null }
  });
  
  const emit = defineEmits(["update:modelValue"]);
  
  const isOpen = ref(false);
  const selectedOption = ref(props.options[0] || {});
  const hoverIndex = ref(0);
  const dropdown = ref(null);
  const trigger = ref(null);
  
  const toggleDropdown = async () => {
    isOpen.value = !isOpen.value;
    await nextTick();
    if (isOpen.value) animateOpen();
  };
  
  const selectOption = (option) => {
    selectedOption.value = option;
    emit("update:modelValue", option.value);
    isOpen.value = false;
  };
  
  const animateOpen = () => {
    gsap.fromTo(
      dropdown.value,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (!dropdown.value?.contains(event.target) && !trigger.value?.contains(event.target)) {
      isOpen.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });
  
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
  </script>
  
  <style scoped>
  /* Custom Styles */
  </style>
  