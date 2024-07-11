<script lang="ts">
	import { DB_NULL, type FormRaw } from '$lib/db';
	import type { DraftQuestion } from '$lib/question';
	import assertNever from '$lib/util/assertNever';
	import { nanoid } from 'nanoid';
	import { getType, typeid } from 'typeid-unboxed';
	import TrashIcon from 'virtual:icons/teenyicons/bin-outline';
	import UpIcon from 'virtual:icons/teenyicons/up-outline';
	import DownIcon from 'virtual:icons/teenyicons/down-outline';
	import DragIcon from 'virtual:icons/teenyicons/drag-vertical-outline';
	import PlusIcon from 'virtual:icons/teenyicons/add-outline';
	import Tooltip from './Tooltip.svelte';

	export let onSubmit = async (_: FormRaw) => {};

	export let existingForm: FormRaw | undefined = undefined;

	let status = '';
	let saving = false;

	let formName = existingForm?.name ?? '';

	function newQuestion(): DraftQuestion {
		return {
			tempId: nanoid(),
			type: 'text',
			data: {
				text: ''
			}
		};
	}

	let questions = (existingForm?.questions.map((q) => ({
		tempId: q.id,
		type: getType(q.id),
		data: {
			text: q.text
		}
	})) ?? [newQuestion()]) as DraftQuestion[];

	function addQuestion() {
		questions = [...questions, newQuestion()];
	}

	function deleteQuestion(tempId: string) {
		questions = questions.filter((q) => q.tempId !== tempId);
	}

	async function saveForm() {
		try {
			saving = true;
			var date = new Date();

			await onSubmit({
				id: typeid('form'),
				prevVersionId: existingForm?.id ?? DB_NULL,
				nextVersionId: DB_NULL,
				name: formName,
				modifiedDatetime: date,
				createdDatetime: existingForm?.createdDatetime ?? date,
				questions: questions.map((q) =>
					q.type == 'likert'
						? {
								id: typeid('likert'),
								text: q.data.text
							}
						: q.type === 'text'
							? {
									id: typeid('text'),
									text: q.data.text
								}
							: q.type === 'bool'
								? {
										id: typeid('bool'),
										text: q.data.text
									}
								: assertNever(q.type)
				)
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
	<fieldset class="questions l-column l-space-s">
		<legend><h2>Questions</h2></legend>
		{#if questions.length}
			{#each questions as question (question.tempId)}
				<div class="question l-row l-space-s">
					<div class="l-column l-space-2xs">
						<label>
							Question
							<input type="text" bind:value={question.data.text} />
							<small>
								e.g.
								{#if question.type === 'text'}
									"What's on your mind?"
								{:else if question.type === 'likert'}
									"How are you feeling?"
								{:else if question.type === 'bool'}
									"Did you do your habit today?"
								{:else}
									{assertNever(question.type)}
								{/if}
							</small>
						</label>
						<label>
							Type
							<select bind:value={question.type}>
								<option value="text">Text</option>
								<option value="likert">1-to-5 scale</option>
								<option value="bool">Yes/No</option>
							</select>
						</label>
					</div>
					<div class="question-buttons l-column l-space-none">
						<button
							type="button"
							on:click={() => deleteQuestion(question.tempId)}
							class="btn-delete btn-icon"
						>
							<TrashIcon />
						</button>
						<!-- <button
							type="button"
							on:click={() => deleteQuestion(question.tempId)}
							class="btn-icon"
						>
							<UpIcon/>
						</button>
						<button
							type="button"
							on:click={() => deleteQuestion(question.tempId)}
							class="btn-icon"
						>
							<DragIcon/>
						</button>
						<button
							type="button"
							on:click={() => deleteQuestion(question.tempId)}
							class="btn-icon"
						>
							<DownIcon/>
						</button> -->
					</div>
				</div>
			{/each}
		{:else}
			<p>No questions</p>
		{/if}
	</fieldset>
	<div class="btn-add-question-container l-cluster-r">
		<Tooltip text="Add question">
			<button class="btn-icon" aria-label="Add question" type="button" on:click={addQuestion}>
				<PlusIcon/>
			</button>
		</Tooltip>
	</div>
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

<style lang="scss">
	.question {
		border: 1px solid var(--gray-6);
		padding: var(--space-s);
		padding-top: var(--space-2xs);
		border-radius: var(--space-xs);
		& > :first-child {
			flex: 1;
		}
		& > :last-child {
			width: fit-content;
		}
	}
	.question-buttons {
		justify-content: center;
		margin-right: calc(var(--space-xs) * -1);
	}
	.questions {
		padding-block: var(--l-space);
	}
	.btn-add-question-container {
		margin-top: calc(var(--l-space) * -1);
	}
</style>
