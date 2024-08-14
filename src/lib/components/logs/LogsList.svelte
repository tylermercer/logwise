<script lang="ts">
	import { liveQuery } from 'dexie';
	import db from '$lib/db';
	import { type FormId, DB_FALSE, DB_TRUE, type FormRaw } from '$lib/db/types';
	import ArchiveIcon from 'virtual:icons/teenyicons/archive-outline';

	export let archived: boolean = false;

	let logs = liveQuery(async () => {
		const archivedAsDbBool = archived ? DB_TRUE : DB_FALSE;
		const fetchedLogs = await db.logs.where('isArchived').equals(archivedAsDbBool).toArray();
		const fetchedForms = await db.forms
			.where('id')
			.anyOf(fetchedLogs.map((l) => l.currentFormId))
			.toArray();

		const formsById = fetchedForms.reduce((acc, cur) => {
			acc.set(cur.id, cur);
			return acc;
		}, new Map<FormId, FormRaw>());

		return fetchedLogs
			.sort((a, b) => a.name.localeCompare(b.name))
			.map((l) => ({
				...l,
				form: formsById.get(l.currentFormId)!
			}));
	});
</script>

<div class="logs-list l-column l-space-none u-desktop-scrollbars-y u-styled-scrollbars">
	<slot name="header"></slot>
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
			{:else if archived}
				<p>
					No archived logs.
				</p>
			{:else}
				<p class="empty">
					You don't have any logs yet. Get started by <a href="/app/logs/new">creating one</a>.
				</p>
			{/if}
			{#if !archived}
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
			{/if}
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
	.loader {
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
</style>
