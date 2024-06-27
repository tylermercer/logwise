<script lang="ts">
	import mediaQueries from '$lib/config/mediaQueries';
	import MediaQuery from 'svelte-media-queries';
	import HomeIcon from 'virtual:icons/teenyicons/home-outline';
	import LogIcon from 'virtual:icons/teenyicons/list-layout-outline';
	import MenuIcon from 'virtual:icons/teenyicons/menu-outline';

</script>

<MediaQuery query={mediaQueries.mobile} let:matches>
	{#if matches}
		<nav class="bottom-bar l-row">
			<a role="button" href="/app/">
				<HomeIcon></HomeIcon>
			</a>
			<a role="button" href="/app/log">
				<LogIcon></LogIcon>
			</a>
			<a role="button" href="/app/logs">
				<MenuIcon></MenuIcon>
			</a>
		</nav>
	{/if}
</MediaQuery>

<style lang="scss">
	nav.bottom-bar {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		align-items: stretch;
		border-top: 1px solid var(--primary-6);
		background-color: var(--primary-2);
		& > a {
			flex: 1;
			display: flex;
			align-items: center;
			height: var(--bottom-bar-height);
			justify-content: center;
			color: var(--primary-9);
			background-color: transparent;
			&:active {
				background-color: var(--primary-3);
			}
		}
	}
</style>
