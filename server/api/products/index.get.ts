// server/api/products/index.get.ts
import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const division = query.division as string | undefined
  const category = query.category as string | undefined
  const search = query.search as string | undefined

  const runtimeConfig = useRuntimeConfig()
  const pbUrl = runtimeConfig.public?.pbUrl || process.env.PB_URL || "http://65.108.80.205:8090"
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0"

  try {
    const res: any = await $fetch(`${pbUrl}/api/collections/products/records`, {
      headers: { Authorization: token },
      query: { perPage: 100, sort: '-created' },
      timeout: 3000
    }).catch(() => null)

    if (res?.items && res.items.length > 0) {
      let items = res.items.map((p: any) => {
        let minQtyVal = '۱,۰۰۰ عدد'
        if (typeof p.inventory === 'number' || typeof p.inventory === 'string') {
          minQtyVal = `${p.inventory} عدد`
        } else if (p.inventory && typeof p.inventory === 'object') {
          minQtyVal = `${p.inventory.min || p.inventory.count || 1000} عدد`
        } else if (p.minQty) {
          minQtyVal = typeof p.minQty === 'object' ? `${p.minQty.min || 1000} عدد` : String(p.minQty)
        }

        let specs = p.attributes || p.specs || {}
        if (typeof specs === 'string') {
          try { specs = JSON.parse(specs) } catch {}
        }

        let locales = p.locales || {}
        if (typeof locales === 'string') {
          try { locales = JSON.parse(locales) } catch {}
        }

        const div = p.division || (['hardbox', 'pharma', 'carton', 'flexible', 'bag'].includes(p.family || p.category) ? 'packaging' : 'printing')

        return {
          id: p.id,
          slug: p.slug || p.id,
          division: div,
          title: p.name || p.title || 'محصول مجتمع نجم',
          category: p.family || p.category || 'hardbox',
          categoryLabel: p.categoryLabel || p.family || 'بسته‌بندی و چاپ',
          description: p.description || p.shortDescription || '',
          image: p.media?.[0] ? `${pbUrl}/api/files/products/${p.id}/${p.media[0]}` : (p.image || '/images/sections/cards/01.png'),
          gallery: Array.isArray(p.media) ? p.media.map((m: string) => `${pbUrl}/api/files/products/${p.id}/${m}`) : [],
          dielineFile: p.dielineFile || '',
          paperType: p.paperType || specs?.paperType || 'ایندربرد ۳۵۰ گرم',
          coating: p.coating || specs?.coating || 'طلاکوب مات + سلفون حرارتی',
          dimensions: p.dimensions || specs?.dimensions || '۲۰×۱۵×۸ سانتی‌متر',
          binding: p.binding || specs?.binding || '',
          printSystem: p.printSystem || specs?.printSystem || 'افست هایدلبرگ ۵ رنگ',
          minQty: minQtyVal,
          leadTime: p.leadTime || '۷ الی ۱۰ روز کاری',
          locales: {
            fa: {
              title: locales.fa?.title || p.name || p.title || 'محصول مجتمع نجم',
              description: locales.fa?.description || p.description || '',
              application: locales.fa?.application || 'صادراتی و فروشگاهی'
            },
            en: {
              title: locales.en?.title || p.nameEn || 'Custom Product',
              description: locales.en?.description || p.descriptionEn || '',
              application: locales.en?.application || 'Export & Retail'
            },
            ar: {
              title: locales.ar?.title || p.nameAr || 'منتج مخصص',
              description: locales.ar?.description || p.descriptionAr || '',
              application: locales.ar?.application || 'للتصدير والتجزئة'
            }
          }
        }
      })

      if (division && division !== 'all') {
        items = items.filter((i: any) => i.division === division)
      }
      if (category && category !== 'all') {
        items = items.filter((i: any) => i.category === category)
      }
      if (search) {
        const q = search.toLowerCase()
        items = items.filter((i: any) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
      }

      return { ok: true, items, total: items.length }
    }
  } catch (err) {}

  // Comprehensive Real Default Portfolio covering Packaging AND Printing
  const defaultProducts = [
    // ─── 1. PACKAGING DIVISION ───
    {
      id: 'pkg-saffron-hardbox',
      slug: 'luxury-saffron-magnetic-box',
      division: 'packaging',
      title: 'هاردباکس کتابی مگنتی زعفران و عطر',
      category: 'hardbox',
      categoryLabel: 'هاردباکس و جعبه لوکس',
      description: 'طراحی شده با مقوای کرجی فشرده ۲ میلی‌متر و روکش گالینگور مات با قفل آهنربایی نئودیمیوم.',
      image: '/images/sections/cards/01.png',
      gallery: ['/images/sections/cards/01.png', '/images/sections/cards/02.png'],
      dielineFile: '/pdf/saffron-box-dieline.pdf',
      paperType: 'مقوای کرجی ۲ میل + گالینگور',
      coating: 'طلاکوب مات + فوم مخمل خورده',
      dimensions: '۲۲×۱۶×۶ سانتی‌متر',
      minQty: '۲,۰۰۰ عدد',
      leadTime: '۷ الی ۱۰ روز کاری',
      locales: {
        fa: { title: 'هاردباکس کتابی مگنتی زعفران و عطر', description: 'طراحی شده با مقوای کرجی فشرده ۲ میلی‌متر و روکش گالینگور مات با قفل آهنربایی نئودیمیوم.', application: 'بسته‌بندی هدیه، زعفران صادراتی، عطر و ادکلن' },
        en: { title: 'Luxury Magnetic Book-Style Rigid Box', description: 'Engineered with 2mm high-density chipboard and matte leatherette coating with neodymium magnetic closure.', application: 'Export Saffron, Fragrance & Gift Packaging' },
        ar: { title: 'علبة هاردبوكس مغناطيسية فاخرة للزعفران والعطور', description: 'مصنوعة من كرتون صلب مضغوط عالي الكثافة ٢ مم مع قفل مغناطيسي وطباعة رقائق ذهبية.', application: 'تغليف الزعفران الفاخر، العطور والهدايا' }
      }
    },
    {
      id: 'pkg-pharma-box',
      slug: 'pharmaceutical-indurboard-box',
      division: 'packaging',
      title: 'جعبه دارویی ایندربرد با خط بریل و لبه قفلی',
      category: 'folding_carton',
      categoryLabel: 'جعبه مقوایی و ایندربرد',
      description: 'تولید شده تحت استانداردهای بهداشتی GMP با خط تا و دایکات فوق‌العاده دقیق برای خطوط بسته‌بندی اتوماتیک دارویی.',
      image: '/images/sections/cards/02.png',
      gallery: ['/images/sections/cards/02.png', '/images/sections/cards/03.png'],
      dielineFile: '/pdf/pharma-box-dieline.pdf',
      paperType: 'ایندربرد بهداشتی ۳۰۰ گرم',
      coating: 'سلفون مات حرارتی + برجسته‌سازی بریل',
      dimensions: '۱۴×۸×۴ سانتی‌متر',
      minQty: '۱۰,۰۰۰ عدد',
      leadTime: '۵ الی ۷ روز کاری',
      locales: {
        fa: { title: 'جعبه دارویی ایندربرد با خط بریل و لبه قفلی', description: 'تولید شده تحت استانداردهای بهداشتی GMP با خط تا و دایکات فوق‌العاده دقیق برای خطوط بسته‌بندی اتوماتیک دارویی.', application: 'داروهای انسانی، مکمل‌های غذایی و قطره‌های چشمی' },
        en: { title: 'Pharmaceutical SBS Folding Carton with Braille', description: 'Manufactured under strict GMP standards with precision die-cutting and tactile Braille embossing for automated packaging lines.', application: 'Pharmaceuticals, Health Supplements & Drops' },
        ar: { title: 'علبة أدوية كرتونية مع كتابة برايل للمكفوفين', description: 'مصنوعة من ورق كرتون صحي مخصص للصناعات الدوائية متوافق مع معايير GMP العالمية.', application: 'الأدوية والمكملات الغذائية والمستحضرات الطبية' }
      }
    },
    {
      id: 'pkg-laminated-carton',
      slug: 'export-laminated-fruit-carton',
      division: 'packaging',
      title: 'کارتن لمینتی ۵ لایه صادراتی خرما و خشکبار',
      category: 'laminated_carton',
      categoryLabel: 'کارتن لمینتی صادراتی',
      description: 'مقاومت بسیار بالا در برابر رطوبت و فشار در کانتینرهای سردخانه‌ای با چاپ ۴ رنگ افست روی گلاسه لمینت.',
      image: '/images/sections/cards/03.png',
      gallery: ['/images/sections/cards/03.png'],
      dielineFile: '/pdf/fruit-carton-dieline.pdf',
      paperType: 'فلوتینگ E-Flute + گلاسه لمینت',
      coating: 'ورنی براق ضد آب + سلفون OPP',
      dimensions: '۴۰×۳۰×۱۵ سانتی‌متر',
      minQty: '۵,۰۰۰ عدد',
      leadTime: '۷ الی ۱۰ روز کاری',
      locales: {
        fa: { title: 'کارتن لمینتی ۵ لایه صادراتی خرما و خشکبار', description: 'مقاومت بسیار بالا در برابر رطوبت و فشار در کانتینرهای سردخانه‌ای با چاپ ۴ رنگ افست روی گلاسه لمینت.', application: 'صادرات خرما، پسته، میوه تازه و خشکبار' },
        en: { title: '5-Ply Export Laminated Carton for Fresh Fruits & Nuts', description: 'High burst strength and moisture resistance engineered for refrigerated export containers with full-color offset lamination.', application: 'Export Dates, Pistachios & Fresh Produce' },
        ar: { title: 'كرتون مصفح ٥ طبقات لتصدير التمور والمكسرات', description: 'مقاوم للرطوبة والضغط مصمم خصيصاً للحاويات المبردة مع طباعة أوفست عالية الدقة.', application: 'تصدير التمور والمكسرات والفواكه الطازجة' }
      }
    },
    {
      id: 'pkg-shopping-bag',
      slug: 'luxury-boutique-shopping-bag',
      division: 'packaging',
      title: 'ساک دستی گلاسه براق با بند روبانی و طلاکوب',
      category: 'shopping_bag',
      categoryLabel: 'ساک دستی و بگ تبلیغاتی',
      description: 'کاغذ گلاسه ۲۵۰ گرم با تقویت کفی و عطف، سلفون حرارتی مات و بند روبانی ساتن اختصاصی.',
      image: '/images/main/7.png',
      gallery: ['/images/main/7.png'],
      paperType: 'گلاسه ۲۵۰ گرم + مقوای کفی',
      coating: 'سلفون مات حرارتی + طلاکوب برجسته',
      dimensions: '۳۵×۲۵×۱۰ سانتی‌متر',
      minQty: '۱,۰۰۰ عدد',
      leadTime: '۵ الی ۷ روز کاری',
      locales: {
        fa: { title: 'ساک دستی گلاسه براق با بند روبانی و طلاکوب', description: 'ساک خرید شیک فروشگاهی با تقویت کفی و لبه.', application: 'فروشگاه‌های پوشاک، جواهرات و بوتیک‌های لوکس' },
        en: { title: 'Luxury Laminated Boutique Shopping Bag', description: '250g art paper shopping bag with reinforced bottom board and satin ribbon handles.', application: 'Apparel Boutiques, Jewelry & Luxury Retail' },
        ar: { title: 'حقيبة تسوق ورقية فاخرة بشرائط ساتان', description: 'ورق كوشيه ٢٥۰ جم مع قاعدة مقواة وبصمة ذهبية بارزة.', application: 'المتاجر الفاخرة، المجوهرات والأزياء' }
      }
    },

    // ─── 2. COMMERCIAL PRINTING DIVISION ───
    {
      id: 'prt-catalog-brochure',
      slug: 'corporate-industrial-catalog',
      division: 'printing',
      title: 'کاتالوگ جامع صنعتی چندلت با صحافی چسب گرم',
      category: 'catalog_brochure',
      categoryLabel: 'کاتالوگ و بروشور چندلت',
      description: 'چاپ ۵ رنگ هایدلبرگ روی گلاسه ۲۰۰ گرم با جلد سخت ۳۰۰ گرم، یووی موضعی و طلاکوب روی لوگو.',
      image: '/images/products/3.png',
      gallery: ['/images/products/3.png'],
      paperType: 'گلاسه ۲۰۰ گرم داخلی + ۳۰۰ گرم جلد',
      coating: 'سلفون مات حرارتی + یووی موضعی',
      dimensions: 'قطع رحلی (A4)',
      binding: 'چسب گرم اتوماتیک (PUR)',
      printSystem: 'افست هایدلبرگ ۵ رنگ',
      minQty: '۵۰۰ جلد',
      leadTime: '۵ الی ۷ روز کاری',
      locales: {
        fa: { title: 'کاتالوگ جامع صنعتی چندلت با صحافی چسب گرم', description: 'کاتالوگ نفیس شرکتی با کیفیت چاپ فوق‌العاده و تفکیک رنگ استاندارد اروپایی.', application: 'نمایشگاه‌های بین‌المللی، معرفی تجهیزات و محصولات شرکتی' },
        en: { title: 'Industrial Multi-Page Catalog with PUR Binding', description: '5-color Heidelberg offset printing on 200g art paper with 300g soft-touch matte laminated cover and spot UV.', application: 'Trade Shows, Corporate Product Portfolios & Machinery' },
        ar: { title: 'كتالوج صناعي شامل متعدد الصفحات مع تجليد حراري', description: 'طباعة هايدلبرغ ٥ ألوان عالية الدقة مع سلفون مطفي ولمسات يو في موضعي.', application: 'المعارض الدولية، ملفات الشركات والمنتجات' }
      }
    },
    {
      id: 'prt-folder-stationery',
      slug: 'executive-presentation-folder',
      division: 'printing',
      title: 'فولدر مدیریتی دایکاتی با جای کارت ویزیت و سی‌دی',
      category: 'folder_stationery',
      categoryLabel: 'فولدر و ست اداری',
      description: 'مقوای ایندربرد ۳۵۰ گرم با دایکات اختصاصی قفل‌شو، سلفون مخملی و طلاکوب نقره‌ای مات.',
      image: '/images/products/1.png',
      gallery: ['/images/products/1.png'],
      paperType: 'ایندربرد ۳۵۰ گرم بهداشتی',
      coating: 'سلفون مخملی Soft-Touch + طلاکوب',
      dimensions: '۲۴×۳۴ سانتی‌متر (مناسب اسناد A4)',
      binding: 'دایکات قفل‌شونده بدون نیاز به چسب',
      printSystem: 'افست هایدلبرگ ۴ رنگ',
      minQty: '۱,۰۰۰ عدد',
      leadTime: '۴ الی ۶ روز کاری',
      locales: {
        fa: { title: 'فولدر مدیریتی دایکاتی با جای کارت ویزیت و سی‌دی', description: 'پوشه اداری لوکس جهت ارائه قراردادها و مدارک سازمانی.', application: 'شرکت‌های هلدینگ، سازمان‌ها و جلسات مناقصه' },
        en: { title: 'Executive Die-Cut Presentation Folder', description: '350g SBS paperboard with custom pocket dieline, business card slits, and soft-touch lamination.', application: 'Corporate Proposals, Contracts & Holding Companies' },
        ar: { title: 'حافظة ومجلد ملفات إدارية فاخرة مع جيب للبطاقات', description: 'كرتون إندربرد ٣٥۰ جم مع قص داي-كت محكم وبصمة فضية فاخرة.', application: 'الشركات، المناقصات والعقود الرسمية' }
      }
    },
    {
      id: 'prt-calendar-planner',
      slug: 'executive-leatherette-desk-planner',
      division: 'printing',
      title: 'سررسید وزیری چرمی و تقویم رومیزی پایه چوبی',
      category: 'calendar_planner',
      categoryLabel: 'سررسید و تقویم',
      description: 'کاغذ تحریر ۷۰ گرم اندونزی کرم با چاپ ۲ رنگ، جلد چرم ترمو با داغی لیزری و بدرقه اختصاصی.',
      image: '/images/products/4.png',
      gallery: ['/images/products/4.png'],
      paperType: 'تحریر ۷۰ گرم کرم + جلد چرم ترمو',
      coating: 'حک داغی لیزری روی چرم + طلاکوب عطف',
      dimensions: 'قطع وزیری (۱۷×۲۴ سانتی‌متر)',
      binding: 'دوخت دستی + چسب گرم و روبان مارک‌دار',
      printSystem: 'افست ۲ رنگ اختصاصی',
      minQty: '۵۰۰ جلد',
      leadTime: '۷ الی ۱۰ روز کاری',
      locales: {
        fa: { title: 'سررسید وزیری چرمی و تقویم رومیزی پایه چوبی', description: 'هدایای تبلیغاتی پایان سال با بالاترین کیفیت متریال و صحافی.', application: 'هدایای سازمانی پایان سال، مدیران ارشد و مشتریان ویژه' },
        en: { title: 'Executive Leatherette Planner & Wooden Desk Calendar', description: '70g cream paper with 2-color interior printing, thermo-leather cover with blind debossing.', application: 'Year-End VIP Corporate Gifts & Executive Desks' },
        ar: { title: 'مفكرة سنوية جلدية فاخرة وتقويم مكتبي بقاعدة خشبية', description: 'ورق كريمي فاخر ٧۰ جم مع غلاف جلدي حراري ونقش ليزري.', application: 'هدايا نهاية العام لكبار العملاء والمديرين' }
      }
    },
    {
      id: 'prt-label-sticker',
      slug: 'industrial-metallized-roll-labels',
      division: 'printing',
      title: 'لیبل رول متالایز ضدآب و هولوگرام امنیتی',
      category: 'label_sticker',
      categoryLabel: 'لیبل و استیکر رول',
      description: 'چاپ یووی روتاری روی پلی‌پروپیلن (PP) متالایز با چسبندگی فوق‌العاده به شیشه، فلز و پت.',
      image: '/images/products/5.png',
      gallery: ['/images/products/5.png'],
      paperType: 'فیلم متالایز پشت‌چسب‌دار PP',
      coating: 'یووی موضعی براق + سلفون محافظ OPP',
      dimensions: 'ابعاد سفارشی رول دایکاتی',
      binding: 'ارائه به صورت رول برای دستگاه‌های لیبل‌چسبان اتوماتیک',
      printSystem: 'چاپ یووی رول فلکسو / افست',
      minQty: '۵,۰۰۰ عدد',
      leadTime: '۳ الی ۵ روز کاری',
      locales: {
        fa: { title: 'لیبل رول متالایز ضدآب و هولوگرام امنیتی', description: 'لیبل‌های صنعتی با چسبندگی قوی در برابر روغن، رطوبت و حرارت.', application: 'صنایع داروسازی، آرایشی بهداشتی، روغن‌های صنعتی و مواد غذایی' },
        en: { title: 'Waterproof Metallized Roll Labels with Security Hologram', description: 'Rotary UV printed on metallized PP film with heavy-duty adhesive for glass, PET, and metal containers.', application: 'Pharmaceuticals, Cosmetics, Industrial Oils & Gourmet Jars' },
        ar: { title: 'ملصقات رول ميتالايز مقاومة للماء مع هولوغرام أمني', description: 'طباعة روتاري يو في على أفلام بولي بروبيلين مقاومة للزيوت والرطوبة.', application: 'الأدوية، مستحضرات التجميل، الزيوت والأغذية' }
      }
    }
  ]

  let filtered = defaultProducts
  if (division && division !== 'all') {
    filtered = filtered.filter(p => p.division === division)
  }
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }

  return { ok: true, items: filtered, total: filtered.length }
})
