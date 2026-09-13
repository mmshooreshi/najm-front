// server/api/admin/media/upload.post.ts
import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

const PB_SERVER_URL = process.env.PB_URL || 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN =
  process.env.PB_SUPERUSER_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

function sanitizeFilename(raw: string): string {
  if (!raw) return `upload-${Date.now()}`
  // Remove path traversal and dangerous characters while preserving Persian/Arabic/Unicode letters
  let clean = raw.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-')
  clean = clean.replace(/^\.+/, '').replace(/\.+$/, '')
  return clean || `upload-${Date.now()}`
}

function getCategory(ext: string, mime: string): string {
  const e = ext.toLowerCase()
  if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(e) || mime.startsWith('video/')) return 'video'
  if (['mp3', 'wav', 'm4a', 'aac', 'flac'].includes(e) || mime.startsWith('audio/')) return 'audio'
  if (['pdf', 'psd', 'ai', 'eps', 'cdr', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(e) || mime === 'application/pdf') return 'document'
  if (e === 'svg' || mime.includes('svg')) return 'vector'
  return 'image'
}

function getDefaultFolder(ext: string, category: string): string {
  if (category === 'document') return 'documents'
  if (category === 'video') return 'videos'
  if (category === 'audio') return 'audio'
  if (category === 'vector') return 'vectors'
  return 'images/uploads'
}

export default defineEventHandler(async (event) => {
  try {
    const parts = await readMultipartFormData(event)
    if (!parts || parts.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'هیچ فایلی برای آپلود دریافت نشد.' })
    }

    let filePart: any = null
    let filename = ''
    let folderPath = ''

    for (const part of parts) {
      if (part.name === 'file' && part.data) {
        filePart = part
        if (part.filename) filename = part.filename
      } else if (part.name === 'filename' && part.data) {
        filename = part.data.toString()
      } else if (part.name === 'path' && part.data) {
        folderPath = part.data.toString()
      }
    }

    if (!filePart || !filePart.data || filePart.data.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'فایل انتخاب شده خالی است یا نامعتبر می‌باشد.' })
    }

    const size = filePart.data.length
    // Limit max file size to 100MB
    const MAX_SIZE = 100 * 1024 * 1024
    if (size > MAX_SIZE) {
      throw createError({ statusCode: 413, statusMessage: 'حجم فایل بیش از حد مجاز (حداکثر ۱۰۰ مگابایت) می‌باشد.' })
    }

    let rawName = filename || filePart.filename || 'upload'
    let ext = ''
    const dotIdx = rawName.lastIndexOf('.')
    if (dotIdx !== -1) {
      ext = rawName.slice(dotIdx + 1).toLowerCase()
      rawName = rawName.slice(0, dotIdx)
    } else {
      ext = 'bin'
    }

    let mime = filePart.type || 'application/octet-stream'
    if (ext === 'pdf') mime = 'application/pdf'
    else if (ext === 'webp') mime = 'image/webp'
    else if (ext === 'png') mime = 'image/png'
    else if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg'
    else if (ext === 'svg') mime = 'image/svg+xml'
    else if (ext === 'ai') mime = 'application/postscript'
    else if (ext === 'psd') mime = 'image/vnd.adobe.photoshop'
    else if (ext === 'mp4') mime = 'video/mp4'

    const category = getCategory(ext, mime)

    // Determine destination folder
    let cleanFolder = folderPath
      ? folderPath.replace(/^\/+|\/+$/g, '').replace(/\.{2,}/g, '').trim()
      : ''

    if (!cleanFolder) {
      cleanFolder = getDefaultFolder(ext, category)
    }

    // Sanitize filename
    let baseFilename = sanitizeFilename(rawName)
    let finalFilename = `${baseFilename}.${ext}`

    // Setup local target directories
    const publicTargetDir = path.resolve(process.cwd(), 'public', 'uploads', cleanFolder)
    const dataTargetDir = path.resolve(process.cwd(), '.data', 'uploads', cleanFolder)

    try {
      if (!fs.existsSync(publicTargetDir)) fs.mkdirSync(publicTargetDir, { recursive: true })
      if (!fs.existsSync(dataTargetDir)) fs.mkdirSync(dataTargetDir, { recursive: true })
    } catch (dirErr) {
      console.error('[Upload] Error creating upload directories:', dirErr)
    }

    // Handle collision if a file with exact same name exists
    const publicFilePath = path.join(publicTargetDir, finalFilename)
    if (fs.existsSync(publicFilePath)) {
      finalFilename = `${baseFilename}-${Date.now()}.${ext}`
    }

    const finalPublicPath = path.join(publicTargetDir, finalFilename)
    const finalDataPath = path.join(dataTargetDir, finalFilename)

    // Write file to disk
    fs.writeFileSync(finalPublicPath, filePart.data)
    try {
      fs.writeFileSync(finalDataPath, filePart.data)
    } catch (dataErr) {
      console.warn('[Upload] Notice: Could not sync to .data/uploads:', dataErr)
    }

    const publicUrl = `/uploads/${cleanFolder}/${finalFilename}`.replace(/\/+/g, '/')
    const uniqueId = `up-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    // Optional background sync to PocketBase if configured (non-blocking, 2s timeout)
    Promise.resolve().then(async () => {
      try {
        const formData = new FormData()
        const blob = new Blob([filePart.data], { type: mime })
        formData.append('file', blob, finalFilename)
        formData.append('filename', finalFilename)
        formData.append('path', cleanFolder)
        formData.append('mime', mime)
        formData.append('size', String(size))
        formData.append('format', ext)

        await $fetch(`${PB_SERVER_URL}/api/collections/media_files/records`, {
          method: 'POST',
          headers: { Authorization: PB_SUPERUSER_TOKEN },
          body: formData,
          timeout: 2000
        }).catch(() => null)
      } catch {}
    })

    return {
      success: true,
      id: uniqueId,
      url: publicUrl,
      path: publicUrl,
      filename: finalFilename,
      format: ext.toUpperCase(),
      mime,
      size,
      category,
      width: 0,
      height: 0
    }
  } catch (err: any) {
    console.error('[Upload] Error in media upload handler:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || err.message || 'خطا در بارگذاری فایل در سرور.'
    })
  }
})
