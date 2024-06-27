<script lang="ts">
	import mediaQueries from '$lib/config/mediaQueries';
	import { createEventDispatcher } from 'svelte';
	import MediaQuery from 'svelte-media-queries';
	import HomeIcon from 'virtual:icons/teenyicons/home-outline';
	import LogIcon from 'virtual:icons/teenyicons/list-layout-outline';
	import MenuIcon from 'virtual:icons/teenyicons/menu-outline';
	import CloseIcon from 'virtual:icons/teenyicons/x-outline';
	import { page } from '$app/stores';

	const dispatch = createEventDispatcher();

	function toggleMenu() {
		dispatch('toggleMenu');
	}
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
			<button on:click={toggleMenu}>
				{#if $page.state.showMenu}
					<CloseIcon></CloseIcon>
				{:else}
					<MenuIcon></MenuIcon>
				{/if}
			</button>
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
		& > a,
		& > button {
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
