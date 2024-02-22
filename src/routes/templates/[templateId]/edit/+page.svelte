<script lang="ts">
	import type { PageData } from './$types';

	import db from '$lib/db';
	import TemplateEditor from '$lib/components/TemplateEditor.svelte';
	import type { TemplateRaw } from '$lib/db';
	import { goto } from '$lib/navigation';

	export let data: PageData;

	let existingTemplate = data.existingTemplate;

	async function handleSubmit(template: TemplateRaw) {
		await db.templates.add(template);

		goto('/templates');
	}
</script>

<header class="container">
	<h1>Editing "{existingTemplate.name}"</h1>
</header>
<main class="container">
	<TemplateEditor onSubmit={handleSubmit} {existingTemplate}></TemplateEditor>
</main>
