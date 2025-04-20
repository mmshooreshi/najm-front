<!-- pages/verify.vue -->
<template>
    <div class="space-y-9  px-4 py-0 w-full">
        <AuthHeader icon="verify-page-icon" title="کد تایید رو وارد کن">
            <template #subtitle>
                <div class="text-xs ">
                    کد تایید، به شماره‌ی {{ toPersianDigits(identifier) }} ارسال شد.
                    <span @click="editNumber" class="text-blue-600 underline cursor-pointer">
                        ویرایش
                    </span>
                </div>
            </template>
        </AuthHeader>

        <form @submit.prevent="verifyCode" class="space-y-6">
            <OtpInput numberOnly v-model="code" persian :length="otpLength" />
            <!-- {{ code }} -->
            <BaseButton type="submit" :loading="isLoading" :disabled="code.length !== otpLength">
                تایید
            </BaseButton>
            <!-- {{ otpId }} -->

            <p class="mt-3 text-center text-xs text-[#797B7D]" :class="timer > 0 ? 'cursor-wait' : 'cursor-default'">
                دریافت مجدد کد
                <span v-if="timer > 0">
                    {{ toPersianDigits(formattedTime) }}
                </span>
                <span v-else @click="resendCode" class="text-blue-600 underline cursor-pointer">
                    دریافت دوباره
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

const nav = useNavDirection()
const router = useRouter()

const { identifier, token } = useAuth()
const code = ref('')
const otpLength = computed(() => 6)  // Assuming OTP length is 6
const { otpId, setUser, setToken } = useAuth()  // Get otpId from Pinia store

const { authenticateWithOTP } = useAuthAPI()

const isLoading = ref(false)

// Countdown timer logic
const initialSeconds = 10
const timer = ref<number>(initialSeconds)
let timerInterval: number

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

function resendCode() {
  startTimer()
}

async function verifyCode() {
  if (code.value.length !== otpLength.value) return
  isLoading.value = true
  try {
    // Replace with real OTP verification
    console.log(otpId)
    const { success } = await authenticateWithOTP(otpId, code.value)
    if (success) {
      console.log('OTP verification successful')
      router.push({ name: 'profile' })
    } else {
      console.log('OTP verification failed')
    }
  } catch (err) {
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
  name: 'verify',
  layout: 'auth',
})
</script>
