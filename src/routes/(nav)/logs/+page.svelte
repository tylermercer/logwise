<script lang="ts">
	import EntriesList from '$lib/components/entries/EntriesList.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
</script>

<svelte:head>
	<title>Unified Log</title>
</svelte:head>
<HeaderBar>
	<h1>Unified Log</h1>
</HeaderBar>
<EntriesList />
