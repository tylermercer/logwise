<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import EntriesList from '$lib/components/entries/EntriesList.svelte';
	import LogEntry from '$lib/components/entries/LogEntry.svelte';
	import LogDeleteModal from '$lib/components/logs/LogDeleteModal.svelte';
	import LogRenameModal from '$lib/components/logs/LogRenameModal.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import DropdownMenu from '$lib/components/util/dropdown-menu/DropdownMenu.svelte';
	import DropdownMenuItem from '$lib/components/util/dropdown-menu/DropdownMenuItem.svelte';
	import Tooltip from '$lib/components/util/Tooltip.svelte';
	import db from '$lib/db';
	import getAllEntriesForLogPaginated from '$lib/db/queries/getAllEntriesForLogPaginated';
	import hasLogWithName from '$lib/db/queries/hasLogWithName';
	import { type LogId, DB_NULL, DB_TRUE } from '$lib/db/types';
	import { typeid } from 'typeid-unboxed';
	import PlusIcon from 'virtual:icons/teenyicons/add-outline';
	import ArchiveIcon from 'virtual:icons/teenyicons/archive-outline';
	import TrashIcon from 'virtual:icons/teenyicons/bin-outline';
	import CopyIcon from 'virtual:icons/teenyicons/documents-outline';
	import PencilIcon from 'virtual:icons/teenyicons/edit-outline';
	import DocumentIcon from 'virtual:icons/teenyicons/text-document-alt-outline';
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

	const deleteLog = async () => {
		await db.transaction('rw', db.forms, db.entries, db.logs, async () => {
			await db.logs.delete(log.id);
			const formIds = (await db.forms.where('logId').equals(log.id).primaryKeys()) as LogId[];
			await db.forms.where('logId').equals(log.id).delete();
			await db.entries.where('formId').anyOf(formIds).delete();
		});
		goto('/app/');
	};

	const getActualNewName = async (proposedName: string) => {
		let newName = proposedName;
		let disambiguator = 0;
		while (await hasLogWithName(newName)) {
			disambiguator++;
			newName = `${proposedName} (${disambiguator})`;
		}
		return newName;
	};

	const duplicateLog = async () => {
		const newLogId = typeid('log');
		const newFormId = typeid('form');
		const newLogName = `Copy of ${log.name}`;
		const now = new Date();
		await db.transaction('rw', db.forms, db.logs, async () => {
			const name = await getActualNewName(newLogName);
			const form = (await db.forms.get(log.currentFormId))!;
			await db.forms.add({
				...form,
				id: newFormId,
				prevVersionId: DB_NULL,
				nextVersionId: DB_NULL,
				logId: newLogId,
				createdDatetime: now,
				modifiedDatetime: now
			});
			await db.logs.add({
				...log,
				name: name,
				id: newLogId,
				currentFormId: newFormId,
				createdDatetime: now,
				modifiedDatetime: now
			});
		});
		goto(`/app/logs/${newLogId}`);
	};

	const archiveLog = async () => {
		await db.logs.update(log.id, { isArchived: DB_TRUE });
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
				<PencilIcon />
				<span>Rename</span>
			</DropdownMenuItem>
			<DropdownMenuItem on:item-click={editLog}>
				<DocumentIcon />
				<span>Edit questions</span>
			</DropdownMenuItem>
			<DropdownMenuItem on:item-click={duplicateLog}>
				<CopyIcon />
				<span>Duplicate</span>
			</DropdownMenuItem>
			<DropdownMenuItem on:item-click={archiveLog}>
				<ArchiveIcon />
				<span>Archive</span>
			</DropdownMenuItem>
			<hr />
			<DropdownMenuItem class="u-danger" on:item-click={() => (showDeleteModal = true)}>
				<TrashIcon />
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

<LogRenameModal
	oldName={log.name}
	id={log.id}
	on:submit={() => invalidateAll()}
	bind:show={showRenameModal}
/>

<LogDeleteModal name={log.name} id={log.id} on:submit={deleteLog} bind:show={showDeleteModal} />
