<script lang="ts">
	import Entry from '$lib/components/entries/LogEntry.svelte';
	import InfiniteScroll from '$lib/components/util/InfiniteScroll.svelte';
	import type { LogRaw } from '$lib/db';
	import getAllEntriesForLogPaginated from '$lib/db/queries/getAllEntriesForLogPaginated';
	import getAllEntriesPaginated from '$lib/db/queries/getAllEntriesPaginated';
	import liveQueryAsStore from '$lib/util/dexie/liveQueryAsStore';
	import { derived, writable } from 'svelte/store';

	const PAGE_SIZE = 10;

	export let log: LogRaw | undefined = undefined;

	const query = log
		? (pageIndex: number) => getAllEntriesForLogPaginated(log, pageIndex, PAGE_SIZE)
		: (pageIndex: number) => getAllEntriesPaginated(pageIndex, PAGE_SIZE);

	const getPageLiveQuery = (pageIndex: number) => liveQueryAsStore(() => query(pageIndex), []);

	const pagesStoreOfStores = writable([getPageLiveQuery(0)]);

	$: pages = derived($pagesStoreOfStores, (x) => x);

	let nextPageToLoad = 1;

	const loadNextPage = () =>
		pagesStoreOfStores.update((a) => [...a, getPageLiveQuery(nextPageToLoad++)]);
</script>

<main class="u-guttered">
	<ul class="entries-list l-column l-space-m">
		{#each $pages as page, i}
			{#if page}
				{#if page.length}
					{#each page as entry (entry.id)}
						<li class="entry">
							<a href="/app/logs/{entry.log.id}/{entry.id}" class="u-link-block">
								<Entry {entry} form={entry.form} log={entry.log}></Entry>
							</a>
						</li>
					{/each}
				{:else if i === 0}
					<!-- Empty first page, show empty state -->
					<li class="nothing-more">
						{#if log}
							There's nothing in your log yet.
							<a href="/app/logs/{log.id}/new-entry">Make an entry</a>
							{:else}
							There's nothing here yet. Get started by <a href="/app/logs/new">creating a log</a>.
						{/if}
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
