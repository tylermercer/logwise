<script lang="ts">
	import MobileBottomBar from '$lib/components/navigation/MobileBottomBar.svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import NavMenu from '$lib/components/navigation/NavMenu.svelte';


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
	<NavMenu></NavMenu>
{:else}
	<slot />
{/if}
<MobileBottomBar on:toggleMenu={toggleMenu} />
