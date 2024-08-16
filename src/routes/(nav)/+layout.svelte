<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import LogsList from '$lib/components/logs/LogsList.svelte';
	import MobileBottomBar from '$lib/components/navigation/MobileBottomBar.svelte';
	import NavHeaderMenu from '$lib/components/navigation/NavHeaderMenu.svelte';

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
	<div class="page">
		<slot />
	</div>
{/if}
<MobileBottomBar on:toggleMenu={toggleMenu} />

<style lang="scss">
	.menu {
		background-color: var(--primary-1);
		padding-bottom: calc(var(--bottom-bar-height) + var(--space-2xs));
	}
	.page {
		padding-bottom: calc(var(--bottom-bar-height) + var(--space-2xs));
	}
</style>
