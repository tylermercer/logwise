<script lang="ts">
	import { goto } from '$app/navigation';
	import EntriesList from '$lib/components/entries/EntriesList.svelte';
	import LogEntry from '$lib/components/entries/LogEntry.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import getAllEntriesPaginated from '$lib/db/queries/getAllEntriesPaginated';
	import type { ExtendedEntry } from '$lib/db/types/ExtendedEntry';
	import mouseClickNoDrag from '$lib/util/actions/mouseClickNoDrag';
	import type { PageData } from './$types';
	
	export let data: PageData;

	const onDelegatedEntryCick = (entry: ExtendedEntry) =>
		goto(`/app/logs/${entry.log.id}/${entry.id}`);
</script>

<svelte:head>
	<title>Logwise</title>
</svelte:head>
<HeaderBar>
	<h1>Logwise</h1>
</HeaderBar>
{#if data.shouldRenderShell}
	<main class="u-guttered" aria-busy="true"></main>
{:else}
	<EntriesList paginatedQuery={getAllEntriesPaginated}>
		<div
			slot="entry"
			let:entry
			use:mouseClickNoDrag
			on:click-without-drag={() => onDelegatedEntryCick(entry)}
		>
			<LogEntry {entry} showLogName showEntryLink></LogEntry>
		</div>
		<span slot="empty">
			There's nothing here yet. Get started by <a href="/app/logs/new">creating a log</a>.
		</span>
	</EntriesList>
{/if}
