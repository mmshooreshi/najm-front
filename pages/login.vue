<!-- // File: pages/AuthFormPage.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import AuthSegmentedTabs from '~/components/auth/AuthSegmentedTabs.vue'
import AuthSocialButtons from '~/components/auth/AuthSocialButtons.vue'
import { useAuthUIData } from '~/composables/auth/authUI'

const currentTab = ref<'login' | 'signup'>('login')
const phoneEmail = ref('')
const { authUIData } = useAuthUIData()

function onSubmit() {
    alert(`Submitted: ${phoneEmail.value} for ${currentTab.value}`)
}
</script>
<template>
    
    <div class="relative min-h-screen bg-[#F9FBFA] text-right rtl">
      <!-- Fixed segmented tabs -->
      <div class="fixed top-24 sm:top-16 left-0 w-full flex justify-center bg-[#F9FBFA] z-50 shadow-sm py-4">
        <div class="max-w-sm w-full px-4">
          <AuthSegmentedTabs
            v-model="currentTab"
            :loginLabel="authUIData.tabLoginTitle"
            :signupLabel="authUIData.tabSignupTitle"
          />
        </div>
      </div>
  
      <!-- Scrollable form area -->
      <div class="flex flex-col items-center pt-56 sm:pt-28 px-4"> <!-- pt-28 adds space for fixed tabs -->
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
                  <input
                    v-model="phoneEmail"
                    type="text"
                    :placeholder="authUIData.phoneEmailPlaceholder"
                    class="w-full border rounded-2xl px-6 py-5 text-xs text-demibold text-[#797B7D] focus:outline-none focus:border-primary"
                  />
                  <button
                    @click="onSubmit"
                    class="w-full bg-[#EBEBEB] rounded-2xl p-3 text-base text-demibold transition-all duration-300 hover:text-black hover:bg-primary hover:shadow-sm hover:scale-105 active:scale-95"
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
  