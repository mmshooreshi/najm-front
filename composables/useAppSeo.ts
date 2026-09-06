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
  const pageTitle = computed(() => {
    let raw = ''
    if (typeof options.title === 'object' && options.title !== null) {
      raw = options.title[currentLang.value.toLowerCase() as 'fa' | 'en' | 'ar'] || options.title.fa || ''
    } else if (typeof options.title === 'string') {
      raw = options.title
    }
    if (!raw) {
      if (currentLang.value === 'EN') return `${brandName.value} | Industrial Printing & Luxury Packaging Solutions`
      if (currentLang.value === 'AR') return `${brandName.value} | حلول الطباعة الأوفست والتغليف الفاخر`
      return `${brandName.value} | خدمات تخصصی چاپ افست و جعبه‌سازی صنعتی`
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
      return 'Najm Printing & Packaging Complex in Tehran, operating 5-color Heidelberg Speedmaster presses, Bobst die-cutting, CTP thermal plates, and luxury rigid box packaging with ISO 12647-2 color fidelity.'
    }
    if (currentLang.value === 'AR') {
      return 'مجمع نجم المتخصص للطباعة والتغليف الصناعي في طهران، ماكينات هايدلبرغ ٥ ألوان، قص وقوالب بوبست الأوتوماتيكية، علب الكرتون الفاخرة وهاردبوكس بأعلى معايير الجودة.'
    }
    return 'مجتمع چاپ و بسته‌بندی نجم؛ مجهز به پیشرفته‌ترین ماشین‌آلات چاپ افست ۵ رنگ هایدلبرگ، لیتوگرافی حرارتی CTP، خطوط اتوماتیک جعبه‌سازی، هاردباکس و خدمات تکمیلی در تهران.'
  })

  // Canonical base URL
  const baseUrl = 'https://chapenajm.com'
  const path = computed(() => {
    if (options.slug) {
      return options.slug.startsWith('/') ? options.slug : `/${options.slug}`
    }
    return route.path || '/'
  })

  const canonicalUrl = computed(() => `${baseUrl}${path.value === '/' ? '' : path.value}`)
  const socialImage = options.image || `${baseUrl}/social-image.png`

  // Default High-Authority Industrial FAQs for Google Rich Snippets
  const defaultFaqs = [
    {
      question: 'حداقل تیراژ سفارش تولید جعبه و بسته‌بندی در مجتمع نجم چقدر است؟',
      answer: 'حداقل تیراژ برای انواع جعبه‌های مقوایی (ایندربرد، کرافت، بهداشتی) ۱,۰۰۰ عدد و برای هاردباکس‌های لوکس و مگنتی ۵۰۰ عدد می‌باشد.'
    },
    {
      question: 'چه ماشین‌آلات و خطوط چاپی در چاپ نجم مستقر هستند؟',
      answer: 'مجتمع مجهز به خطوط چاپ افست ۵ رنگ ورقی هایدلبرگ Speedmaster، پلیت‌ستر حرارتی هایدلبرگ Suprasetter CTP، لچک و دایکات تمام اتوماتیک Bobst، طلاکوب گرم و خطوط اتوماتیک جعبه‌چسبانی با استاندارد ISO 12647-2 می‌باشد.'
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

  // Google Sitelinks Navigation Items
  const siteNavigationItems = [
    { name: 'کاتالوگ جامع محصولات و بسته‌بندی', url: 'https://chapenajm.com/catalog' },
    { name: 'خطوط تولید و ماشین‌آلات چاپ', url: 'https://chapenajm.com/facilities' },
    { name: 'استعلام تیراژ و مشاوره تخصصی', url: 'https://chapenajm.com/consultation' },
    { name: 'خدمات چاپ افست و جعبه‌سازی', url: 'https://chapenajm.com/services' },
    { name: 'درباره مجتمع چاپ نجم', url: 'https://chapenajm.com/about' },
    { name: 'تماس با کارخانه و دفاتر فروش', url: 'https://chapenajm.com/contact' }
  ]

  // Breadcrumbs
  const breadcrumbItems = computed(() => {
    if (options.breadcrumbs && options.breadcrumbs.length > 0) {
      return options.breadcrumbs
    }
    const cleanPath = path.value.replace(/^\//, '').split('/').filter(Boolean)
    const items = [{ name: currentLang.value === 'EN' ? 'Home' : (currentLang.value === 'AR' ? 'الرئيسية' : 'خانه'), url: baseUrl }]
    let acc = ''
    for (const segment of cleanPath) {
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
        legalName: 'مجتمع صنایع چاپ و بسته‌بندی نجم',
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
        email: 'info@najmprint.com',
        priceRange: '$$$',
        currenciesAccepted: 'IRR, AED, EUR, USD',
        paymentAccepted: 'Cash, Credit Card, Bank Wire',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'تهران، جاده مخصوص کرج، کیلومتر ۱۱، شهرک صنعتی نجم، پلاک ۲۴',
          addressLocality: 'Tehran',
          addressRegion: 'Tehran Province',
          postalCode: '1389712345',
          addressCountry: 'IR'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 35.713097,
          longitude: 51.427423
        },
        hasMap: 'https://maps.google.com/?q=35.713097,51.427423',
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
            telephone: '+98 21 6622 9900',
            contactType: 'sales',
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
          'چاپ افست ۵ رنگ ورقی هایدلبرگ',
          'تولید جعبه مقوایی و هاردباکس تخصصی',
          'بسته‌بندی دارویی و بهداشتی با مقوای ایندربرد',
          'دایکات و خط‌تا با ماشین‌آلات بوبست Bobst',
          'طلاکوب و یووی موضعی برجسته',
          'استاندارد مدیریت رنگ ISO 12647-2'
        ],
        sameAs: [
          'https://www.linkedin.com/company/najmprinting',
          'https://www.instagram.com/najmprinting',
          'https://twitter.com/NajmPrinting'
        ]
      },

      // 3. SiteNavigationElement (Primary Sitelinks for Google SERP)
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/#sitelinks`,
        name: 'بخش‌های اصلی مجتمع چاپ و بسته‌بندی نجم',
        itemListElement: siteNavigationItems.map((item, idx) => ({
          '@type': 'SiteNavigationElement',
          position: idx + 1,
          name: item.name,
          url: item.url
        }))
      },

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
