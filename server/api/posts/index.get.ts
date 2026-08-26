// server/api/posts/index.get.ts
import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string | undefined
  const search = query.search as string | undefined

  const runtimeConfig = useRuntimeConfig()
  const pbUrl = runtimeConfig.public?.pbUrl || process.env.PB_URL || "http://65.108.80.205:8090"
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0"

  try {
    const res: any = await $fetch(`${pbUrl}/api/collections/blog/records`, {
      headers: { Authorization: token },
      query: { perPage: 20, sort: "-created" },
      timeout: 4000
    }).catch(() => null)

    if (res?.items && res.items.length > 0) {
      let items = res.items.map((b: any) => ({
        id: b.id,
        slug: b.slug || b.id,
        title: b.title,
        excerpt: b.excerpt || "",
        content: b.content || "",
        category: b.tags?.[0] || "materials",
        categoryLabel: b.tags?.[0] || "مقالات تخصصی",
        image: b.cover_image ? `${pbUrl}/api/files/blog/${b.id}/${b.cover_image}` : "/images/svg/open-paper-box-mockup-half-side-view-2-8943.svg",
        date: new Date(b.created).toLocaleDateString("fa-IR"),
        readTime: "۶ دقیقه",
        author: "تیم فنی چاپ نجم"
      }))

      if (category && category !== "all") {
        items = items.filter((i: any) => i.category === category)
      }
      if (search) {
        const q = search.toLowerCase()
        items = items.filter((i: any) => i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q))
      }

      return { ok: true, items, total: items.length }
    }
  } catch (err) {}

  return { ok: true, items: [], total: 0 }
})
