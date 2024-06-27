<script lang="ts">
	import MungedEmailLink from '$lib/components/MungedEmailLink.svelte';
	import mediaQueries from '$lib/config/mediaQueries';
	import db from '$lib/db';
	import MediaQuery from 'svelte-media-queries';
	import HomeIcon from 'virtual:icons/teenyicons/home-outline';
	import LogIcon from 'virtual:icons/teenyicons/list-layout-outline';
	import MenuIcon from 'virtual:icons/teenyicons/menu-outline';

	let user = db.cloud.currentUser;
</script>

<slot />
<footer class="u-guttered l-column l-space-xs">
	<hr />
	<div class="l-column l-space-xs">
		{#if $user.isLoggedIn}
			<div>
				Logged in as {$user.name}. <a href="/app/" on:click={() => db.cloud.logout()}>Log out</a>
			</div>
			<div>
				License: {$user.license?.type ?? 'No license'} ({$user.license?.status ?? 'no status'})
			</div>
		{:else}
			<button on:click={() => db.cloud.login()}>Log in</button>
		{/if}
	</div>
	<small>
		Created by <a class="btn-secondary" href="https://tylermercer.net">Tyler Mercer</a>. Got
		feedback? <MungedEmailLink class="btn-secondary">Email me!</MungedEmailLink>
	</small>
</footer>
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
	footer {
		margin-bottom: 44px;
	}
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
			height: 44px;
			justify-content: center;
			color: var(--primary-9);
			background-color: transparent;
			&:active {
				background-color: var(--primary-3);
			}
		}
	}
</style>
