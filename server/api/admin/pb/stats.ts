// server/api/admin/pb/stats.ts
import PocketBase from 'pocketbase'
import { getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'pb_admin')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'not logged in' })

  const pb = new PocketBase(useRuntimeConfig().public.pbUrl)
  pb.authStore.save(token, null)

  const cols = await pb.collections.getFullList()
  const stats = await Promise.all(
    cols.map(async (c) => ({
      name: c.name,
      count: (await pb.collection(c.name).getList(1, 1)).totalItems
    }))
  )
  return stats
})
