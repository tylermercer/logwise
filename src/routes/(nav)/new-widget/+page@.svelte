<script lang="ts">
	import type { LogId } from '$lib/db/types';
	import type { Widget } from '$lib/widget';

	const widgetsWithLog: Widget['type'][] = [
		'streak',
		'heap',
		'random-entry',
		'last-entry'
	] as const;

	let widgetType: Widget['type'] | undefined = undefined;
	let logId: LogId | undefined = undefined;
</script>

<svelte:head>
	<title>Add Widget</title>
</svelte:head>
<header class="u-guttered">
	<h1>Add Widget</h1>
</header>
<main class="u-guttered l-prose">
	<label>
		Widget Type
		<select bind:value={widgetType}>
			<option>Select an option</option>
			<option value="streak">Streak 🔗</option>
			<option value="heap">Heap 🪙</option>
			<option value="time-chart">Time Chart 📅</option>
			<option value="random-entry">Random Entry 🎲</option>
			<option value="last-entry">Last Entry 🔝</option>
		</select>
	</label>
	{#if widgetType && widgetsWithLog.includes(widgetType)}
		<label>
			Log
			<select bind:value={logId}>
				<option>Select an option</option>
			</select>
		</label>
	{/if}
</main>
