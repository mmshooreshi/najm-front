// server/api/admin/login.post.ts
import PocketBase from 'pocketbase'
import { readBody, setCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'ایمیل و گذرواژه را وارد کنید.' })
  }

  const pbUrl = useRuntimeConfig().public.pbUrl || process.env.PB_URL || 'http://127.0.0.1:8090'
  const pb = new PocketBase(pbUrl)

  let token = ''
  try {
    // 1) Try PocketBase v0.23+ _superusers collection
    const res = await pb.collection('_superusers').authWithPassword(email, password)
    token = res.token
  } catch (err1: any) {
    try {
      // 2) Fallback to legacy PocketBase admins API
      const res = await pb.admins.authWithPassword(email, password)
      token = res.token
    } catch (err2: any) {
      console.error('[Admin Login Failed]', {
        pbUrl,
        email,
        superusersError: err1?.message || err1,
        adminsError: err2?.message || err2
      })

      const status = err1?.status || err2?.status || 401
      const msg = err1?.data?.message || err2?.data?.message || err1?.message || err2?.message || 'ایمیل یا گذرواژه اشتباه است یا به دیتابیس متصل نشد.'
      
      throw createError({
        statusCode: status,
        statusMessage: msg,
        data: { message: msg }
      })
    }
  }

  // Store in cookie
  setCookie(event, 'pb_admin', token, {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 48,
  })

  return { ok: true }
})

