<script setup lang="ts">
interface Props {
  loginLabel: string
  signupLabel: string
  modelValue: 'login' | 'signup'
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
function changeTab(tab: 'login' | 'signup') {
  emit('update:modelValue', tab)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-between items-center gap-3  p-1 text-sm font-medium overflow-visible">
    <button
      @click="changeTab('login')"
      :class="[
        'w-1/2 px-6 py-4 rounded-xl text-nowrap transition-all duration-300 hover:text-black hover:bg-white hover:shadow-sm hover:scale-105 active:scale-95',
        props.modelValue === 'login' ? 'bg-white  text-black' : 'text-gray-500',
      ]"
    >
      {{ props.loginLabel }}
    </button>
    <button
      @click="changeTab('signup')"
      :class="[
        'w-1/2 px-6 py-4 rounded-xl text-nowrap  transition-all duration-300 hover:text-black hover:bg-white hover:shadow-sm hover:scale-105 active:scale-95',
        props.modelValue === 'signup' ? 'bg-white  text-black' : 'text-gray-500',
      ]"
    >
      {{ props.signupLabel }}
    </button>
  </div>
</template>
