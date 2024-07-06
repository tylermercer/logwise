<script lang="ts">
	import type { PageData } from './$types';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
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
<svelte:head>
	<title>Entry</title>
</svelte:head>
<HeaderBar backHref="/app/log">
	<h1>Entry</h1>
	<button
		class="btn-delete btn-outline"
		class:btn-secondary={!pendingDeletion}
		class:btn-contrast={pendingDeletion}
		on:click={deleteEntry}
	>
		{#if pendingDeletion}
			Confirm
		{:else}
			Delete
		{/if}
	</button>
</HeaderBar>
<main class="u-guttered">
	<LogEntry entry={existingEntry}></LogEntry>
</main>
<style lang="scss">
	.btn-delete {
		margin-inline-start: auto;
	}
</style>