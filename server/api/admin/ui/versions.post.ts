// server/api/admin/ui/versions.post.ts
import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { recordVersion } from '~/server/utils/versionStore'
import { readLocalContent } from '~/server/utils/contentStore'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    slug: string
    language: string
    note?: string
    changes?: { path: string; before?: any; after?: any }[]
  }>(event)

  if (!body || !body.slug) {
    throw createError({ statusCode: 400, statusMessage: 'slug is required' })
  }

  // Auth: check cookie or dev environment
  const token = getCookie(event, 'pb_admin')
  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
  if (!token && !isDev) {
    throw createError({ statusCode: 401, statusMessage: 'not authenticated' })
  }

  const currentUi = readLocalContent(body.slug) || {}
  const version = recordVersion(
    body.slug,
    body.language || 'fa',
    body.note || 'Snapshot version',
    body.changes || [],
    currentUi
  )

  return { ok: true, version }
})
