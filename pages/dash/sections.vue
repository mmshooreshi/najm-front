<!-- pages/dash/sections.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4">سوالات متداول (FAQ)</h2>
        <p class="text-xs text-zinc-400">افزودن و ویرایش پرسش‌ها و پاسخ‌های پرتکرار مشتریان</p>
      </div>

      <button
        type="button"
        @click="openAddModal"
        class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all font-d4 cursor-pointer self-start"
      >
        <AdminIcon name="plus" class="w-4 h-4" />
        <span>افزودن پرسش جدید</span>
      </button>
    </div>

    <!-- FAQs List -->
    <div class="space-y-2.5">
      <div
        v-for="(faq, idx) in faqs"
        :key="faq.id"
        class="rounded-2xl bg-zinc-900/80 border border-white/10 p-4 space-y-2 hover:border-emerald-500/30 transition-all"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center">
              {{ idx + 1 }}
            </span>
            <h4 class="text-xs sm:text-sm font-bold text-white font-d4">{{ faq.question }}</h4>
          </div>

          <div class="flex items-center gap-1">
            <button
              type="button"
              @click="editFaq(faq)"
              class="p-1 text-zinc-400 hover:text-emerald-400 cursor-pointer"
            >
              <AdminIcon name="edit" class="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              @click="deleteFaq(faq.id)"
              class="p-1 text-zinc-400 hover:text-rose-400 cursor-pointer"
            >
              <AdminIcon name="trash" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p class="text-xs text-zinc-300 leading-relaxed pr-7">
          {{ faq.answer }}
        </p>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      @click.self="modalOpen = false"
    >
      <div class="w-full max-w-lg rounded-2xl bg-zinc-900 border border-white/15 p-5 shadow-2xl space-y-4 text-white">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 class="text-sm font-bold font-d4">{{ editingId ? 'ویرایش پرسش' : 'افزودن پرسش جدید' }}</h3>
          <button @click="modalOpen = false" class="text-zinc-400 hover:text-white p-1">
            <AdminIcon name="x" class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-zinc-300">متن پرسش:</label>
            <input
              v-model="form.question"
              type="text"
              placeholder="مثال: حداقل تیراژ برای سفارش جعبه مقوایی چقدر است؟"
              class="w-full h-9 px-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300">متن پاسخ:</label>
            <textarea
              v-model="form.answer"
              rows="4"
              placeholder="توضیحات پاسخ..."
              class="w-full p-2.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white leading-relaxed focus:border-emerald-500 focus:outline-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            type="button"
            @click="saveFaq"
            class="px-4 py-2 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white font-bold text-xs shadow-xs font-d4 cursor-pointer"
          >
            ذخیره پرسش
          </button>
          <button
            type="button"
            @click="modalOpen = false"
            class="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const modalOpen = ref(false)
const editingId = ref<string | null>(null)

const faqs = ref([
  { id: '1', question: 'حداقل تیراژ سفارش کارتن و جعبه در مجتمع نجم چقدر است؟', answer: 'حداقل تیراژ اقتصادی برای چاپ افست و جعبه‌سازی ۵,۰۰۰ عدد می‌باشد؛ اما برای موارد اختصاصی مشاوره ارائه می‌گردد.' },
  { id: '2', question: 'آیا امکان طراحی و ساخت ماکت ۳D قبل از تولید انبوه وجود دارد؟', answer: 'بله، تیم مهندسی بسته‌بندی ما قبل از شروع تولید، نمونه ماکت ابعادی دقیق و موکاپ سه‌بعدی را در اختیارتان قرار می‌دهد.' },
  { id: '3', question: 'زمان تحویل سفارشات اختصاصی معمولاً چند روز کاری است؟', answer: 'بسته به نوع پوشش (طلاکوب، یووی، لمینت) بین ۷ الی ۱۵ روز کاری پس از تایید نهایی طرح و ساخت قالب.' }
])

const form = reactive({
  question: '',
  answer: ''
})

function openAddModal() {
  editingId.value = null
  form.question = ''
  form.answer = ''
  modalOpen.value = true
}

function editFaq(faq: any) {
  editingId.value = faq.id
  form.question = faq.question
  form.answer = faq.answer
  modalOpen.value = true
}

function saveFaq() {
  if (!form.question) return
  if (editingId.value) {
    const idx = faqs.value.findIndex(f => f.id === editingId.value)
    if (idx !== -1) faqs.value[idx] = { ...faqs.value[idx], ...form }
  } else {
    faqs.value.push({ id: String(Date.now()), ...form })
  }
  modalOpen.value = false
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'پرسش ذخیره شد.' } }))
}

function deleteFaq(id: string) {
  faqs.value = faqs.value.filter(f => f.id !== id)
}
</script>
