<script lang="ts">
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import getAllLogsByIsArchived from '$lib/db/queries/getAllLogsByIsArchived';
	import { DB_TRUE } from '$lib/db/types';
	import { liveQuery } from 'dexie';

	let logs = liveQuery(() => getAllLogsByIsArchived(DB_TRUE));
</script>

<svelte:head>
	<title>Archived Logs</title>
</svelte:head>
<HeaderBar>
	<h1>Archived Logs</h1>
</HeaderBar>
<main class="u-guttered">
	{#if $logs}
		{#if $logs.length}
			<ul class="list l-column l-space-none">
				{#each $logs as log (log.id)}
					<li class="form">
						<a href="/app/logs/{log.id}" class="u-item-link u-break-words">
							{log.name || '(Unnamed)'}
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="u-item-link">No archived logs.</p>
		{/if}
	{:else}
		<p class="u-item-link"><span aria-busy={!$logs}>Loading...</span></p>
	{/if}
</main>

<style lang="scss">
    main {
        padding: 0;
    }
</style>