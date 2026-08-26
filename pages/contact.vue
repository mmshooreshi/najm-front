<template>
  <div dir="rtl" class="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
    <!-- Hero Header -->
    <div class="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
      <span class="inline-block px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs text-d4 font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20">
        {{ ui?.stats || 'مجتمع چاپ و بسته‌بندی نجم' }}
      </span>
      <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight text-d4">
        {{ ui?.title || 'تماس با ما و مشاوره تخصصی' }}
      </h1>
      <p class="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed text-d4">
        {{ ui?.subtitle || 'برای استعلام قیمت تیراژ، دریافت نمونه کار و مشاوره در زمینه ساختار بسته‌بندی، با کارشناسان فنی ما در تماس باشید.' }}
      </p>
    </div>

    <!-- Contact Info Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Card 1: Phone -->
      <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-3 sm:mb-4">
            <Icon name="mdi:phone-in-talk-outline" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1 text-d4">تماس تلفنی مستقیم</h3>
          <p class="text-xs text-gray-500 mb-3 sm:mb-4">پاسخگویی در ساعات کاری</p>
        </div>
        <div class="space-y-2 border-t border-gray-100 pt-3 sm:pt-4">
          <a :href="`tel:${settings?.phone || '02166000000'}`" class="block text-sm font-semibold text-gray-800 hover:text-najmgreen ltr text-right font-mono">
            {{ settings?.phone || '۰۲۱ - ۶۶۰۰ ۰۰۰۰' }}
          </a>
          <a :href="`tel:${settings?.mobile || '09120000000'}`" class="block text-xs text-gray-600 hover:text-najmgreen ltr text-right font-mono">
            {{ settings?.mobile || '۰۹۱۲ ۰۰۰ ۰۰۰۰' }} (واحد فروش)
          </a>
        </div>
      </div>

      <!-- Card 2: Email -->
      <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-3 sm:mb-4">
            <Icon name="mdi:email-fast-outline" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1 text-d4">مکاتبه و ارسال فایل</h3>
          <p class="text-xs text-gray-500 mb-3 sm:mb-4">ارسال فایل‌های طراحی و پروپوزال</p>
        </div>
        <div class="space-y-2 border-t border-gray-100 pt-3 sm:pt-4">
          <a :href="`mailto:${settings?.email || 'info@chapnajm.com'}`" class="block text-xs font-semibold text-gray-800 hover:text-najmgreen ltr text-right font-mono">
            {{ settings?.email || 'info@chapnajm.com' }}
          </a>
          <a href="mailto:order@chapnajm.com" class="block text-xs text-gray-600 hover:text-najmgreen ltr text-right font-mono">
            order@chapnajm.com
          </a>
        </div>
      </div>

      <!-- Card 3: Messengers -->
      <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-3 sm:mb-4">
            <Icon name="mdi:chat-processing-outline" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1 text-d4">پیام‌رسان‌ها</h3>
          <p class="text-xs text-gray-500 mb-3 sm:mb-4">مشاوره سریع در واتساپ و تلگرام</p>
        </div>
        <div class="flex items-center gap-2 border-t border-gray-100 pt-3 sm:pt-4">
          <a
            :href="settings?.socialLinks?.whatsapp || 'https://wa.me/989120000000'"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 py-2 px-3 rounded-xl bg-najmgrey text-najmgreen text-xs font-bold hover:bg-najmgreen hover:text-white flex items-center justify-center gap-1 transition"
          >
            <Icon name="mdi:whatsapp" class="w-4 h-4" /> واتساپ
          </a>
          <a
            :href="settings?.socialLinks?.telegram || 'https://t.me/chapnajm'"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 py-2 px-3 rounded-xl bg-najmgrey text-najmgreen text-xs font-bold hover:bg-najmgreen hover:text-white flex items-center justify-center gap-1 transition"
          >
            <Icon name="mdi:telegram" class="w-4 h-4" /> تلگرام
          </a>
        </div>
      </div>

      <!-- Card 4: Working Hours -->
      <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div>
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center mb-3 sm:mb-4">
            <Icon name="mdi:clock-outline" class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1 text-d4">ساعات کاری</h3>
          <p class="text-xs text-gray-500 mb-3 sm:mb-4">دفتر مرکزی و خطوط چاپ</p>
        </div>
        <div class="space-y-1.5 text-xs text-gray-700 border-t border-gray-100 pt-3 sm:pt-4 font-mono">
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
      <div class="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-10 shadow-xs border border-najmborder/40">
        <div class="mb-6 sm:mb-8">
          <h2 class="text-lg sm:text-2xl font-bold text-gray-900 mb-2 text-d4">فرم استعلام و ثبت سفارش</h2>
          <p class="text-xs sm:text-sm text-gray-500">
            مشخصات پروژه چاپی خود را وارد نمایید؛ کارشناسان فنی در سریع‌ترین زمان با شما تماس خواهند گرفت.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">نام و نام خانوادگی *</label>
              <input
                v-model="form.name"
                required
                type="text"
                placeholder="مثال: علی رضایی"
                class="w-full px-4 py-3 rounded-2xl bg-najmback border border-najmborder/60 text-base sm:text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">نام برند / سازمان</label>
              <input
                v-model="form.company"
                type="text"
                placeholder="مثال: شرکت دارو گستر"
                class="w-full px-4 py-3 rounded-2xl bg-najmback border border-najmborder/60 text-base sm:text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition"
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
                inputmode="tel"
                placeholder="۰۹۱۲..."
                class="w-full px-4 py-3 rounded-2xl bg-najmback border border-najmborder/60 text-base sm:text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition ltr text-right font-mono"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">دسته‌بندی محصول</label>
              <select
                v-model="form.category"
                class="w-full px-4 py-3 rounded-2xl bg-najmback border border-najmborder/60 text-base sm:text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition cursor-pointer text-d4"
              >
                <option value="packaging">جعبه مقوایی و ایندربرد</option>
                <option value="hardbox">هاردباکس و جعبه لوکس</option>
                <option value="commercial">کاتالوگ و ساک دستی</option>
                <option value="other">سایر خدمات چاپی</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">توضیحات پروژه (ابعاد، تیراژ تخمینی و متریال)</label>
            <textarea
              v-model="form.message"
              rows="4"
              placeholder="لطفاً مشخصات محصول مانند ابعاد تقریبی (طول×عرض×ارتفاع)، تیراژ مورد نظر و نوع سلفون/یووی را شرح دهید..."
              class="w-full px-4 py-3 rounded-2xl bg-najmback border border-najmborder/60 text-base sm:text-xs focus:bg-white focus:border-najmgreen focus:outline-none transition leading-relaxed resize-none"
            ></textarea>
          </div>

          <div class="flex items-center justify-between pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-d4"
            >
              <Icon v-if="isSubmitting" name="mdi:loading" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? 'در حال ارسال...' : 'ارسال درخواست مشاوره' }}</span>
            </button>
          </div>

          <p v-if="submitted" class="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
            ✓ پیام شما با موفقیت ثبت گردید. کارشناسان ما تا ساعاتی دیگر با شما تماس خواهند گرفت.
          </p>
        </form>
      </div>

      <!-- Factory & Office Location -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-najmborder/40 space-y-4">
          <h3 class="text-base font-bold text-gray-900 text-d4 flex items-center gap-2">
            <Icon name="mdi:map-marker-radius-outline" class="w-5 h-5 text-najmgreen" />
            نشانی کارخانه و دفتر مرکزی
          </h3>
          <p class="text-xs text-gray-700 leading-relaxed">
            {{ ui?.factoryAddress || 'تهران، بزرگراه فتح (جاده قدیم کرج)، بعد از پل صنایع هوایی، مجتمع صنعتی و چاپ نجم' }}
          </p>

          <div class="rounded-2xl overflow-hidden border border-najmborder/60 h-[220px] sm:h-[260px] relative">
            <ClientOnly>
              <Map />
            </ClientOnly>
          </div>

          <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 font-mono">
            <span>کد پستی: ۱۳۸۶۵-۴۵۶۷۸</span>
            <button
              @click="copyAddress"
              class="text-najmgreen font-bold hover:underline flex items-center gap-1 cursor-pointer"
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
import { usePageUI } from '~/composables/ui/usePageUI'
import { useSiteSettings } from '~/composables/useDynamicData'

definePageMeta({
  name: 'تماس با ما - چاپ نجم',
  layout: 'default'
})

const { ui } = usePageUI('contact')
const { settings } = useSiteSettings()

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