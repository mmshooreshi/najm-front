<!-- pages/login.vue -->
<script setup lang="ts">
import AuthHeader from '~/components/auth/AuthHeader.vue'
import BaseInput from '~/components/Base/BaseInput.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import SocialLoginButtons from '~/components/auth/SocialLoginButtons.vue'
import { useAuth } from '~/composables/useAuth'
import { useAuthAPI } from '~/composables/useAuthAPI'

import { toPersianDigits, toEnglishDigits } from '~/utils/digits'
import loginPageIcon from '~/assets/icons/Auth/login-page-icon.svg'
import { useNavDirection } from '~/composables/useNavDirection'

import { useAuthUIData } from '~/composables/ui/authUI'
import {useLocale} from "@/composables/useLocale"
const { language } = useLocale()

const nav = useNavDirection()
const route = useRoute()
const router = useRouter()
// const { identifier } = useAuth()
const { sendPhoneNumber, verifyOTP, loginOrRegister } = useAuthAPI()
const { setToken, setUser, setOtpId, setIdentifier,identifier, token, otpId,phone ,setPhone} = useAuth()


const {authUIData} = useAuthUIData(language)

const emailEn = ref('mmshooreshi@gmail.com')
const isLoading = ref(false)

const phoneModel = ref('')
const phoneEn = computed(() => toEnglishDigits(phoneModel.value))
const isValidPhone = computed(() => /^09\d{9}$/.test(phoneEn.value))
const isValidEmail = computed(() => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(emailEn.value))

const errorMessage = ref('')      // ← new

const newOtpId = ref('')

// Step 1: Request OTP (login or register flow)
const requestOTP = async () => {
  console.log('Requesting OTP for email:', emailEn.value)
  errorMessage.value = ''         // ← clear previous error
  if (!isValidEmail.value || !isValidPhone.value) return
  isLoading.value = true
  try {
    // Re-request a new OTP for this identifier
    if (phoneModel) {
      let newOtpId = await loginOrRegister(emailEn.value, phoneModel.value)
      if (newOtpId)
      {
        setOtpId(newOtpId)
      }

    } else{
      errorMessage.value = 'خطا در ارسال کد. لطفا دوباره تلاش کنید.'
    }



    console.log('OTP sent successfully. otpId:', otpId)
    // Navigate to OTP input screen
    router.push({ name: 'verify' })
  } catch (err: any) {
    errorMessage.value = err.message || 'خطا در ارسال کد. لطفا دوباره تلاش کنید.' 

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
    <AuthHeader icon="login-page-icon" :title="authUIData.login.heading"
      :subtitle="authUIData.login.subheading" />

    <div>
      <form @submit.prevent="requestOTP" class="space-y-6">

         <BaseInput
         class="ltr"
   numberOnly
   v-model="phoneModel"
   persian
   :iconName="phone
     ? (isValidPhone ? 'mdi:check-circle' : 'mdi:alert-circle')
     : null"
   :error="phone && !isValidPhone
     ? 'شماره‌ی موبایل باید با ۰۹ شروع شود.'
     : ''"
   dir="ltr"
   :floatinglabel="authUIData.login.phoneEmailFloatingLabel"
   :placeholder="authUIData.login.phoneEmailPlaceholder"
/>

<!-- <div class="rtl">
        <br>
        OtpId: [ {{otpId}} ]
        <br>
        Phone: [ {{phone}} ]
        <br>
        Identifier: [ {{identifier}} ]
        <br>
        Token: [ {{token}} ]

       </div> -->
<!-- 
        <BaseInput numberOnly v-model="phone" persian position="left"
          :iconName="phone ? (isValidPhone ? 'mdi:check-circle' : 'mdi:alert-circle') : null" dir="ltr"
          :floatinglabel="authUIData.login.phoneEmailFloatingLabel" :placeholder="authUIData.login.phoneEmailPlaceholder" /> -->
        <BaseButton type="submit" :loading="isLoading" :disabled="!isValidPhone" :class="isValidPhone
          ? 'bg-primary-600'
          : 'bg-[#EBEBEB]/100 text-gray-400 cursor-not-allowed'">
          {{ authUIData.login.buttonLabel }}
        </BaseButton>

       <p
      v-motion-pop-visible-once
        v-show="errorMessage"
        class="mt-2 text-center text-sm text-red-600"
      >
        {{ errorMessage }}
      </p>

      </form>

      <p  class="mt-3 text-right text-[10px] leading-5 text-[#797B7D]" v-html="authUIData.login.legalText"></p>

    </div>

    <div>
      <div class="flex items-center gap-2 mb-3">
        <div class="h-px flex-grow bg-gray-200"></div>
        <span class="text-xs text-gray-400">{{ authUIData.login.orLabel }}</span>
        <div class="h-px flex-grow bg-gray-200"></div>
      </div>

      <SocialLoginButtons :providers="authUIData.login.socialIcons" @social="(k) => console.log('login with', k)" />
    </div>
  </div>
</template>



