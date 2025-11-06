// server/api/admin/ui/publish.post.ts
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ slug:string, language:string, note?:string }>(event)
  console.log('[ui-editor][publish]', body.slug, body.language)

  // TODO: atomically copy Draft -> Live for slug+language and bump liveVersion.

  return { ok: true }
})
