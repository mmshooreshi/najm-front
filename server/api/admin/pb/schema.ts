// server/api/admin/pb/schema.ts
import PocketBase from 'pocketbase'
import {
  getCookie,
  getQuery,
  createError,
  H3Event
} from 'h3'

/**
 * GET /api/admin/pb/schema?name=<collectionName>
 * ------------------------------------------------
 * Response shape: PocketBase CollectionModel
 * {
 *   id:            string,
 *   name:          string,
 *   type:          'base' | 'auth' | 'view',
 *   system:        boolean,
 *   schema:        Array<{ id, name, type, required, ... }>,
 *   listRule:      string | null,
 *   viewRule:      string | null,
 *   createRule:    string | null,
 *   updateRule:    string | null,
 *   deleteRule:    string | null,
 *   options:       Record<string, any>,
 *   created:       string,
 *   updated:       string
 * }
 */
export default defineEventHandler(async (event: H3Event) => {
  /* --- 1. query param --------------------------------------------------- */
  const name = (getQuery(event).name || '').toString()
  if (!name)
    throw createError({ statusCode: 400, statusMessage: 'name param required' })

  /* --- 2. authenticate from httpOnly admin cookie ----------------------- */
  const token = getCookie(event, 'pb_admin')
  if (!token)
    throw createError({ statusCode: 401, statusMessage: 'not logged in' })

  const pb = new PocketBase(useRuntimeConfig().public.pbUrl)
  pb.authStore.save(token, null)

  /* --- 3. fetch & return the collection model --------------------------- */
  try {
    const collectionModel = await pb.collections.getOne(name)
    return collectionModel
  } catch (err: any) {
    // PocketBase gives 404 if collection doesn’t exist
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: err?.data?.message || err?.message || 'schema fetch failed'
    })
  }
})
