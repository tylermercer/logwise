<script lang="ts">
	import { liveQuery } from 'dexie';
	import db, { DB_NULL, type FormId } from '$lib/db';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
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

<svelte:head>
	<title>My Forms</title>
</svelte:head>
<HeaderBar>
	<a href="/app/" class="btn-secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>My forms</h1>
</HeaderBar>
<main class="u-guttered">
	{#if $forms}
		{#if $forms.length}
			<ul class="forms-list">
				{#each $forms as form (form.id)}
					<li class="form">
						<a href="/app/forms/{form.id}/new-entry" class="u-link-block">
							<div class="form-contents">
								{form.name || '(Unnamed)'}
								<div class="l-cluster-r actions">
									<a
										href="/app/forms/{form.id}/edit"
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
			<p>You don't have any forms yet. Get started by <a href="/app/forms/new">creating one</a>.</p>
		{/if}
	{:else}
		<p><span aria-busy={!$forms}>Loading...</span></p>
	{/if}
	<div class="l-cluster-r">
		<a href="/app/forms/new" role="button">Add new form</a>
	</div>
</main>

<style lang="scss">
	.forms-list {
		padding-left: 0;
		& > li {
			&:first-child {
				border-top: 1px solid var(--pico-muted-border-color);
			}
			list-style-type: none;
			border-bottom: 1px solid var(--pico-muted-border-color);
		}
	}
	.form-contents {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: space-between;
		align-items: center;
		padding-block: 0.5rem;
		& .actions {
			align-items: center;
		}
	}
</style>
