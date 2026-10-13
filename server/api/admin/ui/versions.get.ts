// server/api/admin/ui/versions.get.ts
import { defineEventHandler, getQuery, getCookie, createError } from 'h3'
import { getVersionSummaries, getVersionById } from '~/server/utils/versionStore'

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as any
  const slug = (q.slug as string) || 'home'
  const language = q.language as string | undefined
  const versionId = q.id as string | undefined

  // Auth: check cookie or dev environment
  const token = getCookie(event, 'pb_admin')
  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
  if (!token && !isDev) {
    throw createError({ statusCode: 401, statusMessage: 'not authenticated' })
  }

  // If specific version ID requested, return full snapshot
  if (versionId) {
    const item = getVersionById(slug, versionId)
    if (!item) {
      throw createError({ statusCode: 404, statusMessage: 'Version not found' })
    }
    return { ok: true, version: item }
  }

  // Otherwise return summaries list
  const items = getVersionSummaries(slug, language)
  return { ok: true, slug, items, total: items.length }
})
