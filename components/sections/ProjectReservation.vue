<template>
  <div class="mt-0 -mb-28 max-w-md mx-auto animate-pulse-alt" dir="rtl">
    <!-- Target Icon -->
    <div ref="targetRef" class="group relative cursor-pointer  -mt-[50px] fixed -z-10" @click="togglePopup" >
      <div class="w-full mx-auto" dir="rtl">
        <svg
          width="100%"
          viewBox="0 0 248 248"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="contours-svg"
        >
          <rect x="100.5" y="100.5" width="47" height="47" rx="23.5" stroke="#FEFDD3" stroke-opacity="0.5"/>
          <rect x="88.5" y="88.5" width="71" height="71" rx="31.5" stroke="#FEFDD3" stroke-opacity="0.5"/>
          <rect x="72.5" y="72.5" width="103" height="103" rx="43.5" stroke="#FEFDD3" stroke-opacity="0.4"/>
          <rect x="52.5" y="52.5" width="143" height="143" rx="63.5" stroke="#FEFDD3" stroke-opacity="0.3"/>
          <rect x="28.5" y="28.5" width="191" height="191" rx="87.5" stroke="#FEFDD3" stroke-opacity="0.2"/>
          <rect x="0.5" y="0.5" width="247" height="247" rx="115.5" stroke="#FEFDD3" stroke-opacity="0.1"/>
        </svg>
      </div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="z-10 w-10 h-10 bg-[#EAFED3] group-active:bg-[#014439] flex items-center justify-center rounded-full group-hover:scale-150 transition-transform duration-300 ease-in-out">
          <TargetIcon />
        </div>
      </div>
    </div>
  </div>

  <!-- Pop-up with GSAP in/out animation and click-outside -->
  <div dir="rtl" class="-mt-[650px] h-[400px] z-100 mx-auto max-w-md inset-0" :class="{ '': !isShown }">
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div
        v-show="isShown"
        v-click-outside="closePopup"
        ref="popupRef"
        class="z-10 bg-white rounded-3xl shadow-lg p-4 origin-center overflow-hidden"
        :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      >
        <div class="relative px-3 z-20">
          <h2 class="text-[18px] font-extrabold">از طراحی تا بسته‌بندی، همه زیر یه سقف!</h2>
          <p class="text-gray-600 mt-2 text-[12px] font-medium">چه چیزی نیاز دارید؟</p>
        </div>
        <div class="mt-6 space-y-3 px-3">
          <SelectBox v-model="selectedMarket" :options="marketOptions" />
          <SelectBox v-model="selectedCategory" :options="categoryOptions" />
          <SearchBox v-model="searchQuery" :options="productOptions" />
        </div>
        <div class="group mt-6 bg-[#014439] rounded-[25px] px-[90px] py-[20px] space-y-2 flex flex-col items-center text-center text-white hover:scale-110 cursor-pointer hover:rounded-[0px] hover:translate-y-2.5 hover:shadow-xl hover:bg-[#016a50] transition-all">
          <span class="text-lg font-semibold">رزرو پروژه جدید</span>
          <p class="animate-pulse-alt text-white/50 text-sm font-normal mt-2">
            شروع دهی از <span class="text-white underline underline-offset-4">۵</span> روز دیگر
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { gsap } from "gsap";
import TargetIcon from "~/assets/icons/target-icon.svg";
import SelectBox from "@/components/new/SelectBox.vue";
import SearchBox from "@/components/new/SearchBox.vue";

const isShown = ref(false);
const targetRef = ref(null);
const popupRef = ref(null);
const position = ref({ top: 0, left: 0 });

const updatePopupPosition = () => {
  if (targetRef.value && popupRef.value) {
    const targetRect = targetRef.value.getBoundingClientRect();
    const popupRect = popupRef.value.getBoundingClientRect();

    position.value = {
      top: targetRect.top + window.scrollY / 2 - popupRect.height / 2,
      left: targetRect.left + window.scrollX + targetRect.width / 2 - popupRect.width / 2,
    };
  }
};

const togglePopup = async () => {
  isShown.value = !isShown.value;
  await nextTick();
  updatePopupPosition();
};

const closePopup = () => {
  isShown.value = false;
};

// GSAP animation hooks for the transition
const beforeEnter = (el) => {
  gsap.set(el, { scale: 0, opacity: 0 });
};

const enter = (el, done) => {
  gsap.to(el, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out", onComplete: done });
};

const leave = (el, done) => {
  gsap.to(el, { scale: 0, opacity: 0, duration: 0.5, ease: "back.out", onComplete: done });
};

// Dropdown Values
const selectedMarket = ref(null);
const selectedCategory = ref(null);
const searchQuery = ref("");

// Options for SelectBoxes
const marketOptions = [
  { label: "بازار مصرفی", value: "market" },
  { label: "صنعتی", value: "industrial" },
  { label: "کشاورزی", value: "agriculture" },
];

const categoryOptions = [
  { label: "دسته‌بندی ۱", value: "category-1" },
  { label: "دسته‌بندی ۲", value: "category-2" },
  { label: "دسته‌بندی ۳", value: "category-3" },
];

const productOptions = [
  { label: "محصول ۱", value: "product-1" },
  { label: "محصول ۲", value: "product-2" },
  { label: "محصول ۳", value: "product-3" },
];
</script>

<!-- Local click-outside directive registration -->
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
        document.addEventListener("mousedown", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener("mousedown", el.clickOutsideEvent);
      },
    },
  },
};
</script>

<style scoped>
.contours-svg {
  overflow: visible;
  touch-action: manipulation;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.contours-svg rect {
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(1);
  stroke: #FEFDD3;
  transition: transform 1s ease, stroke 1s ease;
}

.contours-svg rect:nth-child(1) { transition-delay: 0.5s; }
.contours-svg rect:nth-child(2) { transition-delay: 0.4s; }
.contours-svg rect:nth-child(3) { transition-delay: 0.3s; }
.contours-svg rect:nth-child(4) { transition-delay: 0.2s; }
.contours-svg rect:nth-child(5) { transition-delay: 0.1s; }
.contours-svg rect:nth-child(6) { transition-delay: 0s; }

.max-w-md.mx-auto:hover .contours-svg rect {
  transform: scale(1.2);
}
.max-w-md.mx-auto:active .contours-svg rect {
  stroke: #00a186;
}

.max-w-md.mx-auto:hover .contours-svg rect:nth-child(1),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(1) { transition-delay: 0s; }
.max-w-md.mx-auto:hover .contours-svg rect:nth-child(2),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(2) { transition-delay: 0.01s; }
.max-w-md.mx-auto:hover .contours-svg rect:nth-child(3),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(3) { transition-delay: 0.02s; }
.max-w-md.mx-auto:hover .contours-svg rect:nth-child(4),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(4) { transition-delay: 0.03s; }
.max-w-md.mx-auto:hover .contours-svg rect:nth-child(5),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(5) { transition-delay: 0.04s; }
.max-w-md.mx-auto:hover .contours-svg rect:nth-child(6),
.max-w-md.mx-auto:active .contours-svg rect:nth-child(6) { transition-delay: 0.05s; }
</style>
