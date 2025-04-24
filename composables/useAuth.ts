import { defineStore } from 'pinia'
import { computed } from 'vue'
import nuxtStorage from 'nuxt-storage' // Import Nuxt Storage
import { storeToRefs } from 'pinia'


import { setWithExpiry, getWithExpiry } from '~/helpers/localStorageWithExpiry'

// 1. Define the Pinia store for authentication
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: {} as any ,
    otpId: 'noid' as string,
    identifier: '' as string,
    phone: '' as string,
  }),
  actions: {
    setToken(newToken: string) {
      this.token = newToken
      // persist in a cookie that expires in 2 days (2 days = 172800 seconds)
      setWithExpiry('auth-token', newToken, 2 * 24 * 60 * 60 * 1000)

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
    setPhone(newPhone: string) {
      this.phone = newPhone
      console.log("Phone set in Pinia store:", newPhone)  // Debugging log
      nuxtStorage.localStorage.setData('auth-phone', newPhone)  // Persist to localStorage
    },
    setIdentifier(newIdentifier: string) {
      this.identifier = newIdentifier
      console.log("Identifier set in Pinia store:", newIdentifier)  // Debugging log
      nuxtStorage.localStorage.setData('auth-identifier', newIdentifier)  // Persist to localStorage
    },
    logout() {
      this.token = null
      this.user = null
      this.otpId = 'noid'
      this.identifier = ''
      console.log("Logged out. Cleared authentication data.")  // Debugging log
      nuxtStorage.localStorage.removeItem('auth-token')
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
    const persistedToken = getWithExpiry<string>('auth-token')
    if (persistedToken) authStore.setToken(persistedToken)
  
    // const persistedToken = nuxtStorage.localStorage.getData('auth-token')
    const persistedUser = nuxtStorage.localStorage.getData('auth-user')
    const persistedPhone = nuxtStorage.localStorage.getData('auth-phone')
    const persistedOtpId = nuxtStorage.localStorage.getData('auth-otpId')
    const persistedIdentifier = nuxtStorage.localStorage.getData('auth-identifier')

    // Set the persisted values to the store if they exist
    // if (persistedToken) authStore.setToken(persistedToken)
    if (persistedUser) authStore.setUser(persistedUser)
    if (persistedPhone) authStore.setPhone(persistedPhone)
    if (persistedOtpId) authStore.setOtpId(persistedOtpId)
    if (persistedIdentifier) authStore.setIdentifier(persistedIdentifier)
  }

  // Check if token is still valid
  const isAuthenticated = computed(() => !!authStore.token)
  const { token, user, otpId, identifier, phone } = storeToRefs(authStore)

  return {
    token,
    user,
    otpId,
    identifier,
    phone,
    isAuthenticated,
    setToken: authStore.setToken,
    setUser: authStore.setUser,
    setOtpId: authStore.setOtpId,
    setPhone: authStore.setPhone,
    setIdentifier: authStore.setIdentifier,
    logout: authStore.logout,
  }
}
