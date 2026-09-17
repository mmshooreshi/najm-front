// composables/useAppSeo.ts
import { computed, toValue, type Ref, type ComputedRef } from 'vue'
import { useHead, useRoute } from '#app'
import { useLocale } from '~/composables/useLocale'
import { adminEditState } from '@/store/adminEditStore'

export interface SeoOptions {
  title?: string | Ref<string> | ComputedRef<string> | { fa?: string; en?: string; ar?: string }
  description?: string | Ref<string> | ComputedRef<string> | { fa?: string; en?: string; ar?: string }
  keywords?: string | string[] | Ref<any> | ComputedRef<any>
  image?: string | Ref<string> | ComputedRef<string>
  type?: 'website' | 'article' | 'product' | 'service' | 'faq' | 'resource' | 'about' | 'contact'
  slug?: string | Ref<string> | ComputedRef<string>
  noindex?: boolean
  extraSchemas?: any[] | Ref<any[]> | ComputedRef<any[]>
  faqItems?: Array<{ question: string; answer: string }> | Ref<any> | ComputedRef<any>
  breadcrumbs?: Array<{ name: string; url: string }> | Ref<any> | ComputedRef<any>
  datePublished?: string | Ref<string> | ComputedRef<string>
  dateModified?: string | Ref<string> | ComputedRef<string>
  author?: string | Ref<string> | ComputedRef<string>
  category?: string | Ref<string> | ComputedRef<string>
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
  const { language, localePath } = useLocale()

  const currentLang = computed(() => {
    // 1. Inspect route path first for search engine crawlers without cookies
    const p = route?.path || ''
    if (p.startsWith('/en/') || p === '/en') return 'EN'
    if (p.startsWith('/ar/') || p === '/ar') return 'AR'
    // 2. Client cookie / state fallback
    const l = (language.value || 'FA').toUpperCase()
    return l === 'EN' ? 'EN' : l === 'AR' ? 'AR' : 'FA'
  })

  const isRTL = computed(() => currentLang.value === 'FA' || currentLang.value === 'AR')

  // Dynamic SEO overrides from active admin editing session
  const adminSeoOverrides = computed(() => {
    const s = toValue(options.slug) || route?.path?.replace(/^\/(?:en|ar)(?=\/|$)/, '').replace(/^\//, '') || 'home'
    const cleanSlug = s === '' ? 'home' : s
    const langKey = currentLang.value.toLowerCase()
    return (adminEditState?.clientOverrides?.[cleanSlug]?.[langKey] as any)?.seo ||
           (adminEditState?.clientOverrides?.[cleanSlug]?.[currentLang.value] as any)?.seo ||
           (adminEditState?.allLangUIBySlug?.[cleanSlug]?.[langKey] as any)?.seo ||
           null
  })

  // Brand Name localized
  const brandName = computed(() => {
    if (currentLang.value === 'EN') return 'Najm Printing & Packaging'
    if (currentLang.value === 'AR') return 'مجمع نجم للطباعة والتغليف'
    return 'مجتمع چاپ و بسته‌بندی نجم'
  })

  // Title calculation
  const pageTitle = computed(() => {
    if (adminSeoOverrides.value?.title) {
      const raw = adminSeoOverrides.value.title
      if (raw.includes(brandName.value) || raw.includes('چاپ و بسته‌بندی نجم')) return raw
      return `${raw} | ${brandName.value}`
    }

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
    // Check if brandName is already included in raw to prevent duplicate titles
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
    if (adminSeoOverrides.value?.description) {
      return adminSeoOverrides.value.description
    }

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
      return 'مجمع نجم للطباعة والتغليف: تصميم وتصنيع علب الكرتون الفاخرة، هاردبوكس، والتغليف الدوائي بأعلى معايير الجودة في طهران.'
    }
    return 'مجتمع چاپ و بسته‌بندی نجم؛ طراحی و تولید انواع جعبه‌های مقوایی، هاردباکس و بسته‌بندی‌های لوکس با بالاترین استانداردهای چاپ در تهران.'
  })

  // Canonical base URL & Clean Path for Multi-Lingual Alternate Links
  const baseUrl = 'https://chapenajm.com'
  const cleanPath = computed(() => {
    const s = toValue(options.slug)
    let p = s ? (s.startsWith('/') ? s : `/${s}`) : (route?.path || '/')
    return p.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/'
  })

  const faUrl = computed(() => `${baseUrl}${cleanPath.value === '/' ? '' : cleanPath.value}`)
  const enUrl = computed(() => `${baseUrl}/en${cleanPath.value === '/' ? '' : cleanPath.value}`)
  const arUrl = computed(() => `${baseUrl}/ar${cleanPath.value === '/' ? '' : cleanPath.value}`)

  const canonicalUrl = computed(() => {
    if (adminSeoOverrides.value?.canonical) {
      return adminSeoOverrides.value.canonical
    }
    if (currentLang.value === 'EN') return enUrl.value
    if (currentLang.value === 'AR') return arUrl.value
    return faUrl.value
  })

  const socialImage = computed(() => {
    if (adminSeoOverrides.value?.image) {
      return adminSeoOverrides.value.image
    }
    const img = toValue(options.image)
    if (typeof img === 'string' && img) {
      return img.startsWith('http') ? img : `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`
    }
    return `${baseUrl}/social-image.png`
  })

  // Industrial FAQs localized per locale
  const defaultFaqs = computed(() => {
    if (currentLang.value === 'EN') {
      return [
        {
          question: 'What is the minimum order quantity (MOQ) for custom packaging at Najm Complex?',
          answer: 'The MOQ is 1,000 units for standard folding carton boxes (Ivory board, Kraft, food-grade) and 500 units for luxury rigid boxes.'
        },
        {
          question: 'What printing and finishing machinery operates in Najm facilities?',
          answer: 'Our plant is equipped with Heidelberg Speedmaster 5-color offset presses, CTP thermal platesetters, automatic high-speed die-cutters, hot foil stamping, and automated folder-gluers compliant with ISO 12647-2.'
        },
        {
          question: 'What is the turnaround time for sample prototyping and delivery?',
          answer: 'Complimentary structural dummy prototypes are ready within 48 hours. Full production runs are completed and delivered within 5 to 7 business days following artwork approval.'
        },
        {
          question: 'Do you manufacture certified sanitary and pharmaceutical packaging?',
          answer: 'Yes, all pharmaceutical and cosmetic boxes are manufactured using certified food-grade Ivory paperboard with certified moisture-resistant coatings.'
        }
      ]
    }
    if (currentLang.value === 'AR') {
      return [
        {
          question: 'ما هو الحد الأدنى لكمية الطلب (MOQ) لإنتاج العلب في مجمع نجم؟',
          answer: 'الحد الأدنى لعلب الكرتون القابلة للطي (إنفربورد، كرافت، صحي) هو ۱,۰۰۰ قطعة، ولعلب الهاردبوكس الفاخرة ۵۰۰ قطعة.'
        },
        {
          question: 'ما هي الآلات وخطوط الطباعة المتوفرة في مصنع مجمع نجم؟',
          answer: 'المجمع مجهز بماكينات طباعة أوفست هايدلبرغ سبيدماستر ۵ ألوان، پلیت‌ستر حراري CTP، ماكينات داي كت أوتوماتيكية، بصمة حرارية ذهبية، وخطوط تجميع العلب وفق معايير ISO 12647-2.'
        },
        {
          question: 'كم يستغرق تجهيز النموذج الأولي وتسليم الطلب النهائي؟',
          answer: 'يتم تجهيز النموذج الأولي (الماكيت) مجاناً خلال ۴۸ ساعة، والإنتاج الصناعي ينجز خلال ۵ إلى ۷ أيام عمل بعد الموافقة النهائية.'
        },
        {
          question: 'هل تصنعون عبوات صحية معتمدة للأدوية والمواد الغذائية؟',
          answer: 'نعم، جميع عبوات الأدوية ومستحضرات التجميل تُصنع باستخدام كرتون إنفربورد صحي معتمد ومقاوم للرطوبة.'
        }
      ]
    }
    return [
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
  })

  const activeFaqs = computed(() => {
    if (adminSeoOverrides.value?.faqs && Array.isArray(adminSeoOverrides.value.faqs) && adminSeoOverrides.value.faqs.length > 0) {
      return adminSeoOverrides.value.faqs
    }
    const customFaqs = toValue(options.faqItems)
    if (customFaqs && Array.isArray(customFaqs) && customFaqs.length > 0) {
      return customFaqs
    }
    if (options.type === 'faq') {
      return defaultFaqs.value
    }
    return null
  })

  // Breadcrumbs (Strictly hierarchical: root is omitted if single-item)
  const breadcrumbItems = computed(() => {
    const customCrumbs = toValue(options.breadcrumbs)
    if (customCrumbs && customCrumbs.length > 0) {
      return customCrumbs.map((c: any) => {
        let name = c.name
        if (typeof name === 'object' && name !== null) {
          name = name[currentLang.value.toLowerCase()] || name.fa || ''
        }
        let url = c.url || ''
        if (url && !url.startsWith('http')) {
          const clean = url.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/'
          url = currentLang.value === 'EN'
            ? `${baseUrl}/en${clean === '/' ? '' : clean}`
            : currentLang.value === 'AR'
            ? `${baseUrl}/ar${clean === '/' ? '' : clean}`
            : `${baseUrl}${clean === '/' ? '' : clean}`
        }
        return { name, url }
      })
    }

    const pathSegments = cleanPath.value.replace(/^\//, '').split('/').filter(Boolean)
    if (pathSegments.length === 0) {
      return []
    }

    const homeName = currentLang.value === 'EN' ? 'Home' : (currentLang.value === 'AR' ? 'الرئيسية' : 'خانه')
    const homeUrl = currentLang.value === 'EN' ? `${baseUrl}/en` : (currentLang.value === 'AR' ? `${baseUrl}/ar` : baseUrl)
    const items = [{ name: homeName, url: homeUrl }]
    let acc = ''
    for (const segment of pathSegments) {
      acc += `/${segment}`
      let segName = segment
      if (currentLang.value === 'EN') {
        segName = segment === 'catalog' ? 'Catalog'
          : segment === 'products' ? 'Products'
          : segment === 'packaging' ? 'Packaging'
          : segment === 'printing' ? 'Printing'
          : segment === 'industries' ? 'Industries'
          : segment === 'applications' ? 'Applications'
          : segment === 'services' ? 'Services'
          : segment === 'facilities' ? 'Machinery'
          : segment === 'contact' ? 'Contact'
          : segment === 'consultation' ? 'Consultation'
          : segment === 'about' ? 'About Us'
          : segment === 'history' ? 'History'
          : segment === 'faq' ? 'FAQ'
          : segment === 'blog' ? 'Blog'
          : segment === 'news' ? 'News'
          : segment === 'resources' ? 'Resources'
          : segment === 'guides' ? 'Guides'
          : segment === 'dielines' ? 'Dielines'
          : segment.replace(/-/g, ' ')
      } else if (currentLang.value === 'AR') {
        segName = segment === 'catalog' ? 'الكتالوج'
          : segment === 'products' ? 'المنتجات'
          : segment === 'packaging' ? 'التغليف'
          : segment === 'printing' ? 'الطباعة'
          : segment === 'industries' ? 'القطاعات'
          : segment === 'applications' ? 'الاستخدامات'
          : segment === 'services' ? 'الخدمات'
          : segment === 'facilities' ? 'التجهيزات'
          : segment === 'contact' ? 'اتصل بنا'
          : segment === 'consultation' ? 'استشارة'
          : segment === 'about' ? 'من نحن'
          : segment === 'history' ? 'التاريخ'
          : segment === 'faq' ? 'الأسئلة الشائعة'
          : segment === 'blog' ? 'المدونة'
          : segment === 'news' ? 'الأخبار'
          : segment === 'resources' ? 'المصادر'
          : segment === 'guides' ? 'الأدلة'
          : segment === 'dielines' ? 'قوالب الدايكات'
          : segment.replace(/-/g, ' ')
      } else {
        segName = segment === 'catalog' ? 'کاتالوگ'
          : segment === 'products' ? 'محصولات'
          : segment === 'packaging' ? 'بسته‌بندی و جعبه‌سازی'
          : segment === 'printing' ? 'چاپ تجاری'
          : segment === 'industries' ? 'صنایع'
          : segment === 'applications' ? 'کاربردها'
          : segment === 'services' ? 'خدمات'
          : segment === 'facilities' ? 'تجهیزات و ماشین‌آلات'
          : segment === 'contact' ? 'تماس با ما'
          : segment === 'consultation' ? 'مشاوره و استعلام'
          : segment === 'about' ? 'درباره ما'
          : segment === 'history' ? 'تاریخچه'
          : segment === 'faq' ? 'پرسش‌های متداول'
          : segment === 'blog' ? 'وبلاگ'
          : segment === 'news' ? 'اخبار'
          : segment === 'resources' ? 'منابع و قالب‌ها'
          : segment === 'guides' ? 'راهنماهای فنی'
          : segment === 'dielines' ? 'قالب‌های تیغ'
          : segment.replace(/-/g, ' ')
      }
      const segUrl = currentLang.value === 'EN'
        ? `${baseUrl}/en${acc}`
        : (currentLang.value === 'AR' ? `${baseUrl}/ar${acc}` : `${baseUrl}${acc}`)
      items.push({ name: segName, url: segUrl })
    }
    return items
  })

  // Full Schema.org @graph
  const schemaGraph = computed(() => {
    const isRoot = cleanPath.value === '/'
    const pageType = options.type || 'website'

    const graph: any[] = [
      // 1. Primary Organization Schema (Canonical Google Standard Entity)
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: brandName.value,
        legalName: computed(() => {
          if (currentLang.value === 'EN') return 'Najm Industrial Printing & Packaging Complex'
          if (currentLang.value === 'AR') return 'مجمع نجم للطباعة والتغليف الصناعي'
          return 'مجتمع چاپ و بسته‌بندی نجم'
        }).value,
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
        address: {
          '@type': 'PostalAddress',
          streetAddress: computed(() => {
            if (currentLang.value === 'EN') return 'No. 166, Corner of Telephone-Khaneh Alley, 45-Metri Zarand, Fath Expressway, Tehran, Iran'
            if (currentLang.value === 'AR') return 'رقم ۱۶۶، زاوية زقاق تلفن‌خانه، بداية شارع ۴۵ متري زرند، طريق فتح السريع، طهران، إيران'
            return 'تهران، بزرگراه فتح، زیر پل شیر پاستوریزه، ابتدای ۴۵ متری زرند، نبش کوچه تلفن‌خانه، پلاک ۱۶۶'
          }).value,
          addressLocality: 'Tehran',
          addressRegion: 'Tehran Province',
          postalCode: '1387813111',
          addressCountry: 'IR'
        },
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
        knowsAbout: computed(() => {
          if (currentLang.value === 'EN') {
            return [
              'Heidelberg Speedmaster 5-Color Sheetfed Offset Printing',
              'Roland 700 & 200 Industrial Offset Presses',
              'Automatic Thermal Lamination (Auto Band)',
              'Pharmaceutical & Cosmetic Carton Packaging',
              'Luxury Rigid Boxes & Custom Magnetic Boxes',
              'Automated Die-Cutting, Creasing & Embossing',
              'Hot Foil Stamping & Cylinder Spot UV Varnishing',
              'Muller Martini Saddle Stitching & Stahl Folding',
              'Polar 115 Computerized High-Precision Guillotine'
            ]
          }
          if (currentLang.value === 'AR') {
            return [
              'طباعة أوفست ملونة بماكينات هايدلبرغ الألمانية SM74',
              'ماكينات رولاند ۷۰۰ ورولاند ۲۰۰ الصناعية',
              'سلفان حراري أوتوماتيكي ومات وبراق',
              'تصنيع علب الكرتون الصلب والفاخر (هاردبوكس)',
              'تغليف عبوات الأدوية ومستحضرات التجميل المعتمدة',
              'علب المنتجات الغذائية الصحية المقاومة للرطوبة',
              'بصمة حرارية ذهبية وفضية ويو في موضعي',
              'قص وتكسير آلي دقيق بماكينات بوبست السويسرية',
              'خطوط لصق وتجميع العلب الأوتوماتيكية'
            ]
          }
          return [
            'چاپ افست هایدلبرگ دوورقی ۵ رنگ SM74',
            'چاپ افست رولند ۷۰۰ و رولند ۲۰۰',
            'سلفون حرارتی اتوماتیک Auto band',
            'تولید انواع جعبه مقوایی و بهداشتی',
            'جعبه‌های دارویی طبق استانداردهای بهداشت',
            'تولید هاردباکس لوکس و جعبه‌های فانتزی',
            'یووی سیلندری و طلاکوب',
            'صحافی، تاکنی اشتال و مفتول ریلی مولر مارتینی',
            'برش پولار ۱۱۵ برنامه‌دار'
          ]
        }).value,
        sameAs: [
          'https://www.instagram.com/chape_najm/',
          'https://t.me/chapenajm',
          'https://ir.linkedin.com/in/chape-najm-638103334'
        ]
      }
    ]

    // 2. WebSite Schema (Canonical Identity on Root or Linked)
    if (isRoot) {
      graph.push(
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: baseUrl,
          name: brandName.value,
          alternateName: ['چاپ نجم', 'Najm Printing', 'Najm Packaging', 'مجمع نجم', 'مجتمع چاپ و جعبه سازی نجم'],
          description: metaDescription.value,
          inLanguage: ['fa-IR', 'en-US', 'ar-SA'],
          publisher: {
            '@id': `${baseUrl}/#organization`
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/catalog?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': ['LocalBusiness', 'ProfessionalService', 'Corporation'],
          '@id': `${baseUrl}/#localbusiness`,
          name: brandName.value,
          parentOrganization: {
            '@id': `${baseUrl}/#organization`
          },
          url: baseUrl,
          logo: {
            '@id': `${baseUrl}/#logo`
          },
          image: socialImage.value,
          telephone: '+98 21 6679 7911',
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
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            bestRating: '5',
            worstRating: '1',
            ratingCount: '156',
            reviewCount: '128'
          }
        },
        {
          '@type': 'ItemList',
          '@id': `${baseUrl}/#sitelinks`,
          name: computed(() => {
            if (currentLang.value === 'EN') return 'Key Navigation Sitelinks'
            if (currentLang.value === 'AR') return 'أقسام الموقع الرئيسية'
            return 'بخش‌های اصلی سایت نجم'
          }).value,
          itemListElement: [
            {
              '@type': 'SiteNavigationElement',
              position: 1,
              name: computed(() => currentLang.value === 'EN' ? 'Packaging & Boxes Catalog' : (currentLang.value === 'AR' ? 'كتالوج المنتجات والعلب' : 'کاتالوگ محصولات و جعبه‌ها')).value,
              description: computed(() => currentLang.value === 'EN' ? 'Custom folding cartons, rigid boxes & luxury packaging' : (currentLang.value === 'AR' ? 'علب الكرتون الصلب والفاخر وتغليف المنتجات' : 'تولید انواع جعبه مقوایی، هاردباکس و بسته‌بندی لوکس')).value,
              url: computed(() => localePath('/catalog')).value
            },
            {
              '@type': 'SiteNavigationElement',
              position: 2,
              name: computed(() => currentLang.value === 'EN' ? 'Printing Facilities & Machinery' : (currentLang.value === 'AR' ? 'المعدات والماكينات الصناعية' : 'ماشین‌آلات و تجهیزات چاپ')).value,
              description: computed(() => currentLang.value === 'EN' ? '5-Color Heidelberg Speedmaster offset press, thermal lamination & die-cutting' : (currentLang.value === 'AR' ? 'ماكينات هايدلبرغ الألمانية ۵ ألوان وخطوط التكسير والسلفان' : 'هایدلبرگ ۵ رنگ، سلفون حرارتی اتوماتیک و لترپرس')).value,
              url: computed(() => localePath('/facilities')).value
            },
            {
              '@type': 'SiteNavigationElement',
              position: 3,
              name: computed(() => currentLang.value === 'EN' ? 'Industrial Printing & Packaging Services' : (currentLang.value === 'AR' ? 'خدمات الطباعة والتغليف الصناعي' : 'خدمات چاپ و بسته‌بندی')).value,
              description: computed(() => currentLang.value === 'EN' ? 'Commercial offset printing, carton manufacturing and finishing' : (currentLang.value === 'AR' ? 'خدمات الطباعة الصناعية المتكاملة' : 'طراحی ساختاری، چاپ افست تجاری و جعبه‌سازی صنعتی')).value,
              url: computed(() => localePath('/services/printing-and-packaging')).value
            },
            {
              '@type': 'SiteNavigationElement',
              position: 4,
              name: computed(() => currentLang.value === 'EN' ? 'About Najm Complex' : (currentLang.value === 'AR' ? 'عن مجمع نجم للطباعة' : 'درباره مجتمع چاپ نجم')).value,
              description: computed(() => currentLang.value === 'EN' ? 'Over 25 years of legacy, quality certifications and factory infrastructure' : (currentLang.value === 'AR' ? 'أكثر من ۲۵ عاماً من الخبرة والشهادات والقدرات الصناعية' : 'بیش از ۲۵ سال پیشینه، گواهینامه‌ها و توانمندی‌های کارخانه')).value,
              url: computed(() => localePath('/about')).value
            },
            {
              '@type': 'SiteNavigationElement',
              position: 5,
              name: computed(() => currentLang.value === 'EN' ? 'Price Inquiry & Contact' : (currentLang.value === 'AR' ? 'طلب استعلام الأسعار والتواصل' : 'تماس و استعلام قیمت')).value,
              description: computed(() => currentLang.value === 'EN' ? 'Request official quotations, phone numbers and factory address' : (currentLang.value === 'AR' ? 'طلب عروض الأسعار الرسمية وأرقام الهواتف والعنوان' : 'دریافت پیش‌فاکتور، شماره تماس مستقیم و لوکیشن کارخانه')).value,
              url: computed(() => localePath('/contact')).value
            },
            {
              '@type': 'SiteNavigationElement',
              position: 6,
              name: computed(() => currentLang.value === 'EN' ? 'Specialized Packaging Consultation' : (currentLang.value === 'AR' ? 'استشارة التغليف الهندسية' : 'مشاوره تخصصی بسته‌بندی')).value,
              description: computed(() => currentLang.value === 'EN' ? 'Structural design, material optimization & cost engineering' : (currentLang.value === 'AR' ? 'استشارة هندسية في اختيار الخامات والتصميم' : 'مشاوره مهندسی ساختار، گرماژ مقوا و کاهش هزینه')).value,
              url: computed(() => localePath('/consultation')).value
            },
            {
              '@type': 'SiteNavigationElement',
              position: 7,
              name: computed(() => currentLang.value === 'EN' ? 'Technical Blog & Guides' : (currentLang.value === 'AR' ? 'المدونة والمقالات التعليمية' : 'وبلاگ و مقالات آموزشی')).value,
              description: computed(() => currentLang.value === 'EN' ? 'Offset printing standards, packaging design tutorials & guides' : (currentLang.value === 'AR' ? 'مقالات وأدلة تقنيات الطباعة الأوفست وتصميم العلب' : 'راهنماهای فنی چاپ افست، استانداردهای بهداشتی جعبه')).value,
              url: computed(() => localePath('/blog')).value
            }
          ]
        }
      )
    }

    // 3. WebPage Node (Semantic page type resolution)
    const webPageType = pageType === 'about' ? 'AboutPage'
      : pageType === 'contact' ? 'ContactPage'
      : pageType === 'faq' ? 'FAQPage'
      : pageType === 'product' ? 'ItemPage'
      : 'WebPage'

    const webPageNode: any = {
      '@type': webPageType,
      '@id': `${canonicalUrl.value}/#webpage`,
      url: canonicalUrl.value,
      name: pageTitle.value,
      description: metaDescription.value,
      inLanguage: currentLang.value === 'FA' ? 'fa-IR' : (currentLang.value === 'AR' ? 'ar-SA' : 'en-US'),
      isPartOf: {
        '@id': `${baseUrl}/#website`
      },
      about: {
        '@id': `${baseUrl}/#organization`
      }
    }

    if (breadcrumbItems.value.length > 1) {
      webPageNode.breadcrumb = {
        '@id': `${canonicalUrl.value}/#breadcrumb`
      }
    }

    graph.push(webPageNode)

    // 4. BreadcrumbList (Only emitted on subpages with depth > 1 to avoid single-item root breadcrumbs)
    if (breadcrumbItems.value.length > 1) {
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl.value}/#breadcrumb`,
        itemListElement: breadcrumbItems.value.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url
        }))
      })
    }

    // 5. Page-Specific Semantic Entity Nodes
    if (pageType === 'article') {
      graph.push({
        '@type': 'Article',
        '@id': `${canonicalUrl.value}/#article`,
        isPartOf: {
          '@id': `${canonicalUrl.value}/#webpage`
        },
        headline: pageTitle.value,
        description: metaDescription.value,
        mainEntityOfPage: canonicalUrl.value,
        image: socialImage.value,
        inLanguage: currentLang.value === 'FA' ? 'fa-IR' : (currentLang.value === 'AR' ? 'ar-SA' : 'en-US'),
        author: {
          '@type': 'Organization',
          name: toValue(options.author) || brandName.value,
          url: baseUrl
        },
        publisher: {
          '@id': `${baseUrl}/#organization`
        },
        datePublished: toValue(options.datePublished) || '2025-05-15T08:00:00+03:30',
        dateModified: toValue(options.dateModified) || '2026-09-13T10:00:00+03:30'
      })
    } else if (pageType === 'product') {
      graph.push({
        '@type': 'Product',
        '@id': `${canonicalUrl.value}/#product`,
        name: pageTitle.value,
        description: metaDescription.value,
        image: socialImage.value,
        brand: {
          '@id': `${baseUrl}/#organization`
        },
        manufacturer: {
          '@id': `${baseUrl}/#organization`
        },
        category: toValue(options.category) || 'Industrial Packaging & Custom Boxes',
        offers: {
          '@type': 'Offer',
          url: canonicalUrl.value,
          priceCurrency: 'IRR',
          price: '0',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          seller: {
            '@id': `${baseUrl}/#organization`
          }
        }
      })
    } else if (pageType === 'service') {
      graph.push({
        '@type': 'Service',
        '@id': `${canonicalUrl.value}/#service`,
        name: pageTitle.value,
        description: metaDescription.value,
        provider: {
          '@id': `${baseUrl}/#organization`
        },
        serviceType: 'Industrial Offset Printing & Packaging Converting',
        areaServed: {
          '@type': 'Country',
          name: 'Iran'
        }
      })
    } else if (pageType === 'resource') {
      graph.push({
        '@type': 'DigitalDocument',
        '@id': `${canonicalUrl.value}/#document`,
        name: pageTitle.value,
        description: metaDescription.value,
        fileFormat: 'application/pdf',
        publisher: {
          '@id': `${baseUrl}/#organization`
        },
        author: {
          '@id': `${baseUrl}/#organization`
        }
      })
    }

    // 6. FAQPage Schema (Only included if explicit FAQs or pageType is faq)
    if (activeFaqs.value && activeFaqs.value.length > 0) {
      graph.push({
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
      })
    }

    // Append AEO Knowledge Graph Node if configured
    if (adminSeoOverrides.value?.aeoSummary) {
      graph.push({
        '@type': 'AboutPage',
        '@id': `${canonicalUrl.value}/#aeo`,
        name: `${brandName.value} - AEO Knowledge`,
        description: adminSeoOverrides.value.aeoSummary,
        keywords: adminSeoOverrides.value.entities || undefined
      })
    }

    // Append custom schemas from admin overrides (if configured)
    const customAdminSchemas = adminSeoOverrides.value?.customSchemas
    if (customAdminSchemas && Array.isArray(customAdminSchemas) && customAdminSchemas.length > 0) {
      const safeCustom = safeUnwrap(customAdminSchemas)
      if (Array.isArray(safeCustom)) {
        graph.push(...safeCustom)
      }
    }

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

    const isIndexable = adminSeoOverrides.value ? (adminSeoOverrides.value.indexable !== false) : !options.noindex
    const isFollowable = adminSeoOverrides.value ? (adminSeoOverrides.value.followLinks !== false) : true
    const robotsDirective = isIndexable
      ? `${isFollowable ? 'index, follow' : 'index, nofollow'}, max-snippet:-1, max-image-preview:large, max-video-preview:-1`
      : 'noindex, nofollow'

    const ogTitle = adminSeoOverrides.value?.ogTitle || pageTitle.value
    const ogDesc = adminSeoOverrides.value?.ogDescription || metaDescription.value

    return {
      title: pageTitle.value,
      htmlAttrs: {
        lang: currentLang.value === 'FA' ? 'fa-IR' : (currentLang.value === 'AR' ? 'ar-SA' : 'en-US'),
        dir: isRTL.value ? 'rtl' : 'ltr'
      },
      meta: [
        { name: 'description', content: metaDescription.value },
        { name: 'robots', content: robotsDirective },
        { name: 'author', content: brandName.value },
        { name: 'theme-color', content: '#115247' },

        // Open Graph
        { property: 'og:site_name', content: brandName.value },
        { property: 'og:title', content: ogTitle },
        { property: 'og:description', content: ogDesc },
        { property: 'og:type', content: options.type === 'article' ? 'article' : (options.type === 'product' ? 'product' : 'website') },
        { property: 'og:url', content: canonicalUrl.value },
        { property: 'og:locale', content: currentLang.value === 'FA' ? 'fa_IR' : (currentLang.value === 'AR' ? 'ar_SA' : 'en_US') },
        ...(currentLang.value === 'FA'
          ? [
              { property: 'og:locale:alternate', content: 'en_US' },
              { property: 'og:locale:alternate', content: 'ar_SA' }
            ]
          : currentLang.value === 'EN'
          ? [
              { property: 'og:locale:alternate', content: 'fa_IR' },
              { property: 'og:locale:alternate', content: 'ar_SA' }
            ]
          : [
              { property: 'og:locale:alternate', content: 'fa_IR' },
              { property: 'og:locale:alternate', content: 'en_US' }
            ]
        ),
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@NajmPrinting' },
        { name: 'twitter:title', content: ogTitle },
        { name: 'twitter:description', content: ogDesc },
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

