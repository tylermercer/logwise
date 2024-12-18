import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
	kit: {
		adapter: adapter({
			routes: {
				include: ['/app/*'],
				exclude: ['<all>', '/app/assets/*']
			}
		}),
		paths: {
			base: '/app'
		},
		version: {
			name: process.env.PUBLIC_COMMIT_HASH,
			pollInterval: 60*1000
		}
	}
};
export default config;
