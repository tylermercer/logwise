<script lang="ts">
	import type { PageData } from './$types';

	import db, { DB_NULL } from '$lib/db';
	import FormEditor from '$lib/components/logs/FormEditor.svelte';
	import type { FormRaw } from '$lib/db';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let existingForm = data.existingForm;

	async function handleSubmit(form: FormRaw) {
		if (form.prevVersionId != DB_NULL) {
			await db.forms.update(form.prevVersionId, { nextVersionId: form.id });
		}
		await db.forms.add(form);

		goto('/app/logs');
	}
</script>

<svelte:head>
	<title>Editing "{existingForm.name}"</title>
</svelte:head>
<HeaderBar backHref="/app/">
	<h1>Editing "{existingForm.name}"</h1>
</HeaderBar>
<main class="u-guttered">
	<FormEditor onSubmit={handleSubmit} {existingForm}></FormEditor>
</main>
