<script lang="ts">
	import { liveQuery } from 'dexie';
	import Link from '$lib/components/Link.svelte';
	import db, { DB_NULL, type TemplateId } from '$lib/db';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';

	let templates = liveQuery(() => db.templates.where('nextVersionId').equals(DB_NULL).toArray());

	let pendingDeletionId: TemplateId | undefined;
	async function deleteTemplate(e: Event, id: TemplateId) {
		e.preventDefault();
		e.stopImmediatePropagation();
		if (pendingDeletionId) {
			await db.templates.delete(pendingDeletionId);
			pendingDeletionId = undefined;
		} else {
			pendingDeletionId = id;
			setTimeout(() => (pendingDeletionId = undefined), 3000);
		}
	}
</script>

<HeaderBar>
	<a href="/app/" class="secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>My Things</h1>
</HeaderBar>
<main class="container">
	{#if $templates}
		{#if $templates.length}
			<ul class="templates-list">
				{#each $templates as template (template.id)}
					<li class="template">
						<a href="/app/entries/{template.id}/new" class="u-link-block">
							<div class="template-contents">
								{template.name || '(Unnamed)'}
								<div class="l-cluster-r actions">
									<a
										href="/app/things/{template.id}/edit"
										class="outline secondary"
										role="button"
									>
										Edit
									</a>
									<button
										class="outline"
										class:secondary={pendingDeletionId !== template.id}
										class:contrast={pendingDeletionId === template.id}
										on:click={(e) => deleteTemplate(e, template.id)}
									>
										{#if pendingDeletionId === template.id}
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
			<p>You don't have any Things yet. Get started by <a href="/app/things/new">creating one</a>.</p>
		{/if}
	{:else}
		<p><span aria-busy={!$templates}>Loading...</span></p>
	{/if}
	<div class="l-cluster-r">
		<a href="/app/things/new" role="button">Add new thing</a>
	</div>
</main>

<style lang="scss">
	.templates-list {
		padding-left: 0;
		& > li {
			&:first-child {
				border-top: 1px solid var(--pico-muted-border-color);
			}
			list-style-type: none;
			border-bottom: 1px solid var(--pico-muted-border-color);
		}
	}
	.template-contents {
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
