<script lang="ts">
	import '../styles/styles.scss';
	import LogIn from '$lib/components/LogIn.svelte';
	import NavMenu from '$lib/components/navigation/NavMenu.svelte';
	import MediaQuery from 'svelte-media-queries';
	import mediaQueries from '$lib/config/mediaQueries';
	import HomeIcon from 'virtual:icons/teenyicons/home-outline';
	import LogIcon from 'virtual:icons/teenyicons/list-layout-outline';
</script>

<svelte:head>
	<title>Logwise</title>
</svelte:head>
<div class="with-maybe-sidebar">
	<MediaQuery query={mediaQueries.mobile} let:matches>
		{#if !matches}
			<nav class="sidebar">
				<NavMenu>
					<div class="l-column l-space-none">
						<a class="nav-link l-row l-space-s" role="button" href="/app/">
							<HomeIcon></HomeIcon> Home
						</a>
						<a class="nav-link l-row l-space-s" role="button" href="/app/log">
							<LogIcon></LogIcon> Unified Log
						</a>
					</div>
				</NavMenu>
			</nav>
		{/if}
	</MediaQuery>
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
	.sidebar {
		width: 20rem;
		background-color: var(--primary-3);
	}
	.nav-link {
		color: var(--primary-9);
		background-color: transparent;
		padding: var(--space-xs);
		padding-left: var(--space-m);
		font-size: var(--step-0);
		align-items: center;
		&:hover {
			background-color: var(--primary-4);
			color: var(--primary-12);
		}
	}
</style>
