// server/api/admin/products/save.post.ts
import { defineEventHandler, readBody } from 'h3'
import { saveProduct } from '~/server/utils/productsStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body) return { success: false, error: 'Body required' }

  try {
    const saved = await saveProduct(body)
    return {
      success: true,
      message: 'محصول با موفقیت ذخیره گردید',
      item: saved
    }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error saving product' }
  }
})
