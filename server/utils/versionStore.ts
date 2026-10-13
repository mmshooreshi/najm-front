// server/utils/versionStore.ts
import fs from 'node:fs'
import path from 'node:path'

export interface ChangeEntry {
  path: string
  before?: any
  after?: any
}

export interface VersionSnapshot {
  id: string
  versionNumber: number
  timestamp: string
  slug: string
  language: string
  note: string
  changesCount: number
  changes: ChangeEntry[]
  snapshot: Record<string, any>
}

export interface VersionSummary {
  id: string
  versionNumber: number
  timestamp: string
  slug: string
  language: string
  note: string
  changesCount: number
  changes: ChangeEntry[]
}

const VERSIONS_DIR = path.resolve(process.cwd(), '.data', 'versions')

function ensureDir() {
  try {
    if (!fs.existsSync(VERSIONS_DIR)) {
      fs.mkdirSync(VERSIONS_DIR, { recursive: true })
    }
  } catch {}
}

function getVersionsFilePath(slug: string): string {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, '_') || 'home'
  return path.join(VERSIONS_DIR, `${safe}.json`)
}

export function readVersions(slug: string): VersionSnapshot[] {
  try {
    ensureDir()
    const filePath = getVersionsFilePath(slug)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.warn(`[VersionStore] Failed to read versions for "${slug}":`, err)
  }
  return []
}

export function writeVersions(slug: string, list: VersionSnapshot[]): void {
  try {
    ensureDir()
    const filePath = getVersionsFilePath(slug)
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8')
  } catch (err) {
    console.error(`[VersionStore] Failed to write versions for "${slug}":`, err)
  }
}

/**
 * Record a new version before or after a draft save.
 * Keeps up to 50 versions per page slug.
 */
export function recordVersion(
  slug: string,
  language: string,
  note: string,
  changes: ChangeEntry[],
  fullSnapshot: Record<string, any>
): VersionSnapshot {
  const versions = readVersions(slug)
  const nextVerNum = versions.length > 0 ? (versions[0].versionNumber || versions.length) + 1 : 1
  const id = `ver_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`

  const newVersion: VersionSnapshot = {
    id,
    versionNumber: nextVerNum,
    timestamp: new Date().toISOString(),
    slug,
    language: (language || 'fa').toLowerCase(),
    note: note || `تغییر ${changes.length} فیلد`,
    changesCount: changes.length,
    changes,
    snapshot: JSON.parse(JSON.stringify(fullSnapshot))
  }

  // Prepend newest first
  versions.unshift(newVersion)

  // Cap at 50 versions
  if (versions.length > 50) {
    versions.pop()
  }

  writeVersions(slug, versions)
  return newVersion
}

/**
 * Get all versions summaries for a slug and optional language (excluding heavy full snapshot)
 */
export function getVersionSummaries(slug: string, language?: string): VersionSummary[] {
  const versions = readVersions(slug)
  const langLower = language ? language.toLowerCase() : null

  return versions
    .filter(v => !langLower || v.language === langLower)
    .map(v => ({
      id: v.id,
      versionNumber: v.versionNumber,
      timestamp: v.timestamp,
      slug: v.slug,
      language: v.language,
      note: v.note,
      changesCount: v.changesCount,
      changes: v.changes
    }))
}

/**
 * Get single version by ID
 */
export function getVersionById(slug: string, versionId: string): VersionSnapshot | null {
  const versions = readVersions(slug)
  return versions.find(v => v.id === versionId) || null
}
