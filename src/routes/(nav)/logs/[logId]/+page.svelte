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
	import { type LogId, DB_FALSE, DB_NULL, DB_TRUE } from '$lib/db/types';
	import type { ExtendedEntry } from '$lib/db/types/ExtendedEntry';
	import { typeid } from 'typeid-unboxed';
	import PlusIcon from 'virtual:icons/teenyicons/add-outline';
	import ArchiveIcon from 'virtual:icons/teenyicons/archive-outline';
	import TrashIcon from 'virtual:icons/teenyicons/bin-outline';
	import CopyIcon from 'virtual:icons/teenyicons/documents-outline';
	import PencilIcon from 'virtual:icons/teenyicons/edit-outline';
	import DocumentIcon from 'virtual:icons/teenyicons/text-document-alt-outline';
	import type { PageData } from './$types';
	import mouseClickNoDrag from '$lib/util/actions/mouseClickNoDrag';
	import MobileAddEntryFab from '$lib/components/navigation/MobileAddEntryFab.svelte';
	import DesktopAddEntryButton from '$lib/components/navigation/DesktopAddEntryButton.svelte';

	export let data: PageData;
	$: log = data.log;
	$: isArchived = data.log.isArchived == DB_TRUE;

	const query = (pageIndex: number, pageSize: number) =>
		getAllEntriesForLogPaginated(log, pageIndex, pageSize);

	const onDelegatedEntryCick = (entry: ExtendedEntry) =>
		goto(`/app/logs/${entry.log.id}/${entry.id}`);

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
				modifiedDatetime: now,
				isArchived: DB_FALSE
			});
		});
		goto(`/app/logs/${newLogId}`);
	};

	const setArchived = async (archived: boolean) => {
		await db.logs.update(log.id, { isArchived: archived ? DB_TRUE : DB_FALSE });
		invalidateAll();
	};
</script>

<svelte:head>
	<title>Log</title>
</svelte:head>
<HeaderBar>
	<h1>{log.name}</h1>
	<svelte:fragment slot="actions">
		<DropdownMenu class="u-icon-button-group-right">
			{#if !isArchived}
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
				<DropdownMenuItem on:item-click={() => setArchived(true)}>
					<ArchiveIcon />
					<span>Archive</span>
				</DropdownMenuItem>
			{:else}
				<DropdownMenuItem on:item-click={() => setArchived(false)}>
					<ArchiveIcon />
					<span>Un-archive</span>
				</DropdownMenuItem>
			{/if}
			<hr />
			<DropdownMenuItem class="u-danger" on:item-click={() => (showDeleteModal = true)}>
				<TrashIcon />
				<span>Delete</span>
			</DropdownMenuItem>
		</DropdownMenu>
	</svelte:fragment>
</HeaderBar>
{#if isArchived}
	<div class="archived-warning u-guttered">
		<p class="u-slub">ARCHIVED</p>
	</div>
{:else}
	<div class="add-entry-container u-guttered">
		<DesktopAddEntryButton logId={log.id} />
	</div>
{/if}
{#key log}
	<EntriesList paginatedQuery={query}>
		<div
			slot="entry"
			let:entry
			use:mouseClickNoDrag
			on:click-without-drag={() => onDelegatedEntryCick(entry)}
		>
			<LogEntry {entry} showEntryLink></LogEntry>
		</div>
		<span slot="empty">
			There's nothing in your log yet.
			<a href="/app/logs/{log.id}/new-entry">Make an entry</a>
		</span>
	</EntriesList>
{/key}

{#if !isArchived}
	<MobileAddEntryFab logId={log.id} />
{/if}

<LogRenameModal
	oldName={log.name}
	id={log.id}
	on:submit={() => invalidateAll()}
	bind:show={showRenameModal}
/>

<LogDeleteModal name={log.name} id={log.id} on:submit={deleteLog} bind:show={showDeleteModal} />

<style lang="scss">
	.archived-warning {
		padding-top: 0;
		padding-bottom: var(--space-l);
	}
	.add-entry-container {
		padding-top: 0;
		padding-bottom: 0;
		&>:global(a) {
			margin-left: calc(-1 * var(--space-2xs));
			margin-right: calc(-1 * var(--space-2xs));
		}
	}
</style>
