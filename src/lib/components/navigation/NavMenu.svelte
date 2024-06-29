<script lang="ts">
	import MungedEmailLink from '$lib/components/MungedEmailLink.svelte';
	import LogsList from "../LogsList.svelte";
	import db from '$lib/db';

	let user = db.cloud.currentUser;
</script>


<header class="u-guttered l-column l-space-xs">
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
</header>
<slot></slot>
<LogsList></LogsList>
<footer class="u-guttered">
	<small>
		Created by <a class="btn-secondary" href="https://tylermercer.net">Tyler Mercer</a>. Got
		feedback? <MungedEmailLink class="btn-secondary">Email me!</MungedEmailLink>
	</small>
</footer>