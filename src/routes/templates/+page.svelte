<script lang="ts">
	import { liveQuery } from 'dexie';
	import Link from '$lib/components/Link.svelte';
	import db, { type TemplateId } from '$lib/db';

	let templates = liveQuery(() => db.templates.toArray());

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

<header class="container">
	<h1>My templates</h1>
</header>
<main class="container">
	{#if $templates}
		{#if $templates.length}
			<ul class="templates-list">
				{#each $templates as template (template.id)}
					<li class="template">
						<Link href="/entries/{template.id}/new" class="u-link-block">
							<div class="template-contents">
								{template.name || '(Unnamed)'}
								<div class="l-cluster-r actions">
									<Link href="/templates/{template.id}/edit">Edit</Link>
									<button
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
						</Link>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No templates</p>
		{/if}
	{:else}
		<p>Loading</p>
	{/if}
	<div class="l-cluster-r">
		<Link href="/">Home</Link>
		<Link href="/templates/new">Add new template</Link>
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
