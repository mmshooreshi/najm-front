// server/api/admin/blog/delete.post.ts
import { defineEventHandler, readBody, createError } from 'h3'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, archive } = body || {}

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Record ID is required' })
  }

  try {
    if (archive) {
      // Soft-archive: set status to 'archived'
      const res = await $fetch(`${PB_SERVER_URL}/api/collections/blog/records/${id}`, {
        method: 'PATCH',
        headers: { Authorization: PB_SUPERUSER_TOKEN, 'Content-Type': 'application/json' },
        body: { status: 'archived' }
      })
      return { success: true, action: 'archived', item: res }
    } else {
      // Hard delete
      await $fetch(`${PB_SERVER_URL}/api/collections/blog/records/${id}`, {
        method: 'DELETE',
        headers: { Authorization: PB_SUPERUSER_TOKEN }
      })
      return { success: true, action: 'deleted', id }
    }
  } catch (err: any) {
    // If record doesn't exist in PB, still return success for local-only items
    return { success: true, action: archive ? 'archived' : 'deleted', id }
  }
})
