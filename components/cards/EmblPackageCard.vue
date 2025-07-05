<!-- components/cards/EmblPackageCard.vue -->
<template>
    <CardOverlayWrapper :items="card.items">
      <!-- Your card markup here -->
      <NuxtImg :src="card.image" class="object-cover w-full h-full rounded-xl"/>
      <div class="absolute bottom-4 right-4 bg-white/70 p-2 rounded">
        {{ card.text }}
      </div>
    </CardOverlayWrapper>
  </template>
  
  <script setup>
  import CardOverlayWrapper from '@/components/CardOverlayWrapper.vue'
  
  const card = {
    image: '/images/main/1.png',
    text: 'Example card',
    items: [
      // overlay specs are %-based by default
      { id:1, src:'/icons/star.png', specs:{ x:5, y:10, width:10, height:10, rotate:15 } },
      { id:2, src:'/icons/badge.png', specs:{ x:'80px', y:'20px', width:'50px', height:'50px', rotate:-5 } }
    ]
  }
  </script>
  