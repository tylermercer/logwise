<script lang="ts">
	import NavHeaderMenu from './NavHeaderMenu.svelte';
	import MediaQuery from 'svelte-media-queries';
	import mediaQueries from '$lib/config/mediaQueries';
	import HomeIcon from 'virtual:icons/teenyicons/home-outline';
	import LogIcon from 'virtual:icons/teenyicons/list-layout-outline';
	import LogsList from '$lib/components/logs/LogsList.svelte';
	import LogsListHeader from '$lib/components/logs/LogsListHeader.svelte';
</script>

<MediaQuery query={mediaQueries.mobile} let:matches>
	{#if !matches}
		<nav class="sidebar l-column l-space-2xs u-desktop-only u-styled-scrollbars u-cascading-bg">
			<NavHeaderMenu />
			<div class="l-column l-space-none">
				<a class="u-nav-link l-row l-space-s" role="button" href="/app/">
					<HomeIcon></HomeIcon> Home
				</a>
				<a class="u-nav-link l-row l-space-s" role="button" href="/app/logs">
					<LogIcon></LogIcon> Unified Log
				</a>
			</div>
			<LogsList>
				<LogsListHeader slot="header" />
			</LogsList>
		</nav>
	{/if}
</MediaQuery>

<style lang="scss">
	.sidebar {
		--u-cascading-bg: var(--primary-3);
		max-width: 40vw;
		max-height: 100vh;
		width: 20rem;
		height: 100vh;
		position: sticky;
		top: 0;
		bottom: 0;
	}
</style>
