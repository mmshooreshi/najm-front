
<!-- pages/profile.vue (step 3) -->
<script setup lang="ts">
import AuthHeader from '~/components/auth/AuthHeader.vue'
import BaseInput from '~/components/Base/BaseInput.vue'
import BaseButton from '~/components/Base/BaseButton.vue'

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
  <div class="space-y-9 rounded-3xl bg-white px-9 pb-10 pt-14 shadow">
    <AuthHeader
      icon="mdi:account-circle-outline"
      title="پروفایلتو کامل کن"
      subtitle="دسترسی سریع به سفارش‌ها، پیگیری وضعیت و خدمات اختصاصی"
    />

    <BaseInput v-model="fname" placeholder="نام" />
    <BaseInput v-model="lname" placeholder="نام خانوادگی" />

    <BaseButton :disabled="!fname || !lname" @click="complete">ادامه</BaseButton>

    <p class="mt-4 text-center text-xs text-[#797B7D]">باشه برای بعد</p>
  </div>
</template>

<script lang="ts">
export default {
  layout: 'auth',
  name: 'profile',
}
</script>