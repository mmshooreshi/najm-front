// server/api/admin/media/move.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

const PB_SERVER_URL = process.env.PB_URL || 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN =
  process.env.PB_SUPERUSER_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, targetPath, oldPath, url } = body || {}

  if (!id && !url && !oldPath) {
    throw createError({ statusCode: 400, statusMessage: 'مشخصات فایل الزامی است.' })
  }

  const currentUrl = url || oldPath || ''
  let newUrl = ''

  // Physical disk move for uploaded files
  if (currentUrl && (currentUrl.startsWith('/uploads/') || currentUrl.startsWith('uploads/'))) {
    try {
      const oldRel = currentUrl.replace(/^\/?uploads\//, '')
      const fileName = path.basename(oldRel)
      const cleanTargetFolder = (targetPath || '').replace(/^\/+|\/+$/g, '')

      const oldPublic = path.resolve(process.cwd(), 'public', 'uploads', oldRel)
      const newPublicDir = path.resolve(process.cwd(), 'public', 'uploads', cleanTargetFolder)
      const newPublic = path.join(newPublicDir, fileName)

      const oldData = path.resolve(process.cwd(), '.data', 'uploads', oldRel)
      const newDataDir = path.resolve(process.cwd(), '.data', 'uploads', cleanTargetFolder)
      const newData = path.join(newDataDir, fileName)

      if (fs.existsSync(oldPublic)) {
        if (!fs.existsSync(newPublicDir)) fs.mkdirSync(newPublicDir, { recursive: true })
        fs.renameSync(oldPublic, newPublic)
      }
      if (fs.existsSync(oldData)) {
        if (!fs.existsSync(newDataDir)) fs.mkdirSync(newDataDir, { recursive: true })
        fs.renameSync(oldData, newData)
      }

      newUrl = `/uploads/${cleanTargetFolder ? cleanTargetFolder + '/' : ''}${fileName}`.replace(/\/+/g, '/')
    } catch (fsErr) {
      console.warn('[Move] Error moving file on disk:', fsErr)
    }
  }

  try {
    if (id && !id.startsWith('local-') && !id.startsWith('up-')) {
      const res = await $fetch(`${PB_SERVER_URL}/api/collections/media_files/records/${id}`, {
        method: 'PATCH',
        headers: { Authorization: PB_SUPERUSER_TOKEN, 'Content-Type': 'application/json' },
        body: { path: targetPath },
        timeout: 2000
      }).catch(() => null)
      return { success: true, item: res, url: newUrl || undefined }
    }
    return { success: true, id, path: targetPath, url: newUrl || undefined }
  } catch (err: any) {
    return { success: true, id, path: targetPath, url: newUrl || undefined, warning: err?.message }
  }
})
