<!-- pages/profile.vue (step 3) -->
<script setup lang="ts">
import AuthHeader from '~/components/auth/AuthHeader.vue'
import BaseInput from '~/components/Base/BaseInput.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import { useAuth } from '~/composables/useAuth'
const { identifier, token } = useAuth()

const fname = ref('')
const lname = ref('')
const router = useRouter()

const isLoading = ref(false)
async function complete() {
  if (!fname.value || !lname.value) return
  // TODO: save profile to backend
  isLoading.value = true
  try {
    // replace this with real API call; using mock here:
    await new Promise(r => setTimeout(r, 1500))
    router.push('/')
  } catch (err) {
    // TODO: handle error (toast, form error, fallback, etc.)
  } finally {
    isLoading.value = false
  }

}

definePageMeta({ layout: 'auth' })

</script>

<template>
  <div class="space-y-9  bg-transparent px-4 py-0 w-full">

    <AuthHeader icon="mdi:account-circle-outline" title="پروفایلتو کامل کن"
      subtitle="دسترسی سریع به سفارش‌ها، پیگیری وضعیت و خدمات اختصاصی" />
    <div>
      <form @submit.prevent="complete" class="space-y-6">
      <div class="space-y-2">
      <BaseInput v-model="fname" placeholder="نام" />
      <BaseInput v-model="lname" placeholder="نام خانوادگی" />
    </div>

      <BaseButton  type="submit" :loading="isLoading"  :disabled="!fname || !lname">
        ادامه
      </BaseButton>
    </form>

    <p class="mt-6 underline text-center text-xs text-[#797B7D]">باشه برای بعد</p>
  </div>
  </div>
</template>

<script lang="ts">
export default {
  layout: 'auth',
  name: 'profile',
}
</script>