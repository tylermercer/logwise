import {
  defineConfig,
  minimal2023Preset as preset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset: {
    ...preset,
    maskable: {
      ...preset.maskable,
      resizeOptions: {
        ...preset.maskable.resizeOptions,
        background: '#001347'
      }
    }
  },
  images: ['public/logo.svg']
})