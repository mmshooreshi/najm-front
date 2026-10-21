// server/utils/contentStore.ts
import fs from 'node:fs'
import path from 'node:path'
import { recordVersion } from '~/server/utils/versionStore'

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

/**
 * Tokenize path into segments supporting both dot indices and ID selectors:
 * e.g. "sceneProjects.cards[id=7].text" or "cards.0.text"
 */
function parsePathSegments(pathStr: string): { type: 'prop' | 'id' | 'index'; val: any }[] {
  const parts: { type: 'prop' | 'id' | 'index'; val: any }[] = []
  const regex = /([^.\[\]]+)|\[id=([^\]]+)\]|\[(\d+)\]/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(pathStr)) !== null) {
    if (match[1] !== undefined) {
      parts.push({ type: 'prop', val: match[1] })
    } else if (match[2] !== undefined) {
      parts.push({ type: 'id', val: match[2].replace(/^["']|["']$/g, '') })
    } else if (match[3] !== undefined) {
      parts.push({ type: 'index', val: Number(match[3]) })
    }
  }
  return parts
}

/**
 * ID-aware and index-aware path getter
 */
export function getByPath(root: any, pathStr: string): any {
  if (!root || !pathStr) return undefined
  const segs = parsePathSegments(pathStr)
  let curr = root
  for (const seg of segs) {
    if (curr == null) return undefined
    if (seg.type === 'id') {
      if (!Array.isArray(curr)) return undefined
      curr = curr.find((x: any) => x && (String(x.id) === seg.val || String(x.key) === seg.val || String(x.slug) === seg.val || Number(x.id) === Number(seg.val)))
    } else if (seg.type === 'index' || /^\d+$/.test(String(seg.val))) {
      const idx = seg.type === 'index' ? seg.val : Number(seg.val)
      curr = Array.isArray(curr) ? curr[idx] : undefined
    } else {
      curr = curr[seg.val]
    }
  }
  return curr
}

/**
 * ID-aware and index-aware dot-path setter
 */
export function setByPath(root: any, pathStr: string, value: any): void {
  if (!root || !pathStr) return
  const segs = parsePathSegments(pathStr)
  let curr = root

  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i]
    const last = i === segs.length - 1

    if (seg.type === 'id') {
      if (!Array.isArray(curr)) return
      let foundIdx = curr.findIndex(
        (x: any) => x && (String(x.id) === seg.val || String(x.key) === seg.val || String(x.slug) === seg.val)
      )
      if (foundIdx === -1) {
        foundIdx = curr.findIndex((x: any) => x && Number(x.id) === Number(seg.val))
      }
      if (foundIdx === -1) {
        // If not found, push new item with this ID
        const nextSeg = segs[i + 1]
        const newItem: any = { id: isNaN(Number(seg.val)) ? seg.val : Number(seg.val) }
        curr.push(newItem)
        foundIdx = curr.length - 1
      }

      if (last) {
        curr[foundIdx] = value
      } else {
        curr = curr[foundIdx]
      }
    } else if (seg.type === 'index' || /^\d+$/.test(String(seg.val))) {
      const idx = seg.type === 'index' ? seg.val : Number(seg.val)
      if (!Array.isArray(curr)) curr = []
      if (last) {
        curr[idx] = value
      } else {
        if (curr[idx] == null) {
          const nextSeg = segs[i + 1]
          const isNextArray = nextSeg && (nextSeg.type === 'index' || nextSeg.type === 'id' || /^\d+$/.test(String(nextSeg.val)))
          curr[idx] = isNextArray ? [] : {}
        }
        curr = curr[idx]
      }
    } else {
      const prop = seg.val
      if (last) {
        curr[prop] = value
      } else {
        if (curr[prop] == null) {
          const nextSeg = segs[i + 1]
          const isNextArray = nextSeg && (nextSeg.type === 'index' || nextSeg.type === 'id' || /^\d+$/.test(String(nextSeg.val)))
          curr[prop] = isNextArray ? [] : {}
        }
        curr = curr[prop]
      }
    }
  }
}

/**
 * Normalizes an arbitrary UI data structure so it is guaranteed to have
 * trilingual root language keys ('fa', 'en', 'ar' / 'FA', 'EN', 'AR').
 */
export function normalizeLanguageRoots(rawUi: Record<string, any>, fallbackSlug?: string): Record<string, any> {
  if (!rawUi || typeof rawUi !== 'object') return {}

  const hasLangRoots = !!(rawUi.fa || rawUi.FA || rawUi.en || rawUi.EN || rawUi.ar || rawUi.AR)
  if (hasLangRoots) {
    const norm: Record<string, any> = { ...rawUi }
    if (norm.FA && !norm.fa) norm.fa = norm.FA
    if (norm.fa && !norm.FA) norm.FA = norm.fa
    if (norm.EN && !norm.en) norm.en = norm.EN
    if (norm.en && !norm.EN) norm.EN = norm.en
    if (norm.AR && !norm.ar) norm.ar = norm.AR
    if (norm.ar && !norm.AR) norm.AR = norm.ar
    return norm
  }

  // Flat structure encountered (e.g. legacy menu record with products/services at root)
  const fallback = fallbackSlug ? getLocalFallbackSchema(fallbackSlug) : {}
  const wrapped: Record<string, any> = {
    fa: { ...rawUi },
    FA: { ...rawUi },
    en: fallback?.en || fallback?.EN || { ...rawUi },
    EN: fallback?.EN || fallback?.en || { ...rawUi },
    ar: fallback?.ar || fallback?.AR || { ...rawUi },
    AR: fallback?.AR || fallback?.ar || { ...rawUi }
  }
  return wrapped
}

export async function applyAndSaveContent(
  slug: string,
  language: string,
  changes: { path: string; value: any }[],
  note?: string
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

  // Ensure clean trilingual normalization
  currentUi = normalizeLanguageRoots(JSON.parse(JSON.stringify(currentUi)), slug)

  if (!currentUi[langLower] && !currentUi[langUpper]) {
    currentUi[langLower] = {}
    currentUi[langUpper] = {}
  }

  const targetLangBlock = currentUi[langLower] || currentUi[langUpper] || {}

  // Compute changes diff and update target language block
  const changeEntries: { path: string; before?: any; after?: any }[] = []
  for (const { path: p, value } of changes) {
    if (!p) continue
    const beforeVal = getByPath(targetLangBlock, p)
    changeEntries.push({ path: p, before: beforeVal, after: value })
    setByPath(targetLangBlock, p, value)
  }

  currentUi[langLower] = targetLangBlock
  currentUi[langUpper] = targetLangBlock

  // 1. Persistent audit snapshot before writing
  try {
    recordVersion(
      slug,
      langLower,
      note || `ذخیره ${changes.length} تغییر روی /${slug}`,
      changeEntries,
      currentUi
    )
  } catch (err) {
    console.warn(`[ContentStore] Version snapshot warning for "${slug}":`, err)
  }

  // 2. Write to local file
  writeLocalContent(slug, currentUi)

  // 3. CRITICAL: Await PocketBase sync and verify persistence so false saves never occur
  const pbSuccess = await syncContentToPocketBase(slug, currentUi)
  if (!pbSuccess) {
    throw new Error(`Failed to persist changes for "${slug}" to PocketBase database. Please verify connection.`)
  }

  // 4. On-demand cache invalidation and instant pre-warming
  await purgeServerPageCache(slug)
  warmupServerPageCache(slug)

  return currentUi
}

export async function purgeServerPageCache(slug: string): Promise<void> {
  try {
    const target = slug === 'home' || slug === '/' ? '' : slug.toLowerCase()

    // 1. Purge root storage keys
    const rootStorage = useStorage()
    const allKeys = await rootStorage.getKeys().catch(() => [])
    for (const key of allKeys) {
      const lower = key.toLowerCase()
      if (lower.includes('routes') || lower.includes('handlers') || lower.includes('content') || lower.includes('nitro')) {
        if (!target) {
          if (lower.includes('index') || lower.includes('_en') || lower.includes('_ar') || lower.includes(':_') || lower.includes('/_') || lower.includes('home')) {
            await rootStorage.removeItem(key).catch(() => {})
          }
        } else if (lower.includes(target)) {
          await rootStorage.removeItem(key).catch(() => {})
        }
      }
    }

    // 2. Purge dedicated 'cache' storage mount
    try {
      const cacheStorage = useStorage('cache')
      const cacheKeys = await cacheStorage.getKeys().catch(() => [])
      for (const k of cacheKeys) {
        const lower = k.toLowerCase()
        if (!target) {
          if (lower.includes('index') || lower.includes('_en') || lower.includes('_ar') || lower.includes(':_') || lower.includes('/_') || lower.includes('home')) {
            await cacheStorage.removeItem(k).catch(() => {})
          }
        } else if (lower.includes(target)) {
          await cacheStorage.removeItem(k).catch(() => {})
        }
      }
    } catch {}
  } catch (err) {
    console.warn(`[ContentStore] Cache purge warning for "${slug}":`, err)
  }
}

export function warmupServerPageCache(slug: string): void {
  try {
    const baseUrl = process.env.SITE_URL || 'http://localhost:3000'
    const paths = slug === 'home' || slug === '/' ? ['/', '/en', '/ar'] : [`/${slug}`, `/en/${slug}`, `/ar/${slug}`]
    for (const p of paths) {
      $fetch(`${baseUrl}${p}`, { timeout: 4000 }).catch(() => {})
    }
  } catch {}
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