<script context="module" lang="ts">
	import type { Question } from '$lib/question';
	import { getType, typeid } from 'typeid-unboxed';
	import { nanoid } from 'nanoid';
	export function newDraftQuestion(): DraftQuestion {
		return {
			tempId: nanoid(),
			type: 'text',
			data: {
				text: ''
			}
		};
	}

	export function questionToDraftQuestion(q: Question): DraftQuestion {
		return {
			tempId: q.id,
			type: getType(q.id),
			data: {
				text: q.text
			}
		};
	}
	export function draftQuestionToQuestion(q: DraftQuestion) {
		return q.type == 'likert'
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
					: assertNever(q.type);
	}
</script>

<script lang="ts">
	import type { DraftQuestion } from '$lib/question';
	import assertNever from '$lib/util/assertNever';
	import TrashIcon from 'virtual:icons/teenyicons/bin-outline';
	import UpIcon from 'virtual:icons/teenyicons/up-outline';
	import DownIcon from 'virtual:icons/teenyicons/down-outline';
	import DragIcon from 'virtual:icons/teenyicons/drag-vertical-outline';
	import PlusIcon from 'virtual:icons/teenyicons/add-outline';
	import Tooltip from '../util/Tooltip.svelte';
	import autoAnimate from '@formkit/auto-animate';

	export let questions: DraftQuestion[];

	function addQuestion() {
		questions = [...questions, newDraftQuestion()];
	}

	function deleteQuestion(tempId: string) {
		questions = questions.filter((q) => q.tempId !== tempId);
	}

	function moveQuestionUp(startIndex: number) {
		if (startIndex <= 0 || startIndex >= questions.length) return;

		questions = [
			...questions.slice(0, startIndex - 1),
			questions[startIndex],
			questions[startIndex - 1],
			...questions.slice(startIndex + 1)
		];
	}

	function moveQuestionDown(startIndex: number) {
		if (startIndex < 0 || startIndex >= questions.length - 1) return;

		questions = [
			...questions.slice(0, startIndex),
			questions[startIndex + 1],
			questions[startIndex],
			...questions.slice(startIndex + 2)
		];
	}
</script>

<div class="l-column">
	<fieldset class="questions l-column l-space-s">
		<legend><h2>Questions</h2></legend>

		<div class="l-column l-space-s" use:autoAnimate>
			{#if questions.length}
				{#each questions as question, i (question.tempId)}
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
							<button
								type="button"
								on:click={() => moveQuestionUp(i)}
								class="btn-icon"
								aria-disabled={i === 0 ? 'true' : undefined}
								disabled={i === 0}
							>
								<UpIcon />
							</button>
							<!-- <button
					type="button"
					on:click={() => deleteQuestion(question.tempId)}
					class="btn-icon"
					>
					<DragIcon/>
					</button> -->
							<button
								type="button"
								on:click={() => moveQuestionDown(i)}
								class="btn-icon"
								aria-disabled={i === questions.length - 1 ? 'true' : undefined}
								disabled={i === questions.length - 1}
							>
								<DownIcon />
							</button>
						</div>
					</div>
				{/each}
			{:else}
				<p>No questions</p>
			{/if}
		</div>
	</fieldset>
	<div class="btn-add-question-container l-cluster-r">
		<Tooltip text="Add question">
			<button class="btn-icon" aria-label="Add question" type="button" on:click={addQuestion}>
				<PlusIcon />
			</button>
		</Tooltip>
	</div>
</div>

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
