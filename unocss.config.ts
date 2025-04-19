// uno.config.ts
import { defineConfig, presetAttributify, presetUno, presetIcons, transformerDirectives } from 'unocss';
// import { presetMagicss } from 'unocss-preset-magicss';

export default defineConfig({
  // Define utility shortcuts for reusability
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
  },

  // Custom theme configurations
  theme: {
    transitionTimingFunction: {
      // Springy cubic‑bezier
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },

    colors: {
      primary: '#0070f3',
      secondary: '#ff0000',
      black: '#2F3136',
    },

    animation: {
      keyframes: {
        custom: '{0%, 100% {opacity:1} 50% {opacity:.5}}',
      },
      durations: {
        custom: '2s',
      },
      timingFns: {
        custom: 'cubic-bezier(0.4,0,.6,1)',
      },
      properties: {
        custom: { 'transform-origin': 'center' },
      },
      counts: {
        custom: 2,
      },
      category: {
        custom: 'custom',
      },
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
  },

  // Presets for additional functionality
  presets: [
    presetUno(), 
    presetAttributify(), 
    presetIcons(), 
    // presetMagicss()
  ],

  // Enable UnoCSS transformers
  transformers: [transformerDirectives()],
});


