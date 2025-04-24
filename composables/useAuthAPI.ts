// composables/useAuthAPI.ts
import PocketBase from 'pocketbase'
import { useAuthStore } from './useAuth'

const pb = new PocketBase('https://aisland.co/najm/')

export function useAuthAPI() {
  const { setIdentifier, setToken, setUser, setOtpId, setPhone  } = useAuthStore()

  console.group('[useAuthAPI] Initializing useAuthAPI')
  console.log('PocketBase URL:', pb.baseUrl)
  console.groupEnd()

  /**
   * Step 1: Create a new user if not existing
   */
  const createUser = async (email: string, phone: string) => {
    console.group('[createUser] Starting')
    console.log(`Attempting to create user — email: ${email}, phone: ${phone}`)

    const data = {
      email,
      phone,
      password: '123456799',
      passwordConfirm: '123456799',
      name: '',
      familyName: '',
      company: '',
      avatar: '',
      address: '',
      role: '',
      socialMediaHandles: null,
      verified: false,
      emailVisibility: false,
    }

    try {
      const newUser = await pb.collection('najmusers').create(data)
      console.log('User created successfully:', newUser)
      console.groupEnd()
      return newUser
    } catch (devErr: any) {
      console.error('[createUser] Error during creation:', devErr)
      console.groupEnd()
      // User-friendly message in Persian
      throw new Error('خطا در ایجاد حساب کاربری. لطفاً مجدداً تلاش کنید یا با پشتیبانی تماس بگیرید.')
    }
  }

  /**
   * Step 2: Send OTP request
   */
  const sendOTPRequest = async (email: string, phone: string) => {
    console.group('[sendOTPRequest] Starting')
    console.log(`Sending OTP to email: ${email} or phone: ${phone}`)

    try {
      if (phone){
        const req = await pb.collection('najmusers').requestOTP(email)
        console.log('OTP request successful, otpId:', req.otpId)
        setPhone(phone)
        setIdentifier(email)
        console.groupEnd()
        return req.otpId
  
      } else if (email){
        const req = await pb.collection('najmusers').requestOTP(email)
        console.log('OTP request successful, otpId:', req.otpId)
        setPhone(phone)
        setIdentifier(email)
        console.groupEnd()
        return req.otpId
  

      }
    } catch (devErr: any) {
      console.error('[sendOTPRequest] Failed to send OTP:', devErr)
      console.groupEnd()
      throw new Error('خطا در ارسال کد تأیید. لطفاً دوباره تلاش کنید.')
    }
  }

  /**
   * Step 3: Authenticate with OTP
   */
  const authenticateWithOTP = async (otpId: string, otp: string) => {
    console.group('[authenticateWithOTP] Starting')
    console.log(`Verifying OTP — otpId: ${otpId}, code: ${otp}`)

    try {
      const { token, record } = await pb.collection('najmusers').authWithOTP(otpId, otp)
      console.log('Authentication successful. Token:', token, 'User record:', record)
      setToken(token)
      setUser(record)
      console.groupEnd()
      return { success: true }
    } catch (devErr: any) {
      console.error('[authenticateWithOTP] Verification failed:', devErr)
      console.groupEnd()
      return {
        success: false,
        message: 'کد تأیید اشتباه است یا منقضی شده. لطفاً دوباره بررسی کنید.',
      }
    }
  }

  /**
   * Step 4: Update user profile
   */
  const updateUser = async (userId: string, firstName: string, lastName: string) => {
    console.group('[updateUser] Starting')
    console.log(`Updating profile — userId: ${userId}, firstName: ${firstName}, lastName: ${lastName}`)

    try {
      const updated = await pb.collection('najmusers').update(userId, {
        name: firstName,
        familyName: lastName,
      })
      console.log('Profile updated successfully:', updated)
      setUser(updated)
      console.groupEnd()
      return updated
    } catch (devErr: any) {
      console.error('[updateUser] Failed to update user:', devErr)
      console.groupEnd()
      throw new Error('خطا در به‌روزرسانی پروفایل. لطفاً بعداً دوباره تلاش کنید.')
    }
  }

  /**
   * Combined: Login or Register flow
   */
  const loginOrRegister = async (email: string, phone: string) => {
    console.group('[loginOrRegister] Starting process')
    console.log(`Email: ${email}, Phone: ${phone}`)

    try {
      // Check existing user
      const list = await pb.collection('najmusers').getList(1, 50, { filter: `email="${email}"` })
      if (list.items.length > 0) {
        console.log('User exists, proceeding to OTP')
      } else {
        console.log('No user found, attempting to create one')
        try {
          await createUser(email, phone)
          console.log('User created; now sending OTP')
        } catch (createErr: any) {
          // // If phone not unique, fallback to login
          // if ((createErr as any).message.includes('validation_not_unique')) {
          //   console.warn('[loginOrRegister] Phone already in use, skipping creation')
          // } else {
          //   throw createErr
          // }
          console.warn('[loginOrRegister] createUser failed, proceeding to OTP anyway:', createErr)

        }
      }

      // Send OTP in either case
      const otpId = await sendOTPRequest(email,phone)
      console.groupEnd()
      return otpId
    } catch (devErr: any) {
      console.error('[loginOrRegister] Error in flow:', devErr)
      console.groupEnd()
      throw new Error('خطا در فرایند ورود/ثبت‌نام. لطفاً دوباره تلاش کنید.')
    }
  }

  return {
    createUser,
    sendOTPRequest,
    authenticateWithOTP,
    updateUser,
    loginOrRegister,
  }
}
