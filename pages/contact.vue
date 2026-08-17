<!-- pages/contact.vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- Hero Header -->
    <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
      <span class="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-najmgreen/10 text-najmgreen">
        ارتباط مستقیم با مجتمع چاپ و بسته‌بندی نجم
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
        همیشه پاسخگوی نیازهای چاپی شما هستیم
      </h1>
      <p class="text-base sm:text-lg text-gray-600 leading-relaxed">
        برای مشاوره فنی، استعلام قیمت، سفارش‌گذاری مستقیم یا هماهنگی بازدید از خطوط تولید با کارشناسان ما در تماس باشید.
      </p>
    </div>

    <!-- Contact Info Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <!-- Card 1: Phone -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-najmgreen flex items-center justify-center mb-4">
            <Icon name="mdi:phone-in-talk-outline" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">تماس تلفنی مستقیم</h3>
          <p class="text-xs text-gray-500 mb-4">پاسخگویی در ساعات کاری</p>
        </div>
        <div class="space-y-2 border-t border-gray-100 pt-4">
          <a href="tel:+982166000000" class="block text-sm font-semibold text-gray-800 hover:text-najmgreen ltr text-right">
            ۰۲۱ - ۶۶۰۰ ۰۰۰۰
          </a>
          <a href="tel:+989120000000" class="block text-sm text-gray-600 hover:text-najmgreen ltr text-right">
            ۰۹۱۲ ۰۰۰ ۰۰۰۰ (کارشناس فروش)
          </a>
        </div>
      </div>

      <!-- Card 2: Email -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Icon name="mdi:email-fast-outline" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">مکاتبه و ارسال فایل</h3>
          <p class="text-xs text-gray-500 mb-4">ارسال فایل‌های طراحی و پیش‌فاکتور</p>
        </div>
        <div class="space-y-2 border-t border-gray-100 pt-4">
          <a href="mailto:info@chapnajm.com" class="block text-sm font-semibold text-gray-800 hover:text-blue-600 ltr text-right font-mono">
            info@chapnajm.com
          </a>
          <a href="mailto:order@chapnajm.com" class="block text-sm text-gray-600 hover:text-blue-600 ltr text-right font-mono">
            order@chapnajm.com
          </a>
        </div>
      </div>

      <!-- Card 3: Social & Messengers -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Icon name="mdi:chat-processing-outline" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">پیام‌رسان‌ها و شبکه‌ها</h3>
          <p class="text-xs text-gray-500 mb-4">مشاوره سریع در واتساپ و تلگرام</p>
        </div>
        <div class="flex items-center gap-3 border-t border-gray-100 pt-4">
          <a
            href="https://wa.me/989120000000"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1.5 transition"
          >
            <Icon name="mdi:whatsapp" class="w-4 h-4" /> واتساپ
          </a>
          <a
            href="https://t.me/chapnajm"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-2 rounded-xl bg-sky-50 text-sky-700 text-xs font-semibold hover:bg-sky-100 flex items-center gap-1.5 transition"
          >
            <Icon name="mdi:telegram" class="w-4 h-4" /> تلگرام
          </a>
        </div>
      </div>

      <!-- Card 4: Working Hours -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <Icon name="mdi:clock-outline" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">ساعات کاری و پذیرش</h3>
          <p class="text-xs text-gray-500 mb-4">دفتر مرکزی و خطوط چاپ</p>
        </div>
        <div class="space-y-1 text-xs text-gray-700 border-t border-gray-100 pt-4">
          <div class="flex justify-between">
            <span>شنبه تا چهارشنبه:</span>
            <span class="font-semibold">۸:۳۰ الی ۱۸:۰۰</span>
          </div>
          <div class="flex justify-between">
            <span>پنج‌شنبه‌ها:</span>
            <span class="font-semibold">۸:۳۰ الی ۱۳:۳۰</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content: Form & Location -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Inquiry / Consultation Form -->
      <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">فرم درخواست استعلام و مشاوره</h2>
          <p class="text-sm text-gray-500">
            مشخصات پروژه خود را ثبت کنید؛ کارشناسان فنی ما در کوتاه‌ترین زمان با برآورد قیمت تماس می‌گیرند.
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
                class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">نام سازمان / برند</label>
              <input
                v-model="form.company"
                type="text"
                placeholder="مثال: شرکت پیشرو"
                class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition"
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
                class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition ltr text-right"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">دسته‌بندی خدمت / محصول</label>
              <select
                v-model="form.category"
                class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition"
              >
                <option value="packaging">جعبه‌سازی و بسته‌بندی اختصاصی</option>
                <option value="offset">چاپ افست تجاری و کاتالوگ</option>
                <option value="labels">لیبل، برچسب و استیکر رول/شیت</option>
                <option value="finishing">خدمات تکمیلی، سلفون، طلاکوب و برجسته</option>
                <option value="design">طراحی ساختار، ماکت و فرم‌بندی</option>
                <option value="other">سایر موارد</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">توضیحات و مشخصات پروژه (تیراژ، ابعاد، جنس)</label>
            <textarea
              v-model="form.message"
              rows="4"
              placeholder="لطفاً ابعاد تقریبی، تیراژ مدنظر و هرگونه نیاز اختصاصی را ذکر فرمایید..."
              class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-najmgreen focus:outline-none transition resize-none"
            ></textarea>
          </div>

          <div v-if="submitted" class="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2">
            <Icon name="mdi:check-circle-outline" class="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>درخواست شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس خواهند گرفت.</span>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-najmgreen text-white font-semibold text-sm hover:bg-emerald-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
          >
            <Icon v-if="isSubmitting" name="mdi:loading" class="w-5 h-5 animate-spin" />
            <span>{{ isSubmitting ? 'در حال ارسال درخواست...' : 'ارسال درخواست استعلام' }}</span>
            <Icon v-if="!isSubmitting" name="mdi:arrow-left" class="w-4 h-4" />
          </button>
        </form>
      </div>

      <!-- Address & Map Showcase -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="mdi:map-marker-radius-outline" class="w-6 h-6 text-najmgreen" />
            نشانی کارخانه و دفتر مرکزی
          </h3>
          <p class="text-sm text-gray-700 leading-relaxed mb-6">
            تهران، بزرگراه فتح (جاده قدیم کرج)، بعد از پل صنایع هوایی، مجتمع صنعتی و چاپ نجم
          </p>

          <div class="rounded-2xl overflow-hidden border border-gray-200 h-[280px] mb-4 relative">
            <ClientOnly>
              <Map />
            </ClientOnly>
          </div>

          <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>کد پستی: ۱۳۸۶۵-۴۵۶۷۸</span>
            <button
              @click="copyAddress"
              class="text-najmgreen font-semibold hover:underline flex items-center gap-1"
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
  // simulate network latency or PocketBase submission
  await new Promise(resolve => setTimeout(resolve, 800))
  isSubmitting.value = false
  submitted.value = true
  form.name = ''
  form.company = ''
  form.phone = ''
  form.message = ''
  setTimeout(() => {
    submitted.value = false
  }, 6000)
}

function copyAddress() {
  const addr = 'تهران، بزرگراه فتح (جاده قدیم کرج)، بعد از پل صنایع هوایی، مجتمع صنعتی و چاپ نجم'
  navigator.clipboard?.writeText(addr)
  copied.value = true
  setTimeout(() => (copied.value = false), 2500)
}
</script>