// server/api/content/[slug].get.ts
import { defineEventHandler, getRouterParam } from "h3"

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")
  if (!slug) {
    return { ok: false, error: "Slug is required", uiData: {} }
  }

  const runtimeConfig = useRuntimeConfig()
  const pbUrl = runtimeConfig.public?.pbUrl || process.env.PB_URL || "http://65.108.80.205:8090"
  const PB_SUPERUSER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0"

  try {
    const res: any = await $fetch(`${pbUrl}/api/collections/pages/records`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
      query: { filter: `slug="${slug}"` },
      timeout: 4000
    }).catch(() => null)

    const item = res?.items?.[0]
    if (item) {
      let uiData = item.uiData
      if (typeof uiData === "string") {
        try {
          uiData = JSON.parse(uiData)
        } catch (e) {
          uiData = {}
        }
      }

      // Normalize uppercase/lowercase keys (FA/fa, EN/en, AR/ar)
      const normalized: Record<string, any> = {}
      for (const [k, v] of Object.entries(uiData || {})) {
        const lowerK = k.toLowerCase()
        const upperK = k.toUpperCase()
        normalized[lowerK] = v
        normalized[upperK] = v
      }

      return {
        ok: true,
        id: item.id,
        slug: item.slug,
        title: item.title,
        uiData: normalized,
        updated: item.updated
      }
    }
  } catch (err: any) {
    //
  }

  return {
    ok: false,
    slug,
    uiData: {}
  }
})
