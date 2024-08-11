<script lang="ts">
	import type { PageData } from './$types';
	import type { DraftQuestion } from '$lib/question';
	import { typeid } from 'typeid-unboxed';
	import db from '$lib/db';
	import QuestionsEditor, {
		newDraftQuestion,
		questionToDraftQuestion,
		draftQuestionToQuestion
	} from '$lib/components/forms/QuestionsEditor.svelte';
	import { DB_CURRENT_ENTITY_VERSION, DB_NULL } from '$lib/db/types';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let existingLog = data.existingLog;
	let existingForm = data.existingForm;

	let status = '';
	let saving = false;

	let questions: DraftQuestion[] = existingForm?.questions.map(questionToDraftQuestion) ?? [
		newDraftQuestion()
	];

	async function handleSubmit() {
		await db.transaction('rw', db.forms, db.logs, async () => {
			const modified = new Date();
			const newFormId = typeid('form');
			await db.forms.add({
				id: newFormId,
				createdDatetime: modified,
				modifiedDatetime: modified,
				questions: questions.map(draftQuestionToQuestion),
				prevVersionId: existingForm.id,
				nextVersionId: DB_NULL,
				logId: existingLog.id,
				schemaVer: DB_CURRENT_ENTITY_VERSION
			});
			await db.forms.update(existingForm.id, { nextVersionId: newFormId });

			await db.logs.update(existingLog.id, {
				modifiedDatetime: modified,
				currentFormId: newFormId,
				schemaVer: DB_CURRENT_ENTITY_VERSION
			});
		});

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
	<form on:submit={handleSubmit}>
		<QuestionsEditor bind:questions />
		{#if status}
			<p>{status}</p>
		{/if}
		<div class="l-cluster-r">
			<button type="submit" aria-busy={saving}>
				{#if saving}
					Saving
				{:else}
					Save
				{/if}
			</button>
		</div>
	</form>
</main>
