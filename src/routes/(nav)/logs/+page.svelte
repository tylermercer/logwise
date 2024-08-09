<script lang="ts">
	import EntriesList from '$lib/components/entries/EntriesList.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import getAllEntriesPaginated from '$lib/db/queries/getAllEntriesPaginated';
</script>

<svelte:head>
	<title>Unified Log</title>
</svelte:head>
<HeaderBar>
	<h1>Unified Log</h1>
</HeaderBar>
<EntriesList paginatedQuery={getAllEntriesPaginated} />
