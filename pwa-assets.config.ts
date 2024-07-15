import {
  defineConfig,
  minimal2023Preset as preset
} from '@vite-pwa/assets-generator/config'
import fs from 'fs';

function getAccentColor() {
  const scssContent = fs.readFileSync('./src/styles/theme.scss', 'utf8');
  const colorMatch = scssContent.match(/\$accentColor:\s*'([^']+)';/);
  if (colorMatch && colorMatch[1]) {
    return colorMatch[1];
  } else {
    throw new Error('Accent color not found in theme file');
  }
}

const color = getAccentColor();

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