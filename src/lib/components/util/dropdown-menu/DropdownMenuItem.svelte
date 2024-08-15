<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import { DROPDOWN_MENU_ITEM } from './DropdownMenu.svelte';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';

	type MeltItem = ReturnType<typeof createDropdownMenu>['elements']['item'];

	const item = getContext<MeltItem>(DROPDOWN_MENU_ITEM);

    const dispatch = createEventDispatcher();

	let className: string = '';
	export { className as class };
</script>

<div class={`l-row l-space-2xs item ${className}`} use:melt={$item} on:m-click={(e) => dispatch('item-click', e)}>
	<slot />
</div>

<style lang="scss">
	.item {
		position: relative;
		height: var(--space-l);
		min-height: var(--space-l);
		user-select: none;
		border-radius: var(--space-3xs);
		padding-left: var(--space-2xs);
		padding-right: var(--space-2xs);
		z-index: 40;
		align-items: center;
		font-size: 0.875rem;
		line-height: 1;
		cursor: pointer;
		&:focus {
			outline: none;
		}
		&[data-highlighted] {
			background-color: var(--gray-3);
			outline: none;
		}
		&[data-disabled] {
			color: var(--gray-5);
		}
	}
</style>
