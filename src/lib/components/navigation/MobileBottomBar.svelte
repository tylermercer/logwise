<script lang="ts">
	import mediaQueries from '$lib/config/mediaQueries';
	import { createEventDispatcher } from 'svelte';
	import MediaQuery from 'svelte-media-queries';
	import HomeIcon from 'virtual:icons/teenyicons/home-outline';
	import LogIcon from 'virtual:icons/teenyicons/list-layout-outline';
	import MenuIcon from 'virtual:icons/teenyicons/menu-outline';
	import CloseIcon from 'virtual:icons/teenyicons/x-outline';
	import { page } from '$app/stores';
	import ariaCurrent from '$lib/util/actions/ariaCurrent';

	const dispatch = createEventDispatcher();

	function toggleMenu() {
		dispatch('toggleMenu');
	}
</script>

<MediaQuery query={mediaQueries.mobile} let:matches>
	{#if matches}
		<nav class="u-mobile-only bottom-bar l-row">
			<a class="bar-link" use:ariaCurrent role="button" href="/app/">
				<HomeIcon></HomeIcon>
				<span class="bar-link-label">Home</span>
			</a>
			<a class="bar-link" use:ariaCurrent role="button" href="/app/log">
				<LogIcon></LogIcon>
				<span class="bar-link-label">Unified Log</span>
			</a>
			<button class="bar-link" on:click={toggleMenu}>
				{#if $page.state.showMenu}
					<CloseIcon></CloseIcon>
				{:else}
					<MenuIcon></MenuIcon>
				{/if}
				<span class="bar-link-label">Menu</span>
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
		& > .bar-link {
			flex: 1;
			display: flex;
			align-items: center;
			flex-direction: column;
			gap: var(--space-3xs);
			height: var(--bottom-bar-height);
			justify-content: center;
			color: var(--primary-9);
			background-color: transparent;
			&:active {
				background-color: var(--primary-3);
			}
			& > .bar-link-label {
				font-size: var(--step--1);
			}
		}
	}
</style>
