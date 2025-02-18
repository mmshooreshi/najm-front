<template>
    <div class="p-6">
      <SelectBox v-model="selectedValue" :options="options">
        <template #option="{ option }">
          <!-- Custom option UI -->
          <span :class="['flex items-center space-x-2', option.value === selectedValue ? 'text-green-700 font-bold' : 'text-gray-700']">
            <span>{{ option.label }}</span>
            <span v-if="option.value === selectedValue">✅</span>
          </span>
        </template>
      </SelectBox>
  
      <p class="mt-4 text-gray-600">انتخاب شده: {{ selectedValue }}</p>
    </div>
  </template>
  
  <script setup>
  import SelectBox from "@/components/new/SelectBox.vue";
  import { ref } from "vue";
  
  const selectedValue = ref(null);
  
  const options = [
    { label: "بازار مصرفی", value: "market" },
    { label: "دسته‌بندی", value: "category" },
    { label: "محصولات جدید", value: "new-products" }
  ];
  </script>
  