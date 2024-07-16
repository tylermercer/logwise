<script lang="ts">
	import '../styles/styles.scss';
	import LogIn from '$lib/components/auth/LogIn.svelte';
	import DesktopSidebar from '$lib/components/navigation/DesktopSidebar.svelte';
	import { initBackButtonLinks } from '$lib/util/actions/backButtonLink';
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/stores';

	//Auto-upgrade
	beforeNavigate(({ willUnload, to }) => {
		if ($updated && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});

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
		min-height: 100svh;
		& > :not(.sidebar) {
			flex: 1;
		}
	}
</style>
