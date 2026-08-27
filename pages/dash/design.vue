<!-- pages/dash/design.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4">رنگ‌ها و ظاهر سایت</h2>
        <p class="text-xs text-zinc-400">تنظیم رنگ سازمانی سبز نجم و رنگ پس‌زمینه صفحات</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="resetColors"
          class="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
        >
          پیش‌فرض
        </button>
        <button
          type="button"
          @click="saveTheme"
          class="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all font-d4 cursor-pointer"
        >
          <AdminIcon name="save" class="w-3.5 h-3.5" />
          <span>ذخیره رنگ‌ها</span>
        </button>
      </div>
    </div>

    <!-- Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left (6 Cols): Color Controls -->
      <div class="lg:col-span-6 rounded-2xl bg-zinc-900/80 border border-white/10 p-5 space-y-4">
        <h3 class="text-sm font-bold text-white font-d4 border-b border-white/10 pb-3">
          انتخاب رنگ‌ها
        </h3>

        <div class="space-y-3 text-xs">
          <!-- Brand Green -->
          <div class="p-3.5 rounded-xl bg-zinc-950 border border-white/5 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-zinc-200 font-d4">سبز اصلی نجم (دکمه‌ها و المان‌ها)</span>
              <input
                v-model="colors.najmGreen"
                type="color"
                class="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>
            <input
              v-model="colors.najmGreen"
              type="text"
              class="w-full h-8 px-3 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-white"
            />
          </div>

          <!-- Page Background -->
          <div class="p-3.5 rounded-xl bg-zinc-950 border border-white/5 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-zinc-200 font-d4">پس‌زمینه صفحات (Najm Back)</span>
              <input
                v-model="colors.najmBack"
                type="color"
                class="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>
            <input
              v-model="colors.najmBack"
              type="text"
              class="w-full h-8 px-3 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-white"
            />
          </div>
        </div>
      </div>

      <!-- Right (6 Cols): Live Card Preview -->
      <div class="lg:col-span-6 rounded-2xl bg-zinc-900/80 border border-white/10 p-5 space-y-4">
        <h3 class="text-sm font-bold text-white font-d4 border-b border-white/10 pb-3">
          پیش‌نمایش زنده در سایت
        </h3>

        <div
          class="rounded-2xl p-5 space-y-3.5 border transition-all"
          :style="{ backgroundColor: colors.najmBack, borderColor: `${colors.najmGreen}30` }"
        >
          <div class="space-y-1">
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :style="{ backgroundColor: `${colors.najmGreen}15`, color: colors.najmGreen }"
            >
              هاردباکس لوکس
            </span>
            <h4 class="text-sm font-bold font-d4 text-zinc-900">جعبه مگنتی صادراتی زعفران</h4>
            <p class="text-xs text-zinc-600 leading-relaxed">
              تولید شده با مقوای کرجی با روکش گالینگور و طلاکوب مات.
            </p>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all font-d4 cursor-pointer"
              :style="{ backgroundColor: colors.najmGreen }"
            >
              سفارش مشاوره
            </button>

            <button
              type="button"
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
              :style="{ borderColor: `${colors.najmGreen}40`, color: colors.najmGreen }"
            >
              مشاهده کاتالوگ
            </button>
          </div>
        </div>
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

const defaultColors = {
  najmGreen: '#014439',
  najmBack: '#FBFBFB'
}

const colors = reactive({ ...defaultColors })

function resetColors() {
  Object.assign(colors, defaultColors)
}

function saveTheme() {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--najm-green', colors.najmGreen)
    document.documentElement.style.setProperty('--najm-back', colors.najmBack)
  }
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'رنگ‌ها اعمال شدند.' } }))
}
</script>
