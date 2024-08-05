<script lang="ts">
	import EntriesList from '$lib/components/entries/EntriesList.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import Tooltip from '$lib/components/util/Tooltip.svelte';
	import PlusIcon from 'virtual:icons/teenyicons/add-outline';
	import type { PageData } from './$types';

	export let data: PageData;
	$: log = data.log;
</script>

<svelte:head>
	<title>Log</title>
</svelte:head>
<HeaderBar>
	<h1>{log.name}</h1>
	<svelte:fragment slot="actions">
		<Tooltip text="Add Entry">
			<a class="btn-edit btn-icon" role="button" href={`/app/logs/${log.id}/new-entry`}>
				<PlusIcon />
			</a>
		</Tooltip>
	</svelte:fragment>
</HeaderBar>
{#key log}
	<EntriesList {log} />
{/key}
