<script context="module" lang="ts">
	export const DROPDOWN_MENU_ITEM = 'DROPDOWN_MENU_ITEM';
	export const DROPDOWN_MENU_SEPARATOR = 'DROPDOWN_MENU_SEPARATOR';
</script>

<script lang="ts">
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import MenuIcon from 'virtual:icons/teenyicons/more-vertical-outline';
	import { fly } from 'svelte/transition';
	import { setContext } from 'svelte';

	let className: string = '';
	export { className as class };
	
	const {
		elements: { trigger, menu, item, separator, overlay },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		loop: true
	});

	setContext(DROPDOWN_MENU_ITEM, item);
	setContext(DROPDOWN_MENU_SEPARATOR, separator);

</script>

<button class="btn-icon {className}" type="button" use:melt={$trigger} aria-label="More options">
	<slot name="trigger"><MenuIcon /></slot>
</button>
{#if $open}
	<div use:melt={$overlay} class="overlay"/>
	<div
		class="menu l-column l-space-2xs"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -10 }}
	>
		<slot />
	</div>
{/if}

<style lang="scss">
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 40;
	}
	.menu {
		z-index: 40;
		display: flex;
		max-height: 300px;
		min-width: 220px;
		color: var(--gray-12);
		flex-direction: column;
		border-radius: var(--space-2xs);
		padding: calc(var(--space-xs) - var(--space-3xs));
		box-shadow:
		0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05);
		border: 1px solid var(--gray-6);
		background-color: var(--gray-1);
		
		& > :global(hr) {
			margin-top: var(--space-3xs);
			margin-bottom: var(--space-3xs);
		}
	}
</style>
