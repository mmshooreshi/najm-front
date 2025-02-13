// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives
} from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center'
    }
  ],
  theme: {
    colors: {
      primary: '#0070f3',
      secondary: '#ff0000',
      black: '#2F3136'
    },
    breakpoints: {
      xs: '320px',
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
      '4xl': '2560px'
    },
  },
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives()]
})
