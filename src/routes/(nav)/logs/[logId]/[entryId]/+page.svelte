<script lang="ts">
	import type { PageData } from './$types';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import LogEntry from '$lib/components/entries/LogEntry.svelte';
	import { goto } from '$app/navigation';
	import db from '$lib/db';
	import { dateToString } from '$lib/util/dateUtils';
	import PencilIcon from 'virtual:icons/teenyicons/edit-outline';
	import TrashIcon from 'virtual:icons/teenyicons/bin-outline';
	import DropdownMenu from '$lib/components/util/dropdown-menu/DropdownMenu.svelte';
	import DropdownMenuItem from '$lib/components/util/dropdown-menu/DropdownMenuItem.svelte';
	import Tooltip from '$lib/components/util/Tooltip.svelte';

	export let data: PageData;

	let existingEntry = data.existingEntry;
	async function deleteEntry(e: Event) {
		e.preventDefault();
		e.stopImmediatePropagation();
		await db.entries.delete(existingEntry.id);
		goto('/app/logs', { replaceState: true });
	}
</script>

<svelte:head>
	<title>Entry</title>
</svelte:head>
<HeaderBar backHref="/app/logs">
	<h1>Entry</h1>
	<svelte:fragment slot="actions">
		<Tooltip text="Edit">
			<a
				class="btn-edit btn-icon"
				role="button"
				href={`/app/logs/${data.logId}/${data.existingEntry.id}/edit`}
			>
				<PencilIcon />
			</a>
		</Tooltip>
		<DropdownMenu>
			<DropdownMenuItem class="u-danger" on:item-click={deleteEntry}>
					<TrashIcon />
					<span>Delete</span>
			</DropdownMenuItem>
		</DropdownMenu>
	</svelte:fragment>
</HeaderBar>
<main class="u-guttered l-column l-space-s">
	<LogEntry entry={existingEntry}></LogEntry>
	<div class="footnotes l-column l-space-none">
		<small>
			Created {dateToString(data.existingEntry.createdDatetime)}
		</small>
		{#if data.existingEntry.createdDatetime !== data.existingEntry.modifiedDatetime}
			<small>
				Modified {dateToString(data.existingEntry.modifiedDatetime)}
			</small>
		{/if}
	</div>
</main>
