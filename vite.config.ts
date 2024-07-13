import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite'
import generateRadixColorsSass, { GENERATE_RADIX_COLORS_SIGNATURE } from './src/plugins/sass/radix-ui-colors/generateRadixColorsSassCustomFunction';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	css: {
		preprocessorOptions: {
			scss: {
				functions: {
					[GENERATE_RADIX_COLORS_SIGNATURE]: generateRadixColorsSass
				}
			}
		}
	}
});
