<script lang="ts">
	import { liveQuery } from 'dexie';
	import db, { DB_NULL, type FormId } from '$lib/db';
	import Plus from 'virtual:icons/teenyicons/add-small-outline';

	let forms = liveQuery(() => db.forms.where('nextVersionId').equals(DB_NULL).toArray());

	let pendingDeletionId: FormId | undefined;
	async function deleteForm(e: Event, id: FormId) {
		e.preventDefault();
		e.stopImmediatePropagation();
		if (pendingDeletionId) {
			let capturedId = pendingDeletionId!;
			await db.transaction('rw', db.forms, db.entries, async () => {
				await db.forms.delete(capturedId);
				await db.entries.where('formId').equals(capturedId).delete();
			});
			pendingDeletionId = undefined;
		} else {
			pendingDeletionId = id;
			setTimeout(() => (pendingDeletionId = undefined), 3000);
		}
	}
</script>

<div class="logs-list l-column l-space-none">
	<p class="heading l-row h4">
		<span class="h4">Logs</span>
		<a href="/app/logs/new" class="btn-icon add-new-button" role="button" aria-label="Add new log">
			<Plus />
		</a>
	</p>
	{#if $forms}
		{#if $forms.length}
			<ul class="list l-column l-space-none">
				{#each $forms as form (form.id)}
					<li class="form">
						<a href="/app/logs/{form.id}/new-entry" class="u-nav-link u-link-block">
							<div class="form-contents l-row l-space-none">
								{form.name || '(Unnamed)'}
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
		<p><span aria-busy={!$forms}>Loading...</span></p>
	{/if}
</div>

<style lang="scss">
	.list {
		padding-left: 0;
		margin: 0;
		& > li {
			list-style-type: none;
		}
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
	}
	.heading,
	.empty {
		padding-left: var(--space-m);
		padding-right: var(--space-m);
	}
	.logs-list {
		margin-top: var(--space-s);
	}
	.add-new-button {
		margin-right: calc(var(--space-xs) * -1);
	}
</style>
