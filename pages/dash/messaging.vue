<!-- pages/dash/messaging.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4">ارسال پیام و پیش‌فاکتور در واتس‌اپ</h2>
        <p class="text-xs text-zinc-400">قالب‌های آماده برای ارسال سریع پیش‌فاکتور، تایید ماکت ۳D و اعلام تحویل سفارش به مشتریان</p>
      </div>
    </div>

    <!-- Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left (5 Cols): Templates -->
      <div class="lg:col-span-5 rounded-2xl bg-zinc-900/80 border border-white/10 p-4 space-y-2.5">
        <span class="text-xs font-bold text-zinc-400 font-d4">انتخاب متن آماده:</span>

        <div class="space-y-2">
          <button
            v-for="tpl in templates"
            :key="tpl.id"
            type="button"
            @click="selectTemplate(tpl)"
            class="w-full p-3 rounded-xl text-right transition-all cursor-pointer space-y-1 border"
            :class="selectedTemplateId === tpl.id
              ? 'bg-najmgreen text-white border-emerald-500/50 font-bold shadow-xs'
              : 'bg-zinc-950 border-white/5 text-zinc-300 hover:text-white'"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-d4">{{ tpl.title }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10">{{ tpl.tag }}</span>
            </div>
            <p class="text-[11px] opacity-80 line-clamp-2 leading-relaxed font-normal">
              {{ tpl.text }}
            </p>
          </button>
        </div>
      </div>

      <!-- Right (7 Cols): Sender -->
      <div class="lg:col-span-7 rounded-2xl bg-zinc-900/80 border border-white/10 p-5 space-y-4">
        <h3 class="text-sm font-bold text-white font-d4 flex items-center gap-2 border-b border-white/10 pb-3">
          <AdminIcon name="chat" class="w-4 h-4 text-emerald-400" />
          <span>تنظیم پیام و ارسال</span>
        </h3>

        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-zinc-300">نام مشتری:</label>
              <input
                v-model="customerName"
                type="text"
                placeholder="مثال: آقای مهندس حسینی"
                class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-zinc-300">شماره موبایل:</label>
              <input
                v-model="customerPhone"
                type="text"
                placeholder="09123456789"
                class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300">متن پیام:</label>
            <textarea
              v-model="messageBody"
              rows="6"
              class="w-full p-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white leading-relaxed focus:border-emerald-500 focus:outline-none"
            ></textarea>
          </div>

          <div class="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              @click="openWhatsApp"
              :disabled="!cleanPhone"
              class="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer font-d4 disabled:opacity-40"
            >
              <AdminIcon name="chat" class="w-4 h-4" />
              <span>ارسال در واتس‌اپ</span>
            </button>

            <button
              type="button"
              @click="copyMessage"
              class="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <AdminIcon name="copy" class="w-3.5 h-3.5" />
              <span>کپی</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const customerName = ref('مهندس حسینی')
const customerPhone = ref('09123456789')
const selectedTemplateId = ref('quote')
const messageBody = ref('')

const templates = [
  {
    id: 'quote',
    title: 'ارسال پیش‌فاکتور چاپی',
    tag: 'فروش',
    text: 'سلام [نام] گرامی، وقت بخیر.\nپیش‌فاکتور استعلام قیمت سفارش جعبه/کارتن شما با بهترین شرایط تیراژ محاسبه و آماده گردید. لطفاً جهت هماهنگی با ما در ارتباط باشید.'
  },
  {
    id: 'mockup',
    title: 'آماده شدن ماکت ۳D و قالب',
    tag: 'طراحی',
    text: 'سلام [نام] عزیز.\nماکت ابعادی دقیق جعبه درخواستی شما توسط آتلیه طراحی چاپ نجم آماده شد. جهت بررسی خطوط تا و برش با شما هماهنگ می‌شویم.'
  },
  {
    id: 'ready',
    title: 'آماده شدن سفارش و بارگیری',
    tag: 'تحویل',
    text: 'سلام [نام] عزیز.\nسفارش بسته‌بندی شما تولید و در انبار مجتمع چاپ نجم آماده بارگیری می‌باشد.'
  }
]

selectTemplate(templates[0])

function selectTemplate(tpl: any) {
  selectedTemplateId.value = tpl.id
  messageBody.value = tpl.text.replace(/\[نام\]/g, customerName.value || 'مشتری')
}

const cleanPhone = computed(() => {
  const p = (customerPhone.value || '').trim()
  if (!p) return ''
  return p.replace(/^0/, '98')
})

function openWhatsApp() {
  if (!cleanPhone.value) return
  const url = `https://wa.me/${cleanPhone.value}?text=${encodeURIComponent(messageBody.value)}`
  window.open(url, '_blank')
}

function copyMessage() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(messageBody.value)
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'متن کپی شد.' } }))
  }
}
</script>
