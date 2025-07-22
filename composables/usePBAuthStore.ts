// composables/usePBAuthStore.ts
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import { usePocketBase } from '~/plugins/pb.client'

export function usePBAuthStore() {
  const pb = usePocketBase()
  const state = reactive({
    token: pb.authStore.token,
    model: pb.authStore.model,
    record: pb.authStore.record,
    isValid: pb.authStore.isValid,
    isSuperuser: pb.authStore.isSuperuser,
  })

  // sync on in-tab changes
  const off = pb.authStore.onChange(() => {
    state.token       = pb.authStore.token
    state.model       = pb.authStore.model
    state.record      = pb.authStore.record
    state.isValid     = pb.authStore.isValid
    state.isSuperuser = pb.authStore.isSuperuser
  })

  // sync on cross-tab localStorage writes
  function onStorage(e: StorageEvent) {
    if (e.key === 'pocketbase_auth') {
      state.token       = pb.authStore.token
      state.model       = pb.authStore.model
      state.record      = pb.authStore.record
      state.isValid     = pb.authStore.isValid
      state.isSuperuser = pb.authStore.isSuperuser
    }
  }

  onMounted(() => window.addEventListener('storage', onStorage))
  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorage)
    off()
  })

  return state
}
