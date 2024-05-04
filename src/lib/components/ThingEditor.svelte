<script lang="ts">
	import { DB_NULL, type Question, type ThingRaw } from '$lib/db';
	import { nanoid } from 'nanoid';
	import { getType, typeid } from 'typeid-unboxed';

	export let onSubmit = async (_: ThingRaw) => {};

	export let existingThing: ThingRaw | undefined = undefined;

	let status = '';
	let saving = false;

	let thingName = existingThing?.name ?? '';

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

	let questions = (existingThing?.questions.map((q) => ({
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
		questions = questions.filter((q) => q.tempId === tempId);
	}

	async function saveThing() {
		try {
			saving = true;
			var date = new Date();

			await onSubmit({
				id: typeid('thing'),
				prevVersionId: existingThing?.id ?? DB_NULL,
				nextVersionId: DB_NULL,
				name: thingName,
				modifiedDatetime: date,
				createdDatetime: existingThing?.createdDatetime ?? date,
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
							: null!
				)
			});

			saving = false;
		} catch (error) {
			status = `Failed to save ${thingName}: ${error}`;
		}
	}
</script>

<form on:submit={saveThing}>
	<label>
		Name
		<div></div>
		<input type="text" bind:value={thingName} />
	</label>
	<fieldset>
		<legend><h2>Questions</h2></legend>
		{#if questions.length}
			{#each questions as question (question.tempId)}
				<div class="question">
					<div class="grid">
						<label>
							Question
							<input type="text" bind:value={question.data.text} />
							<small>
								e.g.
								{#if question.type === 'text'}
									"What's on your mind?"
								{:else if question.type === 'likert'}
									"How are you feeling?"
								{/if}
							</small>
						</label>
						<label>
							Type
							<select bind:value={question.type}>
								<option value="text">Text</option>
								<option value="likert">1-to-5 scale</option>
							</select>
						</label>
					</div>
					<div class="l-cluster-r">
						<button
							type="button"
							on:click={() => deleteQuestion(question.tempId)}
							class="btn-outline btn-secondary"
						>
							Delete
						</button>
					</div>
				</div>
			{/each}
		{:else}
			<p>No questions</p>
		{/if}
	</fieldset>
	<div class="l-cluster-r">
		<button class="btn-secondary" type="button" on:click={addQuestion}>Add Question</button>
	</div>
	<hr />
	<p>{status}</p>
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
		margin-block-end: 2rem;
		border: 1px solid var(--pico-muted-border-color);
		border-radius: 0.5rem;
	}
</style>
