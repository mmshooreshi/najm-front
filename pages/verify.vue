<!-- pages/verify.vue -->
 <template>
  <div class="space-y-9 bg-transparent px-4 py-0 w-full">
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
       <BaseButton
         type="submit"
         :loading="isLoading"
         :disabled="code.length !== otpLength"
       >
         تایید
       </BaseButton>

       <p class="mt-3 text-center text-xs text-[#797B7D]" :class="timer > 0 ? 'cursor-wait' : 'cursor-default'">
        دریافت مجدد کد
        <span v-if="timer > 0">
          {{ toPersianDigits(formattedTime) }}
        </span>
        <span
          v-else
          @click="resendCode"
          class="text-blue-600 underline cursor-pointer"
        >
          دریافت دوباره
        </span>
      </p>

     </form>
  

  
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import AuthHeader from '~/components/auth/AuthHeader.vue'
  import OtpInput from '~/components/auth/OtpInput.vue'
  import BaseButton from '~/components/Base/BaseButton.vue'
  import { useAuth } from '~/composables/useAuth'
  import { toPersianDigits, toEnglishDigits } from '~/utils/digits'
  import { useNavDirection } from '~/composables/useNavDirection'
const nav = useNavDirection()

  const router = useRouter()
  const { identifier, token } = useAuth()
  const code = ref('')
  const otpLength = ref(6)
  
  // —— countdown timer logic ——
  const initialSeconds = 10 // 1 minute 34 seconds
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
    // TODO: call your resend API here
    startTimer()
  }
  

  async function pasteFromClipboard () {
  try {
    const raw = await navigator.clipboard.readText()
    const digits = toEnglishDigits(raw).replace(/\D/g, '')
    if (digits.length === otpLength.value) code.value = digits
  } catch { /* user denied or API unsupported */ }
}

  function tryAutoPasteOnce (e: PointerEvent) {
  window.removeEventListener('pointerdown', tryAutoPasteOnce)
  pasteFromClipboard()
}
  onMounted(() => {
    startTimer()
    window.addEventListener('focus', checkClipboard)
    clipboardInterval = window.setInterval(checkClipboard, 1000)

    if ('clipboard' in navigator) {
    window.addEventListener('pointerdown', tryAutoPasteOnce, { once: true })
  }

  })
  
  onBeforeUnmount(() => {
    clearInterval(timerInterval)
    window.removeEventListener('focus', checkClipboard)
    clearInterval(clipboardInterval)
  })
  
  const isLoading = ref(false)
  // —— OTP verification & edit number ——
  async function verifyCode() {
    if (code.value.length !== otpLength.value) return
    isLoading.value = true
    token.value = 'mock-jwt'
    await new Promise((r) => setTimeout(r, 800))
    nav.value = 'forward'
    router.push({ name: 'profile' })
    isLoading.value = false

  }
  
  function editNumber() {
    router.back()
  }
  
  // —— clipboard auto-fill ——
  let clipboardInterval: number
  let lastText = ''
  
  async function checkClipboard() {
    // if (!document.hasFocus()) return
    // try {
    //   const rawtext = await navigator.clipboard.readText()
    //   const text = toEnglishDigits(rawtext).replace(/\D/g, '')
    //   if (text && text !== lastText) {
    //     const regex = new RegExp(`^\\d{${otpLength.value}}$`)
    //     if (regex.test(text)) {
    //       code.value = text
    //     }
    //     lastText = text
    //   }
    // } catch {
    //   // ignore
    // }
  }
  
  definePageMeta({ layout: 'auth' })
  </script>
  