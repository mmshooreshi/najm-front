// server/api/resources/[slug].get.ts
import { defineEventHandler, getRouterParam } from 'h3'
import { getResourceBySlug } from '~/server/utils/resourcesStore'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    return { success: false, error: 'Slug is required' }
  }

  const item = await getResourceBySlug(slug)
  if (!item) {
    return { success: false, error: 'Resource not found' }
  }

  return {
    success: true,
    item
  }
})
