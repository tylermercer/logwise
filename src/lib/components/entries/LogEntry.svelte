<script lang="ts">
	import type { EntryRaw, FormRaw, LogRaw } from '$lib/db';
	import db from '$lib/db';
	import { isBoolQuestion } from '$lib/question/bool';
	import { isLikertQuestion } from '$lib/question/likert';
	import { isTextQuestion } from '$lib/question/text';
	import assertNever from '$lib/util/assertNever';
	import { dateToString } from '$lib/util/dateUtils';

	export let entry: EntryRaw;
	export let form: FormRaw | undefined = undefined;
	export let log: LogRaw | undefined = undefined;

	async function getForm() {
		return form ?? (await db.forms.get(entry.formId));
	}

	async function getLogAndForm(): Promise<{ log: LogRaw, form: FormRaw } | undefined> {
		if (log && form) return { log, form };
		const awaitedForm = await getForm();
		const awaitedLog = awaitedForm ? (await db.logs.get(awaitedForm.logId)) : undefined;
		if (awaitedForm && awaitedLog) {
			return {
				log: awaitedLog,
				form: awaitedForm,
			}
		}
		else return undefined;
	}

	let dataPromise = getLogAndForm();
</script>

<div class="l-column l-space-s">
	{#await dataPromise}
		<div aria-busy="true"></div>
	{:then data}
		{#if data}
			<h2>
				{data.log.name}
				<time
					class="datetime"
				>
					{dateToString(entry.displayDatetime)}
				</time>
			</h2>
			{#each data.form.questions as q (q.id)}
				<div class="l-column l-space-xs">
					<h3>{q.text}</h3>
					{#if isLikertQuestion(q)}
						<p data-qtype="likert">
							{#if entry.answers.get(q.id) != null}
								<span class="some">
									{entry.answers.get(q.id)} / 5
								</span>
							{:else}
								<span class="none">(No answer)</span>
							{/if}
						</p>
					{:else if isTextQuestion(q)}
						<p data-qtype="text">
							{#if entry.answers.get(q.id)}
								{entry.answers.get(q.id)}
							{:else}
								<span class="none">(No answer)</span>
							{/if}
						</p>
					{:else if isBoolQuestion(q)}
						<p data-qtype="bool">
							{#if entry.answers.get(q.id) != null}
								<span class="some">
									{entry.answers.get(q.id) ? 'Yes' : 'No'}
								</span>
							{:else}
								<span class="none">(No Answer)</span>
							{/if}
						</p>
					{:else}
						{assertNever(q)}
					{/if}
				</div>
			{/each}
		{:else}
			<!-- TODO: handle this?? -->
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style lang="scss">
	h2,
	h3 {
		font-weight: 600;
	}
	h2 {
		font-size: 0.9em;
	}
	h3 {
		font-size: 0.85em;
	}
	time {
		float: right;
		font-weight: normal;
		font-size: 0.9em;
	}
	p[data-qtype='likert'] > .some,
	p[data-qtype='bool'] > .some {
		font-weight: bold;
		font-size: 1.5em;
		line-height: 1;
	}
	.none {
		opacity: 0.75;
	}
</style>
