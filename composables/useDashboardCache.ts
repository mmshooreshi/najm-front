// composables/useDashboardCache.ts
import { useState } from '#app'

export function useDashboardState<T>(key: string, init: () => T) {
  return useState<T>(`admin-cache-${key}`, init)
}
