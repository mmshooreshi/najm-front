// server/api/admin/products/[id].delete.ts
import { defineEventHandler, getRouterParam } from 'h3'
import { removeProduct } from '~/server/utils/productsStore'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    return { success: false, error: 'ID is required' }
  }

  const ok = await removeProduct(id)

  return {
    success: ok,
    message: 'محصول با موفقیت حذف گردید'
  }
})
