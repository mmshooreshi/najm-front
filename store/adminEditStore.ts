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

export interface AdminEditState {
  canEdit: boolean
  editMode: boolean
  slug: string
  language: LangCode
  changes: ChangeMap
  allLangUI: Record<LangCode, Record<string, any>> // full UI snapshots per lang
  versions: VersionsMap // path -> lang -> versions
  lastSavedAt: string | null
  saving: boolean
  lastError: string | null
  inspectorOpen: boolean
  historyOpen: boolean
  paletteOpen: boolean
  minimized: boolean
  autosaveEnabled: boolean
}

export const adminEditState = reactive<AdminEditState>({
  canEdit: false,
  editMode: false,
  slug: '',
  language: '',
  changes: {},
  allLangUI: {},
  versions: {},
  lastSavedAt: null,
  saving: false,
  lastError: null,
  inspectorOpen: false,
  historyOpen: false,
  paletteOpen: false,
  minimized: false,
  autosaveEnabled: false
})

/** ---------- String Normalization Helpers ---------- **/
export function normalize(s: any): string {
  return String(s ?? '')
    .replace(/\u00A0/g, ' ')               // NBSP → space
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width spaces
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
  const nVal = normalize(value)
  const nowIso = new Date().toISOString()
  const nowMs = Date.parse(nowIso)

  // Throttle drafts: update inside a 30s window if consecutive draft
  if (type === 'draft' && last && last.type === 'draft' && (nowMs - Date.parse(last.date)) < 30_000) {
    last.value = value
    last.date = nowIso
    return
  }

  if (!last || normalize(last.value) !== nVal || last.type !== type) {
    list.push({ type, value, date: nowIso })
  }
}

export function getVersions(path: PathKey, lang: LangCode): VersionEntry[] {
  return adminEditState.versions[path]?.[lang] ?? []
}

/**
 * Apply snapshot to baselines for a language without touching modified fields.
 */
export function applySnapshotToBaselines(lang: LangCode) {
  const snap = adminEditState.allLangUI[lang]
  if (!snap) return

  function walk(obj: any, prefix = '') {
    if (!obj || typeof obj !== 'object') return
    for (const [k, v] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${k}` : k
      if (v !== null && typeof v === 'object') {
        walk(v, fullPath)
      } else {
        const text = String(v ?? '')
        if (!adminEditState.changes[fullPath]) adminEditState.changes[fullPath] = {}
        const rec = adminEditState.changes[fullPath][lang]

        if (!rec) {
          adminEditState.changes[fullPath][lang] = { original: text, value: text }
          addVersion(fullPath, lang, text, 'original')
        } else if (!isChanged(fullPath, lang)) {
          rec.original = text
          rec.value = text
        }
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
    if (rec) {
      const finalVal = rec.draft ?? rec.value
      addVersion(path, lang, finalVal, 'saved')
      rec.original = finalVal
      rec.value = finalVal
      rec.draft = undefined
    }
  }
  if (process.dev) {
    logger.success('Admin:Sync', `Committed and baseline-recorded ${paths.length} saved fields for [${lang.toUpperCase()}]`)
  }
}

/** Revert a single path back to its original baseline */
export function revertPath(path: PathKey, lang: LangCode) {
  const rec = adminEditState.changes[path]?.[lang]
  if (!rec) return

  rec.draft = undefined
  rec.value = rec.original

  // Update DOM element directly
  if (typeof document !== 'undefined') {
    document.querySelectorAll<HTMLElement>(`[data-edit-path="${CSS.escape(path)}"]`)
      .forEach(el => {
        el.textContent = rec.original ?? ''
        el.classList.remove('v-editable--changed')
        el.removeAttribute('data-admin-changed')
      })
  }

  addVersion(path, lang, rec.original, 'draft')
  if (process.dev) {
    logger.info('Admin:Edit', `Reverted "${path}" [${lang.toUpperCase()}] back to baseline: "${rec.original}"`)
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

export function changedCountForLang(lang: LangCode): number {
  let count = 0
  for (const p of Object.keys(adminEditState.changes)) {
    if (isChanged(p, lang)) count++
  }
  return count
}