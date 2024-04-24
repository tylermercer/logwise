<script lang="ts">
	import type { PageData } from './$types';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import LogEntry from '$lib/components/LogEntry.svelte';

	export let data: PageData;

	let existingEntry = data.existingEntry;
</script>

<HeaderBar>
	<a href="/app/log" class="secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>Entry</h1>
</HeaderBar>
<main class="container">
	<LogEntry entry={existingEntry}></LogEntry>
</main>
