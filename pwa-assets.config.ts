import {
  defineConfig,
  minimal2023Preset as preset
} from '@vite-pwa/assets-generator/config'
import {
  getThemeColor,
  interpolateThemeColorIntoAssets,
} from './src/plugins/pwa-assets/update-pwa-asset-color';

const color = getThemeColor();

interpolateThemeColorIntoAssets();

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
        background: color
      }
    }
  },
  images: ['public/logo.svg']
})