<script lang="ts">
	import '../styles/styles.scss';
	import LogIn from '$lib/components/LogIn.svelte';
	import DesktopSidebar from '$lib/components/navigation/DesktopSidebar.svelte';
	import { initBackButtonLinks } from '$lib/util/actions/backButtonLink';

	initBackButtonLinks();
</script>

<svelte:head>
	<title>Logwise</title>
</svelte:head>
<div class="with-maybe-sidebar">
	<DesktopSidebar></DesktopSidebar>
	<div>
		<slot />
	</div>
</div>
<LogIn />

<style lang="scss">
	.with-maybe-sidebar {
		display: flex;
		align-items: stretch;
		min-height: 100vh;
		min-height: 100lvh;
		& > :not(.sidebar) {
			flex: 1;
		}
	}
</style>
