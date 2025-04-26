<!-- components/atom/SearchModal.vue -->
<template>
    <transition name="slide-down">
      <div
        v-if="visible"
        class="fixed mt-18  rounded-3xl mx-8 mb-2 inset-0 bg-white bg-opacity-100 z-40 overflow-auto p-6"
      >
        <div class="max-w-xl mx-auto space-y-6">
          <!-- 1) Recent searches -->
          <div>
            <h3 class="text-gray-500 text-xs mb-2">آخرین جست‌وجوها</h3>
            <ul>
              <li
                v-for="(term, i) in recentSearches"
                :key="i"
                class="flex justify-start gap-2 items-center py-2 border-b-0"
              >
              <SearchIcon class="w-3 h-3 text-gray-600" />
              <span class="text-xs text-d4 text-demibold">{{ term }}</span>
              </li>
            </ul>
          </div>
  
          <!-- 2) Quick category shortcuts -->
          <div>
            <ul>
              <li
                v-for="(short, i) in categoryShortcuts"
                :key="i"
                class="flex justify-start gap-2 items-center py-2 border-b"
              >
              <GridIcon class="w-5 h-5 text-gray-600" />
                <div>
                  <div class="font-bold">کتالوگ</div>
                  <div class="text-sm text-gray-600">{{ short.path }}</div>
                </div>
              </li>
            </ul>
          </div>
  
          <!-- 3) “search in all usage-packages” block -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold">
                جست‌وجوی {{ query }} در تمام پکیج‌های کاربرد
              </span>
              <SearchIcon class="w-5 h-5 text-gray-600" />
            </div>
            <ul>
              <li
                v-for="(pkg, i) in usagePackages"
                :key="i"
                class="flex justify-between items-center py-2 border-b"
              >
                <span>{{ query }} {{ pkg.name }}</span>
                <CopyIcon class="w-5 h-5 text-gray-600" />
              </li>
            </ul>
          </div>
  
          <!-- 4) “search in all industry-packages” block -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold">
                جست‌وجوی {{ query }} در تمام پکیج‌های صنعت
              </span>
              <SearchIcon class="w-5 h-5 text-gray-600" />
            </div>
            <ul>
              <li
                v-for="(pkg, i) in industryPackages"
                :key="i"
                class="flex justify-between items-center py-2 border-b"
              >
                <span>{{ query }} {{ pkg.name }}</span>
                <CopyIcon class="w-5 h-5 text-gray-600" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue'
  import data from '@/schemas/mock-data.json'
  import SearchIcon from '~/assets/icons/search-icon.svg'
  import GridIcon   from '~/assets/icons/grid-icon.svg'
  import CopyIcon   from '~/assets/icons/copy-icon.svg'
  
  const props = defineProps<{
    visible: boolean
    query:   string
  }>()
  
  // pull in everything from our new mock-data.json
  const { recentSearches, categoryShortcuts, usagePackages, industryPackages } = data
  </script>
  
  <style scoped>
  .slide-down-enter-active {
    transition: transform 0.3s ease-out;
  }
  .slide-down-leave-active {
    transition: transform 0.2s ease-in;
  }
  .slide-down-enter-from,
  .slide-down-leave-to {
    transform: translateY(-100%);
  }
  .slide-down-enter-to,
  .slide-down-leave-from {
    transform: translateY(0);
  }
  
  
  
  
/* slide-down transition */
.slide-down-enter-active {
  transition: transform 0.3s ease-out;
}
.slide-down-leave-active {
  transition: transform 0.2s ease-in;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
}

/* full-screen white backdrop + hidden scrollbar */
.modal-container {
  position: fixed;
  top: 5.5rem;    /* mt-28 */
  bottom: 1.5rem; /* mb-28 */
  left: 2rem;     /* mx-8 */
  right: 2rem;
  background: rgba(255,255,255,1);
  border-radius: 1.5rem; /* rounded-3xl */
  z-index: 40;
  overflow-y: auto;
  /* hide scrollbar in WebKit browsers */
  scrollbar-width: none;         /* Firefox */
  -ms-overflow-style: none;      /* IE 10+ */
}
.modal-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}


*::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
* {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

  </style>
  