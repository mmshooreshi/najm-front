// server/api/admin/requests/[id].patch.ts
import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { updateLeadStatus } from '~/server/utils/leadsStore'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    return { success: false, error: 'ID is required' }
  }

  const body = await readBody(event)
  const ok = await updateLeadStatus(id, body)

  return {
    success: ok,
    message: 'وضعیت استعلام به‌روزرسانی شد'
  }
})
