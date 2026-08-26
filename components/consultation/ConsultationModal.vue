<!-- components/consultation/ConsultationModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="consultation-fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-md"
        @click.self="closeModal"
      >
        <Transition name="consultation-pop">
          <div
            v-if="isModalOpen"
            :dir="isRTL ? 'rtl' : 'ltr'"
            class="relative w-full max-w-xl bg-white rounded-3xl sm:rounded-[28px] shadow-2xl border border-white/20 overflow-hidden my-auto max-h-[95vh] flex flex-col"
          >
            <!-- Sleek Top Header Bar -->
            <div class="relative bg-najmgreen text-white px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between shrink-0">
              <div class="space-y-0.5 text-start pr-2">
                <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-emerald-100 border border-white/20">
                  {{ ui?.badge || 'مشاوره مهندسی بسته‌بندی' }}
                </span>
                <h2 class="text-base sm:text-lg font-bold text-d4 leading-snug">
                  {{ ui?.title || 'مشاوره رایگان و استعلام هوشمند' }}
                </h2>
              </div>

              <!-- Close Button -->
              <button
                @click="closeModal"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
                aria-label="Close"
              >
                <Icon name="mdi:close" class="w-4 h-4" />
              </button>
            </div>

            <!-- Content Area -->
            <div class="p-4 sm:p-6 overflow-y-auto space-y-4">
              <!-- Success State -->
              <div v-if="submitted" class="text-center py-8 space-y-3">
                <div class="w-14 h-14 bg-emerald-100 text-najmgreen rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Icon name="mdi:check-bold" class="w-7 h-7" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 text-d4">
                  {{ ui?.form?.successTitle || 'درخواست شما با موفقیت ثبت شد!' }}
                </h3>
                <p class="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                  {{ ui?.form?.successDesc || 'مهندسان فنی چاپ نجم در بازه زمانی انتخابی با شما تماس خواهند گرفت.' }}
                </p>
                <div class="pt-2">
                  <button
                    @click="resetAndClose"
                    class="px-7 py-2.5 rounded-2xl bg-najmgreen text-white text-xs font-bold shadow-xs hover:bg-emerald-800 transition cursor-pointer"
                  >
                    بستن پنجره
                  </button>
                </div>
              </div>

              <!-- Compact Wizard Flow -->
              <div v-else class="space-y-4">
                <!-- Step Indicator -->
                <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div class="flex items-center gap-2">
                    <div
                      v-for="s in [1, 2, 3]"
                      :key="s"
                      @click="canJumpToStep(s) && (currentStep = s)"
                      class="flex items-center gap-1.5 cursor-pointer text-xs transition-colors"
                      :class="[
                        currentStep === s
                          ? 'text-najmgreen font-bold'
                          : currentStep > s
                            ? 'text-gray-700'
                            : 'text-gray-400 opacity-60'
                      ]"
                    >
                      <span
                        class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono"
                        :class="[
                          currentStep === s
                            ? 'bg-najmgreen text-white shadow-2xs'
                            : currentStep > s
                              ? 'bg-emerald-100 text-najmgreen'
                              : 'bg-gray-100 text-gray-500'
                        ]"
                      >
                        <Icon v-if="currentStep > s" name="mdi:check" class="w-3 h-3" />
                        <span v-else>{{ s }}</span>
                      </span>
                      <span class="text-[11px] hidden sm:inline">
                        {{ s === 1 ? 'محصول' : s === 2 ? 'تیراژ' : 'تماس' }}
                      </span>
                    </div>
                  </div>

                  <span class="text-[11px] text-gray-500 font-medium font-mono">
                    {{ currentStep }} / ۳
                  </span>
                </div>

                <!-- Step 1: Product Category -->
                <div v-if="currentStep === 1" class="space-y-2.5 text-start">
                  <label class="text-xs font-bold text-gray-800">
                    ۱. نوع محصول یا بسته‌بندی را انتخاب کنید:
                  </label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div
                      v-for="cat in categoriesList"
                      :key="cat.id"
                      @click="selectCategoryAndAdvance(cat.id)"
                      class="p-3 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between text-start"
                      :class="[
                        selectedCategory === cat.id
                          ? 'border-najmgreen bg-emerald-50/70 ring-1 ring-najmgreen'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      ]"
                    >
                      <div class="space-y-0.5">
                        <div class="text-xs font-bold text-gray-900">{{ cat.title }}</div>
                        <div class="text-[10px] text-gray-500">{{ cat.desc }}</div>
                      </div>
                      <div
                        class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                        :class="selectedCategory === cat.id ? 'bg-najmgreen border-najmgreen text-white' : 'border-gray-300'"
                      >
                        <Icon v-if="selectedCategory === cat.id" name="mdi:check" class="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Quantity & Preferred Call Time -->
                <div v-if="currentStep === 2" class="space-y-3.5 text-start">
                  <!-- Quantities -->
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-gray-800">
                      ۲. تیراژ تقریبی مدنظر:
                    </label>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="qty in quantitiesList"
                        :key="qty"
                        type="button"
                        @click="selectedQuantity = qty"
                        class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        :class="[
                          selectedQuantity === qty
                            ? 'bg-najmgreen text-white shadow-2xs'
                            : 'bg-najmback text-gray-700 hover:bg-gray-200 border border-gray-200/80'
                        ]"
                      >
                        {{ qty }}
                      </button>
                    </div>
                  </div>

                  <!-- Time Slots -->
                  <div class="space-y-1.5 pt-1 border-t border-gray-100">
                    <label class="block text-xs font-bold text-gray-800">
                      زمان مناسب برای تماس کارشناس فنی:
                    </label>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="time in timeSlotsList"
                        :key="time"
                        type="button"
                        @click="selectedTimeSlot = time"
                        class="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        :class="[
                          selectedTimeSlot === time
                            ? '!bg-neutral-800 text-white shadow-2xs'
                            : 'bg-najmback text-gray-600 hover:bg-gray-200 border border-gray-200/80'
                        ]"
                      >
                        <Icon name="mdi:clock-outline" class="w-3 h-3" />
                        <span>{{ time }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Free Mockup Checkbox -->
                  <label class="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      v-model="form.mockupRequested"
                      class="w-3.5 h-3.5 rounded text-najmgreen focus:ring-najmgreen cursor-pointer"
                    />
                    <span class="text-xs text-gray-900 font-bold">
                      مایلم ماکت فیزیکی و نمونه اولیه سه‌بعدی دریافت کنم
                    </span>
                  </label>
                </div>

                <!-- Step 3: Contact & Smart Phone Input -->
                <div v-if="currentStep === 3" class="space-y-3 text-start">
                  <label class="block text-xs font-bold text-gray-800">
                    ۳. اطلاعات تماس جهت ثبت استعلام:
                  </label>

                  <div class="space-y-2.5">
                    <div>
                      <label class="block text-[11px] font-bold text-gray-700 mb-1">
                        نام و نام خانوادگی
                        <span class="text-rose-500 mr-0.5">*</span>
                      </label>
                      <input
                        v-model="form.name"
                        required
                        type="text"
                        placeholder="مثال: علی رضایی"
                        class="w-full px-3 py-2.5 rounded-2xl bg-najmback/60 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition"
                      />
                    </div>

                    <!-- Smart Phone Input -->
                    <div>
                      <SmartPhoneInput
                        v-model="form.phone"
                        label="شماره موبایل همراه"
                        required
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        @valid="isPhoneValid = $event"
                      />
                    </div>

                    <div>
                      <label class="block text-[11px] font-bold text-gray-700 mb-1">نام برند یا شرکت (اختیاری)</label>
                      <input
                        v-model="form.company"
                        type="text"
                        placeholder="نام سازمان یا برند تجاری"
                        class="w-full px-3 py-2.5 rounded-2xl bg-najmback/60 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <!-- Wizard Actions -->
                <div class="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    v-if="currentStep > 1"
                    type="button"
                    @click="currentStep--"
                    class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
                  >
                    مرحله قبل
                  </button>
                  <div v-else class="text-[11px] text-gray-400">
                    مشاوره تخصصی رایگان
                  </div>

                  <button
                    v-if="currentStep < 3"
                    type="button"
                    @click="currentStep++"
                    class="px-5 py-2 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>مرحله بعد</span>
                    <Icon name="mdi:arrow-left" class="w-3.5 h-3.5" />
                  </button>

                  <button
                    v-else
                    type="button"
                    @click="handleSubmit"
                    :disabled="isSubmitting || !form.name || !form.phone"
                    class="px-6 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 text-d4"
                  >
                    <Icon v-if="isSubmitting" name="mdi:loading" class="w-3.5 h-3.5 animate-spin" />
                    <span>{{ isSubmitting ? 'در حال ارسال...' : 'ثبت درخواست استعلام' }}</span>
                    <Icon v-if="!isSubmitting" name="mdi:check" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useLocale } from '~/composables/useLocale'
import { useConsultation } from '~/composables/useConsultation'
import SmartPhoneInput from '~/components/common/SmartPhoneInput.vue'

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const { ui } = usePageUI('consultation')
const {
  isModalOpen,
  selectedCategory,
  selectedQuantity,
  selectedTimeSlot,
  closeModal,
  submitRequest
} = useConsultation()

const currentStep = ref(1)
const isSubmitting = ref(false)
const submitted = ref(false)
const isPhoneValid = ref(false)

const form = reactive({
  name: '',
  phone: '',
  company: '',
  mockupRequested: true
})

const defaultCategories = [
  { id: 'folding-carton', title: 'جعبه مقوایی و ایندربرد', desc: 'دارویی، آرایشی، فودگرید' },
  { id: 'hardbox', title: 'هاردباکس و جعبه لوکس', desc: 'مگنتی، کشویی، زعفران و صادراتی' },
  { id: 'commercial', title: 'کاتالوگ، ساک و ست اداری', desc: 'بروشور، اوراق تجاری، ساک دستی' },
  { id: 'label-special', title: 'لیبل و بسته‌بندی خاص', desc: 'سلفون مخملی، طلاکوب، متالایز' }
]

const categoriesList = computed(() => ui.value?.categories || defaultCategories)
const quantitiesList = computed(() => ui.value?.quantities || ['۵۰۰ عدد', '۱,۰۰۰ عدد', '۲,۵۰۰ عدد', '۵,۰۰۰ عدد', '۱۰,۰۰۰ عدد', '+۲۵,۰۰۰ عدد'])
const timeSlotsList = computed(() => ui.value?.timeSlots || ['صبح (۹:۰۰ الی ۱۲:۰۰)', 'ظهر (۱۲:۰۰ الی ۱۵:۰۰)', 'عصر (۱۵:۰۰ الی ۱۸:۰۰)'])

function selectCategoryAndAdvance(id: string) {
  selectedCategory.value = id
}

function canJumpToStep(step: number): boolean {
  if (step === 1) return true
  if (step === 2) return Boolean(selectedCategory.value)
  if (step === 3) return Boolean(selectedCategory.value && selectedQuantity.value)
  return false
}

async function handleSubmit() {
  if (!form.name || !form.phone) {
    currentStep.value = 3
    return
  }

  isSubmitting.value = true
  try {
    await submitRequest({
      category: selectedCategory.value,
      quantity: selectedQuantity.value,
      timeSlot: selectedTimeSlot.value,
      name: form.name,
      phone: form.phone,
      company: form.company,
      mockupRequested: form.mockupRequested,
      createdAt: new Date().toISOString()
    })
    submitted.value = true
  } finally {
    isSubmitting.value = false
  }
}

function resetAndClose() {
  submitted.value = false
  currentStep.value = 1
  form.name = ''
  form.phone = ''
  form.company = ''
  form.mockupRequested = true
  closeModal()
}

watch(isModalOpen, (isOpen) => {
  if (isOpen) {
    submitted.value = false
    currentStep.value = 1
  }
})
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

.consultation-pop-enter-active,
.consultation-pop-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.consultation-pop-enter-from,
.consultation-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}
</style>
