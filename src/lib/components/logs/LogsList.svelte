<script lang="ts">
	import getAllLogsByIsArchived from '$lib/db/queries/getAllLogsByIsArchived';
	import { DB_FALSE } from '$lib/db/types';
	import { liveQuery } from 'dexie';
	import Plus from 'virtual:icons/teenyicons/add-small-outline';
	import ArchiveIcon from 'virtual:icons/teenyicons/archive-outline';
	import Tooltip from '../util/Tooltip.svelte';

	let logs = liveQuery(() => getAllLogsByIsArchived(DB_FALSE));
</script>

<div class="logs-list l-column l-space-none u-desktop-scrollbars-y u-styled-scrollbars">
	<p class="heading l-row h4">
		<span class="h4">Logs</span>
		<Tooltip text="Add new log">
			<a
				href="/app/logs/new"
				class="btn-icon add-new-button"
				role="button"
				aria-label="Add new log"
			>
				<Plus />
			</a>
		</Tooltip>
	</p>
	{#if $logs}
		<div class="u-desktop-scrollbars-y u-styled-scrollbars">
			{#if $logs.length}
				<ul class="list l-column l-space-none">
					{#each $logs as log (log.id)}
						<li class="form">
							<a href="/app/logs/{log.id}" class="u-item-link u-break-words">
								{log.name || '(Unnamed)'}
							</a>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="empty">
					You don't have any logs yet. Get started by <a href="/app/logs/new">creating one</a>.
				</p>
			{/if}
			<hr class="separator" />
			<p>
				<a
					class="archive-link u-nav-link l-row l-space-xs"
					role="button"
					href={`/app/logs/archived`}
				>
					<ArchiveIcon />&nbsp;View Archive
				</a>
			</p>
		</div>
	{:else}
		<p class="loader"><span aria-busy={!$logs}>Loading...</span></p>
	{/if}
</div>

<style lang="scss">
	.logs-list {
		margin-top: var(--space-s);
	}
	.empty,
	.loader {
		padding-top: var(--space-xs);
		padding-bottom: var(--space-xs);
	}
	.empty,
	.loader,
	.heading {
		padding-left: var(--space-m);
		padding-right: var(--space-m);
	}
	.separator {
		border-color: var(--primary-5);
		margin-left: var(--space-m);
		margin-right: var(--space-m);
		width: auto;
	}
	.archive-link {
		margin-bottom: var(--space-m);
	}

	.heading {
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: 0;
		background-color: var(--u-cascading-bg, var(--primary-1));
	}
	.add-new-button {
		margin-right: calc(var(--space-xs) * -1);
	}
</style>
