// server/api/admin/ui/rollback.post.ts
import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import {
  writeLocalContent,
  syncContentToPocketBase,
  purgeServerPageCache,
  warmupServerPageCache
} from '~/server/utils/contentStore'
import { getVersionById, recordVersion } from '~/server/utils/versionStore'

export default defineEventHandler(async (event) => {
  const { slug, versionId } = await readBody<{ slug: string; versionId: string }>(event)

  if (!slug || !versionId) {
    throw createError({ statusCode: 400, statusMessage: 'slug and versionId are required' })
  }

  // Auth: check cookie or dev environment
  const token = getCookie(event, 'pb_admin')
  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
  if (!token && !isDev) {
    throw createError({ statusCode: 401, statusMessage: 'not authenticated' })
  }

  const version = getVersionById(slug, versionId)
  if (!version || !version.snapshot) {
    throw createError({ statusCode: 404, statusMessage: 'Version snapshot not found' })
  }

  const restoredUi = JSON.parse(JSON.stringify(version.snapshot))

  try {
    // 1. Write to local content store
    writeLocalContent(slug, restoredUi)

    // 2. Persist to PocketBase
    await syncContentToPocketBase(slug, restoredUi)

    // 3. Purge cache
    await purgeServerPageCache(slug)
    warmupServerPageCache(slug)

    // 4. Record the rollback as an audit trail entry
    recordVersion(
      slug,
      version.language || 'fa',
      `بازنشانی به نسخه شماره ${version.versionNumber}`,
      [{ path: '*', before: 'previous', after: `restored v${version.versionNumber}` }],
      restoredUi
    )

    return {
      ok: true,
      slug,
      versionNumber: version.versionNumber,
      restoredAt: new Date().toISOString(),
      uiData: restoredUi
    }
  } catch (err: any) {
    console.error(`[Rollback] Failed to rollback ${slug} to version ${versionId}:`, err)
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || 'Rollback failed'
    })
  }
})
