<script lang="ts">
	import showModal from '$lib/util/actions/showModal';
	import db from '$lib/db';
	import { type LogId } from '$lib/db/types';

	import liveQueryAsStore from '$lib/util/dexie/liveQueryAsStore';

	import { createEventDispatcher } from 'svelte';

	export let name: string;
	export let id: LogId;

	export let show: boolean = false;

	let deletingError = '';
	let confirmedEntriesCount = '';

	const dispatch = createEventDispatcher();

	$: entriesCount = liveQueryAsStore<number | undefined>(() => {
		return db.transaction<number>('r', db.forms, db.entries, async () => {
			const formIds = (await db.forms.where('logId').equals(id).primaryKeys()) as LogId[];
			return await db.entries.where('formId').anyOf(formIds).count();
		});
	}, undefined);

	const deleteLog = async () => {
        if ($entriesCount == null) return; //Not done loading
		deletingError = '';
		if (isNaN(confirmedEntriesCount.trim() as unknown as number)) {
			deletingError = 'Please enter a number';
		} else if ($entriesCount > 0 && parseInt(confirmedEntriesCount) !== $entriesCount) {
			deletingError = 'Please enter the correct number of entries';
		} else {
			dispatch('submit');
			show = false;
		}
	};

	const handlePotentialEsc = (e: KeyboardEvent) => {
		if (e.key === 'Esc') {
			show = false;
		}
	};
</script>

<svelte:window on:keydown={handlePotentialEsc} />

{#if show && $entriesCount != undefined}
	<dialog use:showModal>
		<form on:submit|preventDefault={deleteLog} class="l-column l-space-s">
			<h2>Delete "{name}"?</h2>
			{#if $entriesCount > 0}
				<p>
					<strong class="u-danger">{$entriesCount} {$entriesCount > 1 ? 'entries' : 'entry'} will be deleted!</strong>
					To confirm this action, please enter the number of entries that will be deleted below:
				</p>
				<label>
					Number of entries
					<input type="text" name="confirmed-entries-count" bind:value={confirmedEntriesCount} />
				</label>
			{/if}
			{#if deletingError}
				<p class="u-danger">{deletingError}</p>
			{/if}
			<div class="l-cluster-r l-space-xs">
				<button type="button" class="btn-secondary" on:click={() => (show = false)}>
					Cancel
				</button>
				<button type="submit" class="btn-danger">Delete</button>
			</div>
		</form>
	</dialog>
{/if}
