// server/api/admin/ui/versions.get.ts
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as any
  const slug = q.slug as string
  const language = q.language as string
  console.log('[ui-editor][versions][list]', slug, language)

  // TODO: fetch from your versions store; returning empty for now.
  return { items: [] }
})
