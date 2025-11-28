<!-- components/sections/ProjectReservationLight.vue -->
<template>
    <div dir="rtl" class="relative  max-w-md mx-auto animate-pulse-alt">
      <!-- Target Icon  -mt-[50px] -->
      <div ref="targetRef" class="group relative cursor-pointer"       @click.prevent="isShown = !isShown">
        <svg
        class="contours-svg w-full mx-auto"
        viewBox="0 0 248 248"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#faf9c0" stroke-opacity="0.5">
          <rect x="100.5" y="100.5" width="47" height="47" rx="23.5"/>
          <rect x="88.5"  y="88.5"  width="71" height="71" rx="31.5"/>
        </g>
        <g stroke="#faf9c0" stroke-opacity="0.4">
          <rect x="72.5"  y="72.5"  width="103" height="103" rx="43.5"/>
        </g>
        <g stroke="#faf9c0" stroke-opacity="0.3">
          <rect x="52.5"  y="52.5"  width="143" height="143" rx="63.5"/>
        </g>
        <g stroke="#faf9c0" stroke-opacity="0.2">
          <rect x="28.5"  y="28.5"  width="191" height="191" rx="87.5"/>
        </g>
        <g stroke="#faf9c0" stroke-opacity="0.1">
          <rect x="0.5"   y="0.5"   width="247" height="247" rx="115.5"/>
        </g>
      </svg>
      <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            class="w-10 h-10 mt-0 bg-[#EAFED3] group-hover:scale-150 group-active:bg-najmgreen rounded-full flex items-center justify-center transition-transform duration-300"
          >
            <TargetIcon />
          </div>
        </div>
  
    </div>
  
      <!-- Pop-up -->
      <teleport to="body">
        <transition name="pop">
          <div
            v-if="isShown"
            ref="popupRef"
            class="overflow-hidden rtl fixed inset-0 m-auto w-max p-4 bg-white rounded-3xl shadow-lg z-50 h-max"
          >
            <h2 class="px-4 pt-4 text-[18px] font-extrabold">از طراحی تا بسته‌بندی، همه زیر یه سقف!</h2>
            <p class="px-4 text-gray-600 mt-2 text-[12px] font-medium">چه چیزی نیاز دارید؟</p>
            <div class="px-4 mt-6 space-y-3">
              <SelectBox v-model="market" :options="markets" />
              <SelectBox v-model="category" :options="categories" />
              <SearchBox v-model="query" :options="products" />
            </div>
            <button
              class="group mt-6 w-full bg-najmgreen rounded-[25px] py-5 flex flex-col items-center text-white hover:scale-130 hover:translate-y-1 hover:rounded-none hover:shadow-xl hover:bg-[#016a50] transition-all"
            >
              <span class="text-lg font-semibold">رزرو پروژه جدید</span>
              <span class="animate-pulse text-white/50 text-sm mt-2">
                شروع دهی از <u>۵</u> روز دیگر
              </span>
            </button>        </div>
        </transition>
      </teleport>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { onClickOutside } from '@vueuse/core'
  import TargetIcon from '~/assets/icons/target-icon.svg'
  import SelectBox from '@/components/new/SelectBox.vue'
  import SearchBox from '@/components/new/SearchBox.vue'
  
  const isShown    = ref(false)
  const targetRef  = ref(null)
  const popupRef   = ref(null)
  
// watch both the pop-up **and** the trigger
onClickOutside(popupRef, () => { isShown.value = false },
      { ignore: [ targetRef ] }
)


  // your selects/search state…
  const market    = ref(null)
  const category  = ref(null)
  const query     = ref('')
  
  const markets = [
    { label: "بازار مصرفی", value: "market" },
    { label: "صنعتی",     value: "industrial" },
    { label: "کشاورزی",    value: "agriculture" },
  ]
  const categories = [
    { label: "دسته‌بندی ۱", value: "category-1" },
    { label: "دسته‌بندی ۲", value: "category-2" },
    { label: "دسته‌بندی ۳", value: "category-3" },
  ]
  const products = [
    { label: "محصول ۱", value: "product-1" },
    { label: "محصول ۲", value: "product-2" },
    { label: "محصول ۳", value: "product-3" },
  ]
  </script>
  
  <style scoped>

/* 1) Both enter + leave share the same timing */
.pop-enter-active,
.pop-leave-active {
  transition: transform .2s ease, opacity .2s ease;
  transform-origin: center center; /* keep it scaling from the middle */
}

/* 2) Enter starts scaled-down & invisible */
.pop-enter-from {
  transform: scale(0);
  opacity: 0;
}
/* 3) Enter ends at normal size & full opacity */
.pop-enter-to {
  transform: scale(1);
  opacity: 1;
}

/* 4) Leave starts at normal size & full opacity */
.pop-leave-from {
  transform: scale(1);
  opacity: 1;
}
/* 5) Leave ends scaled-down & invisible */
.pop-leave-to {
  transform: scale(0);
  opacity: 0;
}

  
  
  /* reuse your existing SVG hover animations */
  .contours-svg {
    overflow: visible;
    transition: transform 1s ease, stroke 1s ease;
    transform-origin: center;
  }
  .group:hover .contours-svg { transform: scale(1.2); }
  .group:active .contours-svg { stroke: #00a186; }
  /* stagger via CSS variables or just accept uniform timing */
  </style>
  