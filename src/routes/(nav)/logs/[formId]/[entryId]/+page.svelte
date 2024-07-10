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
			goto('/app/logs', { replaceState: true });
		} else {
			pendingDeletion = true;
			setTimeout(() => (pendingDeletion = false), 3000);
		}
	}
</script>

<svelte:head>
	<title>Entry</title>
</svelte:head>
<HeaderBar backHref="/app/logs">
	<h1>Entry</h1>
	<a class="btn-edit btn-secondary btn-outline" role="button" href={`/app/logs/${data.existingEntry.formId}/${data.existingEntry.id}/edit`}>
		Edit
	</a>
	<button
		class="btn-outline"
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
	.btn-edit {
		margin-inline-start: auto;
	}
</style>
