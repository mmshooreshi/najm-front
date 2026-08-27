<!-- pages/dash/settings.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4">تنظیمات تماس و آدرس</h2>
        <p class="text-xs text-zinc-400">تلفن‌های دفتر فروش، شماره واتس‌اپ و نشانی کارخانه</p>
      </div>

      <button
        type="button"
        @click="saveSettings"
        class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all font-d4 cursor-pointer self-start"
      >
        <AdminIcon name="save" class="w-3.5 h-3.5" />
        <span>ذخیره تنظیمات</span>
      </button>
    </div>

    <!-- Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7 rounded-2xl bg-zinc-900/80 border border-white/10 p-5 space-y-4">
        <h3 class="text-sm font-bold text-white font-d4 border-b border-white/10 pb-3">
          اطلاعات تماس مجتمع
        </h3>

        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-zinc-300">تلفن دفتر فروش:</label>
              <input
                v-model="settings.phone"
                type="text"
                class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                dir="ltr"
              />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-zinc-300">شماره واتس‌اپ:</label>
              <input
                v-model="settings.whatsapp"
                type="text"
                class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300">ایمیل:</label>
            <input
              v-model="settings.email"
              type="email"
              class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
              dir="ltr"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300">نشانی کارخانه:</label>
            <textarea
              v-model="settings.address"
              rows="3"
              class="w-full p-2.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white leading-relaxed"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Right (5 Cols): Backup -->
      <div class="lg:col-span-5 rounded-2xl bg-zinc-900/80 border border-white/10 p-5 space-y-3">
        <h3 class="text-sm font-bold text-white font-d4">
          پشتیبان‌گیری از داده‌ها
        </h3>
        <p class="text-xs text-zinc-400 leading-relaxed">
          دریافت فایل JSON از تمام متن‌ها و تنظیمات ویرایش شده سایت.
        </p>

        <button
          type="button"
          @click="exportBackup"
          class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <AdminIcon name="download" class="w-3.5 h-3.5" />
          <span>دانلود فایل پشتیبان</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const settings = reactive({
  phone: '021-88997766',
  whatsapp: '09120001122',
  email: 'info@najmpack.ir',
  address: 'تهران، جاده مخصوص کرج، کیلومتر ۱۴، شهرک صنعتی، مجتمع چاپ و بسته‌بندی نجم'
})

function saveSettings() {
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'تنظیمات ذخیره شد.' } }))
}

function exportBackup() {
  const data = JSON.stringify(settings, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `najm-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
