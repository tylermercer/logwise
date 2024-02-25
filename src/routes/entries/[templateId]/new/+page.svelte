<script lang="ts">
	import type { PageData } from './$types';

	import db from '$lib/db';
	import type { QuestionId, EntryRaw } from '$lib/db';
	import { goto } from '$lib/navigation';
	import DatetimeInput from '$lib/components/DatetimeInput.svelte';

	export let data: PageData;

	let saving = false;
	let status = '';

	let { name, questions, id: templateId } = data.template;

	let questionAnswers = questions.map((q) => ({
		question: q,
		answer: q.id.startsWith('text') ? '' : q.id.startsWith('likert') ? 3 : null!
	}));

	let datetime = new Date();

	async function saveEntry() {
		saving = true;
		const answers: Record<QuestionId, any> = {};

		questionAnswers.forEach((qa) => (answers[qa.question.id] = qa.answer));

		const now = new Date();

		await db.entries.add({
			id: crypto.randomUUID(),
			displayDatetime: datetime,
			createdDatetime: now,
			modifiedDatetime: now,
			answers,
			templateId
		});
		saving = false;
		goto('/templates');
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
						{#if questionWithAnswer.question.id.startsWith('text')}
							<textarea bind:value={questionWithAnswer.answer} />
						{:else if questionWithAnswer.question.id.startsWith('likert')}
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
