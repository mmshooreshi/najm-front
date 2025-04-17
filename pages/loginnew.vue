<!-- pages/login.vue -->
<script setup lang="ts">
import AuthHeader from '~/components/auth/AuthHeader.vue'
import BaseInput from '~/components/Base/BaseInput.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import SocialLoginButtons from '~/components/auth/SocialLoginButtons.vue'
import { useAuth } from '~/composables/useAuth'
import { toPersianDigits, toEnglishDigits } from '~/utils/digits'

const router = useRouter()
const { identifier } = useAuth()

const phone = ref('')                           // Persian digits shown
const phoneEn = computed(() => toEnglishDigits(phone.value))
const isValid = computed(() => /^09\d{9}$/.test(phoneEn.value))

async function sendCode() {
  if (!isValid.value) return
  identifier.value = phoneEn.value
  await new Promise(r => setTimeout(r, 300))
  router.push({ name: 'verify' })
}

definePageMeta({ layout: 'auth' })
</script>

<template>
  <div class="space-y-9 rounded-3xl bg-white px-9 pb-10 pt-14 shadow ">
    <AuthHeader icon="mdi:card-account-details-outline" title="ورود یا ثبت‌نام"
      subtitle="برای دسترسی سریع به سفارش‌ها، خدمات اختصاصی و پیگیری وضعیت، حساب کاربری می‌تواند خیلی کمک‌کننده باشد!" />

    <!-- ⬇ replace ONLY the input + button section -->
    <BaseInput v-model="phone" persian :iconName="phone ? (isValid ? 'mdi:check-circle' : 'mdi:alert-circle') : null"
      placeholder="شماره موبایل (مثلاً ۰۹۱۲۳۴۵۶۷۸۹)" dir="ltr" />


    <BaseButton :disabled="!isValid" :class="isValid
      ? 'bg-primary-600'
      : 'bg-[#EBEBEB] text-gray-400 cursor-not-allowed'" @click="sendCode">
      دریافت کد ورود
    </BaseButton>

    <p class="mt-4 text-center text-[10px] leading-5 text-[#797B7D]">
      با ورود به پنچ، تمام قوانین و شرایط استفاده را می‌پذیرم.
    </p>

    <div class="flex items-center gap-2">
      <div class="h-px flex-grow bg-gray-200"></div>
      <span class="text-xs text-gray-400">یا</span>
      <div class="h-px flex-grow bg-gray-200"></div>
    </div>

    <SocialLoginButtons :providers="[
      { key: 'google', icon: '/icons/auth/google-auth-icon.svg', alt: 'Google' },
      { key: 'apple', icon: '/icons/auth/apple-auth-icon.svg', alt: 'Apple' },
      { key: 'microsoft', icon: '/icons/auth/microsoft-auth-icon.svg', alt: 'Microsoft' },
    ]" @social="(k) => console.log('login with', k)" />
  </div>
</template>

<script lang="ts">
export default {
  layout: 'auth',
  name: 'LoginPage',
  definePageMeta: {
    name: 'login',
  },
}

</script>
