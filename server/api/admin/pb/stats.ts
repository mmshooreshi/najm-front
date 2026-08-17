// server/api/admin/pb/stats.ts
import PocketBase from 'pocketbase'
import { getCookie, createError } from 'h3'

let cachedStats: { data: { name: string; count: number }[]; timestamp: number } | null = null
const CACHE_TTL_MS = 30000 // 30 seconds cache

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'pb_admin')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'not logged in' })

  const now = Date.now()
  // Return cached result if fresh
  if (cachedStats && now - cachedStats.timestamp < CACHE_TTL_MS) {
    return cachedStats.data
  }

  const pbUrl = useRuntimeConfig().public.pbUrl || process.env.PB_URL || 'http://127.0.0.1:8090'
  const pb = new PocketBase(pbUrl)
  pb.authStore.save(token, null)

  try {
    const cols = await pb.collections.getFullList()
    const stats = await Promise.all(
      cols.map(async (c) => {
        try {
          const res = await pb.collection(c.name).getList(1, 1)
          return { name: c.name, count: res.totalItems }
        } catch {
          return { name: c.name, count: 0 }
        }
      })
    )

    cachedStats = { data: stats, timestamp: now }
    return stats
  } catch (err: any) {
    if (cachedStats) return cachedStats.data // Fallback to stale cache if PocketBase errors
    throw createError({ statusCode: err?.status || 500, statusMessage: 'Failed to fetch collection stats' })
  }
})

