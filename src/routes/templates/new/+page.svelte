<script lang="ts">
	import db from '$lib/db';
	import TemplateEditor from '$lib/components/TemplateEditor.svelte';
	import type { TemplateRaw } from '$lib/db';
	import { goto } from '$lib/navigation';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';

	async function handleSubmit(template: TemplateRaw) {
		await db.templates.add(template);

		goto('/templates');
	}
</script>


<header class="container l-cluster-l">
	<a href="/app/templates" class="secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>New template</h1>
</header>
<main class="container">
	<TemplateEditor onSubmit={handleSubmit}></TemplateEditor>
</main>
<style lang="scss">
	header {
		align-items: center;
		gap: 0.5em;
	}
</style>