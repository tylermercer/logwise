<script lang="ts">
	import EntriesList from '$lib/components/entries/EntriesList.svelte';
	import LogEntry from '$lib/components/entries/LogEntry.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import Tooltip from '$lib/components/util/Tooltip.svelte';
	import PlusIcon from 'virtual:icons/teenyicons/add-outline';
	import type { PageData } from './$types';
	import getAllEntriesForLogPaginated from '$lib/db/queries/getAllEntriesForLogPaginated';

	export let data: PageData;
	$: log = data.log;

	const query = (pageIndex: number, pageSize: number) =>
		getAllEntriesForLogPaginated(log, pageIndex, pageSize);
</script>

<svelte:head>
	<title>Log</title>
</svelte:head>
<HeaderBar>
	<h1>{log.name}</h1>
	<svelte:fragment slot="actions">
		<Tooltip text="Add Entry">
			<a class="btn-edit btn-icon" role="button" href={`/app/logs/${log.id}/new-entry`}>
				<PlusIcon />
			</a>
		</Tooltip>
	</svelte:fragment>
</HeaderBar>
{#key log}
	<EntriesList paginatedQuery={query}>
		<a slot="entry" let:entry href="/app/logs/{entry.log.id}/{entry.id}" class="u-link-block">
			<LogEntry {entry}></LogEntry>
		</a>
		<span slot="empty">
			There's nothing in your log yet.
			<a href="/app/logs/{log.id}/new-entry">Make an entry</a>
		</span>
	</EntriesList>
{/key}
