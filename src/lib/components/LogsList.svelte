<script lang="ts">
	import { liveQuery } from 'dexie';
	import db, { DB_NULL, type FormId } from '$lib/db';
	import HeaderBar from '$lib/components/HeaderBar.svelte';

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

<HeaderBar>
	<h1>My logs</h1>
</HeaderBar>
<main class="u-guttered l-column l-space-m">
	{#if $forms}
		{#if $forms.length}
			<ul class="forms-list l-column l-space-s">
				{#each $forms as form (form.id)}
					<li class="form">
						<a href="/app/logs/{form.id}/new-entry" class="u-link-block">
							<div class="form-contents l-row l-space-xs">
								{form.name || '(Unnamed)'}
								<div class="l-cluster-r l-space-2xs actions">
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
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p>You don't have any logs yet. Get started by <a href="/app/logs/new">creating one</a>.</p>
		{/if}
	{:else}
		<p><span aria-busy={!$forms}>Loading...</span></p>
	{/if}
	<div class="l-cluster-r">
		<a href="/app/logs/new" role="button">Add new log</a>
	</div>
</main>

<style lang="scss">
	.forms-list {
		padding-left: 0;
		& > li {
			list-style-type: none;
		}
	}
	.form-contents {
		align-items: center;
		justify-content: space-between;
		& .actions {
			align-items: center;
		}
	}
</style>
