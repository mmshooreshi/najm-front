// server/routes/uploads/[...path].get.ts
import fs from 'node:fs'
import path from 'node:path'
import { defineEventHandler, getRouterParam, createError, sendStream, setHeader, setResponseStatus, getHeader } from 'h3'

const MIME_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  ai: 'application/postscript',
  psd: 'image/vnd.adobe.photoshop',
  eps: 'application/postscript',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  m4a: 'audio/mp4',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip'
}

export default defineEventHandler(async (event) => {
  const rawPath = getRouterParam(event, 'path') || ''
  // Prevent directory traversal
  const cleanPath = path.normalize(decodeURIComponent(rawPath)).replace(/^(\.\.[\/\\])+/, '')
  if (!cleanPath || cleanPath.includes('..')) {
    throw createError({ statusCode: 400, statusMessage: 'مسیر نامعتبر است.' })
  }

  const publicFilePath = path.resolve(process.cwd(), 'public', 'uploads', cleanPath)
  const dataFilePath = path.resolve(process.cwd(), '.data', 'uploads', cleanPath)

  let targetFilePath = ''
  if (fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
    targetFilePath = publicFilePath
  } else if (fs.existsSync(dataFilePath) && fs.statSync(dataFilePath).isFile()) {
    targetFilePath = dataFilePath
  }

  if (!targetFilePath) {
    throw createError({ statusCode: 404, statusMessage: 'فایل یافت نشد.' })
  }

  const stat = fs.statSync(targetFilePath)
  const fileSize = stat.size
  const ext = path.extname(targetFilePath).slice(1).toLowerCase()
  const mimeType = MIME_MAP[ext] || 'application/octet-stream'

  setHeader(event, 'Content-Type', mimeType)
  setHeader(event, 'Accept-Ranges', 'bytes')
  setHeader(event, 'Cache-Control', 'public, max-age=86400, must-revalidate')
  setHeader(event, 'Last-Modified', stat.mtime.toUTCString())

  const filename = path.basename(targetFilePath)
  setHeader(event, 'Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`)

  // HTTP Range request support (essential for PDF reader paging & video streaming)
  const range = getHeader(event, 'range')
  if (range && range.startsWith('bytes=')) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

    if (start >= fileSize || end >= fileSize || start > end) {
      setHeader(event, 'Content-Range', `bytes */${fileSize}`)
      throw createError({ statusCode: 416, statusMessage: 'Requested range not satisfiable' })
    }

    const chunkLength = end - start + 1
    setResponseStatus(event, 206)
    setHeader(event, 'Content-Range', `bytes ${start}-${end}/${fileSize}`)
    setHeader(event, 'Content-Length', chunkLength)

    const stream = fs.createReadStream(targetFilePath, { start, end })
    return sendStream(event, stream)
  }

  setHeader(event, 'Content-Length', fileSize)
  const stream = fs.createReadStream(targetFilePath)
  return sendStream(event, stream)
})
