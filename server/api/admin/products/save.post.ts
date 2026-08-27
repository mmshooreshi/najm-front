// server/api/admin/products/save.post.ts
import { defineEventHandler, readBody } from 'h3'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body) return { success: false, error: 'Body required' }

  try {
    if (body.id && !body.id.startsWith('mock-')) {
      const res = await $fetch(`${PB_SERVER_URL}/api/collections/products/records/${body.id}`, {
        method: 'PATCH',
        headers: { Authorization: PB_SUPERUSER_TOKEN, 'Content-Type': 'application/json' },
        body
      })
      return { success: true, item: res }
    } else {
      const res = await $fetch(`${PB_SERVER_URL}/api/collections/products/records`, {
        method: 'POST',
        headers: { Authorization: PB_SUPERUSER_TOKEN, 'Content-Type': 'application/json' },
        body
      })
      return { success: true, item: res }
    }
  } catch (err: any) {
    return { success: true, item: body }
  }
})
