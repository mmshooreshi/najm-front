<!-- pages/contact.vue -->
<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
    <!-- Hero Header -->
    <div class="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
      <span
        class="inline-block px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs text-d4 font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 break-words"
        v-editable="'badge'"
      >
        {{ uiContent.badge }}
      </span>
      <h1
        class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight text-d4 leading-tight break-words"
        v-editable="'title'"
      >
        {{ uiContent.title }}
      </h1>
      <p
        class="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto break-words"
        v-editable="'description'"
      >
        {{ uiContent.description }}
      </p>
    </div>

    <!-- Contact Info Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Card 1: Phone -->
      <div
        class="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-3 sm:mb-4">
            <Icon name="mdi:phone-in-talk-outline" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1 text-d4 break-words" v-editable="'phoneLabel'">
            {{ uiContent.phoneLabel || 'تماس تلفنی مستقیم' }}
          </h3>
          <p class="text-xs text-gray-500 mb-3 sm:mb-4" v-editable="'phoneSub'">{{ uiContent.phoneSub || 'پاسخگویی در ساعات کاری' }}</p>
        </div>
        <div class="space-y-2 border-t border-gray-100 pt-3 sm:pt-4">
          <a :href="`tel:${uiContent.phone || '02166229900'}`" class="block text-sm font-semibold text-gray-800 hover:text-najmgreen ltr font-mono" v-editable="'phone'">
            {{ uiContent.phone }}
          </a>
        </div>
      </div>

      <!-- Card 2: Email -->
      <div
        class="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-3 sm:mb-4">
            <Icon name="mdi:email-fast-outline" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1 text-d4 break-words" v-editable="'emailLabel'">
            {{ uiContent.emailLabel || 'مکاتبه و ارسال فایل' }}
          </h3>
          <p class="text-xs text-gray-500 mb-3 sm:mb-4" v-editable="'emailSub'">{{ uiContent.emailSub || 'ارسال فایل‌های طراحی' }}</p>
        </div>
        <div class="space-y-2 border-t border-gray-100 pt-3 sm:pt-4">
          <a :href="`mailto:${uiContent.email || 'info@chapenajm.com'}`" class="block text-xs font-semibold text-gray-800 hover:text-najmgreen ltr font-mono break-all" v-editable="'email'">
            {{ uiContent.email }}
          </a>
        </div>
      </div>

      <!-- Card 3: Address / Location -->
      <div
        class="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-3 sm:mb-4">
            <Icon name="mdi:map-marker-radius-outline" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1 text-d4 break-words" v-editable="'addressLabel'">
            {{ uiContent.addressLabel || 'دفتر مرکزی و کارخانه' }}
          </h3>
          <p class="text-xs text-gray-600 leading-relaxed mb-3 break-words" v-editable="'address'">
            {{ uiContent.address }}
          </p>
        </div>
        <button
          @click="copyAddress"
          class="w-full py-2 px-3 rounded-xl bg-najmgrey hover:bg-gray-200 text-gray-800 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
        >
          <Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="w-4 h-4" />
          <span>{{ copied ? (uiContent.copiedText || 'کپی شد!') : (uiContent.copyAddressBtn || 'کپی نشانی') }}</span>
        </button>
      </div>

      <!-- Card 4: Working Hours -->
      <div
        class="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300"
        :class="isRTL ? 'text-right' : 'text-left'"
      >
        <div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-3 sm:mb-4">
            <Icon name="mdi:clock-outline" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1 text-d4 break-words" v-editable="'hoursLabel'">
            {{ uiContent.hoursLabel || 'ساعات کاری' }}
          </h3>
          <p class="text-xs text-gray-600 leading-relaxed mb-3 break-words" v-editable="'hours'">
            {{ uiContent.hours }}
          </p>
        </div>
        <div class="border-t border-gray-100 pt-3">
          <span class="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold" v-editable="'hoursSub'">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ uiContent.hoursSub || 'واحد فنی فعال است' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Interactive Form & Map Container -->
    <div class="bg-white rounded-3xl p-6 sm:p-12 shadow-xs border border-najmborder/40 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <!-- Quote Form -->
      <div class="lg:col-span-7 space-y-6" :class="isRTL ? 'text-right' : 'text-left'">
        <div class="space-y-1">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 text-d4 break-words" v-editable="'form.title'">
            {{ uiContent.form.title }}
          </h2>
          <p v-if="uiContent.form.subtitle" class="text-xs text-gray-500" v-editable="'form.subtitle'">
            {{ uiContent.form.subtitle }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5" v-editable="'form.nameLabel'">
                {{ (uiContent.form.nameLabel || 'نام و نام خانوادگی').replace(/\*+/g, '').trim() }}
                <span class="text-rose-500 mr-0.5">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                :placeholder="uiContent.form.namePlaceholder"
                class="w-full px-4 py-3 rounded-2xl bg-najmgrey/50 border border-najmborder/60 text-xs text-gray-900 focus:bg-white focus:border-najmgreen focus:outline-none transition"
              />
            </div>
            <div>
              <SmartPhoneInput
                v-model="form.phone"
                :label="uiContent.form.phoneLabel || 'شماره تماس همراه'"
                required
                :placeholder="uiContent.form.phonePlaceholder || '۰۹۱۲۳۴۵۶۷۸۹'"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5" v-editable="'form.companyLabel'">
                {{ uiContent.form.companyLabel || 'نام برند یا شرکت' }}
              </label>
              <input
                v-model="form.company"
                type="text"
                :placeholder="uiContent.form.companyPlaceholder"
                class="w-full px-4 py-3 rounded-2xl bg-najmgrey/50 border border-najmborder/60 text-xs text-gray-900 focus:bg-white focus:border-najmgreen focus:outline-none transition"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5" v-editable="'form.categoryLabel'">
                {{ uiContent.form.categoryLabel || 'نوع خدمت یا محصول' }}
              </label>
              <input
                v-model="form.category"
                type="text"
                :placeholder="uiContent.form.categoryPlaceholder"
                class="w-full px-4 py-3 rounded-2xl bg-najmgrey/50 border border-najmborder/60 text-xs text-gray-900 focus:bg-white focus:border-najmgreen focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5" v-editable="'form.messageLabel'">
              {{ uiContent.form.messageLabel || 'توضیحات و مشخصات پروژه *' }}
            </label>
            <textarea
              v-model="form.message"
              rows="4"
              required
              :placeholder="uiContent.form.messagePlaceholder"
              class="w-full px-4 py-3 rounded-2xl bg-najmgrey/50 border border-najmborder/60 text-xs text-gray-900 focus:bg-white focus:border-najmgreen focus:outline-none transition leading-relaxed resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3.5 px-6 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50 text-d4"
          >
            <Icon v-if="isSubmitting" name="mdi:loading" class="w-4 h-4 animate-spin" />
            <span v-editable="'form.submitBtn'">{{ isSubmitting ? (uiContent.form.submitting || 'در حال ارسال...') : (uiContent.form.submitBtn || 'ارسال درخواست استعلام') }}</span>
          </button>

          <div v-if="submitted" class="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-center space-y-1">
            <div class="text-xs font-bold" v-editable="'form.successTitle'">{{ uiContent.form.successTitle || 'درخواست شما با موفقیت ثبت شد!' }}</div>
            <div class="text-[11px] text-emerald-700" v-editable="'form.successDesc'">{{ uiContent.form.successDesc || 'کارشناسان مهندسی فروش چاپ نجم به زودی با شما تماس خواهند گرفت.' }}</div>
          </div>
        </form>
      </div>

      <!-- Map & Directions -->
      <div class="lg:col-span-5 flex flex-col justify-between space-y-4">
        <div class="rounded-2xl overflow-hidden border border-najmborder/40 h-72 sm:h-80 w-full relative">
          <ClientOnly>
            <Map />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Map from '~/components/map.vue'
import SmartPhoneInput from '~/components/common/SmartPhoneInput.vue'
import { usePageUI } from '~/composables/ui/usePageUI'
import { useAdminEditable } from '~/composables/useAdminEditable'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  name: 'تماس با ما - چاپ و بسته‌بندی نجم',
  layout: 'default'
})

const { language } = useLocale()
const isRTL = computed(() => language.value === 'FA' || language.value === 'AR')

const { ui, allUi } = usePageUI('contact')
useAdminEditable('contact', allUi)

const fallbackContact = {
  badge: 'راه‌های ارتباطی و مشاوره تخصصی',
  title: 'ارتباط مستقیم با کارشناسان چاپ و بسته‌بندی نجم',
  description: 'برای مشاوره انتخاب متریال، استعلام قیمت تیراژ، رزرو زمان چاپ یا هماهنگی بازدید حضوری از کارخانه با ما در تماس باشید.',
  phoneLabel: 'تماس تلفنی مستقیم',
  phoneSub: 'پاسخگویی در ساعات کاری',
  phone: '۰۲۱-۶۶۲۲۹۹۰۰',
  emailLabel: 'مکاتبه و ارسال فایل',
  emailSub: 'ارسال فایل‌های طراحی و پیش‌فاکتور',
  email: 'info@chapenajm.com',
  addressLabel: 'دفتر مرکزی و کارخانه',
  addressSub: 'بازدید و هماهنگی جلسه حضوری',
  address: 'تهران، جاده مخصوص کرج، کیلومتر ۱۱، خیابان صنعتی نجم، پلاک ۲۴',
  copyAddressBtn: 'کپی نشانی',
  copiedText: 'نشانی کپی شد!',
  hoursLabel: 'ساعات کاری و پذیرش',
  hoursSub: 'روزهای کاری شنبه تا پنج‌شنبه',
  hours: 'شنبه تا چهارشنبه ۸:۰۰ الی ۱۷:۳۰ | پنجشنبه‌ها ۸:۰۰ الی ۱۳:۰۰',
  form: {
    title: 'فرم آنلاین استعلام قیمت و سفارش',
    subtitle: 'مشخصات پروژه خود را وارد کنید تا کارشناسان فنی در کوتاه‌ترین زمان با شما تماس بگیرند.',
    nameLabel: 'نام و نام خانوادگی *',
    namePlaceholder: 'مثال: علی رضایی',
    phoneLabel: 'شماره تماس همراه *',
    phonePlaceholder: '۰۹۱۲...',
    companyLabel: 'نام برند یا شرکت',
    companyPlaceholder: 'نام برند، شرکت یا استارتاپ',
    categoryLabel: 'نوع محصول یا خدمت مدنظر',
    categoryPlaceholder: 'انتخاب کنید (جعبه مقوایی، هاردباکس، کاتالوگ...)',
    messageLabel: 'توضیحات و مشخصات پروژه *',
    messagePlaceholder: 'ابعاد، تیراژ تخمینی، نوع مقوا، خدمات طلاکوب/سلفون...',
    submitBtn: 'ارسال درخواست استعلام',
    submitting: 'در حال ارسال اطلاعات...',
    successTitle: 'درخواست شما با موفقیت ثبت شد!',
    successDesc: 'کارشناسان مهندسی فروش چاپ نجم به زودی با شما تماس خواهند گرفت.'
  }
}

const uiContent = computed(() => {
  return {
    ...fallbackContact,
    ...(ui.value || {}),
    form: {
      ...fallbackContact.form,
      ...(ui.value?.form || {})
    }
  }
})

const form = reactive({
  name: '',
  company: '',
  phone: '',
  category: '',
  message: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)
const copied = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 600))
  isSubmitting.value = false
  submitted.value = true
  form.name = ''
  form.company = ''
  form.phone = ''
  form.category = ''
  form.message = ''
  setTimeout(() => {
    submitted.value = false
  }, 5000)
}

function copyAddress() {
  const addr = uiContent.value.address
  navigator.clipboard?.writeText(addr)
  copied.value = true
  setTimeout(() => (copied.value = false), 2500)
}
</script>
