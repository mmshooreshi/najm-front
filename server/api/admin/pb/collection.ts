// server/api/admin/pb/collection.ts
import PocketBase from 'pocketbase'
import {
  getCookie,
  getQuery,
  readBody,
  createError,
  H3Event
} from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const { name, id, page = 1, per = 25 } = getQuery(event) as Record<string, any>
  if (!name) throw createError({ statusCode: 400, statusMessage: 'name param required' })

  const token = getCookie(event, 'pb_admin')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'not logged in' })

  const pb = new PocketBase(useRuntimeConfig().public.pbUrl)
  pb.authStore.save(token, null)

  try {
    /* ── sanity-check the collection first ── */
    try {
      await pb.collections.getOne(name)
    } catch {
      throw createError({ statusCode: 404, statusMessage: `collection '${name}' not found` })
    }

    switch (event.method) {
      case 'GET': {
        console.log('[PB] GET list', { name, page: +page, per: +per, sort: '-created' })
        try {
          return await pb.collection(name).getList(+page, +per, { sort: '-created' })
        } catch (e) {
          console.warn('sort by -created failed, retrying without sort')
          return await pb.collection(name).getList(+page, +per)
        }
      }

      /* ── CREATE ─────────────────────────────────────────────────── */
      case 'POST': {
        const body = await readBody(event)
        console.log('[pb/collection] create body =', body)
        return await pb.collection(name).create(body)
      }

      /* ── UPDATE ─────────────────────────────────────────────────── */
      case 'PATCH': {
        if (!id) throw createError({ statusCode: 400, statusMessage: 'id param required' })
        const body = await readBody(event)
        console.log('[pb/collection] update id=%s body=', id, body)
        return await pb.collection(name).update(id as string, body)
      }

      /* ── DELETE ─────────────────────────────────────────────────── */
      case 'DELETE': {
        if (!id) throw createError({ statusCode: 400, statusMessage: 'id param required' })
        console.log('[pb/collection] delete id=%s', id)
        return await pb.collection(name).delete(id as string)
      }


      default:
        throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
    }
  } catch (err: any) {
    console.error('[PB route] final error →', err)
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: err?.data?.message || err?.message || 'PB request failed'
    })
  }
})
