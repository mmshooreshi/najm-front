<!-- pages/verify.vue (step 2) -->
<script setup lang="ts">
import AuthHeader from '~/components/auth/AuthHeader.vue'
import OtpInput from '~/components/auth/OtpInput.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import { useAuth } from '~/composables/useAuth'
import { toPersianDigits } from '~/utils/digits'

const router = useRouter()
const { identifier, token } = useAuth()
const code = ref('')


async function verifyCode() {
    if (code.value.length !== 6) return
    // TODO: verify code with backend
    token.value = 'mock-jwt'
    await new Promise((r) => setTimeout(r, 300))
    router.push({ name: 'profile' })
}

definePageMeta({ layout: 'auth' })

</script>

<template>
    <div class="space-y-9 rounded-3xl bg-white px-9 pb-10 pt-14 shadow">
        <AuthHeader icon="mdi:key" title="کد تایید رو وارد کن"
            :subtitle="`${toPersianDigits(identifier.value)} به شماره شما ارسال شد`" />

        <OtpInput v-model="code" persian  :length="6" />

        <BaseButton :disabled="code.length !== 6" @click="verifyCode">تایید</BaseButton>

        <p class="mt-4 text-center text-xs text-[#797B7D]">دریافت مجدد کد ۱:۳۴ دقیقه دیگر</p>
    </div>
</template>

<script lang="ts">
export default {
    layout: 'auth',
    name: 'verify',
}
</script>
