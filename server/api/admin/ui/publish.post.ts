// server/api/admin/ui/publish.post.ts
import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { readLocalContent, syncContentToPocketBase } from '~/server/utils/contentStore'

export default defineEventHandler(async (event) => {
  const { slug, language, uiData, note } = await readBody<{
    slug: string
    language?: string
    uiData?: Record<string, any>
    note?: string
  }>(event)

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'slug is required' })
  }

  // Auth: check cookie or dev environment
  const token = getCookie(event, 'pb_admin')
  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
  if (!token && !isDev) {
    throw createError({ statusCode: 401, statusMessage: 'not authenticated' })
  }

  const targetUi = uiData || readLocalContent(slug)
  if (!targetUi) {
    throw createError({ statusCode: 404, statusMessage: `No content found for slug "${slug}"` })
  }

  const synced = await syncContentToPocketBase(slug, targetUi)
  return { ok: synced, slug, note }
})
