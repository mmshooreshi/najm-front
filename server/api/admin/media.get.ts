// server/api/admin/media.get.ts
import { defineEventHandler, getQuery } from 'h3'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = query.page || 1
  const perPage = query.perPage || 100
  const search = query.search ? String(query.search) : ''

  try {
    const res: any = await $fetch(`${PB_SERVER_URL}/api/collections/media_files/records`, {
      headers: {
        Authorization: PB_SUPERUSER_TOKEN
      },
      params: {
        page,
        perPage,
        sort: '-created'
      }
    })

    const items = (res?.items || []).map((m: any) => ({
      id: m.id,
      filename: m.filename || m.file || 'media-asset',
      file: m.file,
      format: m.format || 'avif',
      mime: m.mime || 'image/avif',
      width: m.width || 4000,
      height: m.height || 4000,
      url: `${PB_SERVER_URL}/api/files/media_files/${m.id}/${m.file}`,
      path: m.path || '',
      created: m.created
    }))

    return {
      success: true,
      items,
      totalItems: res?.totalItems || items.length,
      page: res?.page || 1,
      totalPages: res?.totalPages || 1
    }
  } catch (error: any) {
    return {
      success: false,
      items: [],
      error: error.message
    }
  }
})
