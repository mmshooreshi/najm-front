<template>
    <div class="container">
      <h1>Enhanced Buttons</h1>
      <ButtonComponent class="text-d4 text-demibold text-base hover:tracking-wide  bg-[#014439]/100  bg-opacity-90 text-white/100 hover:bg-opacity-100 py-[20px] px-[90px]" label="با امکانات ما آشنا شو" @clicked="handleSubmit" />

    </div>
  </template>
  
  <script setup>
  import ButtonComponent from "@/components/re/Btn.vue";
  
  const handleSubmit = () => {
    console.log("Button clicked!");
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  </style>
  