<script lang="ts">
	import MungedEmailLink from '$lib/components/MungedEmailLink.svelte';
	import '../styles/base.scss';
	import '../styles/layouts.scss';
	import '../styles/utilities.scss';

	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const db = data.db;

	let user = db.cloud.currentUser;
</script>

<slot />
<footer class="container">
	<hr>
	<div>
		{#if $user.isLoggedIn}
			Logged in as {$user.name}. <a href="/app/" on:click={() => db.cloud.logout()}>Log out</a>
		{:else}
			<button on:click={() => db.cloud.login()}>Log in</button>
		{/if}
	</div>
	<small>
		Created by <a class="secondary" href="https://tylermercer.net">Tyler Mercer</a>. Got feedback? <MungedEmailLink class="secondary">Email me!</MungedEmailLink>
	</small>
</footer>
