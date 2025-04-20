<script setup lang="ts">
import { ref } from 'vue'
import AuthHeader from '~/components/auth/AuthHeader.vue'
import BaseInput from '~/components/Base/BaseInput.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import { useAuth } from '~/composables/useAuth'
import { useAuthAPI } from '~/composables/useAuthAPI'
import { useNavDirection } from '~/composables/useNavDirection'

const nav = useNavDirection()
const { user, setUser, token } = useAuth()
const { updateUser } = useAuthAPI()

const fname = ref(user.name)
const lname = ref(user.familyName)
const router = useRouter()

const isLoading = ref(false)

async function complete() {
  if (!fname.value || !lname.value) return
  // Update user profile (replace this with a real API call)
  isLoading.value = true
  try {
    // Call the updateUser API to update the profile in PocketBase
    await updateUser(user.id, fname.value, lname.value)
    router.push('/')  // Navigate after successful update
  } catch (err) {
    console.error('Error during profile update:', err)
  } finally {
    isLoading.value = false
  }
}

definePageMeta({
  name: 'profile',
  layout: 'auth',
})
</script>


<template>
  <div class="space-y-9  bg-transparent px-4 py-0 w-full">
    <AuthHeader icon="profile-page-icon" title="پروفایلتو کامل کن"
      subtitle="دسترسی سریع به سفارش‌ها، پیگیری وضعیت و خدمات اختصاصی" />

    <form @submit.prevent="complete" class="space-y-6">
      <div class="space-y-2">
        <BaseInput class="z-10  !placeholder-black/40 !focus:placeholder-black/20" persian  dir="ltr" position="left" v-model="fname"  placeholder="نام" />
        <BaseInput class="z-0  !placeholder-black/40 !focus:placeholder-black/20" persian  dir="ltr" position="left" v-model="lname"   placeholder="نام خانوادگی" />
      </div>

      <BaseButton type="submit" :loading="isLoading" :disabled="!fname || !lname">
        ادامه
      </BaseButton>
    </form>

    <p class="mt-6 underline text-center text-xs text-[#797B7D] cursor-pointer active:text-blue hover:text-black">باشه برای بعد</p>
  </div>
</template>
