// server/api/analytics/exclude-device.post.ts
import { defineEventHandler, readBody, getCookie, getHeader, createError } from 'h3'
import { addExcludedFingerprint, removeExcludedFingerprint, getExcludedFingerprints } from '../../utils/telemetryDb.ts'

export default defineEventHandler(async (event) => {
  const token =
    getCookie(event, 'pb_admin') ||
    getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Admin authentication required'
    })
  }

  const body = await readBody(event) || {}
  const { action, fingerprint } = body

  if (!fingerprint || typeof fingerprint !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: fingerprint string is required'
    })
  }

  if (action === 'exclude') {
    addExcludedFingerprint(fingerprint)
  } else if (action === 'include') {
    removeExcludedFingerprint(fingerprint)
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: action must be "exclude" or "include"'
    })
  }

  return {
    success: true,
    action,
    fingerprint,
    excluded_fingerprints: getExcludedFingerprints()
  }
})
