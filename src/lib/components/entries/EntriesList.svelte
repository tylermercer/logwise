<script lang="ts">
	import InfiniteScroll from '$lib/components/util/InfiniteScroll.svelte';
	import type { ExtendedEntry } from '$lib/db/types/ExtendedEntry';
	import liveQueryAsStore from '$lib/util/dexie/liveQueryAsStore';
	import { derived, writable } from 'svelte/store';

	const PAGE_SIZE = 10;

	export let paginatedQuery: (pageIndex: number, pageSize: number) => Promise<ExtendedEntry[]>;

	const getPageLiveQuery = (pageIndex: number) =>
		liveQueryAsStore(() => paginatedQuery(pageIndex, PAGE_SIZE), undefined);

	const pagesStoreOfStores = writable([getPageLiveQuery(0)]);

	$: pages = derived($pagesStoreOfStores, (x) => x);

	let nextPageToLoad = 1;

	const getHasMore = (pages: (ExtendedEntry[] | undefined)[]): boolean => {
		const last = pages.at(-1);
		return last != null && !!last.length;
	};

	$: hasMore = getHasMore($pages);

	const loadNextPage = () =>
		pagesStoreOfStores.update((a) => [...a, getPageLiveQuery(nextPageToLoad++)]);
</script>

<main class="u-guttered">
	<ul class="entries-list l-column l-space-m">
		{#each $pages as page, i}
			{#if page != null}
				{#if page.length}
					{#each page as entry (entry.id)}
						<li class="entry">
							<slot name="entry" {entry} />
						</li>
					{/each}
				{:else if i === 0}
					<!-- Empty first page, show empty state -->
					<li class="nothing-more">
						<slot name="empty" />
					</li>
				{:else}
					<li class="nothing-more">Nothing more to show</li>
				{/if}
			{:else}
				<li><span aria-busy="true">Loading...</span></li>
			{/if}
		{/each}
	</ul>
	<InfiniteScroll on:loadMore={loadNextPage} {hasMore} />
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
