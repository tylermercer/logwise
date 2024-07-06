<script lang="ts">
	import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
	import Entry from '$lib/components/LogEntry.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import db from '$lib/db';
	import liveQueryAsStore from '$lib/util/dexie/liveQueryAsStore';
	import { derived, writable } from 'svelte/store';

	const PAGE_SIZE = 10;

	const getPageLiveQuery = (pageIndex: number) =>
		liveQueryAsStore(
			() =>
				db.entries
					.orderBy('displayDatetime')
					.reverse()
					.offset(PAGE_SIZE * pageIndex)
					.limit(PAGE_SIZE)
					.toArray(),
			[]
		);

	const pagesStoreOfStores = writable([getPageLiveQuery(0)]);

	$: pages = derived($pagesStoreOfStores, (x) => x);

	let nextPageToLoad = 1;

	const loadNextPage = () =>
		pagesStoreOfStores.update((a) => [...a, getPageLiveQuery(nextPageToLoad++)]);
</script>

<svelte:head>
	<title>Log</title>
</svelte:head>
<HeaderBar>
	<h1>Log</h1>
</HeaderBar>
<main class="u-guttered">
	<ul class="entries-list l-column l-space-m">
		{#each $pages as page, i}
			{#if page}
				{#if page.length}
					{#each page as entry (entry.id)}
						<li class="entry">
							<Entry {entry}></Entry>
						</li>
					{/each}
				{:else if i === 0}
					<!-- Empty first page, show empty state -->
					<li class="nothing-more">
						There's nothing in your log yet. Get started by
						<a href="/app/logs/new">creating a log</a>.
					</li>
				{:else}
					<li class="nothing-more">Nothing more to show</li>
				{/if}
			{:else}
				<li><span aria-busy="true">Loading...</span></li>
			{/if}
		{/each}
	</ul>
	<InfiniteScroll on:loadMore={loadNextPage} hasMore={!!$pages.at(-1)?.length} />
</main>

<style lang="scss">
	.entries-list {
		padding-left: 0;
		& > li {
			list-style-type: none;
			margin-bottom: 2rem;
		}
	}
	// Hide subsequent pages after the end marker, e.g. when the user logs out
	.nothing-more ~ li {
		display: none;
	}
</style>
