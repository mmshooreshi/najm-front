<template>
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for doesn't exist.</p>
      <a href="/">Go back home</a>
    </div>
  </template>
  
  <script setup lang="ts">
  // No external dependencies
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    text-align: center;
  }
  .not-found h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .not-found p {
    margin-bottom: 1.5rem;
  }
  .not-found a {
    color: var(--primary-color);
    text-decoration: underline;
  }
  </style>