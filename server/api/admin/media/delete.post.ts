// server/api/admin/media/delete.post.ts
import { defineEventHandler, readBody, createError } from 'h3'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = body || {}

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'File ID is required' })
  }

  try {
    if (!id.startsWith('local-') && !id.startsWith('up-')) {
      await $fetch(`${PB_SERVER_URL}/api/collections/media_files/records/${id}`, {
        method: 'DELETE',
        headers: { Authorization: PB_SUPERUSER_TOKEN },
        timeout: 4000
      })
    }
    return { success: true, id }
  } catch (err: any) {
    return { success: true, id, warning: err?.message }
  }
})
