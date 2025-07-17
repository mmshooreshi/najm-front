// server/api/admin/login.post.ts
import PocketBase from 'pocketbase'
import { readBody, setCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'email & password required' })
  }

  try {
    // 1) Authenticate against your superusers collection
    const pb = new PocketBase(useRuntimeConfig().public.pbUrl)
    const { token } = await pb
      .collection('_superusers')
      .authWithPassword(email, password)

    // 2) Store it in an httpOnly cookie
    // setCookie(event, 'pb_admin', token, {
    //   httpOnly: true,
    //   // secure: false,
    //   sameSite: 'lax',
    //   maxAge: 60 * 60 * 48,
    //   path: '/',
    // })

    // for dev:
    setCookie(event, 'pb_admin', token, {
      httpOnly: false,      // so you can inspect in dev
      secure: false,        // localhost isn’t HTTPS
      sameSite: 'lax',      // or 'none' if you need cross-site
      domain: 'localhost',  // explicitly allow on your host
      path: '/',
      maxAge: 60 * 60 * 48,
    })


    return { ok: true }
  } catch (err: any) {
    throw createError({
      statusCode: err?.status || 500,
      statusMessage: err?.data?.message || 'authentication failed',
    })
  }
})
