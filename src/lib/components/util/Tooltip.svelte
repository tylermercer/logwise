<script lang="ts">
	import { createTooltip, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	export let text: string;

	const {
		elements: { trigger, content, arrow },
		states: { open }
	} = createTooltip({
		positioning: {
			placement: 'top'
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true
	});
</script>

<div use:melt={$trigger}>
	<slot />
</div>

{#if $open}
	<div
		use:melt={$content}
		transition:fade={{ duration: 100 }}
		class="tooltip-container z-10 rounded-lg bg-white shadow"
	>
		<div use:melt={$arrow} ></div>
		<p class="tooltip px-4 py-1 text-magnum-700">{text}</p>
	</div>
{/if}

<style lang="scss">
	.tooltip-container {
		z-index: 10;
		background-color: var(--gray-1);
		color: var(--gray-12);
		flex-direction: column;
		border-radius: var(--space-2xs);
		box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
    .tooltip {
        padding: calc(var(--space-xs) - var(--space-3xs));
    }
</style>
