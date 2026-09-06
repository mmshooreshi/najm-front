// server/api/admin/ui/save-draft.post.ts
import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { applyAndSaveContent } from '~/server/utils/contentStore'

type Change = { path: string; value: any }

export default defineEventHandler(async (event) => {
  const { slug, language, changes, note } = await readBody<{
    slug: string
    language: string
    changes: Change[]
    note?: string
  }>(event)

  if (!slug || !language || !Array.isArray(changes)) {
    throw createError({ statusCode: 400, statusMessage: 'slug, language and changes are required' })
  }

  // Auth: check cookie or dev environment
  const token = getCookie(event, 'pb_admin')
  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
  if (!token && !isDev) {
    throw createError({ statusCode: 401, statusMessage: 'not authenticated' })
  }

  try {
    const savedUi = await applyAndSaveContent(slug, language, changes)
    return {
      ok: true,
      saved: changes.length,
      slug,
      language,
      uiData: savedUi
    }
  } catch (err: any) {
    console.error(`[save-draft] Error saving draft for ${slug}:`, err)
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || 'Failed to save draft'
    })
  }
})

