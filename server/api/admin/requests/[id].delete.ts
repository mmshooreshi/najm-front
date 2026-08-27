// server/api/admin/requests/[id].delete.ts
import { defineEventHandler, getRouterParam } from 'h3'
import { removeLead } from '~/server/utils/leadsStore'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    return { success: false, error: 'ID is required' }
  }

  const ok = await removeLead(id)

  return {
    success: ok,
    message: 'درخواست با موفقیت حذف گردید'
  }
})
