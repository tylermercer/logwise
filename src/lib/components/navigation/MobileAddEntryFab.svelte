<script lang="ts">
	import mediaQueries from '$lib/config/mediaQueries';
	import MediaQuery from 'svelte-media-queries';
	import PlusIcon from 'virtual:icons/teenyicons/add-outline';
	import type { LogId } from '$lib/db/types';
	import { fly } from 'svelte/transition';

	export let logId: LogId;
</script>

<MediaQuery query={mediaQueries.mobile} let:matches>
	{#if matches}
		<a
			role="button"
			class="fab btn-primary l-row l-space-xs"
			href="/app/logs/{logId}/new-entry"
			in:fly|global={{ duration: 150, y: 40 }}
		>
			<PlusIcon />
			Add Entry
		</a>
	{/if}
</MediaQuery>

<style lang="scss">
	a.fab {
		position: fixed;
		left: 50vw;
		transform: translateX(-50%);
		bottom: calc(var(--bottom-bar-height) + var(--space-xs));
		align-items: center;
	}
</style>
