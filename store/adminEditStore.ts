// store/adminEditStore.ts
import { reactive, computed } from 'vue'
import { toLocalizedDigits } from '~/utils/digits'
import { logger } from '~/utils/logger'
import { getBaseSchemaForSlugAndLang } from '~/composables/ui/schemaRegistry'

/** ---------- Types ---------- **/
export type LangCode = string
export type PathKey = string

export interface LangRecord {
  original: string
  value: string
  draft?: string
  updatedAt?: string
}

export type ChangeRecord = Record<LangCode, LangRecord>
export type ChangeMap = Record<PathKey, ChangeRecord>

export type VersionType = 'original' | 'draft' | 'saved'
export interface VersionEntry {
  type: VersionType
  value: string
  date: string // ISO
}
export type VersionsByLang = Record<LangCode, VersionEntry[]>
export type VersionsMap = Record<PathKey, VersionsByLang>

export interface ChangedFieldDetail {
  path: PathKey
  lang: LangCode
  original: string
  current: string
  hasDraft: boolean
  isChanged: boolean
}

export interface MediaMetadata {
  format?: string
  width?: number
  height?: number
  size?: number
  aspectRatio?: number
  mime?: string
  blob?: Blob
  url?: string
}

export type ContentOriginSource = 'page_cms' | 'pocketbase_collection' | 'layout_shared' | 'hardcoded_ui'

export interface OriginMetadata {
  source: ContentOriginSource
  sourceLabel: string
  collection?: string // e.g. 'pages', 'products', 'blog', 'resources'
  recordId?: string
  field?: string
  slug: string
  path: string
  parentPath?: string
  componentChain?: string[] // e.g. ['PagesHome', 'SceneHero', 'HighlightedMotion']
  isDynamic: boolean
  isShared: boolean // true for menu, footer
}

export interface AdminEditState {
  canEdit: boolean
  editMode: boolean
  slug: string
  language: LangCode
  changes: ChangeMap
  allLangUI: Record<LangCode, Record<string, any>> // full UI snapshots per lang
  clientOverrides: Record<string, Record<string, any>> // slug -> lang -> live UI overrides
  versions: VersionsMap // path -> lang -> versions
  lastSavedAt: string | null
  saving: boolean
  lastError: string | null
  inspectorOpen: boolean
  historyOpen: boolean
  paletteOpen: boolean
  minimized: boolean
  autosaveEnabled: boolean
  activeEditingPath: string | null
  isEditingActive: boolean
  // Unified Docked Panel State
  unifiedPanelOpen: boolean
  unifiedPanelTab: 'origin' | 'proof' | 'versions'
  highlightedDiffPath: string | null
  originMap: Record<PathKey, OriginMetadata>
  // Media Studio & In-Place Media Editor State
  mediaStudioOpen: boolean
  activeMediaPath: string | null
  activeMediaElement: HTMLElement | null
  activeMediaInitialUrl: string
  activeMediaUrl: string
  activeMediaMetadata: MediaMetadata | null
  mediaDrafts: Record<PathKey, { original: string; draft?: string; meta?: MediaMetadata }>
  selectedMediaElement: HTMLElement | null
  selectedMediaPath: string | null
  // Motion & Animation Freeze State
  isMotionPausedGlobally: boolean
  activeMotionElement: HTMLElement | null
  pausedMotionElements: Set<HTMLElement>
  // Array Archive Store (slug -> arrayPath -> items)
  archives: Record<string, Record<PathKey, any[]>>
  // Slug-scoped snapshots to prevent cross-component schema pollution
  allLangUIBySlug: Record<string, Record<LangCode, Record<string, any>>>
  telemetry: SyncTelemetry
}

export interface EditTelemetryEntry {
  path: string
  lang: string
  time: string // ISO
  preview: string
}

export interface SyncTelemetry {
  localDraftSavedAt: string | null
  serverSyncedAt: string | null
  lastModifiedPath: string | null
  lastModifiedTime: string | null
  source: 'local_storage' | 'server_live' | 'pristine'
  recentEdits: EditTelemetryEntry[]
}

export const adminEditState = reactive<AdminEditState>({
  canEdit: false,
  editMode: false,
  slug: '',
  language: '',
  changes: {},
  allLangUI: {},
  allLangUIBySlug: {},
  clientOverrides: {},
  versions: {},
  lastSavedAt: null,
  saving: false,
  lastError: null,
  inspectorOpen: false,
  historyOpen: false,
  paletteOpen: false,
  minimized: false,
  autosaveEnabled: false,
  activeEditingPath: null,
  isEditingActive: false,
  unifiedPanelOpen: false,
  unifiedPanelTab: 'origin',
  highlightedDiffPath: null,
  originMap: {},
  mediaStudioOpen: false,
  activeMediaPath: null,
  activeMediaElement: null,
  activeMediaInitialUrl: '',
  activeMediaUrl: '',
  activeMediaMetadata: null,
  mediaDrafts: {},
  selectedMediaElement: null,
  selectedMediaPath: null,
  isMotionPausedGlobally: false,
  activeMotionElement: null,
  pausedMotionElements: new Set(),
  archives: {},
  telemetry: {
    localDraftSavedAt: null,
    serverSyncedAt: null,
    lastModifiedPath: null,
    lastModifiedTime: null,
    source: 'pristine',
    recentEdits: []
  }
})

// Admin session cleanup helper
export function clearAdminSession() {
  adminEditState.canEdit = false
  adminEditState.editMode = false
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('admin_can_edit')
      localStorage.removeItem('admin_edit_mode')
      sessionStorage.removeItem('admin_editor_active')
      document.cookie = 'pb_admin=; Max-Age=0; path=/; SameSite=Lax'
    } catch {}
  }
}

/** ---------- LocalStorage Draft Persistence Engine ---------- **/
const DRAFT_STORAGE_PREFIX = 'najm_draft_v1_'
let draftSaveDebounceTimer: any = null

export function saveDraftToLocalStorage(slug?: string) {
  if (typeof window === 'undefined') return
  const effectiveSlug = slug || adminEditState.slug || 'home'
  if (!effectiveSlug) return

  if (draftSaveDebounceTimer) clearTimeout(draftSaveDebounceTimer)
  draftSaveDebounceTimer = setTimeout(() => {
    try {
      const slugChanges: ChangeMap = {}
      for (const [path, record] of Object.entries(adminEditState.changes)) {
        const recordSlug = (record as any)?.slug || adminEditState.slug || 'home'
        if (recordSlug === effectiveSlug) {
          slugChanges[path] = record
        }
      }

      const overrides = adminEditState.clientOverrides[effectiveSlug] || {}
      const now = new Date().toISOString()

      const payload = {
        slug: effectiveSlug,
        updatedAt: now,
        serverSyncedAt: adminEditState.telemetry.serverSyncedAt,
        changes: slugChanges,
        clientOverrides: overrides,
        lastModifiedPath: adminEditState.telemetry.lastModifiedPath,
        lastModifiedTime: adminEditState.telemetry.lastModifiedTime
      }

      localStorage.setItem(DRAFT_STORAGE_PREFIX + effectiveSlug, JSON.stringify(payload))
      adminEditState.telemetry.localDraftSavedAt = now
      adminEditState.telemetry.source = 'local_storage'
    } catch (err) {
      if (process.dev) logger.warn('Admin:Storage', 'LocalStorage write failed', err)
    }
  }, 150)
}

export function loadDraftFromLocalStorage(slug: string): boolean {
  if (typeof window === 'undefined' || !slug) return false
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_PREFIX + slug)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return false

    // Auto-heal corrupted drafts for menu where products tab was overwritten with child item "سربرگ"
    if (slug === 'menu') {
      const corruptPath = 'products.children.0.children.0.name'
      if (parsed.changes && parsed.changes[corruptPath]) {
        const faDraft = parsed.changes[corruptPath]?.FA?.draft || parsed.changes[corruptPath]?.fa?.draft
        if (faDraft === 'سربرگ') {
          delete parsed.changes[corruptPath]
        }
      }
      for (const lang of ['fa', 'FA', 'en', 'EN', 'ar', 'AR']) {
        if (parsed.clientOverrides?.[lang]?.products?.children?.[0]?.children?.[0]?.name === 'سربرگ') {
          parsed.clientOverrides[lang].products.children[0].children[0].name = 'چاپ'
        }
      }
    }

    // Auto-heal corrupted drafts for footer where sections array was collapsed to 1 section
    if (slug === 'footer') {
      const baseFooter = getBaseSchemaForSlugAndLang('footer', 'fa')
      const baseSecs = baseFooter?.sections || []
      for (const lang of ['fa', 'FA', 'en', 'EN', 'ar', 'AR']) {
        const ovSecs = parsed.clientOverrides?.[lang]?.sections
        if (Array.isArray(ovSecs) && ovSecs.length === 1 && baseSecs.length > 1) {
          parsed.clientOverrides[lang].sections = [
            ovSecs[0],
            ...deepClone(baseSecs.slice(1))
          ]
        }
      }
    }

    // Restore clientOverrides if present
    if (parsed.clientOverrides && Object.keys(parsed.clientOverrides).length > 0) {
      adminEditState.clientOverrides[slug] = parsed.clientOverrides
    }

    // Restore changes
    if (parsed.changes && Object.keys(parsed.changes).length > 0) {
      for (const [path, val] of Object.entries(parsed.changes)) {
        if (!adminEditState.changes[path]) {
          adminEditState.changes[path] = val as any
        } else {
          adminEditState.changes[path] = { ...adminEditState.changes[path], ...(val as any) }
        }
      }
    }

    adminEditState.telemetry.localDraftSavedAt = parsed.updatedAt || null
    adminEditState.telemetry.serverSyncedAt = parsed.serverSyncedAt || null
    adminEditState.telemetry.lastModifiedPath = parsed.lastModifiedPath || null
    adminEditState.telemetry.lastModifiedTime = parsed.lastModifiedTime || null
    adminEditState.telemetry.source = 'local_storage'

    return true
  } catch (err) {
    if (process.dev) logger.warn('Admin:Storage', 'LocalStorage read failed', err)
    return false
  }
}

export function clearDraftFromLocalStorage(slug?: string) {
  if (typeof window === 'undefined') return
  const effectiveSlug = slug || adminEditState.slug || 'home'
  try {
    localStorage.removeItem(DRAFT_STORAGE_PREFIX + effectiveSlug)
    adminEditState.telemetry.localDraftSavedAt = null
    adminEditState.telemetry.source = 'server_live'
  } catch {}
}

export function recordEditTelemetry(path: string, lang: string, value: any) {
  const now = new Date().toISOString()
  adminEditState.telemetry.lastModifiedPath = path
  adminEditState.telemetry.lastModifiedTime = now
  adminEditState.telemetry.source = 'local_storage'

  const preview = typeof value === 'string' ? value.slice(0, 35) : String(value).slice(0, 35)
  adminEditState.telemetry.recentEdits.unshift({
    path,
    lang,
    time: now,
    preview
  })
  if (adminEditState.telemetry.recentEdits.length > 5) {
    adminEditState.telemetry.recentEdits.pop()
  }
}

/** ---------- Helpers ---------- **/
export function normalize(str: string | null | undefined): string {
  if (str == null) return ''
  return String(str)
    .replace(/[\u200B\uFEFF]/g, '') // Strip BOM and Zero-Width Space ONLY! PRESERVE \u200C (ZWNJ / نیم‌فاصله) and \u200D (ZWJ)!
    .replace(/[ \t\r\f\v]+/g, ' ')
    .trim()
}

export function getText(el: HTMLElement): string {
  // Use textContent instead of innerText to eliminate forced synchronous layout reflows!
  return normalize(el.textContent ?? '')
}

export function deepClone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch {
    return obj
  }
}

/**
 * Tokenize path into segments supporting both dot indices and ID selectors:
 * e.g. "sceneProjects.cards[id=7].text" or "cards.0.text"
 */
export function parsePathSegments(pathStr: string): { type: 'prop' | 'id' | 'index'; val: any }[] {
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
 * ID-aware and index-aware dot-path getter supporting:
 * - "sceneProjects.cards[id=7].text"
 * - "cards.0.text"
 * - standard dot paths
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
 * ID-aware and index-aware dot-path setter supporting:
 * - "sceneProjects.cards[id=7].text"
 * - "cards.0.text"
 * - standard dot paths
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

function normForCompare(v: any, lang: LangCode): string {
  return normalize(toLocalizedDigits(v))
}

/** ---------- Core API ---------- **/
export function setSlug(slug: string) {
  if (adminEditState.slug !== slug) {
    adminEditState.slug = slug
    if (typeof window !== 'undefined' && slug) {
      loadDraftFromLocalStorage(slug)
    }
  }
}

export function syncLanguage(lang: LangCode) {
  if (!lang) return
  if (adminEditState.language !== lang) {
    adminEditState.language = lang
  }
}

/** Freeze & store full-UI snapshot for a language and slug */
export function captureLanguageSnapshot(lang: LangCode, ui: Record<string, any>, slug?: string) {
  if (!ui || Object.keys(ui).length === 0) return

  const effectiveSlug = slug || adminEditState.slug || 'home'
  const upper = lang.toUpperCase()
  const lower = lang.toLowerCase()
  const snap = deepClone(ui)

  if (!adminEditState.allLangUIBySlug) adminEditState.allLangUIBySlug = {}
  if (!adminEditState.allLangUIBySlug[effectiveSlug]) adminEditState.allLangUIBySlug[effectiveSlug] = {}
  adminEditState.allLangUIBySlug[effectiveSlug][upper] = snap
  adminEditState.allLangUIBySlug[effectiveSlug][lower] = snap

  if (effectiveSlug === adminEditState.slug || !adminEditState.slug) {
    adminEditState.allLangUI[upper] = snap
    adminEditState.allLangUI[lower] = snap
  }
}

/** Versions helpers */
export function addVersion(path: PathKey, lang: LangCode, value: string, type: VersionType) {
  if (!adminEditState.versions[path]) adminEditState.versions[path] = {}
  if (!adminEditState.versions[path][lang]) adminEditState.versions[path][lang] = []

  const list = adminEditState.versions[path][lang]
  const last = list[list.length - 1]
  if (last && last.value === value && last.type === type) return

  list.push({
    type,
    value,
    date: new Date().toISOString()
  })

  if (list.length > 30) {
    list.shift()
  }
}

export function getVersions(path: PathKey, lang: LangCode): VersionEntry[] {
  return adminEditState.versions[path]?.[lang] ?? []
}

/** Hydrate baselines from allLangUI snapshot non-blockingly */
export function applySnapshotToBaselines(lang: LangCode, slug?: string) {
  const schedule = typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? (window as any).requestIdleCallback
    : (fn: any) => setTimeout(fn, 32)

  schedule(() => {
    const effectiveSlug = slug || adminEditState.slug || 'home'
    const snap = adminEditState.allLangUIBySlug?.[effectiveSlug]?.[lang] || adminEditState.allLangUI[lang] || adminEditState.allLangUI[lang.toUpperCase()] || adminEditState.allLangUI[lang.toLowerCase()]
    if (!snap) return

    function walk(obj: any, prefix = '') {
      if (!obj || typeof obj !== 'object') return
      for (const [k, v] of Object.entries(obj)) {
        const fullPath = prefix ? `${prefix}.${k}` : k
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          const strVal = String(v)
          if (!adminEditState.changes[fullPath]) adminEditState.changes[fullPath] = {}
          const rec = adminEditState.changes[fullPath][lang]
          if (!rec) {
            adminEditState.changes[fullPath][lang] = {
              original: strVal,
              value: strVal,
              updatedAt: new Date().toISOString()
            }
            ;(adminEditState.changes[fullPath] as any).slug = effectiveSlug
            addVersion(fullPath, lang, strVal, 'original')
          } else if (!rec.original) {
            rec.original = strVal
            rec.value = strVal
            ;(adminEditState.changes[fullPath] as any).slug = effectiveSlug
            addVersion(fullPath, lang, strVal, 'original')
          }
        } else if (typeof v === 'object' && v !== null) {
          walk(v, fullPath)
        }
      }
    }

    walk(snap)
  })
}

/** Ensure baseline exists for this path+lang */
export function ensureBaseline(path: PathKey, lang: LangCode, currentElText: string, targetSlug?: string) {
  if (!path || !lang) return
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  
  const effectiveSlug = targetSlug || adminEditState.slug || 'home'
  ;(adminEditState.changes[path] as any).slug = effectiveSlug

  const rec = adminEditState.changes[path][lang]
  if (rec && rec.original != null && rec.original !== '') return

  const slugSnap = adminEditState.allLangUIBySlug?.[effectiveSlug]?.[lang]
  const baseSchema = getBaseSchemaForSlugAndLang(effectiveSlug, lang)
  const snapVal = slugSnap ? getByPath(slugSnap, path) : getByPath(baseSchema, path)
  const hasSnap = snapVal !== undefined && snapVal !== null
  const original = hasSnap ? (typeof snapVal === 'object' ? JSON.stringify(snapVal) : String(snapVal)) : currentElText
  const value = original

  adminEditState.changes[path][lang] = {
    original,
    value,
    updatedAt: new Date().toISOString()
  }
  if (original) {
    addVersion(path, lang, original, 'original')
  }
}

/** Update clientOverrides for real-time reactivity without lag during typing */
export function updateClientOverride(path: PathKey, lang: LangCode, newValue: string, targetSlug?: string) {
  const slug = targetSlug || (adminEditState.changes[path] as any)?.slug || adminEditState.slug || 'home'
  if (!slug) return

  const upper = lang.toUpperCase()
  const lower = lang.toLowerCase()
  if (!adminEditState.clientOverrides[slug]) adminEditState.clientOverrides[slug] = {}
  
  // Clean initialization per slug strictly from that slug's snapshot or base schema!
  if (!adminEditState.clientOverrides[slug][upper]) {
    const slugSnap = adminEditState.allLangUIBySlug?.[slug]?.[upper]
    const base = getBaseSchemaForSlugAndLang(slug, upper)
    adminEditState.clientOverrides[slug][upper] = deepClone(slugSnap || base || {})
  }
  if (!adminEditState.clientOverrides[slug][lower]) {
    const slugSnap = adminEditState.allLangUIBySlug?.[slug]?.[lower]
    const base = getBaseSchemaForSlugAndLang(slug, lower)
    adminEditState.clientOverrides[slug][lower] = deepClone(slugSnap || base || {})
  }

  // If newValue is JSON object/array, parse it before setting
  if (typeof newValue === 'string' && (newValue.startsWith('[') || newValue.startsWith('{'))) {
    try {
      const parsed = JSON.parse(newValue)
      setByPath(adminEditState.clientOverrides[slug][upper], path, parsed)
      setByPath(adminEditState.clientOverrides[slug][lower], path, parsed)
    } catch {
      setByPath(adminEditState.clientOverrides[slug][upper], path, newValue)
      setByPath(adminEditState.clientOverrides[slug][lower], path, newValue)
    }
  } else {
    setByPath(adminEditState.clientOverrides[slug][upper], path, newValue)
    setByPath(adminEditState.clientOverrides[slug][lower], path, newValue)
  }
}

export function setDraftValue(path: PathKey, lang: LangCode, newValue: string, targetSlug?: string, syncOverrides = true) {
  if (!path || !lang) return
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  
  const effectiveSlug = targetSlug || (adminEditState.changes[path] as any)?.slug || adminEditState.slug || 'home'
  ;(adminEditState.changes[path] as any).slug = effectiveSlug

  if (!adminEditState.changes[path][lang]) {
    adminEditState.changes[path][lang] = { original: '', value: '' }
  }
  const rec = adminEditState.changes[path][lang]
  rec.draft = newValue
  rec.updatedAt = new Date().toISOString()
  addVersion(path, lang, newValue, 'draft')

  recordEditTelemetry(path, lang, newValue)

  // Only update reactive clientOverrides when syncOverrides is true (e.g. on blur or programmatic commit)
  // This guarantees 0ms typing lag and completely prevents cursor jumps
  if (syncOverrides) {
    updateClientOverride(path, lang, newValue, effectiveSlug)
  }

  saveDraftToLocalStorage(effectiveSlug)

  if (process.dev) {
    logger.debug('Admin:Edit', `Draft updated on "${path}" [${lang.toUpperCase()}]: "${newValue.slice(0, 40)}${newValue.length > 40 ? '...' : ''}"`)
  }
}

export function setValueSilently(path: PathKey, lang: LangCode, newValue: string, targetSlug?: string) {
  if (!path || !lang) return
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  
  const effectiveSlug = targetSlug || (adminEditState.changes[path] as any)?.slug || adminEditState.slug || 'home'
  ;(adminEditState.changes[path] as any).slug = effectiveSlug

  if (!adminEditState.changes[path][lang]) {
    adminEditState.changes[path][lang] = { original: newValue, value: newValue }
    return
  }
  const rec = adminEditState.changes[path][lang]
  if (rec.draft != null) return
  rec.value = newValue
}

export function isChanged(path: PathKey, lang: LangCode): boolean {
  const rec = adminEditState.changes[path]?.[lang]
  if (!rec) return false
  if (rec.draft !== undefined && rec.draft !== null) {
    if (rec.draft === rec.original) return false
    return normForCompare(rec.draft, lang) !== normForCompare(rec.original, lang)
  }
  if (!rec.original || rec.value === rec.original) return false
  return normForCompare(rec.value, lang) !== normForCompare(rec.original, lang)
}

/** Build save payload grouped by slug */
export function buildChangesPayloadBySlug(lang: LangCode): Record<string, { path: string; value: string }[]> {
  const out: Record<string, { path: string; value: string }[]> = {}
  for (const [path, rec] of Object.entries(adminEditState.changes)) {
    const lr = rec?.[lang]
    if (!lr) continue
    const candidate = lr.draft ?? lr.value
    if (normForCompare(candidate, lang) !== normForCompare(lr.original, lang)) {
      const slug = (rec as any).slug || adminEditState.slug || 'home'
      if (!out[slug]) out[slug] = []
      out[slug].push({ path, value: candidate })
    }
  }
  return out
}

/** Build save payload for a given language */
export function buildChangesPayload(lang: LangCode): { path: string; value: string }[] {
  const out: { path: string; value: string }[] = []
  for (const [path, rec] of Object.entries(adminEditState.changes)) {
    const lr = rec?.[lang]
    if (!lr) continue
    const candidate = lr.draft ?? lr.value
    if (normForCompare(candidate, lang) !== normForCompare(lr.original, lang)) {
      out.push({ path, value: candidate })
    }
  }
  return out
}

/** Record saved versions for saved paths */
export function recordSavedVersions(lang: LangCode, paths: string[], targetSlug?: string) {
  const now = new Date().toISOString()
  adminEditState.telemetry.serverSyncedAt = now
  adminEditState.telemetry.source = 'server_live'
  adminEditState.lastSavedAt = now

  const affectedSlugs = new Set<string>()
  if (targetSlug) affectedSlugs.add(targetSlug)

  for (const path of paths) {
    const rec = adminEditState.changes[path]?.[lang]
    if (!rec) continue
    const savedVal = rec.draft ?? rec.value
    rec.original = savedVal
    rec.value = savedVal
    rec.draft = undefined
    addVersion(path, lang, savedVal, 'saved')

    const slug = (adminEditState.changes[path] as any)?.slug || targetSlug || adminEditState.slug || 'home'
    affectedSlugs.add(slug)
    updateClientOverride(path, lang, savedVal, slug)
  }

  // Clear or refresh LocalStorage drafts per affected slug
  for (const s of affectedSlugs) {
    let hasRemainingDrafts = false
    for (const [p, r] of Object.entries(adminEditState.changes)) {
      const recSlug = (r as any)?.slug || adminEditState.slug || 'home'
      if (recSlug === s && isChanged(p, lang)) {
        hasRemainingDrafts = true
        break
      }
    }
    if (!hasRemainingDrafts) {
      clearDraftFromLocalStorage(s)
    } else {
      saveDraftToLocalStorage(s)
    }
  }
}

/** Total modified fields for a language */
export function changedCountForLang(lang: LangCode): number {
  let c = 0
  for (const [p] of Object.entries(adminEditState.changes)) {
    if (isChanged(p, lang)) c++
  }
  return c
}

/** Revert a single path (supports text, media, and arrays) */
/** Revert a single path (supports text, media, and arrays) */
export function revertPath(path: PathKey, lang: LangCode) {
  const rec = adminEditState.changes[path]?.[lang]
  if (!rec) return
  rec.draft = undefined
  rec.value = rec.original

  // Robust slug resolution:
  const slug =
    (adminEditState.changes[path] as any)?.slug ||
    (typeof document !== 'undefined'
      ? document.querySelector(`[data-edit-path="${CSS.escape(path)}"]`)?.getAttribute('data-admin-slug')
      : null) ||
    adminEditState.slug ||
    'home'

  if (slug && adminEditState.clientOverrides[slug]) {
    const upper = lang.toUpperCase()
    const lower = lang.toLowerCase()
    try {
      if (typeof rec.original === 'string' && (rec.original.startsWith('[') || rec.original.startsWith('{'))) {
        const parsed = JSON.parse(rec.original)
        if (adminEditState.clientOverrides[slug][upper]) setByPath(adminEditState.clientOverrides[slug][upper], path, parsed)
        if (adminEditState.clientOverrides[slug][lower]) setByPath(adminEditState.clientOverrides[slug][lower], path, parsed)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('admin:array-changed', {
            detail: { arrayPath: path, action: 'revert', lang, slug }
          }))
        }
      } else {
        if (adminEditState.clientOverrides[slug][upper]) setByPath(adminEditState.clientOverrides[slug][upper], path, rec.original)
        if (adminEditState.clientOverrides[slug][lower]) setByPath(adminEditState.clientOverrides[slug][lower], path, rec.original)
      }
    } catch {
      if (adminEditState.clientOverrides[slug][upper]) setByPath(adminEditState.clientOverrides[slug][upper], path, rec.original)
      if (adminEditState.clientOverrides[slug][lower]) setByPath(adminEditState.clientOverrides[slug][lower], path, rec.original)
    }
  }

  // Update DOM elements on page
  if (typeof document !== 'undefined') {
    document.querySelectorAll<HTMLElement>(`[data-edit-path="${CSS.escape(path)}"]`)
      .forEach(el => {
        el.textContent = rec.original ?? ''
        el.classList.remove('v-editable--changed')
        el.removeAttribute('data-admin-changed')
      })
  }

  // Check if any changes remain for this specific slug
  let hasRemainingChangesForSlug = false
  for (const [p, r] of Object.entries(adminEditState.changes)) {
    const s = (r as any)?.slug || adminEditState.slug || 'home'
    if (s === slug && isChanged(p, lang)) {
      hasRemainingChangesForSlug = true
      break
    }
  }

  if (!hasRemainingChangesForSlug) {
    clearDraftFromLocalStorage(slug)
    if (adminEditState.clientOverrides[slug]) {
      delete adminEditState.clientOverrides[slug][lang.toUpperCase()]
      delete adminEditState.clientOverrides[slug][lang.toLowerCase()]
    }
  } else {
    saveDraftToLocalStorage(slug)
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('admin:field-reverted', {
      detail: { path, lang, slug }
    }))
  }
}

export function revertPathToOriginal(path: PathKey, lang: LangCode) {
  revertPath(path, lang)
}

/** Discard all changes for a given language */
export function discardAllChanges(lang: LangCode) {
  for (const [path, recs] of Object.entries(adminEditState.changes)) {
    const rec = recs?.[lang]
    if (!rec) continue
    rec.value = rec.original
    rec.draft = undefined

    if (typeof document !== 'undefined') {
      document.querySelectorAll<HTMLElement>(`[data-edit-path="${CSS.escape(path)}"]`)
        .forEach(el => {
          el.textContent = rec.original ?? ''
          el.classList.remove('v-editable--changed')
          el.removeAttribute('data-admin-changed')
        })
    }
  }

  // Clear client overrides and reset UI live across all slugs
  const allSlugs = new Set<string>([
    adminEditState.slug,
    'home',
    'menu',
    'footer',
    ...Object.keys(adminEditState.clientOverrides)
  ])

  for (const s of allSlugs) {
    if (!s) continue
    if (adminEditState.clientOverrides[s]) {
      delete adminEditState.clientOverrides[s][lang.toUpperCase()]
      delete adminEditState.clientOverrides[s][lang.toLowerCase()]
    }
    clearDraftFromLocalStorage(s)
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('admin:array-changed', {
      detail: { arrayPath: '*', action: 'reset', lang, slug: adminEditState.slug }
    }))
  }

  if (process.dev) {
    logger.warn('Admin:Edit', `Discarded all pending drafts for [${lang.toUpperCase()}] across all slugs`)
  }
}

/** Restore a specific revision from history */
export function restoreVersion(path: PathKey, lang: LangCode, value: string) {
  const slug =
    (adminEditState.changes[path] as any)?.slug ||
    (typeof document !== 'undefined'
      ? document.querySelector(`[data-edit-path="${CSS.escape(path)}"]`)?.getAttribute('data-admin-slug')
      : null) ||
    adminEditState.slug ||
    'home'

  setDraftValue(path, lang, value, slug, true)

  if (typeof document !== 'undefined') {
    document.querySelectorAll<HTMLElement>(`[data-edit-path="${CSS.escape(path)}"]`)
      .forEach(el => {
        el.textContent = value
        el.classList.add('v-editable--changed')
        el.setAttribute('data-admin-changed', 'true')
      })
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('admin:field-restored', {
      detail: { path, lang, value, slug }
    }))
  }
}

/** Active editing focus state management */
export function setEditingActive(path: string | null, active: boolean) {
  adminEditState.activeEditingPath = active ? path : null
  adminEditState.isEditingActive = active
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('najm:admin-editing-state', {
        detail: { active, path }
      })
    )
  }
}

/** Helper: Load active working copy of UI schema */
export function getActiveWorkingUI(slug: string, lang: LangCode): { currentUI: any; baseSchema: any } {
  const upper = lang.toUpperCase()
  const lower = lang.toLowerCase()

  if (!adminEditState.clientOverrides[slug]) {
    adminEditState.clientOverrides[slug] = {}
  }

  const baseSchema = getBaseSchemaForSlugAndLang(slug, lang)
  let currentUI = adminEditState.clientOverrides[slug][upper] || adminEditState.clientOverrides[slug][lower]

  if (!currentUI || Object.keys(currentUI).length === 0) {
    const slugSnap = adminEditState.allLangUIBySlug?.[slug]?.[upper] || adminEditState.allLangUIBySlug?.[slug]?.[lower]
    // NEVER fall back to active page allLangUI if slug is different (e.g. footer vs home)!
    const snap = slugSnap || (slug === adminEditState.slug ? (adminEditState.allLangUI[upper] || adminEditState.allLangUI[lower]) : null)
    if (snap && Object.keys(snap).length > 0) {
      currentUI = deepClone(snap)
    } else {
      currentUI = deepClone(baseSchema)
    }
  } else {
    currentUI = deepClone(currentUI)
  }

  return { currentUI, baseSchema }
}

/** Helper: Commit modified UI and update changes store */
function commitArrayMutation(slug: string, lang: LangCode, arrayPath: string, targetArr: any[], baseSchema: any, actionName: string) {
  const upper = lang.toUpperCase()
  const lower = lang.toLowerCase()

  // Ensure baseline change record exists
  const originalArr = getByPath(baseSchema, arrayPath) || []
  if (!adminEditState.changes[arrayPath]) adminEditState.changes[arrayPath] = {}
  if (!adminEditState.changes[arrayPath][lang] || !adminEditState.changes[arrayPath][lang].original) {
    adminEditState.changes[arrayPath][lang] = {
      original: JSON.stringify(originalArr),
      value: JSON.stringify(originalArr),
      updatedAt: new Date().toISOString()
    }
  }
  ;(adminEditState.changes[arrayPath] as any).slug = slug

  // Register array draft change in changes store
  const newArrStr = JSON.stringify(targetArr)
  adminEditState.changes[arrayPath][lang].draft = newArrStr
  adminEditState.changes[arrayPath][lang].updatedAt = new Date().toISOString()
  addVersion(arrayPath, lang, newArrStr, 'draft')

  // Store back into clientOverrides for real-time reactivity
  if (!adminEditState.clientOverrides[slug]) adminEditState.clientOverrides[slug] = {}

  // CRITICAL: Initialize clientOverrides with full baseline schema if empty or missing parent structures!
  const slugSnap = adminEditState.allLangUIBySlug?.[slug]?.[upper] || adminEditState.allLangUIBySlug?.[slug]?.[lower]
  const fullBase = deepClone(slugSnap || baseSchema || {})

  if (!adminEditState.clientOverrides[slug][upper] || Object.keys(adminEditState.clientOverrides[slug][upper]).length === 0) {
    adminEditState.clientOverrides[slug][upper] = deepClone(fullBase)
  }
  if (!adminEditState.clientOverrides[slug][lower] || Object.keys(adminEditState.clientOverrides[slug][lower]).length === 0) {
    adminEditState.clientOverrides[slug][lower] = deepClone(fullBase)
  }

  setByPath(adminEditState.clientOverrides[slug][upper], arrayPath, targetArr)
  setByPath(adminEditState.clientOverrides[slug][lower], arrayPath, targetArr)

  // Keep allLangUIBySlug in sync
  if (!adminEditState.allLangUIBySlug) adminEditState.allLangUIBySlug = {}
  if (!adminEditState.allLangUIBySlug[slug]) adminEditState.allLangUIBySlug[slug] = {} as any
  if (adminEditState.allLangUIBySlug[slug][upper]) setByPath(adminEditState.allLangUIBySlug[slug][upper], arrayPath, targetArr)
  if (adminEditState.allLangUIBySlug[slug][lower]) setByPath(adminEditState.allLangUIBySlug[slug][lower], arrayPath, targetArr)

  // Only update allLangUI if this slug is actually the current active page
  if (slug === adminEditState.slug || !adminEditState.slug) {
    if (adminEditState.allLangUI[upper]) setByPath(adminEditState.allLangUI[upper], arrayPath, targetArr)
    if (adminEditState.allLangUI[lower]) setByPath(adminEditState.allLangUI[lower], arrayPath, targetArr)
  }

  // Persist draft to LocalStorage specifically for this slug
  saveDraftToLocalStorage(slug)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('admin:array-changed', {
      detail: { arrayPath, action: actionName, lang, slug }
    }))
  }
}

/** Add a new item to an array at a specific index */
export function addArrayItem(arrayPath: string, atIndex: number, lang: LangCode, targetSlug?: string, customTemplate?: any) {
  const currentSlug = targetSlug || adminEditState.slug || 'home'
  if (!lang) lang = adminEditState.language || 'FA'

  const { currentUI, baseSchema } = getActiveWorkingUI(currentSlug, lang)

  // Locate target array
  let targetArr = getByPath(currentUI, arrayPath)
  if (!Array.isArray(targetArr) || targetArr.length === 0) {
    const baseArr = getByPath(baseSchema, arrayPath)
    if (Array.isArray(baseArr) && baseArr.length > 0) {
      targetArr = deepClone(baseArr)
    } else {
      targetArr = []
    }
    setByPath(currentUI, arrayPath, targetArr)
  }

  // Create clean placeholder item with proper fields
  let newItem: any = 'آیتم جدید (کلیک برای ویرایش)'
  if (customTemplate && typeof customTemplate === 'object') {
    newItem = deepClone(customTemplate)
  } else if (targetArr.length > 0) {
    const templateIndex = (atIndex >= 0 && atIndex < targetArr.length) ? atIndex : targetArr.length - 1
    const template = targetArr[templateIndex]
    if (typeof template === 'object' && template !== null) {
      newItem = deepClone(template)
      for (const k of Object.keys(newItem)) {
        if (typeof newItem[k] === 'string') {
          if (k.toLowerCase() === 'slug' || k.toLowerCase() === 'href' || k.toLowerCase() === 'url' || k.toLowerCase() === 'to') {
            newItem[k] = template[k] || '/'
          } else if (k.toLowerCase().includes('id') || k.toLowerCase().includes('key')) {
            newItem[k] = `item_${Date.now().toString(36)}`
          } else if (k.toLowerCase().includes('image') || k.toLowerCase().includes('icon')) {
            // preserve image
          } else {
            newItem[k] = `${newItem[k]} (جدید)`
          }
        } else if (Array.isArray(newItem[k])) {
          newItem[k] = newItem[k].map((sub: any) => typeof sub === 'string' ? `${sub} (جدید)` : sub)
        }
      }
    } else if (typeof template === 'string') {
      newItem = `${template} (جدید)`
    }
  } else {
    newItem = {
      name: 'آیتم جدید',
      title: 'عنوان جدید (ویرایش کنید)',
      slug: '/',
      type: 'link',
      desc: 'توضیحات مورد نظر را اینجا وارد کنید',
      question: 'پرسش جدید (برای ویرایش کلیک کنید)',
      answer: 'پاسخ پرسش را در این قسمت وارد نمایید.'
    }
  }

  // Guarantee name or title is never empty
  if (typeof newItem === 'object' && newItem !== null) {
    if (newItem.name !== undefined && (!newItem.name || !String(newItem.name).trim())) {
      newItem.name = 'آیتم جدید'
    }
    if (newItem.title !== undefined && (!newItem.title || !String(newItem.title).trim())) {
      newItem.title = 'عنوان جدید'
    }
  }

  const insertPos = atIndex >= 0 ? atIndex + 1 : targetArr.length
  targetArr.splice(insertPos, 0, newItem)

  commitArrayMutation(currentSlug, lang, arrayPath, targetArr, baseSchema, 'add')

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', text: `+ آیتم جدید به «${arrayPath}» افزوده شد (مجموع: ${targetArr.length})` }
    }))
  }
}

/** Move / Reorder an item in an array */
export function moveArrayItem(arrayPath: string, fromIndex: number, toIndex: number, lang: LangCode, targetSlug?: string) {
  const currentSlug = targetSlug || adminEditState.slug || 'home'
  if (!lang) lang = adminEditState.language || 'FA'

  const { currentUI, baseSchema } = getActiveWorkingUI(currentSlug, lang)
  let targetArr = getByPath(currentUI, arrayPath)
  if (!Array.isArray(targetArr) || fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= targetArr.length || toIndex >= targetArr.length) {
    return
  }

  const [movedItem] = targetArr.splice(fromIndex, 1)
  targetArr.splice(toIndex, 0, movedItem)

  commitArrayMutation(currentSlug, lang, arrayPath, targetArr, baseSchema, 'move')

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'info', text: `موقعیت آیتم در «${arrayPath}» تغییر یافت` }
    }))
  }
}

/** Archive an item in an array */
export function archiveArrayItem(arrayPath: string, index: number, lang: LangCode, targetSlug?: string) {
  const currentSlug = targetSlug || adminEditState.slug || 'home'
  if (!lang) lang = adminEditState.language || 'FA'

  const { currentUI, baseSchema } = getActiveWorkingUI(currentSlug, lang)
  let targetArr = getByPath(currentUI, arrayPath)
  if (!Array.isArray(targetArr) || index < 0 || index >= targetArr.length) return

  if (targetArr.length <= 1) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'warning', text: 'امکان آرشیو کردن آخرین آیتم باقی‌مانده وجود ندارد' }
      }))
    }
    return
  }

  // Extract item
  const [archivedItem] = targetArr.splice(index, 1)

  // Store into archives store
  if (!adminEditState.archives[currentSlug]) adminEditState.archives[currentSlug] = {}
  if (!adminEditState.archives[currentSlug][arrayPath]) adminEditState.archives[currentSlug][arrayPath] = []
  adminEditState.archives[currentSlug][arrayPath].push(archivedItem)

  commitArrayMutation(currentSlug, lang, arrayPath, targetArr, baseSchema, 'archive')

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'info', text: `📦 آیتم به آرشیو منتقل شد (مجموع در آرشیو: ${adminEditState.archives[currentSlug][arrayPath].length})` }
    }))
  }
}

/** Restore an archived item back to active array */
export function restoreArchivedItem(arrayPath: string, archiveIndex: number, lang: LangCode, targetSlug?: string) {
  const currentSlug = targetSlug || adminEditState.slug || 'home'
  if (!lang) lang = adminEditState.language || 'FA'

  const archiveList = adminEditState.archives[currentSlug]?.[arrayPath]
  if (!archiveList || archiveIndex < 0 || archiveIndex >= archiveList.length) return

  const [restoredItem] = archiveList.splice(archiveIndex, 1)
  const { currentUI, baseSchema } = getActiveWorkingUI(currentSlug, lang)
  let targetArr = getByPath(currentUI, arrayPath) || []
  targetArr.push(restoredItem)

  commitArrayMutation(currentSlug, lang, arrayPath, targetArr, baseSchema, 'restore')

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', text: `✓ آیتم از آرشیو بازگردانی شد` }
    }))
  }
}

/** Get archived items list for an array */
export function getArchivedItems(arrayPath: string, targetSlug?: string): any[] {
  const currentSlug = targetSlug || adminEditState.slug || 'home'
  return adminEditState.archives[currentSlug]?.[arrayPath] || []
}

/** Delete an item permanently with 100% preservation of remaining items */
export function removeArrayItem(arrayPath: string, atIndex: number, lang: LangCode, targetSlug?: string) {
  const currentSlug = targetSlug || adminEditState.slug || 'home'
  if (!lang) lang = adminEditState.language || 'FA'

  const { currentUI, baseSchema } = getActiveWorkingUI(currentSlug, lang)
  let targetArr = getByPath(currentUI, arrayPath)
  if (!Array.isArray(targetArr) || atIndex < 0 || atIndex >= targetArr.length) return

  if (targetArr.length <= 1) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'warning', text: 'امکان حذف آخرین آیتم باقی‌مانده وجود ندارد' }
      }))
    }
    return
  }

  targetArr.splice(atIndex, 1)

  commitArrayMutation(currentSlug, lang, arrayPath, targetArr, baseSchema, 'remove')

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'info', text: `- آیتم از «${arrayPath}» حذف شد (باقی‌مانده: ${targetArr.length})` }
    }))
  }
}

/** Helper to list all changed fields with details */
export function getChangedDetails(lang: LangCode): ChangedFieldDetail[] {
  const list: ChangedFieldDetail[] = []
  for (const [path, perLang] of Object.entries(adminEditState.changes)) {
    const rec = perLang[lang]
    if (!rec) continue
    if (isChanged(path, lang)) {
      let orig = rec.original ?? ''
      let curr = rec.draft ?? rec.value ?? ''

      // Clean presentation for array/object JSON in Changes Drawer
      if (orig.startsWith('[') && orig.endsWith(']')) {
        try {
          const origLen = JSON.parse(orig).length
          const currLen = JSON.parse(curr).length
          const diff = currLen - origLen
          orig = `${origLen} آیتم`
          curr = `${currLen} آیتم (${diff > 0 ? `+${diff}` : diff} تغییر)`
        } catch {}
      }

      list.push({
        path,
        lang,
        original: orig,
        current: curr,
        hasDraft: rec.draft !== undefined,
        isChanged: true
      })
    }
  }
  return list
}

export function getAllPaths(): string[] {
  return Object.keys(adminEditState.changes)
}

export function getAllLangs(): string[] {
  const a = new Set<string>(Object.keys(adminEditState.allLangUI))
  for (const rec of Object.values(adminEditState.changes)) {
    Object.keys(rec || {}).forEach(l => a.add(l))
  }
  if (!a.size) return ['fa', 'en', 'ar']
  return Array.from(a)
}

export function getActiveSlugs(): string[] {
  const slugs = new Set<string>()
  if (adminEditState.slug) slugs.add(adminEditState.slug)
  if (adminEditState.allLangUIBySlug) {
    Object.keys(adminEditState.allLangUIBySlug).forEach(s => slugs.add(s))
  }
  slugs.add('menu')
  slugs.add('footer')
  return Array.from(slugs).filter(Boolean)
}

export interface PageContentItem {
  section: string
  sectionLabel: string
  key: string
  path: string
  current: string
  original: string
  isChanged: boolean
  isMultiline: boolean
  slug: string
  lang: string
}

export function getPageContentItems(slug?: string, lang?: LangCode): PageContentItem[] {
  const currentSlug = slug || adminEditState.slug || 'home'
  const currentLang = (lang || adminEditState.language || 'FA').toUpperCase()
  const { currentUI, baseSchema } = getActiveWorkingUI(currentSlug, currentLang)

  const items: PageContentItem[] = []

  const sectionLabels: Record<string, string> = {
    sceneHero: 'بخش اصلی و هدر (Hero)',
    highlightedText: 'تایپوگرافی برجسته (Typography)',
    sceneServicesAndCapabilities: 'خدمات و توانایی‌ها (Services)',
    accordion: 'مراحل و گام‌ها (Process Steps)',
    sceneProducts: 'محصولات (Products)',
    scenePartners: 'همکاران تجاری (Partners)',
    sceneCustomers: 'مشتریان و نظرات (Customers)',
    sceneFaq: 'سوالات متداول (FAQ)',
    sceneContact: 'اطلاعات تماس (Contact)',
    products: 'دسته‌بندی محصولات منو (Menu Products)',
    services: 'خدمات منو (Menu Services)',
    categories: 'دسته‌بندی‌ها (Categories)',
    links: 'پیوندها (Links)',
    featured: 'ویژه‌ها (Featured)',
    columns: 'ستون‌های فوتر (Footer Columns)',
    socials: 'شبکه‌های اجتماعی (Socials)',
    copyright: 'کپی‌رایت (Copyright)',
    about: 'درباره ما (About)',
    seo: 'سئو و متادیتا (SEO & Meta)'
  }

  function getHumanSection(sectionKey: string): string {
    if (sectionLabels[sectionKey]) return sectionLabels[sectionKey]
    return sectionKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^scene\s*/i, '')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  function walk(node: any, prefix = '', topSection = '') {
    if (node === null || node === undefined) return

    if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
      const fullPath = prefix
      const rec = adminEditState.changes[fullPath]?.[currentLang] || adminEditState.changes[fullPath]?.[currentLang.toLowerCase()]
      const baseVal = getByPath(baseSchema, fullPath)
      const orig = rec?.original ?? (baseVal !== undefined ? String(baseVal) : String(node))
      const curr = rec?.draft ?? rec?.value ?? String(node)

      const sectionKey = topSection || fullPath.split('.')[0] || 'general'
      const key = fullPath.startsWith(sectionKey + '.') ? fullPath.slice(sectionKey.length + 1) : fullPath

      const changed = isChanged(fullPath, currentLang) || isChanged(fullPath, currentLang.toLowerCase()) || (normForCompare(curr, currentLang) !== normForCompare(orig, currentLang))

      items.push({
        section: sectionKey,
        sectionLabel: getHumanSection(sectionKey),
        key,
        path: fullPath,
        current: curr,
        original: orig,
        isChanged: changed,
        isMultiline: curr.includes('\n') || curr.length > 70,
        slug: currentSlug,
        lang: currentLang
      })
      return
    }

    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        const itemPath = prefix ? `${prefix}.${index}` : `${index}`
        const sec = topSection || prefix || 'general'
        walk(item, itemPath, sec)
      })
      return
    }

    if (typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (k.startsWith('_') || k === 'id') continue
        const childPath = prefix ? `${prefix}.${k}` : k
        const sec = topSection || prefix || k
        walk(v, childPath, sec)
      }
    }
  }

  walk(currentUI)
  return items
}

/** Media Studio In-Place Handlers */
export function openMediaStudio(target: {
  path?: string
  url?: string
  el?: HTMLElement
  meta?: MediaMetadata
}) {
  adminEditState.activeMediaPath = target.path || null
  adminEditState.activeMediaElement = target.el || null
  adminEditState.activeMediaInitialUrl = target.url || ''
  adminEditState.activeMediaUrl = target.url || ''
  adminEditState.activeMediaMetadata = target.meta || null
  adminEditState.mediaStudioOpen = true

  if (target.path && target.url) {
    const lang = adminEditState.language || 'fa'
    ensureBaseline(target.path, lang, target.url)
  }
}

export function closeMediaStudio() {
  adminEditState.mediaStudioOpen = false
  adminEditState.activeMediaPath = null
  adminEditState.activeMediaElement = null
  adminEditState.activeMediaInitialUrl = ''
  adminEditState.activeMediaUrl = ''
  adminEditState.activeMediaMetadata = null
}

export function selectMediaElement(el: HTMLElement, path: string, url?: string, meta?: MediaMetadata) {
  adminEditState.activeMediaElement = el
  adminEditState.activeMediaPath = path
  if (url) adminEditState.activeMediaInitialUrl = url
  if (meta) adminEditState.activeMediaMetadata = meta
}

export function clearMediaSelection() {
  adminEditState.activeMediaElement = null
  adminEditState.activeMediaPath = null
  adminEditState.activeMediaInitialUrl = ''
  adminEditState.activeMediaMetadata = null
}

export function setMediaDraftValue(
  path: PathKey,
  lang: LangCode,
  newUrl: string,
  meta?: MediaMetadata
) {
  if (!path || !lang) return

  setDraftValue(path, lang, newUrl)

  if (!adminEditState.mediaDrafts[path]) {
    const orig = adminEditState.changes[path]?.[lang]?.original || newUrl
    adminEditState.mediaDrafts[path] = { original: orig }
  }
  adminEditState.mediaDrafts[path].draft = newUrl
  if (meta) {
    adminEditState.mediaDrafts[path].meta = meta
  }

  if (typeof document !== 'undefined') {
    const escaped = CSS.escape(path)
    document.querySelectorAll<HTMLElement>(`[data-media-path="${escaped}"], [data-edit-path="${escaped}"]`)
      .forEach(el => {
        if (el instanceof HTMLImageElement) {
          el.src = newUrl
        } else if (el.tagName === 'IMG') {
          (el as HTMLImageElement).src = newUrl
        }
        const img = el.querySelector('img')
        if (img) {
          img.src = newUrl
        }
        el.classList.add('v-media-changed')
        el.setAttribute('data-admin-changed', 'true')
      })

    window.dispatchEvent(new CustomEvent('admin:media-changed', {
      detail: { path, url: newUrl, lang, meta, action: 'draft' }
    }))
  }

  if (process.dev) {
    logger.success('Admin:Media', `Applied in-place media draft for "${path}": ${newUrl.slice(0, 60)}...`)
  }
}

/** Motion & Animation Freeze API */
export function pauseMotionElement(el: HTMLElement) {
  if (!el) return
  adminEditState.pausedMotionElements.add(el)
  el.classList.add('admin-motion-paused')
  el.setAttribute('data-motion-paused', 'true')
}

export function resumeMotionElement(el: HTMLElement) {
  if (!el) return
  adminEditState.pausedMotionElements.delete(el)
  el.classList.remove('admin-motion-paused')
  el.removeAttribute('data-motion-paused')
}

export function setGlobalMotionPaused(paused: boolean) {
  adminEditState.isMotionPausedGlobally = paused
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('admin-global-motion-paused', paused)
    document.body.classList.toggle('admin-all-motions-paused', paused)
  }
  if (typeof window !== 'undefined') {
    try {
      const gsap = (window as any).gsap
      if (gsap && gsap.globalTimeline) {
        if (paused) {
          gsap.globalTimeline.pause()
        } else {
          gsap.globalTimeline.resume()
        }
      }
    } catch {}
    window.dispatchEvent(new CustomEvent('admin:motion-global-toggle', { detail: { paused } }))
  }
}

export function toggleGlobalMotionPaused() {
  setGlobalMotionPaused(!adminEditState.isMotionPausedGlobally)
}

export function isElementMotionPaused(el: HTMLElement | null): boolean {
  if (!el) return false
  return adminEditState.pausedMotionElements.has(el) || adminEditState.isMotionPausedGlobally
}

/** Content Origin & Hierarchy Detection Engine */
export function detectContentOrigin(path: string, slug?: string, el?: HTMLElement | null): OriginMetadata {
  const currentSlug = slug || (adminEditState.changes[path] as any)?.slug || adminEditState.slug || 'home'
  const isShared = currentSlug === 'menu' || currentSlug === 'footer'

  let source: ContentOriginSource = 'page_cms'
  let sourceLabel = 'محتوای صفحه (CMS Pages)'
  let collection = 'pages'
  let recordId: string | undefined = undefined
  let field: string | undefined = undefined
  let isDynamic = false

  if (isShared) {
    source = 'layout_shared'
    sourceLabel = currentSlug === 'menu' ? 'منوی سراسری مشترک (Global Header)' : 'فوتر سراسری مشترک (Global Footer)'
    collection = 'pages'
  } else if (path.startsWith('collection:') || el?.getAttribute('data-origin-source') === 'pocketbase_collection') {
    source = 'pocketbase_collection'
    const parts = path.replace('collection:', '').split('.')
    collection = parts[0] || 'records'
    recordId = parts[1]
    field = parts.slice(2).join('.')
    sourceLabel = `پایگاه داده پویا (${collection})`
    isDynamic = true
  } else if (el?.getAttribute('data-origin-source') === 'hardcoded_ui') {
    source = 'hardcoded_ui'
    sourceLabel = 'المان رابط کاربری استاتیک'
  }

  // Derive component chain from DOM if element provided
  const componentChain: string[] = []
  if (el && typeof document !== 'undefined') {
    let curr: HTMLElement | null = el.parentElement
    while (curr && curr !== document.body) {
      const compName = curr.getAttribute('data-component') || curr.getAttribute('data-scene') || curr.tagName.toLowerCase()
      if (compName && !componentChain.includes(compName)) {
        componentChain.unshift(compName)
      }
      curr = curr.parentElement
    }
  }

  // Determine parent path
  const segs = path.split('.')
  const parentPath = segs.length > 1 ? segs.slice(0, -1).join('.') : undefined

  return {
    source,
    sourceLabel,
    collection,
    recordId,
    field,
    slug: currentSlug,
    path,
    parentPath,
    componentChain,
    isDynamic,
    isShared
  }
}

export function registerOrigin(path: string, origin?: Partial<OriginMetadata>, el?: HTMLElement | null): OriginMetadata {
  if (!path) return detectContentOrigin(path, origin?.slug, el)
  const existing = adminEditState.originMap[path]
  const detected = detectContentOrigin(path, origin?.slug, el)
  const finalMeta: OriginMetadata = {
    ...detected,
    ...existing,
    ...(origin || {})
  }
  adminEditState.originMap[path] = finalMeta
  return finalMeta
}

export function getOrigin(path: string): OriginMetadata {
  return adminEditState.originMap[path] || detectContentOrigin(path)
}

/** ID-aware remove array item */
export function removeArrayItemById(arrayPath: string, itemId: string | number, lang: LangCode, targetSlug?: string) {
  const currentSlug = targetSlug || adminEditState.slug || 'home'
  if (!lang) lang = adminEditState.language || 'FA'

  const { currentUI } = getActiveWorkingUI(currentSlug, lang)
  const targetArr = getByPath(currentUI, arrayPath)
  if (!Array.isArray(targetArr)) return

  const idx = targetArr.findIndex((x: any) => x && (String(x.id) === String(itemId) || String(x.key) === String(itemId) || String(x.slug) === String(itemId)))
  if (idx !== -1) {
    removeArrayItem(arrayPath, idx, lang, targetSlug)
  }
}

/** Unified Docked Panel Controls (Strictly NO modals in modals, NO charts) */
export function openUnifiedPanel(tab?: 'origin' | 'proof' | 'versions') {
  if (tab) adminEditState.unifiedPanelTab = tab
  adminEditState.unifiedPanelOpen = true
  adminEditState.inspectorOpen = true
  adminEditState.historyOpen = false
  adminEditState.minimized = false
}

export function closeUnifiedPanel() {
  adminEditState.unifiedPanelOpen = false
  adminEditState.inspectorOpen = false
  adminEditState.historyOpen = false
  adminEditState.highlightedDiffPath = null
}

export function toggleUnifiedPanel(tab?: 'origin' | 'proof' | 'versions') {
  if (adminEditState.unifiedPanelOpen && (!tab || adminEditState.unifiedPanelTab === tab)) {
    closeUnifiedPanel()
  } else {
    openUnifiedPanel(tab)
  }
}

/** Visual proof lens highlight pulse on page element */
export function highlightFieldInView(path: string) {
  adminEditState.highlightedDiffPath = path
  if (typeof document !== 'undefined') {
    const el = document.querySelector<HTMLElement>(`[data-edit-path="${CSS.escape(path)}"], [data-media-path="${CSS.escape(path)}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('admin-lens-pulse')
      setTimeout(() => {
        el.classList.remove('admin-lens-pulse')
      }, 2500)
    }
  }
}