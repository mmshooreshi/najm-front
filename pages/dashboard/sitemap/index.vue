<!-- pages/dashboard/sitemap/index.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="space-y-6 max-w-full">
    <!-- Top Header Banner -->
    <div class="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-xs border border-slate-200 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#018786] border border-teal-200">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{{ isRTL ? 'پویای متصل به بک‌اند PocketBase' : 'Live PocketBase Backend Dynamic' }}</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 text-d4">
          {{ isRTL ? 'نقشه جامع و گروه‌بندی‌شده معماری وبسایت' : 'Aggregated Grouped Sitemap' }}
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          {{ isRTL
            ? 'تمام داده‌ها، آمارها، گروه‌ها و سطح‌بندی‌ها (سطح ۱ تا ۴) به‌صورت ۱۰۰٪ پویا از سرور و دیتابیس دریافت می‌شوند.'
            : '100% dynamic live sitemap data fetched from backend server & PocketBase database.' }}
        </p>
      </div>

      <!-- Refresh & View Switcher Controls -->
      <div class="flex items-center gap-2 flex-wrap shrink-0">
        <button
          @click="refreshSitemap"
          :disabled="pending"
          class="px-3.5 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 text-[#018786] border border-teal-200 text-xs font-bold transition cursor-pointer text-d4 flex items-center gap-1.5 disabled:opacity-50"
        >
          <Icon name="mdi:refresh" class="w-4 h-4" :class="pending ? 'animate-spin' : ''" />
          <span>{{ isRTL ? 'به‌روزرسانی داده‌ها' : 'Refresh Data' }}</span>
        </button>

        <button
          @click="expandAll = !expandAll"
          class="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer text-d4 flex items-center gap-1.5"
        >
          <Icon :name="expandAll ? 'mdi:collapse-all' : 'mdi:expand-all'" class="w-4 h-4 text-[#018786]" />
          <span>{{ expandAll ? (isRTL ? 'بستن همه' : 'Collapse All') : (isRTL ? 'باز کردن همه' : 'Expand All') }}</span>
        </button>

        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            v-for="mode in viewModes"
            :key="mode.id"
            @click="activeViewMode = mode.id"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer text-d4 flex items-center gap-1"
            :class="[
              activeViewMode === mode.id
                ? 'bg-[#018786] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            ]"
          >
            <Icon :name="mode.icon" class="w-4 h-4" />
            <span class="hidden sm:inline">{{ isRTL ? mode.labelFa : mode.labelEn }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Live Metrics Strip -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-2xs">
        <div>
          <div class="text-xs text-slate-500 font-bold">تعداد صفحات دیتابیس (pages)</div>
          <div class="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            {{ sitemapStats.pagesCount }} رکورد
          </div>
        </div>
        <div class="p-2.5 rounded-xl bg-blue-50 text-blue-600">
          <Icon name="mdi:file-document-outline" class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-2xs">
        <div>
          <div class="text-xs text-slate-500 font-bold">تعداد محصولات کاتالوگ (products)</div>
          <div class="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            {{ sitemapStats.productsCount }} آیتم
          </div>
        </div>
        <div class="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
          <Icon name="mdi:package-variant" class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-2xs">
        <div>
          <div class="text-xs text-slate-500 font-bold">تعداد رسانه‌ها (media_files)</div>
          <div class="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            {{ sitemapStats.mediaCount }} فایل
          </div>
        </div>
        <div class="p-2.5 rounded-xl bg-purple-50 text-purple-600">
          <Icon name="mdi:folder-multiple-image" class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
      <!-- Search Input -->
      <div class="relative w-full sm:w-80">
        <Icon name="mdi:magnify" class="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="isRTL ? 'جستجو در نام صفحه، مسیر یا عنوان...' : 'Search page name, route or title...'"
          class="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#018786] transition"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="absolute left-3 top-2.5 text-slate-400 hover:text-slate-700">
          <Icon name="mdi:close-circle" class="w-4 h-4" />
        </button>
      </div>

      <!-- Group Filter Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-0.5 no-scrollbar">
        <button
          v-for="grp in groups"
          :key="grp.id"
          @click="activeGroup = grp.id"
          class="px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap text-d4 border"
          :class="[
            activeGroup === grp.id
              ? 'bg-[#018786] text-white border-[#018786] shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          ]"
        >
          {{ isRTL ? grp.labelFa : grp.labelEn }}
        </button>
      </div>
    </div>

    <!-- MODE 1: HIERARCHICAL TREE VIEW (LEVELS 1 TO 4) -->
    <div v-if="activeViewMode === 'tree'" class="space-y-6">
      <!-- Level 1: Root Node -->
      <div class="bg-white rounded-3xl p-6 border-2 border-emerald-500/40 shadow-md space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-teal-50 text-[#018786] flex items-center justify-center font-bold border border-teal-200">
              L1
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">سطح ۱ - ریشه اصلی</span>
                <h2 class="text-lg font-extrabold text-slate-900 text-d4">صفحه اصلی وبسایت (Home Root - /)</h2>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">درگاه ورودی اصلی، هیرو سه بعدی، کاتالوگ و فرم‌های استعلام قیمت.</p>
            </div>
          </div>
          <NuxtLink to="/" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 text-d4">
            <Icon name="mdi:open-in-new" class="w-4 h-4 text-[#018786]" />
            <span>مشاهده</span>
          </NuxtLink>
        </div>

        <!-- Level 2 Groups & Children -->
        <div class="space-y-6 pr-4 sm:pr-6 border-r-2 border-emerald-500/20">
          <div v-for="group in filteredTreeGroups" :key="group.id" class="space-y-4">
            <!-- Group Header -->
            <div class="flex items-center gap-2 text-slate-800 font-extrabold text-sm text-d4">
              <div class="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono">
                L2
              </div>
              <span>{{ isRTL ? group.labelFa : group.labelEn }}</span>
              <span class="text-xs text-slate-400 font-normal">({{ group.children.length }} صفحه زیرمجموعه)</span>
            </div>

            <!-- Children Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="child in group.children"
                :key="child.id"
                class="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition space-y-3 shadow-2xs"
              >
                <!-- Child Header -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon :name="child.icon" class="w-4.5 h-4.5 text-[#018786]" />
                    <span class="text-xs font-extrabold text-slate-900 text-d4">{{ isRTL ? child.titleFa : child.titleEn }}</span>
                  </div>
                  <span class="text-[10px] font-mono text-slate-400">{{ child.path }}</span>
                </div>

                <p class="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  {{ isRTL ? child.descFa : child.descEn }}
                </p>

                <!-- Level 3 & Level 4 Sub-nodes -->
                <div v-if="expandAll || child.subNodes?.length" class="pt-2 border-t border-slate-200/80 space-y-1.5">
                  <div class="text-[10px] font-bold text-slate-400 text-d4">سطح ۳ و ۴ (ویژگی‌ها و کالکشن‌ها):</div>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span
                      v-for="sub in child.subNodes"
                      :key="sub"
                      class="px-2 py-0.5 rounded-md bg-white text-slate-700 text-[10px] font-medium border border-slate-200"
                    >
                      • {{ sub }}
                    </span>
                  </div>
                </div>

                <!-- Footer Links -->
                <div class="pt-2 flex items-center justify-between border-t border-slate-200/80 text-[11px]">
                  <NuxtLink :to="child.path" target="_blank" class="text-[#018786] font-bold hover:underline flex items-center gap-1">
                    <span>مشاهده صفحه</span>
                    <Icon name="mdi:chevron-left" class="w-3.5 h-3.5" />
                  </NuxtLink>
                  <NuxtLink to="/dashboard/cms" class="text-slate-500 hover:text-slate-900">
                    ویرایش در CMS
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 2: AGGREGATED GROUP CARDS -->
    <div v-else-if="activeViewMode === 'group'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="group in filteredTreeGroups"
        :key="group.id"
        class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-teal-50 text-[#018786] flex items-center justify-center">
                <Icon :name="group.icon" class="w-4.5 h-4.5" />
              </div>
              <h3 class="text-sm font-extrabold text-slate-900 text-d4">
                {{ isRTL ? group.labelFa : group.labelEn }}
              </h3>
            </div>
            <span class="text-xs font-bold text-[#018786] bg-teal-50 px-2.5 py-0.5 rounded-full">
              {{ group.children.length }} آیتم
            </span>
          </div>

          <div class="space-y-2.5">
            <div
              v-for="child in group.children"
              :key="child.id"
              class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
            >
              <div class="flex items-center gap-2.5">
                <Icon :name="child.icon" class="w-4 h-4 text-[#018786]" />
                <div>
                  <div class="text-xs font-bold text-slate-800 text-d4">{{ isRTL ? child.titleFa : child.titleEn }}</div>
                  <div class="text-[10px] font-mono text-slate-400">{{ child.path }}</div>
                </div>
              </div>
              <NuxtLink :to="child.path" target="_blank" class="text-slate-400 hover:text-[#018786]">
                <Icon name="mdi:open-in-new" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 text-xs text-slate-400 text-left font-mono">
          Total Group Routes: {{ group.children.length }}
        </div>
      </div>
    </div>

    <!-- MODE 3: TABLE MATRIX VIEW -->
    <div v-else class="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-right text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-d4">
            <tr>
              <th class="p-4">سطح</th>
              <th class="p-4">عنوان صفحه</th>
              <th class="p-4">مسیر URL</th>
              <th class="p-4">گروه اصلی</th>
              <th class="p-4">ویژگی‌ها و زیرمجموعه‌ها</th>
              <th class="p-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="row in flatTableRows" :key="row.id" class="hover:bg-slate-50/80 transition">
              <td class="p-4">
                <span class="px-2 py-0.5 rounded-md bg-teal-50 text-[#018786] font-bold font-mono">L{{ row.level }}</span>
              </td>
              <td class="p-4 font-bold text-slate-900 text-d4">
                <div class="flex items-center gap-2">
                  <Icon :name="row.icon" class="w-4 h-4 text-[#018786]" />
                  <span>{{ isRTL ? row.titleFa : row.titleEn }}</span>
                </div>
              </td>
              <td class="p-4 font-mono text-slate-500 ltr text-left">{{ row.path }}</td>
              <td class="p-4 text-slate-600 font-medium">{{ row.groupLabel }}</td>
              <td class="p-4 text-slate-500">
                <span v-if="row.subNodes?.length" class="text-[11px]">{{ row.subNodes.join(' ، ') }}</span>
                <span v-else class="text-slate-300">-</span>
              </td>
              <td class="p-4 text-center">
                <NuxtLink :to="row.path" target="_blank" class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#018786] font-bold transition inline-flex items-center gap-1">
                  <span>مشاهده</span>
                  <Icon name="mdi:open-in-new" class="w-3.5 h-3.5" />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: 'dashboard'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const activeViewMode = ref('tree') // tree, group, table
const activeGroup = ref('all')
const searchQuery = ref('')
const expandAll = ref(true)

// Fetch Live Sitemap Data 100% Dynamically from Backend API (/api/admin/sitemap)
const { data: sitemapRes, pending, refresh } = await useAsyncData('admin-sitemap-live', () =>
  $fetch<any>('/api/admin/sitemap'),
  { lazy: true }
)

const sitemapStats = computed(() => sitemapRes.value?.stats || { pagesCount: 0, productsCount: 0, mediaCount: 0 })
const treeGroups = computed(() => sitemapRes.value?.groups || [])

function refreshSitemap() {
  refresh()
}

const viewModes = [
  { id: 'tree', labelFa: 'نمای درختی (سطوح ۱ تا ۴)', labelEn: 'Tree Hierarchy (L1-L4)', icon: 'mdi:file-tree' },
  { id: 'group', labelFa: 'کارت‌های گروه‌بندی‌شده', labelEn: 'Group Cards', icon: 'mdi:view-grid-outline' },
  { id: 'table', labelFa: 'ماتریس جدولی', labelEn: 'Table Matrix', icon: 'mdi:table' },
]

const groups = [
  { id: 'all', labelFa: 'همه گروه‌ها', labelEn: 'All Groups' },
  { id: 'commercial', labelFa: 'عمومی و تجاری', labelEn: 'Commercial' },
  { id: 'catalog', labelFa: 'کاتالوگ و محصولات', labelEn: 'Catalog & Products' },
  { id: 'knowledge', labelFa: 'دانش و تاریخچه', labelEn: 'Knowledge & Press' },
  { id: 'help', labelFa: 'پشتیبانی و راهنما', labelEn: 'Help & Resources' },
  { id: 'admin', labelFa: 'مدیریت و پیشخوان', labelEn: 'Admin Suite' },
]

const filteredTreeGroups = computed(() => {
  return treeGroups.value.filter((g: any) => {
    if (activeGroup.value !== 'all' && g.id !== activeGroup.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchChildren = g.children.some((c: any) => c.titleFa.toLowerCase().includes(q) || c.titleEn.toLowerCase().includes(q) || c.path.toLowerCase().includes(q))
      if (!matchChildren) return false
    }
    return true
  })
})

const flatTableRows = computed(() => {
  const rows: any[] = []
  treeGroups.value.forEach((g: any) => {
    g.children.forEach((c: any) => {
      if (activeGroup.value !== 'all' && g.id !== activeGroup.value) return
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        const match = c.titleFa.toLowerCase().includes(q) || c.titleEn.toLowerCase().includes(q) || c.path.toLowerCase().includes(q)
        if (!match) return
      }
      rows.push({
        ...c,
        level: c.level || 2,
        groupLabel: isRTL.value ? g.labelFa : g.labelEn
      })
    })
  })
  return rows
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
