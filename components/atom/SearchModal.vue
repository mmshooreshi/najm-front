<!-- components/atom/SearchModal.vue -->
<template>
  <Teleport to="body">
    <transition name="search-fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-100 flex flex-col items-center justify-start p-3 sm:p-6 sm:pt-16 bg-black/60 backdrop-blur-md overflow-hidden"
        @click.self="handleClose"
      >
        <!-- Modal Card Container -->
        <transition name="search-pop">
          <div
            v-if="visible"
            :dir="isRTL ? 'rtl' : 'ltr'"
            class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-najmborder/40 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] transition-all duration-300 relative"
          >
            <!-- 1. Dedicated Search Input Bar -->
            <div class="p-3.5 sm:p-4 border-b border-gray-100 bg-najmgrey/30 flex items-center gap-3">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-najmgreen/10 text-najmgreen flex items-center justify-center shrink-0">
                <Icon name="mdi:magnify" class="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <input
                ref="inputRef"
                v-model="searchQuery"
                type="text"
                :placeholder="t.placeholder"
                @keydown.down.prevent="navigateDown"
                @keydown.up.prevent="navigateUp"
                @keydown.enter.prevent="selectCurrent"
                @keydown.esc="handleClose"
                class="flex-1 bg-transparent text-sm sm:text-base font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />

              <button
                v-if="searchQuery"
                @click="clearQuery"
                class="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <Icon name="mdi:close" class="w-4 h-4" />
              </button>

              <button
                @click="handleClose"
                class="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>{{ t.close }}</span>
                <kbd class="hidden sm:inline-block px-1 bg-white border border-gray-200 rounded text-[10px] font-mono">ESC</kbd>
              </button>
            </div>

            <!-- 2. Category Filter Pills -->
            <div class="px-4 sm:px-6 py-2.5 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto bg-white scrollbar-none">
              <button
                v-for="cat in categoryList"
                :key="cat.id"
                @click="activeCategory = cat.id"
                class="px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-d4 shrink-0"
                :class="[
                  activeCategory === cat.id
                    ? 'bg-najmgreen text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ cat.label }}
              </button>
            </div>

            <!-- 3. Modal Scrollable Body -->
            <div class="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 divide-y divide-gray-100">
              <!-- State A: Query Empty -> Show Recent Searches & Quick Access -->
              <div v-if="!searchQuery.trim()" class="space-y-6">
                <!-- Recent Searches -->
                <div v-if="recentSearches.length" class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold text-gray-400 flex items-center gap-1.5 text-d4">
                      <Icon name="mdi:history" class="w-4 h-4 text-najmgreen" />
                      {{ t.recentSearches }}
                    </h3>
                    <button
                      @click="clearAllRecentSearches"
                      class="text-[11px] text-gray-400 hover:text-red-500 transition cursor-pointer"
                    >
                      {{ t.clearHistory }}
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
                        class="text-gray-400 hover:text-red-500 p-0.5 rounded transition cursor-pointer"
                      >
                        <Icon name="mdi:close" class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Quick Navigation Shortcuts -->
                <div class="space-y-3">
                  <h3 class="text-xs font-bold text-gray-400 flex items-center gap-1.5 text-d4">
                    <Icon name="mdi:compass-outline" class="w-4 h-4 text-najmgreen" />
                    {{ t.quickAccess }}
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <NuxtLink
                      v-for="cat in localizedShortcuts"
                      :key="cat.name"
                      :to="cat.url"
                      @click="handleNavigate(cat.name)"
                      class="p-3 rounded-2xl bg-white border border-najmborder/40 hover:border-najmgreen/60 hover:shadow-xs transition flex items-center gap-3 group cursor-pointer"
                    >
                      <div class="w-9 h-9 rounded-xl bg-najmgrey text-najmgreen flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Icon :name="cat.icon" class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0" :class="isRTL ? 'text-right' : 'text-left'">
                        <div class="text-xs font-bold text-gray-800 group-hover:text-najmgreen transition-colors truncate text-d4">{{ cat.name }}</div>
                        <div class="text-[10px] text-gray-400 truncate">{{ cat.desc }}</div>
                      </div>
                      <Icon :name="isRTL ? 'mdi:chevron-left' : 'mdi:chevron-right'" class="w-4 h-4 text-gray-300 group-hover:text-najmgreen transition-colors shrink-0" />
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <!-- State B: Active Query Results -->
              <div v-else class="space-y-4 pt-1">
                <!-- No Results -->
                <div v-if="results.length === 0" class="text-center py-10 space-y-3">
                  <div class="w-12 h-12 rounded-2xl bg-najmgrey text-gray-400 flex items-center justify-center mx-auto">
                    <Icon name="mdi:file-search-outline" class="w-6 h-6" />
                  </div>
                  <h4 class="text-sm sm:text-base font-bold text-gray-800 text-d4">
                    {{ t.noResultsFor }} «{{ searchQuery }}»
                  </h4>
                  <p class="text-xs text-gray-500 max-w-sm mx-auto">
                    {{ t.noResultsTip }}
                  </p>
                </div>

                <!-- Results List with Keyboard Highlight -->
                <div v-else class="space-y-2">
                  <div class="text-[11px] text-gray-400 flex items-center justify-between px-1">
                    <span>{{ t.resultsCount }} ({{ results.length }})</span>
                    <span class="hidden sm:inline">{{ t.navigateHint }}</span>
                  </div>

                  <div class="space-y-1.5">
                    <NuxtLink
                      v-for="(item, idx) in results"
                      :key="item.id"
                      :to="item.url"
                      @click="handleNavigate(item.title)"
                      class="p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group cursor-pointer"
                      :class="[
                        activeIndex === idx
                          ? 'bg-najmgreen/5 border-najmgreen ring-1 ring-najmgreen/30'
                          : 'bg-white border-najmborder/40 hover:border-gray-300 hover:bg-gray-50/50'
                      ]"
                    >
                      <div class="flex items-center gap-3 flex-1 min-w-0" :class="isRTL ? 'text-right' : 'text-left'">
                        <div class="w-8 h-8 rounded-xl bg-najmgrey text-najmgreen flex items-center justify-center shrink-0">
                          <Icon :name="getCategoryIcon(item.category)" class="w-4 h-4" />
                        </div>
                        <div class="space-y-0.5 flex-1 min-w-0">
                          <div class="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-najmgreen transition-colors truncate text-d4">
                            {{ item.title }}
                          </div>
                          <div class="text-[11px] text-gray-500 truncate">{{ item.description }}</div>
                        </div>
                      </div>

                      <div class="flex items-center gap-2 shrink-0">
                        <span class="text-[10px] px-2 py-0.5 rounded-md bg-najmgrey text-gray-700 font-medium">
                          {{ item.categoryLabel }}
                        </span>
                        <Icon :name="isRTL ? 'mdi:arrow-left' : 'mdi:arrow-right'" class="w-4 h-4 text-gray-400 group-hover:text-najmgreen transition-colors" />
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Meta Bar -->
            <div class="px-4 sm:px-6 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <kbd class="px-1 bg-white border border-gray-200 rounded font-mono text-[9px]">↑</kbd>
                  <kbd class="px-1 bg-white border border-gray-200 rounded font-mono text-[9px]">↓</kbd>
                  {{ t.keySelect }}
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 bg-white border border-gray-200 rounded font-mono text-[9px]">↵</kbd>
                  {{ t.keyEnter }}
                </span>
              </div>
              <span class="font-bold text-najmgreen">{{ t.brandTitle }}</span>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSiteSearch } from '@/composables/useSiteSearch'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const {
  query: searchQuery,
  activeCategory,
  results,
  recentSearches,
  saveRecentSearch,
  removeRecentSearch,
  clearAllRecentSearches
} = useSiteSearch()

const inputRef = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)

watch(
  () => props.visible,
  (val) => {
    if (val) {
      activeIndex.value = 0
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
  }
)

const categoryList = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') {
    return [
      { id: 'all', label: 'All' },
      { id: 'products', label: 'Products & Boxes' },
      { id: 'services', label: 'Printing & Finishing' },
      { id: 'resources', label: 'Catalogs & Die-lines' },
      { id: 'pages', label: 'Site Pages' }
    ]
  } else if (lang === 'AR') {
    return [
      { id: 'all', label: 'الكل' },
      { id: 'products', label: 'المنتجات والعلب' },
      { id: 'services', label: 'الطباعة والتشطيب' },
      { id: 'resources', label: 'الكتالوجات والقوالب' },
      { id: 'pages', label: 'صفحات الموقع' }
    ]
  }
  return [
    { id: 'all', label: 'همه بخش‌ها' },
    { id: 'products', label: 'محصولات و جعبه‌ها' },
    { id: 'services', label: 'خدمات چاپ و تکمیلی' },
    { id: 'resources', label: 'کاتالوگ‌ها و قالب‌ها' },
    { id: 'pages', label: 'صفحات وبسایت' }
  ]
})

const t = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') {
    return {
      placeholder: 'Search products, services, catalogs, machines...',
      close: 'Close',
      recentSearches: 'Recent Searches',
      clearHistory: 'Clear History',
      quickAccess: 'Quick Navigation',
      noResultsFor: 'No results found for',
      noResultsTip: 'Try generic terms like "boxes", "packaging", "offset", "catalog", or "contact".',
      resultsCount: 'Matching Results',
      navigateHint: 'Use Arrow Keys to navigate',
      keySelect: 'Navigate',
      keyEnter: 'Open',
      brandTitle: 'Najm Printing & Packaging'
    }
  } else if (lang === 'AR') {
    return {
      placeholder: 'ابحث عن المنتجات، الخدمات، الكتالوجات، الماكينات...',
      close: 'إغلاق',
      recentSearches: 'عمليات البحث الأخيرة',
      clearHistory: 'مسح السجل',
      quickAccess: 'الوصول السريع',
      noResultsFor: 'لا توجد نتائج مطابقة لـ',
      noResultsTip: 'جرب استخدام كلمات بحث أوسع مثل "علب"، "تغليف"، "أوفست"، "كتالوج"، أو "اتصل بنا".',
      resultsCount: 'النتائج المطابقة',
      navigateHint: 'استخدم الأسهم للتنقل',
      keySelect: 'تنقل',
      keyEnter: 'فتح',
      brandTitle: 'مجمع مطبعة وتغليف نجم'
    }
  }
  return {
    placeholder: 'جستجوی محصول، خدمات چاپ، هاردباکس، کاتالوگ…',
    close: 'بستن',
    recentSearches: 'آخرین جست‌وجوهای شما',
    clearHistory: 'پاک کردن تاریخچه',
    quickAccess: 'دسترسی سریع به بخش‌های پربازدید',
    noResultsFor: 'نتیجه‌ای برای این عبارت پیدا نشد:',
    noResultsTip: 'از کلمات کلیدی عام‌تر مانند «جعبه»، «هاردباکس»، «کاتالوگ»، «سربرگ» یا «چاپ افست» استفاده فرمایید.',
    resultsCount: 'نتایج یافت شده',
    navigateHint: 'کلیدهای جهت‌نما برای انتخاب',
    keySelect: 'پیمایش',
    keyEnter: 'مشاهده',
    brandTitle: 'چاپ و بسته‌بندی نجم'
  }
})

const localizedShortcuts = computed(() => {
  const lang = (language.value || 'FA').toUpperCase()
  if (lang === 'EN') {
    return [
      { name: 'Cartons & Rigid Boxes', desc: 'Pharmaceutical & luxury magnetic packaging', url: '/products/packaging/boxes', icon: 'mdi:package-variant-closed' },
      { name: 'Paper Shopping Bags', desc: 'Custom coated & kraft gift shopping bags', url: '/products/packaging/shopping-bags', icon: 'mdi:shopping-outline' },
      { name: 'Corporate Letterhead', desc: 'Official letterhead & business envelopes', url: '/products/printing/letterhead', icon: 'mdi:file-document-outline' },
      { name: '5-Color Offset Printing', desc: 'High-speed Heidelberg sheetfed services', url: '/services/printing-and-packaging', icon: 'mdi:printer' },
      { name: 'Download Full Catalog', desc: 'Technical PDF guides & die-line templates', url: '/catalog', icon: 'mdi:download' },
      { name: 'Factory Tour & Contact', desc: 'Direct phone, location & instant quote form', url: '/contact', icon: 'mdi:phone' }
    ]
  } else if (lang === 'AR') {
    return [
      { name: 'علب الكرتون والصلبة', desc: 'تغليف الأدوية والعلب المغناطيسية الفاخرة', url: '/products/packaging/boxes', icon: 'mdi:package-variant-closed' },
      { name: 'أكياس التسوق الورقية', desc: 'أكياس تسوق مخصصة من ورق الكرافت والمقوى', url: '/products/packaging/shopping-bags', icon: 'mdi:shopping-outline' },
      { name: 'الأوراق والمراسلات الرسمية', desc: 'طباعة أوراق المراسلات والقرطاسية المكتبية', url: '/products/printing/letterhead', icon: 'mdi:file-document-outline' },
      { name: 'طباعة أوفست 5 ألوان', desc: 'خدمات طباعة هايدلبرغ فائقة الدقة', url: '/services/printing-and-packaging', icon: 'mdi:printer' },
      { name: 'تحميل الكتالوج الشامل', desc: 'ملفات PDF وقوالب سكاكين التغليف', url: '/catalog', icon: 'mdi:download' },
      { name: 'زيارة المصنع واتصل بنا', desc: 'أرقام التواصل وعنوان المصنع ونموذج الأسعار', url: '/contact', icon: 'mdi:phone' }
    ]
  }
  return [
    { name: 'جعبه‌سازی و هاردباکس', desc: 'انواع جعبه‌های دارویی، مواد غذایی و هاردباکس لوکس', url: '/products/packaging/boxes', icon: 'mdi:package-variant-closed' },
    { name: 'ساک دستی کاغذی', desc: 'شاپینگ بگ‌های گلاسه، کرافت و مقوایی', url: '/products/packaging/shopping-bags', icon: 'mdi:shopping-outline' },
    { name: 'سربرگ و ست اوراق اداری', desc: 'اوراق شرکتی، پاکت‌نامه و کارت ویزیت', url: '/products/printing/letterhead', icon: 'mdi:file-document-outline' },
    { name: 'چاپ افست ۵ رنگ هایدلبرگ', desc: 'خدمات تخصصی چاپ ورقی با کنترل آنلاین رنگ', url: '/services/printing-and-packaging', icon: 'mdi:printer' },
    { name: 'دانلود کاتالوگ و قالب‌ها', desc: 'فایل‌های PDF و وکتورهای قالب تیغ دایکات', url: '/catalog', icon: 'mdi:download' },
    { name: 'استعلام قیمت و تماس با ما', desc: 'شماره‌های تماس، نشانی کارخانه و نقشه', url: '/contact', icon: 'mdi:phone' }
  ]
})

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'products':
      return 'mdi:package-variant-closed'
    case 'services':
      return 'mdi:printer-outline'
    case 'resources':
      return 'mdi:file-download-outline'
    default:
      return 'mdi:web'
  }
}

function clearQuery() {
  searchQuery.value = ''
  activeIndex.value = 0
  inputRef.value?.focus()
}

function selectTerm(term: string) {
  searchQuery.value = term
  inputRef.value?.focus()
}

function navigateDown() {
  if (results.value.length === 0) return
  activeIndex.value = (activeIndex.value + 1) % results.value.length
}

function navigateUp() {
  if (results.value.length === 0) return
  activeIndex.value = (activeIndex.value - 1 + results.value.length) % results.value.length
}

function selectCurrent() {
  if (results.value.length > 0 && results.value[activeIndex.value]) {
    const item = results.value[activeIndex.value]
    handleNavigate(item.title, item.url)
  }
}

function handleNavigate(title?: string, url?: string) {
  if (title) saveRecentSearch(title)
  else if (searchQuery.value.trim()) saveRecentSearch(searchQuery.value.trim())

  emit('close')
  if (url) {
    router.push(url)
  }
}

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.2s ease-out;
}
.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

.search-pop-enter-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out;
}
.search-pop-leave-active {
  transition: transform 0.15s ease-in, opacity 0.15s ease-in;
}
.search-pop-enter-from {
  transform: scale(0.96) translateY(-12px);
  opacity: 0;
}
.search-pop-leave-to {
  transform: scale(0.96) translateY(-8px);
  opacity: 0;
}
</style>
