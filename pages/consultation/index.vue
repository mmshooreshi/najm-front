<template>
  <div class="consultation-page min-h-screen bg-[#FBFBFA] pt-24 pb-20 px-4 sm:px-6 lg:px-8" :dir="isRTL ? 'rtl' : 'ltr'">
    <div class="max-w-5xl mx-auto space-y-12">
      <!-- Hero Header Section -->
      <div class="text-center space-y-4 max-w-3xl mx-auto">
        <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-najmgreen border border-emerald-200 shadow-xs">
          <Icon name="mdi:sparkles" class="w-4 h-4" />
          {{ ui?.badge || 'مشاوره تخصصی و مهندسی بسته‌بندی' }}
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 text-d4 tracking-tight leading-tight">
          {{ ui?.title || 'مشاوره رایگان و استعلام هوشمند پروژه' }}
        </h1>
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          {{ ui?.subtitle || 'طراحی ساختار، انتخاب مقوا و محاسبه دقیق هزینه فرم‌های چاپی با همراهی مهندسان ارشد چاپ نجم.' }}
        </p>

        <!-- Trust Badges -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
          <div
            v-for="(b, idx) in trustBadges"
            :key="idx"
            class="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center gap-3 text-start hover:border-najmgreen transition-all"
          >
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-najmgreen flex items-center justify-center shrink-0">
              <Icon :name="b.icon" class="w-5 h-5" />
            </div>
            <div>
              <div class="text-xs sm:text-sm font-bold text-gray-900">{{ b.title }}</div>
              <div class="text-[11px] text-gray-500">{{ b.desc || 'پشتیبانی تخصصی' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form & Interactive Flow -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Form Container -->
        <div class="lg:col-span-8 bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-10 border border-gray-200/80 shadow-lg space-y-8">
          <!-- Success State -->
          <div v-if="submitted" class="text-center py-12 space-y-5">
            <div class="w-20 h-20 bg-emerald-100 text-najmgreen rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <Icon name="mdi:check-bold" class="w-10 h-10" />
            </div>
            <h2 class="text-2xl font-black text-gray-900 text-d4">
              {{ ui?.form?.successTitle || 'درخواست شما با موفقیت ثبت شد!' }}
            </h2>
            <p class="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              {{ ui?.form?.successDesc || 'مهندسان فنی چاپ نجم در زمان انتخابی با شما تماس خواهند گرفت.' }}
            </p>
            <div class="pt-4">
              <button
                @click="submitted = false"
                class="px-8 py-3.5 rounded-2xl bg-najmgreen text-white text-xs font-bold shadow-md hover:bg-emerald-800 transition cursor-pointer"
              >
                ثبت درخواست جدید
              </button>
            </div>
          </div>

          <!-- Interactive Form -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Step 1: Category Selection -->
            <div class="space-y-3.5 text-start">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-najmgreen text-white text-xs flex items-center justify-center font-mono font-bold">۱</span>
                <h3 class="text-sm sm:text-base font-bold text-gray-900">{{ ui?.steps?.step1Title || 'انتخاب نوع محصول و ساختار مدنظر' }}</h3>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="cat in categoriesList"
                  :key="cat.id"
                  @click="selectedCategory = cat.id"
                  class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-start hover:scale-[1.01]"
                  :class="[
                    selectedCategory === cat.id
                      ? 'border-najmgreen bg-emerald-50/60 ring-1 ring-najmgreen'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  ]"
                >
                  <div>
                    <div class="text-sm font-bold text-gray-900">{{ cat.title }}</div>
                    <div class="text-xs text-gray-500 mt-0.5">{{ cat.desc }}</div>
                  </div>
                  <div
                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                    :class="selectedCategory === cat.id ? 'bg-najmgreen border-najmgreen text-white' : 'border-gray-300'"
                  >
                    <Icon v-if="selectedCategory === cat.id" name="mdi:check" class="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Target Quantity & Call Time -->
            <div class="space-y-3.5 text-start">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-najmgreen text-white text-xs flex items-center justify-center font-mono font-bold">۲</span>
                <h3 class="text-sm sm:text-base font-bold text-gray-900">{{ ui?.steps?.step2Title || 'تیراژ و زمان مناسب جهت تماس کارشناسان' }}</h3>
              </div>
              <!-- Quantity Pills -->
              <div class="flex flex-wrap gap-2.5">
                <button
                  v-for="qty in quantitiesList"
                  :key="qty"
                  type="button"
                  @click="selectedQuantity = qty"
                  class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  :class="[
                    selectedQuantity === qty
                      ? 'bg-najmgreen text-white shadow-xs scale-105'
                      : 'bg-najmback text-gray-700 hover:bg-gray-200 border border-gray-200'
                  ]"
                >
                  {{ qty }}
                </button>
              </div>

              <!-- Time Slot Pills -->
              <div class="pt-2 flex flex-wrap gap-2.5">
                <button
                  v-for="time in timeSlotsList"
                  :key="time"
                  type="button"
                  @click="selectedTimeSlot = time"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  :class="[
                    selectedTimeSlot === time
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'bg-najmback text-gray-600 hover:bg-gray-200 border border-gray-200'
                  ]"
                >
                  <Icon name="mdi:clock-outline" class="inline w-3.5 h-3.5 ml-1" />
                  {{ time }}
                </button>
              </div>
            </div>

            <!-- Step 3: Contact Details -->
            <div class="space-y-4 text-start">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-najmgreen text-white text-xs flex items-center justify-center font-mono font-bold">۳</span>
                <h3 class="text-sm sm:text-base font-bold text-gray-900">{{ ui?.steps?.step3Title || 'مشخصات تماس و جزئیات پروژه' }}</h3>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ ui?.form?.nameLabel || 'نام و نام خانوادگی *' }}</label>
                  <input
                    v-model="form.name"
                    required
                    type="text"
                    placeholder="مثال: علی رضایی"
                    class="w-full px-4 py-3.5 rounded-2xl bg-najmback border border-gray-200 text-base sm:text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ ui?.form?.phoneLabel || 'شماره تماس همراه *' }}</label>
                  <input
                    v-model="form.phone"
                    required
                    type="tel"
                    inputmode="tel"
                    placeholder="۰۹۱۲..."
                    class="w-full px-4 py-3.5 rounded-2xl bg-najmback border border-gray-200 text-base sm:text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition ltr text-right font-mono"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ ui?.form?.companyLabel || 'نام برند یا شرکت' }}</label>
                <input
                  v-model="form.company"
                  type="text"
                  placeholder="مثال: داروسازی یا برند مواد غذایی"
                  class="w-full px-4 py-3.5 rounded-2xl bg-najmback border border-gray-200 text-base sm:text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition"
                />
              </div>

              <!-- Free Prototype Mockup Checkbox -->
              <label class="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  v-model="form.mockupRequested"
                  class="w-5 h-5 rounded text-najmgreen focus:ring-najmgreen cursor-pointer"
                />
                <span class="text-xs sm:text-sm text-gray-900 font-bold">
                  {{ ui?.form?.mockupCheck || 'مایلم ماکت سه‌بعدی و نمونه اولیه فیزیکی (Mockup) دریافت کنم' }}
                </span>
              </label>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-4.5 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-black text-base shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-d4"
              >
                <Icon v-if="isSubmitting" name="mdi:loading" class="w-5 h-5 animate-spin" />
                <span>{{ isSubmitting ? (ui?.form?.submitting || 'در حال ارسال...') : (ui?.form?.submitBtn || 'ثبت درخواست مشاوره رایگان') }}</span>
                <Icon v-if="!isSubmitting" name="mdi:arrow-left" class="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        <!-- Sidebar Info & Contact Fast Lane -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4 text-start">
            <h4 class="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Icon name="mdi:phone-in-talk" class="w-5 h-5 text-najmgreen" />
              <span>ارتباط مستقیم تلفنی</span>
            </h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              برای پروژه‌های فوری یا بررسی تخصصی پیش از سفارش، می‌توانید مستقیماً با واحد مهندسی فروش تماس بگیرید.
            </p>
            <a
              href="tel:02144556677"
              class="block w-full py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-najmgreen text-center text-xs font-bold transition font-mono border border-emerald-200"
            >
              ۰۲۱ - ۴۴ ۵۵ ۶۶ ۷۷
            </a>
          </div>

          <div class="bg-najmgreen text-white rounded-3xl p-6 shadow-sm space-y-3 text-start">
            <h4 class="text-sm font-bold flex items-center gap-2">
              <Icon name="mdi:shield-star" class="w-5 h-5 text-emerald-200" />
              <span>استانداردهای مهندسی نجم</span>
            </h4>
            <ul class="text-xs text-emerald-100/90 space-y-2 leading-relaxed list-disc list-inside">
              <li>تحلیل فنی نقشه تیغ و قالب بسته‌بندی</li>
              <li>پیشنهاد گرماژ و جنس بهینه بر اساس وزن محصول</li>
              <li>کاهش ضایعات مقوا و صرفه‌جویی اقتصادی تا ۲۰٪</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useLocale } from '~/composables/useLocale'
import { useConsultation } from '~/composables/useConsultation'

definePageMeta({
  name: 'مشاوره رایگان چاپ و بسته‌بندی - نجم',
  layout: 'default',
})

const { ui } = usePageUI('consultation')
const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')
const { submitRequest } = useConsultation()

const selectedCategory = ref('folding-carton')
const selectedQuantity = ref('۱,۰۰۰ عدد')
const selectedTimeSlot = ref('صبح (۹:۰۰ الی ۱۲:۰۰)')

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
  { icon: 'mdi:clock-fast', title: 'پاسخگویی کمتر از ۲ ساعت', desc: 'در روزهای کاری' },
  { icon: 'mdi:package-variant-closed-check', title: 'ماکت فیزیکی رایگان', desc: 'پیش از چاپ تیراژ' },
  { icon: 'mdi:shield-check-outline', title: 'تضمین انطباق ۹۹.۸٪', desc: 'با استانداردهای بین‌المللی' }
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
</script>
