// server/api/admin/sitemap.get.ts
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = (query.locale as string || 'fa').toLowerCase()

  const runtimeConfig = useRuntimeConfig()
  const pbUrl = runtimeConfig.public?.pbUrl || process.env.PB_URL || 'http://65.108.80.205:8090'
  const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

  let livePagesList: any[] = []
  let productsList: any[] = []
  let blogList: any[] = []
  let mediaCount = 0

  try {
    // 1. Fetch live pages from PocketBase with superuser authorization
    const pagesRes: any = await $fetch(`${pbUrl}/api/collections/pages/records`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
      params: { perPage: 100, sort: 'created' },
      timeout: 5000
    }).catch(() => null)
    if (pagesRes?.items) {
      livePagesList = pagesRes.items
    }

    // 2. Fetch live products from PocketBase
    const productsRes: any = await $fetch(`${pbUrl}/api/collections/products/records`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
      params: { perPage: 50 },
      timeout: 5000
    }).catch(() => null)
    if (productsRes?.items) {
      productsList = productsRes.items
    }

    // 3. Fetch live blog posts from PocketBase
    const blogRes: any = await $fetch(`${pbUrl}/api/collections/blog/records`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
      params: { perPage: 10 },
      timeout: 5000
    }).catch(() => null)
    if (blogRes?.items) {
      blogList = blogRes.items
    }

    // 4. Fetch live media count
    const mediaRes: any = await $fetch(`${pbUrl}/api/collections/media_files/records`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
      params: { perPage: 1 },
      timeout: 5000
    }).catch(() => null)
    if (mediaRes) {
      mediaCount = mediaRes.totalItems || 0
    }
  } catch (err) {
    // Fallback
  }

  // Known Page Semantic Archetypes (Icon + Color + Lens)
  const archetypeMap: Record<string, { icon: string, accentColor: string, lens: string, defaultPath: string, parentSlug?: string }> = {
    'home': { icon: 'mdi:home-variant-outline', accentColor: '#018786', lens: 'pages', defaultPath: '/' },
    'about': { icon: 'mdi:information-outline', accentColor: '#018786', lens: 'pages', defaultPath: '/about', parentSlug: 'home' },
    'products': { icon: 'mdi:package-variant-closed', accentColor: '#2563eb', lens: 'products', defaultPath: '/products', parentSlug: 'home' },
    'catalog': { icon: 'mdi:file-pdf-box', accentColor: '#2563eb', lens: 'products', defaultPath: '/catalog', parentSlug: 'products' },
    'services': { icon: 'mdi:factory', accentColor: '#9333ea', lens: 'services', defaultPath: '/services', parentSlug: 'home' },
    'faq': { icon: 'mdi:help-circle-outline', accentColor: '#9333ea', lens: 'services', defaultPath: '/help/faq', parentSlug: 'services' },
    'history': { icon: 'mdi:timeline-text-outline', accentColor: '#d97706', lens: 'knowledge', defaultPath: '/history', parentSlug: 'home' },
    'blog': { icon: 'mdi:post-outline', accentColor: '#d97706', lens: 'knowledge', defaultPath: '/blog', parentSlug: 'history' },
    'contact': { icon: 'mdi:phone-in-talk-outline', accentColor: '#e11d48', lens: 'pages', defaultPath: '/contact', parentSlug: 'home' },
    'login': { icon: 'mdi:lock-outline', accentColor: '#6366f1', lens: 'pages', defaultPath: '/login', parentSlug: 'home' },
    'menu': { icon: 'mdi:menu', accentColor: '#0ea5e9', lens: 'pages', defaultPath: '/#menu', parentSlug: 'home' },
    'footer': { icon: 'mdi:page-layout-footer', accentColor: '#64748b', lens: 'pages', defaultPath: '/#footer', parentSlug: 'home' }
  }

  // 100% PURE DYNAMIC GRAPH NODES INGESTION FROM POCKETBASE
  const nodes = livePagesList
    .filter(p => p.slug && !['loginPrev', 'loginEn', 'loginAr'].includes(p.slug))
    .map(p => {
      const arch = archetypeMap[p.slug] || {
        icon: 'mdi:file-document-outline',
        accentColor: '#018786',
        lens: 'pages',
        defaultPath: `/${p.slug}`,
        parentSlug: 'home'
      }

      // Dynamic Trilingual Extraction from PocketBase uiData
      const uiData = p.uiData || {}
      const faContent = uiData.fa || uiData.FA || {}
      const enContent = uiData.en || uiData.EN || {}
      const arContent = uiData.ar || uiData.AR || {}

      const titleFa = faContent.title || p.title || p.slug
      const titleEn = enContent.title || p.slug
      const titleAr = arContent.title || titleFa

      const descFa = faContent.subtitle || p.description || ''
      const descEn = enContent.subtitle || ''
      const descAr = arContent.subtitle || ''

      return {
        id: `pb-${p.slug}`,
        slug: p.slug,
        parentSlug: p.slug === 'home' ? null : (arch.parentSlug || 'home'),
        lens: arch.lens,
        titleFa,
        titleEn,
        titleAr,
        descFa,
        descEn,
        descAr,
        path: arch.defaultPath,
        icon: arch.icon,
        accentColor: arch.accentColor,
        source: 'backend',
        backendRecordId: p.id,
        layoutType: p.layoutType,
        liveData: {
          titleFa,
          titleEn,
          titleAr,
          subtitleFa: descFa,
          subtitleEn: descEn,
          subtitleAr: descAr,
          rawUiData: uiData
        }
      }
    })

  // Append Blog Node dynamically if not already present
  if (!nodes.some(n => n.slug === 'blog') && blogList.length > 0) {
    const mainPost = blogList[0]
    nodes.push({
      id: 'pb-blog',
      slug: 'blog',
      parentSlug: 'history',
      lens: 'knowledge',
      titleFa: 'وبلاگ تخصصی چاپ',
      titleEn: 'Technical Blog',
      titleAr: 'المدونة التقنية',
      descFa: 'دانشنامه مقالات و استانداردهای چاپی',
      descEn: 'Technical printing articles and encyclopedia',
      descAr: 'مقالات تقنية وموسوعة مواد الطباعة',
      path: '/blog',
      icon: 'mdi:post-outline',
      accentColor: '#d97706',
      source: 'backend',
      backendRecordId: mainPost.id,
      layoutType: 'custom',
      liveData: {
        titleFa: 'وبلاگ تخصصی چاپ',
        titleEn: 'Technical Blog',
        titleAr: 'المدونة التقنية',
        subtitleFa: 'دانشنامه مقالات و استانداردهای چاپی',
        subtitleEn: 'Technical printing articles',
        subtitleAr: 'مقالات تقنية',
        rawUiData: {
          totalPosts: blogList.length,
          posts: blogList.map(b => ({ id: b.id, title: b.title, slug: b.slug }))
        }
      }
    })
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    locale,
    stats: {
      totalNodes: nodes.length,
      backendSyncedCount: nodes.length,
      totalLivePagesInPB: livePagesList.length,
      totalLiveProductsInPB: productsList.length,
      totalLiveBlogPostsInPB: blogList.length,
      mediaCount
    },
    nodes
  }
})
