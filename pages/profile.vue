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

function complete() {
  if (!fname.value || !lname.value) return
  // TODO: save profile to backend
  router.push('/')
}

definePageMeta({ layout: 'auth' })

</script>

<template>
  <div class="space-y-9  bg-transparent px-0 py-0 w-full">

    <AuthHeader icon="mdi:account-circle-outline" title="پروفایلتو کامل کن"
      subtitle="دسترسی سریع به سفارش‌ها، پیگیری وضعیت و خدمات اختصاصی" />
    <form @submit.prevent="complete" class="space-y-6">
      <BaseInput v-model="fname" placeholder="نام" />
      <BaseInput v-model="lname" placeholder="نام خانوادگی" />

      <BaseButton type="submit" :disabled="!fname || !lname">
        ادامه
      </BaseButton>
    </form>

    <p class="mt-4 text-center text-xs text-[#797B7D]">باشه برای بعد</p>
  </div>
</template>

<script lang="ts">
export default {
  layout: 'auth',
  name: 'profile',
}
</script>