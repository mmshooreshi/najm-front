// server/api/admin/sitemap.get.ts
import { defineEventHandler } from 'h3'

export interface SitemapNode {
  id: string
  titleFa: string
  titleEn: string
  path: string
  descFa: string
  descEn: string
  icon: string
  level: number
  subNodes?: string[]
}

export interface SitemapGroup {
  id: string
  labelFa: string
  labelEn: string
  icon: string
  children: SitemapNode[]
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const pbUrl = runtimeConfig.public?.pbUrl || 'http-[#018786]'

  let pagesCount = 0
  let productsCount = 0
  let mediaCount = 0
  let livePages: any[] = []

  try {
    // 1. Fetch live pages collection from PocketBase
    const pagesRes: any = await $fetch(`${pbUrl}/api/collections/pages/records`, {
      params: { perPage: 50 },
      timeout: 3000
    }).catch(() => null)

    if (pagesRes?.items) {
      livePages = pagesRes.items
      pagesCount = pagesRes.totalItems || pagesRes.items.length
    }

    // 2. Fetch live products count from PocketBase
    const productsRes: any = await $fetch(`${pbUrl}/api/collections/products/records`, {
      params: { perPage: 1 },
      timeout: 3000
    }).catch(() => null)
    if (productsRes) {
      productsCount = productsRes.totalItems || 0
    }

    // 3. Fetch live media count
    const mediaRes: any = await $fetch(`${pbUrl}/api/collections/media_files/records`, {
      params: { perPage: 1 },
      timeout: 3000
    }).catch(() => null)
    if (mediaRes) {
      mediaCount = mediaRes.totalItems || 0
    }
  } catch (err) {
    // Fallback if PocketBase connection is lazy
  }

  // Build Dynamic Dynamic Sitemap Tree from Backend Data
  const dynamicGroups: SitemapGroup[] = [
    {
      id: 'commercial',
      labelFa: 'عمومی و تجاری',
      labelEn: 'Commercial Pages',
      icon: 'mdi:domain',
      children: [
        {
          id: 'about',
          titleFa: 'درباره ما (روایت صنعتی)',
          titleEn: 'About Us',
          path: '/about',
          descFa: 'معرفی تیم متخصص، خطوط تولید هایدلبرگ و راهکارهای 360vh پین‌شده.',
          descEn: 'Industrial heritage, technical team, and 360vh solutions stage.',
          icon: 'mdi:information-outline',
          level: 2,
          subNodes: ['AboutGsapPinnedSection (Sticky 360vh)', 'تیم متخصص و لیتوگرافی CTP', 'ماشین‌آلات ۵ رنگ']
        },
        {
          id: 'contact',
          titleFa: 'تماس و استعلام قیمت',
          titleEn: 'Contact & Quote',
          path: '/contact',
          descFa: 'فرم‌های استعلام قیمت، نقشه نشان و شماره‌های مستقیم واحد فروش.',
          descEn: 'Instant quote calculator, location map, and direct support lines.',
          icon: 'mdi:phone-outline',
          level: 2,
          subNodes: ['فرم استعلام قیمت', 'نقشه نشان/گوگل', 'پشتیبانی مستقیم']
        }
      ]
    },
    {
      id: 'catalog',
      labelFa: 'کاتالوگ و محصولات',
      labelEn: 'Catalog & Products',
      icon: 'mdi:package-variant-closed',
      children: [
        {
          id: 'products',
          titleFa: `کاتالوگ محصولات (${productsCount > 0 ? productsCount + ' آیتم' : '۱۲ نوع'})`,
          titleEn: 'Products Catalog',
          path: '/products',
          descFa: 'محصولات واقعی با موکاپ‌های وکتور SVG و فیلترهای پیشرفته.',
          descEn: 'Authentic packaging products with vector SVG mockups.',
          icon: 'mdi:package-variant',
          level: 2,
          subNodes: [`تعداد رکورد دیتابیس: ${productsCount || 12}`, 'حالت شبکه / لیست', 'فیلتر دسته‌بندی']
        },
        {
          id: 'products-detail',
          titleFa: 'جزئیات محصول و بسته‌بندی',
          titleEn: 'Product Detail',
          path: '/products/[slug]',
          descFa: 'مشخصات فنی مقوا، سلفون حرارتی و دایکات.',
          descEn: 'Technical specs for packaging, lamination, and die-cutting.',
          icon: 'mdi:cube-outline',
          level: 3,
          subNodes: ['مشخصات فنی مقوا', 'پوشش‌های تکمیلی UV', 'استعلام تیراژ']
        }
      ]
    },
    {
      id: 'knowledge',
      labelFa: 'دانش، اخبار و تاریخچه',
      labelEn: 'Knowledge & Press',
      icon: 'mdi:post-outline',
      children: [
        {
          id: 'history',
          titleFa: 'تاریخچه ۲۵ ساله (۱۳۷۸ تا ۱۴۰۴)',
          titleEn: '25-Year History',
          path: '/history',
          descFa: 'تایم‌لاین کرونولوژیک صنعتی از ۱۳۷۸ تا ۱۴۰۴.',
          descEn: '25-year chronological journey timeline from 1999 to 2026.',
          icon: 'mdi:timeline-text-outline',
          level: 2,
          subNodes: ['تایم‌لاین ۱۳۷۸ تا ۱۴۰۴', 'تجهیزات افست هایدلبرگ', 'ماشین‌های بوبست']
        },
        {
          id: 'blog',
          titleFa: 'وبلاگ تخصصی چاپ',
          titleEn: 'Technical Blog',
          path: '/blog',
          descFa: 'مقالات مقایسه ایندربرد و پشت طوسی و سلفون مخملی.',
          descEn: 'Technical articles on paperboard specs and prepress.',
          icon: 'mdi:post',
          level: 2,
          subNodes: ['مقالات پیش از چاپ', 'راهنمای بسته‌بندی صادراتی', 'دسته مقواها']
        }
      ]
    },
    {
      id: 'help',
      labelFa: 'پشتیبانی و راهنماها',
      labelEn: 'Help & Resources',
      icon: 'mdi:help-circle-outline',
      children: [
        {
          id: 'faq',
          titleFa: 'سوالات متداول (FAQ)',
          titleEn: 'FAQ Help Center',
          path: '/help/faq',
          descFa: 'مرکز آکاردئونی دسته‌بندی‌شده سوالات تیراژ و ارسال.',
          descEn: 'Categorized accordion help center for ordering.',
          icon: 'mdi:help-circle',
          level: 2,
          subNodes: ['سوالات آماده‌سازی فایل', 'حداقل تیراژ سفارش', 'نحوه ارسال']
        },
        {
          id: 'catalog-download',
          titleFa: 'دانلود کاتالوگ جامع',
          titleEn: 'Download Catalog',
          path: '/catalog',
          descFa: 'دانلود فایل‌های PDF و سفارش نمونه فیزیکی.',
          descEn: 'Download PDF catalogs and order physical sample kits.',
          icon: 'mdi:download',
          level: 2,
          subNodes: ['دانلود PDF کاتالوگ', 'سفارش نمونه فیزیکی']
        }
      ]
    },
    {
      id: 'admin',
      labelFa: 'مدیریت و پیشخوان',
      labelEn: 'Admin Management',
      icon: 'mdi:view-dashboard-outline',
      children: [
        {
          id: 'dashboard-cms',
          titleFa: 'مدیریت محتوای صفحات (CMS)',
          titleEn: 'CMS Studio',
          path: '/dashboard/cms',
          descFa: 'ویرایشگر درگاه پیش‌نویس با کارت‌های آکاردئونی.',
          descEn: 'In-place CMS page studio.',
          icon: 'mdi:file-document-edit-outline',
          level: 3,
          subNodes: ['ویرایش سه زبانه', 'ذخیره پیش‌نویس', 'انتشار رسمی']
        },
        {
          id: 'dashboard-media',
          titleFa: `مخزن رسانه و فایل‌ها (${mediaCount > 0 ? mediaCount + ' فایل' : 'فعال'})`,
          titleEn: 'Media Lab',
          path: '/dashboard/media',
          descFa: 'مدیریت پوشه‌های درختی توئیده معتبر.',
          descEn: 'Recursive directory tree media manager.',
          icon: 'mdi:folder-multiple-image',
          level: 3,
          subNodes: [`تعداد رسانه‌ها: ${mediaCount}`, 'درخت پوشه‌ها', 'فیلتر پسوند']
        }
      ]
    }
  ]

  // Inject any extra dynamic pages from PocketBase
  if (livePages.length > 0) {
    const dynamicChildren = livePages.map(p => ({
      id: `pb-${p.slug}`,
      titleFa: p.title || `صفحه ${p.slug}`,
      titleEn: `Page ${p.slug}`,
      path: `/${p.slug === 'home' ? '' : p.slug}`,
      descFa: 'صفحه پویا ثبت‌شده در دیتابیس PocketBase',
      descEn: 'Dynamic page record registered in PocketBase database',
      icon: 'mdi:file-document-outline',
      level: 2,
      subNodes: ['داده‌های uiData سه زبانه', 'ذخیره‌سازی پیش‌نویس SWR']
    }))

    const customGroup = dynamicGroups.find(g => g.id === 'commercial')
    if (customGroup) {
      // Merge unique pages
      dynamicChildren.forEach(dc => {
        if (!customGroup.children.some(c => c.path === dc.path)) {
          customGroup.children.push(dc)
        }
      })
    }
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    stats: {
      pagesCount,
      productsCount,
      mediaCount
    },
    groups: dynamicGroups
  }
})
