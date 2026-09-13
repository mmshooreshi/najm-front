// server/routes/sitemap.xml.ts
import { defineEventHandler, setResponseHeader } from 'h3'

interface SitemapRoute {
  path: string
  priority: string
  changefreq: 'daily' | 'weekly' | 'monthly'
}

const routes: SitemapRoute[] = [
  {
    "path": "",
    "priority": "1.0",
    "changefreq": "daily"
  },
  {
    "path": "/catalog",
    "priority": "0.95",
    "changefreq": "weekly"
  },
  {
    "path": "/facilities",
    "priority": "0.9",
    "changefreq": "weekly"
  },
  {
    "path": "/consultation",
    "priority": "0.9",
    "changefreq": "weekly"
  },
  {
    "path": "/about",
    "priority": "0.85",
    "changefreq": "monthly"
  },
  {
    "path": "/contact",
    "priority": "0.85",
    "changefreq": "monthly"
  },
  {
    "path": "/history",
    "priority": "0.75",
    "changefreq": "monthly"
  },
  {
    "path": "/faq",
    "priority": "0.8",
    "changefreq": "weekly"
  },
  {
    "path": "/products",
    "priority": "0.95",
    "changefreq": "weekly"
  },
  {
    "path": "/products/packaging",
    "priority": "0.9",
    "changefreq": "weekly"
  },
  {
    "path": "/products/packaging/boxes",
    "priority": "0.9",
    "changefreq": "weekly"
  },
  {
    "path": "/products/packaging/labels",
    "priority": "0.85",
    "changefreq": "weekly"
  },
  {
    "path": "/products/printing",
    "priority": "0.9",
    "changefreq": "weekly"
  },
  {
    "path": "/products/printing/catalogs",
    "priority": "0.85",
    "changefreq": "weekly"
  },
  {
    "path": "/products/printing/letterhead",
    "priority": "0.8",
    "changefreq": "weekly"
  },
  {
    "path": "/products/industries",
    "priority": "0.9",
    "changefreq": "weekly"
  },
  {
    "path": "/products/industries/food-beverage",
    "priority": "0.85",
    "changefreq": "weekly"
  },
  {
    "path": "/products/industries/cosmetics",
    "priority": "0.85",
    "changefreq": "weekly"
  },
  {
    "path": "/products/industries/pharmaceutical",
    "priority": "0.85",
    "changefreq": "weekly"
  },
  {
    "path": "/products/applications",
    "priority": "0.9",
    "changefreq": "weekly"
  },
  {
    "path": "/products/applications/luxury-packaging",
    "priority": "0.85",
    "changefreq": "weekly"
  },
  {
    "path": "/products/applications/shipping-cartons",
    "priority": "0.8",
    "changefreq": "weekly"
  },
  {
    "path": "/services",
    "priority": "0.9",
    "changefreq": "monthly"
  },
  {
    "path": "/services/pre-press",
    "priority": "0.85",
    "changefreq": "monthly"
  },
  {
    "path": "/services/design-and-layout",
    "priority": "0.85",
    "changefreq": "monthly"
  },
  {
    "path": "/services/lithography-and-plates",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/services/printing-and-packaging",
    "priority": "0.85",
    "changefreq": "monthly"
  },
  {
    "path": "/services/finishing-services",
    "priority": "0.85",
    "changefreq": "monthly"
  },
  {
    "path": "/services/storage-and-warehousing",
    "priority": "0.75",
    "changefreq": "monthly"
  },
  {
    "path": "/resources",
    "priority": "0.85",
    "changefreq": "weekly"
  },
  {
    "path": "/resources/guides",
    "priority": "0.85",
    "changefreq": "weekly"
  },
  {
    "path": "/resources/dielines",
    "priority": "0.85",
    "changefreq": "weekly"
  },
  {
    "path": "/resources/catalog-general-2026",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/resources/catalog-luxury-packaging",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/resources/guide-cmyk-color-profile",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/resources/guide-bleed-and-margins",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/resources/template-tuck-end-box",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/resources/template-auto-bottom-box",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/resources/template-magnetic-rigid-box",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/blog",
    "priority": "0.85",
    "changefreq": "weekly"
  },
  {
    "path": "/blog/inboard-vs-greyboard-packaging",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/blog/luxury-hardbox-finishing-guide",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/blog/offset-vs-digital-printing-guide",
    "priority": "0.8",
    "changefreq": "monthly"
  },
  {
    "path": "/news",
    "priority": "0.8",
    "changefreq": "weekly"
  },
  {
    "path": "/news/tehran-pack-print-expo-2026",
    "priority": "0.75",
    "changefreq": "monthly"
  },
  {
    "path": "/news/heidelberg-new-press-installation",
    "priority": "0.75",
    "changefreq": "monthly"
  },
  {
    "path": "/news/iso-12647-color-certificate-renewal",
    "priority": "0.75",
    "changefreq": "monthly"
  }
]

export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400')

  const baseUrl = 'https://chapenajm.com'
  const today = '2026-09-13'

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

  for (const r of routes) {
    const cleanPath = r.path
    const faUrl = `${baseUrl}${cleanPath}`
    const enUrl = `${baseUrl}/en${cleanPath}`
    const arUrl = `${baseUrl}/ar${cleanPath}`

    xml += '  <url>\n'
    xml += `    <loc>${faUrl}</loc>\n`
    xml += `    <xhtml:link rel="alternate" hreflang="fa" href="${faUrl}" />\n`
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />\n`
    xml += `    <xhtml:link rel="alternate" hreflang="ar" href="${arUrl}" />\n`
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${faUrl}" />\n`
    xml += `    <lastmod>${today}</lastmod>\n`
    xml += `    <changefreq>${r.changefreq}</changefreq>\n`
    xml += `    <priority>${r.priority}</priority>\n`
    xml += '  </url>\n'
  }

  xml += '</urlset>\n'
  return xml
})
