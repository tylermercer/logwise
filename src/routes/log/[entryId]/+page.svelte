<script lang="ts">
	import type { PageData } from './$types';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import LogEntry from '$lib/components/LogEntry.svelte';
	import { goto } from '$app/navigation';
	import db from '$lib/db';

	export let data: PageData;

	let existingEntry = data.existingEntry;

	let pendingDeletion: boolean = false;
	async function deleteEntry(e: Event) {
		e.preventDefault();
		e.stopImmediatePropagation();
		if (pendingDeletion) {
			await db.entries.delete(existingEntry.id);
			goto('/app/log', { replaceState: true });
		} else {
			pendingDeletion = true;
			setTimeout(() => (pendingDeletion = false), 3000);
		}
	}
</script>

<HeaderBar>
	<a href="/app/log" class="secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>Entry</h1>
	<button
		class="btn-delete outline"
		class:secondary={!pendingDeletion}
		class:contrast={pendingDeletion}
		on:click={deleteEntry}
	>
		{#if pendingDeletion}
			Confirm
		{:else}
			Delete
		{/if}
	</button>
</HeaderBar>
<main class="container">
	<LogEntry entry={existingEntry}></LogEntry>
</main>
<style lang="scss">
	.btn-delete {
		margin-inline-start: auto;
	}
</style>