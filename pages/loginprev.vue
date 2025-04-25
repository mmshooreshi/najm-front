<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AuthSegmentedTabs from '~/components/auth/AuthSegmentedTabs.vue'
import AuthSocialButtons from '~/components/auth/AuthSocialButtons.vue'
import { useAuthUIData } from '~/composables/ui/authUI'
import errorIcon from '~/assets/icons/error-icon.svg'

// Helper functions for digit conversion.
function convertToPersianDigits(input: string): string {
  const map: Record<string, string> = {
    '0': '۰', '1': '۱', '2': '۲', '3': '۳',
    '4': '۴', '5': '۵', '6': '۶', '7': '۷',
    '8': '۸', '9': '۹'
  }
  return input.replace(/\d/g, d => map[d])
}

function convertToEnglishDigits(input: string): string {
  const map: Record<string, string> = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3',
    '۴': '4', '۵': '5', '۶': '6', '۷': '7',
    '۸': '8', '۹': '9'
  }
  return input.replace(/[۰-۹]/g, d => map[d])
}

const currentTab = ref<'login' | 'signup'>('login')
const phoneEmail = ref('')
const { authUIData } = useAuthUIData()

// Force LTR direction if input exists.
const inputDir = computed(() => (phoneEmail.value.trim() !== '' ? 'ltr' : 'rtl'))

// Regular expressions for validation.
const persianRegex = /[\u0600-\u06FF]/  
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^09\d{9}$/  // Matches Iranian phone numbers like 09128462648

// Reference to hold the debounced error message.
const delayedErrorMessage = ref('')
let debounceTimer: ReturnType<typeof setTimeout>

// Flag to determine if the debounce timer has run at least once.
const isDebounced = ref(false)

// Watch for changes; validate only after 500ms of inactivity.
watch(
  phoneEmail,
  (newVal) => {
    // Reset the debounce flag when input changes.
    isDebounced.value = false
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      // Convert to English digits before validating.
      const valueEnglish = convertToEnglishDigits(newVal.trim())
      console.log(valueEnglish)
      let err = ''
      if (!valueEnglish) {
        err = ''
      } else if (valueEnglish.includes('@')) {
        err = emailRegex.test(valueEnglish) ? '' : 'فرمت ایمیل صحیح نمی‌باشد.'
      } else if (/^\d+$/.test(valueEnglish)) {
        err = phoneRegex.test(valueEnglish) ? '' : 'شماره تلفن ایرانی صحیح نمی‌باشد.'
      } else {
        err = emailRegex.test(valueEnglish) ? '' : 'فرمت ایمیل صحیح نمی‌باشد.'
      }
      delayedErrorMessage.value = err
      // Mark that debounce validation has been completed.
      isDebounced.value = true
    }, 500)
  }
)

// Overall validity computed using the English-converted value,
// and only considered valid if a debounce cycle completed.
const isValid = computed(() => {
  const value = convertToEnglishDigits(phoneEmail.value.trim())
  if (!value) return false
  return delayedErrorMessage.value === ''
})

// Computed flag to detect if an input exists.
const hasInput = computed(() => phoneEmail.value.trim() !== '')

function onSubmit() {
  if (!isValid.value) {
    alert(delayedErrorMessage.value)
    return
  }
  alert(`Submitted: ${phoneEmail.value} for ${currentTab.value} tab.`)
}

// For input handling: convert digits to Persian before saving.
function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  // Convert any typed digits into Persian digits.
  phoneEmail.value = convertToPersianDigits(target.value)
}
</script>

<template>
  <div class="relative min-h-screen  bg-[#F9FBFA]/100  text-right rtl">
    <!-- Fixed segmented tabs -->
    <div class="fixed top-24 sm:top-16 left-0 w-full flex justify-center  bg-[#F9FBFA]/100  z-50 shadow-sm py-4">
      <div class="max-w-sm w-full px-4">
        <AuthSegmentedTabs
          v-model="currentTab"
          :loginLabel="authUIData.tabLoginTitle"
          :signupLabel="authUIData.tabSignupTitle"
        />
      </div>
    </div>
    <!-- Scrollable form area -->
    <div class="flex flex-col items-center pt-56 sm:pt-28 px-4">
      <div class="max-w-sm w-full space-y-3">
        <div class="bg-white rounded-3xl px-9 py-9 flex flex-col justify-start">
          <transition name="fade" mode="out-in">
            <div :key="currentTab" class="space-y-9">
              <div class="space-y-2">
                <h1 class="text-2xl font-extrabold">
                  {{ currentTab === 'login' ? authUIData.headingLogin : authUIData.headingSignup }}
                </h1>
                <p class="text-xs text-[#797B7D]">
                  {{ currentTab === 'login' ? authUIData.subheadingLogin : authUIData.subheadingSignup }}
                </p>
              </div>
              <div class="space-y-3">
                <!-- Input container with relative positioning for icons -->
                <div class="relative">
                  <!-- Apply dynamic classes based on validation status after debounce -->
                  <input
                    :value="phoneEmail"
                    @input="handleInput"
                    :dir="inputDir"
                    type="text"
                    :placeholder="authUIData.phoneEmailPlaceholder"
                    :class="[
                      'w-full border rounded-2xl px-6 py-5 text-xs font-semibold focus:outline-none focus:shadow-sm transition-all duration-300',
                      hasInput && isDebounced
                        ? (isValid ? 'border-green-500 text-green-500 focus:border-green-500' : 'border-rose-600 text-rose-600 focus:border-rose-600')
                        : 'border-gray-300 text-[#797B7D]'
                    ]"
                  />
                  <!-- Conditionally show the icon only after debounce has occurred -->
                  <span v-if="hasInput && isDebounced" class="absolute inset-y-0 right-3 flex items-center">
                    <!-- If valid, show check icon. Else, show warning icon. -->
                    <svg v-if="isValid" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2l4 -4" />
                      <circle cx="12" cy="12" r="9" stroke-width="2" stroke="currentColor" fill="none"/>
                    </svg>

                    <errorIcon class="h-5 w-5 !fill-red"  v-else />
                  </span>
                </div>
                <!-- Error message as before -->
                <p v-if="phoneEmail && delayedErrorMessage" class="text-rose-600 text-xs">
                  {{ delayedErrorMessage }}
                </p>
                <button
                  @click="onSubmit"
                  class="w-full  bg-[#EBEBEB]/100  rounded-2xl p-3 text-base font-semibold transition-all duration-300 hover:text-black hover:bg-primary hover:shadow-sm hover:scale-105 active:scale-95"
                >
                  {{ authUIData.buttonLabel }}
                </button>
              </div>
              <div class="space-y-4">
                <div class="flex gap-2 items-center justify-center text-sm text-gray-400">
                  <div class="h-px bg-gray-200 flex-grow"></div>
                  <span>{{ authUIData.orLabel }}</span>
                  <div class="h-px bg-gray-200 flex-grow"></div>
                </div>
                <AuthSocialButtons :icons="authUIData.socialIcons" />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
