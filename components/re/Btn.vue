<template>
    <button class="btn" @click="handleClick" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      <span v-else>{{ label }}</span>
    </button>
  </template>
  
  <script setup>
  defineProps({
    label: String,
    loading: Boolean,
  });
  
  defineEmits(["clicked"]);
  
  const handleClick = () => {
    if (!loading) emit("clicked");
  };
  </script>
  
  <style scoped>
  .btn {
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: 0.3s;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .spinner {
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid black;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  