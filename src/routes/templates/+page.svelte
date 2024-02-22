<script lang="ts">
	import { liveQuery } from 'dexie';
	import Link from '$lib/components/Link.svelte';
	import db from '$lib/db';

	let templates = liveQuery(() => db.templates.toArray());
</script>

<header class="container">
	<h1>Templates</h1>
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
								<button class="secondary">Delete</button>
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
	<Link href="/templates/new">Add new template</Link>
	<Link href="/">Home</Link>
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
		padding: 0.5rem;
	}
</style>
