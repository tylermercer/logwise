<script lang="ts">
    import db from '$lib/db';
	import TemplateEditor from "$lib/components/TemplateEditor.svelte";
	import type { TemplateRaw } from "$lib/db";
	import { goto } from '$lib/navigation';

	async function handleSubmit(template: TemplateRaw) {
		await db.templates.add(template);

		goto('/templates');
	}
</script>

<TemplateEditor onSubmit={handleSubmit}></TemplateEditor>