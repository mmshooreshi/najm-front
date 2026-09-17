// server/utils/contentStore.ts
import fs from 'node:fs'
import path from 'node:path'
function getLocalFallbackSchema(slug: string): Record<string, any> {
  try {
    const schemaFile = path.resolve(process.cwd(), 'schemas', `${slug}-ui.json`)
    if (fs.existsSync(schemaFile)) {
      return JSON.parse(fs.readFileSync(schemaFile, 'utf-8'))
    }
  } catch {}
  return {}
}

const PB_SERVER_URL = process.env.PB_URL || 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN =
  process.env.PB_SUPERUSER_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

const STORAGE_DIR = path.resolve(process.cwd(), '.data', 'content')

function ensureDir() {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true })
    }
  } catch {}
}

function getFilePath(slug: string): string {
  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '_')
  return path.join(STORAGE_DIR, `${safeSlug}.json`)
}

export function readLocalContent(slug: string): Record<string, any> | null {
  try {
    ensureDir()
    const filePath = getFilePath(slug)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn(`[ContentStore] Error reading local file for slug "${slug}":`, err)
  }
  return null
}

export function writeLocalContent(slug: string, uiData: Record<string, any>): void {
  try {
    ensureDir()
    const filePath = getFilePath(slug)
    fs.writeFileSync(filePath, JSON.stringify(uiData, null, 2), 'utf-8')
  } catch (err) {
    console.error(`[ContentStore] Error writing local file for slug "${slug}":`, err)
  }
}

export function setByPath(root: any, pathStr: string, value: any): void {
  if (!root || !pathStr) return
  const segs = pathStr.split('.').filter(Boolean)
  let obj = root
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i]
    const isIndex = /^\d+$/.test(seg)
    const last = i === segs.length - 1

    if (isIndex) {
      const idx = Number(seg)
      if (!Array.isArray(obj)) obj = []
      if (last) {
        obj[idx] = value
      } else {
        if (obj[idx] == null) {
          const nextIsIndex = /^\d+$/.test(segs[i + 1])
          obj[idx] = nextIsIndex ? [] : {}
        }
        obj = obj[idx]
      }
    } else {
      if (last) {
        obj[seg] = value
      } else {
        const nextIsIndex = /^\d+$/.test(segs[i + 1])
        if (obj[seg] == null) obj[seg] = nextIsIndex ? [] : {}
        obj = obj[seg]
      }
    }
  }
}

export async function applyAndSaveContent(
  slug: string,
  language: string,
  changes: { path: string; value: any }[]
): Promise<Record<string, any>> {
  const langLower = language.toLowerCase()
  const langUpper = language.toUpperCase()

  let currentUi = readLocalContent(slug)

  if (!currentUi) {
    try {
      const res: any = await $fetch(`${PB_SERVER_URL}/api/collections/pages/records`, {
        headers: { Authorization: PB_SUPERUSER_TOKEN },
        query: { filter: `slug="${slug}"` },
        timeout: 3000
      }).catch(() => null)

      if (res?.items?.[0]?.uiData) {
        let pbUi = res.items[0].uiData
        if (typeof pbUi === 'string') {
          try { pbUi = JSON.parse(pbUi) } catch {}
        }
        currentUi = pbUi
      }
    } catch {}
  }

  if (!currentUi || Object.keys(currentUi).length === 0) {
    currentUi = getLocalFallbackSchema(slug) || {}
  }

  currentUi = JSON.parse(JSON.stringify(currentUi))

  if (!currentUi[langLower] && !currentUi[langUpper]) {
    currentUi[langLower] = {}
    currentUi[langUpper] = {}
  }

  const targetLangBlock = currentUi[langLower] || currentUi[langUpper] || {}

  for (const { path: p, value } of changes) {
    if (!p) continue
    setByPath(targetLangBlock, p, value)
  }

  currentUi[langLower] = targetLangBlock
  currentUi[langUpper] = targetLangBlock

  writeLocalContent(slug, currentUi)

  // CRITICAL: Await PocketBase sync so serverless execution does not terminate before persisting
  try {
    await syncContentToPocketBase(slug, currentUi)
  } catch (err: any) {
    console.error(`[ContentStore] PocketBase sync error for "${slug}":`, err?.message || err)
  }

  return currentUi
}

export async function syncContentToPocketBase(slug: string, uiData: Record<string, any>): Promise<boolean> {
  try {
    const listRes: any = await $fetch(`${PB_SERVER_URL}/api/collections/pages/records`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
      query: { filter: `slug="${slug}"` },
      timeout: 6000
    }).catch(() => null)

    const items = listRes?.items || []
    if (items.length > 0) {
      await $fetch(`${PB_SERVER_URL}/api/collections/pages/records/${items[0].id}`, {
        method: 'PATCH',
        headers: {
          Authorization: PB_SUPERUSER_TOKEN,
          'Content-Type': 'application/json'
        },
        body: { uiData }
      })
      // Clean up any stray duplicate records
      for (let i = 1; i < items.length; i++) {
        await $fetch(`${PB_SERVER_URL}/api/collections/pages/records/${items[i].id}`, {
          method: 'DELETE',
          headers: { Authorization: PB_SUPERUSER_TOKEN }
        }).catch(() => {})
      }
    } else {
      await $fetch(`${PB_SERVER_URL}/api/collections/pages/records`, {
        method: 'POST',
        headers: {
          Authorization: PB_SUPERUSER_TOKEN,
          'Content-Type': 'application/json'
        },
        body: {
          slug,
          title: slug,
          layoutType: 'custom',
          uiData
        }
      })
    }
    return true
  } catch (err: any) {
    console.error(`[ContentStore] PocketBase sync failed for "${slug}":`, err?.message || err)
    return false
  }
}