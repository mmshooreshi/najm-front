<!-- pages/contact.vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
    <!-- Hero Header -->
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <span class="inline-block px-4 py-1.5 rounded-full text-xs text-d4 font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20">
        مجتمع چاپ و بسته‌بندی نجم
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight text-d4">
        تماس با ما و مشاوره تخصصی
      </h1>
      <p class="text-sm sm:text-base text-gray-600 leading-relaxed text-d4">
        برای استعلام قیمت تیراژ، دریافت نمونه کار و مشاوره در زمینه ساختار بسته‌بندی، با کارشناسان فنی ما در تماس باشید.
      </p>
    </div>

    <!-- Contact Info Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1: Phone -->
      <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-4">
            <Icon name="mdi:phone-in-talk-outline" class="w-6 h-6" />
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1 text-d4">تماس تلفنی مستقیم</h3>
          <p class="text-xs text-gray-500 mb-4">پاسخگویی در ساعات کاری</p>
        </div>
        <div class="space-y-2 border-t border-gray-100 pt-4">
          <a href="tel:+982166000000" class="block text-sm font-semibold text-gray-800 hover:text-najmgreen ltr text-right font-mono">
            ۰۲۱ - ۶۶۰۰ ۰۰۰۰
          </a>
          <a href="tel:+989120000000" class="block text-xs text-gray-600 hover:text-najmgreen ltr text-right font-mono">
            ۰۹۱۲ ۰۰۰ ۰۰۰۰ (واحد فروش)
          </a>
        </div>
      </div>

      <!-- Card 2: Email -->
      <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-4">
            <Icon name="mdi:email-fast-outline" class="w-6 h-6" />
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1 text-d4">مکاتبه و ارسال فایل</h3>
          <p class="text-xs text-gray-500 mb-4">ارسال فایل‌های طراحی و پروپوزال</p>
        </div>
        <div class="space-y-2 border-t border-gray-100 pt-4">
          <a href="mailto:info@chapnajm.com" class="block text-xs font-semibold text-gray-800 hover:text-najmgreen ltr text-right font-mono">
            info@chapnajm.com
          </a>
          <a href="mailto:order@chapnajm.com" class="block text-xs text-gray-600 hover:text-najmgreen ltr text-right font-mono">
            order@chapnajm.com
          </a>
        </div>
      </div>

      <!-- Card 3: Messengers -->
      <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-4">
            <Icon name="mdi:chat-processing-outline" class="w-6 h-6" />
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1 text-d4">پیام‌رسان‌ها</h3>
          <p class="text-xs text-gray-500 mb-4">مشاوره سریع در واتساپ و تلگرام</p>
        </div>
        <div class="flex items-center gap-2 border-t border-gray-100 pt-4">
          <a
            href="https://wa.me/989120000000"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 py-2 px-3 rounded-xl bg-najmgrey text-najmgreen text-xs font-bold hover:bg-najmgreen hover:text-white flex items-center justify-center gap-1 transition"
          >
            <Icon name="mdi:whatsapp" class="w-4 h-4" /> واتساپ
          </a>
          <a
            href="https://t.me/chapnajm"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 py-2 px-3 rounded-xl bg-najmgrey text-najmgreen text-xs font-bold hover:bg-najmgreen hover:text-white flex items-center justify-center gap-1 transition"
          >
            <Icon name="mdi:telegram" class="w-4 h-4" /> تلگرام
          </a>
        </div>
      </div>

      <!-- Card 4: Working Hours -->
      <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-4">
            <Icon name="mdi:clock-outline" class="w-6 h-6" />
          </div>
          <h3 class="text-base font-bold text-gray-900 mb-1 text-d4">ساعات کاری</h3>
          <p class="text-xs text-gray-500 mb-4">دفتر مرکزی و خطوط چاپ</p>
        </div>
        <div class="space-y-1.5 text-xs text-gray-700 border-t border-gray-100 pt-4 font-mono">
          <div class="flex justify-between">
            <span>شنبه تا چهارشنبه:</span>
            <span class="font-bold text-gray-900">۸:۳۰ الی ۱۸:۰۰</span>
          </div>
          <div class="flex justify-between">
            <span>پنج‌شنبه‌ها:</span>
            <span class="font-bold text-gray-900">۸:۳۰ الی ۱۳:۳۰</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content: Form & Location -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Consultation Form -->
      <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-najmborder/40">
        <div class="mb-8">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-d4">فرم استعلام و ثبت سفارش</h2>
          <p class="text-xs sm:text-sm text-gray-500">
            مشخصات پروژه چاپی خود را وارد نمایید؛ کارشناسان فنی در سریع‌ترین زمان با شما تماس خواهند گرفت.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">نام و نام خانوادگی *</label>
              <input
                v-model="form.name"
                required
                type="text"
                placeholder="مثال: علی رضایی"
                class="w-full px-4 py-3 rounded-2xl bg-najmback border border-najmborder/60 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">نام برند / سازمان</label>
              <input
                v-model="form.company"
                type="text"
                placeholder="مثال: شرکت دارو گستر"
                class="w-full px-4 py-3 rounded-2xl bg-najmback border border-najmborder/60 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">شماره تماس همراه *</label>
              <input
                v-model="form.phone"
                required
                type="tel"
                placeholder="۰۹۱۲..."
                class="w-full px-4 py-3 rounded-2xl bg-najmback border border-najmborder/60 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition ltr text-right font-mono"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">نوع خدمت مورد نظر</label>
              <select
                v-model="form.category"
                class="w-full px-4 py-3 rounded-2xl bg-najmback border border-najmborder/60 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
              >
                <option value="packaging">جعبه‌سازی و بسته‌بندی اختصاصی</option>
                <option value="offset">چاپ افست ۵ رنگ و کاتالوگ</option>
                <option value="labels">لیبل و برچسب‌های رول/شیت</option>
                <option value="finishing">خدمات تکمیلی، سلفون و طلاکوب</option>
                <option value="design">طراحی ساختار و ساخت ماکت</option>
                <option value="other">سایر موارد</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">مشخصات سفارش (تیراژ، ابعاد، متریال)</label>
            <textarea
              v-model="form.message"
              rows="4"
              placeholder="لطفاً تیراژ مدنظر، ابعاد تقریبی و هرگونه ویژگی اختصاصی را بنویسید..."
              class="w-full px-4 py-3 rounded-2xl bg-najmback border border-najmborder/60 text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition resize-none leading-relaxed"
            ></textarea>
          </div>

          <div v-if="submitted" class="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200">
            <Icon name="mdi:check-circle" class="w-5 h-5 text-najmgreen flex-shrink-0" />
            <span>درخواست شما با موفقیت ثبت گردید. کارشناسان ما به زودی با شما تماس خواهند گرفت.</span>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
          >
            <Icon v-if="isSubmitting" name="mdi:loading" class="w-4 h-4 animate-spin" />
            <span>{{ isSubmitting ? 'در حال ارسال اطلاعات...' : 'ارسال درخواست استعلام' }}</span>
            <Icon v-if="!isSubmitting" name="mdi:arrow-left" class="w-4 h-4" />
          </button>
        </form>
      </div>

      <!-- Factory & Office Address Card -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-najmborder/40 space-y-4">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 text-d4">
            <Icon name="mdi:map-marker-radius-outline" class="w-5 h-5 text-najmgreen" />
            نشانی کارخانه و دفتر مرکزی
          </h3>
          <p class="text-xs text-gray-700 leading-relaxed">
            تهران، بزرگراه فتح (جاده قدیم کرج)، بعد از پل صنایع هوایی، مجتمع صنعتی و چاپ نجم
          </p>

          <div class="rounded-2xl overflow-hidden border border-najmborder/60 h-[260px] relative">
            <ClientOnly>
              <Map />
            </ClientOnly>
          </div>

          <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 font-mono">
            <span>کد پستی: ۱۳۸۶۵-۴۵۶۷۸</span>
            <button
              @click="copyAddress"
              class="text-najmgreen font-bold hover:underline flex items-center gap-1"
            >
              <Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="w-4 h-4" />
              {{ copied ? 'کپی شد' : 'کپی آدرس' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Map from '~/components/map.vue'

definePageMeta({
  name: 'تماس با ما - چاپ نجم',
  layout: 'default'
})

const form = reactive({
  name: '',
  company: '',
  phone: '',
  category: 'packaging',
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
  form.message = ''
  setTimeout(() => {
    submitted.value = false
  }, 5000)
}

function copyAddress() {
  const addr = 'تهران، بزرگراه فتح (جاده قدیم کرج)، بعد از پل صنایع هوایی، مجتمع صنعتی و چاپ نجم'
  navigator.clipboard?.writeText(addr)
  copied.value = true
  setTimeout(() => (copied.value = false), 2500)
}
</script>