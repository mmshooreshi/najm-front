// server/api/admin/blog/reorder.post.ts
import { defineEventHandler, readBody, createError } from 'h3'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { items } = body || {}

  if (!items || !Array.isArray(items)) {
    throw createError({ statusCode: 400, statusMessage: 'items array is required with [{id, sortOrder}]' })
  }

  const results: any[] = []

  for (const item of items) {
    if (!item.id || item.sortOrder === undefined) continue

    try {
      if (!item.id.startsWith('mock-')) {
        await $fetch(`${PB_SERVER_URL}/api/collections/blog/records/${item.id}`, {
          method: 'PATCH',
          headers: { Authorization: PB_SUPERUSER_TOKEN, 'Content-Type': 'application/json' },
          body: { sortOrder: item.sortOrder }
        })
      }
      results.push({ id: item.id, sortOrder: item.sortOrder, ok: true })
    } catch (err: any) {
      results.push({ id: item.id, sortOrder: item.sortOrder, ok: false, error: err?.message })
    }
  }

  return { success: true, results }
})
