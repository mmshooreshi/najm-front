// server/middleware/animated-webp-bypass.ts
import { defineEventHandler, sendRedirect } from 'h3'

export default defineEventHandler((event) => {
  const rawUrl = event.node.req.url || ''

  // If any request routes through /_ipx/ for animated webp files in /videos/ or /videosOriginal/
  if (rawUrl.startsWith('/_ipx/') && (rawUrl.includes('/videos/') || rawUrl.includes('/videosOriginal/'))) {
    const match = rawUrl.match(/\/(videos(?:Original)?\/[^?#]+)/)
    if (match && match[1]) {
      // Immediately redirect to the raw static asset so Sharp/IPX never flattens animation frames
      return sendRedirect(event, `/${match[1]}`, 302)
    }
  }
})
