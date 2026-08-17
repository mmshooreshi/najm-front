<!-- pages/about/index.vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-najmback text-gray-800 relative">
    <!-- Smart Floating Capsule Sub-Nav (Zero initial jump: transitions enabled only after mount settles) -->
    <div
      class="fixed top-20 inset-x-0 z-40 flex justify-center pointer-events-none"
      :class="[
        isReady ? 'transition-all duration-300' : '',
        navVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
      ]"
    >
      <nav class="pointer-events-auto bg-white/85 backdrop-blur-xl border border-white/80 shadow-lg rounded-full px-2 py-1.5 flex items-center gap-1.5">
        <button
          v-for="item in sections"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="px-3.5 py-1.5 text-xs text-d4 rounded-full transition-all cursor-pointer whitespace-nowrap"
          :class="[
            activeSection === item.id
              ? 'bg-najmgreen text-white shadow-xs font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-black/5 font-medium'
          ]"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>

    <!-- Main Editorial Container -->
    <main class="pt-24 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-28">
      <!-- Section 1: Hero & Vision (Scale & Staff) -->
      <section id="vision" class="scroll-mt-28 space-y-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <!-- Text Lead -->
          <div class="lg:col-span-6 space-y-6 text-right">
            <span class="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen text-d4">
              درباره مجتمع چاپ و بسته‌بندی نجم
            </span>
            <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight text-d4">
              نوآوری در چاپ افست، مهندسی در ساختار بسته‌بندی
            </h1>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              مجتمع چاپ نجم با اتکا به بیش از دو دهه سابقه صنعتی، تجهیز خطوط پیشرفته هایدلبرگ و سیستم‌های تمام‌اتوماتیک پس از چاپ، به عنوان بازوی اجرایی معتبرترین برندهای دارویی، آرایشی، غذایی و صادراتی کشور فعالیت می‌کند.
            </p>
            
            <!-- Typographic Key Metrics -->
            <div class="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div class="space-y-1">
                <div class="text-2xl sm:text-3xl font-extrabold text-najmgreen text-d4">+۲۵ سال</div>
                <div class="text-xs text-gray-500">سابقه مستمر صنعتی</div>
              </div>
              <div class="space-y-1">
                <div class="text-2xl sm:text-3xl font-extrabold text-najmgreen text-d4">+۱۵ میلیون</div>
                <div class="text-xs text-gray-500">تیراژ تولید سالانه</div>
              </div>
              <div class="space-y-1">
                <div class="text-2xl sm:text-3xl font-extrabold text-najmgreen text-d4">۹۹.۸٪</div>
                <div class="text-xs text-gray-500">انطباق دقیق رنگی</div>
              </div>
            </div>
          </div>

          <!-- Hero Photography Asset -->
          <div class="lg:col-span-6">
            <div class="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] sm:aspect-[16/11] bg-gray-100 group">
              <img
                src="/images/about/staff.png"
                alt="تیم متخصص و خطوط تولید چاپ نجم"
                class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute bottom-4 right-4 text-white text-right">
                <div class="text-xs font-bold text-d4">تیم متخصص مهندسی چاپ و تولید</div>
                <div class="text-[10px] text-white/80">مجتمع تخصصی چاپ و بسته‌بندی نجم</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Team & Engineering Leads (person-1, person-2, person-3) -->
      <section id="story" class="scroll-mt-28 space-y-10">
        <div class="space-y-3 max-w-2xl text-right">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgrey text-gray-800 text-d4">
            سرمایه انسانی و تخصص فنی
          </span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-gray-900 text-d4">
            تیم متخصص؛ هدایت‌گران کیفیت در چاپ نجم
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            از لیتوگرافی و تفکیک دقیق ترام‌های رنگی تا تنظیم دانسیته مرکب روی خطوط ۵ رنگ هایدلبرگ و نظارت بر تیغ‌زنی میکرونی دایکات.
          </p>
        </div>

        <!-- 3-Column Frameless Portrait Showcase -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Person 1 -->
          <div class="space-y-4 group">
            <div class="aspect-square rounded-3xl overflow-hidden shadow-sm bg-white relative">
              <img
                src="/images/about/person-1.png"
                alt="واحد لیتوگرافی و تفکیک رنگ CTP"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-najmgreen text-white text-[10px] font-bold text-d4 shadow-xs">
                پیش از چاپ
              </span>
            </div>
            <div class="space-y-1 text-right">
              <h3 class="text-base font-bold text-gray-900 text-d4">واحد لیتوگرافی و تفکیک رنگ CTP</h3>
              <p class="text-xs text-gray-500 leading-relaxed">کنترل تفکیک رنگ‌های پنتون، تهیه زینک‌های حرارتی با ترام میکرونی و کالیبراسیون پروفایل چاپی.</p>
            </div>
          </div>

          <!-- Person 2 -->
          <div class="space-y-4 group">
            <div class="aspect-square rounded-3xl overflow-hidden shadow-sm bg-white relative">
              <img
                src="/images/about/person-2.png"
                alt="اپراتوری خطوط افست ۵ رنگ هایدلبرگ"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-najmgreen text-white text-[10px] font-bold text-d4 shadow-xs">
                خطوط چاپ
              </span>
            </div>
            <div class="space-y-1 text-right">
              <h3 class="text-base font-bold text-gray-900 text-d4">اپراتوری خطوط افست ۵ رنگ</h3>
              <p class="text-xs text-gray-500 leading-relaxed">پایش دانسیته مرکب، تنظیم تعادل آب و الکل و تثبیت کیفیت چاپ در تیراژهای میلیونی تجاری.</p>
            </div>
          </div>

          <!-- Person 3 -->
          <div class="space-y-4 group">
            <div class="aspect-square rounded-3xl overflow-hidden shadow-sm bg-white relative">
              <img
                src="/images/about/person-3.png"
                alt="کنترل کیفیت، دایکات و جعبه‌چسبانی"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-najmgreen text-white text-[10px] font-bold text-d4 shadow-xs">
                پس از چاپ
              </span>
            </div>
            <div class="space-y-1 text-right">
              <h3 class="text-base font-bold text-gray-900 text-d4">تست مقاومت و خطوط تکمیلی</h3>
              <p class="text-xs text-gray-500 leading-relaxed">نظارت بر تیغ‌زنی بدون پلیسه، سلفون‌کشی حرارتی و چسب لاک‌باتم اتوماتیک با تست‌های آزمایشگاهی.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Locked Pinned Slides (راهکارها و ویژگی‌ها) -->
      <section id="solutions" class="scroll-mt-28">
        <AboutGsapPinnedSection :is-bypassing="isNavBypassing" />
      </section>

      <!-- Section 4: Facilities & Industrial Fleet (Machines 1-5 & QC Lab) -->
      <section id="facility" class="scroll-mt-28 space-y-10">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="space-y-2 text-right">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgrey text-gray-800 text-d4">
              ناوگان ماشین‌آلات صنعتی
            </span>
            <h2 class="text-2xl sm:text-4xl font-extrabold text-gray-900 text-d4">
              تجهیزات مدرن چاپ افست و خطوط تکمیلی
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 max-w-md text-right leading-relaxed">
            سرمایه‌گذاری پیوسته در تکنولوژی‌های هایدلبرگ و بوبست ضامن دقت میکرونی و سرعت صنعتی در تحویل سفارشات است.
          </p>
        </div>

        <!-- Clean Editorial Machine Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Machine 1 -->
          <div class="space-y-3 group">
            <div class="aspect-[16/10] rounded-3xl overflow-hidden shadow-sm bg-white p-2">
              <img
                src="/images/about/machines-1.png"
                alt="چاپ افست ۵ رنگ هایدلبرگ"
                class="w-full h-full object-cover rounded-2xl group-hover:scale-104 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="space-y-1 text-right">
              <span class="text-[10px] font-bold text-najmgreen text-d4">HEIDELBERG SPEEDMASTER</span>
              <h3 class="text-base font-bold text-gray-900 text-d4">چاپ افست ۵ رنگ ورقی</h3>
              <p class="text-xs text-gray-500 leading-relaxed">کنترل رنگ آنلاین Prinect و قابلیت چاپ همزمان رنگ‌های پنتون و ورنی.</p>
              <div class="pt-2 text-[11px] text-gray-600 flex justify-between border-t border-gray-200">
                <span>ابعاد: ۷۲×۱۰۲ cm</span>
                <span class="font-bold text-gray-800">۱۵,۰۰۰ برگ/ساعت</span>
              </div>
            </div>
          </div>

          <!-- Machine 2 -->
          <div class="space-y-3 group">
            <div class="aspect-[16/10] rounded-3xl overflow-hidden shadow-sm bg-white p-2">
              <img
                src="/images/about/machines-2.png"
                alt="دایکات اتوماتیک بوبست"
                class="w-full h-full object-cover rounded-2xl group-hover:scale-104 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="space-y-1 text-right">
              <span class="text-[10px] font-bold text-najmgreen text-d4">BOBST DIE-CUTTING</span>
              <h3 class="text-base font-bold text-gray-900 text-d4">دایکات و پوشال‌برداری اتوماتیک</h3>
              <p class="text-xs text-gray-500 leading-relaxed">تیغ‌زنی، خط‌تا و برجسته‌سازی انواع مقوای ایندربرد و فلوت‌دار با دقت بالا.</p>
              <div class="pt-2 text-[11px] text-gray-600 flex justify-between border-t border-gray-200">
                <span>فشار تیغ: ۳۰۰ تن</span>
                <span class="font-bold text-gray-800">۸,۰۰۰ شیت/ساعت</span>
              </div>
            </div>
          </div>

          <!-- Machine 3 -->
          <div class="space-y-3 group">
            <div class="aspect-[16/10] rounded-3xl overflow-hidden shadow-sm bg-white p-2">
              <img
                src="/images/about/machines-3.png"
                alt="لیتوگرافی CTP هایدلبرگ"
                class="w-full h-full object-cover rounded-2xl group-hover:scale-104 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="space-y-1 text-right">
              <span class="text-[10px] font-bold text-najmgreen text-d4">HEIDELBERG SUPRASETTER</span>
              <h3 class="text-base font-bold text-gray-900 text-d4">خروجی مستقیم زینک حرارتی (CTP)</h3>
              <p class="text-xs text-gray-500 leading-relaxed">تولید زینک‌های بدون شیمیایی با تفکیک ترام ۱ الی ۹۹ درصد با رزولوشن ۲۵۴۰DPI.</p>
              <div class="pt-2 text-[11px] text-gray-600 flex justify-between border-t border-gray-200">
                <span>دقت: ۲۵۴۰ DPI</span>
                <span class="font-bold text-gray-800">۲۴ پلیت/ساعت</span>
              </div>
            </div>
          </div>

          <!-- Machine 4 -->
          <div class="space-y-3 group">
            <div class="aspect-[16/10] rounded-3xl overflow-hidden shadow-sm bg-white p-2">
              <img
                src="/images/about/machines-4.png"
                alt="جعبه‌چسبانی اتوماتیک"
                class="w-full h-full object-cover rounded-2xl group-hover:scale-104 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="space-y-1 text-right">
              <span class="text-[10px] font-bold text-najmgreen text-d4">AUTO FOLDER-GLUER</span>
              <h3 class="text-base font-bold text-gray-900 text-d4">جعبه‌چسبانی خطی و لاک‌باتم</h3>
              <p class="text-xs text-gray-500 leading-relaxed">چسب‌زنی ۴ و ۶ نقطه جعبه‌های دارویی، غذایی و بهداشتی با تزریق اتوماتیک.</p>
              <div class="pt-2 text-[11px] text-gray-600 flex justify-between border-t border-gray-200">
                <span>قابلیت: لاک‌باتم + خطی</span>
                <span class="font-bold text-gray-800">۵۰,۰۰۰ جعبه/ساعت</span>
              </div>
            </div>
          </div>

          <!-- Machine 5 -->
          <div class="space-y-3 group">
            <div class="aspect-[16/10] rounded-3xl overflow-hidden shadow-sm bg-white p-2">
              <img
                src="/images/about/machines-5.png"
                alt="سلفون حرارتی و UV"
                class="w-full h-full object-cover rounded-2xl group-hover:scale-104 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="space-y-1 text-right">
              <span class="text-[10px] font-bold text-najmgreen text-d4">THERMAL LAMINATOR & UV</span>
              <h3 class="text-base font-bold text-gray-900 text-d4">سلفون حرارتی و پوشش‌های UV</h3>
              <p class="text-xs text-gray-500 leading-relaxed">اعمال سلفون مات، براق، سافت‌تاچ و یووی موضعی برجسته با چسبندگی بالا.</p>
              <div class="pt-2 text-[11px] text-gray-600 flex justify-between border-t border-gray-200">
                <span>پوشش: مات، براق، شنی</span>
                <span class="font-bold text-gray-800">۶,۵۰۰ شیت/ساعت</span>
              </div>
            </div>
          </div>

          <!-- Machine 6 -->
          <div class="space-y-3 group">
            <div class="aspect-[16/10] rounded-3xl overflow-hidden shadow-sm bg-white p-2">
              <img
                src="/images/about/machines-small-1.png"
                alt="آزمایشگاه کنترل کیفیت"
                class="w-full h-full object-cover rounded-2xl group-hover:scale-104 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div class="space-y-1 text-right">
              <span class="text-[10px] font-bold text-najmgreen text-d4">QUALITY CONTROL LAB</span>
              <h3 class="text-base font-bold text-gray-900 text-d4">آزمایشگاه کنترل کیفیت مقوا</h3>
              <p class="text-xs text-gray-500 leading-relaxed">تست مقاومت به خمش و سایش، رطوبت‌سنجی و انطباق رنگ در شرایط نوری D50.</p>
              <div class="pt-2 text-[11px] text-gray-600 flex justify-between border-t border-gray-200">
                <span>استاندارد: ISO 12647-2</span>
                <span class="font-bold text-gray-800">پایش ۱۰۰٪ پچ‌ها</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 5: Core Values & Principles -->
      <section id="values" class="scroll-mt-28 space-y-10">
        <div class="space-y-3 max-w-2xl text-right">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen text-d4">
            اصول بنیادین
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 text-d4">
            ارزش‌هایی که مسیر تولید ما را هدایت می‌کنند
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="space-y-3 text-right">
            <div class="w-10 h-10 rounded-2xl bg-najmgreen/10 text-najmgreen flex items-center justify-center">
              <Icon name="mdi:target" class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-gray-900 text-d4">دقت و ثبات کیفیت</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              استفاده از سیستم‌های پیشرفته کنترل رنگ اسپکتروفتومتری برای اطمینان از یکنواختی کامل در تمامی دوره‌های چاپ.
            </p>
          </div>
          <div class="space-y-3 text-right">
            <div class="w-10 h-10 rounded-2xl bg-najmgreen/10 text-najmgreen flex items-center justify-center">
              <Icon name="mdi:lightning-bolt-outline" class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-gray-900 text-d4">سرعت و تعهد به زمان</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              خطوط تولید موازی و مدیریت زنجیره تامین هوشمند که تحویل سفارشات در سریع‌ترین زمان را بدون افت کیفیت ممکن می‌سازد.
            </p>
          </div>
          <div class="space-y-3 text-right">
            <div class="w-10 h-10 rounded-2xl bg-najmgreen/10 text-najmgreen flex items-center justify-center">
              <Icon name="mdi:leaf" class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-gray-900 text-d4">مسئولیت زیست‌محیطی</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              بهره‌گیری از مرکب‌های پایه گیاهی و مقواهای بازیافت‌پذیر استاندارد با کمترین میزان ضایعات کاغذ در فرآیند لیتوگرافی.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 6: Closing Invitation & CTA -->
      <section id="aboutus" class="scroll-mt-28 bg-najmgreen text-white rounded-3xl p-8 sm:p-14 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="space-y-3 max-w-2xl text-right">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white text-d4">
            بازدید و مشاوره حضوری
          </span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-d4 leading-tight">
            از خطوط تولید و شوروم چاپ نجم بازدید فرمایید
          </h2>
          <p class="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            ما از مدیران برندها، تیم‌های توسعه محصول و طراحان بسته‌بندی دعوت می‌کنیم تا با حضور در مجتمع نجم، از نزدیک نظاره‌گر دقت ساخت و فرآیند تولید سفارشات باشند.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <NuxtLink
            to="/contact"
            class="px-8 py-3.5 rounded-2xl bg-white text-najmgreen font-bold text-xs hover:bg-emerald-50 transition text-center shadow-xs whitespace-nowrap text-d4"
          >
            هماهنگی بازدید و استعلام
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition text-center border border-white/20 whitespace-nowrap text-d4"
          >
            دانلود کاتالوگ جامع
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AboutGsapPinnedSection from '~/components/about/AboutGsapPinnedSection.vue'

definePageMeta({
  name: 'درباره ما - چاپ نجم',
  layout: 'default'
})

const sections = [
  { id: 'vision', label: 'معرفی' },
  { id: 'story', label: 'تیم فنی' },
  { id: 'solutions', label: 'راهکارها' },
  { id: 'facility', label: 'ماشین‌آلات' },
  { id: 'values', label: 'ارزش‌ها' },
  { id: 'aboutus', label: 'بازدید' }
]

const activeSection = ref('vision')
const navVisible = ref(true)
const isReady = ref(false)
const isNavBypassing = ref(false)
let lastScrollY = 0

function handleScrollDirection() {
  if (typeof window === 'undefined') return
  const currentY = window.scrollY
  
  if (currentY < 180) {
    navVisible.value = true
  } else if (currentY > lastScrollY + 12) {
    navVisible.value = false
  } else if (currentY < lastScrollY - 8) {
    navVisible.value = true
  }
  
  lastScrollY = currentY
}

function scrollToSection(id: string) {
  isNavBypassing.value = true
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -90
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    })
  }
  activeSection.value = id

  setTimeout(() => {
    isNavBypassing.value = false
  }, 1000)
}

onMounted(async () => {
  await nextTick()
  lastScrollY = window.scrollY
  window.addEventListener('scroll', handleScrollDirection, { passive: true })

  // Enable transitions only after layout has settled (prevents initial jump)
  setTimeout(() => {
    isReady.value = true
  }, 400)

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { rootMargin: '-20% 0px -60% 0px' }
  )

  sections.forEach(s => {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScrollDirection)
  }
})
</script>