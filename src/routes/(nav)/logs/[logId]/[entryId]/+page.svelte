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
	import type { ExtendedEntry } from '$lib/db/types/ExtendedEntry';

	export let data: PageData;

	async function deleteEntry(e: Event) {
		e.preventDefault();
		e.stopImmediatePropagation();
		await db.entries.delete(data.entry.id);
		goto('/app/logs', { replaceState: true });
	}
	
	let extendedEntry : ExtendedEntry;
	$: extendedEntry = { ...data.entry, form: data.form, log: data.log }
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
				href={`/app/logs/${data.log.id}/${data.entry.id}/edit`}
			>
				<PencilIcon />
			</a>
		</Tooltip>
		<DropdownMenu class="u-icon-button-group-right">
			<DropdownMenuItem class="u-danger" on:item-click={deleteEntry}>
					<TrashIcon />
					<span>Delete</span>
			</DropdownMenuItem>
		</DropdownMenu>
	</svelte:fragment>
</HeaderBar>
<main class="u-guttered l-column l-space-s">
	<LogEntry entry={extendedEntry} showLogName></LogEntry>
	<div class="footnotes l-column l-space-none">
		<small>
			Created {dateToString(data.entry.createdDatetime)}
		</small>
		{#if data.entry.createdDatetime !== data.entry.modifiedDatetime}
			<small>
				Modified {dateToString(data.entry.modifiedDatetime)}
			</small>
		{/if}
	</div>
</main>
