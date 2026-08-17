<!-- pages/products/applications/[slug].vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-gray-500">
      <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen">محصولات</NuxtLink>
      <span>/</span>
      <span class="text-gray-400">کاربردها و پکیج‌ها</span>
      <span>/</span>
      <span class="text-gray-900 font-semibold">{{ appData.title }}</span>
    </nav>

    <!-- App Hero -->
    <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-najmborder/40">
      <div class="max-w-3xl space-y-4">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 text-d4">
          پکیج کاربردی و هدفمند
        </span>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight text-d4">
          {{ appData.title }}
        </h1>
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
          {{ appData.description }}
        </p>
      </div>
    </div>

    <!-- Items in package -->
    <div class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 text-d4">اقلام موجود در این پکیج</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(item, idx) in appData.items"
          :key="idx"
          class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 flex flex-col justify-between hover:shadow-md transition-all duration-300"
        >
          <div>
            <div class="w-10 h-10 rounded-xl bg-najmgrey text-najmgreen flex items-center justify-center mb-4">
              <Icon name="mdi:check-decagram-outline" class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-gray-900 mb-2 text-d4">{{ item.name }}</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">{{ item.desc }}</p>
            <div class="p-3 bg-najmgrey/50 border border-najmborder/40 rounded-xl text-xs text-gray-700 font-medium">
              ویژگی: {{ item.feature }}
            </div>
          </div>
          <div class="pt-6 mt-4 border-t border-gray-100">
            <NuxtLink
              to="/contact"
              class="w-full block py-2.5 rounded-xl bg-najmgrey hover:bg-najmgreen hover:text-white text-gray-800 text-xs font-bold text-center transition"
            >
              سفارش این آیتم
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to action -->
    <div class="bg-najmgreen text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
      <div class="space-y-2 max-w-xl text-right">
        <h3 class="text-2xl font-bold text-d4">نیاز به سفارشی‌سازی اقلام این پکیج دارید؟</h3>
        <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          شما می‌توانید متریال، ابعاد، پوشش‌های چاپی و تیراژ هر یک از اقلام را مطابق با بودجه و هویت بصری سازمان خود تغییر دهید.
        </p>
      </div>
      <NuxtLink
        to="/contact"
        class="px-8 py-3.5 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition shadow-xs whitespace-nowrap"
      >
        درخواست پکیج اختصاصی
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  name: 'پکیج کاربردی - چاپ نجم',
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')

const applicationsDB: Record<string, any> = {
  'office-packaging': {
    title: 'پکیج سازمانی و اداری',
    description: 'مجموعه کامل اوراق اداری، پاکت‌ها، فولدرها و سررسیدهای یکپارچه برای تقویت هویت برند سازمانی.',
    items: [
      {
        name: 'ست اداری کامل (سربرگ، پاکت، کارت ویزیت)',
        desc: 'چاپ با پنتون رنگ سازمانی بر روی کاغذهای تحریر یا کتان خارجی با کیفیت بالا.',
        feature: 'هماهنگی ۱۰۰٪ رنگی در تمامی اقلام'
      },
      {
        name: 'فولدر شرکتی و پوشه اسناد (Folders)',
        desc: 'فولدرهای مقوایی با جیب اختصاصی قرارگیری CD، بروشور و جای کارت ویزیت.',
        feature: 'سلفون مات و طلاکوب لوگو'
      },
      {
        name: 'دفتر یادداشت و سررسید سازمانی',
        desc: 'صحافی فنر دوبل یا جلد سخت سلفونی با درج لوگو در تمامی صفحات داخلی.',
        feature: 'کاغذ تحریر ۷۰ و ۸۰ گرم'
      }
    ]
  },
  'marketing-packaging': {
    title: 'پکیج تبلیغاتی و بازاریابی',
    description: 'ابزارهای پرقدرت ترویج فروش، شامل بروشور، کاتالوگ، پوستر، ساک دستی و استندهای رومیزی.',
    items: [
      {
        name: 'کاتالوگ جامع محصولات و خدمات',
        desc: 'کاتالوگ چندصفحه‌ای با صحافی چسب گرم PUR و جلدهای ضخیم سلفونی.',
        feature: 'وضوح تفکیک رنگ تصویر ۳۰۰DPI'
      },
      {
        name: 'ساک دستی تبلیغاتی (Shopping Bag)',
        desc: 'ساک گلاسه و کرافت با بندهای باکیفیت جهت حضور برند در دست مخاطبان.',
        feature: 'تحمل وزن تا ۵ کیلوگرم'
      },
      {
        name: 'استند رومیزی و دنگلر فروشگاهی',
        desc: 'ابزارهای Point-of-Sale (POS) برای جلب توجه مشتریان در فروشگاه‌ها.',
        feature: 'پایه مقوایی مقاوم با تیغ‌زنی خاص'
      }
    ]
  },
  'luxury-gift-packaging': {
    title: 'پکیج لوکس و هدیه (VIP & Gift)',
    description: 'جعبه‌های هاردباکس نفیس، ساک‌های مخملی و اقلام با طلاکوب و نقره‌کوب برای هدایای مدیریتی و مناسبتی.',
    items: [
      {
        name: 'هاردباکس مگنتی با فوم لیزری',
        desc: 'جعبه سخت ضخیم با برش فوم دقیق نگهدارنده هدایای نفیس سازمانی.',
        feature: 'روکش گالینگور یا گلاسه Soft-Touch'
      },
      {
        name: 'ساک دستی لوکس با بند روبانی',
        desc: 'کاغذ دست‌ساز یا گلاسه ضخیم با یووی شنی و طلاکوب دوبل.',
        feature: 'تقویت کامل زیربندی و لبه‌ها'
      },
      {
        name: 'کارت تبریک و پاکت نفیس',
        desc: 'کاغذ بافت‌دار با چاپ لترپرس عمیق و طلاکوب برجسته.',
        feature: 'حس لمسی فوق‌العاده اعلا'
      }
    ]
  }
}

const appData = computed(() => {
  const s = slug.value
  if (applicationsDB[s]) return applicationsDB[s]
  return {
    title: s.replace(/-/g, ' '),
    description: 'مجموعه راهکارها و اقلام سفارشی طراحی شده برای کاربری ویژه سازمان شما.',
    items: [
      {
        name: 'اقلام بسته‌بندی ویژه',
        desc: 'تولید اختصاصی بر اساس ابعاد و نیاز پروژه.',
        feature: 'کیفیت تضمین‌شده چاپ نجم'
      },
      {
        name: 'اقلام هویت بصری',
        desc: 'چاپ با کدهای رنگی دقیق.',
        feature: 'ثبات در تیراژهای بالا'
      },
      {
        name: 'اقلام جانبی و تبلیغاتی',
        desc: 'ابزارهای تکمیلی افزایش فروش.',
        feature: 'طراحی ساختاری بهینه'
      }
    ]
  }
})
</script>