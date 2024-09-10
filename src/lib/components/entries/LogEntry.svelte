<script lang="ts">
	import type { ExtendedEntry } from '$lib/db/types/ExtendedEntry';
	import { isBoolQuestion } from '$lib/question/bool';
	import { isLikertQuestion } from '$lib/question/likert';
	import { isTextQuestion } from '$lib/question/text';
	import assertNever from '$lib/util/assertNever';
	import { dateOnlyToString, dateToString, timeToString } from '$lib/util/dateUtils';
	import Markdown from '../util/Markdown.svelte';

	export let entry: ExtendedEntry;

	// TODO: change this to composition at some point
	export let showLogName: boolean = false;
	export let showEntryLink: boolean = false;

	$: questionHeading = showLogName ? 'h3' : 'h2';

	$: timeAsTitle = !showLogName && entry.form.questions.length === 0;
</script>

<div class="l-column l-space-s">
	<div class="l-row title-row">
		<h2>
			{#if showLogName}
				<a href="/app/logs/{entry.log.id}">{entry.log.name}</a>
			{:else}
				{timeAsTitle ? timeToString(entry.displayDatetime) : entry.form.questions[0].text}
			{/if}
		</h2>
		<time class="datetime">
			{#if showEntryLink}
				<a href="/app/logs/{entry.log.id}/{entry.id}">
					{timeAsTitle
						? dateOnlyToString(entry.displayDatetime)
						: dateToString(entry.displayDatetime)}
				</a>
			{:else}
				<span>
					{timeAsTitle
						? dateOnlyToString(entry.displayDatetime)
						: dateToString(entry.displayDatetime)}
				</span>
			{/if}
		</time>
	</div>
	{#each entry.form.questions as q, i (q.id)}
		<div class="l-column l-space-xs">
			{#if i !== 0 || showLogName}
				<svelte:element this={questionHeading}>{q.text}</svelte:element>
			{/if}
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
				<div data-qtype="text" class="u-break-words l-prose">
					{#if entry.answers.get(q.id)}
						<Markdown text={entry.answers.get(q.id)} />
					{:else}
						<span class="none">(No answer)</span>
					{/if}
				</div>
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
</div>

<style lang="scss">
	.title-row {
		flex-wrap: nowrap;
		align-items: flex-start;
		& > h2 {
			min-width: 0;
			flex-basis: 0;
			flex-grow: 1;
			line-height: 1;
		}
		& > time {
			line-height: 1;
			flex-basis: max-content;
			font-family: var(--font-heading);
			color: var(--primary-12);
			font-size: 0.81em;
			font-weight: normal;
		}
	}
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
