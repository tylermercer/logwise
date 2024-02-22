<script>
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
			<ul>
				{#each $templates as template (template.id)}
					<li class="template">
						<Link href="" class="u-link-block">
							<span class="name">
								{template.name}
							</span>
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
	.template {
		& > a {
			display: block;
		}
	}
</style>