<script lang="ts">
	import showModal from '$lib/util/actions/showModal';

	import { createEventDispatcher } from 'svelte';

	export let oldName: string;

	export let show: boolean = false;

	$: draftName = oldName;
	let renamingError = '';

	const dispatch = createEventDispatcher();

	const renameLog = async () => {
		renamingError = '';
		if (!draftName) {
			renamingError = 'Please enter a name';
		} else {
			dispatch('submit', draftName);
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

{#if show}
	<dialog use:showModal>
		<form on:submit|preventDefault={renameLog} class="l-column l-space-s">
			<h2>Rename "{oldName}"</h2>
			<label>
				New name
				<input type="text" name="new-name" placeholder="My awesome log" bind:value={draftName} />
			</label>
			{#if renamingError}
				<p class="u-danger">{renamingError}</p>
			{/if}
			<div class="l-cluster-r l-space-xs">
				<button type="button" class="btn-secondary" on:click={() => (show = false)}>
					Cancel
				</button>
				<button type="submit">Save</button>
			</div>
		</form>
	</dialog>
{/if}
