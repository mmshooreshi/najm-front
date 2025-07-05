<!-- pages/verify.vue -->
<!-- pages/verify.vue -->
<template>
    <div class="space-y-9  px-4 py-0 w-full">
        <AuthHeader icon="verify-page-icon" :title="authUIData.verify.heading">
            <template #subtitle>
                <!-- کد تایید، به شماره‌ی {{ toPersianDigits(identifier) }} ارسال شد. -->

                <div class="text-xs gap-1 flex flex-row" >
                    <div>{{ dynamicSubheading }}</div>

                    <NuxtLink to="/login" class="text-blue-600 underline cursor-pointer">
                        {{authUIData.verify.editButtonLabel}}
                    </NuxtLink>
                </div>
            </template>
        </AuthHeader>
<!-- 
        <div class="rtl">
        prevOtpId:[ {{prevOtpId}} ]
        <br>
        OtpId: [ {{otpId}} ]
        <br>
        <br>
        Phone: [ {{phone}} ]
        <br>
        Identifier: [ {{identifier}} ]
        <br>
        Token: [ {{token}} ]

       </div> -->

        <form @submit.prevent="verifyCode" class="space-y-6">
            <OtpInput numberOnly v-model="code" persian :length="otpLength" />
            <!-- {{ code }} -->
            <BaseButton type="submit" :loading="isLoading" :disabled="code.length !== otpLength">
                {{authUIData.verify.okButtonLabel}}
            </BaseButton>
            <!-- {{ otpId }} -->

                  <!-- نمایش خطای تأیید -->
      <p
      v-motion-pop-visible-once
        v-show="errorMessage"
        class="mt-2 text-center text-sm text-red-600"
      >
        {{ errorMessage }}
      </p>
            <p class="mt-3 text-center text-xs text-[#797B7D]" :class="timer > 0 ? 'cursor-wait' : 'cursor-default'">
                {{authUIData.verify.retryLabel}}
                <span v-if="timer > 0">
                    {{ toPersianDigits(formattedTime) }}
                </span>
                <span v-else @click="resendCode" class="text-blue-600 underline cursor-pointer">
                    {{authUIData.verify.retryButtonLabel}}
                </span>
            </p>

        </form>



    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AuthHeader from '~/components/auth/AuthHeader.vue'
import OtpInput from '~/components/auth/OtpInput.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import { useAuth } from '~/composables/useAuth'
import { useAuthAPI } from '~/composables/useAuthAPI'
import { useNavDirection } from '~/composables/useNavDirection'
import { toPersianDigits } from '~/utils/digits'
import { useAuthUIData } from '~/composables/ui/authUI'
const {authUIData} = useAuthUIData()

const nav = useNavDirection()
const router = useRouter()



// Loading state
const loading = ref(true)

// Wait for authUIData to load
watchEffect(() => {
  if (authUIData.value) {
    loading.value = false
  }
})


const { setToken, setUser, setOtpId, setIdentifier,identifier, token, otpId,phone } = useAuth()

const { authenticateWithOTP, loginOrRegister } = useAuthAPI()


const dynamicSubheading = computed(() => {
  return authUIData.value?.verify.subheading.replace("<phone>", toPersianDigits(identifier.value)) || ''
})

const code = ref('')
const otpLength = computed(() => 6)  // Assuming OTP length is 6

const isLoading = ref(false)
// Countdown timer logic
const initialSeconds = 2
const timer = ref<number>(initialSeconds)
let timerInterval: number
const errorMessage = ref('')      // ← new

const formattedTime = computed(() => {
  const m = Math.floor(timer.value / 60)
  const s = timer.value % 60
  const sec = s < 10 ? `0${s}` : `${s}`
  return `${m}:${sec}`
})

function startTimer() {
  timer.value = initialSeconds
  clearInterval(timerInterval)
  timerInterval = window.setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

// function resendCode() {
//   startTimer()
// }

const prevOtpId =  ref()
const resendCode = async () => {
  // Prevent hammer-tapping
  if (timer.value > 0) return

  isLoading.value = true
  errorMessage.value = ''
  prevOtpId.value = otpId.value ?? ''
  try {
    if (phone.value) {
      let newOtpId = await loginOrRegister(identifier.value, phone.value)
      if (newOtpId)
      {
        setOtpId(newOtpId)
      }

    } else{
      errorMessage.value = 'خطا در ارسال کد. لطفا دوباره تلاش کنید.'
    }
    code.value = ''

    // Navigate to OTP input screen
    // router.push({ name: 'verify' })

    startTimer()

  } catch (err: any) {
    errorMessage.value = err.message || 'خطا در ارسال کد. لطفا دوباره تلاش کنید.'
  } finally {

    isLoading.value = false
  }
}

async function verifyCode() {
  if (code.value.length !== otpLength.value) return
  isLoading.value = true
  try {
    // Replace with real OTP verification
    errorMessage.value = ''         // ← clear previous error
    console.log(otpId.value)
    if (otpId.value)
    {   
        const { success } = await authenticateWithOTP(otpId.value, code.value)
    
    if (success) {
      console.log('OTP verification successful')
      router.push({ name: 'profile' })
    } else {
      errorMessage.value =  'کد وارد شده صحیح نیست. لطفاً دوباره تلاش کنید.'

      console.log('OTP verification failed')
    }
  }
  } catch (err: any) {
    errorMessage.value = err.message || 'خطا در ارسال کد. لطفا دوباره تلاش کنید.' 
    console.error('Error during OTP verification:', err)
  } finally {
    isLoading.value = false
  }
}

// Clipboard auto-fill logic
let clipboardInterval: number
let lastText = ''

async function checkClipboard() {
  try {
    const rawtext = await navigator.clipboard.readText()
    const text = toPersianDigits(rawtext).replace(/\D/g, '')
    if (text && text !== lastText) {
      const regex = new RegExp(`^\\d{${otpLength.value}}$`)
      if (regex.test(text)) {
        code.value = text
      }
      lastText = text
    }
  } catch {
    // ignore
  }
}

onMounted(() => {
  startTimer()
  window.addEventListener('focus', checkClipboard)
  clipboardInterval = window.setInterval(checkClipboard, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timerInterval)
  window.removeEventListener('focus', checkClipboard)
  clearInterval(clipboardInterval)
})

function editNumber() {
  nav.value = 'back'
  router.back()
}

definePageMeta({
  // middleware: ['auth'],
  name: 'verify',
  layout: 'auth',
})
</script>
