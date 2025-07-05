// server/api/admin/login.post.ts
import PocketBase from 'pocketbase'
import { readBody, setCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'email & password required' })
  }

  try {
    const pb = new PocketBase(useRuntimeConfig().public.pbUrl)
    const { token } = await pb.admins.authWithPassword(email, password)

    setCookie(event, 'pb_admin', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 48,
      path: '/',
    })

    return { ok: true }
  } catch (err: any) {
    // forward PocketBase message & status
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: err?.data?.message || 'authentication failed',
    })
  }
})
