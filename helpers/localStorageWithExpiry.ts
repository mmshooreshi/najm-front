// helpers/localStorageWithExpiry.ts
export function setWithExpiry(key: string, value: any, ttlMs: number) {
    const record = {
      value,
      expiresAt: Date.now() + ttlMs
    }
    window.localStorage.setItem(key, JSON.stringify(record))
  }
  
  export function getWithExpiry<T>(key: string): T | null {
    const json = window.localStorage.getItem(key)
    if (!json) return null
  
    try {
      const record = JSON.parse(json) as { value: T; expiresAt: number }
      if (Date.now() > record.expiresAt) {
        window.localStorage.removeItem(key)
        return null
      }
      return record.value
    } catch {
      window.localStorage.removeItem(key)
      return null
    }
  }
  