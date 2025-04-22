import { defineStore } from 'pinia'
import { computed } from 'vue'
import nuxtStorage from 'nuxt-storage' // Import Nuxt Storage

// 1. Define the Pinia store for authentication
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as any | null,
    otpId: 'noid' as string,
    identifier: '' as string,
  }),
  actions: {
    setToken(newToken: string) {
      this.token = newToken
      console.log("Token set in Pinia store:", newToken)  // Debugging log
      nuxtStorage.localStorage.setData('auth-token', newToken)  // Persist to localStorage
    },
    setUser(newUser: any) {
      this.user = newUser
      console.log("User set in Pinia store:", newUser)  // Debugging log
      nuxtStorage.localStorage.setData('auth-user', newUser)  // Persist to localStorage
    },
    setOtpId(newOtpId: string) {
      this.otpId = newOtpId
      console.log("otpId set in Pinia store:", newOtpId)  // Debugging log
      nuxtStorage.localStorage.setData('auth-otpId', newOtpId)  // Persist to localStorage
    },
    setIdentifier(newIdentifier: string) {
      this.identifier = newIdentifier
      console.log("Identifier set in Pinia store:", newIdentifier)  // Debugging log
      nuxtStorage.localStorage.setData('auth-identifier', newIdentifier)  // Persist to localStorage
    },
    logout() {
      this.token = null
      this.user = null
      this.otpId = null
      this.identifier = ''
      console.log("Logged out. Cleared authentication data.")  // Debugging log
      nuxtStorage.localStorage.clear()  // Clear all stored authentication data from localStorage
    },
  },
})

// 2. Define the `useAuth` composable that integrates Pinia and Nuxt Storage

export function useAuth() {
  const isClient = typeof window !== 'undefined' // Check if we're on the client side

  // Use Pinia store (use the store only if Pinia is initialized)
  const authStore = useAuthStore()

  // On initialization, check Nuxt Storage for persisted values
  if (isClient) {
    const persistedToken = nuxtStorage.localStorage.getData('auth-token')
    const persistedUser = nuxtStorage.localStorage.getData('auth-user')
    const persistedOtpId = nuxtStorage.localStorage.getData('auth-otpId')
    const persistedIdentifier = nuxtStorage.localStorage.getData('auth-identifier')

    // Set the persisted values to the store if they exist
    if (persistedToken) authStore.setToken(persistedToken)
    if (persistedUser) authStore.setUser(persistedUser)
    if (persistedOtpId) authStore.setOtpId(persistedOtpId)
    if (persistedIdentifier) authStore.setIdentifier(persistedIdentifier)
  }

  // Check if token is still valid
  const isAuthenticated = computed(() => !!authStore.token)

  return {
    token: authStore.token,
    user: authStore.user,
    otpId: authStore.otpId,
    identifier: authStore.identifier,
    isAuthenticated,
    setToken: authStore.setToken,
    setUser: authStore.setUser,
    setOtpId: authStore.setOtpId,
    setIdentifier: authStore.setIdentifier,
    logout: authStore.logout,
  }
}
