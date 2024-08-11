<script context="module" lang="ts">
	export type LogWithForm = Omit<LogRaw, 'currentFormId'> & {
		currentForm: Omit<FormRaw, 'logId'>;
	};
</script>

<script lang="ts">
	import {
		DB_CURRENT_ENTITY_VERSION,
		DB_FALSE,
		DB_NULL,
		type FormRaw,
		type LogRaw
	} from '$lib/db/types';
	import type { DraftQuestion } from '$lib/question';
	import { typeid } from 'typeid-unboxed';
	import QuestionsEditor, {
		newDraftQuestion,
		draftQuestionToQuestion,
	} from '$lib/components/forms/QuestionsEditor.svelte';

	export let onSubmit = async (_: LogWithForm) => {};

	let status = '';
	let saving = false;

	let formName = '';

	let questions: DraftQuestion[] = [
		newDraftQuestion()
	];

	async function saveForm() {
		try {
			saving = true;
			var now = new Date();

			await onSubmit({
				id: typeid('log'),
				currentForm: {
					id: typeid('form'),
					prevVersionId: DB_NULL,
					nextVersionId: DB_NULL,
					modifiedDatetime: now,
					createdDatetime: now,
					schemaVer: DB_CURRENT_ENTITY_VERSION,
					questions: questions.map(draftQuestionToQuestion)
				},
				modifiedDatetime: now,
				createdDatetime: now,
				name: formName,
				description: '',
				color: 'gray',
				isArchived: DB_FALSE,
				schemaVer: DB_CURRENT_ENTITY_VERSION
			});

			saving = false;
		} catch (error) {
			status = `Failed to save ${formName}: ${error}`;
		}
	}
</script>

<form on:submit={saveForm} class="l-column l-space-m">
	<label>
		Name
		<div></div>
		<input type="text" bind:value={formName} />
	</label>
	<QuestionsEditor bind:questions></QuestionsEditor>
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
