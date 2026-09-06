// server/api/content/[slug].get.ts
import { defineEventHandler, getRouterParam } from 'h3'
import { readLocalContent } from '~/server/utils/contentStore'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    return { ok: false, error: 'Slug is required', uiData: {} }
  }

  // 1. Check local persistent storage first
  const localUi = readLocalContent(slug)

  const runtimeConfig = useRuntimeConfig()
  const pbUrl = runtimeConfig.public?.pbUrl || process.env.PB_URL || 'http://65.108.80.205:8090'
  const PB_SUPERUSER_TOKEN =
    process.env.PB_SUPERUSER_TOKEN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

  let remoteUi: Record<string, any> | null = null
  let itemId = ''
  let updated = ''

  try {
    const res: any = await $fetch(`${pbUrl}/api/collections/pages/records`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
      query: { filter: `slug="${slug}"` },
      timeout: 3000
    }).catch(() => null)

    const item = res?.items?.[0]
    if (item) {
      itemId = item.id
      updated = item.updated
      let data = item.uiData
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch {}
      }
      remoteUi = data
    }
  } catch {}

  // Merge: start with remote, apply local overrides
  let combinedUi: Record<string, any> = {}
  if (remoteUi && typeof remoteUi === 'object') {
    combinedUi = { ...remoteUi }
  }
  if (localUi && typeof localUi === 'object') {
    for (const [k, v] of Object.entries(localUi)) {
      if (typeof v === 'object' && v !== null && !Array.isArray(v) && typeof combinedUi[k] === 'object') {
        combinedUi[k] = { ...combinedUi[k], ...v }
      } else {
        combinedUi[k] = v
      }
    }
  }

  // Normalize uppercase/lowercase keys (FA/fa, EN/en, AR/ar)
  const normalized: Record<string, any> = {}
  for (const [k, v] of Object.entries(combinedUi)) {
    const lowerK = k.toLowerCase()
    const upperK = k.toUpperCase()
    normalized[lowerK] = v
    normalized[upperK] = v
  }

  const hasData = Object.keys(normalized).length > 0

  return {
    ok: hasData,
    id: itemId,
    slug,
    title: slug,
    uiData: normalized,
    updated
  }
})
