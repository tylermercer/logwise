<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import Link from '$lib/components/Link.svelte';

</script>

<header class="container">
	<h1>Log Thing</h1>
</header>
{#if data.shouldRenderShell}
	<main class="container" aria-busy="true">
	</main>
{:else}
	<main class="container">
		<p><Link href="/things">My Things</Link></p>
		<p><Link href="/log">View log</Link></p>
	</main>
{/if}
