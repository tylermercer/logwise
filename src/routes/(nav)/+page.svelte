<script lang="ts">
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
import type { PageData } from './$types';
	export let data: PageData;

</script>

<svelte:head>
	<title>Logwise</title>
</svelte:head>
<HeaderBar>
	<h1>Logwise</h1>
</HeaderBar>
{#if data.shouldRenderShell}
	<main class="u-guttered" aria-busy="true">
	</main>
{:else}
	<main class="u-guttered l-column l-space-xs">
		<p>Put something useful here</p>
	</main>
{/if}
