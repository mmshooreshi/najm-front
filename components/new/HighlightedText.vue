<template>
    <div class="text-container">
      <p class="text">
        یه راهکار خلاقانه برای 
        <span class="highlight highlight-yellow">چاپ</span>
        و
        <span class="highlight highlight-purple">بسته‌بندی</span>
        مورد نیاز شما
      </p>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .text-container {
    display: flex;
    justify-content: center;
    text-align: center;
  }
  
  .text {
    font-family: 'IRANSansX-D4', sans-serif;
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    color: black;
    max-width: 543px;
    position: relative;
  }
  
  /* Base styling for highlights */
  .highlight {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0px 8px;
    font-weight: 900;
    font-size: 24px;
    line-height: 36px;
    color: black;
    border-radius: 12px;
    position: relative;
    transform-origin: center;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1.2), box-shadow 0.4s ease-in-out;
  }

  /* "چاپ" Styles */
  .highlight-yellow {
    background: #F4FFD0;
    width: 61px;
    height: 36px;
    transform: rotate(-3.2deg);
  }
  
  /* "بسته‌بندی" Styles */
  .highlight-purple {
    background: #B9ADFF;
    width: 116px;
    height: 36px;
    transform: rotate(3.36deg);
  }

  /* Hover Effect: Rotate to 0deg, add shadow, slight scale-up */
  .highlight:hover {
    transform: rotate(0deg) scale(1.05);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
  }
  </style>
