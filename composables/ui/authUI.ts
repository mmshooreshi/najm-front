// composables/ui/authUI.ts
import { computed } from 'vue'
import { useFetch } from '#app'

// Define the structure for UI data for each page
export interface AuthUIData {
  login: {
    heading: string
    subheading: string
    phoneEmailPlaceholder: string
    phoneEmailFloatingLabel: string
    buttonLabel: string
    orLabel: string
    socialIcons: Array<{
      key: string
      icon: string
      alt: string
    }>
    legalText: string // Added legal text
  }
  verify: {
    heading: string
    subheading: string
    editButtonLabel: string
    okButtonLabel: string
    retryLabel: string
    retryButtonLabel: string
    phoneEmailPlaceholder: string
  }
  profile: {
    heading: string
    subheading: string
    namePlaceholder: string
    familyNamePlaceholder: string
    okButtonLabel: string
    skipButtonLabel: string
  }
}

const defaultAuthUIData: AuthUIData = {
  login: {
    heading: 'ورود یا ثبت‌نام',
    subheading: 'برای دسترسی سریع به سفارش‌ها، خدمات اختصاصی و پیگیری وضعیت، حساب کاربری می‌تواند خیلی کمک‌کننده باشد!',
    phoneEmailPlaceholder: 'مثلا ۰۹۱۲۸۴۶۲۶۴۸',
    phoneEmailFloatingLabel: 'شمارهٔ موبایل',
    buttonLabel: 'دریافت کد ورود',
    orLabel: 'یا',
    socialIcons: [
      { key: 'google', icon: '/icons/auth/google-auth-icon.svg', alt: 'Google' },
      { key: 'apple', icon: '/icons/auth/apple-auth-icon.svg', alt: 'Apple' },
      { key: 'microsoft', icon: '/icons/auth/microsoft-auth-icon.svg', alt: 'Microsoft' },
    ],
    legalText: 'با ورود یا ثبت‌نام در مجموعه نجم، تمام <a href="/faq" class="underline"> قوانین و شرایط استفاده </a> رو قبول می‌کنم.'
  },
  verify: {
    heading: 'کد تایید رو وارد کن',
    subheading: 'کد تایید، به شماره‌ی <phone> ارسال شد.',
    editButtonLabel: 'ویرایش',
    okButtonLabel: 'تایید',
    retryLabel: 'دریافت مجدد کد',
    retryButtonLabel: 'دریافت دوباره',
    phoneEmailPlaceholder: 'کد تایید را وارد کنید',
  },
  profile: {
    heading: 'پروفایلتو کامل کن',
    subheading: 'دسترسی سریع به سفارش‌ها، پیگیری وضعیت و خدمات اختصاصی',
    namePlaceholder: 'نام',
    familyNamePlaceholder: 'نام خانوادگی',
    okButtonLabel: 'ادامه',
    skipButtonLabel: 'باشه برای بعد'
  }
}

export function useAuthUIData(lang?: string) {
  const url = `https://aisland.co/najm/api/collections/pages/records?filter=slug="login"`
  console.log("url is --> ", url)
  // Fetch data for all pages in a single request
  const { data } = useFetch<{ items: Array<{ uiData: AuthUIData }> }>(
    url,
    {
      key: 'auth-ui',
      default: () => ({
        items: [{ uiData: defaultAuthUIData }]
      })
    }
  )

  // Return the computed data, or fallback to default if not found
  const authUIData = computed(() => {
    const pagesData = data.value?.items?.[0]?.uiData || defaultAuthUIData
    return pagesData
  })

  return {
    authUIData
  }
}
