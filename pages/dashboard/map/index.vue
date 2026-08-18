<!-- pages/dashboard/map/index.vue -->
<template>
  <div
    :dir="isRTL ? 'rtl' : 'ltr'"
    class="fixed inset-0 z-50 h-screen w-screen bg-[#f8fafc] text-slate-800 select-none overflow-hidden font-sans flex flex-col"
  >
    <!-- Top Modern Minimal Header Bar -->
    <header class="h-16 px-6 bg-white/95 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between shadow-xs shrink-0 z-30">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 transition text-xs font-bold text-slate-700 text-d4 cursor-pointer"
        >
          <Icon name="mdi:arrow-right" class="w-4 h-4" :class="isRTL ? '' : 'rotate-180'" />
          <span>{{ isRTL ? 'بازگشت به پیشخوان' : 'Back to Dashboard' }}</span>
        </NuxtLink>

        <div class="h-5 w-[1px] bg-slate-200"></div>

        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-[#018786]">
            <Icon name="mdi:sitemap" class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-sm font-extrabold text-slate-900 text-d4">
              {{ isRTL ? 'مرکز مدیریت بصری و تنظیمات وبسایت' : 'Website Visual Control Center' }}
            </h1>
            <p class="text-[11px] text-slate-500">
              {{ isRTL ? 'بررسی و تنظیم محتوا، تصاویر، محصولات و بخش‌های تعاملی هر صفحه' : 'Tune page content, media assets, products & interactive features' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Search Bar -->
      <div class="relative w-64 hidden sm:block">
        <Icon name="mdi:magnify" class="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="isRTL ? 'جستجو در صفحات و محتوا...' : 'Search pages & content...'"
          class="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#018786] transition"
        />
      </div>
    </header>

    <!-- Main 2-Column Classic Modern Workspace -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left/Sidebar: Page Navigator (Classic Modern Navigation) -->
      <aside class="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-xs z-20">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 text-d4 uppercase tracking-wider">
            {{ isRTL ? 'صفحات وبسایت (Sitemap)' : 'Website Pages' }}
          </span>
          <span class="px-2 py-0.5 rounded-full bg-teal-50 text-[#018786] text-[10px] font-bold">
            {{ pages.length }} صفحه
          </span>
        </div>

        <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            v-for="page in filteredPages"
            :key="page.id"
            @click="selectedPageId = page.id"
            class="w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer group"
            :class="[
              selectedPageId === page.id
                ? 'bg-[#018786] text-white shadow-md font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            ]"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-xl flex items-center justify-center transition"
                :class="selectedPageId === page.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'"
              >
                <Icon :name="page.icon" class="w-4.5 h-4.5" />
              </div>
              <div>
                <div class="text-xs font-extrabold text-d4 truncate">
                  {{ isRTL ? page.titleFa : page.titleEn }}
                </div>
                <div class="text-[10px] font-mono opacity-70 ltr text-left">
                  {{ page.path }}
                </div>
              </div>
            </div>

            <Icon
              name="mdi:chevron-left"
              class="w-4 h-4 transition-transform"
              :class="[
                selectedPageId === page.id ? 'translate-x-0 text-white' : 'translate-x-1 text-slate-400 group-hover:translate-x-0'
              ]"
            />
          </button>
        </nav>
      </aside>

      <!-- Center: Selected Page Visual Mindmap & Control Hub -->
      <main v-if="currentPage" class="flex-1 bg-[#f8fafc] p-6 sm:p-8 overflow-y-auto relative">
        <!-- Selected Page Header Card -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-teal-50 text-[#018786] flex items-center justify-center shrink-0 border border-teal-100">
              <Icon :name="currentPage.icon" class="w-7 h-7" />
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-extrabold text-slate-900 text-d4">
                  {{ isRTL ? currentPage.titleFa : currentPage.titleEn }}
                </h2>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  فعال (Live OK)
                </span>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">
                {{ isRTL ? currentPage.descFa : currentPage.descEn }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <NuxtLink
              :to="currentPage.path"
              target="_blank"
              class="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 text-d4"
            >
              <Icon name="mdi:open-in-new" class="w-4 h-4 text-[#018786]" />
              <span>{{ isRTL ? 'مشاهده زنده صفحه' : 'View Live' }}</span>
            </NuxtLink>
            <NuxtLink
              to="/dashboard/cms"
              class="px-4 py-2.5 rounded-2xl bg-[#018786] hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 text-d4"
            >
              <Icon name="mdi:square-edit-outline" class="w-4 h-4" />
              <span>{{ isRTL ? 'ویرایش متن‌ها در CMS' : 'Edit in CMS' }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- 5 Classic Modern Ecosystem Tuning Categories Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- CATEGORY 1: Editorial Content & Text -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2 text-blue-700 font-bold text-xs text-d4">
                <div class="p-1.5 rounded-xl bg-blue-50">
                  <Icon name="mdi:text-box-edit-outline" class="w-4 h-4" />
                </div>
                <span>{{ isRTL ? 'محتوا و متن‌های اصلی' : 'Editorial Text' }}</span>
              </div>
              <span class="text-[10px] font-bold text-slate-400 font-mono">{{ currentPage.contentItems.length }} مورد</span>
            </div>

            <div class="space-y-2">
              <div
                v-for="item in currentPage.contentItems"
                :key="item.title"
                @click="tuneItem(item)"
                class="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 transition cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div class="text-xs font-bold text-slate-800 text-d4 group-hover:text-blue-700">
                    {{ item.title }}
                  </div>
                  <div class="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5">
                    {{ item.preview }}
                  </div>
                </div>
                <Icon name="mdi:pencil-outline" class="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
              </div>
            </div>
          </div>

          <!-- CATEGORY 2: Media Assets & Gallery -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2 text-purple-700 font-bold text-xs text-d4">
                <div class="p-1.5 rounded-xl bg-purple-50">
                  <Icon name="mdi:image-multiple-outline" class="w-4 h-4" />
                </div>
                <span>{{ isRTL ? 'تصاویر و رسانه‌های صفحه' : 'Media Assets' }}</span>
              </div>
              <span class="text-[10px] font-bold text-slate-400 font-mono">{{ currentPage.mediaItems.length }} تصویر</span>
            </div>

            <div class="space-y-2">
              <div
                v-for="img in currentPage.mediaItems"
                :key="img.title"
                @click="tuneItem(img)"
                class="p-2.5 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 transition cursor-pointer flex items-center gap-3 group"
              >
                <img :src="img.url" :alt="img.title" class="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                <div class="overflow-hidden">
                  <div class="text-xs font-bold text-slate-800 text-d4 group-hover:text-purple-700 truncate">
                    {{ img.title }}
                  </div>
                  <div class="text-[10px] font-mono text-slate-400 truncate">
                    {{ img.size }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CATEGORY 3: Linked Products & Data Collections -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2 text-emerald-700 font-bold text-xs text-d4">
                <div class="p-1.5 rounded-xl bg-emerald-50">
                  <Icon name="mdi:package-variant-closed" class="w-4 h-4" />
                </div>
                <span>{{ isRTL ? 'محصولات و کالکشن‌ها' : 'Linked Data' }}</span>
              </div>
              <span class="text-[10px] font-bold text-slate-400 font-mono">{{ currentPage.productItems.length }} مورد</span>
            </div>

            <div class="space-y-2">
              <div
                v-for="prod in currentPage.productItems"
                :key="prod.title"
                @click="tuneItem(prod)"
                class="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-200 transition cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div class="text-xs font-bold text-slate-800 text-d4 group-hover:text-emerald-700">
                    {{ prod.title }}
                  </div>
                  <div class="text-[11px] text-slate-500 mt-0.5">
                    {{ prod.tag }}
                  </div>
                </div>
                <Icon name="mdi:database-search-outline" class="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
              </div>
            </div>
          </div>

          <!-- CATEGORY 4: Interactive Features & UI Sections -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2 text-amber-700 font-bold text-xs text-d4">
                <div class="p-1.5 rounded-xl bg-amber-50">
                  <Icon name="mdi:auto-fix" class="w-4 h-4" />
                </div>
                <span>{{ isRTL ? 'جلوه‌ها و بخش‌های تعاملی' : 'Interactive Features' }}</span>
              </div>
              <span class="text-[10px] font-bold text-slate-400 font-mono">{{ currentPage.featureItems.length }} بخش</span>
            </div>

            <div class="space-y-2">
              <div
                v-for="feat in currentPage.featureItems"
                :key="feat.title"
                @click="tuneItem(feat)"
                class="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-200 transition cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div class="text-xs font-bold text-slate-800 text-d4 group-hover:text-amber-700">
                    {{ feat.title }}
                  </div>
                  <div class="text-[11px] text-slate-500 mt-0.5">
                    {{ feat.status }}
                  </div>
                </div>
                <Icon name="mdi:tune-variant" class="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
              </div>
            </div>
          </div>

          <!-- CATEGORY 5: Form Leads & Customer Enquiries -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2 text-rose-700 font-bold text-xs text-d4">
                <div class="p-1.5 rounded-xl bg-rose-50">
                  <Icon name="mdi:email-outline" class="w-4 h-4" />
                </div>
                <span>{{ isRTL ? 'استعلام‌ها و لیدهای مشتریان' : 'Customer Enquiries' }}</span>
              </div>
              <span class="text-[10px] font-bold text-slate-400 font-mono">فعال</span>
            </div>

            <div class="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2 text-right">
              <div class="text-xs font-bold text-rose-900 text-d4">
                {{ isRTL ? 'فرم استعلام قیمت و سفارش اختصاصی' : 'Instant Quote Form' }}
              </div>
              <p class="text-[11px] text-slate-600 leading-relaxed">
                {{ isRTL ? 'درخواست‌های ثبت‌شده مستقیماً به پیشخوان ارسال می‌شوند.' : 'Captured leads are routed directly to dashboard logs.' }}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Smart Item Tuning Modal -->
    <transition name="fade">
      <div v-if="activeTuningItem" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-5 text-right">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <span class="text-xs font-bold text-[#018786] text-d4">تنظیم مستقیم آیتم</span>
            <button @click="activeTuningItem = null" class="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-2">
            <h3 class="text-base font-extrabold text-slate-900 text-d4">
              {{ activeTuningItem.title }}
            </h3>
            <p class="text-xs text-slate-500">
              {{ activeTuningItem.preview || activeTuningItem.tag || activeTuningItem.status || 'آماده تنظیم در پیشخوان' }}
            </p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex gap-2">
            <NuxtLink
              to="/dashboard/cms"
              class="flex-1 py-2.5 rounded-xl bg-[#018786] hover:bg-emerald-800 text-white font-bold text-xs text-center transition text-d4 shadow-xs"
            >
              {{ isRTL ? 'ویرایش در CMS' : 'Edit in CMS' }}
            </NuxtLink>
            <button
              @click="activeTuningItem = null"
              class="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition text-d4"
            >
              {{ isRTL ? 'بستن' : 'Close' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: false
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const searchQuery = ref('')
const selectedPageId = ref('about')
const activeTuningItem = ref<any>(null)

function tuneItem(item: any) {
  activeTuningItem.value = item
}

interface PageData {
  id: string
  titleFa: string
  titleEn: string
  path: string
  descFa: string
  descEn: string
  icon: string
  contentItems: { title: string; preview: string }[]
  mediaItems: { title: string; size: string; url: string }[]
  productItems: { title: string; tag: string }[]
  featureItems: { title: string; status: string }[]
}

const pages: PageData[] = [
  {
    id: 'home',
    titleFa: 'صفحه اصلی (خانه)',
    titleEn: 'Home Page',
    path: '/',
    descFa: 'ورودی اصلی وبسایت، استیج سه بعدی کاتالوگ و فرم‌های استعلام قیمت.',
    descEn: 'Main website entry page with 3D scenes and instant quote calculator.',
    icon: 'mdi:home-outline',
    contentItems: [
      { title: 'تیتر اصلی هیرو', preview: 'نوآوری در چاپ افست، مهندسی در بسته‌بندی' },
      { title: 'آمار کلیدی ۲۵ سال', preview: '+۲۵ سال سابقه مستمر صنعتی' }
    ],
    mediaItems: [
      { title: 'ویدیو خط تولید هایدلبرگ', size: '12.4 MB (MP4)', url: '/images/about/staff.png' },
      { title: 'تصویر هیرو شوروم', size: '420 KB (WebP)', url: '/images/about/solution-1.png' }
    ],
    productItems: [
      { title: 'جعبه دارویی ایندربرد', tag: 'محصول برتر' },
      { title: 'هاردباکس صادراتی', tag: 'لوکس' }
    ],
    featureItems: [
      { title: 'استیج سه بعدی نوری', status: 'فعال (WebGL)' },
      { title: 'محاسبه‌گر آنلاین تیراژ', status: 'فعال' }
    ]
  },
  {
    id: 'about',
    titleFa: 'درباره ما (روایت صنعتی)',
    titleEn: 'About Us',
    path: '/about',
    descFa: 'معرفی تیم متخصص، خطوط تولید هایدلبرگ و راهکارهای پین‌شده 360vh.',
    descEn: 'Industrial heritage, technical team leads, and 360vh pinned solutions.',
    icon: 'mdi:information-outline',
    contentItems: [
      { title: 'بیانیه ماموریت و چشم‌انداز', preview: 'تولید یکپارچه با کیفیت میکرونی' },
      { title: 'معرفی سرپرستان تولید', preview: 'واحد CTP، افست و کنترل کیفیت' }
    ],
    mediaItems: [
      { title: 'عکس دسته‌جمعی پرسنل', size: '380 KB (WebP)', url: '/images/about/staff.png' },
      { title: 'ماشین چاپ افست ۵ رنگ', size: '510 KB (WebP)', url: '/images/about/machines-1.png' }
    ],
    productItems: [
      { title: 'جعبه کرافت غذایی', tag: 'بسته‌بندی سالم' }
    ],
    featureItems: [
      { title: 'استیج پین‌شده راهکارها', status: 'فعال (Sticky 360vh)' },
      { title: 'ناوبری شناور کاپوسلی', status: 'فعال' }
    ]
  },
  {
    id: 'products',
    titleFa: 'کاتالوگ محصولات',
    titleEn: 'Products Catalog',
    path: '/products',
    descFa: '۱۲ نوع محصول واقعی با موکاپ‌های وکتور SVG و فیلترهای پیشرفته.',
    descEn: '12 packaging products with SVG mockups and category filters.',
    icon: 'mdi:package-variant-closed',
    contentItems: [
      { title: 'عنوان کاتالوگ محصولات', preview: 'راهکارهای تخصصی چاپ و بسته‌بندی' }
    ],
    mediaItems: [
      { title: 'وکتورهای SVG محصولات', size: '42 KB (SVG)', url: '/images/about/solution-2.png' }
    ],
    productItems: [
      { title: '۱۲ نوع جعبه و بسته‌بندی', tag: 'دیتابیس کامل' }
    ],
    featureItems: [
      { title: 'حالت دوگانه شبکه / لیست', status: 'فعال' }
    ]
  },
  {
    id: 'history',
    titleFa: 'تاریخچه ۲۵ ساله',
    titleEn: '25-Year History',
    path: '/history',
    descFa: 'تایم‌لاین کرونولوژیک صنعتی از ۱۳۷۸ تا ۱۴۰۴.',
    descEn: 'Chronological industrial journey timeline from 1999 to 2026.',
    icon: 'mdi:timeline-text-outline',
    contentItems: [
      { title: 'روایت ۲۵ سال سابقه', preview: 'سیر تحول تجهیزات افست و بوبست' }
    ],
    mediaItems: [
      { title: 'تصاویر ارشیوی کارخانه', size: '640 KB (WebP)', url: '/images/about/machines-3.png' }
    ],
    productItems: [],
    featureItems: [
      { title: 'تایم‌لاین تعاملی', status: 'فعال' }
    ]
  }
]

const filteredPages = computed(() => {
  if (!searchQuery.value) return pages
  const q = searchQuery.value.toLowerCase()
  return pages.filter(p => p.titleFa.toLowerCase().includes(q) || p.titleEn.toLowerCase().includes(q))
})

const currentPage = computed(() => pages.find(p => p.id === selectedPageId.value) || pages[0])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
