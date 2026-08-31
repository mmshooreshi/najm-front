// server/routes/sitemap.xml.ts
import { defineEventHandler, setResponseHeader } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400')

  try {
    const filePath = path.resolve(process.cwd(), 'public', 'sitemap.xml')
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8')
    }
  } catch (e) {}

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://chapenajm.com/</loc><lastmod>2026-08-31</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://chapenajm.com/about</loc><lastmod>2026-08-31</lastmod><priority>0.9</priority></url>
  <url><loc>https://chapenajm.com/facilities</loc><lastmod>2026-08-31</lastmod><priority>0.9</priority></url>
  <url><loc>https://chapenajm.com/products</loc><lastmod>2026-08-31</lastmod><priority>0.9</priority></url>
  <url><loc>https://chapenajm.com/catalog</loc><lastmod>2026-08-31</lastmod><priority>0.9</priority></url>
  <url><loc>https://chapenajm.com/contact</loc><lastmod>2026-08-31</lastmod><priority>0.9</priority></url>
  <url><loc>https://chapenajm.com/consultation</loc><lastmod>2026-08-31</lastmod><priority>0.9</priority></url>
</urlset>`
})
