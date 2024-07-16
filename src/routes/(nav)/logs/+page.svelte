<script lang="ts">
	import EntriesList from '$lib/components/entries/EntriesList.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
</script>

<svelte:head>
	<title>Log</title>
</svelte:head>
<HeaderBar>
	<h1>Log</h1>
</HeaderBar>
<EntriesList />
