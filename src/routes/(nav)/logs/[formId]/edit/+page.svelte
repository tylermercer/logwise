<script lang="ts">
	import type { PageData } from './$types';

	import db, { DB_NULL } from '$lib/db';
	import FormEditor from '$lib/components/FormEditor.svelte';
	import type { FormRaw } from '$lib/db';
	import { goto } from '$lib/navigation';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';

	export let data: PageData;

	let existingForm = data.existingForm;

	async function handleSubmit(form: FormRaw) {
		if (form.prevVersionId != DB_NULL) {
			await db.forms.update(form.prevVersionId, { nextVersionId: form.id });
		}
		await db.forms.add(form);

		goto('/logs');
	}
</script>
<svelte:head>
	<title>Editing "{existingForm.name}"</title>
</svelte:head>
<HeaderBar>
	<a href="/app/logs" class="btn-secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>Editing "{existingForm.name}"</h1>
</HeaderBar>
<main class="u-guttered">
	<FormEditor onSubmit={handleSubmit} {existingForm}></FormEditor>
</main>
