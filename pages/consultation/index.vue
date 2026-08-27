<!-- pages/consultation/index.vue -->
<template>
  <div class="consultation-page min-h-screen bg-[#F8F9FA] pt-20 sm:pt-24 pb-16 px-3.5 sm:px-6 lg:px-8" :dir="isRTL ? 'rtl' : 'ltr'">
    <div class="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <!-- Compact Header & Title -->
      <div class="text-center space-y-2.5 max-w-2xl mx-auto">
        <span
          class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-najmgreen border border-emerald-200 shadow-2xs break-words"
          v-editable="'badge'"
        >
          <Icon name="mdi:sparkles" class="w-3.5 h-3.5" />
          {{ ui?.badge || 'مشاوره تخصصی و مهندسی بسته‌بندی' }}
        </span>
        <h1
          class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 text-d4 tracking-tight leading-tight break-words"
          v-editable="'title'"
        >
          {{ ui?.title || 'مشاوره رایگان و استعلام هوشمند پروژه' }}
        </h1>
        <p
          class="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl mx-auto break-words"
          v-editable="'subtitle'"
        >
          {{ ui?.subtitle || 'طراحی ساختار، انتخاب مقوا و محاسبه دقیق هزینه فرم‌های چاپی با همراهی مهندسان ارشد چاپ نجم.' }}
        </p>
      </div>

      <!-- Interactive Multi-Step Consultation Card -->
      <div class="bg-white rounded-3xl sm:rounded-[32px] p-5 sm:p-8 shadow-sm border border-gray-200/80 max-w-3xl mx-auto">
        <!-- Success State -->
        <div v-if="submitted" class="text-center py-10 sm:py-14 space-y-4">
          <div class="w-16 h-16 bg-emerald-100 text-najmgreen rounded-full flex items-center justify-center mx-auto shadow-xs">
            <Icon name="mdi:check-bold" class="w-8 h-8" />
          </div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-gray-900 text-d4" v-editable="'form.successTitle'">
            {{ ui?.form?.successTitle || 'درخواست مشاوره شما با موفقیت ثبت شد!' }}
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed" v-editable="'form.successDesc'">
            {{ ui?.form?.successDesc || 'مهندسان فنی چاپ نجم در بازه زمانی انتخابی با شما تماس خواهند گرفت.' }}
          </p>
          <div class="pt-3">
            <button
              @click="resetForm"
              class="px-7 py-3 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              ثبت استعلام جدید
            </button>
          </div>
        </div>

        <!-- Wizard Flow -->
        <div v-else class="space-y-6">
          <!-- Step Progress Tracker -->
          <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div
              v-for="s in [1, 2, 3]"
              :key="s"
              @click="canJumpToStep(s) && (currentStep = s)"
              class="flex items-center gap-2 cursor-pointer transition-all"
              :class="[
                currentStep === s
                  ? 'text-najmgreen font-bold'
                  : currentStep > s
                    ? 'text-gray-800 font-medium'
                    : 'text-gray-400 opacity-60'
              ]"
            >
              <span
                class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors"
                :class="[
                  currentStep === s
                    ? 'bg-najmgreen text-white shadow-xs'
                    : currentStep > s
                      ? 'bg-emerald-100 text-najmgreen'
                      : 'bg-gray-100 text-gray-500'
                ]"
              >
                <Icon v-if="currentStep > s" name="mdi:check" class="w-4 h-4" />
                <span v-else>{{ s }}</span>
              </span>
              <span class="text-xs hidden sm:inline">
                {{ s === 1 ? 'نوع محصول' : s === 2 ? 'تیراژ و زمان' : 'مشخصات تماس' }}
              </span>
            </div>

            <!-- Fast Summary Badge -->
            <div class="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-najmback text-[11px] text-gray-600 font-medium border border-gray-200/60">
              <span>{{ activeCategoryTitle }}</span>
              <span>•</span>
              <span>{{ selectedQuantity }}</span>
            </div>
          </div>

          <!-- Step 1: Product Category -->
          <div v-if="currentStep === 1" class="space-y-4 text-start">
            <h3 class="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2" v-editable="'steps.step1Title'">
              {{ ui?.steps?.step1Title || '۱. نوع محصول یا ساختار بسته‌بندی مدنظر را انتخاب کنید:' }}
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="(cat, idx) in categoriesList"
                :key="cat.id"
                @click="selectedCategory = cat.id"
                class="p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between text-start hover:border-najmgreen/60"
                :class="[
                  selectedCategory === cat.id
                    ? 'border-najmgreen bg-emerald-50/70 ring-1 ring-najmgreen shadow-2xs'
                    : 'border-gray-200/90 bg-white hover:bg-gray-50/50'
                ]"
              >
                <div class="space-y-0.5">
                  <div class="text-xs sm:text-sm font-bold text-gray-900" v-editable="`categories.${idx}.title`">
                    {{ cat.title }}
                  </div>
                  <div class="text-[11px] text-gray-500" v-editable="`categories.${idx}.desc`">
                    {{ cat.desc }}
                  </div>
                </div>
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                  :class="selectedCategory === cat.id ? 'bg-najmgreen border-najmgreen text-white' : 'border-gray-300'"
                >
                  <Icon v-if="selectedCategory === cat.id" name="mdi:check" class="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Quantity & Preferred Call Time -->
          <div v-if="currentStep === 2" class="space-y-5 text-start">
            <!-- Quantities -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-800" v-editable="'steps.step2Title'">
                {{ ui?.steps?.step2Title || '۲. تیراژ تولید تقریبی مدنظر شما چقدر است؟' }}
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(qty, qIdx) in quantitiesList"
                  :key="qty"
                  type="button"
                  @click="selectedQuantity = qty"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  :class="[
                    selectedQuantity === qty
                      ? 'bg-najmgreen text-white shadow-2xs scale-102'
                      : '!bg-najmback text-gray-700 hover:bg-gray-200 border border-gray-200/80'
                  ]"
                >
                  <span v-editable="`quantities.${qIdx}`">{{ qty }}</span>
                </button>
              </div>
            </div>

            <!-- Time Slots -->
            <div class="space-y-2 pt-1 border-t border-gray-100">
              <label class="block text-xs font-bold text-gray-800">
                زمان پیشنهادی برای تماس مهندسان فنی:
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(time, tIdx) in timeSlotsList"
                  :key="time"
                  type="button"
                  @click="selectedTimeSlot = time"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  :class="[
                    selectedTimeSlot === time
                      ? '!bg-neutral-800 text-white shadow-2xs'
                      : '!bg-najmback text-gray-600 hover:bg-gray-200 border border-gray-200/80'
                  ]"
                >
                  <Icon name="mdi:clock-outline" class="w-3.5 h-3.5" />
                  <span v-editable="`timeSlots.${tIdx}`">{{ time }}</span>
                </button>
              </div>
            </div>

            <!-- Free Mockup Option -->
            <label class="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 cursor-pointer select-none">
              <input
                type="checkbox"
                v-model="form.mockupRequested"
                class="w-4 h-4 rounded text-najmgreen focus:ring-najmgreen cursor-pointer"
              />
              <span class="text-xs text-gray-900 font-bold" v-editable="'form.mockupCheck'">
                {{ ui?.form?.mockupCheck || 'مایلم ماکت فیزیکی و نمونه اولیه سه‌بعدی (Mockup) دریافت کنم' }}
              </span>
            </label>
          </div>

          <!-- Step 3: Contact & Smart Phone Input -->
          <div v-if="currentStep === 3" class="space-y-4 text-start">
            <h3 class="text-xs sm:text-sm font-bold text-gray-900" v-editable="'steps.step3Title'">
              {{ ui?.steps?.step3Title || '۳. مشخصات تماس جهت برقراری ارتباط:' }}
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5" v-editable="'form.nameLabel'">
                  {{ (ui?.form?.nameLabel || 'نام و نام خانوادگی').replace(/\*+/g, '').trim() }}
                  <span class="text-rose-500 mr-0.5">*</span>
                </label>
                <input
                  v-model="form.name"
                  required
                  type="text"
                  placeholder="مثال: علی رضایی"
                  class="w-full px-3.5 py-3 rounded-2xl bg-najmback/60 border border-gray-200 text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition"
                />
              </div>

              <!-- Dedicated Smart Phone Input -->
              <div>
                <SmartPhoneInput
                  v-model="form.phone"
                  :label="ui?.form?.phoneLabel || 'شماره موبایل همراه'"
                  required
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  @valid="isPhoneValid = $event"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5" v-editable="'form.companyLabel'">
                {{ (ui?.form?.companyLabel || 'نام برند یا شرکت (اختیاری)').replace(/\*+/g, '').trim() }}
              </label>
              <input
                v-model="form.company"
                type="text"
                placeholder="مثال: صنایع دارویی، غذایی یا برند اختصاصی"
                class="w-full px-3.5 py-3 rounded-2xl bg-najmback/60 border border-gray-200 text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition"
              />
            </div>
          </div>

          <!-- Navigation Action Bar -->
          <div class="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="currentStep--"
              class="px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition cursor-pointer"
            >
              مرحله قبل
            </button>
            <div v-else class="text-[11px] text-gray-400">
              مشاوره کاملاً رایگان و بدون تعهد
            </div>

            <button
              v-if="currentStep < 3"
              type="button"
              @click="currentStep++"
              class="px-7 py-2.5 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>مرحله بعد</span>
              <Icon name="mdi:arrow-left" class="w-4 h-4" />
            </button>

            <button
              v-else
              type="button"
              @click="handleSubmit"
              :disabled="isSubmitting || !form.name || !form.phone"
              class="px-8 py-3 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 text-d4"
            >
              <Icon v-if="isSubmitting" name="mdi:loading" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? (ui?.form?.submitting || 'در حال ارسال...') : (ui?.form?.submitBtn || 'ثبت درخواست مشاوره رایگان') }}</span>
              <Icon v-if="!isSubmitting" name="mdi:check" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Trust Strip -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-center">
        <div
          v-for="(b, idx) in trustBadges"
          :key="idx"
          class="p-3 rounded-2xl bg-white/70 border border-gray-200/70 flex items-center justify-center gap-2 text-xs text-gray-700 font-medium"
        >
          <Icon :name="b.icon" class="w-4 h-4 text-najmgreen shrink-0" />
          <span v-editable="`trustBadges.${idx}.title`">{{ b.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'
import { useConsultation } from '~/composables/useConsultation'
import SmartPhoneInput from '~/components/common/SmartPhoneInput.vue'

definePageMeta({
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const { ui, allUi } = usePageUI('consultation')
useAdminEditable('consultation', allUi)

const { submitRequest } = useConsultation()

const currentStep = ref(1)
const isSubmitting = ref(false)
const submitted = ref(false)
const isPhoneValid = ref(false)

const selectedCategory = ref('folding-carton')
const selectedQuantity = ref('۱,۰۰۰ عدد')
const selectedTimeSlot = ref('صبح (۹:۰۰ الی ۱۲:۰۰)')

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

const trustBadges = computed(() => ui.value?.trustBadges || [
  { icon: 'mdi:clock-fast', title: 'پاسخگویی کمتر از ۲ ساعت' },
  { icon: 'mdi:package-variant-closed-check', title: 'ماکت فیزیکی رایگان' },
  { icon: 'mdi:shield-check-outline', title: 'تضمین انطباق رنگی ۹۹.۸٪' }
])

const activeCategoryTitle = computed(() => {
  const cat = categoriesList.value.find((c: any) => c.id === selectedCategory.value)
  return cat?.title || 'جعبه مقوایی'
})

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

function resetForm() {
  submitted.value = false
  currentStep.value = 1
  form.name = ''
  form.phone = ''
  form.company = ''
  form.mockupRequested = true
}
</script>
