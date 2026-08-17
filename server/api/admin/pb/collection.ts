// server/api/admin/pb/collection.ts
import PocketBase from 'pocketbase'
import {
  getCookie,
  getQuery,
  readBody,
  createError,
  H3Event
} from 'h3'

const collectionCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL_MS = 15000 // 15 seconds cache for GET requests

export default defineEventHandler(async (event: H3Event) => {
  const { name, id, page = 1, per = 25 } = getQuery(event) as Record<string, any>
  if (!name) throw createError({ statusCode: 400, statusMessage: 'name param required' })

  const token = getCookie(event, 'pb_admin')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'not logged in' })

  const pbUrl = useRuntimeConfig().public.pbUrl || process.env.PB_URL || 'http://65.108.80.205:8090'
  const pb = new PocketBase(pbUrl)
  pb.authStore.save(token, null)

  const cacheKey = `${name}:${page}:${per}`

  try {
    switch (event.method) {
      case 'GET': {
        const now = Date.now()
        const cached = collectionCache.get(cacheKey)
        if (cached && now - cached.timestamp < CACHE_TTL_MS) {
          return cached.data
        }

        try {
          const data = await pb.collection(name).getList(+page, +per, { sort: '-created' })
          collectionCache.set(cacheKey, { data, timestamp: now })
          return data
        } catch (e) {
          const data = await pb.collection(name).getList(+page, +per)
          collectionCache.set(cacheKey, { data, timestamp: now })
          return data
        }
      }

      /* ── CREATE ── */
      case 'POST': {
        const body = await readBody(event)
        const res = await pb.collection(name).create(body)
        collectionCache.clear() // Invalidate cache on mutations
        return res
      }

      /* ── UPDATE ── */
      case 'PATCH': {
        if (!id) throw createError({ statusCode: 400, statusMessage: 'id param required' })
        const body = await readBody(event)
        const res = await pb.collection(name).update(id as string, body)
        collectionCache.clear() // Invalidate cache on mutations
        return res
      }

      /* ── DELETE ── */
      case 'DELETE': {
        if (!id) throw createError({ statusCode: 400, statusMessage: 'id param required' })
        const res = await pb.collection(name).delete(id as string)
        collectionCache.clear() // Invalidate cache on mutations
        return res
      }

      default:
        throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
    }
  } catch (err: any) {
    console.error('[PB collection API error]', err)
    // Fallback to stale cache if present on GET failure
    if (event.method === 'GET' && collectionCache.has(cacheKey)) {
      return collectionCache.get(cacheKey)!.data
    }
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: err?.data?.message || err?.message || 'PB request failed'
    })
  }
})
