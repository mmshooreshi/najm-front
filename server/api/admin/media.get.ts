// server/api/admin/media.get.ts
import { defineEventHandler, getQuery } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

const SUPPORTED_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg',
  'mp4', 'webm', 'ogg', 'mov',
  'mp3', 'wav', 'm4a',
  'pdf', 'psd', 'ai'
])

function scanLocalDirectory(dir: string, baseDir: string, list: any[] = []) {
  try {
    if (!fs.existsSync(dir)) return list
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        scanLocalDirectory(fullPath, baseDir, list)
      } else if (entry.isFile()) {
        const ext = entry.name.split('.').pop()?.toLowerCase() || ''
        if (SUPPORTED_EXTENSIONS.has(ext)) {
          const relPath = '/' + path.relative(baseDir, fullPath).replace(/\\/g, '/')
          let size = 0
          try {
            const stat = fs.statSync(fullPath)
            size = stat.size
          } catch {}

          let category = 'image'
          if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) category = 'video'
          else if (['mp3', 'wav', 'm4a'].includes(ext)) category = 'audio'
          else if (['pdf', 'psd', 'ai'].includes(ext)) category = 'document'
          else if (ext === 'svg') category = 'vector'

          list.push({
            id: `local-${Buffer.from(relPath).toString('base64url')}`,
            filename: entry.name,
            file: entry.name,
            format: ext.toUpperCase(),
            mime: `${category}/${ext}`,
            category,
            size,
            url: relPath,
            path: relPath,
            source: 'local'
          })
        }
      }
    }
  } catch (e) {}
  return list
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = query.search ? String(query.search).toLowerCase() : ''
  const categoryFilter = query.category ? String(query.category).toLowerCase() : ''
  const formatFilter = query.format ? String(query.format).toLowerCase() : ''

  const allItems: any[] = []
  const seenUrls = new Set<string>()

  // 1. Fetch from PocketBase
  try {
    const res: any = await $fetch(`${PB_SERVER_URL}/api/collections/media_files/records`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
      params: { perPage: 200, sort: '-created' },
      timeout: 3000
    }).catch(() => null)

    if (res?.items && Array.isArray(res.items)) {
      for (const m of res.items) {
        const ext = (m.format || m.file?.split('.').pop() || 'png').toLowerCase()
        const url = `${PB_SERVER_URL}/api/files/media_files/${m.id}/${m.file}`
        if (!seenUrls.has(url)) {
          seenUrls.add(url)
          let cat = 'image'
          if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) cat = 'video'
          else if (['mp3', 'wav', 'm4a'].includes(ext)) cat = 'audio'
          else if (['pdf', 'psd', 'ai'].includes(ext)) cat = 'document'
          else if (ext === 'svg') cat = 'vector'

          allItems.push({
            id: m.id,
            filename: m.filename || m.file || 'media-file',
            file: m.file,
            format: ext.toUpperCase(),
            mime: m.mime || `${cat}/${ext}`,
            category: cat,
            width: m.width || 0,
            height: m.height || 0,
            size: m.size || 0,
            url,
            path: m.path || '',
            created: m.created,
            source: 'pocketbase'
          })
        }
      }
    }
  } catch (err) {}

  // 2. Scan Local Static Directories in public/
  const publicDir = path.resolve(process.cwd(), 'public')
  const localFiles = scanLocalDirectory(publicDir, publicDir)

  for (const item of localFiles) {
    if (!seenUrls.has(item.url)) {
      seenUrls.add(item.url)
      allItems.push(item)
    }
  }

  // 3. Filter
  let filtered = allItems
  if (search) {
    filtered = filtered.filter(i =>
      i.filename.toLowerCase().includes(search) ||
      i.format.toLowerCase().includes(search) ||
      i.url.toLowerCase().includes(search)
    )
  }

  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter(i => i.category === categoryFilter)
  }

  if (formatFilter && formatFilter !== 'all') {
    filtered = filtered.filter(i => i.format.toLowerCase() === formatFilter)
  }

  return {
    success: true,
    items: filtered,
    totalItems: filtered.length
  }
})
