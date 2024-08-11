<script lang="ts">
	import { goto } from '$app/navigation';
	import LogEntry from '$lib/components/entries/LogEntry.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import DropdownMenu from '$lib/components/util/dropdown-menu/DropdownMenu.svelte';
	import DropdownMenuItem from '$lib/components/util/dropdown-menu/DropdownMenuItem.svelte';
	import Tooltip from '$lib/components/util/Tooltip.svelte';
	import db from '$lib/db';
	import type { ExtendedEntry } from '$lib/db/types/ExtendedEntry';
	import { dateToString } from '$lib/util/dateUtils';
	import { typeid } from 'typeid-unboxed';
	import TrashIcon from 'virtual:icons/teenyicons/bin-outline';
	import CopyIcon from 'virtual:icons/teenyicons/documents-outline';
	import PencilIcon from 'virtual:icons/teenyicons/edit-outline';
	import type { PageData } from './$types';

	export let data: PageData;

	async function deleteEntry(e: Event) {
		e.preventDefault();
		e.stopImmediatePropagation();
		await db.entries.delete(data.entry.id);
		goto('/app/logs', { replaceState: true });
	}

	async function duplicateEntry() {
		const newEntryId = typeid('entry');
		const now = new Date();
		await db.entries.add({
			...data.entry,
			id: newEntryId,
			createdDatetime: now,
			modifiedDatetime: now
		});
		goto(`/app/logs/${data.log.id}/${newEntryId}`);
	}

	let extendedEntry: ExtendedEntry;
	$: extendedEntry = { ...data.entry, form: data.form, log: data.log };
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
			<DropdownMenuItem on:item-click={duplicateEntry}>
				<CopyIcon />
				<span>Duplicate</span>
			</DropdownMenuItem>
			<hr />
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
