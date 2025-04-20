<!-- pages/login.vue -->
<script setup lang="ts">
import AuthHeader from '~/components/auth/AuthHeader.vue'
import BaseInput from '~/components/Base/BaseInput.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import SocialLoginButtons from '~/components/auth/SocialLoginButtons.vue'
import { useAuth } from '~/composables/useAuth'
import { useAuthAPI } from '~/composables/useAuthAPI'

import { toPersianDigits, toEnglishDigits } from '~/utils/digits'
import loginPageIcon from '~/assets/icons/Auth/login-page-icon'
import { useNavDirection } from '~/composables/useNavDirection'
const nav = useNavDirection()
const route = useRoute()
const router = useRouter()
// const { identifier } = useAuth()
const { sendPhoneNumber, verifyOTP } = useAuthAPI()

const { setToken, setUser, setOtpId, setIdentifier } = useAuth()
const { loginOrRegister } = useAuthAPI()

const emailEn = ref('mmshooreshi@gmail.com')
const phone = ref('')
const otpId = ref('')
const isLoading = ref(false)

const phoneEn = computed(() => toEnglishDigits(phone.value))
const isValidPhone = computed(() => /^09\d{9}$/.test(phoneEn.value))
const isValidEmail = computed(() => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(emailEn.value))


// pages/login.vue (inside <script setup>)
async function sendCode() {
  if (!isValidPhone.value) return
  isLoading.value = true
  try {
    setIdentifier(phoneEn.value) 
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


// Step 1: Request OTP (login or register flow)
const requestOTP = async () => {
  console.log('Requesting OTP for email:', emailEn.value)
  if (!isValidEmail.value || !isValidPhone.value) return
  isLoading.value = true
  try {
    // Step 2: Handle login or registration
    otpId.value = await loginOrRegister(emailEn.value, phone.value)
    setOtpId(otpId.value)  // Store otpId in Pinia
    setIdentifier(phoneEn.value)  // Store email/identifier in Pinia


    console.log('OTP sent successfully. otpId:', otpId.value)
    // Navigate to OTP input screen
    router.push({ name: 'verify' })
  } catch (err) {
    console.error('Error during login/register process:', err)
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
      <form @submit.prevent="requestOTP" class="space-y-6">
        <BaseInput numberOnly v-model="phone" persian position="left"
          :iconName="phone ? (isValidPhone ? 'mdi:check-circle' : 'mdi:alert-circle') : null" dir="ltr"
          floatinglabel="شمارهٔ موبایل" placeholder="مثلا ۰۹۱۲۸۴۶۲۶۴۸" />
        <BaseButton type="submit" :loading="isLoading" :disabled="!isValidPhone" :class="isValidPhone
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
      <div class="flex items-center gap-2 mb-3">
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
