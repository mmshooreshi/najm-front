<template>
    <div class=" mx-auto mt-8 py-8">
      <!-- User Profile Section -->
      <div v-if="user" class="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-max mx-auto">
        <h1 class="text-xl font-semibold text-center text-gray-800 mb-6">User Profile</h1>
  
        <div class="space-y-6 text-xs rtl">
          <!-- User Information -->
          <div class="grid grid-cols-2 gap-4">
            <div class="font-medium text-gray-700">Name:</div>
            <div class="text-gray-600">{{ user.name }} {{ user.familyName }}</div>
  
            <div class="font-medium text-gray-700">Email:</div>
            <div class="text-gray-600">{{ user.email }}</div>
  
            <div class="font-medium text-gray-700">Phone:</div>
            <div class="text-gray-600">{{ user.phone }}</div>
  
            <div class="font-medium text-gray-700">Identifier:</div>
            <div class="text-gray-600">{{ identifier }}</div>
  
            <div class="font-medium text-gray-700">OTP ID:</div>
            <div class="text-gray-600">{{ otpId }}</div>
  
            <div class="font-medium text-gray-700">Token:</div>
            <div class="group text-gray-600">
                <div class="group-hover:invisible visible">{{ token ? 'Active' : 'Not Available' }}</div>
                <div class="-mt-4 bg-gray/10 absolute overflow-hidden text-[8px] group-hover:visible invisible"> {{token}}</div>
            </div>

  
            <div class="font-medium text-gray-700">Address:</div>
            <div class="text-gray-600">{{ user.address || 'Not Provided' }}</div>
  
            <div class="font-medium text-gray-700">Avatar:</div>
            <div class="text-gray-600">{{ user.avatar || 'No Avatar' }}</div>
  
            <div class="font-medium text-gray-700">Company:</div>
            <div class="text-gray-600">{{ user.company || 'Not Provided' }}</div>
  
            <div class="font-medium text-gray-700">Role:</div>
            <div class="text-gray-600">{{ user.role || 'Not Specified' }}</div>
  
            <div class="font-medium text-gray-700">Social Media:</div>
            <div class="text-gray-600">{{ user.socialMediaHandles ? user.socialMediaHandles : 'Not Provided' }}</div>
  
            <div class="font-medium text-gray-700">Verified:</div>
            <div class="text-gray-600">{{ user.verified ? 'Yes' : 'No' }}</div>
  
            <div class="font-medium text-gray-700">Created:</div>
            <div class="text-gray-600">{{ user.created }}</div>
  
            <div class="font-medium text-gray-700">Updated:</div>
            <div class="text-gray-600">{{ user.updated }}</div>
          </div>
        </div>
  
        <!-- Logout Button -->
        <div class="flex justify-center mt-8">
          <button @click="handleLogout" class="bg-red-500 text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-red-600 transition duration-300">
            Logout
          </button>
        </div>
      </div>
  
      <!-- Loading State -->
      <div v-else class="flex flex-col items-center justify-center space-y-4">
        <p class="text-xl text-gray-600">No user found.</p>
        <NuxtLink to="/login" class="flex items-center gap-3">
          <button @click="handleLogin" class="bg-green-500 text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-green-600 transition duration-300">
            Login / Sign Up
          </button>
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuth } from '~/composables/useAuth'  // Import the useAuth composable to access user data from the store
  import { useRouter } from 'vue-router'
  
  const { user, token, otpId, identifier, logout } = useAuth()
  const router = useRouter()
  
  // Logout functionality
  const handleLogout = () => {
    logout()
    router.push('/')  // Redirect to home page after logout
  }
  
  // For login functionality
  const handleLogin = () => {
    // handle login if necessary
  }
  </script>
  
  <style scoped>
  /* Custom styles can be added here if necessary */
  </style>
  