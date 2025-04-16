import { computed } from 'vue'
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

const defaultAuthUIData: AuthUIData = {
  tabLoginTitle: 'ورود به حساب',
  tabSignupTitle: 'ساخت حساب جدید',
  headingLogin: 'ورود به حساب کاربری',
  subheadingLogin: 'دسترسی سریع به سفارش‌ها، پیگیری وضعیت و خدمات اختصاصی',
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

export function useAuthUIData() {
  const { data } = useFetch<{ items: Array<{ uiData: AuthUIData }> }>(
    'http://65.108.80.205:8090/api/collections/pages/records?filter=slug="login"',
    {
      key: 'auth-ui',
      default: () => ({
        items: [{ uiData: defaultAuthUIData }]
      })
    }
  )

  const authUIData = computed(() => data.value?.items?.[0]?.uiData || defaultAuthUIData)

  return {
    authUIData
  }
}
