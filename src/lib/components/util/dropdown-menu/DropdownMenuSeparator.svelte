<script lang="ts">
	import { getContext } from 'svelte';
	import { DROPDOWN_MENU_SEPARATOR } from './DropdownMenu.svelte';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';

	type MeltSeparator = ReturnType<typeof createDropdownMenu>['elements']['separator'];

	const separator = getContext<MeltSeparator>(DROPDOWN_MENU_SEPARATOR);
</script>

<div class="separator" use:melt={$separator}>
	<slot />
</div>

<style lang="scss">
	.separator {
		height: 1px;
		background-color: #e2e8f0;
	}
</style>
