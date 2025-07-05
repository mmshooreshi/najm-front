// server/api/admin/logout.post.ts
import { deleteCookie } from 'h3'
export default defineEventHandler((event) => {
  deleteCookie(event, 'pb_admin', { path: '/' })
  return { ok: true }
})
