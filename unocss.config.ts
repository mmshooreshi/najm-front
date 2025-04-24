// uno.config.ts
import {  presetAttributify, presetUno, presetIcons, transformerDirectives } from 'unocss';

// import { presetMagicss } from 'unocss-preset-magicss';
import { animatedUno } from 'animated-unocss'
import { presetWind3, defineConfig } from 'unocss'

export default defineConfig({
  // Define utility shortcuts for reusability
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'grid-121': 'grid grid-cols-[1fr_2fr_1fr] gap-3',
    'flex-stack': 'flex flex-col-reverse  gap-4',

  },

  // Custom theme configurations
  theme: {
    extend: {
    
    
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
      black: '#2F3136',
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
  }
},


  // Presets for additional functionality
  presets: [
    presetWind3(),
    // presetAttributify(), 
    // presetIcons(), 

    animatedUno(),

    // presetMagicss()
  ],

  // Enable UnoCSS transformers
  // transformers: [transformerDirectives()],
});


