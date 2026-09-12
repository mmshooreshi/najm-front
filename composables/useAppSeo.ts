// composables/useAppSeo.ts
import { computed, toValue, type Ref, type ComputedRef } from 'vue'
import { useHead, useRoute } from '#app'
import { useLocale } from '~/composables/useLocale'

export interface SeoOptions {
  title?: string | Ref<string> | ComputedRef<string> | { fa?: string; en?: string; ar?: string }
  description?: string | Ref<string> | ComputedRef<string> | { fa?: string; en?: string; ar?: string }
  keywords?: string | string[] | Ref<any> | ComputedRef<any>
  image?: string | Ref<string> | ComputedRef<string>
  type?: 'website' | 'article' | 'product'
  slug?: string | Ref<string> | ComputedRef<string>
  noindex?: boolean
  extraSchemas?: any[] | Ref<any[]> | ComputedRef<any[]>
  faqItems?: Array<{ question: string; answer: string }> | Ref<any> | ComputedRef<any>
  breadcrumbs?: Array<{ name: string; url: string }> | Ref<any> | ComputedRef<any>
}

// Safely unwraps any Vue reactive structures (Refs, ComputedRefs, getters) and prevents circular loops
function safeUnwrap(val: any, seen = new WeakSet()): any {
  const unwrapped = toValue(val)
  if (unwrapped === null || unwrapped === undefined) return unwrapped
  if (typeof unwrapped !== 'object') return unwrapped
  if (unwrapped instanceof Date || unwrapped instanceof RegExp) return unwrapped
  if (seen.has(unwrapped)) return undefined
  seen.add(unwrapped)

  if (Array.isArray(unwrapped)) {
    return unwrapped.map(item => safeUnwrap(item, seen)).filter(item => item !== undefined)
  }

  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(unwrapped)) {
    // Exclude Vue reactive internals like .dep, .effect, __v_isRef
    if (key.startsWith('_') || key === 'dep' || key === 'effect') continue
    const v = safeUnwrap(value, seen)
    if (v !== undefined) {
      result[key] = v
    }
  }
  return result
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
  const pageTitle = computed(() => {
    const t = toValue(options.title)
    let raw = ''
    if (typeof t === 'object' && t !== null) {
      raw = (t as any)[currentLang.value.toLowerCase() as 'fa' | 'en' | 'ar'] || (t as any).fa || ''
    } else if (typeof t === 'string') {
      raw = t
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
    const d = toValue(options.description)
    if (typeof d === 'object' && d !== null) {
      return (d as any)[currentLang.value.toLowerCase() as 'fa' | 'en' | 'ar'] || (d as any).fa || ''
    }
    if (typeof d === 'string' && d) {
      return d
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
    const s = toValue(options.slug)
    let p = s ? (s.startsWith('/') ? s : `/${s}`) : (route.path || '/')
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

  const socialImage = computed(() => {
    const img = toValue(options.image)
    return (typeof img === 'string' && img) ? img : `${baseUrl}/social-image.png`
  })

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

  const activeFaqs = computed(() => {
    const customFaqs = toValue(options.faqItems)
    return (customFaqs && customFaqs.length > 0) ? customFaqs : defaultFaqs
  })

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
          description: 'Custom luxury boxes, cosmetics packaging, pharmaceutical folding cartons, and food containers.',
          url: `${baseUrl}/catalog`
        },
        {
          name: 'Services & Offset Print',
          description: 'Heidelberg multi-color offset sheetfed printing, hot foil stamping, auto die-cutting and laminating.',
          url: `${baseUrl}/services`
        },
        {
          name: 'Industrial Machinery',
          description: 'Heidelberg Speedmaster presses, Bobst die-cutters, thermal CTP platesetters, and box gluers.',
          url: `${baseUrl}/facilities`
        },
        {
          name: 'About Najm Complex',
          description: 'Over 25 years of continuous industrial excellence, ISO color management, and production ethics.',
          url: `${baseUrl}/about`
        },
        {
          name: 'Technical Consultation',
          description: 'Free packaging engineering consulting, paperboard grammage selection, dummy prototyping, and pricing.',
          url: `${baseUrl}/consultation`
        }
      ]
    }
    if (currentLang.value === 'AR') {
      return [
        {
          name: 'اتصل بنا والعنوان',
          description: 'خطوط الاتصال المباشرة للمبيعات، عنوان المجمع الصناعي في طهران، ساعات العمل، واستعلام الأسعار.',
          url: `${baseUrl}/contact`
        },
        {
          name: 'المنتجات والعلب الفاخرة',
          description: 'علب الكرتون الصلب، تغليف مستحضرات التجميل، عبوات الأدوية المعتمدة، وعلب المواد الغذائية الصحية.',
          url: `${baseUrl}/catalog`
        },
        {
          name: 'خدمات الطباعة الصناعية',
          description: 'طباعة أوفست ملونة بأحدث ماكينات هايدلبرغ، بصمة حرارية ذهبية، داي كت أوتوماتيكي وسلفان.',
          url: `${baseUrl}/services`
        },
        {
          name: 'الآلات والتجهيزات المتطورة',
          description: 'ماكينات هايدلبرغ سبيدماستر، أجهزة بوبست للقص، پلیت‌ستر حراري CTP، وخطوط لصق العلب الأوتوماتيكية.',
          url: `${baseUrl}/facilities`
        },
        {
          name: 'عن مجمع نجم للطباعة',
          description: 'أكثر من ۲۵ عاماً من الخبرة الصناعية المستمرة، معايير إدارة جودة الألوان والالتزام بمواعيد التسليم.',
          url: `${baseUrl}/about`
        },
        {
          name: 'استشارة فنية وهندسة العلب',
          description: 'استشارة مجانية لاختيار نوع وسماكة الورق المقوى، تصميم نموذج العلبة، وحساب التكاليف والكميات.',
          url: `${baseUrl}/consultation`
        }
      ]
    }
    return [
      {
        name: 'تماس با ما و موقعیت مکانی',
        description: 'خطوط مستقیم تماس، آدرس کارخانه و دفتر فروش در تهران، ساعات کاری و نقشه مسیریابی.',
        url: `${baseUrl}/contact`
      },
      {
        name: 'محصولات و نمونه‌های بسته‌بندی',
        description: 'جعبه‌های دارویی، آرایشی، هاردباکس‌های نفیس و بسته‌بندی‌های بهداشتی مواد غذایی با طراحی مهندسی.',
        url: `${baseUrl}/catalog`
      },
      {
        name: 'خدمات تخصصی چاپ و پس از چاپ',
        description: 'چاپ افست ۵ رنگ ورقی هایدلبرگ، طلاکوب گرم، دایکات اتوماتیک، سلفون حرارتی و جعبه‌چسبانی پیشرفته.',
        url: `${baseUrl}/services`
      },
      {
        name: 'تجهیزات و ماشین‌آلات مدرن',
        description: 'آشنایی با خطوط چاپ Speedmaster، ماشین‌های لیتوگرافی CTP و تجهیزات کنترل کیفی رنگ ISO.',
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
    const customCrumbs = toValue(options.breadcrumbs)
    if (customCrumbs && customCrumbs.length > 0) {
      return customCrumbs
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
        image: socialImage.value,
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
            contactType: 'technical support',
            areaServed: ['IR'],
            availableLanguage: ['Persian']
          }
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '156',
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
        mainEntity: activeFaqs.value.map(faq => ({
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
    const extra = toValue(options.extraSchemas)
    if (extra && Array.isArray(extra) && extra.length > 0) {
      const safeExtra = safeUnwrap(extra)
      if (Array.isArray(safeExtra)) {
        graph.push(...safeExtra)
      }
    }

    return {
      '@context': 'https://schema.org',
      '@graph': graph
    }
  })

  // Apply to Head with reactive getter function
  useHead(() => {
    let jsonLd = ''
    try {
      jsonLd = JSON.stringify(safeUnwrap(schemaGraph.value))
    } catch (e) {
      console.error('Failed to serialize Schema.org JSON-LD:', e)
    }

    return {
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
        { property: 'og:image', content: socialImage.value },
        { property: 'og:locale', content: currentLang.value === 'FA' ? 'fa_IR' : (currentLang.value === 'AR' ? 'ar_SA' : 'en_US') },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@NajmPrinting' },
        { name: 'twitter:title', content: pageTitle.value },
        { name: 'twitter:description', content: metaDescription.value },
        { name: 'twitter:image', content: socialImage.value }
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
      script: jsonLd ? [
        {
          type: 'application/ld+json',
          children: jsonLd
        }
      ] : []
    }
  })

  return {
    pageTitle,
    metaDescription,
    canonicalUrl,
    schemaGraph
  }
}
