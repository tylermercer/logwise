<script lang="ts">
	import { liveQuery } from 'dexie';
	import db, { type FormId } from '$lib/db';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import Entry from '$lib/components/LogEntry.svelte';

	let entries = liveQuery(() => db.entries.orderBy('displayDatetime').reverse().limit(10).toArray());
</script>

<svelte:head>
	<title>Log</title>
</svelte:head>
<HeaderBar>
	<h1>Log</h1>
</HeaderBar>
<main class="u-guttered">
	{#if $entries}
		{#if $entries.length}
			<ul class="entries-list l-column l-space-m">
				{#each $entries as entry (entry.id)}
					<li class="entry">
						<Entry entry={entry}></Entry>
					</li>
				{/each}
			</ul>
		{:else}
			<p>
				There's nothing in your log yet.
				Get started by
				<a href="/app/logs/new">creating a log</a>.
			</p>
		{/if}
	{:else}
		<p><span aria-busy="true">Loading...</span></p>
	{/if}
</main>

<style lang="scss">
	.entries-list {
		padding-left: 0;
		& > li {
			list-style-type: none;
			margin-bottom: 2rem;
		}
	}
</style>
