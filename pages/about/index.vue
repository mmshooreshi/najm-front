<!-- pages/about/index.vue -->
<template>
  <div dir="rtl" class="min-h-screen bg-najmback">
    <!-- Sticky Sub Navigation (Scroll-spy) -->
    <nav
      class="fixed w-full overflow-auto px-4 z-40 bg-white/90 backdrop-blur-md border-b border-najmborder/60 transition-all duration-300 navcont"
      :class="subnavAtTop ? 'top-0 py-2.5 shadow-xs' : 'top-16 py-3'"
    >
      <ul class="flex gap-2 overflow-x-auto whitespace-nowrap mx-auto w-max py-0.5">
        <li
          v-for="item in sections"
          :key="item.id"
          class="transition-all duration-200 rounded-full cursor-pointer"
          :class="[
            activeSection === item.id
              ? 'bg-najmgreen text-white shadow-xs'
              : 'bg-najmgrey text-gray-700 hover:bg-gray-200'
          ]"
        >
          <a
            :href="'#' + item.id"
            class="block px-4 py-1.5 text-xs font-bold text-d4"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>

    <!-- Main Content Container -->
    <div class="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20">
      <!-- Section 1: Vision & Mission -->
      <section id="vision" class="scroll-mt-36 bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-najmborder/40">
        <div class="max-w-3xl space-y-4">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20">
            چشم‌انداز و ماموریت
          </span>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight text-d4">
            تعریف استانداردهای نوین در صنعت چاپ و بسته‌بندی پیشرفته
          </h2>
          <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
            چشم‌انداز ما در مجتمع چاپ نجم، تبدیل شدن به معتمدترین و پیشرفته‌ترین هاب تولید جعبه‌های اختصاصی و اقلام چاپی در خاورمیانه است. ما با ترکیب دانش فنی، متریال دوستدار محیط‌زیست و دقت میکرونی، هویت بصری محصولات مشتریانمان را متمایز می‌سازیم.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100 font-mono">
            <div class="p-4 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
              <div class="text-2xl font-extrabold text-najmgreen mb-1">+۲۵ سال</div>
              <div class="text-xs text-gray-600 font-sans">تجربه مستمر صنعتی</div>
            </div>
            <div class="p-4 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
              <div class="text-2xl font-extrabold text-najmgreen mb-1">+۱۵ میلیون</div>
              <div class="text-xs text-gray-600 font-sans">تیراژ بسته‌بندی سالانه</div>
            </div>
            <div class="p-4 rounded-2xl bg-najmgrey/60 border border-najmborder/40">
              <div class="text-2xl font-extrabold text-najmgreen mb-1">۹۹.۸٪</div>
              <div class="text-xs text-gray-600 font-sans">دقت و انطباق رنگی</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Our Story -->
      <section id="story" class="scroll-mt-36 bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-najmborder/40">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-4">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgrey text-gray-800 border border-gray-200">
              مسیر پیشرفت
            </span>
            <h2 class="text-2xl sm:text-4xl font-extrabold text-gray-900 text-d4">
              داستان رشد، تجربه و تخصص پایدار
            </h2>
            <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
              مجموعه چاپ نجم از آغاز فعالیت خود، با هدف ارتقای کیفیت چاپ صنعتی و رفع نیازهای بسته‌بندی برندهای مطرح دارویی، غذایی و بهداشتی گام برداشت. با گذشت سال‌ها و سرمایه‌گذاری مداوم در تجهیز ماشین‌آلات پیشرفته هایدلبرگ و خطوط پس از چاپ تمام‌اتوماتیک، امروز نجم به عنوان یکی از پیشگامان بسته‌بندی لوکس و بهداشتی شناخته می‌شود.
            </p>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              ما باور داریم بسته‌بندی صرفاً یک محافظ فیزیکی نیست، بلکه نخستین زبان تعاملی برند شما با مخاطب نهایی است.
            </p>
          </div>
          <div class="lg:col-span-5 rounded-2xl overflow-hidden bg-najmgrey/50 aspect-video lg:aspect-square flex items-center justify-center border border-najmborder/40">
            <NuxtImg
              src="/images/sections/footer/trust.png"
              class="w-full h-full object-contain p-4"
              alt="Chap Najm Story"
            />
          </div>
        </div>
      </section>

      <!-- Section 3: Core Values -->
      <section id="values" class="scroll-mt-36 space-y-8">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20">
            اصول بنیادین
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 text-d4">
            ارزش‌هایی که مسیر ما را هدایت می‌کنند
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
              <Icon name="mdi:target" class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-gray-900 text-d4">دقت و ثبات کیفیت</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              استفاده از سیستم‌های پیشرفته کنترل رنگ اسپکتروفتومتری برای اطمینان از یکنواختی کامل در تمامی دوره‌های چاپ.
            </p>
          </div>
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
              <Icon name="mdi:lightning-bolt-outline" class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-gray-900 text-d4">سرعت و تعهد به زمان</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              خطوط تولید موازی و مدیریت زنجیره تامین هوشمند که تحویل سفارشات در سریع‌ترین زمان را بدون افت کیفیت ممکن می‌سازد.
            </p>
          </div>
          <div class="bg-white rounded-3xl p-6 shadow-xs border border-najmborder/40 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-najmgrey text-najmgreen flex items-center justify-center">
              <Icon name="mdi:leaf" class="w-6 h-6" />
            </div>
            <h3 class="text-base font-bold text-gray-900 text-d4">مسئولیت زیست‌محیطی</h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              بهره‌گیری از مرکب‌های پایه گیاهی و مقواهای بازیافت‌پذیر استاندارد با کمترین میزان ضایعات کاغذ در فرآیند لیتوگرافی.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 4: Solutions & Features -->
      <section id="solutions" class="scroll-mt-36 bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-najmborder/40">
        <div class="mb-8">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgreen/10 text-najmgreen border border-najmgreen/20 mb-2">
            قابلیت‌ها و نوآوری
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 text-d4">
            راهکارهای یکپارچه از ایده تا محصول نهایی
          </h2>
        </div>
        <SolutionsSection />
      </section>

      <!-- Section 5: Facilities & Machinery -->
      <section id="facility" class="scroll-mt-36 bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-najmborder/40 space-y-8">
        <div class="max-w-2xl space-y-2">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-najmgrey text-gray-800 border border-gray-200">
            ظرفیت تولیدی
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 text-d4">
            ماشین‌آلات و تجهیزات خطوط چاپ نجم
          </h2>
          <p class="text-xs sm:text-sm text-gray-600">
            به‌کارگیری به‌روزترین فناوری‌های چاپ افست، جعبه‌چسبانی، لترپرس، دایکات فکی و طلاکوب حرارتی.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div class="p-5 rounded-2xl bg-najmgrey/50 border border-najmborder/40 flex gap-4 items-start">
            <div class="w-10 h-10 rounded-xl bg-najmgreen text-white flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:printer-3d-nozzle" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-gray-900 text-sm mb-1 text-d4">خطوط چاپ افست هایدلبرگ (Heidelberg)</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                دستگاه‌های ۵ رنگ و ۴ رنگ با ابعاد تا ۱۰۰×۷۰ سانتیمتر مجهز به سیستم‌های کنترل رنگ دیجیتال آنلاین.
              </p>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-najmgrey/50 border border-najmborder/40 flex gap-4 items-start">
            <div class="w-10 h-10 rounded-xl bg-najmgreen text-white flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:content-cut" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-gray-900 text-sm mb-1 text-d4">دایکات و تیغ‌زنی بوبست و فکی</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                ماشین‌آلات لترپرس و بوبست اتوماتیک برای تیغ‌زنی، خط‌تا و پوشال‌برداری سریع جعبه‌های مقوایی و هاردباکس.
              </p>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-najmgrey/50 border border-najmborder/40 flex gap-4 items-start">
            <div class="w-10 h-10 rounded-xl bg-najmgreen text-white flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:shimmer" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-gray-900 text-sm mb-1 text-d4">خدمات تکمیلی، سلفون‌کشی و یووی</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                سلفون حرارتی مات و براق، یووی موضعی برجسته، طلاکوب گرم و نقره‌کوب برای جلوه‌های بصری اعلا.
              </p>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-najmgrey/50 border border-najmborder/40 flex gap-4 items-start">
            <div class="w-10 h-10 rounded-xl bg-najmgreen text-white flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:package-variant-closed" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-gray-900 text-sm mb-1 text-d4">جعبه‌چسبانی تمام‌اتوماتیک</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                خطوط چسب خطی، لاک‌باتم و ۴ نقطه با ظرفیت تولید ۵۰ هزار جعبه در ساعت.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 6: CTA -->
      <section id="aboutus" class="scroll-mt-36 bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-najmborder/40 text-center max-w-4xl mx-auto space-y-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 text-d4">
          همراه شما در خلق بسته‌بندی‌های به یاد ماندنی
        </h2>
        <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
          تعهد ما فراتر از یک سفارش چاپ است؛ ما مشاور فنی و شریک راهبردی بسته‌بندی شما هستیم تا ارزش افزوده واقعی برای محصول شما بیافرینیم.
        </p>
        <div class="pt-2 flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/contact"
            class="px-8 py-3 rounded-2xl bg-najmgreen hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm"
          >
            مشاوره و استعلام پروژه
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="px-8 py-3 rounded-2xl bg-najmgrey hover:bg-gray-200 text-gray-800 font-bold text-xs transition"
          >
            مشاهده کاتالوگ محصولات
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import SolutionsSection from '~/components/about/SolutionsSectionGPinned.vue'
import { scrollDirection } from '~/composables/useScrollStore'

definePageMeta({
  name: 'درباره ما - چاپ نجم',
  layout: 'default'
})

const sections = [
  { id: 'vision', label: 'چشم‌انداز و اهداف ما' },
  { id: 'story', label: 'داستان ما' },
  { id: 'values', label: 'ارزش‌ها' },
  { id: 'solutions', label: 'راهکارها و ویژگی‌ها' },
  { id: 'facility', label: 'مجموعه و تجهیزات ‌ما' },
  { id: 'aboutus', label: 'درباره ما' }
]

const activeSection = ref('vision')
const subnavAtTop = computed(() => scrollDirection.value === 'down')

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { rootMargin: '-10% 0px -80% 0px' }
  )

  sections.forEach(s => {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  })
})
</script>

<style scoped>
.navcont {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.navcont::-webkit-scrollbar {
  display: none;
}
</style>