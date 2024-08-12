<script lang="ts">
    import LogsList from '$lib/components/logs/LogsList.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
</script>

<svelte:head>
    <title>Archived Logs</title>
</svelte:head>
<HeaderBar>
    <h1>Archived Logs</h1>
</HeaderBar>
<main class="u-guttered">
    <LogsList archived/>
</main>