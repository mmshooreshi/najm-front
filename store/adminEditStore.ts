// store/adminEditStore.ts
import { reactive } from 'vue'
import { toLocalizedDigits } from '~/utils/digits'

/** ---------- Types ---------- **/
export type LangCode = string
export type PathKey = string

export interface LangRecord {
  original: string
  value: string
  draft?: string
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

export interface AdminEditState {
  canEdit: boolean
  editMode: boolean
  slug: string
  language: LangCode
  changes: ChangeMap
  allLangUI: Record<LangCode, Record<string, any>> // frozen snapshots per lang
  versions: VersionsMap // path -> lang -> versions
  lastSavedAt: string | null
}

export const adminEditState = reactive<AdminEditState>({
  canEdit: false,
  editMode: false,
  slug: '',
  language: '',
  changes: {},
  allLangUI: {},
  versions: {},
  lastSavedAt: null
})

/** ---------- Utils ---------- **/
/** Debug helpers */
export function logFullState() {
  console.log('[AdminEdit] FULL STATE', JSON.parse(JSON.stringify(adminEditState)))
}

export function logChangedOnly(lang?: LangCode) {
  const out: Record<string, any> = {}
  for (const [path, recs] of Object.entries(adminEditState.changes)) {
    for (const [l, rec] of Object.entries(recs)) {
      if (isChanged(path, l)) {
        if (lang && l !== lang) continue
        out[path] = out[path] || {}
        out[path][l] = { original: rec.original, value: rec.value, draft: rec.draft }
      }
    }
  }
  console.log(`[AdminEdit] CHANGED${lang ? ' [' + lang + ']' : ''}`, out)
}


export function normalize(s: any): string {
  return String(s ?? '')
    .replace(/\u00A0/g, ' ')                 // NBSP → space
    .replace(/[\u200B-\u200D\uFEFF]/g, '‌')   // zero-width
    .replace(/\s+/g, ' ')
    // .trim()
}

export function getText(el: HTMLElement): string {
  return normalize(el.innerText ?? el.textContent ?? '')
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
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

function normValueForCompare(v: any): string {
  return normalize(v)
}
function normOriginalForCompare(orig: any, lang: LangCode): string {
  // Localize original to current language before comparing with DOM value
  return normalize(toLocalizedDigits(orig))
}
function normSnapshotForCompare(snap: any, lang: LangCode): string {
  // Same rule for snapshot text used in baseline sync logic
  return normalize(toLocalizedDigits(snap))
}

/** ---------- Core API ---------- **/
export function setSlug(slug: string) {
  adminEditState.slug = slug
  console.log(`[AdminEdit] slug → ${slug}`)
}

export function syncLanguage(lang: LangCode) {
  if (adminEditState.language !== lang) {
    adminEditState.language = lang
    console.log(`[AdminEdit] language → ${lang}`)
  }
}

/** Freeze & store full-UI snapshot for a language */
export function captureLanguageSnapshot(lang: LangCode, ui: Record<string, any>) {
  if (!ui || Object.keys(ui).length === 0) {
    console.warn(`[AdminEdit] skip snapshot — UI empty for ${lang}`)
    return
  }

  const prev = adminEditState.allLangUI[lang]
  const snap = deepClone(ui)

  // dedupe: if same keys and same values → skip
  if (prev && JSON.stringify(prev) === JSON.stringify(snap)) {
    console.log(`[AdminEdit] snapshot unchanged → ${lang}`)
    return
  }

  adminEditState.allLangUI[lang] = snap
  console.log(`[AdminEdit] snapshot saved → ${lang} (${Object.keys(snap).length} keys)`)
}


/** Versions helpers */
export function addVersion(path: PathKey, lang: LangCode, value: string, type: VersionType) {
  if (!adminEditState.versions[path]) adminEditState.versions[path] = {}
  if (!adminEditState.versions[path][lang]) adminEditState.versions[path][lang] = []
  const list = adminEditState.versions[path][lang]
  const last = list[list.length - 1]
  const nVal = normalize(value)
//   if (!last || normalize(last.value) !== nVal || last.type !== type) {
//     list.push({ type, value, date: new Date().toISOString() })
//   }
  const nowIso = new Date().toISOString()
  const nowMs = Date.parse(nowIso)
  // throttle drafts: keep only the last one inside a 60s window
  if (type === 'draft' && last && last.type === 'draft' && (nowMs - Date.parse(last.date)) < 60_000) {
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
 * Apply snapshot to baselines for a language.
 * - Never overwrite paths that have local edits (drafts).
 * - If untouched → sync baseline & versions.
 * - If empty original but value matches snapshot → promote.
 */
export function applySnapshotToBaselines(lang: LangCode) {
  const snap = adminEditState.allLangUI[lang]
  if (!snap) return
  console.group(`[AdminEdit] applySnapshotToBaselines [${lang}]`)

  for (const [path, raw] of Object.entries(snap)) {
    const text = (typeof raw === 'string' || typeof raw === 'number') ? String(raw) : ''
    if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
    const rec = adminEditState.changes[path][lang]

    const nSnapLoc = normSnapshotForCompare(text, lang)

    if (!rec) {
      // No baseline yet → set fresh
      adminEditState.changes[path][lang] = { original: text, value: text }
      addVersion(path, lang, text, 'original')
      console.log(`+ baseline set → ${path}`)
      continue
    }

    // ⛔ Don’t touch paths with local edits
    if (isChanged(path, lang)) {
      console.log(`~ keep edits → ${path}`)
      continue
    }

    const nVal     = normValueForCompare(rec.value)
    const nOrigLoc = normOriginalForCompare(rec.original, lang)

    if (nVal === nOrigLoc) {
      // No edits → sync snapshot
      if (nOrigLoc !== nSnapLoc) addVersion(path, lang, text, 'original')
      rec.original = text
      rec.value = text
      console.log(`= synced (no edits) → ${path}`)
    } else if (normalize(rec.original) === '' && nVal === nSnapLoc) {
      // Promote when original empty but matches snapshot
      addVersion(path, lang, text, 'original')
      rec.original = text
      rec.value = text
      console.log(`^ promote original → ${path}`)
    }
  }

  console.groupEnd()
}

/** Ensure baseline exists for this path+lang (used by directive on mount) */
export function ensureBaseline(path: PathKey, lang: LangCode, currentElText: string) {
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  const rec = adminEditState.changes[path][lang]
  if (rec && rec.original) return

//   const snapText = getByPath(adminEditState.allLangUI[lang], path)
//   const original =
//     typeof snapText === 'string' || typeof snapText === 'number' ? String(snapText) : ''

//   adminEditState.changes[path][lang] = {
//     original,
//     value: currentElText
//   }
//   if (original) addVersion(path, lang, original, 'original')

  const snapText = getByPath(adminEditState.allLangUI[lang], path)
  const hasSnap = typeof snapText === 'string' || typeof snapText === 'number'
  const original = hasSnap ? String(snapText) : currentElText
  adminEditState.changes[path][lang] = { original, value: currentElText }
  if (hasSnap) addVersion(path, lang, original, 'original')
  
  console.log(`[AdminEdit] baseline set [${lang}] ${path} → orig:"${original}" val:"${currentElText}")`)
}

export function setDraftValue(path: PathKey, lang: LangCode, newValue: string) {
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  if (!adminEditState.changes[path][lang]) {
    adminEditState.changes[path][lang] = { original: '', value: '' }
  }
  adminEditState.changes[path][lang].draft = newValue
  addVersion(path, lang, newValue, 'draft')
}

export function setValueSilently(path: PathKey, lang: LangCode, newValue: string) {
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  if (!adminEditState.changes[path][lang]) {
    adminEditState.changes[path][lang] = { original: '', value: '' }
  }
  const rec = adminEditState.changes[path][lang]
  if (rec.draft != null) return // 🚫 don’t clobber an active draft
  rec.value = newValue
}

function normForCompare(v: any, lang: LangCode): string {
  return normalize(toLocalizedDigits(v)) // convert both sides the same way
}

export function isChanged(path: PathKey, lang: LangCode): boolean {
  const rec = adminEditState.changes[path]?.[lang]
  if (!rec) return false
  const base = normForCompare(rec.original, lang)
  const curr = normForCompare(rec.draft ?? rec.value, lang)
  return curr !== base
}


/** Build save payload for current lang */
export function buildChangesPayload(lang: LangCode): { path: string; value: string }[] {
  const out: { path: string; value: string }[] = []
  for (const [path, rec] of Object.entries(adminEditState.changes)) {
    const lr = rec?.[lang]
    if (!lr) continue
    const candidate = lr.draft ?? lr.value
    if (normalize(candidate) !== normalize(lr.original)) {
      out.push({ path, value: candidate })
    }
  }
  return out
}

/** Record saved versions for a set of paths (after save success) */
export function recordSavedVersions(lang: LangCode, paths: string[]) {
  for (const path of paths) {
    const rec = adminEditState.changes[path]?.[lang]
    if (rec) {
      addVersion(path, lang, rec.draft ?? rec.value, 'saved')
      rec.value = rec.draft ?? rec.value
      rec.draft = undefined
    }
  }
}


export function discardAllChanges(lang: LangCode) {
  for (const [path, recs] of Object.entries(adminEditState.changes)) {
    const rec = recs?.[lang]
    if (!rec) continue
    rec.value = rec.original
    rec.draft = undefined  // 🚀 reset draft so isChanged() becomes false
  }
  console.log(`[AdminEdit] discarded all changes for [${lang}]`)
}


/** ---------- New helpers for History/UX ---------- **/
export function revertPathToOriginal(path: PathKey, lang: LangCode) {
  if (!adminEditState.changes[path]) return
  const rec = adminEditState.changes[path][lang]
  if (!rec) return

  rec.draft = undefined         // 🚫 drop draft
  rec.value = rec.original      // reset to baseline
  addVersion(path, lang, rec.original, 'draft') // optional: log as "revert" draft
  console.log(`[AdminEdit] reverted [${lang}] ${path} → "${rec.original}"`)
}

export function restoreVersion(path: PathKey, lang: LangCode, value: string) {
  if (!adminEditState.changes[path]) adminEditState.changes[path] = {}
  if (!adminEditState.changes[path][lang]) {
    adminEditState.changes[path][lang] = { original: '', value: '' }
  }
  const rec = adminEditState.changes[path][lang]

  rec.draft = value   // 💾 treat as new draft
  addVersion(path, lang, value, 'draft')
  console.log(`[AdminEdit] restored version → [${lang}] ${path} = "${value}"`)
}


export function getAllPaths(): string[] {
  return Object.keys(adminEditState.changes)
}

export function getAllLangs(): string[] {
  const a = new Set<string>(Object.keys(adminEditState.allLangUI))
  for (const rec of Object.values(adminEditState.changes)) {
    Object.keys(rec || {}).forEach(l => a.add(l))
  }
  return Array.from(a)
}

export function changedCountForLang(lang: LangCode): number {
  let n = 0
  for (const p of Object.keys(adminEditState.changes)) {
    if (isChanged(p, lang)) n++
  }
  return n
}