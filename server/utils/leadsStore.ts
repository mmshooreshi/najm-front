// server/utils/leadsStore.ts
import fs from 'node:fs'
import path from 'node:path'

const PB_SERVER_URL = 'http://65.108.80.205:8090'
const LEADS_PAGE_ID = 'z2962w7ya816ei0'
const LEADS_FILE_PATH = path.resolve(process.cwd(), '.data', 'leads.json')

// In-memory fallback for serverless environments (Vercel, AWS Lambda)
let inMemoryLeads: any[] = []

function ensureStorageDir() {
  try {
    const dir = path.dirname(LEADS_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    if (!fs.existsSync(LEADS_FILE_PATH)) {
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify([]), 'utf-8')
    }
  } catch (err) {}
}

export function readLocalLeads(): any[] {
  try {
    ensureStorageDir()
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const raw = fs.readFileSync(LEADS_FILE_PATH, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        inMemoryLeads = parsed
        return parsed
      }
    }
  } catch (err) {}
  return inMemoryLeads
}

export function writeLocalLeads(leads: any[]) {
  inMemoryLeads = leads
  try {
    ensureStorageDir()
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8')
  } catch (err) {}
}

/** Fetch all leads from remote PocketBase with local fallback */
export async function getAllLeads(): Promise<any[]> {
  try {
    const res: any = await $fetch(`${PB_SERVER_URL}/api/collections/pages/records/${LEADS_PAGE_ID}`, {
      timeout: 4000
    }).catch(() => null)

    if (res && res.uiData) {
      let parsed: any = res.uiData
      if (typeof parsed === 'string') {
        try {
          parsed = JSON.parse(parsed)
        } catch {
          parsed = []
        }
      }
      if (Array.isArray(parsed)) {
        inMemoryLeads = parsed
        writeLocalLeads(parsed)
        return parsed
      }
    }
  } catch (err) {}

  return readLocalLeads()
}

/** Save full leads array to remote PocketBase */
async function syncLeadsToPB(leads: any[]): Promise<boolean> {
  try {
    await $fetch(`${PB_SERVER_URL}/api/collections/pages/records/${LEADS_PAGE_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: {
        uiData: leads
      },
      timeout: 4000
    })
    return true
  } catch (err) {
    return false
  }
}

export async function createLead(lead: any): Promise<any> {
  // Always fetch latest leads first to prevent overwriting
  let leads = await getAllLeads()
  if (!Array.isArray(leads)) leads = []

  const newLead = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ...lead,
    status: lead.status || 'new',
    created: new Date().toLocaleDateString('fa-IR'),
    timestamp: Date.now()
  }

  // Prepend to top
  leads.unshift(newLead)
  writeLocalLeads(leads)

  // Save to PocketBase
  await syncLeadsToPB(leads)

  return newLead
}

export async function updateLeadStatus(id: string, patch: any): Promise<boolean> {
  const leads = await getAllLeads()
  const idx = leads.findIndex(l => l.id === id)
  if (idx !== -1) {
    leads[idx] = { ...leads[idx], ...patch }
    writeLocalLeads(leads)
    await syncLeadsToPB(leads)
    return true
  }
  return false
}

export async function removeLead(id: string): Promise<boolean> {
  const leads = await getAllLeads()
  const updated = leads.filter(l => l.id !== id)
  writeLocalLeads(updated)
  await syncLeadsToPB(updated)
  return true
}
