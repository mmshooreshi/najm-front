// server/utils/leadsStore.ts
import fs from 'node:fs'
import path from 'node:path'

const PB_SERVER_URL = process.env.PB_URL || 'http://65.108.80.205:8090'
const PB_SUPERUSER_TOKEN =
  process.env.PB_SUPERUSER_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NzE0NjU0MSwiaWQiOiJha3ZrOTZnNDMyODk4bDEiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.auLVQl1bXPsuGHbXWaqtohXZeI0wYfu-cdp-UBXmV_0'
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

/** Normalize and backfill missing lead properties */
export function normalizeLeads(leads: any[]): any[] {
  if (!Array.isArray(leads)) return []

  return leads.map(l => {
    let createdTime = l.createdTime || ''
    let createdAt = l.createdAt || ''
    let createdDate = l.created || ''

    if (l.timestamp && (!createdTime || !createdAt)) {
      try {
        const d = new Date(l.timestamp)
        if (!createdAt) createdAt = d.toISOString()
        if (!createdTime) {
          createdTime = new Intl.DateTimeFormat('fa-IR', {
            timeZone: 'Asia/Tehran',
            hour: '2-digit',
            minute: '2-digit'
          }).format(d)
        }
        if (!createdDate) {
          createdDate = new Intl.DateTimeFormat('fa-IR', {
            timeZone: 'Asia/Tehran',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(d)
        }
      } catch {}
    }

    return {
      ...l,
      status: l.status || 'new',
      created: createdDate || 'امروز',
      createdAt,
      createdTime,
      callAttempts: typeof l.callAttempts === 'number' ? l.callAttempts : (l.status === 'contacted' ? 1 : (l.status === 'called_no_answer' ? 1 : 0)),
      callHistory: Array.isArray(l.callHistory) ? l.callHistory : [],
      notes: l.notes || '',
      smsSentCount: typeof l.smsSentCount === 'number' ? l.smsSentCount : 0,
      lastCalledAt: l.lastCalledAt || null,
      lastSmsAt: l.lastSmsAt || null
    }
  })
}

export function readLocalLeads(): any[] {
  try {
    ensureStorageDir()
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const raw = fs.readFileSync(LEADS_FILE_PATH, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        inMemoryLeads = normalizeLeads(parsed)
        return inMemoryLeads
      }
    }
  } catch (err) {}
  return inMemoryLeads
}

export function writeLocalLeads(leads: any[]) {
  inMemoryLeads = normalizeLeads(leads)
  try {
    ensureStorageDir()
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(inMemoryLeads, null, 2), 'utf-8')
  } catch (err) {}
}

/** Fetch all leads from remote PocketBase with local fallback */
export async function getAllLeads(): Promise<any[]> {
  try {
    const res: any = await $fetch(`${PB_SERVER_URL}/api/collections/pages/records/${LEADS_PAGE_ID}`, {
      headers: { Authorization: PB_SUPERUSER_TOKEN },
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
        inMemoryLeads = normalizeLeads(parsed)
        writeLocalLeads(inMemoryLeads)
        return inMemoryLeads
      }
    }
  } catch (err) {}

  return normalizeLeads(readLocalLeads())
}

/** Save full leads array to remote PocketBase */
async function syncLeadsToPB(leads: any[]): Promise<boolean> {
  try {
    await $fetch(`${PB_SERVER_URL}/api/collections/pages/records/${LEADS_PAGE_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: PB_SUPERUSER_TOKEN,
        'Content-Type': 'application/json'
      },
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
  let leads = await getAllLeads()
  if (!Array.isArray(leads)) leads = []

  const now = new Date()
  const ts = Date.now()
  const iranDateStr = new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now)
  const iranTimeStr = new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    minute: '2-digit'
  }).format(now)

  const newLead = {
    id: `req-${ts}-${Math.random().toString(36).slice(2, 6)}`,
    ...lead,
    status: lead.status || 'new',
    created: iranDateStr,
    createdAt: now.toISOString(),
    createdTime: iranTimeStr,
    timestamp: ts,
    callAttempts: 0,
    callHistory: [],
    notes: lead.notes || '',
    smsSentCount: 0,
    lastCalledAt: null,
    lastSmsAt: null
  }

  // Prepend to top
  leads.unshift(newLead)
  writeLocalLeads(leads)

  // Save to PocketBase
  await syncLeadsToPB(leads)

  return newLead
}

export async function updateLead(id: string, patch: any): Promise<boolean> {
  const leads = await getAllLeads()
  const idx = leads.findIndex(l => l.id === id)
  if (idx !== -1) {
    leads[idx] = {
      ...leads[idx],
      ...patch,
      updatedAt: new Date().toISOString()
    }
    writeLocalLeads(leads)
    await syncLeadsToPB(leads)
    return true
  }
  return false
}

export const updateLeadStatus = updateLead

export async function removeLead(id: string): Promise<boolean> {
  const leads = await getAllLeads()
  const updated = leads.filter(l => l.id !== id)
  writeLocalLeads(updated)
  await syncLeadsToPB(updated)
  return true
}

