// server/api/resources/index.get.ts
import { defineEventHandler, getQuery } from 'h3'
import { getAllResources } from '~/server/utils/resourcesStore'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string | undefined
  const search = query.search as string | undefined

  let items = await getAllResources()

  if (category && category !== 'all') {
    items = items.filter(r => r.category === category)
  }

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(r => {
      const matchFa = r.locales?.fa?.title?.toLowerCase().includes(q) || r.locales?.fa?.description?.toLowerCase().includes(q)
      const matchEn = r.locales?.en?.title?.toLowerCase().includes(q) || r.locales?.en?.description?.toLowerCase().includes(q)
      const matchAr = r.locales?.ar?.title?.toLowerCase().includes(q) || r.locales?.ar?.description?.toLowerCase().includes(q)
      return matchFa || matchEn || matchAr || r.slug?.toLowerCase().includes(q)
    })
  }

  return {
    success: true,
    items,
    total: items.length
  }
})
