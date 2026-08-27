// composables/useSiteSearch.ts
import { ref, computed, onMounted } from 'vue'
import MiniSearch from 'minisearch'
import { useLocale } from '@/composables/useLocale'

export interface SearchDoc {
  id: string
  titleFa: string
  titleEn: string
  titleAr: string
  category: 'products' | 'services' | 'resources' | 'pages'
  categoryLabelFa: string
  categoryLabelEn: string
  categoryLabelAr: string
  descFa: string
  descEn: string
  descAr: string
  url: string
  keywords: string[]
}

export interface LocalizedSearchItem {
  id: string
  title: string
  category: 'products' | 'services' | 'resources' | 'pages'
  categoryLabel: string
  description: string
  url: string
}

const searchDocuments: SearchDoc[] = [
  // Products - Packaging
  {
    id: 'prod-boxes',
    titleFa: 'انواع جعبه‌های مقوایی و هاردباکس',
    titleEn: 'Folding Cartons & Rigid Hardboxes',
    titleAr: 'علب الكرتون والصناديق الصلبة الفاخرة',
    category: 'products',
    categoryLabelFa: 'بسته‌بندی و جعبه',
    categoryLabelEn: 'Packaging & Boxes',
    categoryLabelAr: 'التغليف والعلب',
    descFa: 'تولید جعبه‌های دارویی، آرایشی، مواد غذایی و هاردباکس مگنتی',
    descEn: 'Manufacturing pharmaceutical, cosmetic, food boxes & magnetic rigid boxes',
    descAr: 'تصنيع علب الأدوية ومستحضرات التجميل والأغذية والعلب المغناطيسية',
    url: '/products/packaging/boxes',
    keywords: ['جعبه', 'هاردباکس', 'کارتن', 'مقوا', 'ایندربرد', 'باکس', 'لاک باتم', 'box', 'boxes', 'carton', 'rigid', 'hardbox', 'علبة', 'علب', 'كرتون', 'هاردبوكس']
  },
  {
    id: 'prod-shopping-bags',
    titleFa: 'ساک دستی کاغذی و مقوایی (شاپینگ بگ)',
    titleEn: 'Paper & Cardboard Shopping Bags',
    titleAr: 'أكياس التسوق الورقية والكرتونية',
    category: 'products',
    categoryLabelFa: 'بسته‌بندی و جعبه',
    categoryLabelEn: 'Packaging & Boxes',
    categoryLabelAr: 'التغليف والعلب',
    descFa: 'ساک‌های تبلیغاتی و فروشگاهی گلاسه، کرافت و مقوای کارتی',
    descEn: 'Premium retail and promotional coated, kraft and board gift bags',
    descAr: 'أكياس دعائية وترويجية من ورق الكرافت والمقوى اللامع',
    url: '/products/packaging/shopping-bags',
    keywords: ['ساک دستی', 'شاپینگ بگ', 'بگ', 'کرافت', 'کیسه کاغذی', 'bag', 'bags', 'shopping bag', 'paper bag', 'kraft', 'كيس', 'أكياس', 'شوبينغ باغ']
  },
  {
    id: 'prod-rigid-boxes',
    titleFa: 'هاردباکس لوکس و جعبه‌های سخت هدیه',
    titleEn: 'Luxury Rigid Boxes & Gift Packaging',
    titleAr: 'صناديق الهدايا الفاخرة والعلب الصلبة',
    category: 'products',
    categoryLabelFa: 'بسته‌بندی لوکس',
    categoryLabelEn: 'Luxury Packaging',
    categoryLabelAr: 'تغليف فاخر',
    descFa: 'جعبه‌های مگنتی، کشویی و کادویی لوکس با روکش مخمل و فوم لیزری',
    descEn: 'Magnetic, sliding and shoulder luxury boxes with custom EVA velvet inserts',
    descAr: 'علب مغناطيسية ومنزلقة فاخرة مع حشوات إسفنجية وطلاء مخملي',
    url: '/products/packaging/boxes',
    keywords: ['هاردباکس', 'جعبه سخت', 'لوکس', 'مگنتی', 'هدایا', 'عطر', 'طلا', 'luxury', 'rigid box', 'gift box', 'magnetic', 'صندوق', 'هدايا', 'فاخر']
  },

  // Products - Commercial & Editorial
  {
    id: 'print-letterhead',
    titleFa: 'سربرگ و ست اوراق اداری',
    titleEn: 'Corporate Letterhead & Stationery Sets',
    titleAr: 'الأوراق الرسمية والقرطاسية المؤسسية',
    category: 'products',
    categoryLabelFa: 'اوراق و چاپ اداری',
    categoryLabelEn: 'Corporate Stationery',
    categoryLabelAr: 'مطبوعات مكتبية',
    descFa: 'چاپ سربرگ A4 و A5 روی کاغذ تحریر، کتان و فانتزی با رنگ اختصاصی پنتون',
    descEn: 'A4 & A5 letterheads on bond, linen & fine textured stock with Pantone accuracy',
    descAr: 'طباعة أوراق المراسلات الرسمية على ورق عادي وكتان بألوان بانتون دقيقة',
    url: '/products/printing/letterhead',
    keywords: ['سربرگ', 'ست اداری', 'تحریر', 'کتان', 'کاغذ اداری', 'نامه', 'letterhead', 'stationery', 'office', 'ورق رسمي', 'أوراق رسمية']
  },
  {
    id: 'print-envelopes',
    titleFa: 'پاکت‌نامه و پاکت اداری A4 و ملخی',
    titleEn: 'Business Envelopes (A4, Pocket & Commercial)',
    titleAr: 'مغلفات الرسائل والمراسلات التجارية',
    category: 'products',
    categoryLabelFa: 'اوراق و چاپ اداری',
    categoryLabelEn: 'Corporate Stationery',
    categoryLabelAr: 'مطبوعات مكتبية',
    descFa: 'پاکت‌های اداری با چسب سیلیکونی آماده و چاپ پترن امنیتی داخلی',
    descEn: 'Peel-and-seal business envelopes with internal security tint pattern',
    descAr: 'مغلفات مراسلات رسمية مع شريط لاصق وطباعة داخلية أمنية',
    url: '/products/printing/envelopes',
    keywords: ['پاکت', 'پاکت نامه', 'پاکت A4', 'پاکت ملخی', 'envelope', 'envelopes', 'ظرف', 'مغلف', 'مغلفات']
  },
  {
    id: 'print-business-cards',
    titleFa: 'کارت ویزیت مدیریتی و لوکس',
    titleEn: 'Executive & Luxury Business Cards',
    titleAr: 'بطاقات العمل والزيارة الفاخرة',
    category: 'products',
    categoryLabelFa: 'اوراق و چاپ اداری',
    categoryLabelEn: 'Corporate Stationery',
    categoryLabelAr: 'مطبوعات مكتبية',
    descFa: 'کارت ویزیت لمینت برجسته، سلفون مخملی سافت‌تاچ، طلاکوب و PVC',
    descEn: 'Soft-touch matte velvet, spot UV, hot foil stamping & thick multilayer cards',
    descAr: 'بطاقات عمل بطبقة مخملية وطلاء ذهبي وبروز موضعي وبطاقات PVC',
    url: '/products/printing/business-cards',
    keywords: ['کارت ویزیت', 'لمینت', 'طلاکوب', 'سافت تاچ', 'مخملی', 'business card', 'cards', 'foil', 'بطاقة عمل', 'كارت فيزيت']
  },
  {
    id: 'print-catalogs',
    titleFa: 'بروشور و کاتالوگ‌های صنعتی',
    titleEn: 'Industrial Brochures & Product Catalogs',
    titleAr: 'الكتالوجات الصناعية والبروشورات الترويجية',
    category: 'products',
    categoryLabelFa: 'کاتالوگ و بازاریابی',
    categoryLabelEn: 'Catalogs & Marketing',
    categoryLabelAr: 'كتالوجات وتسويق',
    descFa: 'چاپ کاتالوگ‌های چندصفحه‌ای با صحافی چسب گرم PUR و منگنه لوپ',
    descEn: 'Multi-page high-definition catalogs with PUR perfect binding & saddle stitching',
    descAr: 'طباعة كتالوجات متعددة الصفحات مع تجليد حراري وملازم عالية الدقة',
    url: '/products/printing/brochures-catalogs',
    keywords: ['کاتالوگ', 'بروشور', 'دفترچه', 'ژورنال', 'صحافی', 'چسب گرم', 'catalog', 'catalogue', 'brochure', 'booklet', 'كتالوج', 'بروشور']
  },
  {
    id: 'print-books',
    titleFa: 'کتاب، مجلات و نشریات سازمانی',
    titleEn: 'Books, Journals & Corporate Publications',
    titleAr: 'الكتب والمجلات والنشرات المؤسسية',
    category: 'products',
    categoryLabelFa: 'چاپ و نشر',
    categoryLabelEn: 'Publishing & Print',
    categoryLabelAr: 'طباعة ونشر',
    descFa: 'چاپ تیراژ بالا انواع کتاب، فصلنامه، سالنامه و بولتن‌های تخصصی',
    descEn: 'High-volume book printing, corporate journals & quarterly magazines',
    descAr: 'طباعة الكتب والمجلات الدورية والنشرات السنوية بكميات صناعية',
    url: '/products/printing/books-magazines',
    keywords: ['کتاب', 'مجله', 'فصلنامه', 'نشریه', 'بولتن', 'book', 'magazine', 'journal', 'كتاب', 'مجلة', 'مطبوعات']
  },
  {
    id: 'print-calendars',
    titleFa: 'تقویم، سررسید و سالنامه اختصاصی',
    titleEn: 'Custom Planners, Diaries & Desk Calendars',
    titleAr: 'التقاويم المكتبية والأجندات السنوية',
    category: 'products',
    categoryLabelFa: 'هدایای تبلیغاتی',
    categoryLabelEn: 'Promotional Gifts',
    categoryLabelAr: 'هدايا دعائية',
    descFa: 'سررسید چرمی اختصاصی، تقویم رومیزی پایه چوبی و دیواری',
    descEn: 'Custom leather executive diaries, wooden desk calendars & wall planners',
    descAr: 'أجندات جلدية فاخرة وتقاويم مكتبية وجدارية مطبوعة بشعار المنشأة',
    url: '/products/printing/calendars-planners',
    keywords: ['تقویم', 'سررسید', 'سالنامه', 'تقویم رومیزی', 'calendar', 'planner', 'diary', 'تقويم', 'أجندة', 'مفكرة']
  },

  // Services
  {
    id: 'srv-printing-packaging',
    titleFa: 'چاپ افست ۵ رنگ ورقی هایدلبرگ',
    titleEn: 'Heidelberg 5-Color Sheet-fed Offset Printing',
    titleAr: 'طباعة الأوفست 5 ألوان من هايدلبرغ',
    category: 'services',
    categoryLabelFa: 'خدمات چاپ',
    categoryLabelEn: 'Printing Services',
    categoryLabelAr: 'خدمات الطباعة',
    descFa: 'سیستم‌های کنترل آنلاین اسپکتروفتومتری Prinect با سرعت ۱۵,۰۰۰ برگ در ساعت',
    descEn: 'Prinect inline spectrophotometric closed-loop color control up to 15,000 sheets/hour',
    descAr: 'أنظمة التحكم الطيفي المغلقة بسرعة تصل إلى 15,000 ورقة في الساعة',
    url: '/services/printing-and-packaging',
    keywords: ['چاپ افست', 'هایدلبرگ', '۵ رنگ', 'ورقی', 'پنتون', 'اسپکتوفتومتری', 'offset', 'heidelberg', 'offset printing', 'طباعة أوفست', 'هايدلبرغ']
  },
  {
    id: 'srv-finishing',
    titleFa: 'خدمات تکمیلی، طلاکوب، برجسته‌سازی و سلفون',
    titleEn: 'Post-Press Finishing, Hot Foiling & Lamination',
    titleAr: 'خدمات ما بعد الطباعة والتذهيب الحراري والسلفنة',
    category: 'services',
    categoryLabelFa: 'خدمات تکمیلی',
    categoryLabelEn: 'Finishing Services',
    categoryLabelAr: 'خدمات التشطيب',
    descFa: 'سلفون حرارتی مات و براق، طلاکوب دیجیتال و لترپرس، یووی موضعی شنی و برجسته',
    descEn: 'Thermal velvet matte & gloss lamination, precision hot foil stamping, textured spot UV',
    descAr: 'سلفنة حرارية مخملية، تذهيب حراري دقيق، ورنيش موضعي بارز ونقش مجسم',
    url: '/services/finishing-services',
    keywords: ['خدمات تکمیلی', 'طلاکوب', 'سلفون', 'یووی', 'برجسته‌سازی', 'امبوس', 'finishing', 'foil', 'lamination', 'uv', 'emboss', 'تذهيب', 'سلفنة', 'ورنيش']
  },
  {
    id: 'srv-lithography',
    titleFa: 'لیتوگرافی CTP و تفکیک رنگ دیجیتال',
    titleEn: 'Digital CTP Lithography & Pre-Press Imaging',
    titleAr: 'الليثوغرافيا الرقمية CTP وإعداد الصفائح',
    category: 'services',
    categoryLabelFa: 'پیش از چاپ',
    categoryLabelEn: 'Pre-Press Services',
    categoryLabelAr: 'ما قبل الطباعة',
    descFa: 'پلیت‌ستر هایدلبرگ Suprasetter با دقت ۲۵۴۰DPI و تهیه زینک بدون شیمیایی',
    descEn: 'Heidelberg Suprasetter thermal laser platesetter at 2540 DPI with chemistry-free plates',
    descAr: 'ماكينات تحضير الصفائح الحرارية بدقة 2540DPI بدون مواد كيميائية',
    url: '/services/lithography-and-plates',
    keywords: ['لیتوگرافی', 'پلیت', 'زینک', 'CTP', 'تفکیک رنگ', 'پروف دیجیتال', 'prepress', 'plates', 'litho', 'ليثوغرافيا', 'صفائح', 'زنك']
  },

  // Resources
  {
    id: 'res-catalog',
    titleFa: 'دانلود کاتالوگ جامع محصولات و مشخصات متریال (PDF)',
    titleEn: 'Download Full PDF Product Catalog & Material Spec Sheet',
    titleAr: 'تحميل الكتالوج الشامل لمنتجات ومواصفات الخامات (PDF)',
    category: 'resources',
    categoryLabelFa: 'کاتالوگ و راهنما',
    categoryLabelEn: 'Catalogs & Guides',
    categoryLabelAr: 'الكتالوجات والأدلة',
    descFa: 'نسخه باکیفیت کاتالوگ جامع ۴۸ صفحه‌ای به همراه جدول گرماژ مقواها و خدمات تکمیلی',
    descEn: '48-page high-resolution technical catalog with paperboard calipers & finishing samples',
    descAr: 'نسخة رقمية عالية الدقة 48 صفحة مع جداول أوزان الورق وعينات التشطيب',
    url: '/catalog',
    keywords: ['دانلود کاتالوگ', 'پی دی اف', 'PDF', 'کاتالوگ جامع', 'مشخصات فنی', 'download', 'pdf', 'catalog', 'spec', 'تحميل', 'ملف']
  },
  {
    id: 'res-dielines',
    titleFa: 'قالب‌های تیغ استاندارد و دایکات (Die-Lines)',
    titleEn: 'Standard Packaging Die-Line Templates (AI / PDF)',
    titleAr: 'قوالب سكاكين التغليف القياسية (Die-Lines)',
    category: 'resources',
    categoryLabelFa: 'قالب‌های تیغ',
    categoryLabelEn: 'Die-Line Templates',
    categoryLabelAr: 'قوالب السكاكين',
    descFa: 'دانلود فایل‌های وکتور قالب تیغ جعبه دارویی، پاکت‌نامه و ساک دستی برای دیزاینرها',
    descEn: 'Vector CAD die-line templates for cartons, folders, envelopes & shopping bags',
    descAr: 'تحميل ملفات فيكتور لقوالب سكاكين العلب والمغلفات والأكياس للمصممين',
    url: '/resources',
    keywords: ['قالب تیغ', 'دایکات', 'وکتور', 'ایلستریتور', 'دیزاین', 'dieline', 'die-line', 'template', 'vector', 'قالب', 'سكين']
  },

  // Main Pages
  {
    id: 'page-facilities',
    titleFa: 'کارخانه و ماشین‌آلات صنعتی چاپ و بسته‌بندی',
    titleEn: 'Industrial Machinery & Production Facilities Showcase',
    titleAr: 'المصنع وأسطول الماكينات الصناعية لإنتاج التغليف',
    category: 'pages',
    categoryLabelFa: 'صفحات وبسایت',
    categoryLabelEn: 'Site Pages',
    categoryLabelAr: 'صفحات الموقع',
    descFa: 'معرفی خطوط ۵ رنگ هایدلبرگ، دایکات اتوماتیک بوبست، خطوط هاردباکس و آزمایشگاه QC',
    descEn: 'Tour Heidelberg 5-color presses, Bobst die-cutters, rigid box lines & QC laboratory',
    descAr: 'جولة تعريفية بماكينات هايدلبرغ وبوبست وخطوط الصناديق الصلبة ومختبر الجودة',
    url: '/facilities',
    keywords: ['کارخانه', 'تجهیزات', 'ماشین آلات', 'امکانات', 'بوبست', 'هایدلبرگ', 'facilities', 'factory', 'machines', 'equipment', 'المصنع', 'الآلات']
  },
  {
    id: 'page-about',
    titleFa: 'درباره مجتمع چاپ و بسته‌بندی نجم',
    titleEn: 'About Najm Printing & Packaging Complex',
    titleAr: 'حول مجمع مطبعة وتغليف نجم',
    category: 'pages',
    categoryLabelFa: 'صفحات وبسایت',
    categoryLabelEn: 'Site Pages',
    categoryLabelAr: 'صفحات الموقع',
    descFa: 'بیش از دو دهه تجربه صنعتی، تیم مهندسی چاپ و تعهد به کیفیت پایدار',
    descEn: 'Over 25 years of industrial experience, structural engineering & green print standards',
    descAr: 'أكثر من عقدين من الخبرة الصناعية والهندسة الهيكلية ومعايير الطباعة المستدامة',
    url: '/about',
    keywords: ['درباره ما', 'تاریخچه', 'مجتمع نجم', 'تیم', 'رزومه', 'about', 'team', 'history', 'company', 'عن الشركة', 'من نحن']
  },
  {
    id: 'page-contact',
    titleFa: 'تماس با ما، نشانی کارخانه و استعلام قیمت',
    titleEn: 'Contact Us, Factory Location & Quote Estimation',
    titleAr: 'اتصل بنا، موقع المصنع ونموذج استعلام الأسعار',
    category: 'pages',
    categoryLabelFa: 'صفحات وبسایت',
    categoryLabelEn: 'Site Pages',
    categoryLabelAr: 'صفحات الموقع',
    descFa: 'شماره‌های تماس، آدرس دفتر مرکزی و کارخانه، فرم آنلاین استعلام تیراژ و نقشه گوگل',
    descEn: 'Telephone numbers, factory address, online quote form & interactive map directions',
    descAr: 'أرقام الهواتف، عنوان المصنع، نموذج الاستعلام المباشر وخريطة الموقع',
    url: '/contact',
    keywords: ['تماس با ما', 'آدرس', 'تلفن', 'استعلام', 'قیمت', 'نقشه', 'contact', 'phone', 'address', 'quote', 'اتصل بنا', 'عنوان', 'هاتف']
  },
  {
    id: 'page-consultation',
    titleFa: 'مشاوره تخصصی رایگان چاپ و بسته‌بندی',
    titleEn: 'Free Packaging Engineering Consultation',
    titleAr: 'استشارة هندسية وفنية مجانية في التغليف والطباعة',
    category: 'pages',
    categoryLabelFa: 'مشاوره رایگان',
    categoryLabelEn: 'Free Advisory',
    categoryLabelAr: 'استشارة مجانية',
    descFa: 'رزرو جلسه مشاوره با مهندسان ساختار، بررسی گرماژ مقوا و ساخت ماکت فیزیکی رایگان',
    descEn: 'Book a session with packaging engineers, review board caliper & request free prototypes',
    descAr: 'حجز جلسة استشارية مع مهندسي الهياكل وفحص العينات وتصنيع ماكت مجاني',
    url: '/consultation',
    keywords: ['مشاوره', 'مشاوره رایگان', 'استعلام', 'مهندسی بسته بندی', 'consultation', 'advisory', 'free advice', 'استشارة', 'استشارة مجانية']
  },
  {
    id: 'page-faq',
    titleFa: 'مرکز راهنما و پرسش‌های متداول (FAQ)',
    titleEn: 'Help Center & Frequently Asked Questions (FAQ)',
    titleAr: 'مركز المساعدة والأسئلة الشائعة (FAQ)',
    category: 'pages',
    categoryLabelFa: 'مرکز راهنما',
    categoryLabelEn: 'Help Center',
    categoryLabelAr: 'مركز المساعدة',
    descFa: 'پاسخ به سوالات حداقل تیراژ (MOQ)، فرمت فایل‌های چاپی، زمان‌بندی و لجستیک ارسال',
    descEn: 'Answers regarding minimum order quantities, print file formats, timelines & shipping',
    descAr: 'إجابات حول الحد الأدنى للكميات وصيغ الملفات والمهل الزمنية والشحن',
    url: '/help/faq',
    keywords: ['سوالات متداول', 'راهنما', 'تیراژ', 'فرمت فایل', 'faq', 'help', 'questions', 'أسئلة شائعة', 'مساعدة']
  }
]

export function useSiteSearch() {
  const { language } = useLocale()
  const query = ref('')
  const activeCategory = ref<string>('all')
  const recentSearches = ref<string[]>([])
  let miniSearchInstance: MiniSearch | null = null

  function normalizeSearchText(str: string): string {
    return (str || '')
      .toLowerCase()
      .replace(/[يی]/g, 'ی')
      .replace(/[كک]/g, 'ک')
      .replace(/[\u064B-\u065F]/g, '') // remove Arabic diacritics
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width spaces
      .trim()
  }

  function initSearchEngine() {
    if (miniSearchInstance) return

    miniSearchInstance = new MiniSearch({
      fields: ['searchContent', 'keywordsStr'],
      storeFields: ['id'],
      searchOptions: {
        boost: { searchContent: 2, keywordsStr: 1.5 },
        prefix: true,
        fuzzy: 0.2
      }
    })

    const preparedDocs = searchDocuments.map(doc => ({
      id: doc.id,
      searchContent: normalizeSearchText(
        `${doc.titleFa} ${doc.titleEn} ${doc.titleAr} ${doc.descFa} ${doc.descEn} ${doc.descAr} ${doc.categoryLabelFa} ${doc.categoryLabelEn} ${doc.categoryLabelAr}`
      ),
      keywordsStr: normalizeSearchText((doc.keywords || []).join(' '))
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

  function localizeDoc(doc: SearchDoc): LocalizedSearchItem {
    const lang = (language.value || 'FA').toUpperCase()
    if (lang === 'EN') {
      return {
        id: doc.id,
        title: doc.titleEn || doc.titleFa,
        category: doc.category,
        categoryLabel: doc.categoryLabelEn || doc.categoryLabelFa,
        description: doc.descEn || doc.descFa,
        url: doc.url
      }
    } else if (lang === 'AR') {
      return {
        id: doc.id,
        title: doc.titleAr || doc.titleFa,
        category: doc.category,
        categoryLabel: doc.categoryLabelAr || doc.categoryLabelFa,
        description: doc.descAr || doc.descFa,
        url: doc.url
      }
    }
    return {
      id: doc.id,
      title: doc.titleFa,
      category: doc.category,
      categoryLabel: doc.categoryLabelFa,
      description: doc.descFa,
      url: doc.url
    }
  }

  const results = computed<LocalizedSearchItem[]>(() => {
    const q = query.value.trim()
    if (!q) return []
    if (!miniSearchInstance) initSearchEngine()

    const normalizedQuery = normalizeSearchText(q)
    const searchHits = miniSearchInstance?.search(normalizedQuery) || []
    
    const mapped: LocalizedSearchItem[] = []
    for (const hit of searchHits) {
      const doc = searchDocuments.find(d => d.id === hit.id)
      if (doc) {
        mapped.push(localizeDoc(doc))
      }
    }

    // Direct substring fallback if miniSearch yields 0 results for short/special queries
    if (mapped.length === 0) {
      for (const doc of searchDocuments) {
        const fullContent = normalizeSearchText(
          `${doc.titleFa} ${doc.titleEn} ${doc.titleAr} ${doc.descFa} ${doc.descEn} ${doc.descAr} ${(doc.keywords || []).join(' ')}`
        )
        if (fullContent.includes(normalizedQuery)) {
          mapped.push(localizeDoc(doc))
        }
      }
    }

    if (activeCategory.value !== 'all') {
      return mapped.filter(r => r.category === activeCategory.value)
    }

    return mapped
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
    activeCategory,
    results,
    categorizedResults,
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches
  }
}
