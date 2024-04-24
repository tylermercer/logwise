<script lang="ts">
	import type { PageData } from './$types';

	import db from '$lib/db';
	import type { QuestionId } from '$lib/db';
	import { goto } from '$lib/navigation';
	import DatetimeInput from '$lib/components/DatetimeInput.svelte';
	import { getType, typeid } from 'typeid-unboxed';

	export let data: PageData;

	let saving = false;
	let status = '';

	let { name, questions, id: thingId } = data.thing;

	let questionAnswers = questions.map((q) => ({
		question: q,
		answer: getType(q.id) === 'text' ? '' : getType(q.id) === 'likert' ? 3 : null!
	}));

	let datetime = new Date();
	datetime.setSeconds(0);

	async function saveEntry() {
		saving = true;
		const answers: Map<QuestionId, any> = new Map<QuestionId, any>();

		questionAnswers.forEach((qa) => (answers.set(qa.question.id, qa.answer)));

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

	function cancel() {
		history.back();
	}
</script>

<header class="container">
	<h1>{name}</h1>
</header>
<main class="container">
	<form on:submit={saveEntry}>
		{#each questionAnswers as questionWithAnswer (questionWithAnswer.question.id)}
			<div class="question">
				<div class="grid">
					<label>
						{questionWithAnswer.question.text}
						{#if getType(questionWithAnswer.question.id) === 'text'}
							<textarea bind:value={questionWithAnswer.answer} />
						{:else if getType(questionWithAnswer.question.id) === 'likert'}
							<input type="range" bind:value={questionWithAnswer.answer} min="1" max="5" />
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
				<button class="secondary" on:click={cancel} type="button">Cancel</button>
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
