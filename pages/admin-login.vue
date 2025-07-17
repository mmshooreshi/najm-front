<!-- pages/admin-login.vue -->
<script setup lang="ts">
import FloatingInput from '~/components/Base/FloatingInputNew.vue'
import BaseButton from '~/components/Base/BaseButton.vue'

const route = useRoute()

const email = ref('')
const password = ref('')
const errorMsg = ref<string | null>(null)
const isLoading = ref(false)

function required(v: string) {
  return v && v.trim().length > 0
}

async function onSubmit() {
  errorMsg.value = null
  if (!required(email.value) || !required(password.value)) {
    errorMsg.value = 'ایمیل و گذرواژه را وارد کنید.'
    return
  }

  isLoading.value = true
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',      // ← add this
      body: { email: email.value, password: password.value }
    })
    // Full reload so the (server‑side) middleware can read the httpOnly cookie
    
    // OLD WAY [DEPRECATED]:
    // window.location.href = '/admin'
    
    // * >> New way to have redirect feature built-in:
    const redirectTo = (route.query.redirect as string) || '/admin'
    window.location.href = redirectTo

  } catch (err: any) {
    // Nuxt sets err.data for non‑2xx responses
    const msg = err?.data?.message || err?.message || 'خطای ناشناخته'
    errorMsg.value = msg === 'Failed to authenticate.' ? 'ایمیل یا گذرواژه اشتباه است.' : msg
  } finally {
    isLoading.value = false
  }
}


definePageMeta({
  layout: "auth", // reuse your existing auth layout shell
})
</script>



<template>
  <div class="flex mt-32 items-center justify-center sm:bg-[#F9FBFA] sm:p-6 ">
    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-sm space-y-1 rounded-3xl sm:bg-white p-4 sm:p-8 sm:shadow-xl">
      <h1 class="text-center text-2xl font-bold mb-4">ورود ادمین</h1>

        <FloatingInput
        v-model="email"
        autocomplete="username email"
        floatingLabel="ایمیل ادمین"
        icon-name="mdi:email-outline"
        dir="ltr"
        autofocus />

        <FloatingInput
        v-model="password"
        type="password"                     
        autocomplete="current-password"
        floatingLabel="گذرواژه"
        icon-name="mdi:lock-outline"
        dir="ltr" />


      <!-- Error -->
        <p v-if="errorMsg" class="rounded-xl bg-red-50 px-3 py-2 text-center text-sm text-red-600 border border-red-200">
      {{ errorMsg }}
    </p>
      <!-- Submit -->
      <BaseButton
        type="submit"
        :loading="isLoading"
        class="w-full bg-primary-600">
        ورود
      </BaseButton>
    </form>



  </div>
</template>


