<script lang="ts">
	import NavMenu from './NavMenu.svelte';
	import MediaQuery from 'svelte-media-queries';
	import mediaQueries from '$lib/config/mediaQueries';
	import HomeIcon from 'virtual:icons/teenyicons/home-outline';
	import LogIcon from 'virtual:icons/teenyicons/list-layout-outline';
</script>

<MediaQuery query={mediaQueries.mobile} let:matches>
    {#if !matches}
        <nav class="sidebar u-desktop-only u-styled-scrollbars">
            <NavMenu>
				<div class="l-column l-space-none">
					<a class="u-nav-link l-row l-space-s" role="button" href="/app/">
						<HomeIcon></HomeIcon> Home
					</a>
					<a class="u-nav-link l-row l-space-s" role="button" href="/app/logs">
						<LogIcon></LogIcon> Unified Log
					</a>
				</div>
			</NavMenu>
		</nav>
	{/if}
</MediaQuery>

<style lang="scss">
	.sidebar {
		max-width: 40vw;
		max-height: 100vh;
		width: 20rem;
		background-color: var(--primary-3);
		overflow-y: auto;
		position: sticky;
		top: 0;
	}
</style>
