<script lang="ts">
	import type { PageData } from './$types';

	import db, { DB_NULL } from '$lib/db';
	import FormEditor, { type LogWithForm } from '$lib/components/logs/FormEditor.svelte';
	import type { FormRaw } from '$lib/db';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let existingLog = data.existingLog;
	let existingForm = data.existingForm;

	async function handleSubmitOld(form: FormRaw) {
		if (form.prevVersionId != DB_NULL) {
			await db.forms.update(form.prevVersionId, { nextVersionId: form.id });
		}
		await db.forms.add(form);

		goto('/app/logs');
	}

	async function handleSubmit(data: LogWithForm) {
		const logId = data.id;
		if (logId) {
			// update log
			await db.transaction('rw', db.forms, db.logs, () => {
				db.logs.add({
					id: logId,
					name: data.name,
					description: data.description,
					color: data.color,
					createdDatetime: data.createdDatetime,
					modifiedDatetime: data.modifiedDatetime,
					currentFormId: data.currentForm.id,
					isArchived: data.isArchived
				});
				db.forms.add({
					...data.currentForm,
					logId,
				});
			});
		} else {
			// create log, which shouldn't happen on this page
			console.error('Attempted to create on edit log page');
		}

		goto('/app/');
	}
</script>

<svelte:head>
	<title>Editing "{existingLog.name}"</title>
</svelte:head>
<HeaderBar backHref="/app/">
	<h1>Editing "{existingLog.name}"</h1>
</HeaderBar>
<main class="u-guttered">
	<FormEditor onSubmit={handleSubmit} {existingForm} {existingLog}></FormEditor>
</main>
