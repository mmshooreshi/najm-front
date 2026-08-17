// composables/useSiteSearch.ts
import { ref, computed, onMounted } from 'vue'
import MiniSearch from 'minisearch'

export interface SearchDoc {
  id: string
  title: string
  category: 'products' | 'services' | 'resources' | 'pages'
  categoryLabel: string
  description?: string
  url: string
  keywords?: string[]
}

const searchDocuments: SearchDoc[] = [
  // Products - Packaging
  {
    id: 'prod-boxes',
    title: 'انواع جعبه‌های مقوایی و هاردباکس',
    category: 'products',
    categoryLabel: 'بسته‌بندی و جعبه',
    description: 'تولید جعبه‌های دارویی، آرایشی، مواد غذایی و هاردباکس مگنتی',
    url: '/products/packaging/boxes',
    keywords: ['جعبه', 'هاردباکس', 'کارتن', 'مقوا', 'ایندربرد', 'باکس', 'لاک باتم']
  },
  {
    id: 'prod-shopping-bags',
    title: 'ساک دستی کاغذی و مقوایی (شاپینگ بگ)',
    category: 'products',
    categoryLabel: 'بسته‌بندی و جعبه',
    description: 'ساک‌های تبلیغاتی و فروشگاهی گلاسه، کرافت و مقوای کارتی',
    url: '/products/packaging/shopping-bags',
    keywords: ['ساک دستی', 'شاپینگ بگ', 'بگ', 'کرافت', 'کیسه کاغذی']
  },
  {
    id: 'prod-rigid-boxes',
    title: 'هاردباکس لوکس و جعبه‌های سخت',
    category: 'products',
    categoryLabel: 'بسته‌بندی و جعبه',
    description: 'جعبه‌های مگنتی، کشویی و کادویی لوکس با فوم لیزری',
    url: '/products/packaging/boxes',
    keywords: ['هاردباکس', 'جعبه سخت', 'لوکس', 'مگنتی', 'هدایا', 'عطر', 'طلا']
  },

  // Products - Commercial Printing
  {
    id: 'print-letterhead',
    title: 'سربرگ و ست اداری',
    category: 'products',
    categoryLabel: 'اوراق و چاپ اداری',
    description: 'چاپ سربرگ A4 و A5 روی کاغذ تحریر، کتان و فانتزی',
    url: '/products/printing/letterhead',
    keywords: ['سربرگ', 'ست اداری', 'تحریر', 'کتان', 'کاغذ اداری', 'نامه']
  },
  {
    id: 'print-envelopes',
    title: 'پاکت‌نامه و پاکت اداری A4 و ملخی',
    category: 'products',
    categoryLabel: 'اوراق و چاپ اداری',
    description: 'پاکت‌های اداری با چسب آماده و چاپ داخلی امنیتی',
    url: '/products/printing/envelopes',
    keywords: ['پاکت', 'پاکت نامه', 'پاکت A4', 'پاکت ملخی', 'پاکت پستی']
  },
  {
    id: 'print-business-cards',
    title: 'کارت ویزیت لوکس و مدیریتی',
    category: 'products',
    categoryLabel: 'اوراق و چاپ اداری',
    description: 'کارت ویزیت لمینت برجسته، سلفون مخملی و طلاکوب',
    url: '/products/printing/business-cards',
    keywords: ['کارت ویزیت', 'لمینت', 'طلاکوب', 'سافت تاچ', 'مخملی', 'PVC']
  },
  {
    id: 'print-catalogs',
    title: 'بروشور و کاتالوگ‌های صنعتی',
    category: 'products',
    categoryLabel: 'کاتالوگ و بازاریابی',
    description: 'چاپ کاتالوگ‌های چندصفحه‌ای با صحافی چسب گرم PUR و منگنه لوپ',
    url: '/products/printing/brochures-catalogs',
    keywords: ['کاتالوگ', 'بروشور', 'دفترچه', 'ژورنال', 'صحافی', 'چسب گرم']
  },
  {
    id: 'print-books',
    title: 'کتاب، مجلات و نشریات سازمانی',
    category: 'products',
    categoryLabel: 'چاپ و نشر',
    description: 'چاپ تیراژ بالا انواع کتاب، فصلنامه و بولتن‌های تخصصی',
    url: '/products/printing/books-magazines',
    keywords: ['کتاب', 'مجله', 'فصلنامه', 'نشریه', 'بولتن', 'چاپ کتاب']
  },
  {
    id: 'print-calendars',
    title: 'تقویم، سررسید و سالنامه',
    category: 'products',
    categoryLabel: 'هدایای تبلیغاتی',
    description: 'سررسید اختصاصی، تقویم رومیزی و دیواری با چاپ اختصاصی',
    url: '/products/printing/calendars-planners',
    keywords: ['تقویم', 'سررسید', 'سالنامه', 'تقویم رومیزی', 'هدایای نوروزی']
  },
  {
    id: 'print-labels',
    title: 'لیبل، برچسب و استیکر رول/شیت',
    category: 'products',
    categoryLabel: 'لیبل و برچسب',
    description: 'لیبل‌های ضدآب، متالایز، شیشه‌ای و کاغذی با چسبندگی قوی',
    url: '/products/printing/labels-stickers',
    keywords: ['لیبل', 'برچسب', 'استیکر', 'متالایز', 'پشت چسبدار', 'رول']
  },
  {
    id: 'print-folders',
    title: 'فولدر و پوشه اسناد اداری',
    category: 'products',
    categoryLabel: 'اوراق و چاپ اداری',
    description: 'فولدرهای مقوایی سلفونی با جیب اختصاصی کارت و CD',
    url: '/products/printing/folders',
    keywords: ['فولدر', 'پوشه', 'فولدر اداری', 'پوشه مدارک']
  },

  // Services
  {
    id: 'service-design',
    title: 'طراحی، ماکت‌سازی و فرم‌بندی',
    category: 'services',
    categoryLabel: 'خدمات تخصصی',
    description: 'طراحی ساختار جعبه، ساخت نمونه ماکت اولیه و فرم‌بندی استاندارد',
    url: '/services/design-and-layout',
    keywords: ['طراحی', 'ماکت سازی', 'فرم بندی', 'طراحی جعبه', 'قالب سازی']
  },
  {
    id: 'service-lithography',
    title: 'لیتوگرافی و زینک دیجیتال CTP',
    category: 'services',
    categoryLabel: 'خدمات تخصصی',
    description: 'خروجی زینک حرارتی بدون خطا با تفکیک رنگ میکرونی',
    url: '/services/lithography-and-plates',
    keywords: ['لیتوگرافی', 'زینک', 'CTP', 'پلیت', 'تفکیک رنگ']
  },
  {
    id: 'service-offset',
    title: 'چاپ افست و چاپ بسته‌بندی صنعتی',
    category: 'services',
    categoryLabel: 'خدمات تخصصی',
    description: 'چاپ افست ۵ رنگ و ۴ رنگ هایدلبرگ با کنترل رنگ آنلاین',
    url: '/services/printing-and-packaging',
    keywords: ['چاپ افست', 'هایدلبرگ', 'چاپ صنعتی', 'افست', 'چاپ ۵ رنگ']
  },
  {
    id: 'service-finishing',
    title: 'خدمات تکمیلی، سلفون‌کشی، طلاکوب و دایکات',
    category: 'services',
    categoryLabel: 'خدمات تخصصی',
    description: 'سلفون مات/براق، یووی موضعی، طلاکوب گرم، دایکات بوبست و جعبه‌چسبانی',
    url: '/services/finishing-services',
    keywords: ['خدمات تکمیلی', 'سلفون', 'طلاکوب', 'یووی', 'دایکات', 'جعبه چسبانی']
  },
  {
    id: 'service-storage',
    title: 'نگهداری و انبارداری محصولات چاپ‌شده',
    category: 'services',
    categoryLabel: 'خدمات تخصصی',
    description: 'انبارش ایمن سفارشات تیراژ بالا و ارسال پالت‌بندی شده مرحله‌ای',
    url: '/services/storage-and-warehousing',
    keywords: ['انبارداری', 'نگهداری', 'ارسال', 'پالت بندی', 'لجستیک']
  },

  // Industries
  {
    id: 'ind-food',
    title: 'بسته‌بندی صنایع غذایی و رستورانی',
    category: 'products',
    categoryLabel: 'راهکار صنایع',
    description: 'جعبه‌های فودگرید بهداشتی، ساک کرافت و بسته‌بندی بیرون‌بر',
    url: '/products/industries/food-beverage-restaurant',
    keywords: ['صنایع غذایی', 'رستوران', 'فست فود', 'شکلات', 'شیرینی', 'کافه']
  },
  {
    id: 'ind-pharma',
    title: 'بسته‌بندی دارویی و پزشکی',
    category: 'products',
    categoryLabel: 'راهکار صنایع',
    description: 'جعبه دارو، خط بریل، بروشور داخل جعبه و پلمپ امنیتی',
    url: '/products/industries/medical-pharmaceutical',
    keywords: ['دارو', 'پزشکی', 'داروسازی', 'شربت', 'قرص', 'بریل']
  },
  {
    id: 'ind-beauty',
    title: 'بسته‌بندی آرایشی و بهداشتی',
    category: 'products',
    categoryLabel: 'راهکار صنایع',
    description: 'جعبه‌های نفیس کرم، عطر، لوسیون و ماسک با جلوه‌های لوکس',
    url: '/products/industries/beauty-health',
    keywords: ['آرایشی', 'بهداشتی', 'عطر', 'ادکلن', 'کرم', 'پوستی']
  },

  // Resources
  {
    id: 'res-general-catalog',
    title: 'کاتالوگ جامع محصولات و خدمات چاپ نجم (PDF)',
    category: 'resources',
    categoryLabel: 'مرکز منابع',
    description: 'دانلود کاتالوگ جامع معرفی خطوط چاپ و نمونه کارها',
    url: '/resources/catalog-general-2026',
    keywords: ['کاتالوگ جامع', 'دانلود کاتالوگ', 'پی دی اف', 'PDF', 'نمونه کار']
  },
  {
    id: 'res-cmyk-guide',
    title: 'راهنمای آماده‌سازی فایل و پروفایل رنگی CMYK',
    category: 'resources',
    categoryLabel: 'مرکز منابع',
    description: 'دستورالعمل خروجی PDF/X-1a و رزولوشن ۳۰۰DPI',
    url: '/resources/guide-cmyk-color-profile',
    keywords: ['راهنمای رنگ', 'CMYK', 'سی ام وای کی', 'پروفایل رنگ', 'DPI', 'کیفیت چاپ']
  },
  {
    id: 'res-diecut-templates',
    title: 'قالب‌های تیغ استاندارد جعبه و ساک دستی',
    category: 'resources',
    categoryLabel: 'مرکز منابع',
    description: 'فایل‌های برداری وکتور AI و PDF خطوط تیغ و خط‌تا',
    url: '/resources/template-tuck-end-box',
    keywords: ['قالب تیغ', 'دایکات', 'Die cut', 'تیغ جعبه', 'وکتور', 'Illustrator']
  },

  // Pages
  {
    id: 'page-about',
    title: 'درباره ما، داستان و تجهیزات چاپ نجم',
    category: 'pages',
    categoryLabel: 'صفحات سایت',
    description: 'آشنایی با تاریخچه، ارزش‌ها، ظرفیت تولید و ماشین‌آلات نجم',
    url: '/about',
    keywords: ['درباره ما', 'تاریخچه', 'هایدلبرگ', 'کارخانه', 'مجتمع چاپ']
  },
  {
    id: 'page-contact',
    title: 'تماس با ما، نشانی و استعلام قیمت',
    category: 'pages',
    categoryLabel: 'صفحات سایت',
    description: 'راه‌های ارتباطی، شماره‌های تماس، لوکیشن کارخانه و فرم سفارش',
    url: '/contact',
    keywords: ['تماس با ما', 'آدرس', 'تلفن', 'لوکیشن', 'استعلام قیمت', 'نقشه']
  }
]

// Normalize Persian and Arabic text for exact indexing & fuzzy search
function normalizePersianText(text: string): string {
  if (!text) return ''
  return text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F]/g, '') // remove Arabic diacritics
    .trim()
    .toLowerCase()
}

export function useSiteSearch() {
  const query = ref('')
  const recentSearches = ref<string[]>([])
  let miniSearchInstance: MiniSearch<SearchDoc> | null = null

  function initSearchEngine() {
    miniSearchInstance = new MiniSearch<SearchDoc>({
      fields: ['title', 'description', 'keywords', 'categoryLabel'],
      storeFields: ['id', 'title', 'category', 'categoryLabel', 'description', 'url'],
      processTerm: (term) => normalizePersianText(term),
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
        boost: { title: 3, keywords: 2, description: 1 }
      }
    })

    // Index documents
    const preparedDocs = searchDocuments.map(doc => ({
      ...doc,
      titleNorm: normalizePersianText(doc.title),
      keywordsNorm: (doc.keywords || []).map(k => normalizePersianText(k)).join(' ')
    }))

    miniSearchInstance.addAll(preparedDocs)
  }

  function loadRecentSearches() {
    if (import.meta.client) {
      const stored = localStorage.getItem('najm_recent_searches')
      if (stored) {
        try {
          recentSearches.value = JSON.parse(stored)
        } catch {
          recentSearches.value = []
        }
      }
    }
  }

  function saveRecentSearch(term: string) {
    if (!term || !term.trim() || !import.meta.client) return
    const clean = term.trim()
    const filtered = recentSearches.value.filter(s => s !== clean)
    filtered.unshift(clean)
    recentSearches.value = filtered.slice(0, 8)
    localStorage.setItem('najm_recent_searches', JSON.stringify(recentSearches.value))
  }

  function removeRecentSearch(term: string) {
    recentSearches.value = recentSearches.value.filter(s => s !== term)
    if (import.meta.client) {
      localStorage.setItem('najm_recent_searches', JSON.stringify(recentSearches.value))
    }
  }

  function clearAllRecentSearches() {
    recentSearches.value = []
    if (import.meta.client) {
      localStorage.removeItem('najm_recent_searches')
    }
  }

  onMounted(() => {
    initSearchEngine()
    loadRecentSearches()
  })

  const results = computed<SearchDoc[]>(() => {
    const q = query.value.trim()
    if (!q) return []
    if (!miniSearchInstance) initSearchEngine()

    const searchHits = miniSearchInstance?.search(normalizePersianText(q)) || []
    return searchHits.map(hit => {
      const original = searchDocuments.find(d => d.id === hit.id)
      return (original || hit) as SearchDoc
    })
  })

  const categorizedResults = computed(() => {
    const res = results.value
    return {
      products: res.filter(r => r.category === 'products'),
      services: res.filter(r => r.category === 'services'),
      resources: res.filter(r => r.category === 'resources'),
      pages: res.filter(r => r.category === 'pages')
    }
  })

  return {
    query,
    results,
    categorizedResults,
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches
  }
}
