<script lang="ts">
	import liveQueryAsStore from '$lib/util/dexie/liveQueryAsStore';
	import db from '$lib/db';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import Entry from '$lib/components/LogEntry.svelte';
	import { writable, derived } from 'svelte/store';

	const PAGE_SIZE = 10;

	const getPageLiveQuery = (pageIndex: number) =>
		liveQueryAsStore(() =>
			db.entries
				.orderBy('displayDatetime')
				.reverse()
				.offset(PAGE_SIZE * pageIndex)
				.limit(PAGE_SIZE)
				.toArray()
		);

	const pagesStoreOfStores = writable([getPageLiveQuery(0)]);

	$: pages = derived($pagesStoreOfStores, (x) => x);
</script>

<svelte:head>
	<title>Log</title>
</svelte:head>
<HeaderBar>
	<h1>Log</h1>
</HeaderBar>
<main class="u-guttered">
	{#each $pages as page}
		{#if page}
			{#if page.length}
				<ul class="entries-list l-column l-space-m">
					{#each page as entry (entry.id)}
						<li class="entry">
							<Entry {entry}></Entry>
						</li>
					{/each}
				</ul>
			{:else}
				<p>
					There's nothing in your log yet. Get started by
					<a href="/app/logs/new">creating a log</a>.
				</p>
			{/if}
		{:else}
			<p><span aria-busy="true">Loading...</span></p>
		{/if}
	{/each}
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
