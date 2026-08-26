// server/api/products/index.get.ts
import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string | undefined
  const search = query.search as string | undefined
  const sort = (query.sort as string) || "popular"

  const runtimeConfig = useRuntimeConfig()
  const pbUrl = runtimeConfig.public?.pbUrl || process.env.PB_URL || "http://65.108.80.205:8090"
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0"

  try {
    const res: any = await $fetch(`${pbUrl}/api/collections/products/records`, {
      headers: { Authorization: token },
      query: { perPage: 50 },
      timeout: 4000
    }).catch(() => null)

    if (res?.items && res.items.length > 0) {
      let items = res.items.map((p: any) => ({
        id: p.id,
        slug: p.slug || p.id,
        title: p.name || p.title,
        category: p.family || p.category || "commercial",
        categoryLabel: p.family || "عمومی",
        description: p.description || p.shortDescription || "",
        image: p.media?.[0] ? `${pbUrl}/api/files/products/${p.id}/${p.media[0]}` : "/images/svg/open-paper-box-mockup-half-side-view-2-8943.svg",
        badge: p.tags?.[0] || null,
        minQty: p.inventory || 1000,
        leadTime: "۵ الی ۷ روز",
        specs: p.attributes || {}
      }))

      if (category && category !== "all") {
        items = items.filter((i: any) => i.category === category || i.categoryLabel === category)
      }
      if (search) {
        const q = search.toLowerCase()
        items = items.filter((i: any) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
      }

      return { ok: true, items, total: items.length }
    }
  } catch (err) {}

  return { ok: true, items: [], total: 0 }
})
