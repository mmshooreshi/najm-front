// server/api/admin/sitemap.get.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const pbUrl = runtimeConfig.public?.pbUrl || process.env.PB_URL || 'http://65.108.80.205:8090'

  let livePagesMap: Record<string, any> = {}
  let livePagesList: any[] = []
  let productsList: any[] = []
  let mediaCount = 0

  try {
    // 1. Fetch live pages collection from PocketBase
    const pagesRes: any = await $fetch(`${pbUrl}/api/collections/pages/records`, {
      params: { perPage: 100 },
      timeout: 5000
    }).catch(() => null)

    if (pagesRes?.items) {
      livePagesList = pagesRes.items
      pagesRes.items.forEach((p: any) => {
        if (p.slug) {
          livePagesMap[p.slug] = p
        }
      })
    }

    // 2. Fetch live products from PocketBase
    const productsRes: any = await $fetch(`${pbUrl}/api/collections/products/records`, {
      params: { perPage: 50 },
      timeout: 5000
    }).catch(() => null)
    if (productsRes?.items) {
      productsList = productsRes.items
    }

    // 3. Fetch live media count
    const mediaRes: any = await $fetch(`${pbUrl}/api/collections/media_files/records`, {
      params: { perPage: 1 },
      timeout: 5000
    }).catch(() => null)
    if (mediaRes) {
      mediaCount = mediaRes.totalItems || 0
    }
  } catch (err) {
    // Offline / fallback
  }

  // Base Spatial Constellation Nodes
  const baseNodes = [
    {
      id: 'core-home',
      slug: 'home',
      type: 'nucleus',
      lens: 'pages',
      titleFa: 'مجتمع چاپ و بسته‌بندی نجم',
      titleEn: 'Najm Industrial Core',
      path: '/',
      descFa: 'هسته اصلی سامانه؛ تلفیق زیبایی‌شناسی صنعتی، صحنه‌های سه‌بعدی کاتالوگ و درگاه ورود مخاطبان.',
      descEn: 'The central industrial nucleus combining 3D product scenes and entry workflows.',
      icon: 'mdi:hexagon-multiple-outline',
      size: 210,
      x: 1800,
      y: 1300,
      defaultData: {
        titleFa: 'نوآوری در چاپ افست، مهندسی در بسته‌بندی',
        titleEn: 'Innovation in Offset Printing, Engineering in Packaging',
        subtitleFa: 'مجتمع تخصصی چاپ و بسته‌بندی نجم با اتکا به خطوط هایدلبرگ و بوبست',
        stats: '+۲۵ سال سابقه مستمر صنعتی • ۱۵M تیراژ سالانه'
      }
    },
    {
      id: 'about-pillar',
      slug: 'about',
      type: 'pillar',
      lens: 'pages',
      badgeFa: 'روایت صنعتی',
      badgeEn: 'Industrial Heritage',
      titleFa: 'درباره ما',
      titleEn: 'About Us',
      path: '/about',
      descFa: 'معرفی بیش از دو دهه سابقه، سرمایه انسانی و خطوط پیشرفته افست ۵ رنگ هایدلبرگ.',
      descEn: '25-year heritage, human craft leads, and advanced Heidelberg 5-color fleet.',
      icon: 'mdi:information-outline',
      accentColor: '#018786',
      size: 155,
      x: 1350,
      y: 950,
      defaultData: {
        titleFa: 'نوآوری در چاپ افست، مهندسی در ساختار بسته‌بندی',
        titleEn: 'Innovation in Offset Printing, Engineering in Packaging',
        subtitleFa: 'تولید یکپارچه با کیفیت میکرونی و پایش ۱۰۰٪ پچ‌ها',
        stats: 'ISO 12647-2 • نظارت مستقیم بر دقت تیغ'
      }
    },
    {
      id: 'about-pinned-solutions',
      slug: 'about-solutions',
      type: 'satellite',
      lens: 'pages',
      titleFa: 'راهکارهای پین‌شده 360vh',
      titleEn: '360vh Pinned Stage',
      path: '/about#solutions',
      descFa: 'استیج قفل‌شده چرخشی اسکرول با مورفینگ تصاویر و کنترل گام به گام راهکارها.',
      descEn: 'Sticky scroll-pinned stage with step-by-step image morphing.',
      icon: 'mdi:view-carousel-outline',
      accentColor: '#018786',
      x: 1050,
      y: 850,
      tag: 'Interactive',
      defaultData: {
        titleFa: '۴ گام تخصصی از ایده تا خروجی نهایی جعبه',
        titleEn: '4 Dedicated Engineering Steps',
        subtitleFa: 'مشاوره، CTP، چاپ ۵ رنگ و جعبه‌چسبانی اتوماتیک',
        stats: '۴ گام مجزا • اسکرول پین‌شده'
      }
    },
    {
      id: 'about-machinery',
      slug: 'machinery',
      type: 'satellite',
      lens: 'services',
      titleFa: 'ماشین‌آلات هایدلبرگ و بوبست',
      titleEn: 'Heidelberg & Bobst Fleet',
      path: '/about#facility',
      descFa: 'نمایش ناوگان ماشین‌های چاپ، دایکات و جعبه‌چسبانی با مشخصات فنی دقیق.',
      descEn: 'Detailed specs of Speedmaster 5-color, Bobst Die-cut & CTP.',
      icon: 'mdi:cog-transfer-outline',
      accentColor: '#018786',
      x: 1100,
      y: 1050,
      defaultData: {
        titleFa: 'ناوگان پیشرفته ماشین‌آلات صنعتی چاپ نجم',
        titleEn: 'Industrial Fleet & Modern Prepress Equipment',
        subtitleFa: 'هایدلبرگ اسپیدمستر ۷۲×۱۰۲، دایکات بوبست و لیتوگرافی حرارتی',
        stats: '۱۵,۰۰۰ برگ/ساعت • فشار تیغ ۳۰۰ تن'
      }
    },
    {
      id: 'products-pillar',
      slug: 'products',
      type: 'pillar',
      lens: 'products',
      badgeFa: 'کاتالوگ و متریال',
      badgeEn: 'Product Catalog',
      titleFa: 'محصولات و بسته‌بندی',
      titleEn: 'Packaging Catalog',
      path: '/products',
      descFa: 'آرشیو رده‌های محصول اختصاصی بر پایه مقواهای ایندربرد، کرافت، فلوت‌دار و هاردباکس لوکس.',
      descEn: 'Authentic packaging categories with custom SVG mockups and filters.',
      icon: 'mdi:package-variant-closed',
      accentColor: '#2563eb',
      size: 155,
      x: 2250,
      y: 950,
      defaultData: {
        titleFa: 'کاتالوگ انواع بسته‌بندی و مقواهای استاندارد',
        titleEn: 'Standard Paperboard & Packaging Catalog',
        subtitleFa: 'طراحی ساختار، جعبه‌های دارویی، آرایشی، غذایی و صنعتی',
        stats: `${productsList.length || 12} محصول فعال در دیتابیس`
      }
    },
    {
      id: 'products-detail-slug',
      slug: 'packaging-detail',
      type: 'satellite',
      lens: 'products',
      titleFa: 'صفحه جزئیات بسته‌بندی [slug]',
      titleEn: 'Packaging Detail [slug]',
      path: '/products/[slug]',
      descFa: 'بررسی مشخصات ساختاری، ابعاد تیغ، انطباق رنگ و سلفون حرارتی.',
      descEn: 'Detailed structural box specs, die-cuts, and foil coatings.',
      icon: 'mdi:cube-scan',
      accentColor: '#2563eb',
      x: 2550,
      y: 850,
      tag: 'Dynamic',
      defaultData: {
        titleFa: 'مشخصات فنی و استانداردهای گرماژ جعبه',
        titleEn: 'Technical Box Specs & GSM Standards',
        subtitleFa: 'ایندربرد ۲۵۰ الی ۴۰۰ گرم، سلفون حرارتی مات/براق و UV موضعی',
        stats: 'تحویل در کمترین زمان • تست خمش'
      }
    },
    {
      id: 'catalog-kit',
      slug: 'catalog',
      type: 'satellite',
      lens: 'products',
      titleFa: 'دانلود کاتالوگ و کیت نمونه',
      titleEn: 'Catalog & Sample Kit',
      path: '/catalog',
      descFa: 'دانلود فایل‌های جامع PDF و امکان سفارش فیزیکی نمونه‌های جعبه.',
      descEn: 'PDF downloads and physical material sample kit requests.',
      icon: 'mdi:file-pdf-box',
      accentColor: '#2563eb',
      x: 2550,
      y: 1050,
      defaultData: {
        titleFa: 'کاتالوگ جامع محصولات و نمونه‌های فیزیکی',
        titleEn: 'Comprehensive PDF Catalog & Material Kit',
        subtitleFa: 'دریافت رایگان کاتالوگ مهندسی و ارسال کیت جعبه‌ها به سراسر کشور',
        stats: 'نسخه PDF • ارسال پستی سمپل'
      }
    },
    {
      id: 'knowledge-pillar',
      slug: 'history',
      type: 'pillar',
      lens: 'knowledge',
      badgeFa: 'دانشنامه و تاریخچه',
      badgeEn: 'Knowledge & Press',
      titleFa: 'دانش و تاریخچه ۲۵ ساله',
      titleEn: 'Heritage & Blog',
      path: '/history',
      descFa: 'سیر تحول صنعتی از ۱۳۷۸ تا ۱۴۰۴ به همراه مقالات فنی پیش از چاپ و متریال‌شناسی.',
      descEn: '25-year milestone chronology and packaging engineering guides.',
      icon: 'mdi:timeline-text-outline',
      accentColor: '#d97706',
      size: 155,
      x: 2250,
      y: 1650,
      defaultData: {
        titleFa: '۲۵ سال تجربه مستمر در توسعه خطوط چاپ کشور',
        titleEn: '25 Years of Continuous Heritage & Growth',
        subtitleFa: 'از اولین دستگاه تک‌رنگ هایدلبرگ تا خطوط ۵ رنگ تمام‌اتوماتیک',
        stats: '۱۳۷۸ تا ۱۴۰۴ • بیش از ۵۰۰ مشتری صنعتی'
      }
    },
    {
      id: 'history-timeline',
      slug: 'history-timeline',
      type: 'satellite',
      lens: 'knowledge',
      titleFa: 'روایت ۲۵ سال تحول صنعتی',
      titleEn: '1999-2026 Chronology',
      path: '/history',
      descFa: 'روایت تصویری توسعه خطوط هایدلبرگ و بوبست در ۲۵ سال گذشته.',
      descEn: 'Milestones of press machinery installations.',
      icon: 'mdi:history',
      accentColor: '#d97706',
      x: 2550,
      y: 1550,
      defaultData: {
        titleFa: 'گاه‌شمار پیشرفت تجهیزات و دستاوردهای نجم',
        titleEn: 'Milestone Chronology (1999-2026)',
        subtitleFa: 'خرید دستگاه‌های لیتوگرافی CTP و خطوط تکمیلی بوبست',
        stats: '۸ نقطه عطف صنعتی'
      }
    },
    {
      id: 'blog-ecosystem',
      slug: 'blog',
      type: 'satellite',
      lens: 'knowledge',
      titleFa: 'وبلاگ تخصصی چاپ و بسته‌بندی',
      titleEn: 'Technical Blog Articles',
      path: '/blog',
      descFa: 'دانشنامه تخصصی گرماژ مقوا، سلفون مخملی و بهینه‌سازی زینک.',
      descEn: 'Paper GSM comparison, velvet lamination and prepress.',
      icon: 'mdi:post-outline',
      accentColor: '#d97706',
      x: 2550,
      y: 1750,
      defaultData: {
        titleFa: 'دانشنامه مقالات و راهنمای تخصصی طراحان',
        titleEn: 'Technical Articles & Printing Encyclopedia',
        subtitleFa: 'راهنمای آماده‌سازی زینک، مقایسه مقوای پشت طوسی و ایندربرد',
        stats: 'مقالات به‌روز • استانداردهای جهانی'
      }
    },
    {
      id: 'services-pillar',
      slug: 'services',
      type: 'pillar',
      lens: 'services',
      badgeFa: 'خدمات و کارخانه',
      badgeEn: 'Industrial Fleet',
      titleFa: 'خدمات و فرآیند تولید',
      titleEn: 'Services & Fleet',
      path: '/services',
      descFa: 'چرخه کامل پیش از چاپ، لیتوگرافی حرارتی CTP، چاپ افست ورقی و خطوط تکمیلی.',
      descEn: 'Full prepress, thermal CTP, Heidelberg offset, and automated gluing.',
      icon: 'mdi:factory',
      accentColor: '#9333ea',
      size: 155,
      x: 1350,
      y: 1650,
      defaultData: {
        titleFa: 'خدمات یکپارچه صفر تا صد چاپ و بسته‌بندی صنعتی',
        titleEn: 'Full Industrial Printing & Packaging Services',
        subtitleFa: 'مشاوره فنی، لیتوگرافی زینک CTP، چاپ افست، سلفون، دایکات و چسب',
        stats: '۱۰۰٪ درون مجتمع • نظارت دقیق'
      }
    },
    {
      id: 'guides-prepress',
      slug: 'guides',
      type: 'satellite',
      lens: 'services',
      titleFa: 'راهنمای آماده‌سازی فایل و تیغ',
      titleEn: 'Prepress & Dieline Guides',
      path: '/guides',
      descFa: 'استانداردهای ۳ الی ۵ میلی‌متر بلید، تفکیک رنگ پنتون و خروجی زینک.',
      descEn: 'Bleed guidelines, pantone separation, and dieline rules.',
      icon: 'mdi:book-open-page-variant-outline',
      accentColor: '#9333ea',
      x: 1050,
      y: 1550,
      defaultData: {
        titleFa: 'چک‌لیست ارسال فایل چاپی و فایل تیغ دایکات',
        titleEn: 'Prepress Checklist & Dieline Specifications',
        subtitleFa: 'پروفایل رنگی Fogra 39، رزولوشن ۳۰۰ DPI و خط‌تاهای بدون خطا',
        stats: 'دانلود فایل قالب • استانداردهای تیغ'
      }
    },
    {
      id: 'faq-help',
      slug: 'faq',
      type: 'satellite',
      lens: 'services',
      titleFa: 'مرکز راهنما و سوالات متداول',
      titleEn: 'FAQ Help Center',
      path: '/help/faq',
      descFa: 'پاسخ به سوالات حداقل تیراژ، نحوه ارسال بار و آزمون‌های کیفی.',
      descEn: 'Answers regarding minimum quantities and shipping.',
      icon: 'mdi:help-circle-outline',
      accentColor: '#9333ea',
      x: 1050,
      y: 1750,
      defaultData: {
        titleFa: 'پاسخ به متداول‌ترین پرسش‌های مدیران و طراحان',
        titleEn: 'Frequently Asked Questions & Support',
        subtitleFa: 'شرایط تیراژ، نحوه تست رنگ، زمان تحویل و بسته‌بندی پالت',
        stats: 'دسته‌بندی پرسش‌ها • پاسخ فوری'
      }
    },
    {
      id: 'contact-node',
      slug: 'contact',
      type: 'satellite',
      lens: 'pages',
      titleFa: 'استعلام قیمت و هماهنگی بازدید',
      titleEn: 'Instant Quote & Visit',
      path: '/contact',
      descFa: 'محاسبه آنلاین متریال، هماهنگی جلسه حضوری و شماره‌های مستقیم کارخانه.',
      descEn: 'Instant quote calculator and showroom booking.',
      icon: 'mdi:phone-in-talk-outline',
      accentColor: '#e11d48',
      x: 1800,
      y: 920,
      tag: 'Direct Action',
      defaultData: {
        titleFa: 'دریافت فوری پیش‌فاکتور و استعلام سفارشات',
        titleEn: 'Instant Quote & Factory Visit Booking',
        subtitleFa: 'تماس با کارشناسان فروش و بازدید حضوری از خطوط تولید',
        stats: 'پاسخگویی سریع • مشاوره فنی رایگان'
      }
    },
    {
      id: 'admin-cms-node',
      slug: 'admin-cms',
      type: 'satellite',
      lens: 'pages',
      titleFa: 'پیشخوان مدیریت و استودیو CMS',
      titleEn: 'Admin Studio & SWR Engine',
      path: '/dashboard/cms',
      descFa: 'مدیریت داده‌های سه زبانه، ویرایش در لحظه و پایگاه داده PocketBase.',
      descEn: 'Trilingual CMS studio with 0ms SWR instant hydration.',
      icon: 'mdi:view-dashboard-outline',
      accentColor: '#018786',
      x: 1800,
      y: 1680,
      tag: 'Admin Suite',
      defaultData: {
        titleFa: 'استودیو مرکزی مدیریت داده و تنظیمات',
        titleEn: 'Admin Studio & PocketBase Data Core',
        subtitleFa: 'کنترل کامل دیتابیس، کش SWR و مخزن رسانه',
        stats: 'Live Synced • 0ms Hydration'
      }
    },

    // Extra Live Pages directly present in PocketBase
    {
      id: 'pb-login',
      slug: 'login',
      type: 'satellite',
      lens: 'pages',
      titleFa: 'صفحه ورود و احراز هویت کاربران',
      titleEn: 'User Login & Auth',
      path: '/login',
      descFa: 'درگاه ورود با کد یکبار مصرف پیامکی و رمز عبور.',
      descEn: 'OTP and password user authentication gateway.',
      icon: 'mdi:lock-outline',
      accentColor: '#6366f1',
      x: 1450,
      y: 750,
      tag: 'Auth',
      defaultData: {
        titleFa: 'ورود یا ثبت‌نام در سامانه مشتریان',
        titleEn: 'Login or Sign Up',
        subtitleFa: 'دسترسی به سفارشات اختصاصی، فاکتورها و وضعیت بار',
        stats: 'OTP پیامکی • ورود امن'
      }
    },
    {
      id: 'pb-menu',
      slug: 'menu',
      type: 'satellite',
      lens: 'pages',
      titleFa: 'پیکربندی منوی ناوبری اصلی',
      titleEn: 'Main Navigation Menu',
      path: '/#menu',
      descFa: 'داده‌های ساختار منوی هدر و منوی تمام‌صفحه موبایل.',
      descEn: 'Navigation header menu items configuration.',
      icon: 'mdi:menu',
      accentColor: '#0ea5e9',
      x: 1800,
      y: 750,
      tag: 'Navigation',
      defaultData: {
        titleFa: 'منوی ناوبری سه‌زبانه سامانه',
        titleEn: 'Main Header Navigation',
        subtitleFa: 'لینک‌های دسترسی سریع به کاتالوگ و مقالات',
        stats: 'FA / EN / AR'
      }
    },
    {
      id: 'pb-footer',
      slug: 'footer',
      type: 'satellite',
      lens: 'pages',
      titleFa: 'پیکربندی فوتر و اطلاعات تماس',
      titleEn: 'Footer & Company Info',
      path: '/#footer',
      descFa: 'داده‌های فوتر سایت شامل کپی‌رایت، مجوزها و لینک‌های شبکه اجتماعی.',
      descEn: 'Footer copyright and social channel links.',
      icon: 'mdi:page-layout-footer',
      accentColor: '#64748b',
      x: 2150,
      y: 750,
      tag: 'Footer',
      defaultData: {
        titleFa: 'فوتر جامع و مجوزهای صنعتی',
        titleEn: 'Comprehensive Footer & Social Links',
        subtitleFa: 'مجوز وزارت ارشاد، نماد اعتماد الکترونیکی و نشان ملی ثبت',
        stats: '۳ بخش پیوندها'
      }
    }
  ]

  // Detect Live PocketBase vs Hardcoded Sample for Every Node
  const enrichedNodes = baseNodes.map(node => {
    const liveRecord = livePagesMap[node.slug]
    const isFromBackend = !!liveRecord
    
    return {
      ...node,
      source: isFromBackend ? 'backend' : 'hardcoded',
      backendRecordId: liveRecord?.id || null,
      liveData: liveRecord ? {
        titleFa: liveRecord.title || liveRecord.uiData?.fa?.title || node.defaultData.titleFa,
        titleEn: liveRecord.uiData?.en?.title || node.defaultData.titleEn,
        subtitleFa: liveRecord.uiData?.fa?.subtitle || node.defaultData.subtitleFa,
        stats: liveRecord.uiData?.fa?.stats || node.defaultData.stats,
        rawUiData: liveRecord.uiData || null
      } : {
        ...node.defaultData,
        rawUiData: null
      }
    }
  })

  return {
    success: true,
    timestamp: new Date().toISOString(),
    stats: {
      totalNodes: enrichedNodes.length,
      backendSyncedCount: enrichedNodes.filter(n => n.source === 'backend').length,
      hardcodedCount: enrichedNodes.filter(n => n.source === 'hardcoded').length,
      totalLivePagesInPB: livePagesList.length,
      totalLiveProductsInPB: productsList.length,
      mediaCount
    },
    livePocketBasePages: livePagesList.map(p => ({ id: p.id, slug: p.slug, title: p.title })),
    livePocketBaseProducts: productsList.map(p => ({ id: p.id, name: p.name, slug: p.slug })),
    nodes: enrichedNodes
  }
})
