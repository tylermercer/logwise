<script lang="ts">
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import db from '$lib/db';
	import { DB_TRUE, type FormId, type FormRaw } from '$lib/db/types';
	import { liveQuery } from 'dexie';

	let logs = liveQuery(async () => {
		const fetchedLogs = await db.logs.where('isArchived').equals(DB_TRUE).toArray();
		const fetchedForms = await db.forms
			.where('id')
			.anyOf(fetchedLogs.map((l) => l.currentFormId))
			.toArray();

		const formsById = fetchedForms.reduce((acc, cur) => {
			acc.set(cur.id, cur);
			return acc;
		}, new Map<FormId, FormRaw>());

		return fetchedLogs
			.sort((a, b) => a.name.localeCompare(b.name))
			.map((l) => ({
				...l,
				form: formsById.get(l.currentFormId)!
			}));
	});
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
			<p>No archived logs.</p>
		{/if}
	{:else}
		<p class="loader"><span aria-busy={!$logs}>Loading...</span></p>
	{/if}
</main>

<style lang="scss">
    main {
        padding: 0;
    }
</style>