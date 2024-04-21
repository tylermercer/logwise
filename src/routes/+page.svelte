<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

</script>

<header class="container">
	<h1>Log Thing</h1>
</header>
{#if data.shouldRenderShell}
	<main class="container" aria-busy="true">
	</main>
{:else}
	<main class="container">
		<p><a href="/app/things">My Things</a></p>
		<p><a href="/app/log">View log</a></p>
	</main>
{/if}
