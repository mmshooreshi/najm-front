// server/api/admin/media/upload.post.ts
import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

export default defineEventHandler(async (event) => {
  try {
    const parts = await readMultipartFormData(event)
    if (!parts || parts.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No multipart data received' })
    }

    let filePart: any = null
    let filename = 'media-upload'
    let path = ''

    for (const part of parts) {
      if (part.name === 'file' && part.data) {
        filePart = part
        if (part.filename) filename = part.filename
      } else if (part.name === 'filename' && part.data) {
        filename = part.data.toString()
      } else if (part.name === 'path' && part.data) {
        path = part.data.toString()
      }
    }

    if (!filePart || !filePart.data) {
      throw createError({ statusCode: 400, statusMessage: 'Missing file field' })
    }

    const mime = filePart.type || 'image/webp'
    const ext = filename.split('.').pop()?.toLowerCase() || 'webp'
    const size = filePart.data.length

    // Try uploading to PocketBase media_files collection
    try {
      const formData = new FormData()
      const blob = new Blob([filePart.data], { type: mime })
      formData.append('file', blob, filename)
      formData.append('filename', filename)
      formData.append('path', path)
      formData.append('mime', mime)
      formData.append('size', String(size))
      formData.append('format', ext)

      const res: any = await $fetch(`${PB_SERVER_URL}/api/collections/media_files/records`, {
        method: 'POST',
        headers: {
          Authorization: PB_SUPERUSER_TOKEN
        },
        body: formData
      })

      if (res && res.id) {
        const fileUrl = `${PB_SERVER_URL}/api/files/media_files/${res.id}/${res.file || filename}`
        return {
          success: true,
          id: res.id,
          url: fileUrl,
          filename: res.filename || filename,
          format: res.format || ext,
          mime,
          size: res.size || size,
          width: res.width || 0,
          height: res.height || 0,
          created: res.created || new Date().toISOString()
        }
      }
    } catch (pbErr: any) {
      console.warn('[Admin:Media:Upload] PocketBase upload notice:', pbErr?.message || pbErr)
    }

    // Fallback: Return Data URI for immediate local testing if remote server is unreachable
    const base64 = Buffer.from(filePart.data).toString('base64')
    const dataUrl = `data:${mime};base64,${base64}`

    return {
      success: true,
      url: dataUrl,
      filename,
      format: ext,
      mime,
      size,
      width: 0,
      height: 0,
      fallback: true
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || 'Media upload failed'
    })
  }
})
