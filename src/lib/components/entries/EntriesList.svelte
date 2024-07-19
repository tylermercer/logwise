<script lang="ts">
	import Entry from '$lib/components/entries/LogEntry.svelte';
	import InfiniteScroll from '$lib/components/util/InfiniteScroll.svelte';
	import db, { type EntryRaw, type FormId, type FormRaw, type LogId, type LogRaw } from '$lib/db';
	import liveQueryAsStore from '$lib/util/dexie/liveQueryAsStore';
	import { derived, writable } from 'svelte/store';

	const PAGE_SIZE = 10;

	//TODO: remove explicit typing once svelte-check supports TS 5.5 inferred type guards (on .filter)
	type ExtendedEntry = EntryRaw & { form: FormRaw; log: LogRaw };

	const getPageLiveQuery = (pageIndex: number) =>
		liveQueryAsStore(async (): Promise<ExtendedEntry[]> => {
			const entries = await db.entries
				.orderBy('displayDatetime')
				.reverse()
				.offset(PAGE_SIZE * pageIndex)
				.limit(PAGE_SIZE)
				.toArray();
			const forms = await db.forms
				.where('id')
				.anyOf(entries.map((l) => l.formId))
				.toArray();
			const logs = await db.logs
				.where('id')
				.anyOf(forms.map((f) => f.logId))
				.toArray();

			const formsById = forms.reduce((acc, cur) => {
				acc.set(cur.id, cur);
				return acc;
			}, new Map<FormId, FormRaw>());

			const logsById = logs.reduce((acc, cur) => {
				acc.set(cur.id, cur);
				return acc;
			}, new Map<LogId, LogRaw>());

			return entries
				.map((e) => {
					const form = formsById.get(e.formId);
					const log = form ? logsById.get(form.logId) : undefined;
					return {
						...e,
						form,
						log
					};
				})
				.filter((e) => e.form && e.log) as ExtendedEntry[];
		}, []);

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
							<a href={`/app/logs/${entry.log.id}/${entry.id}`} class="u-link-block">
								<Entry {entry} form={entry.form} log={entry.log}></Entry>
							</a>
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
