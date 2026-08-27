// server/api/admin/requests/index.get.ts
import { defineEventHandler } from 'h3'
import { getAllLeads } from '~/server/utils/leadsStore'

export default defineEventHandler(async () => {
  const items = await getAllLeads()

  return {
    success: true,
    items,
    total: items.length
  }
})
