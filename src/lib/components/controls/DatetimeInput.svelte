<script lang="ts">
	import { parse } from 'chrono-node';
	import { dateToString } from '$lib/util/dateUtils';

	export let date = new Date();
	export let id = '';
	export let autofocus = false;
	
	let inputValue = dateToString(date);
	let displayValue = '';

	function getDate(input: string) {
		const results = parse(input);
		return results.length > 0 ? results[0].date() : undefined;
	}

	function handleInput(event: Event) {
		const input = (event.target as HTMLInputElement).value;
		const result = getDate(input);
		displayValue = result ? dateToString(result) : '';
	}

	function handleBlur() {
		inputValue = dateToString(date);
		displayValue = '';
	}

	function handleEnter(event: Event) {
		const kbdEvent = event as KeyboardEvent;
		if (kbdEvent.key === 'Enter' && displayValue) {
			const result = getDate((kbdEvent.target as HTMLInputElement).value);
			if (result) {
				date = result;
				inputValue = result.toLocaleString();
				(kbdEvent.target as HTMLInputElement).blur();
			}
		}
	}

	function handleFocus(event: FocusEvent) {
		(event.target as HTMLInputElement).select();
	}
</script>

<!-- svelte-ignore a11y-autofocus -->
<input
	{id}
	{autofocus}
	type="text"
	bind:value={inputValue}
	on:input={handleInput}
	on:blur={handleBlur}
	on:keydown={handleEnter}
	on:focus={handleFocus}
/>
{#if displayValue}
	<div class="result">{displayValue}</div>
{/if}

<style>
	.result {
		margin-top: 5px;
	}
</style>
