// server/routes/api/pb/[...path].ts
import { defineEventHandler, proxyRequest, getRequestURL } from 'h3'

const PB_SERVER_URL = 'http://65.108.80.205:8090'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const targetPath = url.pathname.replace(/^\/api\/pb/, '') || '/'
  const targetUrl = `${PB_SERVER_URL}${targetPath}${url.search}`

  return proxyRequest(event, targetUrl)
})
