<script lang="ts">
	import MungedEmailLink from '$lib/components/MungedEmailLink.svelte';
	import '../styles/base.scss';
	import '../styles/layouts.scss';
	import '../styles/utilities.scss';

	import db from '$lib/db';

	function login() {
		db.cloud.login();
	}
	
	let user = db.cloud.currentUser;
</script>

<slot />
<footer class="container">
	<hr>
	<div class="l-cluster-r">
		{#if $user.isLoggedIn}
			Logged in as {$user.name}
		{:else}
			<button on:click={login}>Log in</button>
		{/if}
	</div>
	<small>
		Created by <a class="secondary" href="https://tylermercer.net">Tyler Mercer</a>. Got feedback? <MungedEmailLink class="secondary">Email me!</MungedEmailLink>
	</small>
</footer>
