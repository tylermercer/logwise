<script>
	import { liveQuery } from 'dexie';
	import Link from '$lib/components/Link.svelte';
	import db from '$lib/db';

	let templates = liveQuery(() => db.templates.toArray());
</script>

<h1>Templates</h1>
{#if $templates}
	{#if $templates.length}
		<ul>
			{#each $templates as template (template.id)}
				<li>{template.name}, {template.createdDatetime}, {template.id}</li>
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
