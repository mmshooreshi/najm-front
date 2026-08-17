<!-- components/atom/SearchModal.vue -->
<template>
  <transition name="slide-down">
    <div
      v-if="visible"
      dir="rtl"
      class="fixed mt-18 inset-x-4 sm:inset-x-8 top-0 max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl z-50 shadow-2xl border border-najmborder/60 overflow-hidden flex flex-col"
    >
      <!-- Header / Search Meta Bar -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-najmgrey/40">
        <div class="flex items-center gap-2 text-xs text-gray-600">
          <Icon name="mdi:magnify" class="w-4 h-4 text-najmgreen" />
          <span v-if="query.trim()">
            نتایج برای <strong class="text-gray-900">«{{ query }}»</strong> ({{ totalResults }} مورد)
          </span>
          <span v-else>جستجوی سریع محصولات، خدمات و کاتالوگ‌ها</span>
        </div>
        <div class="flex items-center gap-3 text-[11px] text-gray-400">
          <span class="hidden sm:inline">کلید <kbd class="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono text-[10px]">ESC</kbd> برای بستن</span>
          <button
            @click="$emit('close')"
            class="w-7 h-7 rounded-full bg-gray-200/70 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition"
          >
            <Icon name="mdi:close" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="overflow-y-auto p-6 space-y-8 flex-1">
        <!-- State 1: When Query is Empty -> Show Recent Searches & Quick Categories -->
        <div v-if="!query.trim()" class="space-y-8 max-w-2xl mx-auto">
          <!-- Recent searches -->
          <div v-if="recentSearches.length" class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold text-gray-400 flex items-center gap-1.5 text-d4">
                <Icon name="mdi:history" class="w-4 h-4" />
                آخرین جست‌وجوهای شما
              </h3>
              <button
                @click="clearAllRecentSearches"
                class="text-[11px] text-gray-400 hover:text-red-500 transition"
              >
                پاک کردن تاریخچه
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="term in recentSearches"
                :key="term"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-najmgrey hover:bg-gray-200 text-xs text-gray-800 transition group cursor-pointer"
                @click="selectTerm(term)"
              >
                <Icon name="mdi:clock-outline" class="w-3.5 h-3.5 text-gray-400" />
                <span>{{ term }}</span>
                <button
                  @click.stop="removeRecentSearch(term)"
                  class="text-gray-400 hover:text-red-500 p-0.5 rounded transition"
                >
                  <Icon name="mdi:close" class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Category Shortcuts -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-gray-400 flex items-center gap-1.5 text-d4">
              <Icon name="mdi:compass-outline" class="w-4 h-4" />
              دسترسی سریع به بخش‌ها
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <NuxtLink
                v-for="cat in quickShortcuts"
                :key="cat.name"
                :to="cat.url"
                @click="handleNavigate"
                class="p-3.5 rounded-2xl bg-white border border-najmborder/40 hover:border-najmgreen/60 hover:shadow-xs transition flex items-center gap-3 group"
              >
                <div class="w-8 h-8 rounded-xl bg-najmgrey text-najmgreen flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                  <Icon :name="cat.icon" class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-xs font-bold text-gray-800 group-hover:text-najmgreen transition-colors text-d4">{{ cat.name }}</div>
                  <div class="text-[10px] text-gray-400">{{ cat.desc }}</div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- State 2: Live Search Results -->
        <div v-else class="space-y-6 max-w-3xl mx-auto">
          <!-- No results found -->
          <div v-if="totalResults === 0" class="text-center py-12 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-najmgrey text-gray-400 flex items-center justify-center mx-auto">
              <Icon name="mdi:file-search-outline" class="w-6 h-6" />
            </div>
            <h4 class="text-base font-bold text-gray-800 text-d4">نتیجه‌ای برای «{{ query }}» پیدا نشد</h4>
            <p class="text-xs text-gray-500">
              لطفاً از کلمات کلیدی عام‌تر مانند «جعبه»، «کاتالوگ»، «سربرگ» یا «چاپ افست» استفاده فرمایید.
            </p>
          </div>

          <!-- 1. Products Results -->
          <div v-if="categorizedResults.products.length" class="space-y-2">
            <h4 class="text-xs font-bold text-gray-400 flex items-center gap-1.5 text-d4">
              <Icon name="mdi:package-variant-closed" class="w-4 h-4 text-najmgreen" />
              محصولات و بسته‌بندی‌ها ({{ categorizedResults.products.length }})
            </h4>
            <div class="divide-y divide-gray-100 bg-white rounded-2xl border border-najmborder/40 overflow-hidden">
              <NuxtLink
                v-for="item in categorizedResults.products"
                :key="item.id"
                :to="item.url"
                @click="handleNavigate(item.title)"
                class="p-3.5 px-4 flex items-center justify-between hover:bg-najmgrey/40 transition group"
              >
                <div class="space-y-0.5">
                  <div class="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-najmgreen transition-colors text-d4">
                    {{ item.title }}
                  </div>
                  <div class="text-[11px] text-gray-500">{{ item.description }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] px-2 py-0.5 rounded-md bg-najmgrey text-gray-700 font-medium">
                    {{ item.categoryLabel }}
                  </span>
                  <Icon name="mdi:chevron-left" class="w-4 h-4 text-gray-400 group-hover:text-najmgreen transition-colors" />
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- 2. Services Results -->
          <div v-if="categorizedResults.services.length" class="space-y-2">
            <h4 class="text-xs font-bold text-gray-400 flex items-center gap-1.5 text-d4">
              <Icon name="mdi:tools" class="w-4 h-4 text-najmgreen" />
              خدمات تخصصی چاپ و تکمیلی ({{ categorizedResults.services.length }})
            </h4>
            <div class="divide-y divide-gray-100 bg-white rounded-2xl border border-najmborder/40 overflow-hidden">
              <NuxtLink
                v-for="item in categorizedResults.services"
                :key="item.id"
                :to="item.url"
                @click="handleNavigate(item.title)"
                class="p-3.5 px-4 flex items-center justify-between hover:bg-najmgrey/40 transition group"
              >
                <div class="space-y-0.5">
                  <div class="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-najmgreen transition-colors text-d4">
                    {{ item.title }}
                  </div>
                  <div class="text-[11px] text-gray-500">{{ item.description }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] px-2 py-0.5 rounded-md bg-najmgrey text-gray-700 font-medium">
                    {{ item.categoryLabel }}
                  </span>
                  <Icon name="mdi:chevron-left" class="w-4 h-4 text-gray-400 group-hover:text-najmgreen transition-colors" />
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- 3. Resources & Catalogs -->
          <div v-if="categorizedResults.resources.length" class="space-y-2">
            <h4 class="text-xs font-bold text-gray-400 flex items-center gap-1.5 text-d4">
              <Icon name="mdi:file-download-outline" class="w-4 h-4 text-najmgreen" />
              کاتالوگ‌ها، قالب‌های تیغ و راهنماها ({{ categorizedResults.resources.length }})
            </h4>
            <div class="divide-y divide-gray-100 bg-white rounded-2xl border border-najmborder/40 overflow-hidden">
              <NuxtLink
                v-for="item in categorizedResults.resources"
                :key="item.id"
                :to="item.url"
                @click="handleNavigate(item.title)"
                class="p-3.5 px-4 flex items-center justify-between hover:bg-najmgrey/40 transition group"
              >
                <div class="space-y-0.5">
                  <div class="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-najmgreen transition-colors text-d4">
                    {{ item.title }}
                  </div>
                  <div class="text-[11px] text-gray-500">{{ item.description }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] px-2 py-0.5 rounded-md bg-najmgrey text-gray-700 font-medium">
                    {{ item.categoryLabel }}
                  </span>
                  <Icon name="mdi:download" class="w-4 h-4 text-gray-400 group-hover:text-najmgreen transition-colors" />
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- 4. Site Pages -->
          <div v-if="categorizedResults.pages.length" class="space-y-2">
            <h4 class="text-xs font-bold text-gray-400 flex items-center gap-1.5 text-d4">
              <Icon name="mdi:web" class="w-4 h-4 text-najmgreen" />
              صفحات اصلی وبسایت ({{ categorizedResults.pages.length }})
            </h4>
            <div class="divide-y divide-gray-100 bg-white rounded-2xl border border-najmborder/40 overflow-hidden">
              <NuxtLink
                v-for="item in categorizedResults.pages"
                :key="item.id"
                :to="item.url"
                @click="handleNavigate(item.title)"
                class="p-3.5 px-4 flex items-center justify-between hover:bg-najmgrey/40 transition group"
              >
                <div class="space-y-0.5">
                  <div class="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-najmgreen transition-colors text-d4">
                    {{ item.title }}
                  </div>
                  <div class="text-[11px] text-gray-500">{{ item.description }}</div>
                </div>
                <Icon name="mdi:arrow-left" class="w-4 h-4 text-gray-400 group-hover:text-najmgreen transition-colors" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useSiteSearch } from '@/composables/useSiteSearch'

const props = defineProps<{
  visible: boolean
  query: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:query', val: string): void
}>()

const {
  query: searchQuery,
  categorizedResults,
  results,
  recentSearches,
  saveRecentSearch,
  removeRecentSearch,
  clearAllRecentSearches
} = useSiteSearch()

watch(
  () => props.query,
  (val) => {
    searchQuery.value = val || ''
  },
  { immediate: true }
)

const totalResults = computed(() => results.value.length)

const quickShortcuts = [
  { name: 'جعبه‌سازی و هاردباکس', desc: 'انواع جعبه‌های دارویی و لوکس', url: '/products/packaging/boxes', icon: 'mdi:package-variant-closed' },
  { name: 'ساک دستی کاغذی', desc: 'شاپینگ بگ‌های گلاسه و کرافت', url: '/products/packaging/shopping-bags', icon: 'mdi:shopping-outline' },
  { name: 'سربرگ و ست اداری', desc: 'اوراق شرکتی و پاکت‌نامه', url: '/products/printing/letterhead', icon: 'mdi:file-document-outline' },
  { name: 'چاپ افست ۵ رنگ', desc: 'خدمات تخصصی چاپ هایدلبرگ', url: '/services/printing-and-packaging', icon: 'mdi:printer' },
  { name: 'دانلود کاتالوگ و قالب‌ها', desc: 'فایل‌های PDF و Die-cut', url: '/resources', icon: 'mdi:download' },
  { name: 'استعلام و تماس با ما', desc: 'شماره‌های تماس و آدرس کارخانه', url: '/contact', icon: 'mdi:phone' }
]

function selectTerm(term: string) {
  emit('update:query', term)
}

function handleNavigate(title?: string) {
  if (title) {
    saveRecentSearch(title)
  } else if (props.query.trim()) {
    saveRecentSearch(props.query.trim())
  }
  emit('close')
}
</script>

<style scoped>
.slide-down-enter-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out;
}
.slide-down-leave-active {
  transition: transform 0.2s ease-in, opacity 0.2s ease-in;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>