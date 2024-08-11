<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import EntriesList from '$lib/components/entries/EntriesList.svelte';
	import LogEntry from '$lib/components/entries/LogEntry.svelte';
	import LogRenameModal from '$lib/components/logs/LogRenameModal.svelte';
	import LogDeleteModal from '$lib/components/logs/LogDeleteModal.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import DocumentIcon from 'virtual:icons/teenyicons/text-document-alt-outline';
	import DropdownMenu from '$lib/components/util/dropdown-menu/DropdownMenu.svelte';
	import DropdownMenuItem from '$lib/components/util/dropdown-menu/DropdownMenuItem.svelte';
	import Tooltip from '$lib/components/util/Tooltip.svelte';
	import db from '$lib/db';
	import { type LogId } from '$lib/db/types';
	import getAllEntriesForLogPaginated from '$lib/db/queries/getAllEntriesForLogPaginated';
	import PlusIcon from 'virtual:icons/teenyicons/add-outline';
	import PencilIcon from 'virtual:icons/teenyicons/edit-outline';
	import TrashIcon from 'virtual:icons/teenyicons/bin-outline';
	import type { PageData } from './$types';

	export let data: PageData;
	$: log = data.log;

	const query = (pageIndex: number, pageSize: number) =>
		getAllEntriesForLogPaginated(log, pageIndex, pageSize);

	const editLog = () => {
		goto(`/app/logs/${log.id}/edit`);
	};

	let showRenameModal = false;
	let showDeleteModal = false;

	const renameLog = async (e: CustomEvent<string>) => {
		//TODO: check for an existing log that already uses that name
		await db.logs.update(log.id, { name: e.detail, modifiedDatetime: new Date() });
		invalidateAll();
	};

	const deleteLog = async () => {
		await db.transaction('rw', db.forms, db.entries, db.logs, async () => {
			await db.logs.delete(log.id);
			const formIds = (await db.forms.where('logId').equals(log.id).primaryKeys()) as LogId[];
			await db.forms.where('logId').equals(log.id).delete();
			await db.entries.where('formId').anyOf(formIds).delete();
		});
		goto('/app/');
	};
</script>

<svelte:head>
	<title>Log</title>
</svelte:head>
<HeaderBar>
	<h1>{log.name}</h1>
	<svelte:fragment slot="actions">
		<Tooltip text="Add Entry">
			<a class="btn-edit btn-icon" role="button" href={`/app/logs/${log.id}/new-entry`}>
				<PlusIcon />
			</a>
		</Tooltip>
		<DropdownMenu class="u-icon-button-group-right">
			<DropdownMenuItem on:item-click={() => (showRenameModal = true)}>
				<PencilIcon/>
				<span>Rename</span>
			</DropdownMenuItem>
			<DropdownMenuItem on:item-click={editLog}>
				<DocumentIcon />
				<span>Edit questions</span>
			</DropdownMenuItem>
			<hr />
			<DropdownMenuItem class="u-danger" on:item-click={() => (showDeleteModal = true)}>
				<TrashIcon/>
				<span>Delete</span>
			</DropdownMenuItem>
		</DropdownMenu>
	</svelte:fragment>
</HeaderBar>
{#key log}
	<EntriesList paginatedQuery={query}>
		<a slot="entry" let:entry href="/app/logs/{entry.log.id}/{entry.id}" class="u-link-block">
			<LogEntry {entry}></LogEntry>
		</a>
		<span slot="empty">
			There's nothing in your log yet.
			<a href="/app/logs/{log.id}/new-entry">Make an entry</a>
		</span>
	</EntriesList>
{/key}

<LogRenameModal oldName={log.name} on:submit={renameLog} bind:show={showRenameModal} />

<LogDeleteModal name={log.name} id={log.id} on:submit={deleteLog} bind:show={showDeleteModal} />
