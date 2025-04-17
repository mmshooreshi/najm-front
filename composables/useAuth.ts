
// composables/useAuth.ts
import { useState } from '#app'

export function useAuth() {
  const identifier = useState<string>('auth-identifier')
  const token = useState<string | null>('auth-token')
  const user = useState<any | null>('auth-user', () => null)

  return {
    identifier,
    token,
    user,
  }
}