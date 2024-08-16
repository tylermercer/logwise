<script lang="ts">
	import mediaQueries from '$lib/config/mediaQueries';
	import MediaQuery from 'svelte-media-queries';
	import PlusIcon from 'virtual:icons/teenyicons/add-outline';
	import type { LogId } from '$lib/db/types';
	import { fly } from 'svelte/transition';

	export let logId: LogId;
</script>

<MediaQuery query={mediaQueries.mobile} let:matches>
	{#if !matches}
		<a
			role="button"
			class="add-entry u-nav-link l-row l-space-xs"
			href="/app/logs/{logId}/new-entry"
		>
			<PlusIcon />
			Add Entry
		</a>
	{/if}
</MediaQuery>

<style lang="scss">
	a.add-entry {
		padding-left: var(--space-xs);
		align-items: center;
	}
</style>
