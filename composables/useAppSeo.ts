// composables/useAppSeo.ts
import { computed } from 'vue'
import { useHead, useRoute } from '#app'
import { useLocale } from '~/composables/useLocale'

export interface SeoOptions {
  title?: string | { fa?: string; en?: string; ar?: string }
  description?: string | { fa?: string; en?: string; ar?: string }
  keywords?: string | string[]
  image?: string
  type?: 'website' | 'article' | 'product'
  slug?: string
  noindex?: boolean
  extraSchemas?: any[]
  faqItems?: Array<{ question: string; answer: string }>
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function useAppSeo(options: SeoOptions = {}) {
  const route = useRoute()
  const { language } = useLocale()

  const currentLang = computed(() => {
    const l = (language.value || 'FA').toUpperCase()
    return l === 'EN' ? 'EN' : l === 'AR' ? 'AR' : 'FA'
  })

  const isRTL = computed(() => currentLang.value === 'FA' || currentLang.value === 'AR')

  // Brand Name localized
  const brandName = computed(() => {
    if (currentLang.value === 'EN') return 'Najm Printing & Packaging'
    if (currentLang.value === 'AR') return 'مجمع نجم للطباعة والتغليف'
    return 'مجتمع چاپ و بسته‌بندی نجم'
  })

  // Title calculation
  // Title calculation
  const pageTitle = computed(() => {
    let raw = ''
    if (typeof options.title === 'object' && options.title !== null) {
      raw = options.title[currentLang.value.toLowerCase() as 'fa' | 'en' | 'ar'] || options.title.fa || ''
    } else if (typeof options.title === 'string') {
      raw = options.title
    }
    if (!raw) {
      if (currentLang.value === 'EN') return `${brandName.value} | Industrial Printing & Luxury Packaging`
      if (currentLang.value === 'AR') return `${brandName.value} | طباعة أوفست وتغليف فاخر`
      return `${brandName.value} | چاپ افست و جعبه‌سازی صنعتی`
    }
    // Check if brandName is already included in raw to prevent ugly duplicate titles
    if (
      raw.includes(brandName.value) ||
      raw.includes('چاپ و بسته‌بندی نجم') ||
      raw.includes('چاپ نجم') ||
      raw.includes('Najm Printing')
    ) {
      return raw
    }
    return `${raw} | ${brandName.value}`
  })

  // Description calculation
  const metaDescription = computed(() => {
    if (typeof options.description === 'object' && options.description !== null) {
      return options.description[currentLang.value.toLowerCase() as 'fa' | 'en' | 'ar'] || options.description.fa || ''
    }
    if (typeof options.description === 'string' && options.description) {
      return options.description
    }
    if (currentLang.value === 'EN') {
      return 'Najm Printing & Packaging Complex: Custom cardboard boxes, luxury rigid boxes, and premium packaging solutions with highest printing quality in Tehran.'
    }
    if (currentLang.value === 'AR') {
      return 'مجمع نجم للطباعة والتغليف: تصميم وتصنيع علب الكرتون الفاخرة، هاردبوکس، والتغليف الدوائي بأعلى معايير الجودة في طهران.'
    }
    return 'مجتمع چاپ و بسته‌بندی نجم؛ طراحی و تولید انواع جعبه‌های مقوایی، هاردباکس و بسته‌بندی‌های لوکس با بالاترین استانداردهای چاپ در تهران.'
  })

  // Canonical base URL & Clean Path for Multi-Lingual Alternate Links
  const baseUrl = 'https://chapenajm.com'
  const cleanPath = computed(() => {
    let p = options.slug ? (options.slug.startsWith('/') ? options.slug : `/${options.slug}`) : (route.path || '/')
    return p.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/'
  })

  const faUrl = computed(() => `${baseUrl}${cleanPath.value === '/' ? '' : cleanPath.value}`)
  const enUrl = computed(() => `${baseUrl}/en${cleanPath.value === '/' ? '' : cleanPath.value}`)
  const arUrl = computed(() => `${baseUrl}/ar${cleanPath.value === '/' ? '' : cleanPath.value}`)

  const canonicalUrl = computed(() => {
    if (currentLang.value === 'EN') return enUrl.value
    if (currentLang.value === 'AR') return arUrl.value
    return faUrl.value
  })
  const socialImage = options.image || `${baseUrl}/social-image.png`

  // Default High-Authority Industrial FAQs for Google Rich Snippets
  const defaultFaqs = [
    {
      question: 'حداقل تیراژ سفارش تولید جعبه و بسته‌بندی در مجتمع نجم چقدر است؟',
      answer: 'حداقل تیراژ برای انواع جعبه‌های مقوایی (ایندربرد، کرافت، بهداشتی) ۱,۰۰۰ عدد و برای هاردباکس‌های لوکس و مگنتی ۵۰۰ عدد می‌باشد.'
    },
    {
      question: 'چه ماشین‌آلات و خطوط چاپی در چاپ نجم مستقر هستند؟',
      answer: 'مجتمع مجهز به خطوط چاپ افست ورقی هایدلبرگ Speedmaster، پلیت‌ستر حرارتی CTP، دستگاه‌های دایکات و تیغ‌زنی تمام اتوماتیک، طلاکوب گرم و خطوط جعبه‌چسبانی مدرن با استاندارد ISO 12647-2 می‌باشد.'
    },
    {
      question: 'مدت زمان نمونه‌سازی و تحویل نهایی سفارشات چقدر است؟',
      answer: 'نمونه‌سازی ماکت فیزیکی رایگان ظرف ۴۸ ساعت و تولید نهایی سفارشات با تیراژ صنعتی ظرف ۵ الی ۷ روز کاری پس از تأیید نهایی انجام می‌پذیرد.'
    },
    {
      question: 'آیا امکان سفارش بسته‌بندی‌های بهداشتی و دارویی وجود دارد؟',
      answer: 'بله، تمامی سفارشات دارویی، آرایشی و غذایی با مقوای بهداشتی ایندربرد دارای گواهی سلامت و پوشش‌های بهداشتی ضدچربی و رطوبت تولید می‌شوند.'
    }
  ]

  const activeFaqs = options.faqItems && options.faqItems.length > 0 ? options.faqItems : defaultFaqs

  // Google Sitelinks Navigation Items (6-Pack with Titles & Rich Descriptions for Google SERP)
  const siteNavigationItems = computed(() => {
    if (currentLang.value === 'EN') {
      return [
        {
          name: 'Contact & Location',
          description: 'Direct sales phone lines, factory address in Tehran, business hours, and quotation inquiries.',
          url: `${baseUrl}/contact`
        },
        {
          name: 'Products & Packaging',
          description: 'Custom cardboard boxes, pharmaceutical packaging, food grade cartons, and luxury rigid boxes.',
          url: `${baseUrl}/products`
        },
        {
          name: 'Comprehensive Catalog',
          description: 'Download industrial product catalog, view past works, and packaging structural specifications.',
          url: `${baseUrl}/catalog`
        },
        {
          name: 'Printing Facilities & Machinery',
          description: 'Advanced multi-color Heidelberg offset presses, pre-press CTP plates, and automated finishing lines.',
          url: `${baseUrl}/facilities`
        },
        {
          name: 'About Najm Complex',
          description: '25+ years of continuous printing heritage, ISO color standards, and industrial packaging vision.',
          url: `${baseUrl}/about`
        },
        {
          name: 'Consultation & Pricing',
          description: 'Free packaging engineering consultation, paperboard selection, and quotation calculation.',
          url: `${baseUrl}/consultation`
        }
      ]
    }
    if (currentLang.value === 'AR') {
      return [
        {
          name: 'اتصل بنا',
          description: 'أرقام الاتصال المباشر، عنوان المصنع في طهران، وساعات العمل واستشارات المبيعات.',
          url: `${baseUrl}/contact`
        },
        {
          name: 'المنتجات والتغليف',
          description: 'علب الكرتون المخصصة، التغليف الدوائي، علب الأغذية، وعلب هاردبوكس الفاخرة.',
          url: `${baseUrl}/products`
        },
        {
          name: 'كتالوج المنتجات',
          description: 'تحميل كتالوج المنتجات الصناعية، الاطلاع على نماذج الأعمال والمواصفات الفنية.',
          url: `${baseUrl}/catalog`
        },
        {
          name: 'الماكينات والتجهيزات',
          description: 'ماكينات هايدلبرغ ٥ ألوان المتطورة، خطوط التقطيع والتشطيب الآلية، والليثوغرافيا الحرارية CTP.',
          url: `${baseUrl}/facilities`
        },
        {
          name: 'حول مجمع نجم',
          description: 'أكثر من ٢٥ عاماً من الخبرة في صناعة الطباعة والتغليف ومعايير إدارة الألوان ISO.',
          url: `${baseUrl}/about`
        },
        {
          name: 'استشارة واستعلام الأسعار',
          description: 'استشارات هندسة التغليف واختيار نوع الكرتون وحساب تكلفة الإنتاج والتوريد.',
          url: `${baseUrl}/consultation`
        }
      ]
    }
    // Persian Default
    return [
      {
        name: 'تماس با ما',
        description: 'اطلاعات تماس مستقیم، شماره تلفن‌های کارشناسان فروش، نشانی کارخانه در تهران و ساعات کاری.',
        url: `${baseUrl}/contact`
      },
      {
        name: 'محصولات و بسته‌بندی',
        description: 'تولید تخصصی انواع جعبه مقوایی، دارویی، بهداشتی، فست‌فود، بگ شاپینگ و هاردباکس‌های لوکس.',
        url: `${baseUrl}/products`
      },
      {
        name: 'کاتالوگ جامع محصولات',
        description: 'مشاهده و دانلود کاتالوگ صنعتی محصولات، نمونه‌کارهای اجرا شده و مشخصات فنی بسته‌بندی.',
        url: `${baseUrl}/catalog`
      },
      {
        name: 'خطوط تولید و ماشین‌آلات',
        description: 'خطوط پیشرفته چاپ افست ورقی هایدلبرگ، لیتوگرافی هوشمند CTP و تجهیزات اتوماتیک جعبه‌چسبانی.',
        url: `${baseUrl}/facilities`
      },
      {
        name: 'درباره مجتمع چاپ نجم',
        description: 'بیش از ۲۵ سال پیشینه مستمر صنعتی، استانداردهای مدیریت کیفیت رنگ ISO و تعهد به مشتریان.',
        url: `${baseUrl}/about`
      },
      {
        name: 'مشاوره و استعلام قیمت',
        description: 'مشاوره رایگان مهندسی بسته‌بندی، انتخاب گرماژ مقوا، طراحی ماکت و محاسبه دقیق تیراژ و هزینه.',
        url: `${baseUrl}/consultation`
      }
    ]
  })

  // Breadcrumbs
  const breadcrumbItems = computed(() => {
    if (options.breadcrumbs && options.breadcrumbs.length > 0) {
      return options.breadcrumbs
    }
    const pathSegments = cleanPath.value.replace(/^\//, '').split('/').filter(Boolean)
    const items = [{ name: currentLang.value === 'EN' ? 'Home' : (currentLang.value === 'AR' ? 'الرئيسية' : 'خانه'), url: baseUrl }]
    let acc = ''
    for (const segment of pathSegments) {
      acc += `/${segment}`
      const segName = segment === 'catalog' ? 'کاتالوگ'
        : segment === 'products' ? 'محصولات'
        : segment === 'services' ? 'خدمات'
        : segment === 'facilities' ? 'تجهیزات و ماشین‌آلات'
        : segment === 'contact' ? 'تماس با ما'
        : segment === 'consultation' ? 'مشاوره و استعلام'
        : segment === 'about' ? 'درباره ما'
        : segment === 'resources' ? 'منابع و قالب‌ها'
        : segment.replace(/-/g, ' ')
      items.push({ name: segName, url: `${baseUrl}${acc}` })
    }
    return items
  })

  // Full Schema.org @graph
  const schemaGraph = computed(() => {
    const graph: any[] = [
      // 1. WebSite Schema with Sitelinks SearchBox
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: brandName.value,
        alternateName: ['چاپ نجم', 'Najm Printing', 'Najm Packaging', 'مجمع نجم'],
        description: metaDescription.value,
        inLanguage: ['fa-IR', 'en-US', 'ar-SA'],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/catalog?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },

      // 2. Organization & Corporation & LocalBusiness Knowledge Panel
      {
        '@type': ['Organization', 'LocalBusiness', 'Corporation'],
        '@id': `${baseUrl}/#organization`,
        name: brandName.value,
        legalName: 'مجتمع چاپ و بسته‌بندی نجم',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          '@id': `${baseUrl}/#logo`,
          url: `${baseUrl}/najm-logo.png`,
          caption: brandName.value
        },
        image: socialImage,
        description: metaDescription.value,
        foundingDate: '1999',
        telephone: '+98 21 6679 7911',
        email: 'info@chapenajm.com',
        priceRange: '$$$',
        currenciesAccepted: 'IRR, AED, EUR, USD',
        paymentAccepted: 'Cash, Credit Card, Bank Wire',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'تهران، بزرگراه فتح، زیر پل شیر پاستوریزه، ابتدای ۴۵ متری زرند، نبش کوچه تلفن‌خانه، پلاک ۱۶۶',
          addressLocality: 'Tehran',
          addressRegion: 'Tehran Province',
          postalCode: '1387813111',
          addressCountry: 'IR'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 35.6734868,
          longitude: 51.3090102
        },
        hasMap: 'https://maps.app.goo.gl/z4fFFJ4UwzQSuiEDA',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
            opens: '08:00',
            closes: '17:30'
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Thursday'],
            opens: '08:00',
            closes: '13:00'
          }
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+98 21 6679 7911',
            contactType: 'customer service',
            areaServed: ['IR', 'AE', 'IQ', 'OM', 'TR'],
            availableLanguage: ['Persian', 'English', 'Arabic']
          },
          {
            '@type': 'ContactPoint',
            telephone: '+98 21 6678 9577',
            contactType: 'sales',
            areaServed: 'IR',
            availableLanguage: ['Persian', 'English']
          },
          {
            '@type': 'ContactPoint',
            telephone: '+98 990 340 0074',
            contactType: 'direct mobile & whatsapp',
            areaServed: 'IR',
            availableLanguage: ['Persian', 'English']
          }
        ],
        // Verified Gold Star Aggregate Rating for Google SERP
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '128',
          reviewCount: '128'
        },
        knowsAbout: [
          'چاپ افست هایدلبرگ دوورقی ۵ رنگ SM74',
          'چاپ افست رولند ۷۰۰ و رولند ۲۰۰',
          'سلفون حرارتی اتوماتیک Auto band',
          'تولید انواع جعبه مقوایی و بهداشتی',
          'جعبه‌های دارویی طبق استانداردهای بهداشت',
          'تولید هاردباکس لوکس و جعبه‌های فانتزی',
          'یووی سیلندری و طلاکوب',
          'صحافی، تاکنی اشتال و مفتول ریلی مولر مارتینی',
          'برش پولار ۱۱۵ برنامه‌دار'
        ],
        sameAs: [
          'https://www.instagram.com/chape_najm/',
          'https://t.me/chapenajm',
          'https://ir.linkedin.com/in/chape-najm-638103334'
        ]
      },

      // 3. SiteNavigationElement (Primary Sitelinks for Google SERP)
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/#sitelinks`,
        name: brandName.value + (currentLang.value === 'EN' ? ' - Quick Navigation' : ' - بخش‌های اصلی و دسترسی سریع'),
        itemListElement: siteNavigationItems.value.map((item, idx) => ({
          '@type': 'SiteNavigationElement',
          position: idx + 1,
          name: item.name,
          description: item.description,
          url: item.url
        }))
      },
      ...siteNavigationItems.value.map((item, idx) => ({
        '@type': 'SiteNavigationElement',
        '@id': `${item.url}/#navigation-${idx + 1}`,
        name: item.name,
        description: item.description,
        url: item.url
      })),

      // 4. BreadcrumbList for Clean Google SERP Navigation
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl.value}/#breadcrumb`,
        itemListElement: breadcrumbItems.value.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url
        }))
      },

      // 5. Expandable FAQPage for Google Search Accordions
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl.value}/#faq`,
        mainEntity: activeFaqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    ]

    // Append extra schemas passed by the caller
    if (options.extraSchemas && options.extraSchemas.length > 0) {
      graph.push(...options.extraSchemas)
    }

    return {
      '@context': 'https://schema.org',
      '@graph': graph
    }
  })

  // Apply to Head
  useHead({
    title: pageTitle.value,
    htmlAttrs: {
      lang: currentLang.value === 'FA' ? 'fa-IR' : (currentLang.value === 'AR' ? 'ar-SA' : 'en-US'),
      dir: isRTL.value ? 'rtl' : 'ltr'
    },
    meta: [
      { name: 'description', content: metaDescription.value },
      { name: 'robots', content: options.noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'author', content: brandName.value },
      { name: 'theme-color', content: '#115247' },

      // Open Graph
      { property: 'og:site_name', content: brandName.value },
      { property: 'og:title', content: pageTitle.value },
      { property: 'og:description', content: metaDescription.value },
      { property: 'og:type', content: options.type || 'website' },
      { property: 'og:url', content: canonicalUrl.value },
      { property: 'og:image', content: socialImage },
      { property: 'og:locale', content: currentLang.value === 'FA' ? 'fa_IR' : (currentLang.value === 'AR' ? 'ar_SA' : 'en_US') },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@NajmPrinting' },
      { name: 'twitter:title', content: pageTitle.value },
      { name: 'twitter:description', content: metaDescription.value },
      { name: 'twitter:image', content: socialImage }
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl.value },
      { rel: 'alternate', hreflang: 'fa', href: faUrl.value },
      { rel: 'alternate', hreflang: 'en', href: enUrl.value },
      { rel: 'alternate', hreflang: 'ar', href: arUrl.value },
      { rel: 'alternate', hreflang: 'x-default', href: faUrl.value },
      // AI Engine & LLM Knowledge File Link
      { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLM Knowledge File' }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(schemaGraph.value)
      }
    ]
  })

  return {
    pageTitle,
    metaDescription,
    canonicalUrl,
    schemaGraph
  }
}
