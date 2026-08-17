<!-- pages/products/industries/[slug].vue -->
<template>
  <div dir="rtl" class="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs text-gray-500">
      <NuxtLink to="/" class="hover:text-najmgreen">خانه</NuxtLink>
      <span>/</span>
      <NuxtLink to="/products" class="hover:text-najmgreen">محصولات</NuxtLink>
      <span>/</span>
      <span class="text-gray-400">راهکارهای تخصصی صنایع</span>
      <span>/</span>
      <span class="text-gray-900 font-semibold">{{ industry.title }}</span>
    </nav>

    <!-- Industry Hero -->
    <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
      <div class="max-w-3xl space-y-4">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-najmgreen">
          راهکار بسته‌بندی ویژه صنعت
        </span>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          {{ industry.title }}
        </h1>
        <p class="text-base sm:text-lg text-gray-600 leading-relaxed">
          {{ industry.description }}
        </p>
      </div>
    </div>

    <!-- Tailored Solutions Grid -->
    <div class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">اقلام و پکیج‌های پیشنهادی برای این صنعت</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(item, idx) in industry.packages"
          :key="idx"
          class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300"
        >
          <div>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-najmgreen flex items-center justify-center mb-4">
              <Icon name="mdi:package-variant-closed" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ item.title }}</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">{{ item.desc }}</p>
            <div class="flex flex-wrap gap-1.5 mb-6">
              <span
                v-for="spec in item.specs"
                :key="spec"
                class="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-[11px] text-gray-600 font-medium"
              >
                {{ spec }}
              </span>
            </div>
          </div>
          <NuxtLink
            to="/contact"
            class="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-najmgreen hover:text-white text-gray-800 text-xs font-semibold text-center transition"
          >
            مشاوره این پکیج
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Standards & Hygiene note -->
    <div class="bg-gray-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="space-y-2 max-w-xl text-right">
        <h3 class="text-lg sm:text-xl font-bold">استانداردهای بهداشتی و ایمنی تماس با محصول</h3>
        <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
          کلیه بسته‌بندی‌های تولیدی در خطوط نجم با متریال فودگرید (Food Grade)، مقوای ایندربرد بهداشتی و مرکب‌های بدون بو و سازگار با سلامت مصرف‌کننده تولید می‌گردند.
        </p>
      </div>
      <NuxtLink
        to="/contact"
        class="px-8 py-3.5 rounded-2xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition whitespace-nowrap shadow-sm"
      >
        استعلام سفارش تولید
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  name: 'راهکار صنعت - چاپ نجم',
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || '')

const industriesDB: Record<string, any> = {
  'food-beverage-restaurant': {
    title: 'صنایع غذایی، نوشیدنی و رستوران',
    description: 'بسته‌بندی‌های بهداشتی، مقاوم در برابر رطوبت و چربی با قابلیت قرارگیری در زنجیره سرد و خطوط پرکنی صنعتی.',
    packages: [
      {
        title: 'جعبه‌های مقوایی فودگرید',
        desc: 'مناسب شکلات، شیرینی، فست‌فود، چای و فرآورده‌های منجمد با پوشش بهداشتی ضد چربی.',
        specs: ['ایندربرد ۲۸۰ تا ۳۵۰ گرم', 'پوشش پلی‌اتیلن / فودگرید', 'قفل لاک‌باتم']
      },
      {
        title: 'ساک و پاکت‌های کاغذی کرافت',
        desc: 'پاکت‌های بیرون‌بر رستورانی و کافه‌ها با چاپ اختصاصی و مقاومت در برابر پاره شدن.',
        specs: ['کرافت سنگین', 'دسته‌های تقویت‌شده', 'مرکب پایه‌گیاهی']
      },
      {
        title: 'لیبل و برچسب‌های ضدآب رول',
        desc: 'برچسب بطری نوشیدنی‌ها، سس‌ها و شیشه‌های مواد غذایی با چسبندگی قوی در یخچال.',
        specs: ['متالایز', 'یووی ضدخش', 'پلی‌پروپیلن PP']
      }
    ]
  },
  'beauty-health': {
    title: 'صنایع آرایشی و مراقبت پوستی',
    description: 'جعبه‌های نفیس کرم، سرم، ادکلن و رژلب با جلوه‌های ویژه طلاکوب، متالایز و بافت‌های مخملی لمینت.',
    packages: [
      {
        title: 'جعبه تاشو کرم و سرم (Tuck-End)',
        desc: 'ساختار دقیق با منقسم داخلی نگهدارنده شیشه و جلوگیری از تکان خوردن محصول.',
        specs: ['سلفون سافت‌تاچ', 'طلاکوب موضعی', 'امباس برجسته']
      },
      {
        title: 'هاردباکس ست‌های آرایشی و عطر',
        desc: 'جعبه مگنتی و کشویی لوکس با فوم داخلی برش‌خورده با روکش مخمل یا ساتن.',
        specs: ['مقوای خاکستری ۲ میل', 'روکش گلاسه یا گالینگور', 'بسته شدن مگنتی']
      },
      {
        title: 'بروشور راهنمای مصرف داخل جعبه',
        desc: 'کاغذ نازک تحریر ۵۰ و ۶۰ گرم با تازنی میکرونی چندلایه دارو و بهداشت.',
        specs: ['چاپ ۲ رو دقیق', 'تا زنی آکاردئونی', 'رزولوشن ۳۰۰DPI']
      }
    ]
  },
  'medical-pharmaceutical': {
    title: 'صنایع پزشکی و دارویی',
    description: 'جعبه‌های دارویی با خطوط بریل (Braille)، کدهای اصالت و تفکیک رنگ با خطای صفر در خوانایی متون حساس.',
    packages: [
      {
        title: 'جعبه‌های شربت و قرص دارویی',
        desc: 'تولید سریع با دستگاه‌های لاک‌باتم پرسرعت منطبق با استانداردهای سازمان غذا و دارو.',
        specs: ['خط بریل برجسته', 'کد ردیابی ۲ بعدی', 'ایندربرد دارویی']
      },
      {
        title: 'لیبل‌های امنیتی و پلمپ دارو',
        desc: 'برچسب‌های تخریب‌پذیر و وید (Void) جهت اطمینان از اصالت محصول.',
        specs: ['برچسب گچی', 'هولوگرام امنیتی', 'سریال‌نامبر متغیر']
      },
      {
        title: 'کاتالوگ و بروشور تجهیزات پزشکی',
        desc: 'کاتالوگ‌های معرفی ابزارهای جراحی و تجهیزات بیمارستانی با صحافی مقاوم.',
        specs: ['سلفون ضد میکروب', 'صحافی فنر / چسب گرم', 'رنگ‌های پنتون دقیق']
      }
    ]
  }
}

const industry = computed(() => {
  const s = slug.value
  if (industriesDB[s]) return industriesDB[s]
  return {
    title: s.replace(/-/g, ' '),
    description: 'راهکارهای جامع بسته‌بندی، چاپ صنعتی و اقلام تبلیغاتی متناسب با استانداردهای اختصاصی این حوزه.',
    packages: [
      {
        title: 'پکیج جعبه و کارتن‌های بسته‌بندی اختصاصی',
        desc: 'طراحی ساختار، ماکت‌سازی اولیه و چاپ با کیفیت صادراتی.',
        specs: ['مقوای مقاوم', 'طراحی اختصاصی', 'چاپ باکیفیت']
      },
      {
        title: 'لیبل‌ها و علائم تجاری',
        desc: 'برچسب‌های مقاوم در برابر سایش، حرارت و مواد شوینده.',
        specs: ['چاپ رول/شیت', 'برش نیم‌تیغ', 'پوشش محافظ']
      },
      {
        title: 'کاتالوگ و ابزارهای معرفی محصول',
        desc: 'کاتالوگ‌های بازاریابی و راهنمای فنی با تصاویر با وضوح بالا.',
        specs: ['صحافی مقاوم', 'گلاسه سنگین', 'پوشش سلفون']
      }
    ]
  }
})
</script>