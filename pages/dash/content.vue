<!-- pages/dash/content.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-white font-d4">مدیریت متن‌ها، بنرها و اطلاعات تمام صفحات سایت</h2>
        <p class="text-xs text-zinc-400">پوشش کامل ۱۰ صفحه اصلی و زیرصفحه‌های وب‌سایت با قابلیت ترجمه و ویرایش ۳ زبانه (FA / EN / AR)</p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          :to="`/${activePage.slug === 'home' ? '' : activePage.slug}?edit=true`"
          target="_blank"
          class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all font-d4 cursor-pointer"
        >
          <AdminIcon name="sparkles" class="w-4 h-4" />
          <span>ویرایش بصری درجا روی {{ activePage.title }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content Workspace Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Sidebar (4 Cols): Complete Pages & Subpages Explorer -->
      <div class="lg:col-span-4 rounded-3xl bg-zinc-900/80 border border-white/10 p-4 sm:p-5 space-y-3">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <span class="text-xs font-bold text-white font-d4">فهرست صفحات سایت (۱۰ بخش):</span>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-emerald-400 font-bold">
            {{ allPages.length }} صفحه
          </span>
        </div>

        <div class="space-y-1.5 max-h-[680px] overflow-y-auto custom-scrollbar pr-0.5">
          <button
            v-for="p in allPages"
            :key="p.slug"
            type="button"
            @click="activeSlug = p.slug"
            class="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-right group"
            :class="activeSlug === p.slug
              ? 'bg-najmgreen text-white font-bold shadow-md shadow-emerald-950/50'
              : 'text-zinc-400 hover:text-white bg-zinc-950/60 border border-white/5 hover:border-white/20'"
          >
            <div class="flex items-center gap-2.5 truncate">
              <AdminIcon :name="p.icon" class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
              <div class="truncate">
                <div class="font-d4 truncate">{{ p.title }}</div>
                <div class="text-[10px] opacity-70 font-sans truncate">{{ p.category }}</div>
              </div>
            </div>
            <span class="text-[10px] font-mono opacity-60 shrink-0 mr-1">
              /{{ p.slug === 'home' ? '' : p.slug }}
            </span>
          </button>
        </div>
      </div>

      <!-- Right Column (8 Cols): 3-Locale Form Studio for Selected Page -->
      <div class="lg:col-span-8 rounded-3xl bg-zinc-900/80 border border-white/10 p-5 sm:p-6 space-y-6">
        <!-- Top Language & Section Selector Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-white font-d4 flex items-center gap-2">
                <AdminIcon :name="activePage.icon" class="w-4 h-4 text-emerald-400" />
                <span>{{ activePage.title }}</span>
              </h3>
              <span class="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-white/5">
                {{ activeFields.length }} فیلد محتوایی
              </span>
            </div>
            <p class="text-xs text-zinc-400 mt-0.5">{{ activePage.desc }}</p>
          </div>

          <!-- 3-Locale Tab Switcher -->
          <div class="flex items-center p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono self-start sm:self-auto">
            <button
              v-for="lang in ['fa', 'en', 'ar']"
              :key="lang"
              type="button"
              @click="activeLang = lang as any"
              class="px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer uppercase flex items-center gap-1.5"
              :class="activeLang === lang ? 'bg-najmgreen text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'"
            >
              <span>{{ lang === 'fa' ? '🇮🇷 فارسی' : lang === 'en' ? '🇬🇧 EN' : '🇸🇦 AR' }}</span>
            </button>
          </div>
        </div>

        <!-- Form Fields Grid for Active Page & Locale -->
        <div class="space-y-4 text-xs max-h-[580px] overflow-y-auto custom-scrollbar p-1">
          <div
            v-for="field in activeFields"
            :key="field.key"
            class="space-y-1.5 p-4 rounded-2xl bg-zinc-950 border border-white/5 focus-within:border-emerald-500/50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <label class="font-bold text-zinc-200 font-d4 flex items-center gap-2">
                <span>{{ field.label }}</span>
                <span class="text-[10px] text-emerald-400 font-mono">({{ activeLang.toUpperCase() }})</span>
              </label>
              <span class="text-[10px] text-zinc-500 font-mono">{{ field.key }}</span>
            </div>

            <!-- Multiline textarea vs single-line input -->
            <textarea
              v-if="field.multiline"
              v-model="dataStore[activeLang][`${activeSlug}.${field.key}`]"
              rows="3"
              class="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white leading-relaxed focus:border-emerald-500 focus:outline-none transition-colors"
              :placeholder="`متن ${field.label} را وارد نمایید...`"
              :dir="activeLang === 'en' ? 'ltr' : 'rtl'"
            ></textarea>
            <input
              v-else
              v-model="dataStore[activeLang][`${activeSlug}.${field.key}`]"
              type="text"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors"
              :placeholder="`متن ${field.label} را وارد نمایید...`"
              :dir="activeLang === 'en' ? 'ltr' : 'rtl'"
            />
          </div>
        </div>

        <!-- Action Footer -->
        <div class="pt-4 border-t border-white/10 flex items-center justify-between">
          <span class="text-xs text-zinc-400">ذخیره خودکار در پیش‌نویس پاکت‌بیس و حافظه سرور</span>
          <button
            type="button"
            @click="saveContent"
            class="px-6 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white font-bold text-xs shadow-md font-d4 flex items-center gap-2 cursor-pointer transition-all"
          >
            <AdminIcon name="save" class="w-4 h-4" />
            <span>ذخیره متن‌های {{ activePage.title }} ({{ activeLang.toUpperCase() }})</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { setDraftValue } from '@/store/adminEditStore'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const activeSlug = ref('home')
const activeLang = ref<'fa' | 'en' | 'ar'>('fa')

const allPages = [
  { slug: 'home', title: 'صفحه اصلی', category: 'بنر هیرو، اسلوگان و سکشن‌ها', icon: 'home', desc: 'بنر هیرو، شعار سازمانی، شمارنده و بخش معرفی صنایع' },
  { slug: 'about', title: 'درباره ما', category: 'تاریخچه، چشم‌انداز و خطوط تولید', icon: 'info', desc: 'معرفی کارخانه، ۲ دهه نوآوری و استانداردهای کیفی هایدلبرگ' },
  { slug: 'services', title: 'خدمات تخصصی', category: 'چاپ افست، هاردباکس و خدمات تکمیلی', icon: 'crop', desc: 'چاپ ۵ رنگ، جعبه‌سازی لوکس، طلاکوب، یووی موضعی و دایکات' },
  { slug: 'catalog', title: 'کاتالوگ و محصولات', category: 'دسته‌بندی جعبه‌ها و مشخصات فنی', icon: 'file', desc: 'معرفی انواع جعبه مقوایی، هاردباکس صادراتی و کارتن لمینتی' },
  { slug: 'facilities', title: 'ماشین‌آلات و کارخانه', category: 'تجهیزات هایدلبرگ و سالن‌های تولید', icon: 'dashboard', desc: 'دستگاه‌های چاپ افست، لیتوگرافی CTP و خطوط اتوماتیک جعبه‌چسبانی' },
  { slug: 'blog', title: 'مقالات و اخبار', category: 'تیترها و بنرهای وبلاگ صنعتی', icon: 'file', desc: 'اخبار مجتمع چاپ نجم، راهنماهای طراحی قالب و مقالات علمی بسته‌بندی' },
  { slug: 'resources', title: 'مرکز دانلود و قالب‌ها', category: 'قالب‌های تیغ، پروفایل‌های CMYK', icon: 'download', desc: 'فایل‌های وکتور قالب تیغ جعبه، استاندارد پروفایل رنگ و راهنمای طراحان' },
  { slug: 'contact', title: 'تماس و نشانی کارخانه', category: 'دفتر مرکزی، کارخانه و تلفن‌ها', icon: 'phone', desc: 'تلفن‌های مستقیم فروش، فکس، ایمیل و ساعت‌های کاری کارخانه' },
  { slug: 'consultation', title: 'فرم مشاوره مهندسی', category: 'استعلام قیمت و درخواست ماکت ۳D', icon: 'mail', desc: 'عناوین پله‌های استعلام، زمان‌بندی تماس و ثبت سفارش ماکت سه‌بعدی' },
  { slug: 'footer', title: 'فوتر و حق نشر', category: 'متون پایانی، پیوندها و قوانین', icon: 'link', desc: 'متن معرفی پایانی، لینک‌های دسترسی سریع و کپی‌رایت سازمانی' }
]

const activePage = computed(() => {
  return allPages.find(p => p.slug === activeSlug.value) || allPages[0]
})

const pageFieldsMap: Record<string, Array<{ key: string; label: string; multiline: boolean }>> = {
  home: [
    { key: 'hero.title', label: 'عنوان اصلی بنر هیرو', multiline: false },
    { key: 'hero.subtitle', label: 'اسلوگان و پاراگراف بنر هیرو', multiline: true },
    { key: 'hero.cta', label: 'متن دکمه ثبت سفارش و استعلام', multiline: false },
    { key: 'services.header', label: 'تیتر بخش توانایی‌ها و خطوط تولید', multiline: false },
    { key: 'services.description', label: 'توضیحات بخش توانایی‌ها', multiline: true },
    { key: 'applications.header', label: 'تیتر بخش پکیج‌ها و صنایع هدف', multiline: false },
    { key: 'applications.description', label: 'توضیحات راهکارهای بسته‌بندی صنایع', multiline: true },
    { key: 'promo.title', label: 'عنوان بنر اختصاصی و تبلیغاتی', multiline: false },
    { key: 'promo.subtitle', label: 'متن توضیحی بنر پروموشن', multiline: true }
  ],
  about: [
    { key: 'intro.title', label: 'عنوان معرفی مجتمع چاپ نجم', multiline: false },
    { key: 'intro.description', label: 'متن تاریخچه و سابقه دو دهه‌ای', multiline: true },
    { key: 'mission.title', label: 'چشم‌انداز و ماموریت سازمانی', multiline: false },
    { key: 'mission.description', label: 'شرح تعهد به کیفیت چاپ و صادرات', multiline: true },
    { key: 'standards.title', label: 'استانداردهای بین‌المللی و بهداشتی', multiline: false },
    { key: 'standards.description', label: 'توضیحات گواهینامه‌های GMP و ایزو', multiline: true }
  ],
  services: [
    { key: 'offset.title', label: 'عنوان خط چاپ افست ۵ رنگ هایدلبرگ', multiline: false },
    { key: 'offset.description', label: 'توضیحات دقت چاپ و سیستم کنترل رنگ', multiline: true },
    { key: 'hardbox.title', label: 'عنوان خط تولید هاردباکس و جعبه لوکس', multiline: false },
    { key: 'hardbox.description', label: 'توضیحات جعبه‌های مگنتی، کشویی و صادراتی', multiline: true },
    { key: 'finishing.title', label: 'عنوان خدمات تکمیلی و طلاکوب', multiline: false },
    { key: 'finishing.description', label: 'شرح طلاکوب، یووی موضعی، شنی و خط بریل', multiline: true }
  ],
  catalog: [
    { key: 'header.title', label: 'عنوان کاتالوگ جامع محصولات بسته‌بندی', multiline: false },
    { key: 'header.subtitle', label: 'توضیحات تنوع جعبه‌ها و متریال', multiline: true },
    { key: 'hardbox_cat.title', label: 'عنوان دسته‌بندی هاردباکس لوکس', multiline: false },
    { key: 'folding_cat.title', label: 'عنوان دسته‌بندی جعبه مقوایی و ایندربرد', multiline: false },
    { key: 'carton_cat.title', label: 'عنوان دسته‌بندی کارتن لمینتی و فلوت‌دار', multiline: false }
  ],
  facilities: [
    { key: 'header.title', label: 'عنوان سالن‌ها و ماشین‌آلات پیشرفته', multiline: false },
    { key: 'header.description', label: 'شرح تجهیزات هایدلبرگ آلمان و بابست سوئیس', multiline: true },
    { key: 'press.title', label: 'معرفی ماشین‌آلات چاپ افست', multiline: false },
    { key: 'diecut.title', label: 'معرفی دایکات اتوماتیک و طلاکوب', multiline: false }
  ],
  blog: [
    { key: 'header.title', label: 'عنوان مقالات و پایگاه دانش بسته‌بندی', multiline: false },
    { key: 'header.subtitle', label: 'توضیحات مقالات آموزشی و استانداردهای چاپ', multiline: true }
  ],
  resources: [
    { key: 'header.title', label: 'عنوان مرکز قالب‌های تیغ و راهنماها', multiline: false },
    { key: 'header.subtitle', label: 'توضیحات دانلود قالب‌های دایکات و پروفایل رنگ', multiline: true }
  ],
  contact: [
    { key: 'header.title', label: 'عنوان تماس با ما و آدرس کارخانه', multiline: false },
    { key: 'header.subtitle', label: 'اطلاعات تماس مستقیم و ساعات بازدید', multiline: true },
    { key: 'address.label', label: 'نشانی دقیق کارخانه و مجتمع تولیدی', multiline: true },
    { key: 'phones.label', label: 'خطوط تلفن مستقیم و فکس', multiline: false }
  ],
  consultation: [
    { key: 'header.title', label: 'عنوان سامانه مشاوره و استعلام هوشمند', multiline: false },
    { key: 'header.subtitle', label: 'توضیحات گام‌های استعلام و ساخت ماکت ۳D', multiline: true },
    { key: 'step1.title', label: 'عنوان مرحله ۱: انتخاب محصول بسته‌بندی', multiline: false },
    { key: 'step2.title', label: 'عنوان مرحله ۲: تعیین تیراژ اقتصادی', multiline: false },
    { key: 'step3.title', label: 'عنوان مرحله ۳: مشخصات تماس و زمان مکالمه', multiline: false }
  ],
  footer: [
    { key: 'hero.p1', label: 'پاراگراف معرفی اول فوتر', multiline: true },
    { key: 'hero.p2', label: 'پاراگراف معرفی دوم فوتر', multiline: true },
    { key: 'copyright', label: 'متن کپی‌رایت و حقوق مالکیت معنوی', multiline: false }
  ]
}

const activeFields = computed(() => {
  return pageFieldsMap[activeSlug.value] || [
    { key: 'title', label: 'عنوان اصلی صفحه', multiline: false },
    { key: 'description', label: 'توضیحات و متن صفحه', multiline: true }
  ]
})

const dataStore = reactive<Record<'fa' | 'en' | 'ar', Record<string, string>>>({
  fa: {
    'home.hero.title': 'مجتمع تخصصی چاپ و بسته‌بندی نجم',
    'home.hero.subtitle': 'پیشرفته‌ترین خطوط تولید کارتن، جعبه سخت و لفاف‌های صنعتی در ایران با تکنولوژی روز دنیا',
    'home.hero.cta': 'شروع مشاوره و رزرو سفارش',
    'home.services.header': 'بیشتر از یه چاپخونه، یه هم‌تیمی خوب',
    'home.services.description': 'از طراحی قالب و متریال تا چاپ افست و خدمات تکمیلی طلاکوب و یووی، همه چیز در مجتمع چاپ و بسته‌بندی نجم.',
    'home.applications.header': 'بهترینِ خودت باش! در هر صنعتی و هر برندی',
    'home.applications.description': 'چاپ و بسته‌بندی در هر پروژه‌ای نیازهای خاص خود را دارد و ما برای هر کاربرد بهترین راه‌حل را طراحی می‌کنیم.',
    'home.promo.title': 'تولید ماکت سه‌بعدی و نمونه اولیه رایگان',
    'home.promo.subtitle': 'قبل از تولید انبوه، نمونه ماکت دقیق جعبه خود را لمس کنید.',
    'about.intro.title': 'بیش از دو دهه نوآوری و پیشگامی در صنعت چاپ و بسته‌بندی',
    'about.intro.description': 'مجتمع چاپ و بسته‌بندی نجم با به‌کارگیری پیشرفته‌ترین ماشین‌آلات هایدلبرگ آلمان و دایکات‌های اتوماتیک بابست...',
    'about.mission.title': 'تعهد به بالاترین کیفیت چاپ و استاندارد صادراتی',
    'about.mission.description': 'ماموریت ما خلق بسته‌بندی‌هایی است که در شلف‌های بین‌المللی بدرخشند و از اصالت محصول شما محافظت کنند.',
    'about.standards.title': 'استانداردهای بهداشتی و دارویی فودگرید GMP',
    'about.standards.description': 'تولید جعبه‌های دارویی و غذایی در محیط کاملاً کنترل‌شده و بهداشتی با مقواهای دارای گواهینامه سلامت.',
    'services.offset.title': 'چاپ افست هایدلبرگ ۵ رنگ مجهز به برج ورنی',
    'services.offset.description': 'بالاترین تفکیک رنگی و رزولوشن چاپ بر روی مقواهای ایندربرد، کرجی، گلاسه و متالایز.',
    'services.hardbox.title': 'خط اتوماتیک تولید هاردباکس و جعبه لوکس صادراتی',
    'services.hardbox.description': 'تولید جعبه‌های مگنتی، کشویی، کتابی و ۳ تیکه با مقوای فشرده و روکش گالینگور و مخمل.',
    'services.finishing.title': 'خدمات تکمیلی: طلاکوب حرارتی، یووی شنی و موضعی',
    'services.finishing.description': 'جلوه‌های بصری بی‌نظیر با برجسته‌سازی، خط بریل نابینایان و پنجره‌های طلق شفاف.',
    'catalog.header.title': 'کاتالوگ جامع محصولات و نمونه‌کارهای مجتمع نجم',
    'catalog.header.subtitle': 'مجموعه‌ای از برترین پروژه‌های اجرا شده در صنایع زعفران، داروسازی، آرایشی و صنایع غذایی.',
    'catalog.hardbox_cat.title': 'هاردباکس‌های مگنتی و لوکس صادراتی',
    'catalog.folding_cat.title': 'جعبه‌های دارویی، آرایشی و بهداشتی ایندربرد',
    'catalog.carton_cat.title': 'کارتن‌های لمینتی ۵ لایه و جعبه‌های فلوت‌دار',
    'facilities.header.title': 'امکانات صنعتی و ماشین‌آلات پیشرفته مجتمع نجم',
    'facilities.header.description': 'مشاهده مستقیم خطوط لیتوگرافی CTP، چاپ افست ورقی و ماشین‌آلات جعبه‌چسبانی اتوماتیک.',
    'facilities.press.title': 'ماشین‌های چاپ افست هایدلبرگ ۴.۵ ورقی CD102',
    'facilities.diecut.title': 'دایکات و طلاکوب‌های اتوماتیک Bobst با سرعت بالا',
    'blog.header.title': 'پایگاه دانش و مقالات تخصصی مهندسی بسته‌بندی',
    'blog.header.subtitle': 'جدیدترین استانداردهای بین‌المللی طراحی جعبه، روانشناسی رنگ و نکات بهینه‌سازی هزینه چاپ.',
    'resources.header.title': 'مرکز دانلود قالب‌های تیغ و استانداردهای طراحی',
    'resources.header.subtitle': 'دانلود رایگان فایل‌های دایکات وکتور AI، PDF و پروفایل‌های استاندارد رنگی Fogra.',
    'contact.header.title': 'ارتباط با کارشناسان و نشانی مجتمع چاپ نجم',
    'contact.header.subtitle': 'جهت استعلام قیمت، دریافت مشاوره فنی و هماهنگی بازدید از خطوط تولید با ما تماس بگیرید.',
    'contact.address.label': 'تهران، کیلومتر ۱۱ جاده مخصوص کرج، مجتمع تخصصی چاپ و بسته‌بندی نجم',
    'contact.phones.label': '۰۲۱-۶۶۷۹۷۹۱۱ | ۰۲۱-۶۶۷۹۷۹۱۲ | ۰۹۱۲۳۴۵۶۷۸۹',
    'consultation.header.title': 'مشاوره مهندسی و استعلام هوشمند قیمت بسته‌بندی',
    'consultation.header.subtitle': 'در چند گام ساده اطلاعات جعبه خود را ثبت کرده و پیش‌فاکتور دقیق به همراه ماکت ۳D دریافت نمایید.',
    'consultation.step1.title': 'انتخاب نوع محصول و متریال مقوا',
    'consultation.step2.title': 'تعیین تیراژ اقتصادی و ابعاد جعبه',
    'consultation.step3.title': 'ثبت شماره تماس و زمان مکالمه فنی',
    'footer.hero.p1': 'در دنیای رقابتی امروز، چاپ و بسته‌بندی اولین نقطه تماس برند شما با مشتریان است.',
    'footer.hero.p2': 'از طراحی قالب و متریال تا چاپ افست و خدمات تکمیلی طلاکوب، همه چیز در مجتمع چاپ و بسته‌بندی نجم.',
    'footer.copyright': 'کلیه حقوق مادی و معنوی این وب‌سایت متعلق به مجتمع چاپ و بسته‌بندی نجم می‌باشد.'
  },
  en: {
    'home.hero.title': 'Najm Specialized Printing & Packaging Complex',
    'home.hero.subtitle': 'Leading production lines for rigid boxes, folding cartons, and flexible packaging in the region.',
    'home.hero.cta': 'Request Free Consultation',
    'home.services.header': 'More than a print shop — your strategic partner',
    'home.services.description': 'From structural engineering to offset printing and luxury finishing — all under one roof.',
    'home.applications.header': 'Be your best in every industry and market',
    'home.applications.description': 'Every project has unique packaging requirements and we craft tailored solutions for your brand.',
    'home.promo.title': 'Free 3D Mockup & Physical Prototype',
    'home.promo.subtitle': 'Experience your finished packaging box in person before full production runs.',
    'about.intro.title': 'Over Two Decades of Innovation in Industrial Packaging',
    'about.intro.description': 'Najm Complex operates advanced Heidelberg printing presses and automated Bobst die-cutting systems.',
    'about.mission.title': 'Commitment to Export-Quality Standards & Precision',
    'about.mission.description': 'Our mission is creating packaging that shines on global retail shelves and safeguards product integrity.',
    'about.standards.title': 'GMP Food-Grade & Cleanroom Standards',
    'about.standards.description': 'Manufacturing certified pharmaceutical and food packaging in hygienic environments.',
    'services.offset.title': '5-Color Heidelberg Offset Printing with Coating Unit',
    'services.offset.description': 'Peak color accuracy and resolution across SBS, Greyboard, Art Paper and Metallized substrates.',
    'services.hardbox.title': 'Automated Rigid Box Line for Luxury & Export Goods',
    'services.hardbox.description': 'Magnetic, slide, book-style and 3-piece luxury boxes wrapped in fine leatherette and velvet.',
    'services.finishing.title': 'Finishing: Hot Foil Stamping, Spot UV & Embossing',
    'services.finishing.description': 'Exceptional tactile effects, tactile Braille for accessibility, and clear PET windows.',
    'catalog.header.title': 'Comprehensive Packaging Showcase & Portfolio',
    'catalog.header.subtitle': 'Curated collection of flagship projects in saffron, pharma, cosmetics and gourmet food.',
    'catalog.hardbox_cat.title': 'Luxury Magnetic & Book-Style Rigid Boxes',
    'catalog.folding_cat.title': 'Pharmaceutical & Cosmetic SBS Cartons',
    'catalog.carton_cat.title': '5-Ply Laminated Export Produce Cartons',
    'facilities.header.title': 'Factory Facilities & Advanced Machinery',
    'facilities.header.description': 'State-of-the-art CTP lithography, sheetfed offset presses and automatic folder-gluers.',
    'facilities.press.title': 'Heidelberg Speedmaster CD102 Sheetfed Presses',
    'facilities.diecut.title': 'High-Speed Automated Bobst Die-Cutters',
    'blog.header.title': 'Packaging Knowledge Hub & Engineering Insights',
    'blog.header.subtitle': 'Latest global standards in packaging design, structural dielines, and print optimization.',
    'resources.header.title': 'Dieline Templates & File Preparation Guides',
    'resources.header.subtitle': 'Free vector AI/PDF dieline downloads and Fogra standardized color profiles.',
    'contact.header.title': 'Contact Our Engineering Sales Team',
    'contact.header.subtitle': 'Get in touch for instant quotes, technical consultation, or factory visits.',
    'contact.address.label': 'Tehran, Km 11 Makhsoos Road, Najm Printing & Packaging Complex',
    'contact.phones.label': '+98 21 6679 7911 | +98 21 6679 7912 | +98 912 345 6789',
    'consultation.header.title': 'Intelligent Packaging Consultation & Quote Engine',
    'consultation.header.subtitle': 'Configure your box specs in 3 easy steps and receive an instant quotation with a 3D mockup.',
    'consultation.step1.title': 'Select Packaging Type & Substrate',
    'consultation.step2.title': 'Define Order Quantity & Dimensions',
    'consultation.step3.title': 'Contact Details & Preferred Call Time',
    'footer.hero.p1': 'In today’s competitive market, packaging is the primary touchpoint for your brand.',
    'footer.hero.p2': 'From structural engineering to offset printing and luxury finishing — under one roof.',
    'footer.copyright': 'All rights reserved for Najm Printing & Packaging Complex.'
  },
  ar: {
    'home.hero.title': 'مجمع نجم المتخصص للطباعة والتغليف الصناعي',
    'home.hero.subtitle': 'أحدث خطوط إنتاج الكرتون والعلب الفاخرة (هاردبوكس) والتغليف المرن بأعلى المعايير العالمية.',
    'home.hero.cta': 'طلب استشارة هندسية وحجز طلب',
    'home.services.header': 'أكثر من مجرد مطبعة — شريكك الاستراتيجي للنجاح',
    'home.services.description': 'من التصميم الهندسي للقوالب حتى طباعة الأوفست والتشطيبات الفاخرة تحت سقف واحد.',
    'home.applications.header': 'كن الأفضل في كل صناعة وكل علامة تجارية',
    'home.applications.description': 'لكل مشروع متطلباته الخاصة في التغليف ونحن نصمم الحلول المثلى لمنتجاتك التصديرية.',
    'home.promo.title': 'ماكيت ثلاثي الأبعاد وعينة فعلية مجانية',
    'home.promo.subtitle': 'عاين علبتك ولمس جودتها قبل البدء في الإنتاج الكمي للطلب.',
    'about.intro.title': 'أكثر من عقدين من الابتكار في صناعة الطباعة والتغليف',
    'about.intro.description': 'يعتمد مجمع نجم على أحدث ماكينات هايدلبرغ الألمانية وخطوط الدايكات الأوتوماتيكية من بوبست.',
    'about.mission.title': 'الالتزام بأعلى معايير الجودة التصديرية والدقة',
    'about.mission.description': 'مهمتنا خلق عبوات تتألق على رفوف المتاجر العالمية وتحمي أصالة وجودة منتجاتكم.',
    'about.standards.title': 'معايير النظافة الدوائية والغذائية فودجريد GMP',
    'about.standards.description': 'تصنيع علب الأدوية والأغذية في بيئة صحية معتمدة بأوراق كرتون مطابقة للمواصفات الصحية.',
    'services.offset.title': 'طباعة أوفست هايدلبرغ ٥ ألوان مع وحدة الورنيش',
    'services.offset.description': 'أعلى دقة ألوان على كرتون الإندربرد، الدوبلكس، الكوشيه والورق الميتالايز.',
    'services.hardbox.title': 'خط أوتوماتيكي لإنتاج الهاردبوكس والعلب الفاخرة',
    'services.hardbox.description': 'إنتاج علب مغناطيسية، سحاب وعلب فاخرة مكسوة بالجلد الفاخر والمخمل للزعفران والعطور.',
    'services.finishing.title': 'الخدمات التكميلية: بصمة ذهبية، يو في موضعي وكتابة برايل',
    'services.finishing.description': 'تأثيرات بصرية ولمسية فريدة مع البروز، كتابة برايل للمكفوفين ونوافذ الشفافية.',
    'catalog.header.title': 'الكتالوج الشامل لمنتجات التغليف ونماذج الأعمال',
    'catalog.header.subtitle': 'مجموعة من أرقى المشاريع المنفذة في قطاعات الزعفران، الأدوية، مستحضرات التجميل والأغذية.',
    'catalog.hardbox_cat.title': 'علب هاردبوكس مغناطيسية فاخرة للتصدير',
    'catalog.folding_cat.title': 'علب كرتونية دوائية وتجميلية صحية',
    'catalog.carton_cat.title': 'كرتون مصفح ٥ طبقات لتصدير التمور والفواكه',
    'facilities.header.title': 'المرافق الصناعية والماكينات المتقدمة في مجمع نجم',
    'facilities.header.description': 'شاهد خطوط الليثوغرافيا CTP، طباعة الأوفست والدايكات الأوتوماتيكي فائق السرعة.',
    'facilities.press.title': 'ماكينات طباعة هايدلبرغ Speedmaster CD102',
    'facilities.diecut.title': 'ماكينات الدايكات والبصمة الحرارية الأوتوماتيكية Bobst',
    'blog.header.title': 'مركز المعرفة ومقالات هندسة التغليف المتخصصة',
    'blog.header.subtitle': 'أحدث المعايير العالمية في تصميم العلب، خطوط التكسير واقتصاديات الإنتاج.',
    'resources.header.title': 'مركز تحميل قوالب التكسير وأدلة التصميم',
    'resources.header.subtitle': 'تحميل مجاني لملفات قوالب الدايكات الفيكتور AI/PDF وملفات بروفايل الألوان Fogra.',
    'contact.header.title': 'التواصل مع مستشاري المبيعات وعنوان المصنع',
    'contact.header.subtitle': 'تواصل معنا للحصول على عروض الأسعار الفورية، الاستشارات الفنية وترتيب زيارات المصنع.',
    'contact.address.label': 'طهران، الكيلومتر ١١ طريق كرج المخصوص، مجمع نجم للطباعة والتغليف',
    'contact.phones.label': '+98 21 6679 7911 | +98 21 6679 7912 | +98 912 345 6789',
    'consultation.header.title': 'الاستشارة الهندسية وحاسبة استعلام أسعار التغليف',
    'consultation.header.subtitle': 'سجل بيانات علبتك في خطوات بسيطة واحصل على عرض سعر دقيق وماكيت ثلاثي الأبعاد.',
    'consultation.step1.title': 'اختيار نوع العلبة وخامة الكرتون',
    'consultation.step2.title': 'تحديد الكمية الاقتصادية والأبعاد',
    'consultation.step3.title': 'تسجيل رقم الهاتف والوقت المفضل للاتصال',
    'footer.hero.p1': 'في عالم الأعمال التنافسي اليوم، التغليف هو نقطة الاتصال الأولى لعلامتك التجارية مع العملاء.',
    'footer.hero.p2': 'من التصميم الهندسي إلى طباعة الأوفست والتشطيبات الفاخرة — كل شيء في مجمع نجم.',
    'footer.copyright': 'جميع الحقوق محفوظة لمجمع نجم المتخصص للطباعة والتغليف الصناعي.'
  }
})

function saveContent() {
  const currentLangData = dataStore[activeLang.value]
  for (const [path, val] of Object.entries(currentLangData)) {
    if (path.startsWith(activeSlug.value)) {
      setDraftValue(path, activeLang.value, val)
    }
  }
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: `متن‌های ${activePage.value.title} (${activeLang.value.toUpperCase()}) با موفقیت ذخیره شدند.` } }))
}
</script>
