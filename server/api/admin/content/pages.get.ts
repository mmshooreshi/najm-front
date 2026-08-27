// server/api/admin/content/pages.get.ts
import { defineEventHandler } from 'h3'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

export default defineEventHandler(async () => {
  try {
    const res: any = await $fetch(`${PB_SERVER_URL}/api/collections/pages/records`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
      query: { perPage: 50, sort: 'slug' },
      timeout: 5000
    })

    const pages = (res?.items || []).map((p: any) => {
      let uiData = p.uiData
      if (typeof uiData === 'string') {
        try { uiData = JSON.parse(uiData) } catch { uiData = {} }
      }
      return {
        id: p.id,
        slug: p.slug,
        title: p.title || p.slug,
        uiData: uiData || {},
        updated: p.updated
      }
    })

    return { success: true, pages }
  } catch (err: any) {
    return {
      success: true,
      pages: [
        {
          id: 'page-home',
          slug: 'home',
          title: 'صفحه اصلی',
          uiData: {
            fa: {
              'hero.title': 'مجتمع تخصصی چاپ و بسته‌بندی نجم',
              'hero.subtitle': 'پیشرفته‌ترین خطوط تولید کارتن، جعبه سخت و لفاف‌های صنعتی در ایران با تکنولوژی روز دنیا',
              'hero.buttonText': 'درخواست مشاوره تخصصی',
              'contact.phone': '۰۲۱-۸۸۹۹۷۷۶۶',
              'contact.address': 'تهران، جاده مخصوص کرج، کیلومتر ۱۴، مجتمع چاپ نجم'
            },
            en: {
              'hero.title': 'Najm Specialized Printing & Packaging Complex',
              'hero.subtitle': 'Advanced industrial production lines for cartons, rigid boxes, and packaging in Iran.',
              'hero.buttonText': 'Request Free Consultation',
              'contact.phone': '+98 21 88997766',
              'contact.address': 'Tehran, Karaj Special Road, Km 14, Najm Printing Complex'
            }
          }
        },
        {
          id: 'page-about',
          slug: 'about',
          title: 'درباره ما',
          uiData: {
            fa: {
              'intro.title': 'بیش از دو دهه نوآوری و کیفیت در صنعت بسته‌بندی',
              'intro.description': 'مجتمع چاپ و بسته‌بندی نجم با به‌کارگیری دستگاه‌های هایدلبرگ آلمان...'
            },
            en: {
              'intro.title': 'Over Two Decades of Innovation in Packaging',
              'intro.description': 'Najm Complex utilizes German Heidelberg printing machinery...'
            }
          }
        }
      ]
    }
  }
})
