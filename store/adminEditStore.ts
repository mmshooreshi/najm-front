// store/adminEditStore.ts
import { reactive, computed } from 'vue'
import { toLocalizedDigits } from '~/utils/digits'
import { logger } from '~/utils/logger'

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
  // Media Studio & In-Place Media Editor State
  mediaStudioOpen: boolean
  activeMediaPath: string | null
  activeMediaElement: HTMLElement | null
  activeMediaInitialUrl: string
  activeMediaMetadata: MediaMetadata | null
  mediaDrafts: Record<PathKey, { original: string; draft?: string; meta?: MediaMetadata }>
  selectedMediaElement: HTMLElement | null
  selectedMediaPath: string | null
}

export const adminEditState = reactive<AdminEditState>({
  canEdit: false,
  editMode: false,
  slug: '',
  language: '',
  changes: {},
  allLangUI: {},
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
  mediaStudioOpen: false,
  activeMediaPath: null,
  activeMediaElement: null,
  activeMediaInitialUrl: '',
  activeMediaMetadata: null,
  mediaDrafts: {},
  selectedMediaElement: null,
  selectedMediaPath: null
})

// Enable admin in development or when localStorage flag is set
if (typeof window !== 'undefined') {
  const dev = process.env.NODE_ENV === 'development' || (window as any).__NUXT__?.dev
  const flag = localStorage.getItem('admin_can_edit')
  adminEditState.canEdit = dev || flag === 'true'
  const savedEditMode = localStorage.getItem('admin_edit_mode')
  adminEditState.editMode = savedEditMode === 'true'
}

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

/** ---------- Helpers ---------- **/
export function normalize(str: string | null | undefined): string {
  if (str == null) return ''
  return String(str)
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width
    .replace(/\s+/g, ' ')
    .trim()
}

export function getText(el: HTMLElement): string {
  return normalize(el.innerText ?? el.textContent ?? '')
}

export function deepClone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch {
    return obj
  }
}

/** Dot-path getter supporting array indices like "a.b.0.c" */
export function getByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined
  return path.split('.').reduce((acc, seg) => {
    if (acc == null) return acc
    const idx = Number(seg)
    if (!Number.isNaN(idx) && String(idx) === seg) return acc?.[idx]
    return acc?.[seg]
  }, obj)
}

/** Dot-path setter supporting array indices like "a.b.0.c" */
export function setByPath(obj: any, path: string, value: any): void {
  if (!obj || !path) return
  const segments = path.split('.')
  let curr = obj
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i]
    const nextSeg = segments[i + 1]
    const nextIsNum = !Number.isNaN(Number(nextSeg)) && String(Number(nextSeg)) === nextSeg

    if (curr[seg] === undefined || curr[seg] === null || typeof curr[seg] !== 'object') {
      curr[seg] = nextIsNum ? [] : {}
    }
    curr = curr[seg]
  }
  const lastSeg = segments[segments.length - 1]
  curr[lastSeg] = value
}

function normForCompare(v: any, lang: LangCode): string {
  return normalize(toLocalizedDigits(v))
}

/** ---------- Core API ---------- **/
export function setSlug(slug: string) {
  if (adminEditState.slug !== slug) {
    adminEditState.slug = slug
  }
}

export function syncLanguage(lang: LangCode) {
  if (!lang) return
  if (adminEditState.language !== lang) {
    adminEditState.language = lang
  }
}

/** Freeze & store full-UI snapshot for a language */
export function captureLanguageSnapshot(lang: LangCode, ui: Record<string, any>) {
  if (!ui || Object.keys(ui).length === 0) return

  const prev = adminEditState.allLangUI[lang]
  const snap = deepClone(ui)

  // Deduplicate
  if (prev && JSON.stringify(prev) === JSON.stringify(snap)) {
    return
  }

  adminEditState.allLangUI[lang] = snap
}

/** Versions helpers */
export function addVersion(path: PathKey, lang: LangCode, value: string, type: VersionType) {
  if (!adminEditState.versions[path]) adminEditState.versions[path] = {}
  if (!adminEditState.versions[path][lang]) adminEditState.versions[path][lang] = []

  const list = adminEditState.versions[path][lang]
  const last = list[list.length - 1]
  // Don't push duplicate consecutive values of same type
  if (last && last.value === value && last.type === type) return

  list.push({
    type,
    value,
    date: new Date().toISOString()
  })

  // Keep last 30 versions per field
  if (list.length > 30) {
    list.shift()
  }
}

export function getVersions(path: PathKey, lang: LangCode): VersionEntry[] {
  return adminEditState.versions[path]?.[lang] ?? []
}

/** Hydrate baselines from allLangUI snapshot */
export function applySnapshotToBaselines(lang: LangCode) {
  const snap = adminEditState.allLangUI[lang]
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
          addVersion(fullPath, lang, strVal, 'original')
        } else if (!rec.original) {
          rec.original = strVal
          rec.value = strVal
          addVersion(fullPath, lang, strVal, 'original')
        }
      } else if (typeof v === 'object' && v !== null) {
        walk(v, fullPath)
      }
    }
  }

  walk(snap)
}

/** Ensure baseline exists for this path+lang (called on directive mount) */
export function ensureBaseline(path: PathKey, lang: LangCode, currentElText: string) {
  if (!path || !lang) return
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  const rec = adminEditState.changes[path][lang]
  if (rec && rec.original != null && rec.original !== '') return

  const snapText = getByPath(adminEditState.allLangUI[lang], path)
  const hasSnap = snapText !== undefined && snapText !== null
  const original = hasSnap ? String(snapText) : currentElText
  const value = hasSnap ? String(snapText) : currentElText

  adminEditState.changes[path][lang] = {
    original,
    value,
    updatedAt: new Date().toISOString()
  }
  if (original) {
    addVersion(path, lang, original, 'original')
  }
}

export function setDraftValue(path: PathKey, lang: LangCode, newValue: string) {
  if (!path || !lang) return
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  if (!adminEditState.changes[path][lang]) {
    adminEditState.changes[path][lang] = { original: newValue, value: newValue }
  }
  const rec = adminEditState.changes[path][lang]
  rec.draft = newValue
  rec.updatedAt = new Date().toISOString()
  addVersion(path, lang, newValue, 'draft')

  // Keep clientOverrides updated for real-time reactivity
  const slug = adminEditState.slug || 'home'
  if (slug) {
    const upper = lang.toUpperCase()
    const lower = lang.toLowerCase()
    if (!adminEditState.clientOverrides[slug]) adminEditState.clientOverrides[slug] = {}
    if (!adminEditState.clientOverrides[slug][upper]) adminEditState.clientOverrides[slug][upper] = deepClone(adminEditState.allLangUI[upper] || {})
    if (!adminEditState.clientOverrides[slug][lower]) adminEditState.clientOverrides[slug][lower] = deepClone(adminEditState.allLangUI[lower] || {})

    setByPath(adminEditState.clientOverrides[slug][upper], path, newValue)
    setByPath(adminEditState.clientOverrides[slug][lower], path, newValue)
  }

  if (process.dev) {
    logger.debug('Admin:Edit', `Draft updated on "${path}" [${lang.toUpperCase()}]: "${newValue.slice(0, 40)}${newValue.length > 40 ? '...' : ''}"`)
  }
}

export function setValueSilently(path: PathKey, lang: LangCode, newValue: string) {
  if (!path || !lang) return
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  if (!adminEditState.changes[path][lang]) {
    adminEditState.changes[path][lang] = { original: newValue, value: newValue }
    return
  }
  const rec = adminEditState.changes[path][lang]
  if (rec.draft != null) return // don't overwrite user's active draft
  rec.value = newValue
}

export function isChanged(path: PathKey, lang: LangCode): boolean {
  const rec = adminEditState.changes[path]?.[lang]
  if (!rec) return false
  if (rec.draft !== undefined && rec.draft !== null) {
    return normForCompare(rec.draft, lang) !== normForCompare(rec.original, lang)
  }
  if (!rec.original) return false
  return normForCompare(rec.value, lang) !== normForCompare(rec.original, lang)
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
  if (process.dev && out.length > 0) {
    logger.group('Admin:Sync', `Changes Payload generated for [${lang.toUpperCase()}] (${out.length} items)`, () => {
      out.forEach(item => logger.debug('Admin:Sync', `↳ ${item.path} → "${item.value}"`))
    })
  }
  return out
}

/** Record saved versions for saved paths */
export function recordSavedVersions(lang: LangCode, paths: string[]) {
  for (const path of paths) {
    const rec = adminEditState.changes[path]?.[lang]
    if (!rec) continue
    const savedVal = rec.draft ?? rec.value
    rec.original = savedVal
    rec.value = savedVal
    rec.draft = undefined
    addVersion(path, lang, savedVal, 'saved')
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

/** Revert a single path */
export function revertPath(path: PathKey, lang: LangCode) {
  const rec = adminEditState.changes[path]?.[lang]
  if (!rec) return
  rec.draft = undefined
  rec.value = rec.original

  if (typeof document !== 'undefined') {
    document.querySelectorAll<HTMLElement>(`[data-edit-path="${CSS.escape(path)}"]`)
      .forEach(el => {
        el.textContent = rec.original ?? ''
        el.classList.remove('v-editable--changed')
        el.removeAttribute('data-admin-changed')
      })
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

  // Clear client overrides
  const slug = adminEditState.slug
  if (slug && adminEditState.clientOverrides[slug]) {
    delete adminEditState.clientOverrides[slug][lang.toUpperCase()]
    delete adminEditState.clientOverrides[slug][lang.toLowerCase()]
  }

  if (process.dev) {
    logger.warn('Admin:Edit', `Discarded all pending drafts for [${lang.toUpperCase()}]`)
  }
}

/** Restore a specific revision from history */
export function restoreVersion(path: PathKey, lang: LangCode, value: string) {
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  if (!adminEditState.changes[path][lang]) {
    adminEditState.changes[path][lang] = { original: '', value: '' }
  }
  const rec = adminEditState.changes[path][lang]
  rec.draft = value
  addVersion(path, lang, value, 'draft')

  if (typeof document !== 'undefined') {
    document.querySelectorAll<HTMLElement>(`[data-edit-path="${CSS.escape(path)}"]`)
      .forEach(el => {
        el.textContent = value
        el.classList.add('v-editable--changed')
        el.setAttribute('data-admin-changed', 'true')
      })
  }
}

/** Add a new item to an array with instant reactive DOM feedback */
export function addArrayItem(arrayPath: string, atIndex: number, lang: LangCode, targetSlug?: string) {
  const currentSlug = targetSlug || adminEditState.slug || 'home'
  if (!lang) lang = adminEditState.language || 'FA'
  const upper = lang.toUpperCase()
  const lower = lang.toLowerCase()

  if (!adminEditState.clientOverrides[currentSlug]) {
    adminEditState.clientOverrides[currentSlug] = {}
  }

  let currentUI = adminEditState.clientOverrides[currentSlug][upper] || adminEditState.clientOverrides[currentSlug][lower]
  if (!currentUI || Object.keys(currentUI).length === 0) {
    const snap = adminEditState.allLangUI[upper] || adminEditState.allLangUI[lower] || {}
    currentUI = deepClone(snap)
  } else {
    currentUI = deepClone(currentUI)
  }

  let targetArr = getByPath(currentUI, arrayPath)
  if (!Array.isArray(targetArr)) {
    targetArr = []
    setByPath(currentUI, arrayPath, targetArr)
  }

  // Create clean placeholder item with proper fields
  let newItem: any = 'آیتم جدید (کلیک برای ویرایش)'
  if (targetArr.length > 0) {
    const templateIndex = atIndex >= 0 ? atIndex : targetArr.length - 1
    const template = targetArr[templateIndex]
    if (typeof template === 'object' && template !== null) {
      newItem = deepClone(template)
      for (const k of Object.keys(newItem)) {
        if (typeof newItem[k] === 'string') {
          if (k.toLowerCase().includes('id') || k.toLowerCase().includes('slug')) {
            newItem[k] = `item-${Date.now().toString(36)}`
          } else if (k.toLowerCase().includes('image') || k.toLowerCase().includes('icon')) {
            // keep template icon or image
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
      title: 'عنوان جدید (ویرایش کنید)',
      desc: 'توضیحات مورد نظر را اینجا وارد کنید',
      question: 'پرسش جدید (برای ویرایش کلیک کنید)',
      answer: 'پاسخ پرسش را در این قسمت وارد نمایید.'
    }
  }

  const insertPos = atIndex >= 0 ? atIndex + 1 : targetArr.length
  targetArr.splice(insertPos, 0, newItem)

  // Save live reactive state
  adminEditState.clientOverrides[currentSlug][upper] = currentUI
  adminEditState.clientOverrides[currentSlug][lower] = currentUI
  adminEditState.allLangUI[upper] = currentUI
  adminEditState.allLangUI[lower] = currentUI
  applySnapshotToBaselines(lang)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('admin:array-changed', {
      detail: { arrayPath, action: 'add', atIndex: insertPos, lang, slug: currentSlug }
    }))
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'success', text: `+ آیتم جدید به «${arrayPath}» افزوده شد` }
    }))
  }
}

/** Remove an item from an array with instant reactive DOM feedback */
export function removeArrayItem(arrayPath: string, atIndex: number, lang: LangCode, targetSlug?: string) {
  const currentSlug = targetSlug || adminEditState.slug || 'home'
  if (!lang) lang = adminEditState.language || 'FA'
  const upper = lang.toUpperCase()
  const lower = lang.toLowerCase()

  if (!adminEditState.clientOverrides[currentSlug]) {
    adminEditState.clientOverrides[currentSlug] = {}
  }

  let currentUI = adminEditState.clientOverrides[currentSlug][upper] || adminEditState.clientOverrides[currentSlug][lower]
  if (!currentUI || Object.keys(currentUI).length === 0) {
    const snap = adminEditState.allLangUI[upper] || adminEditState.allLangUI[lower] || {}
    currentUI = deepClone(snap)
  } else {
    currentUI = deepClone(currentUI)
  }

  const arr = getByPath(currentUI, arrayPath)
  if (!Array.isArray(arr) || arr.length <= 1) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'warning', text: 'امکان حذف آخرین آیتم باقی‌مانده وجود ندارد' }
      }))
    }
    return
  }

  arr.splice(atIndex, 1)

  // Save live reactive state
  adminEditState.clientOverrides[currentSlug][upper] = currentUI
  adminEditState.clientOverrides[currentSlug][lower] = currentUI
  adminEditState.allLangUI[upper] = currentUI
  adminEditState.allLangUI[lower] = currentUI
  applySnapshotToBaselines(lang)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('admin:array-changed', {
      detail: { arrayPath, action: 'remove', atIndex, lang, slug: currentSlug }
    }))
    window.dispatchEvent(new CustomEvent('toast', {
      detail: { type: 'info', text: `- آیتم از «${arrayPath}» حذف شد` }
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
      list.push({
        path,
        lang,
        original: rec.original ?? '',
        current: rec.draft ?? rec.value ?? '',
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

export function selectMediaElement(el: HTMLElement | null, path: string | null = null) {
  if (typeof document !== 'undefined') {
    // Remove previous selection classes
    document.querySelectorAll('.v-media-selected, [data-media-selected="true"]').forEach(node => {
      node.classList.remove('v-media-selected')
      node.removeAttribute('data-media-selected')
    })

    if (el) {
      el.classList.add('v-media-selected')
      el.setAttribute('data-media-selected', 'true')
    }
  }

  adminEditState.selectedMediaElement = el
  adminEditState.selectedMediaPath = path
}

export function clearMediaSelection() {
  selectMediaElement(null, null)
}