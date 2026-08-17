// composables/useMediaCache.ts
import { ref, computed } from 'vue'

export type SyncState = 'idle' | 'syncing' | 'synced' | 'cached' | 'error'

export interface MediaFolder {
  id: string
  name: string
  path: string
  created?: string
  updated?: string
}

export interface MediaFile {
  id: string
  filename: string
  file: string
  path: string
  size?: number
  mime?: string
  created: string
  updated: string
  [key: string]: any
}

const CACHE_KEYS = {
  FOLDERS: 'najm_media_folders_v2',
  FILES: 'najm_media_files_v2',
  RECENT_FOLDERS: 'najm_media_recent_folders',
  LAST_SYNC: 'najm_media_last_sync'
}

export function useMediaCache() {
  const syncState = ref<SyncState>('idle')
  const lastSyncTime = ref<string>('')
  const recentFolders = ref<string[]>([])

  function loadRecentFolders(): string[] {
    if (!import.meta.client) return []
    try {
      const stored = localStorage.getItem(CACHE_KEYS.RECENT_FOLDERS)
      recentFolders.value = stored ? JSON.parse(stored) : []
      return recentFolders.value
    } catch {
      return []
    }
  }

  function addRecentFolder(path: string) {
    if (!import.meta.client) return
    const clean = path.trim()
    const filtered = recentFolders.value.filter(p => p !== clean)
    filtered.unshift(clean)
    recentFolders.value = filtered.slice(0, 6) // keep top 6
    localStorage.setItem(CACHE_KEYS.RECENT_FOLDERS, JSON.stringify(recentFolders.value))
  }

  function getCachedFolders(): MediaFolder[] {
    if (!import.meta.client) return []
    try {
      const fc = localStorage.getItem(CACHE_KEYS.FOLDERS)
      return fc ? JSON.parse(fc) : []
    } catch {
      return []
    }
  }

  function getCachedFiles(): MediaFile[] {
    if (!import.meta.client) return []
    try {
      const ff = localStorage.getItem(CACHE_KEYS.FILES)
      return ff ? JSON.parse(ff) : []
    } catch {
      return []
    }
  }

  function saveCache(folders: MediaFolder[], files: MediaFile[]) {
    if (!import.meta.client) return
    try {
      localStorage.setItem(CACHE_KEYS.FOLDERS, JSON.stringify(folders))
      localStorage.setItem(CACHE_KEYS.FILES, JSON.stringify(files))
      const timeStr = new Date().toLocaleTimeString('fa-IR')
      lastSyncTime.value = timeStr
      localStorage.setItem(CACHE_KEYS.LAST_SYNC, timeStr)
      syncState.value = 'synced'
    } catch (e) {
      console.warn('Cache write limit reached or failed', e)
    }
  }

  return {
    syncState,
    lastSyncTime,
    recentFolders,
    loadRecentFolders,
    addRecentFolder,
    getCachedFolders,
    getCachedFiles,
    saveCache
  }
}
