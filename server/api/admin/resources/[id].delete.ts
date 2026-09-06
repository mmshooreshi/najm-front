// server/api/admin/resources/[id].delete.ts
import { defineEventHandler, getRouterParam } from 'h3'
import { removeResource } from '~/server/utils/resourcesStore'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    return { success: false, error: 'ID is required' }
  }

  const ok = await removeResource(id)

  return {
    success: ok,
    message: 'منبع / فایل با موفقیت حذف گردید'
  }
})
