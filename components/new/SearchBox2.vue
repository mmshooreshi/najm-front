<template>
  <!-- 1) Your small header input -->
  <div class="relative w-full md:w-auto">
    <input
      v-model="searchQuery"
      @focus="openSearch"
      type="text"
      placeholder="جست‌وجوی محصول"
      class="w-full md:w-48 lg:w-64 px-4 py-2 pr-10 rounded-[15px] border border-gray-300
             text-sm font-semibold placeholder-gray-500 focus:border-emerald-700
             focus:ring-2 focus:ring-emerald-700 transition-all"
      ref="searchInput"
    />
    <span class="absolute right-3 top-1/2 -translate-y-1/2 i-ph-magnifying-glass-light text-gray-400" />
  </div>

  <!-- 2) The full-page overlay -->
  <Teleport to="body">
    <Transition name="slide-down">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-24"
      >
        <!-- red blurred backdrop -->
        <div
          class="absolute inset-0 bg-red-600/30 backdrop-blur-lg"
          @click="closeIfEmpty"
        />

        <!-- the white panel -->
        <div
          ref="overlayPanel"
          class="relative mx-4 w-full max-w-screen-sm bg-white rounded-lg p-4 shadow-xl"
        >
          <!-- header of panel -->
          <div class="flex items-center gap-3">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="کلمه کلیدی را وارد کنید..."
              class="flex-1 rounded border border-gray-300 px-4 py-2 focus:outline-none"
              autofocus
            />
            <button
              @click="closeSearch"
              class="i-ph-x-bold text-xl transition hover:rotate-90"
            />
          </div>

          <!-- results list -->
          <ul
            v-if="filteredItems.length"
            class="mt-4 max-h-80 space-y-2 overflow-y-auto"
          >
            <li
              v-for="item in filteredItems"
              :key="item.id"
              class="flex items-start gap-3 rounded-lg p-3 hover:bg-gray-100 cursor-pointer"
              >
              <!-- :src="item.image"   -->
              <img
              src="/images/products/test.png"
                alt=""
                class="h-10 w-10 flex-shrink-0 rounded"
              />
              <div class="flex-1">
                <div class="flex justify-between">
                  <span class="font-semibold">{{ item.name }}</span>
                  <span class="font-bold text-emerald-600">{{ item.price }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ item.description }}</p>
              </div>
            </li>
          </ul>

          <!-- no results -->
          <p v-else-if="searchQuery" class="mt-4 text-center text-gray-500">
            نتیجه‌ای یافت نشد
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

/* — state — */
const searchQuery = ref('')
const isOpen = ref(false)

/* — refs for outside-click — */
const searchInput = ref<HTMLElement | null>(null)
const overlayPanel = ref<HTMLElement | null>(null)

/* — hard-coded demo items — */
const allItems = [
  { id:1, name:'سربرگ A4',    description:'سربرگ یک‌رو با کیفیت بالا', price:'20,000 تومان', image:'/images/letterhead.png' },
  { id:2, name:'پاکت‌نامه',    description:'پاکت سایز C5 با رویه مات',      price:'15,000 تومان', image:'/images/envelope.png' },
  { id:3, name:'کارت ویزیت',   description:'دو رو لمینت مات',                price:'30,000 تومان', image:'/images/business-card.png' },
  { id:4, name:'بروشور سه لت', description:'بروشور تبلیغاتی ۳ لت گلاسه',      price:'25,000 تومان', image:'/images/brochure.png' },
  { id:5, name:'کتاب داستان',  description:'کتاب ۱۲۰ صفحه‌ای جلد سخت',       price:'50,000 تومان', image:'/images/book.png' },
  { id:6, name:'تقویم رومیزی', description:'۱۲ برگی با پایه چوبی',           price:'10,000 تومان', image:'/images/calendar.png' },
  { id:7, name:'پوستر تبلیغاتی',description:'۵۰×۷۰ سانتی‌متری',              price:'12,000 تومان', image:'/images/poster.png' },
  { id:8, name:'لیبل شیشه‌ای', description:'لیبل شفاف',                    price:'8,000 تومان',  image:'/images/label.png' }
]

/* — filtered results — */
const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  return allItems.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.description.toLowerCase().includes(q)
  )
})

/* — open / close logic — */
function openSearch() {
  isOpen.value = true
}
function closeSearch() {
  isOpen.value = false
  searchQuery.value = ''
}
function closeIfEmpty() {
  if (!searchQuery.value.trim()) closeSearch()
}

/* — click-outside to close when empty — */
function onClickOutside(event: MouseEvent) {
  const tgt = event.target as Node
  if (
    overlayPanel.value?.contains(tgt) ||
    searchInput.value?.contains(tgt)
  ) return
  closeIfEmpty()
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style>
.slide-down-enter-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-down-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
