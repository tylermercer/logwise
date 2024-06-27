<script lang="ts">
	import '../styles/styles.scss';
	import LogIn from '$lib/components/LogIn.svelte';
	import NavMenu from '$lib/components/navigation/NavMenu.svelte';
	import MediaQuery from 'svelte-media-queries';
	import mediaQueries from '$lib/config/mediaQueries';
</script>

<svelte:head>
	<title>Logwise</title>
</svelte:head>
<div class="with-maybe-sidebar">
	<MediaQuery query={mediaQueries.mobile} let:matches>
		{#if !matches}
			<nav class="sidebar">
				<NavMenu></NavMenu>
			</nav>
		{/if}
	</MediaQuery>
	<div>
		<slot />
	</div>
</div>
<LogIn />

<style lang="scss">
	.with-maybe-sidebar {
		display: flex;
		align-items: stretch;
		min-height: 100vh;
		min-height: 100lvh;
	}
	.sidebar {
		width: 20rem;
		background-color: var(--primary-3);
	}
</style>
