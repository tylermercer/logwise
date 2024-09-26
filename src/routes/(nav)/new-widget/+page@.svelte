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
    let showOnLog: boolean = false;
    let hideOnHome: boolean = false;
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
		<fieldset class="yes-no l-switcher l-space-none">
			<legend>
				Show on Log, Home, or Both?
			</legend>
			<label>
				<input
					type="radio"
					name="on-home"
					checked={!hideOnHome && !showOnLog}
					on:change={() => { showOnLog = false; hideOnHome = false; }}
				/>
				on Home
			</label>
			<label>
				<input
					type="radio"
					name="on-log"
					checked={showOnLog && hideOnHome}
					on:change={() => { showOnLog = true; hideOnHome = true; }}
				/>
				on Log
			</label>
			<label>
				<input
					type="radio"
					name="on-both"
					checked={showOnLog && !hideOnHome}
					on:change={() => { showOnLog = true; hideOnHome = false; }}
				/>
				on both Home and Log
			</label>
		</fieldset>
	{/if}
</main>

<style lang="scss">
	fieldset.yes-no.l-switcher {
		--l-switcher-threshold: 15rem;
	}
</style>