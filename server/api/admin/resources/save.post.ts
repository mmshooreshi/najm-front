// server/api/admin/resources/save.post.ts
import { defineEventHandler, readBody } from 'h3'
import { saveResource } from '~/server/utils/resourcesStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body) {
    return { success: false, error: 'Request body is required' }
  }

  const saved = await saveResource(body)

  return {
    success: true,
    message: 'فایل و راهنمای فنی با موفقیت ذخیره گردید',
    item: saved
  }
})
