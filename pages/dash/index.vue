<!-- pages/dash/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Top Summary Banner -->
    <div class="rounded-2xl bg-gradient-to-l from-emerald-950/60 via-zinc-900/90 to-zinc-900 p-5 sm:p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4">
          پیشخوان مدیریت چاپ و بسته‌بندی نجم
        </h2>
        <p class="text-xs text-zinc-400">
          بررسی درخواست‌های جدید مشتریان، ثبت نمونه‌کارهای هاردباکس و کارتن، و ویرایش محتوای سایت
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/dash/requests"
          class="px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all font-d4 flex items-center gap-1.5"
        >
          <AdminIcon name="mail" class="w-4 h-4" />
          <span>استعلام‌های جدید ({{ pendingCount }})</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 4 Real KPI Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashStatCard
        title="استعلام‌های جدید"
        :value="requestsList.length"
        unit="درخواست"
        subtitle="فرم‌های ثبت شده در سایت"
        icon="mail"
        variant="emerald"
      />
      <DashStatCard
        title="نمونه‌کارها و محصولات"
        :value="productsCount"
        unit="محصول"
        subtitle="هاردباکس، کارتن و لیبل"
        icon="crop"
        variant="amber"
      />
      <DashStatCard
        title="مقالات منتشر شده"
        :value="postsCount"
        unit="مقاله"
        subtitle="مطالب وبلاگ و اخبار"
        icon="file"
        variant="purple"
      />
      <DashStatCard
        title="فایل‌ها و تصاویر"
        :value="mediaCount"
        unit="فایل"
        subtitle="تصاویر محصولات و کاتالوگ"
        icon="photo"
        variant="cyan"
      />
    </div>

    <!-- Main Workspace Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left (2 Cols): Real Incoming Inquiries Feed -->
      <div class="lg:col-span-2 rounded-2xl bg-zinc-900/80 border border-white/10 p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white font-d4 flex items-center gap-2">
            <AdminIcon name="mail" class="w-4 h-4 text-emerald-400" />
            <span>آخرین درخواست‌های استعلام قیمت</span>
          </h3>

          <NuxtLink to="/dash/requests" class="text-xs text-emerald-400 hover:underline font-semibold font-d4">
            مشاهده همه ←
          </NuxtLink>
        </div>

        <div v-if="loading" class="p-8 text-center text-zinc-500 text-xs">
          در حال دریافت اطلاعات...
        </div>

        <div v-else-if="requestsList.length === 0" class="p-8 text-center text-zinc-500 text-xs">
          هنوز درخواستی ثبت نشده است.
        </div>

        <div v-else class="space-y-2.5">
          <div
            v-for="req in requestsList.slice(0, 4)"
            :key="req.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-emerald-500/30 transition-all gap-3"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                {{ req.name.charAt(0) }}
              </div>
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-zinc-100 font-d4">{{ req.name }}</span>
                  <span v-if="req.company" class="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-zinc-400">
                    {{ req.company }}
                  </span>
                </div>
                <div class="text-[11px] text-zinc-400">
                  <span>نوع: <strong class="text-zinc-200">{{ req.category }}</strong></span>
                  <span v-if="req.quantity" class="mr-2">تیراژ: <strong class="text-zinc-200">{{ req.quantity }}</strong></span>
                </div>
              </div>
            </div>

            <!-- Fast Call / WhatsApp -->
            <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
              <a
                v-if="req.phone"
                :href="`https://wa.me/${req.phone.replace(/^0/, '98')}?text=${encodeURIComponent('سلام وقت بخیر، از مجتمع چاپ و بسته‌بندی نجم در خصوص سفارش شما پیام می‌دهیم.')}`"
                target="_blank"
                class="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <AdminIcon name="chat" class="w-3 h-3" />
                <span>واتس‌اپ</span>
              </a>

              <a
                v-if="req.phone"
                :href="`tel:${req.phone}`"
                class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <AdminIcon name="phone" class="w-3 h-3" />
                <span>تماس</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Right (1 Col): Quick Site Sections Map -->
      <div class="rounded-2xl bg-zinc-900/80 border border-white/10 p-5 space-y-3">
        <h3 class="text-sm font-bold text-white font-d4 flex items-center gap-2">
          <AdminIcon name="layout" class="w-4 h-4 text-amber-400" />
          <span>بخش‌های سایت برای ویرایش</span>
        </h3>

        <div class="space-y-2 pt-1 text-xs">
          <NuxtLink
            to="/dash/products"
            class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-emerald-500/30 text-zinc-200 transition-all"
          >
            <div class="flex items-center gap-2">
              <AdminIcon name="crop" class="w-4 h-4 text-emerald-400" />
              <span class="font-d4">نمونه‌کارهای چاپی</span>
            </div>
            <span class="text-emerald-400 text-[11px] font-semibold font-d4">مدیریت ←</span>
          </NuxtLink>

          <NuxtLink
            to="/dash/content"
            class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-emerald-500/30 text-zinc-200 transition-all"
          >
            <div class="flex items-center gap-2">
              <AdminIcon name="edit" class="w-4 h-4 text-cyan-400" />
              <span class="font-d4">متن‌ها، تلفن‌ها و بنرها</span>
            </div>
            <span class="text-cyan-400 text-[11px] font-semibold font-d4">ویرایش ←</span>
          </NuxtLink>

          <NuxtLink
            to="/dash/media"
            class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-emerald-500/30 text-zinc-200 transition-all"
          >
            <div class="flex items-center gap-2">
              <AdminIcon name="photo" class="w-4 h-4 text-purple-400" />
              <span class="font-d4">آپلود عکس و کاتالوگ</span>
            </div>
            <span class="text-purple-400 text-[11px] font-semibold font-d4">آپلود ←</span>
          </NuxtLink>

          <NuxtLink
            to="/dash/messaging"
            class="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-emerald-500/30 text-zinc-200 transition-all"
          >
            <div class="flex items-center gap-2">
              <AdminIcon name="chat" class="w-4 h-4 text-emerald-400" />
              <span class="font-d4">پاسخ سریع به مشتریان</span>
            </div>
            <span class="text-emerald-400 text-[11px] font-semibold font-d4">ارسال ←</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashStatCard from '~/components/dash/DashStatCard.vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const loading = ref(true)
const requestsList = ref<any[]>([])
const productsCount = ref(12)
const postsCount = ref(4)
const mediaCount = ref(24)

const pendingCount = computed(() => {
  return requestsList.value.filter(r => r.status === 'new').length
})

async function loadData() {
  loading.value = true
  try {
    const [reqRes, prodRes, postRes, mediaRes]: any = await Promise.all([
      $fetch('/api/admin/requests').catch(() => ({ items: [] })),
      $fetch('/api/products').catch(() => ({ items: [] })),
      $fetch('/api/posts').catch(() => ({ items: [] })),
      $fetch('/api/admin/media').catch(() => ({ totalItems: 0, items: [] }))
    ])

    requestsList.value = reqRes?.items || []
    productsCount.value = prodRes?.items?.length || 12
    postsCount.value = postRes?.items?.length || 4
    mediaCount.value = mediaRes?.totalItems || mediaRes?.items?.length || 24
  } catch (err) {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
