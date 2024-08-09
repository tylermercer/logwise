<script lang="ts">
	import { liveQuery } from 'dexie';
	import db, { type FormId, DB_FALSE, type FormRaw } from '$lib/db';
	import Plus from 'virtual:icons/teenyicons/add-small-outline';
	import Tooltip from '$lib/components/util/Tooltip.svelte';

	let logs = liveQuery(async () => {
		const fetchedLogs = await db.logs.where('isArchived').equals(DB_FALSE).toArray();
		const fetchedForms = await db.forms.where('id').anyOf(fetchedLogs.map(l => l.currentFormId)).toArray();
		
		const formsById = fetchedForms.reduce((acc, cur) => {
			acc.set(cur.id, cur);
			return acc;
		}, new Map<FormId, FormRaw>());

		return fetchedLogs
		.sort((a, b) => a.name.localeCompare(b.name))
		.map(l => ({
			...l,
			form: formsById.get(l.currentFormId)!,
		}));
	});

	// let pendingDeletionId: FormId | undefined;
	// async function deleteForm(e: Event, id: FormId) {
	// 	e.preventDefault();
	// 	e.stopImmediatePropagation();
	// 	if (pendingDeletionId) {
	// 		let capturedId = pendingDeletionId!;
	// 		await db.transaction('rw', db.forms, db.entries, async () => {
	// 			await db.forms.delete(capturedId);
	// 			await db.entries.where('formId').equals(capturedId).delete();
	// 		});
	// 		pendingDeletionId = undefined;
	// 	} else {
	// 		pendingDeletionId = id;
	// 		setTimeout(() => (pendingDeletionId = undefined), 3000);
	// 	}
	// }
</script>

<div class="logs-list l-column l-space-none u-desktop-scrollbars-y u-styled-scrollbars">
	<div class="heading l-row h4">
		<span class="h4">Logs</span>
		<Tooltip text="Add new log">
			<a href="/app/logs/new" class="btn-icon add-new-button" role="button" aria-label="Add new log">
				<Plus />
			</a>
		</Tooltip>
	</div>
	{#if $logs}
		{#if $logs.length}
			<ul class="list l-column l-space-none u-desktop-scrollbars-y u-styled-scrollbars">
				{#each $logs as log (log.id)}
					<li class="form">
						<a href="/app/logs/{log.id}" class="u-nav-link u-link-block">
							<div class="form-contents l-row l-space-none">
								{log.name || '(Unnamed)'}
								<!-- <div class="l-cluster-r l-space-2xs actions">
									<a
										href="/app/logs/{form.id}/edit"
										class="btn-outline btn-secondary"
										role="button"
									>
										Edit
									</a>
									<button
										class="btn-outline"
										class:btn-secondary={pendingDeletionId !== form.id}
										class:btn-contrast={pendingDeletionId === form.id}
										on:click={(e) => deleteForm(e, form.id)}
									>
										{#if pendingDeletionId === form.id}
											Confirm
										{:else}
											Delete
										{/if}
									</button>
								</div> -->
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="empty">You don't have any logs yet. Get started by <a href="/app/logs/new">creating one</a>.</p>
		{/if}
	{:else}
		<p class="loader"><span aria-busy={!$logs}>Loading...</span></p>
	{/if}
</div>

<style lang="scss">
	.logs-list {
		margin-top: var(--space-s);
	}
	.form-contents {
		align-items: center;
		justify-content: space-between;
		// & .actions {
		// 	align-items: center;
		// }
	}
	.heading {
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: 0;
		background-color: var(--u-cascading-bg, var(--primary-1));
	}
	.empty,
	.loader {
		padding-top: var(--space-xs);
		padding-bottom: var(--space-xs);
	}
	.heading,
	.empty,
	.loader {
		padding-left: var(--space-m);
		padding-right: var(--space-m);
	}
	.add-new-button {
		margin-right: calc(var(--space-xs) * -1);
	}
</style>
