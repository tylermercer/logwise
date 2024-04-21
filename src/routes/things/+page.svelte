<script lang="ts">
	import { liveQuery } from 'dexie';
	import db, { DB_NULL, type ThingId } from '$lib/db';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';

	let things = liveQuery(() => db.things.where('nextVersionId').equals(DB_NULL).toArray());

	let pendingDeletionId: ThingId | undefined;
	async function deleteThing(e: Event, id: ThingId) {
		e.preventDefault();
		e.stopImmediatePropagation();
		if (pendingDeletionId) {
			await db.things.delete(pendingDeletionId);
			pendingDeletionId = undefined;
		} else {
			pendingDeletionId = id;
			setTimeout(() => (pendingDeletionId = undefined), 3000);
		}
	}
</script>

<HeaderBar>
	<a href="/app/" class="secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>My Things</h1>
</HeaderBar>
<main class="container">
	{#if $things}
		{#if $things.length}
			<ul class="things-list">
				{#each $things as thing (thing.id)}
					<li class="thing">
						<a href="/app/things/{thing.id}/new-entry" class="u-link-block">
							<div class="thing-contents">
								{thing.name || '(Unnamed)'}
								<div class="l-cluster-r actions">
									<a
										href="/app/things/{thing.id}/edit"
										class="outline secondary"
										role="button"
									>
										Edit
									</a>
									<button
										class="outline"
										class:secondary={pendingDeletionId !== thing.id}
										class:contrast={pendingDeletionId === thing.id}
										on:click={(e) => deleteThing(e, thing.id)}
									>
										{#if pendingDeletionId === thing.id}
											Confirm
										{:else}
											Delete
										{/if}
									</button>
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p>You don't have any Things yet. Get started by <a href="/app/things/new">creating one</a>.</p>
		{/if}
	{:else}
		<p><span aria-busy={!$things}>Loading...</span></p>
	{/if}
	<div class="l-cluster-r">
		<a href="/app/things/new" role="button">Add new thing</a>
	</div>
</main>

<style lang="scss">
	.things-list {
		padding-left: 0;
		& > li {
			&:first-child {
				border-top: 1px solid var(--pico-muted-border-color);
			}
			list-style-type: none;
			border-bottom: 1px solid var(--pico-muted-border-color);
		}
	}
	.thing-contents {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: space-between;
		align-items: center;
		padding-block: 0.5rem;
		& .actions {
			align-items: center;
		}
	}
</style>
