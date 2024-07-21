<script lang="ts">
	import DatetimeInput from '$lib/components/controls/DatetimeInput.svelte';
	import type { EntryRaw, FormRaw, QuestionId } from '$lib/db';
	import db, { DB_CURRENT_ENTITY_VERSION } from '$lib/db';
	import { toAnsweredQuestion, type AnsweredQuestion } from '$lib/question';
	import { isAnsweredBoolQuestion } from '$lib/question/bool';
	import { isAnsweredLikertQuestion } from '$lib/question/likert';
	import { isAnsweredTextQuestion } from '$lib/question/text';
	import assertNever from '$lib/util/assertNever';
	import { createEventDispatcher } from 'svelte';
	import { typeid } from 'typeid-unboxed';

	export let form: FormRaw;

	export let entry: EntryRaw | undefined = undefined;

    const dispatch = createEventDispatcher();

	let saving = false;
	let status = '';

	let { questions, id: formId } = form;

	let answeredQuestions = questions.map(toAnsweredQuestion).map((q) => ({
		...q,
		answer: entry?.answers.get(q.question.id) ?? q.answer
	} as AnsweredQuestion));

	let datetime = entry?.displayDatetime ?? new Date();

	async function saveEntry() {
		saving = true;
		const answers: Map<QuestionId, any> = new Map<QuestionId, any>();

		answeredQuestions.forEach((qa) => answers.set(qa.question.id, qa.answer));

		const now = new Date();

        const newEntry = {
			id: entry?.id ?? typeid('entry'),
			displayDatetime: datetime,
			createdDatetime: entry?.createdDatetime ?? now,
			modifiedDatetime: now,
			answers,
			formId,
			schemaVer: DB_CURRENT_ENTITY_VERSION,
        };

        if (entry?.id) {
			await db.entries.update(entry.id, newEntry);
		}
        else {
            await db.entries.add(newEntry);
        }

        dispatch('submit');
		saving = false;
	}
</script>

<form on:submit={saveEntry} class="l-column l-space-s">
	{#each answeredQuestions as answeredQuestion (answeredQuestion.question.id)}
		<div class="question l-column l-space-xs">
			{#if isAnsweredTextQuestion(answeredQuestion)}
				<label>
					{answeredQuestion.question.text}
					<textarea bind:value={answeredQuestion.answer} />
				</label>
			{:else if isAnsweredLikertQuestion(answeredQuestion)}
				<label>
					{answeredQuestion.question.text}
					<input type="range" bind:value={answeredQuestion.answer} min="1" max="5" />
				</label>
			{:else if isAnsweredBoolQuestion(answeredQuestion)}
				<fieldset class="yes-no l-switcher l-space-none">
					<legend>
						{answeredQuestion.question.text}
					</legend>
					<label>
						<input
							type="radio"
							name="yes"
							checked={answeredQuestion.answer}
							on:change={() => (answeredQuestion.answer = true)}
						/>
						Yes
					</label>
					<label>
						<input
							type="radio"
							name="no"
							checked={answeredQuestion.answer === false}
							on:change={() => (answeredQuestion.answer = false)}
						/>
						No
					</label>
				</fieldset>
			{:else}
				{assertNever(answeredQuestion)}
			{/if}
		</div>
	{/each}
	<p>{status}</p>
	<div class="l-switcher l-space-xs date-and-buttons">
		<label for="datetime" class="label-datetime">
			Date and time
			<DatetimeInput id="datetime" bind:date={datetime} />
		</label>
		<div class="l-cluster-r l-space-xs">
			<button type="submit" aria-busy={saving}>
				{#if saving}
					Saving
				{:else}
					Save
				{/if}
			</button>
		</div>
	</div>
</form>

<style lang="scss">
	.date-and-buttons {
		align-items: flex-end;
		--l-switcher-threshold: 500px;
	}
	.label-datetime {
		margin-bottom: 0;
	}
	fieldset.yes-no.l-switcher {
		--l-switcher-threshold: 10rem;
	}
</style>
