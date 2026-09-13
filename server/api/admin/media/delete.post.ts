// server/api/admin/media/delete.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

const PB_SERVER_URL = process.env.PB_URL || 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN =
  process.env.PB_SUPERUSER_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, url, path: targetPath } = body || {}

  if (!id && !url && !targetPath) {
    throw createError({ statusCode: 400, statusMessage: 'شناسه یا مسیر فایل الزامی است.' })
  }

  // Delete from local disk if it starts with /uploads/ or has a local id
  const targetUrl = url || targetPath || ''
  if (targetUrl && (targetUrl.startsWith('/uploads/') || targetUrl.startsWith('uploads/'))) {
    const rel = targetUrl.replace(/^\/?uploads\//, '')
    const p1 = path.resolve(process.cwd(), 'public', 'uploads', rel)
    const p2 = path.resolve(process.cwd(), '.data', 'uploads', rel)
    try { if (fs.existsSync(p1)) fs.unlinkSync(p1) } catch {}
    try { if (fs.existsSync(p2)) fs.unlinkSync(p2) } catch {}
  } else if (id && id.startsWith('local-')) {
    try {
      const decodedPath = Buffer.from(id.slice(6), 'base64url').toString('utf-8')
      if (decodedPath) {
        const clean = decodedPath.replace(/^\/+/, '')
        const p1 = path.resolve(process.cwd(), 'public', clean)
        const p2 = path.resolve(process.cwd(), '.data', clean)
        try { if (fs.existsSync(p1)) fs.unlinkSync(p1) } catch {}
        try { if (fs.existsSync(p2)) fs.unlinkSync(p2) } catch {}
      }
    } catch {}
  }

  try {
    if (id && !id.startsWith('local-') && !id.startsWith('up-')) {
      await $fetch(`${PB_SERVER_URL}/api/collections/media_files/records/${id}`, {
        method: 'DELETE',
        headers: { Authorization: PB_SUPERUSER_TOKEN },
        timeout: 2000
      }).catch(() => null)
    }
    return { success: true, id }
  } catch (err: any) {
    return { success: true, id, warning: err?.message }
  }
})
