// unocss.config.ts
// uno.config.ts
import {  presetAttributify, presetUno, presetIcons, transformerDirectives } from 'unocss';
// import { presetMagicss } from 'unocss-preset-magicss';
import { animatedUno } from 'animated-unocss'
// import presetWind3 from '@unocss/preset-wind3'
import { defineConfig, presetWind } from 'unocss'
// import presetWind4 from '@unocss/preset-wind4'

export default defineConfig({
  // Define utility shortcuts for reusability
  shortcuts: {
    'title-panbe': 'tracking-[5px] group-hover:tracking-[0px] group-hover:text-black/60 font-mono scale-90 group-hover:scale-100 transition-all group-hover:mx-4 text-black/30 cursor-pointer',
    'd':'bg-red',
    'bok':'w-full px-8 mx-auto',
    'flex-center': 'flex justify-center items-center',
    'grid-121': 'grid grid-cols-[1fr_2fr_1fr] gap-3',
    'flex-stack': 'flex flex-col-reverse  gap-4',
    'pressable': 'active:bg-black/90 active:scale-95 transition duration-100 font-mono cursor-pointer rounded-2xl text-center flex items-center justify-around'

  },

  // Custom theme configurations
  theme: {
    // extend: {

    
    
    
      animation: {

        keyframes: {
          shimmy: '{0%, 100% { transform: rotateY(0deg) skewX(0deg); } 50% { transform: rotateY(30deg) skewX(3deg); }}',
          custom: '{0%, 100% { transform: scale(0.5); } 50% { transform: scale(1); }}',
          border:  '{100% { --border-angle: 360deg; }}'
        },
        durations: {
          shimmy: '1s',
          custom: '1s',
          border: '4s',
        },
        timingFns: {
          shimmy: 'cubic-bezier(0.4,0,.6,1)',
          custom: 'cubic-bezier(0.4,0,.6,1)',
          border: 'linear',

        },
        properties: {
          shimmy: { 'transform-origin': 'center' },
          custom: { 'transform-origin': 'center' },
        },
        counts: {
          shimmy: 'infinite',
          custom: 'infinite',
          border: 'infinite',

        },
            },
      
      // transitionTimingFunction: {
      //   // Springy cubic‑bezier
      //   spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      // },


    colors: {
      primary: '#0070f3',
      secondary: '#ff0000',
      najmgreen: '#014439',
      najmgrey: '#EBF0F3',
      najmborder: '#C2D3D1',
      najmbacktop: '#E7F0F2',
      najmback: '#F8FAFC',
      // black: '#2F3136',
    },




  

    // Responsive breakpoints
    breakpoints: {
      xs: '320px',
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
      '4xl': '2560px',
    },
  // }
},


  // Presets for additional functionality
  presets: [
    presetWind(),
    // presetIcons(), 
    animatedUno(),
    presetUno(),
    presetAttributify(),



    // presetMagicss()
  ],

  // Enable UnoCSS transformers
  transformers: [transformerDirectives()],
});


