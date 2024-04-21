<script lang="ts">
	import { liveQuery } from 'dexie';
	import db, { type ThingId } from '$lib/db';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import Entry from '$lib/components/Entry.svelte';

	let entries = liveQuery(() => db.entries.orderBy('displayDatetime').reverse().limit(10).toArray());
</script>

<HeaderBar>
	<a href="/app/" class="secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>Log</h1>
</HeaderBar>
<main class="container">
	{#if $entries}
		{#if $entries.length}
			<ul class="entries-list">
				{#each $entries as entry (entry.id)}
					<li class="entry">
						<Entry entry={entry}></Entry>
					</li>
				{/each}
			</ul>
		{:else}
			<p>You don't have any entries yet. Get started by <a href="/app/entries/new">creating a Thing to log</a>.</p>
		{/if}
	{:else}
		<p><span aria-busy="true">Loading...</span></p>
	{/if}
</main>

<style lang="scss">
	.entries-list {
		padding-left: 0;
		& > li {
			&:first-child {
				border-top: 1px solid var(--pico-muted-border-color);
			}
			list-style-type: none;
			border-bottom: 1px solid var(--pico-muted-border-color);
		}
	}
</style>
