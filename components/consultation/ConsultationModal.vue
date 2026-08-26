<template>
  <Teleport to="body">
    <Transition name="consultation-fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md"
        @click.self="closeModal"
      >
        <Transition name="consultation-pop">
          <div
            v-if="isModalOpen"
            :dir="isRTL ? 'rtl' : 'ltr'"
            class="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-white/20 overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            <!-- Top Header Bar -->
            <div class="relative bg-najmgreen text-white p-6 sm:p-8 pb-7 flex flex-col justify-between shrink-0">
              <!-- Close Button -->
              <button
                @click="closeModal"
                class="absolute top-4 left-4 sm:top-6 sm:left-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Close"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>

              <div class="space-y-2 max-w-lg text-start">
                <span class="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 text-emerald-100 border border-white/20">
                  {{ ui?.badge || 'مشاوره تخصصی و مهندسی بسته‌بندی' }}
                </span>
                <h2 class="text-xl sm:text-2xl font-extrabold text-d4 leading-tight">
                  {{ ui?.title || 'مشاوره رایگان و استعلام هوشمند پروژه' }}
                </h2>
                <p class="text-xs text-emerald-100/90 leading-relaxed">
                  {{ ui?.subtitle || 'طراحی ساختار، انتخاب مقوا و محاسبه دقیق هزینه فرم‌های چاپی با همراهی مهندسان ارشد چاپ نجم.' }}
                </p>
              </div>

              <!-- Mini Trust Pills -->
              <div class="grid grid-cols-3 gap-2 pt-4 border-t border-white/15 mt-3 text-center">
                <div v-for="(b, idx) in trustBadges" :key="idx" class="bg-white/10 rounded-xl p-1.5 sm:p-2 flex flex-col items-center">
                  <Icon :name="b.icon" class="w-4 h-4 text-emerald-200 mb-0.5" />
                  <span class="text-[10px] sm:text-xs font-bold leading-tight">{{ b.title }}</span>
                </div>
              </div>
            </div>

            <!-- Scrollable Body Container -->
            <div class="p-5 sm:p-8 overflow-y-auto space-y-6">
              <!-- Success State -->
              <div v-if="submitted" class="text-center py-10 space-y-4">
                <div class="w-16 h-16 bg-emerald-100 text-najmgreen rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Icon name="mdi:check-bold" class="w-8 h-8" />
                </div>
                <h3 class="text-xl font-extrabold text-gray-900 text-d4">
                  {{ ui?.form?.successTitle || 'درخواست شما با موفقیت ثبت شد!' }}
                </h3>
                <p class="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  {{ ui?.form?.successDesc || 'مهندسان فنی چاپ نجم در زمان انتخابی با شما تماس خواهند گرفت.' }}
                </p>
                <div class="pt-4">
                  <button
                    @click="resetAndClose"
                    class="px-8 py-3 rounded-2xl bg-najmgreen text-white text-xs font-bold shadow-xs hover:bg-emerald-800 transition cursor-pointer"
                  >
                    بستن پنجره
                  </button>
                </div>
              </div>

              <!-- Multi-Step Interactive Form -->
              <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                <!-- 1. Category Selection -->
                <div class="space-y-2.5 text-start">
                  <label class="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span class="w-5 h-5 rounded-full bg-najmgreen text-white text-[10px] flex items-center justify-center font-mono">۱</span>
                    <span>{{ ui?.steps?.step1Title || 'انتخاب نوع محصول و ساختار' }}</span>
                  </label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div
                      v-for="cat in categoriesList"
                      :key="cat.id"
                      @click="selectedCategory = cat.id"
                      class="p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between text-start"
                      :class="[
                        selectedCategory === cat.id
                          ? 'border-najmgreen bg-emerald-50/70 ring-1 ring-najmgreen'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      ]"
                    >
                      <div>
                        <div class="text-xs sm:text-sm font-bold text-gray-900">{{ cat.title }}</div>
                        <div class="text-[11px] text-gray-500">{{ cat.desc }}</div>
                      </div>
                      <div
                        class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                        :class="selectedCategory === cat.id ? 'bg-najmgreen border-najmgreen text-white' : 'border-gray-300'"
                      >
                        <Icon v-if="selectedCategory === cat.id" name="mdi:check" class="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 2. Target Quantity & Time Slot -->
                <div class="space-y-2.5 text-start">
                  <label class="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span class="w-5 h-5 rounded-full bg-najmgreen text-white text-[10px] flex items-center justify-center font-mono">۲</span>
                    <span>{{ ui?.steps?.step2Title || 'تیراژ و زمان مناسب تماس' }}</span>
                  </label>
                  <!-- Quantity Pills -->
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="qty in quantitiesList"
                      :key="qty"
                      type="button"
                      @click="selectedQuantity = qty"
                      class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      :class="[
                        selectedQuantity === qty
                          ? 'bg-najmgreen text-white shadow-xs'
                          : 'bg-najmback text-gray-700 hover:bg-gray-200 border border-gray-200'
                      ]"
                    >
                      {{ qty }}
                    </button>
                  </div>

                  <!-- Time Slot Pills -->
                  <div class="pt-2 flex flex-wrap gap-2">
                    <button
                      v-for="time in timeSlotsList"
                      :key="time"
                      type="button"
                      @click="selectedTimeSlot = time"
                      class="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                      :class="[
                        selectedTimeSlot === time
                          ? 'bg-neutral-800 text-white shadow-xs'
                          : 'bg-najmback text-gray-600 hover:bg-gray-200 border border-gray-200'
                      ]"
                    >
                      <Icon name="mdi:clock-outline" class="inline w-3 h-3 ml-1" />
                      {{ time }}
                    </button>
                  </div>
                </div>

                <!-- 3. Contact Inputs -->
                <div class="space-y-3.5 text-start">
                  <label class="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span class="w-5 h-5 rounded-full bg-najmgreen text-white text-[10px] flex items-center justify-center font-mono">۳</span>
                    <span>{{ ui?.steps?.step3Title || 'مشخصات تماس و جزئیات پروژه' }}</span>
                  </label>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        v-model="form.name"
                        required
                        type="text"
                        :placeholder="ui?.form?.nameLabel || 'نام و نام خانوادگی *'"
                        class="w-full px-4 py-3 rounded-2xl bg-najmback border border-gray-200 text-base sm:text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <input
                        v-model="form.phone"
                        required
                        type="tel"
                        inputmode="tel"
                        placeholder="شماره همراه (۰۹۱۲...) *"
                        class="w-full px-4 py-3 rounded-2xl bg-najmback border border-gray-200 text-base sm:text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition ltr text-right font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      v-model="form.company"
                      type="text"
                      :placeholder="ui?.form?.companyLabel || 'نام برند یا شرکت'"
                      class="w-full px-4 py-3 rounded-2xl bg-najmback border border-gray-200 text-base sm:text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
                    />
                  </div>

                  <!-- Free Prototype Mockup Checkbox -->
                  <label class="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      v-model="form.mockupRequested"
                      class="w-4 h-4 rounded text-najmgreen focus:ring-najmgreen cursor-pointer"
                    />
                    <span class="text-xs text-gray-800 font-semibold">
                      {{ ui?.form?.mockupCheck || 'مایلم ماکت سه‌بعدی و نمونه اولیه فیزیکی (Mockup) دریافت کنم' }}
                    </span>
                  </label>
                </div>

                <!-- Submit Button -->
                <div class="pt-2">
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="w-full py-4 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-d4"
                  >
                    <Icon v-if="isSubmitting" name="mdi:loading" class="w-5 h-5 animate-spin" />
                    <span>{{ isSubmitting ? (ui?.form?.submitting || 'در حال ارسال...') : (ui?.form?.submitBtn || 'ثبت درخواست مشاوره رایگان') }}</span>
                    <Icon v-if="!isSubmitting" name="mdi:arrow-left" class="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useConsultation } from '~/composables/useConsultation'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useLocale } from '~/composables/useLocale'

const { isModalOpen, selectedCategory, selectedQuantity, selectedTimeSlot, closeModal, submitRequest } = useConsultation()
const { ui } = usePageUI('consultation')
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const form = reactive({
  name: '',
  phone: '',
  company: '',
  mockupRequested: true,
  description: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)

const trustBadges = computed(() => ui.value?.trustBadges || [
  { icon: 'mdi:clock-fast', title: 'پاسخگویی کمتر از ۲ ساعت' },
  { icon: 'mdi:package-variant-closed-check', title: 'ماکت فیزیکی رایگان' },
  { icon: 'mdi:shield-check-outline', title: 'تضمین انطباق ۹۹.۸٪' }
])

const categoriesList = computed(() => ui.value?.categories || [
  { id: 'folding-carton', title: 'جعبه مقوایی و ایندربرد', desc: 'دارویی، آرایشی، فودگرید' },
  { id: 'hardbox', title: 'هاردباکس و جعبه لوکس', desc: 'مگنتی، کشویی، صادراتی' },
  { id: 'commercial', title: 'کاتالوگ و ساک دستی', desc: 'بروشور، اوراق تجاری' },
  { id: 'label-special', title: 'لیبل و خدمات تکمیلی', desc: 'سلفون مخملی، طلاکوب' }
])

const quantitiesList = computed(() => ui.value?.quantities || [
  '۵۰۰ عدد', '۱,۰۰۰ عدد', '۲,۵۰۰ عدد', '۵,۰۰۰ عدد', '۱۰,۰۰۰ عدد', '+۲۵,۰۰۰ عدد'
])

const timeSlotsList = computed(() => ui.value?.timeSlots || [
  'صبح (۹:۰۰ الی ۱۲:۰۰)', 'ظهر (۱۲:۰۰ الی ۱۵:۰۰)', 'عصر (۱۵:۰۰ الی ۱۸:۰۰)'
])

async function handleSubmit() {
  isSubmitting.value = true
  await submitRequest({
    ...form,
    category: selectedCategory.value,
    quantity: selectedQuantity.value,
    timeSlot: selectedTimeSlot.value
  })
  isSubmitting.value = false
  submitted.value = true
}

function resetAndClose() {
  submitted.value = false
  form.name = ''
  form.phone = ''
  form.company = ''
  closeModal()
}
</script>

<style scoped>
.consultation-fade-enter-active,
.consultation-fade-leave-active {
  transition: opacity 0.25s ease;
}
.consultation-fade-enter-from,
.consultation-fade-leave-to {
  opacity: 0;
}

.consultation-pop-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.consultation-pop-leave-active {
  transition: all 0.2s ease-in;
}
.consultation-pop-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(12px);
}
.consultation-pop-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
</style>
