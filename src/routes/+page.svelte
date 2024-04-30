<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

</script>

<header class="u-guttered">
	<h1>Log Thing</h1>
</header>
{#if data.shouldRenderShell}
	<main class="u-guttered" aria-busy="true">
	</main>
{:else}
	<main class="u-guttered">
		<p><a href="/app/things">My Things</a></p>
		<p><a href="/app/log">View log</a></p>
	</main>
{/if}
