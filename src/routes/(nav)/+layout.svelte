<script lang="ts">
	import MungedEmailLink from '$lib/components/MungedEmailLink.svelte';
	import MobileBottomBar from '$lib/components/navigation/MobileBottomBar.svelte';
	import db from '$lib/db';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import LogsList from '$lib/components/navigation/LogsList.svelte';

	let user = db.cloud.currentUser;

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
	<LogsList></LogsList>
{:else}
	<slot />
{/if}

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
<MobileBottomBar on:toggleMenu={toggleMenu} />

<style lang="scss">
	footer {
		margin-bottom: var(--bottom-bar-height);
	}
</style>
