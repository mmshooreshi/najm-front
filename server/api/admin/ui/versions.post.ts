// server/api/admin/ui/versions.post.ts
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    slug:string, language:string, kind:'draft'|'publish', note?:string, changes?: any[]
  }>(event)
  console.log('[ui-editor][versions][create]', body.slug, body.language, body.kind, (body.changes||[]).length)
  // TODO: persist a version record; include diff/snapshot if desired.
  return { id: crypto.randomUUID(), ok:true }
})
