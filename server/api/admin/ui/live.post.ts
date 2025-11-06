// server/api/admin/ui/live.post.ts
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ slug:string, language:string }>(event)
  console.log('[ui-editor][live][fetch]', body.slug, body.language)
  // TODO: return the current live uiData[language] for slug
  // For now return empty structure to keep flows working.
  return { data: {} }
})
