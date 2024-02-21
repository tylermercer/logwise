<script lang="ts">
	import db from '$lib/db';
	import type { Question } from '$lib/db';
	import { goto } from '$lib/navigation';
	import { nanoid } from 'nanoid';

	let status = '';

	let templateName = '';

	type DraftQuestion = { tempId: string; data: Omit<Question, 'id'> };

	function newQuestion(): DraftQuestion {
		return {
			tempId: nanoid(),
			data: {
				text: '',
				type: 'text'
			}
		};
	}

	let questions = [newQuestion()] as DraftQuestion[];

	function addQuestion() {
		questions = [...questions, newQuestion()];
	}

	function deleteQuestion(tempId: string) {
		questions = questions.filter((q) => q.tempId === tempId);
	}

	async function saveTemplate() {
		try {
			var date = new Date();

			// Add the new Template!
			const id = await db.templates.add({
				id: crypto.randomUUID(),
				name: templateName,
				modifiedDatetime: date,
				createdDatetime: date,
				questions: questions.map((q) => ({
					...q.data,
					id: `${q.data.type}_${crypto.randomUUID()}`
				}))
			});

			status = `Template ${templateName} successfully added. Got id ${id}`;

			goto('/templates');
		} catch (error) {
			status = `Failed to add ${templateName}: ${error}`;
		}
	}

	function cancel() {
		history.back();
	}
</script>

<header class="container">
	<h1>New Template</h1>
</header>
<main class="container">
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
							<select bind:value={question.data.type}>
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
</main>

<style lang="scss">
	.question {
		margin-block-end: 2rem;
		border: 1px solid var(--pico-border-color);
		border-radius: 0.5rem;
		padding: 1rem;
		margin-inline: -1rem;
	}
</style>
