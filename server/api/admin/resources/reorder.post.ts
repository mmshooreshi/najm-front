// server/api/admin/resources/reorder.post.ts
import { defineEventHandler, readBody } from 'h3'
import { reorderResources } from '~/server/utils/resourcesStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || !Array.isArray(body.ids)) {
    return { success: false, error: 'Array of ids is required' }
  }

  const ok = await reorderResources(body.ids)

  return {
    success: ok,
    message: 'ترتیب نمایش فایل‌ها به‌روزرسانی شد'
  }
})
