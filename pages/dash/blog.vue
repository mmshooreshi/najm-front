<!-- pages/dash/blog.vue -->
<template>
  <div class="space-y-6">
    <!-- MODE 1: ARTICLES CATALOG & LIST -->
    <div v-if="!isEditingMode" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-white font-d4">پایگاه دانش، مقالات و اخبار مجتمع نجم</h2>
          <p class="text-xs text-zinc-400">مدیریت و انتشار مقالات فنی، راهنماهای طراحی قالب تیغ و اخبار توسعه کارخانه به ۳ زبان</p>
        </div>

        <button
          type="button"
          @click="openArticleStudio(null)"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all font-d4 cursor-pointer self-start"
        >
          <AdminIcon name="plus" class="w-4 h-4" />
          <span>نگارش مقاله و خبر جدید</span>
        </button>
      </div>

      <!-- Filters & Search Bar -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <div class="relative w-full md:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو در عنوان، موضوع، متون..."
            class="w-full h-9 pr-8 pl-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
          <AdminIcon name="search" class="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-3 pointer-events-none" />
        </div>

        <!-- Category Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 rounded-xl bg-zinc-950 border border-white/5 custom-scrollbar text-xs font-d4">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            @click="activeCategory = cat.id"
            class="px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
            :class="activeCategory === cat.id ? 'bg-najmgreen text-white font-bold' : 'text-zinc-400 hover:text-white'"
          >
            <span>{{ cat.label }}</span>
            <span class="px-1 rounded-full text-[10px] bg-white/10">{{ getCategoryCount(cat.id) }}</span>
          </button>
        </div>
      </div>

      <!-- Articles Grid -->
      <div v-if="loading" class="p-16 text-center text-zinc-500 text-xs font-d4">
        در حال بارگذاری مقالات و اخبار...
      </div>

      <div v-else-if="filteredArticles.length === 0" class="p-16 text-center text-zinc-500 text-xs font-d4">
        مقاله‌ای در این دسته‌بندی یافت نشد.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="art in filteredArticles"
          :key="art.id"
          class="rounded-3xl bg-zinc-900/80 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl transition-all group"
        >
          <!-- Article Image -->
          <div class="relative h-48 bg-zinc-950 flex items-center justify-center overflow-hidden">
            <img
              :src="art.image"
              :alt="art.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <div class="absolute top-3 right-3 flex items-center gap-1.5">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-950/80 border border-white/10 text-emerald-400 backdrop-blur-md font-d4">
                {{ art.categoryLabel || art.category }}
              </span>
            </div>

            <!-- Status Badge -->
            <div class="absolute bottom-2 right-2">
              <span
                class="px-2 py-0.5 rounded-md text-[10px] font-bold font-d4 backdrop-blur-md"
                :class="art.published ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'"
              >
                {{ art.published ? 'منتشر شده ✔' : 'پیش‌نویس ⏳' }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                <span>{{ art.date }}</span>
                <span>&middot;</span>
                <span>زمان مطالعه: {{ art.readTime || '۵ دقیقه' }}</span>
              </div>

              <h3 class="text-sm font-bold text-white font-d4 leading-relaxed line-clamp-2">
                {{ art.title }}
              </h3>

              <p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {{ art.excerpt }}
              </p>
            </div>

            <!-- Actions -->
            <div class="pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                type="button"
                @click="openArticleStudio(art)"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-d4 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <AdminIcon name="edit" class="w-3.5 h-3.5" />
                <span>ویرایش مقاله</span>
              </button>

              <button
                type="button"
                @click="deleteArticle(art.id)"
                class="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="حذف مقاله"
              >
                <AdminIcon name="trash" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 2: DEDICATED FULL-PAGE ARTICLE STUDIO -->
    <div v-else class="space-y-6">
      <!-- Studio Topbar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900 border border-white/10">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isEditingMode = false"
            class="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer font-d4"
          >
            <AdminIcon name="chevron-right" class="w-4 h-4" />
            <span>بازگشت به مقالات</span>
          </button>

          <div>
            <h2 class="text-base sm:text-lg font-bold text-white font-d4">
              {{ editingArticle.id ? `ویرایش مقاله: ${editingArticle.title}` : 'نگارش مقاله یا خبر جدید' }}
            </h2>
            <p class="text-xs text-zinc-400">تنظیم تیتر، خلاصه، تصویر شاخص و متون ۳ زبانه</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="saveArticle"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-najmgreen hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-all font-d4 cursor-pointer"
          >
            <AdminIcon name="save" class="w-4 h-4" />
            <span>انتشار و ذخیره مقاله</span>
          </button>
        </div>
      </div>

      <!-- Studio Form Tabs & 3-Locale Switcher -->
      <div class="rounded-3xl bg-zinc-900/90 border border-white/10 p-6 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <h3 class="text-sm font-bold text-white font-d4 flex items-center gap-2">
            <AdminIcon name="edit" class="w-4 h-4 text-emerald-400" />
            <span>محتوای متنی مقاله به ۳ زبان:</span>
          </h3>

          <div class="flex items-center p-1 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono">
            <button
              v-for="lang in ['fa', 'en', 'ar']"
              :key="lang"
              type="button"
              @click="activeArticleLocale = lang as any"
              class="px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer uppercase flex items-center gap-1.5"
              :class="activeArticleLocale === lang ? 'bg-najmgreen text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'"
            >
              <span>{{ lang === 'fa' ? '🇮🇷 فارسی (FA)' : lang === 'en' ? '🇬🇧 English (EN)' : '🇸🇦 العربية (AR)' }}</span>
            </button>
          </div>
        </div>

        <!-- 3-Locale Form Inputs -->
        <div class="space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">عنوان مقاله ({{ activeArticleLocale.toUpperCase() }}):</label>
            <input
              v-model="editingArticle.locales[activeArticleLocale].title"
              type="text"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none"
              :placeholder="activeArticleLocale === 'fa' ? 'مثال: راهنمای انتخاب مقوای بهداشتی ایندربرد' : 'Enter article title...'"
              :dir="activeArticleLocale === 'en' ? 'ltr' : 'rtl'"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">چکیده و خلاصه کوتاه ({{ activeArticleLocale.toUpperCase() }}):</label>
            <textarea
              v-model="editingArticle.locales[activeArticleLocale].excerpt"
              rows="2"
              class="w-full p-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
              :dir="activeArticleLocale === 'en' ? 'ltr' : 'rtl'"
            ></textarea>
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-200 font-d4">متن کامل مقاله ({{ activeArticleLocale.toUpperCase() }}):</label>
            <textarea
              v-model="editingArticle.locales[activeArticleLocale].content"
              rows="8"
              class="w-full p-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
              :placeholder="activeArticleLocale === 'fa' ? 'متن کامل مقاله، استانداردها و توضیحات فنی...' : 'Full article body...'"
              :dir="activeArticleLocale === 'en' ? 'ltr' : 'rtl'"
            ></textarea>
          </div>
        </div>

        <!-- Featured Media & Publishing Settings -->
        <div class="pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6">
          <!-- Featured Image Preview -->
          <div class="md:col-span-4 space-y-3">
            <label class="font-bold text-zinc-200 text-xs font-d4">تصویر شاخص مقاله:</label>
            <div class="h-44 rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden flex items-center justify-center p-2">
              <img :src="editingArticle.image" :alt="editingArticle.title" class="max-h-full max-w-full object-contain" />
            </div>
            <button
              type="button"
              @click="openMediaStudioForArticle"
              class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-d4"
            >
              <AdminIcon name="sparkles" class="w-4 h-4 text-emerald-400" />
              <span>ویرایش تصویر در استودیو مدیا</span>
            </button>
          </div>

          <!-- Gallery Picker Tray -->
          <div class="md:col-span-8 space-y-3">
            <label class="font-bold text-zinc-200 text-xs font-d4">انتخاب عکس از گالری سرور (۳۱۰+ فایل):</label>
            <div class="h-44 overflow-y-auto rounded-2xl bg-zinc-950 border border-white/10 p-2.5 grid grid-cols-4 sm:grid-cols-6 gap-2 custom-scrollbar">
              <div
                v-for="item in galleryAssets"
                :key="item.url"
                @click="editingArticle.image = item.url"
                class="aspect-square rounded-xl bg-zinc-900 border overflow-hidden p-1 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                :class="editingArticle.image === item.url ? 'border-emerald-500 shadow-md shadow-emerald-500/20' : 'border-white/10 hover:border-white/30'"
              >
                <img :src="item.url" :alt="item.filename" class="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>
        </div>

        <!-- Publishing Metadata: Category, Slug, Status -->
        <div class="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">دسته‌بندی موضوعی:</label>
            <select
              v-model="editingArticle.category"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none font-d4"
            >
              <option value="technical">راهنمای فنی چاپ و قالب‌سازی</option>
              <option value="news">اخبار و رویدادهای کارخانه نجم</option>
              <option value="standards">استانداردهای بهداشتی و صادراتی</option>
              <option value="design">طراحی بسته‌بندی و گرافیک شلف</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">نامک انگلیسی در URL (Slug):</label>
            <input
              v-model="editingArticle.slug"
              type="text"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              dir="ltr"
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-zinc-300 font-d4">وضعیت انتشار:</label>
            <select
              v-model="editingArticle.published"
              class="w-full h-10 px-3.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:border-emerald-500 focus:outline-none font-d4"
            >
              <option :value="true">منتشر شده در سایت (عمومی) ✔</option>
              <option :value="false">پیش‌نویس محرمانه ⏳</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { openMediaStudio } from '@/store/adminEditStore'
import AdminIcon from '~/components/admin/AdminIcon.vue'

definePageMeta({
  layout: 'dash'
})

const loading = ref(true)
const isEditingMode = ref(false)
const searchQuery = ref('')
const activeCategory = ref('all')
const activeArticleLocale = ref<'fa' | 'en' | 'ar'>('fa')
const galleryAssets = ref<any[]>([])

const articles = ref<any[]>([
  {
    id: 'art-1',
    slug: 'sbs-pharma-paperboard-guide',
    title: 'راهنمای انتخاب مقوای بهداشتی ایندربرد در بسته‌بندی دارویی',
    category: 'technical',
    categoryLabel: 'راهنمای فنی چاپ',
    excerpt: 'بررسی استانداردهای بهداشتی، گرماژ مناسب، و دایکات دقیق لبه‌های قفلی برای خطوط بسته‌بندی اتوماتیک.',
    image: '/images/sections/cards/02.png',
    date: '۱۴۰۳/۰۶/۰۱',
    readTime: '۵ دقیقه',
    published: true,
    locales: {
      fa: {
        title: 'راهنمای انتخاب مقوای بهداشتی ایندربرد در بسته‌بندی دارویی',
        excerpt: 'بررسی استانداردهای بهداشتی، گرماژ مناسب، و دایکات دقیق لبه‌های قفلی برای خطوط بسته‌بندی اتوماتیک.',
        content: 'مقوای ایندربرد (SBS) به دلیل سفیدی یکنواخت و بافت فشرده عاری از هرگونه آلودگی بازیافتی، استاندارد طلایی صنایع دارویی و بهداشتی محسوب می‌شود...'
      },
      en: {
        title: 'SBS Food-Grade Paperboard Selection Guide for Pharma Packaging',
        excerpt: 'In-depth analysis of hygienic standards, optimal basis weight, and precision die-cutting for high-speed automated packaging lines.',
        content: 'Solid Bleached Sulfate (SBS) paperboard remains the global gold standard for pharmaceutical packaging...'
      },
      ar: {
        title: 'دليل اختيار كرتون الإندربرد الصحي لتغليف الأدوية',
        excerpt: 'دراسة المعايير الصحية، الأوزان المناسبة، والدايكات الدقيق لخطوط التغليف الآلية فائقة السرعة.',
        content: 'يعد كرتون الإندربرد الصحي الخيار الأمثل للصناعات الدوائية والغذائية لضمان أعلى معايير النظافة...'
      }
    }
  },
  {
    id: 'art-2',
    slug: 'luxury-rigid-box-hot-foil-effects',
    title: 'تاثیر طلاکوب مات و برجسته‌سازی در جذابیت جعبه هاردباکس صادراتی',
    category: 'design',
    categoryLabel: 'طراحی بسته‌بندی',
    excerpt: 'چگونه تلفیق روکش‌های گالینگور، طلاکوب حرارتی و قفل‌های مگنتی ارزش برند شما را در بازارهای جهانی دوچندان می‌کند.',
    image: '/images/sections/cards/01.png',
    date: '۱۴۰۳/۰۵/۲۵',
    readTime: '۴ دقیقه',
    published: true,
    locales: {
      fa: {
        title: 'تاثیر طلاکوب مات و برجسته‌سازی در جذابیت جعبه هاردباکس صادراتی',
        excerpt: 'چگونه تلفیق روکش‌های گالینگور، طلاکوب حرارتی و قفل‌های مگنتی ارزش برند شما را در بازارهای جهانی دوچندان می‌کند.',
        content: 'در شلف‌های بین‌المللی زعفران و عطریات، اولین حس لمس و نگاه مشتری تعیین‌کننده تصمیم خرید است...'
      },
      en: {
        title: 'Impact of Matte Hot Foil Stamping & Embossing on Export Rigid Boxes',
        excerpt: 'How combining leatherette wrapping, thermal foil stamping, and neodymium magnetic closures multiplies perceived brand value.',
        content: 'On international retail shelves, the tactile feel of rigid packaging determines luxury perception...'
      },
      ar: {
        title: 'أثر البصمة الذهبية الحرارية والبروز على علب الهاردبوكس التصديرية',
        excerpt: 'كيف يضاعف دمج الجلد الفاخر، البصمة الحرارية والأقفال المغناطيسية من القيمة السوقية لعلامتك التجارية.',
        content: 'في الأسواق العالمية للزعفران والعطور الفاخرة، يمثل التغليف الصلب المغناطيسي الانطباع الأول للفخامة...'
      }
    }
  },
  {
    id: 'art-3',
    slug: 'heidelberg-speedmaster-installation-news',
    title: 'بهره‌برداری از جدیدترین خط چاپ ۵ رنگ هایدلبرگ در مجتمع نجم',
    category: 'news',
    categoryLabel: 'اخبار کارخانه',
    excerpt: 'افزایش ظرفیت تولید روزانه تا ۱۰۰ هزار جعبه و دقت کنترل تفکیک رنگ با تجهیزات اسپکتروفتومتری آنلاین.',
    image: '/images/sections/cards/03.png',
    date: '۱۴۰۳/۰۵/۱۸',
    readTime: '۳ دقیقه',
    published: true,
    locales: {
      fa: {
        title: 'بهره‌برداری از جدیدترین خط چاپ ۵ رنگ هایدلبرگ در مجتمع نجم',
        excerpt: 'افزایش ظرفیت تولید روزانه تا ۱۰۰ هزار جعبه و دقت کنترل تفکیک رنگ با تجهیزات اسپکتروفتومتری آنلاین.',
        content: 'با راه‌اندازی این خط چاپ پیشرفته هایدلبرگ، زمان تحویل سفارشات بزرگ صادراتی به کمتر از ۷ روز کاری کاهش یافت...'
      },
      en: {
        title: 'Commissioning of Heidelberg 5-Color Press at Najm Complex',
        excerpt: 'Boosting daily capacity to 100,000 cartons with online spectrophotometric closed-loop color control.',
        content: 'With the installation of this Heidelberg CD102 press line, lead times for large export runs are shortened to under 7 working days...'
      },
      ar: {
        title: 'تشغيل أحدث خطوط طباعة هايدلبرغ ٥ ألوان في مجمع نجم',
        excerpt: 'زيادة الطاقة الإنتاجية اليومية إلى ۱۰۰ ألف علبة مع نظام المراقبة اللونية الطيفية المتطورة.',
        content: 'مع تدشين ماكينة هايدلبرغ الجديدة، تم تقليص زمن تسليم الطلبيات التصديرية الكبرى إلى أقل من ٧ أيام عمل...'
      }
    }
  }
])

const categories = [
  { id: 'all', label: 'همه مقالات' },
  { id: 'technical', label: 'راهنمای فنی چاپ' },
  { id: 'news', label: 'اخبار کارخانه' },
  { id: 'design', label: 'طراحی بسته‌بندی' },
  { id: 'standards', label: 'استانداردها' }
]

const editingArticle = reactive<any>({
  id: '',
  slug: '',
  title: '',
  category: 'technical',
  excerpt: '',
  image: '/images/sections/cards/01.png',
  date: 'امروز',
  readTime: '۵ دقیقه',
  published: true,
  locales: {
    fa: { title: '', excerpt: '', content: '' },
    en: { title: '', excerpt: '', content: '' },
    ar: { title: '', excerpt: '', content: '' }
  }
})

function getCategoryCount(catId: string): number {
  if (catId === 'all') return articles.value.length
  return articles.value.filter(a => a.category === catId).length
}

const filteredArticles = computed(() => {
  return articles.value.filter(art => {
    if (activeCategory.value !== 'all' && art.category !== activeCategory.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return art.title?.toLowerCase().includes(q) || art.excerpt?.toLowerCase().includes(q)
    }
    return true
  })
})

function openArticleStudio(art: any) {
  if (art) {
    Object.assign(editingArticle, JSON.parse(JSON.stringify(art)))
    if (!editingArticle.locales) {
      editingArticle.locales = {
        fa: { title: art.title, excerpt: art.excerpt, content: '' },
        en: { title: art.title, excerpt: art.excerpt, content: '' },
        ar: { title: art.title, excerpt: art.excerpt, content: '' }
      }
    }
  } else {
    Object.assign(editingArticle, {
      id: '',
      slug: `article-${Date.now()}`,
      title: 'عنوان مقاله جدید',
      category: 'technical',
      image: '/images/sections/cards/01.png',
      date: 'امروز',
      readTime: '۵ دقیقه',
      published: true,
      locales: {
        fa: { title: 'عنوان مقاله جدید', excerpt: 'خلاصه مقاله را در اینجا وارد نمایید...', content: 'متن کامل مقاله...' },
        en: { title: 'New Article Title', excerpt: 'Article summary here...', content: 'Full article body...' },
        ar: { title: 'عنوان المقال الجديد', excerpt: 'ملخص المقال هنا...', content: 'نص المقال الكامل...' }
      }
    })
  }
  activeArticleLocale.value = 'fa'
  isEditingMode.value = true
}

function openMediaStudioForArticle() {
  openMediaStudio({
    path: `blog.${editingArticle.slug || 'article'}.image`,
    url: editingArticle.image,
    meta: { format: 'png', width: 800, height: 600 }
  })
}

async function saveArticle() {
  editingArticle.title = editingArticle.locales.fa.title || editingArticle.title
  editingArticle.excerpt = editingArticle.locales.fa.excerpt || editingArticle.excerpt

  const payload = JSON.parse(JSON.stringify(editingArticle))

  await $fetch('/api/admin/blog/save', {
    method: 'POST',
    body: payload
  }).catch(() => null)

  if (editingArticle.id) {
    const idx = articles.value.findIndex(a => a.id === editingArticle.id)
    if (idx !== -1) articles.value[idx] = payload
  } else {
    payload.id = `art-${Date.now()}`
    articles.value.unshift(payload)
  }

  isEditingMode.value = false
  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', text: 'مقاله با موفقیت ذخیره و منتشر شد.' } }))
}

function deleteArticle(id: string) {
  articles.value = articles.value.filter(a => a.id !== id)
}

async function loadData() {
  loading.value = true
  try {
    const mediaRes: any = await $fetch('/api/admin/media').catch(() => ({ items: [] }))
    galleryAssets.value = mediaRes?.items || []
  } catch (err) {
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
