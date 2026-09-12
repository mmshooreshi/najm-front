// server/api/products/index.get.ts
import { defineEventHandler, getQuery } from 'h3'
import { getAllProducts } from '~/server/utils/productsStore'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const division = query.division as string | undefined
  const category = query.category as string | undefined
  const search = query.search as string | undefined

  let items = await getAllProducts()

  if (division && division !== 'all') {
    items = items.filter((i: any) => i.division === division)
  }
  if (category && category !== 'all') {
    items = items.filter((i: any) => i.category === category)
  }
  if (search) {
    const q = search.toLowerCase()
    items = items.filter((i: any) => {
      const matchTitle = (i.title || '').toLowerCase().includes(q)
      const matchDesc = (i.description || '').toLowerCase().includes(q)
      const matchFa = (i.locales?.fa?.title || '').toLowerCase().includes(q) || (i.locales?.fa?.description || '').toLowerCase().includes(q)
      const matchEn = (i.locales?.en?.title || '').toLowerCase().includes(q) || (i.locales?.en?.description || '').toLowerCase().includes(q)
      const matchAr = (i.locales?.ar?.title || '').toLowerCase().includes(q) || (i.locales?.ar?.description || '').toLowerCase().includes(q)
      return matchTitle || matchDesc || matchFa || matchEn || matchAr
    })
  }

  return { ok: true, items, total: items.length }
})
