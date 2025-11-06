// server/api/admin/ui/save-draft.post.ts
import PocketBase from 'pocketbase'
import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

type Change = { path: string; value: any }

function setByPath(root: any, path: string, value: any) {
  const segs = path.split('.').filter(Boolean)
  let obj = root
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i]
    const isIndex = /^\d+$/.test(seg)
    const last = i === segs.length - 1

    if (isIndex) {
      const idx = Number(seg)
      if (!Array.isArray(obj)) obj = []
      if (last) {
        obj[idx] = value
      } else {
        if (obj[idx] == null) {
          const nextIsIndex = /^\d+$/.test(segs[i + 1])
          obj[idx] = nextIsIndex ? [] : {}
        }
        obj = obj[idx]
      }
    } else {
      if (last) {
        obj[seg] = value
      } else {
        const nextIsIndex = /^\d+$/.test(segs[i + 1])
        if (obj[seg] == null) obj[seg] = nextIsIndex ? [] : {}
        obj = obj[seg]
      }
    }
  }
}

export default defineEventHandler(async (event) => {
  const { slug, language, changes, note } = await readBody<{
    slug: string
    language: string
    changes: Change[]
    note?: string
  }>(event)

  if (!slug || !language || !Array.isArray(changes)) {
    throw createError({ statusCode: 400, statusMessage: 'slug, language and changes are required' })
  }

  // Auth: read admin token from cookie
  const token = getCookie(event, 'pb_admin')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'not authenticated' })
  }

  const { public: pub } = useRuntimeConfig()
  const pbUrl = (pub?.pbUrl as string) || 'http://127.0.0.1:8090'
  const pb = new PocketBase(pbUrl)

  pb.authStore.save(token, null)
  try { await pb.collection('_superusers').authRefresh() } catch {}

  // Try fetch existing page
  let page: any = null
  try {
    page = await pb.collection('pages').getFirstListItem(`slug="${slug}"`)
  } catch {
    page = null
  }

  let uiData: Record<string, any> = (page?.uiData ?? {})
  const langBlock: Record<string, any> = (uiData[language] ?? {})

  // Apply changes
  for (const { path, value } of changes) {
    if (!path) continue
    setByPath(langBlock, path, value)
  }
  uiData[language] = langBlock

  if (page) {
    // Update existing
    await pb.collection('pages').update(page.id, { uiData })
  } else {
    // Create new
    await pb.collection('pages').create({
      slug,
      title: slug,       // or "" if not needed
      layoutType: 'custom', // required field
      uiData,
    })
  }

  return { ok: true, saved: changes.length, slug, language }
})
