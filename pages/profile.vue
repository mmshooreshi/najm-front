<script setup lang="ts">
import { ref } from 'vue'
import AuthHeader from '~/components/auth/AuthHeader.vue'
import BaseInput from '~/components/Base/BaseInput.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import { useAuth } from '~/composables/useAuth'
import { useAuthAPI } from '~/composables/useAuthAPI'
import { useNavDirection } from '~/composables/useNavDirection'
import { useAuthUIData } from '~/composables/ui/authUI'
const {authUIData} = useAuthUIData()
const errorMessage = ref('')      // ← new

const nav = useNavDirection()
const { user, setUser, token, isAuthenticated } = useAuth()
const { updateUser } = useAuthAPI()

const fname = ref(user.value.name)
const lname = ref(user.value.familyName)
const router = useRouter()

const isLoading = ref(false)

async function complete() {
  if (!fname.value || !lname.value) return
  // Update user profile (replace this with a real API call)
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Call the updateUser API to update the profile in PocketBase
    await updateUser(user.value, fname.value, lname.value)
    router.push('/')  // Navigate after successful update
  } catch (err: any) {
    errorMessage.value = err.message || 'خطا در ویرایش حساب کاربری. لطفا دوباره تلاش کنید.' 

    console.error('Error during profile update:', err)
  } finally {
    isLoading.value = false
  }
}

definePageMeta({
  middleawre: 'auth',
  name: 'profile',
  layout: 'auth',
})
</script>


<template>
  <div class="space-y-9  bg-transparent px-4 py-0 w-full">
    <AuthHeader icon="profile-page-icon" :title="authUIData.profile.heading"
      :subtitle="authUIData.profile.subheading" />

    <form @submit.prevent="complete" class="space-y-6">
      <div class="space-y-2">
        <BaseInput class="z-10  !placeholder-black/40 !focus:placeholder-black/20" persian  dir="ltr" position="left" v-model="fname"  :placeholder="authUIData.profile.namePlaceholder" />
        <BaseInput class="z-0  !placeholder-black/40 !focus:placeholder-black/20" persian  dir="ltr" position="left" v-model="lname"   :placeholder="authUIData.profile.familyNamePlaceholder" />
      </div>

      <BaseButton type="submit" :loading="isLoading" :disabled="!fname || !lname">
        {{authUIData.profile.okButtonLabel}}
      </BaseButton>
    </form>


    <p
      v-motion-pop-visible-once
        v-show="errorMessage"
        class="mt-2 text-center text-sm text-red-600"
      >
        {{ errorMessage }}
      </p>

    <p class="mt-6 underline text-center text-xs text-[#797B7D] cursor-pointer active:text-blue hover:text-black">{{authUIData.profile.skipButtonLabel}}</p>
  </div>
</template>
