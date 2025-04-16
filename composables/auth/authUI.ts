// File: composables/authUI.ts
import { ref, computed } from 'vue'
import { useFetch } from '#app'

export interface AuthUIData {
  tabLoginTitle: string
  tabSignupTitle: string
  headingLogin: string
  subheadingLogin: string
  headingSignup: string
  subheadingSignup: string
  phoneEmailPlaceholder: string
  buttonLabel: string
  orLabel: string
  socialIcons: Array<{
    alt: string
    src: string
  }>
}

// Predefined defaults matching the Figma design.
const defaultAuthUIData: AuthUIData = {
  tabLoginTitle: 'ورود به حساب',
  tabSignupTitle: 'ساخت حساب جدید',
  headingLogin: 'ورود به حساب کاربری',
  subheadingLogin:'دسترسی سریع به سفارش‌ها، پیگیری وضعیت و خدمات اختصاصی',
  headingSignup: 'ثبت نام کنید',
  subheadingSignup: 'برای ایجاد یک حساب جدید، اطلاعات زیر را وارد کنید.',
  phoneEmailPlaceholder: 'ایمیل یا شماره تلفن خود را وارد کنید',
  buttonLabel: 'دریافت کد',
  orLabel: 'یا',
  socialIcons: [
    { alt: 'Google', src: '/icons/auth/google-auth-icon.svg' },
    { alt: 'Apple', src: '/icons/auth/apple-auth-icon.svg' },
    { alt: 'Microsoft', src: '/icons/auth/microsoft-auth-icon.svg' }
  ]
}

// Immediately return defaults while silently fetching backend data.
export function useAuthUIData() {
  const { data } = useFetch<AuthUIData>('/api/authui', {
    key: 'auth-ui',
    default: () => defaultAuthUIData,
    transform: (res) => res
  })

  return {
    authUIData: computed(() => data.value || defaultAuthUIData)
  }
}
