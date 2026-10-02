// server/api/admin/pb/sync-all.post.ts
import fs from 'node:fs'
import path from 'node:path'
import { defineEventHandler, getCookie, createError } from 'h3'
import { syncContentToPocketBase } from '~/server/utils/contentStore'

export default defineEventHandler(async (event) => {
  // Auth: check cookie or dev
  const token = getCookie(event, 'pb_admin')
  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
  if (!token && !isDev) {
    throw createError({ statusCode: 401, statusMessage: 'not authenticated' })
  }

  const schemasDir = path.resolve(process.cwd(), 'schemas')
  if (!fs.existsSync(schemasDir)) {
    return { ok: false, message: 'Schemas directory not found' }
  }

  const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('-ui.json'))
  const results: { slug: string; success: boolean }[] = []

  for (const file of files) {
    const slug = file.replace(/-ui\.json$/, '')
    try {
      const raw = fs.readFileSync(path.join(schemasDir, file), 'utf-8')
      const data = JSON.parse(raw)
      const success = await syncContentToPocketBase(slug, data)
      results.push({ slug, success })
    } catch (err: any) {
      results.push({ slug, success: false })
    }
  }

  return {
    ok: true,
    total: files.length,
    synced: results.filter(r => r.success).length,
    results
  }
})
