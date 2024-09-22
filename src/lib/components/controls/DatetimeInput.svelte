<script lang="ts">
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { parse, type ParsedResult } from 'chrono-node';
	import { dateToString } from '$lib/util/dateUtils';
	import { fly } from 'svelte/transition';
	import UpArrow from 'virtual:icons/teenyicons/up-outline';

	const now = new Date();

	export let date = now;
	export let autofocus = false;

	const toOption = (result: ParsedResult): ComboboxOptionProps<Date> => ({
		value: result.date(),
		label: dateToString(result.date())
	});

	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput, selected },
		// helpers: { isSelected }
	} = createCombobox<Date>({
		forceVisible: true,
		onSelectedChange({next}) {
			console.log("selected change");
			if (next) {
				date = next.value;
			}
			return next;
		},
		onOpenChange({ next }) {
			if (!next) handleClose();
			return next;
		}
	});

	function handleClose(){
		console.log("Close handled");
		$selected = resultDates.at(0);
		$inputValue = $selected?.label ?? '';
	}

	$: resultDates = $touchedInput ? parse($inputValue).map(toOption) : [];
</script>

<div class="flex flex-col gap-1">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label}>Date and time</label>

	<div class="input-container">
		<!-- svelte-ignore a11y-autofocus -->
		<input use:melt={$input} placeholder="Right now" {autofocus} />
		<div class="arrow" class:arrow-open={$open}>
			<UpArrow />
		</div>
	</div>
</div>
{#if $open}
	<ul class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -5 }}>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div class="inner-menu" tabindex="0">
			{#each resultDates as result, index (index)}
				<li use:melt={$option(result)} class="option">{result.label}</li>
			{:else}
				<li class="no-results">
					{#if $inputValue}
						Invalid date
					{:else}
						e.g. "1 hour ago" or "yesterday at 4pm"
					{/if}
				</li>
				
			{/each}
		</div>
	</ul>
{/if}

<style lang="scss">
	.input-container {
		position: relative;
	}
	li {
		list-style-type: none;
	}
	.menu {
		list-style-type: none;
		padding: 0;
		z-index: 10;
		display: flex;
		max-height: 300px;
		flex-direction: column;
		overflow: hidden;
		border-radius: 0.5rem;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
	.inner-menu {
		display: flex;
		max-height: 100%;
		flex-direction: column;
		gap: 0;
		overflow-y: auto;
		background-color: var(--gray-2);
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		color: var(--gray-12);
	}
	.arrow {
		pointer-events: none;
		transform-origin: center;
		font-size: var(--step--1);
		position: absolute;
		right: 0;
		aspect-ratio: 1;
		height: 100%;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		color: var(--gray-11);
		transition: transform ease-in-out 100ms;
		&-open {
			transform: rotate(-180deg);
		}
	}
	.option,
	.no-results {
		position: relative;
		border-radius: 0.375rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}
	.option {
		cursor: pointer;
		color: var(--gray-12);
		&:hover {
			background-color: var(--primary-3);
			color: var(--primary-12);
		}
		&[data-highlighted] {
			background-color: var(--primary-4);
			color: var(--primary-12);
		}
		&[data-disabled] {
			opacity: 0.5;
		}
	}
	.no-results {
		color: var(--gray-11);
	}
</style>
