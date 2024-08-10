<script lang="ts">
	import EntriesList from '$lib/components/entries/EntriesList.svelte';
	import LogEntry from '$lib/components/entries/LogEntry.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import getAllEntriesPaginated from '$lib/db/queries/getAllEntriesPaginated';
</script>

<svelte:head>
	<title>Unified Log</title>
</svelte:head>
<HeaderBar>
	<h1>Unified Log</h1>
</HeaderBar>
<EntriesList paginatedQuery={getAllEntriesPaginated}>
	<a slot="entry" let:entry href="/app/logs/{entry.log.id}/{entry.id}" class="u-link-block">
		<LogEntry {entry} showLogName></LogEntry>
	</a>
	<span slot="empty">
		There's nothing here yet. Get started by <a href="/app/logs/new">creating a log</a>.
	</span>
</EntriesList>
