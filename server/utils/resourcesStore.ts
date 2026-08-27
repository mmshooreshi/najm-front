// server/utils/resourcesStore.ts
import fs from 'node:fs'
import path from 'node:path'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

const RESOURCES_FILE_PATH = path.resolve(process.cwd(), '.data', 'resources.json')

const initialSeedResources = [
  {
    id: 'res-1',
    slug: 'catalog-general-2026',
    category: 'catalogs',
    categoryLabel: 'کاتالوگ',
    fileFormat: 'PDF',
    fileSize: '14.2 MB',
    icon: 'mdi:book-open-page-variant-outline',
    downloadUrl: '/images/sections/footer/trust.png',
    order: 1,
    locales: {
      fa: {
        title: 'کاتالوگ جامع محصولات و خدمات چاپ نجم',
        categoryLabel: 'کاتالوگ',
        description: 'معرفی خطوط تولید چاپ افست هایدلبرگ، انواع جعبه‌های مقوایی، هاردباکس لوکس، ساک‌های دستی و نمونه‌های تولیدی سال جاری.',
        content: 'کاتالوگ جامع مجتمع چاپ و بسته‌بندی نجم شامل کلیه استانداردهای تولید، جدول گرماژ انواع مقوا، نمونه رنگ‌های سازمانی و توانمندی‌های خطوط دایکات و جعبه‌چسبانی اتوماتیک می‌باشد.'
      },
      en: {
        title: 'Najm Printing & Packaging General Catalog 2026',
        categoryLabel: 'Catalog',
        description: 'Comprehensive showcase of Heidelberg 5-color offset presses, luxury rigid boxes, folding cartons, and shopping bags.',
        content: 'Official catalog featuring machinery specifications, substrate weight charts, finishing techniques, and international export packaging portfolios.'
      },
      ar: {
        title: 'الكتالوج الشامل لمنتجات وخدمات مجمع نجم للطباعة',
        categoryLabel: 'كتالوج',
        description: 'استعراض خطوط طباعة هايدلبرغ الأوفست، علب الهاردبوكس الفاخرة، الكرتون المصفح وأكياس التسوق.',
        content: 'الكتالوج الرسمي الشامل لمجمع نجم متضمناً مواصفات الماكينات، جداول أوزان الورق والكرتون والتشطيبات الفاخرة للتصدير.'
      }
    }
  },
  {
    id: 'res-2',
    slug: 'catalog-luxury-packaging',
    category: 'catalogs',
    categoryLabel: 'کاتالوگ',
    fileFormat: 'PDF',
    fileSize: '18.5 MB',
    icon: 'mdi:package-variant-closed',
    downloadUrl: '/images/sections/cards/01.png',
    order: 2,
    locales: {
      fa: {
        title: 'کاتالوگ بسته‌بندی‌های لوکس و هاردباکس صادراتی',
        categoryLabel: 'کاتالوگ',
        description: 'نمونه ساختارهای ویژه جعبه‌های مگنتی، کشویی، روکش‌دار و جلوه‌های طلاکوب و یووی موضعی برای زعفران و عطر.',
        content: 'مجموعه‌ای بی‌نظیر از جعبه‌های سخت کتابی، مگنتی نئودیمیوم و جعبه‌های ۳ تیکه با مقوای کرجی فشرده و فوم‌های مخملی.'
      },
      en: {
        title: 'Luxury Rigid Boxes & Export Packaging Catalog',
        categoryLabel: 'Catalog',
        description: 'Showcase of magnetic closures, slide boxes, thermal hot foil stamping, and tactile spot UV for luxury saffron and fragrances.',
        content: 'Exclusive collection of book-style boxes, neodymium magnetic lids, and 3-piece premium boxes with velvet thermoformed inserts.'
      },
      ar: {
        title: 'كتالوج علب الهاردبوكس الفاخرة والتغليف التصديري',
        categoryLabel: 'كتالوج',
        description: 'نماذج العلب المغناطيسية، علب السحاب، البصمة الحرارية واليو في الموضعي للزعفران والعطور الفاخرة.',
        content: 'مجموعة متميزة من علب الهاردبوكس الصلبة المكسوة بالجلد الفاخر مع حشوات فوم مخملية وقواطع داخلية هندسية.'
      }
    }
  },
  {
    id: 'res-3',
    slug: 'guide-cmyk-color-profile',
    category: 'guides',
    categoryLabel: 'راهنمای فنی',
    fileFormat: 'PDF',
    fileSize: '3.8 MB',
    icon: 'mdi:palette-swatch-outline',
    downloadUrl: '/images/sections/cards/02.png',
    order: 3,
    locales: {
      fa: {
        title: 'راهنمای آماده‌سازی فایل و پروفایل رنگی CMYK',
        categoryLabel: 'راهنمای فنی',
        description: 'دستورالعمل خروجی PDF/X-1a، تنظیم رزولوشن ۳۰۰DPI، درصد ترکیب رنگ مشکی پرکلاغی (Rich Black) و Overprint.',
        content: 'جهت جلوگیری از تغییر رنگ هنگام چاپ افست، تمامی فایل‌ها باید در فضای رنگی CMYK و با پروفایل استاندارد Fogra39 یا Coated GRACol آماده شوند. درصد مشکی پرکلاغی استاندارد: C:50 M:40 Y:30 K:100.'
      },
      en: {
        title: 'Artwork Preparation & CMYK Color Profile Guide',
        categoryLabel: 'Technical Guide',
        description: 'Instructions for PDF/X-1a export, 300 DPI resolution, Rich Black formula (C:50 M:40 Y:30 K:100), and overprint setup.',
        content: 'To ensure color fidelity on Heidelberg sheetfed presses, design artwork must use standard Fogra39 or Coated GRACol color profiles.'
      },
      ar: {
        title: 'دليل إعداد ملفات التصميم وبروفايل الألوان CMYK',
        categoryLabel: 'دليل فني',
        description: 'إرشادات تصدير PDF/X-1a بدقة ۳۰۰ DPI، تركيبة اللون الأسود الغني (Rich Black) وإعدادات الطباعة الفوقية.',
        content: 'لضمان تطابق الألوان على ماكينات الأوفست، يجب تحويل جميع العناصر لنمط CMYK مع بروفايل Fogra39 القياسي.'
      }
    }
  },
  {
    id: 'res-4',
    slug: 'guide-bleed-and-margins',
    category: 'guides',
    categoryLabel: 'راهنمای فنی',
    fileFormat: 'PDF',
    fileSize: '2.1 MB',
    icon: 'mdi:ruler-square',
    downloadUrl: '/images/sections/cards/03.png',
    order: 4,
    locales: {
      fa: {
        title: 'راهنمای لبه برش (Bleed)، خط تا و محدوده امن تیغ',
        categoryLabel: 'راهنمای فنی',
        description: 'استانداردهای تنظیم ۳ تا ۵ میلیمتر لبه اضافه‌رنگ (Bleed) برای جعبه‌ها و بروشورها جهت جلوگیری از سفیدی لبه کار.',
        content: 'فاصله تمامی متون و آیکون‌های حساس از خط تیغ باید حداقل ۵ میلی‌متر باشد. خطوط تا با رنگ مجزا (قرمز/آبی) و در لایه اختصاصی نام‌گذاری شوند.'
      },
      en: {
        title: 'Bleed, Creasing Line & Safe Margins Technical Guide',
        categoryLabel: 'Technical Guide',
        description: 'Standards for setting 3mm to 5mm bleed margins for folding boxes and brochures to prevent unprinted white edges.',
        content: 'Keep all critical text and icons at least 5mm away from die-cut lines. Die lines and crease lines must be assigned separate spot colors on dedicated layers.'
      },
      ar: {
        title: 'دليل هوامش الأمان والقص (Bleed) وخطوط التكسير',
        categoryLabel: 'دليل فني',
        description: 'معايير ضبط ۳ إلى ٥ مم هوامش إضافية للعلب والبروشورات لتفادي الحواف البيضاء أثناء القص الآلي.',
        content: 'يجب إبعاد النصوص الهامة عن خط التكسير بمسافة لا تقل عن ٥ مم وتخصيص طبقات منفصلة لخطوط الدايكات.'
      }
    }
  },
  {
    id: 'res-5',
    slug: 'template-tuck-end-box',
    category: 'templates',
    categoryLabel: 'قالب تیغ',
    fileFormat: 'AI / PDF',
    fileSize: '5.4 MB',
    icon: 'mdi:vector-square',
    downloadUrl: '/images/products/1.png',
    order: 5,
    locales: {
      fa: {
        title: 'قالب تیغ استاندارد جعبه درب‌دار دارویی و بهداشتی (Tuck-End)',
        categoryLabel: 'قالب تیغ دایکات',
        description: 'فایل برداری وکتور خطوط تیغ، خط‌تا و زبانه چسب در فرمت‌های Adobe Illustrator و PDF آماده طراحی گرافیک.',
        content: 'این قالب استاندارد مناسب مقواهای ایندربرد ۲۵۰ تا ۳۵۰ گرم برای بسته‌بندی قطره‌های چشمی، پمادها و محصولات آرایشی بهداشتی می‌باشد.'
      },
      en: {
        title: 'Standard Tuck-End Folding Carton Dieline Template',
        categoryLabel: 'Dieline Template',
        description: 'Vector AI & PDF dieline with cut, crease, and glue flap lines ready for packaging graphic designers.',
        content: 'Standard template calibrated for 250g-350g SBS paperboard, ideal for pharmaceuticals, cosmetics, and health bottles.'
      },
      ar: {
        title: 'قالب دايكات قياسي لعلب الأدوية ومستحضرات التجميل (Tuck-End)',
        categoryLabel: 'قالب تكسير فيكتور',
        description: 'ملف فيكتور مفتوح AI/PDF لخطوط القص والطي ولسان الغراء جاهز للمصممين.',
        content: 'قالب هندسي دقيق مخصص لكرتون الإندربرد ۲٥۰ إلى ۳٥۰ جم لمنتجات الأدوية والتجميل.'
      }
    }
  },
  {
    id: 'res-6',
    slug: 'template-auto-bottom-box',
    category: 'templates',
    categoryLabel: 'قالب تیغ',
    fileFormat: 'AI / PDF',
    fileSize: '6.1 MB',
    icon: 'mdi:cube-outline',
    downloadUrl: '/images/products/2.png',
    order: 6,
    locales: {
      fa: {
        title: 'قالب تیغ جعبه قفل خودکار کف (Auto-Bottom Lock)',
        categoryLabel: 'قالب تیغ دایکات',
        description: 'ساختار استاندارد مناسب خطوط پرکنی سریع دارویی، بهداشتی و فست‌فود با مقاومت کف بالا بدون نیاز به چسب دستی.',
        content: 'طراحی شده جهت باز شدن سریع در خط تولید با استحکام کف تا ۳ کیلوگرم وزن محصول.'
      },
      en: {
        title: 'Auto-Bottom Crash Lock Dieline Template',
        categoryLabel: 'Dieline Template',
        description: 'Heavy-duty bottom lock structure for high-speed automated packaging lines supporting up to 3kg payload.',
        content: 'Pre-glued folding carton dieline engineered for instant setup on packing lines without manual tape or glue.'
      },
      ar: {
        title: 'قالب دايكات لعلب القفل التلقائي للقاعدة (Auto-Bottom)',
        categoryLabel: 'قالب تكسير فيكتور',
        description: 'هيكل متين لخطوط التعبئة السريعة يتحمل أوزان المنتجات حتى ۳ كغم دون الحاجة لغراء يدوي.',
        content: 'تصميم عالي الكفاءة يتيح الفتح الفوري في خطوط الإنتاج الدوائية والغذائية.'
      }
    }
  }
]

function ensureStorageDir() {
  const dir = path.dirname(RESOURCES_FILE_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(RESOURCES_FILE_PATH)) {
    fs.writeFileSync(RESOURCES_FILE_PATH, JSON.stringify(initialSeedResources, null, 2), 'utf-8')
  }
}

export function readLocalResources(): any[] {
  ensureStorageDir()
  try {
    const raw = fs.readFileSync(RESOURCES_FILE_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialSeedResources
  } catch {
    return initialSeedResources
  }
}

export function writeLocalResources(items: any[]) {
  ensureStorageDir()
  try {
    fs.writeFileSync(RESOURCES_FILE_PATH, JSON.stringify(items, null, 2), 'utf-8')
  } catch (err) {}
}

export async function getAllResources(): Promise<any[]> {
  const localItems = readLocalResources()
  return localItems.sort((a, b) => (a.order || 0) - (b.order || 0))
}

export async function getResourceBySlug(slug: string): Promise<any | null> {
  const all = await getAllResources()
  return all.find(r => r.slug === slug || r.id === slug) || null
}

export async function saveResource(item: any): Promise<any> {
  const localItems = readLocalResources()
  let savedItem = { ...item }

  if (!savedItem.id) {
    savedItem.id = `res-${Date.now()}`
    savedItem.order = localItems.length + 1
    localItems.push(savedItem)
  } else {
    const idx = localItems.findIndex(r => r.id === savedItem.id)
    if (idx !== -1) {
      localItems[idx] = { ...localItems[idx], ...savedItem }
    } else {
      localItems.push(savedItem)
    }
  }

  writeLocalResources(localItems)
  return savedItem
}

export async function removeResource(id: string): Promise<boolean> {
  const localItems = readLocalResources()
  const filtered = localItems.filter(r => r.id !== id && r.slug !== id)
  writeLocalResources(filtered)
  return true
}

export async function reorderResources(ids: string[]): Promise<boolean> {
  const localItems = readLocalResources()
  const map = new Map(localItems.map(item => [item.id, item]))

  const reordered: any[] = []
  ids.forEach((id, index) => {
    const it = map.get(id)
    if (it) {
      it.order = index + 1
      reordered.push(it)
      map.delete(id)
    }
  })

  // Append any remaining items
  for (const remaining of map.values()) {
    remaining.order = reordered.length + 1
    reordered.push(remaining)
  }

  writeLocalResources(reordered)
  return true
}
