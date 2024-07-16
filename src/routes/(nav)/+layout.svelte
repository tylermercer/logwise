<script lang="ts">
	import MobileBottomBar from '$lib/components/navigation/MobileBottomBar.svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import NavHeaderMenu from '$lib/components/navigation/NavHeaderMenu.svelte';
	import LogsList from '$lib/components/logs/LogsList.svelte';

	function toggleMenu() {
		if ($page.state.showMenu) {
			history.back();
		} else {
			pushState('', {
				showMenu: true
			});
		}
	}
</script>

{#if $page.state.showMenu}
	<div class="menu">
		<NavHeaderMenu></NavHeaderMenu>
		<LogsList />
	</div>
{:else}
	<slot />
{/if}
<MobileBottomBar on:toggleMenu={toggleMenu} />

<style lang="scss">
	.menu {
		background-color: var(--primary-1);
		padding-bottom: calc(var(--bottom-bar-height) + var(--l-space));
	}
</style>
