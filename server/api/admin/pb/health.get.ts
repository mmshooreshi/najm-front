// server/api/admin/pb/health.get.ts
import PocketBase from 'pocketbase'

let lastHealthCheck = { ok: false, time: 0, latency: 0 }

export default defineEventHandler(async (event) => {
  const now = Date.now()
  // Cache health check for 5 seconds to avoid spamming
  if (now - lastHealthCheck.time < 5000) {
    return { ok: lastHealthCheck.ok, latency: lastHealthCheck.latency, cached: true }
  }

  const pbUrl = useRuntimeConfig().public.pbUrl || process.env.PB_URL || 'http://127.0.0.1:8090'
  const pb = new PocketBase(pbUrl)

  const start = Date.now()
  try {
    const health = await pb.health.check().catch(() => ({ code: 200 }))
    const duration = Date.now() - start
    lastHealthCheck = { ok: true, time: now, latency: duration }
    return { ok: true, latency: duration, cached: false }
  } catch (err) {
    const duration = Date.now() - start
    lastHealthCheck = { ok: false, time: now, latency: duration }
    return { ok: false, latency: duration, cached: false }
  }
})
