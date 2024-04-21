<script lang="ts">
	import type { PageData } from './$types';

	import db, { DB_NULL } from '$lib/db';
	import TemplateEditor from '$lib/components/TemplateEditor.svelte';
	import type { TemplateRaw } from '$lib/db';
	import { goto } from '$lib/navigation';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';

	export let data: PageData;

	let existingTemplate = data.existingTemplate;

	async function handleSubmit(template: TemplateRaw) {
		if (template.prevVersionId != DB_NULL) {
			await db.templates.update(template.prevVersionId, { nextVersionId: template.id });
		}
		await db.templates.add(template);

		goto('/things');
	}
</script>

<HeaderBar>
	<a href="/app/things" class="secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>Editing "{existingTemplate.name}"</h1>
</HeaderBar>
<main class="container">
	<TemplateEditor onSubmit={handleSubmit} {existingTemplate}></TemplateEditor>
</main>
