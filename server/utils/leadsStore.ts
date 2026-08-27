// server/utils/leadsStore.ts
import fs from 'node:fs'
import path from 'node:path'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'

const LEADS_FILE_PATH = path.resolve(process.cwd(), '.data', 'leads.json')

function ensureStorageDir() {
  const dir = path.dirname(LEADS_FILE_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(LEADS_FILE_PATH)) {
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify([]), 'utf-8')
  }
}

export function readLocalLeads(): any[] {
  ensureStorageDir()
  try {
    const raw = fs.readFileSync(LEADS_FILE_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeLocalLeads(leads: any[]) {
  ensureStorageDir()
  try {
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8')
  } catch (err) {}
}

export async function getAllLeads(): Promise<any[]> {
  const localLeads = readLocalLeads()

  // Try PocketBase
  try {
    const res: any = await $fetch(`${PB_SERVER_URL}/api/collections/messages/records`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
      query: { perPage: 200, sort: '-created' },
      timeout: 3000
    }).catch(() => null)

    if (res?.items && Array.isArray(res.items)) {
      const pbLeads = res.items.map((m: any) => ({
        id: m.id,
        name: m.name || 'کاربر سایت',
        phone: m.phone || '',
        company: m.company || '',
        category: m.category || 'هاردباکس لوکس',
        quantity: typeof m.quantity === 'object' ? `${m.quantity.min || 1000} عدد` : (m.quantity || '۱,۰۰۰ عدد'),
        timeSlot: m.timeSlot || 'صبح (۹:۰۰ الی ۱۲:۰۰)',
        mockupRequested: Boolean(m.mockupRequested),
        description: m.description || '',
        status: m.status || 'new',
        sourcePage: m.sourcePage || '/',
        referer: m.referer || 'ورود مستقیم',
        device: m.device || 'Mobile',
        timeOnSite: m.timeOnSite || '۱ دقیقه',
        journey: m.journey || 'صفحه اصلی',
        productContext: m.productContext || m.category || '',
        created: m.created ? new Date(m.created).toLocaleDateString('fa-IR') : 'امروز',
        source: 'pocketbase'
      }))

      // Merge PB leads with local leads
      const seenIds = new Set(pbLeads.map((l: any) => l.id))
      const combined = [...pbLeads]
      for (const loc of localLeads) {
        if (!seenIds.has(loc.id)) {
          seenIds.add(loc.id)
          combined.push(loc)
        }
      }
      return combined
    }
  } catch (err) {}

  return localLeads
}

export async function createLead(lead: any): Promise<any> {
  const localLeads = readLocalLeads()
  const newLead = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ...lead,
    status: lead.status || 'new',
    created: new Date().toLocaleDateString('fa-IR'),
    timestamp: Date.now()
  }

  // Save to local
  localLeads.unshift(newLead)
  writeLocalLeads(localLeads)

  // Try PocketBase in background
  try {
    await $fetch(`${PB_SERVER_URL}/api/collections/messages/records`, {
      method: 'POST',
      headers: {
        Authorization: PB_SUPERUSER_TOKEN,
        'Content-Type': 'application/json'
      },
      body: {
        name: newLead.name,
        phone: newLead.phone,
        company: newLead.company,
        category: newLead.category,
        quantity: newLead.quantity,
        timeSlot: newLead.timeSlot,
        mockupRequested: newLead.mockupRequested,
        description: newLead.description,
        status: newLead.status,
        sourcePage: newLead.sourcePage,
        referer: newLead.referer,
        device: newLead.device,
        timeOnSite: newLead.timeOnSite,
        journey: newLead.journey,
        productContext: newLead.productContext
      },
      timeout: 3000
    }).catch(() => null)
  } catch (err) {}

  return newLead
}

export async function updateLeadStatus(id: string, patch: any): Promise<boolean> {
  const localLeads = readLocalLeads()
  const idx = localLeads.findIndex(l => l.id === id)
  if (idx !== -1) {
    localLeads[idx] = { ...localLeads[idx], ...patch }
    writeLocalLeads(localLeads)
  }

  try {
    if (!id.startsWith('req-')) {
      await $fetch(`${PB_SERVER_URL}/api/collections/messages/records/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: PB_SUPERUSER_TOKEN,
          'Content-Type': 'application/json'
        },
        body: patch,
        timeout: 3000
      }).catch(() => null)
    }
  } catch {}

  return true
}

export async function removeLead(id: string): Promise<boolean> {
  const localLeads = readLocalLeads()
  const updated = localLeads.filter(l => l.id !== id)
  writeLocalLeads(updated)

  try {
    if (!id.startsWith('req-')) {
      await $fetch(`${PB_SERVER_URL}/api/collections/messages/records/${id}`, {
        method: 'DELETE',
        headers: { Authorization: PB_SUPERUSER_TOKEN },
        timeout: 3000
      }).catch(() => null)
    }
  } catch {}

  return true
}
