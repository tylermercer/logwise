<script lang="ts">
	import type { Question, TemplateRaw } from '$lib/db';
	import { nanoid } from 'nanoid';

	export let onSubmit = (_: TemplateRaw) => {};

	export let existingTemplate: TemplateRaw | undefined = undefined;

	let status = '';

	let templateName = existingTemplate?.name ?? '';

	type DraftQuestion = { tempId: string; type: 'text' | 'likert'; data: Omit<Question, 'id'> };

	function newQuestion(): DraftQuestion {
		return {
			tempId: nanoid(),
			type: 'text',
			data: {
				text: ''
			}
		};
	}

	let questions = (existingTemplate?.questions.map((q) => ({
		tempId: q.id,
		type: q.id.split('_')[0],
		data: {
			text: q.text
		}
	})) ?? [newQuestion()]) as DraftQuestion[];

	function addQuestion() {
		questions = [...questions, newQuestion()];
	}

	function deleteQuestion(tempId: string) {
		questions = questions.filter((q) => q.tempId === tempId);
	}

	async function saveTemplate() {
		try {
			var date = new Date();

			onSubmit({
				id: crypto.randomUUID(),
				prevVersionId: existingTemplate?.id,
				name: templateName,
				modifiedDatetime: date,
				createdDatetime: existingTemplate?.createdDatetime ?? date,
				questions: questions.map((q) => ({
					...q.data,
					id: `${q.type}_${crypto.randomUUID()}`
				}))
			});
		} catch (error) {
			status = `Failed to save ${templateName}: ${error}`;
		}
	}

	function cancel() {
		history.back();
	}
</script>

<form on:submit={saveTemplate}>
	<label>
		Name
		<div></div>
		<input type="text" bind:value={templateName} />
	</label>
	<hr />
	<fieldset>
		<legend><h2>Questions</h2></legend>
		{#if questions.length}
			{#each questions as question (question.tempId)}
				<div class="question">
					<label>
						Label
						<input type="text" bind:value={question.data.text} />
					</label>
					<label>
						Type
						<select bind:value={question.type}>
							<option value="text">Text</option>
							<option value="likert">Likert (1-5 scale)</option>
						</select>
					</label>
					<button type="button" on:click={() => deleteQuestion(question.tempId)} class="contrast">
						Delete
					</button>
				</div>
			{/each}
		{:else}
			<p>No questions</p>
		{/if}
	</fieldset>
	<button class="secondary" type="button" on:click={addQuestion}>New Question</button>
	<hr />
	<p>{status}</p>
	<div class="grid">
		<button class="secondary" on:click={cancel} type="button">Cancel</button>
		<button type="submit">Add Template</button>
	</div>
</form>

<style lang="scss">
	.question {
		margin-block-end: 2rem;
		border: 1px solid var(--pico-muted-border-color);
		border-radius: 0.5rem;
		padding: 1rem;
		margin-inline: -1rem;
	}
</style>
