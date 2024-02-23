<script lang="ts">
	import { pwaInfo } from 'virtual:pwa-info'; 
	import MungedEmailLink from '$lib/components/MungedEmailLink.svelte';
	import '../styles/base.scss';
	import '../styles/layouts.scss';
	import '../styles/utilities.scss';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '' 
</script>

<svelte:head> 
 	{@html webManifestLink} 
</svelte:head>

<slot />
<footer class="container">
	<small>
		Created by <a class="secondary" href="https://tylermercer.net">Tyler Mercer</a>. Got feedback? <MungedEmailLink class="secondary">Email me!</MungedEmailLink>
	</small>
</footer>
