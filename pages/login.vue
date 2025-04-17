<!-- pages/login.vue -->
<script setup lang="ts">
import AuthHeader from '~/components/auth/AuthHeader.vue'
import BaseInput from '~/components/Base/BaseInput.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import SocialLoginButtons from '~/components/auth/SocialLoginButtons.vue'
import { useAuth } from '~/composables/useAuth'
import { toPersianDigits, toEnglishDigits } from '~/utils/digits'
import loginPageIcon from '~/assets/icons/Auth/login-page-icon'
import { useNavDirection } from '~/composables/useNavDirection'
const nav = useNavDirection()
const route = useRoute()
const router = useRouter()
const { identifier } = useAuth()

const phone = ref('')                           // Persian digits shown
const phoneEn = computed(() => toEnglishDigits(phone.value))
const isValid = computed(() => /^09\d{9}$/.test(phoneEn.value))


// pages/login.vue (inside <script setup>)
const isLoading = ref(false)
async function sendCode() {
  if (!isValid.value) return
  isLoading.value = true
  try {
    identifier.value = phoneEn.value
    nav.value = 'forward'
    // replace this with real API call; using mock here:
    await new Promise(r => setTimeout(r, 1000))
    router.push({ name: 'verify' })
  } catch (err) {
    // TODO: handle error (toast, form error, fallback, etc.)
  } finally {
    isLoading.value = false
  }
}


definePageMeta({
  name: 'login',
  layout: 'auth',
})




</script>
<template>
  <div class="space-y-9  bg-transparent px-4 py-0 w-full">
    <!-- mdi:card-account-details-outline  -->
    <AuthHeader icon="login-page-icon" title="ورود یا ثبت‌نام"
      subtitle="برای دسترسی سریع به سفارش‌ها، خدمات اختصاصی و پیگیری وضعیت، حساب کاربری می‌تواند خیلی کمک‌کننده باشد!" />


    <!-- ⬇ replace ONLY the input + button section -->
    <div>
      <form @submit.prevent="sendCode" class="space-y-6">
        <BaseInput v-model="phone" persian
          :iconName="phone ? (isValid ? 'mdi:check-circle' : 'mdi:alert-circle') : null" dir="ltr"
          placeholder="شماره موبایل (مثلاً ۰۹۱۲۳۴۵۶۷۸۹)" />
        <BaseButton type="submit" :loading="isLoading" :disabled="!isValid" :class="isValid
          ? 'bg-primary-600'
          : 'bg-[#EBEBEB] text-gray-400 cursor-not-allowed'">
          دریافت کد ورود
        </BaseButton>
      </form>

      <p class="mt-3 text-right text-[10px] leading-5 text-[#797B7D]">
        با ورود یا ثبت‌نام در مجموعه نجم، تمام <a href="/faq" class="underline"> قوانین و شرایط استفاده </a> رو قبول
        می‌کنم.
      </p>
    </div>

    <div>
      <div class="flex items-center gap-2 mb-2">
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
  </div>
</template>
