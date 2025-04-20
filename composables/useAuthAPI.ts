// composables/useAuthAPI.ts
import PocketBase from 'pocketbase'
import { useAuth } from './useAuth'

const pb = new PocketBase('https://aisland.co/najm/')

export function useAuthAPI() {
  const { setIdentifier, setToken, setUser } = useAuth()

  // Log every step aggressively for debugging
  console.log("Initializing useAuthAPI...")

  // Step 1: Check if user exists, create user if not
// composables/useAuthAPI.ts
const createUser = async (email: string, phone: string) => {
    try {
      console.log(`Attempting to create user with email: ${email} and phone: ${phone}`)
  
      // Create the user with all required fields
      const data = {
        address: "",
        avatar: "",
        // collectionId: "najmusers",
        // collectionName: "najmusers",
        company: "",
        // created: "2025-04-20 13:48:10.436Z",
        email: email,
        emailVisibility: false,
        familyName: "TestFName",
        // id: "8b9up3k36f8v2qx",
        name: "TestName",
        phone: phone,
        role: "",
        socialMediaHandles: null,
        // updated: "2025-04-20 13:48:10.436Z",
        verified: false,
        password: "123456799",
        passwordConfirm: "123456799",
      }
  
              
        // email: email,
        // password: "12345678",  // This should be securely handled in a real case
        // passwordConfirm: "12345678", // Ensure password and confirm match
        // emailVisibility: true,
        // verified: true,  // Set this to a boolean value, not a string
        // name: "Test",  // You can replace or customize this
        // familyName: "User", // Replace or customize
        // company: "Test Company", // Optional
        // role: "user", // Set a default role
        // address: "User Address", // Optional
        // socialMediaHandles: {},  // Optional or empty
        // phone: phone // Use the phone number

      const newUser = await pb.collection('najmusers').create(data)
  
      console.log('User created successfully:', newUser)
      return newUser
    } catch (err) {
      console.error('Error during user creation:', err)
    }
  }
  

  // Step 2: Send OTP request
  const sendOTPRequest = async (email: string) => {
    try {
      console.log(`Sending OTP request for email: ${email}`)
      const req = await pb.collection('najmusers').requestOTP(email)
      console.log('OTP request successful, received otpId:', req.otpId)
      setIdentifier(email)  // Store email as identifier for verification
      return req.otpId  // Return otpId for the verification step
    } catch (err) {
      console.error('Failed to send OTP request:', err)
      throw new Error('Failed to send OTP request')
    }
  }

  // Step 3: Authenticate the user with OTP
  const authenticateWithOTP = async (otpId: string, otp: string) => {
    try {
      console.log(`Authenticating with OTP for otpId: ${otpId} and OTP: ${otp}`)
      const authData = await pb.collection('najmusers').authWithOTP(otpId, otp)
      const { token, record } = authData

      console.log('Authentication successful. Token:', token, 'User:', record)

      setToken(token)  // Store the JWT token
      setUser(record)  // Store the user data in the state
      return { success: true }
    } catch (err) {
      console.error('Failed to authenticate with OTP:', err)
      return { success: false }
    }
  }

    // Step 4: Update User's Name (firstName and lastName)
    const updateUser = async (userId: string, firstName: string, lastName: string) => {
        try {
          console.log(`Updating user profile with firstName: ${firstName}, lastName: ${lastName}`)
      
          const updatedUser = await pb.collection('najmusers').update(userId, {
            name: firstName,
            familyName: lastName,
          })
      
          console.log('User updated successfully:', updatedUser)
          setUser(updatedUser)  // Update the user in the state
          return updatedUser
        } catch (err) {
          console.error('Failed to update user:', err)
          throw new Error('Failed to update user')
        }
      }

      
      interface ValidationError {
        code: string;
        message: string;
      }
      
      interface CreateUserError {
        data: {
          phone: ValidationError;
        };
        message: string;
        status: number;
      }
      
      const loginOrRegister = async (email: string, phone: string) => {
        console.log(`Starting login/register process for email: ${email} and phone: ${phone}`)
      
        try {
          // Step 1: Check if user exists using getList
          const result = await pb.collection('najmusers').getList(1, 50, { filter: `email="${email}"` })
      
          if (result.items && result.items.length > 0) {
            console.log(`User found with email: ${email}. Proceeding to OTP request...`)
          } else {
            console.log(`User not found with email: ${email}. Proceeding to create user...`)
            
            try {
              // Attempt to create the user
              await createUser(email, phone)
              console.log('User created successfully or it was existing, be har hal ok e')
            } catch (err) {
                console.log(err)

              // If the error is a validation error indicating phone is not unique, log in instead
              if ((err as CreateUserError).data && (err as CreateUserError).data.phone?.code === 'validation_not_unique') {
                console.log('Phone number already exists. Proceeding to login instead.')
                
                // Step 2: Request OTP (login process)
                const otpId = await sendOTPRequest(email)
                return otpId  // Proceed to OTP request
              } else {
                // Rethrow other errors
                console.error('Error during user creation:', err)
                throw new Error('Login/Register failed')
              }
            }
          }
      
          // Step 2: Request OTP if user exists (if no errors during registration)
          const otpId = await sendOTPRequest(email)
          return otpId
        } catch (err) {
          console.error('Error in login or registration process:', err)
          throw new Error('Login/Register failed')
        }
      }
      
  
  return {
    createUser,
    sendOTPRequest,
    authenticateWithOTP,
    updateUser,
    loginOrRegister
  }
}
