<script lang="ts">
	import type { PageData } from './$types';
	import db from '$lib/db';
	import type { QuestionId } from '$lib/db';
	import { goto } from '$lib/navigation';
	import DatetimeInput from '$lib/components/DatetimeInput.svelte';
	import { typeid } from 'typeid-unboxed';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import { isAnsweredTextQuestion } from '$lib/question/text';
	import { isAnsweredLikertQuestion } from '$lib/question/likert';
	import assertNever from '$lib/util/assertNever';
	import { toAnsweredQuestion } from '$lib/question';

	export let data: PageData;

	let saving = false;
	let status = '';

	let { name, questions, id: thingId } = data.thing;

	let answeredQuestions = questions.map(toAnsweredQuestion);

	let datetime = new Date();
	datetime.setSeconds(0);

	async function saveEntry() {
		saving = true;
		const answers: Map<QuestionId, any> = new Map<QuestionId, any>();

		answeredQuestions.forEach((qa) => answers.set(qa.question.id, qa.answer));

		const now = new Date();

		await db.entries.add({
			id: typeid('entry'),
			displayDatetime: datetime,
			createdDatetime: now,
			modifiedDatetime: now,
			answers,
			thingId
		});
		saving = false;
		goto('/log', {
			replaceState: true
		});
	}
</script>

<svelte:head>
    <title>{name}</title>
</svelte:head>
<HeaderBar>
	<a href="/app/things" class="btn-secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>{name}</h1>
</HeaderBar>
<main class="u-guttered">
	<form on:submit={saveEntry}>
		{#each answeredQuestions as answeredQuestion (answeredQuestion.question.id)}
			<div class="question">
				<div class="grid">
					<label>
						{answeredQuestion.question.text}
						{#if isAnsweredTextQuestion(answeredQuestion)}
							<textarea bind:value={answeredQuestion.answer} />
						{:else if isAnsweredLikertQuestion(answeredQuestion)}
							<input type="range" bind:value={answeredQuestion.answer} min="1" max="5" />
						{:else}
							{assertNever(answeredQuestion)}
						{/if}
					</label>
				</div>
			</div>
		{/each}
		<hr />
		<p>{status}</p>
		<div class="l-switcher date-and-buttons">
			<label for="datetime" class="label-datetime">
				Date and time
				<DatetimeInput id="datetime" bind:value={datetime} />
			</label>
			<div class="l-cluster-r">
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
</main>

<style lang="scss">
	.date-and-buttons {
		align-items: flex-end;
		--l-switcher-threshold: 676px;
	}
	.label-datetime {
		margin-bottom: 0;
	}
</style>
