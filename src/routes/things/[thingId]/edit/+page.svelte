<script lang="ts">
	import type { PageData } from './$types';

	import db, { DB_NULL } from '$lib/db';
	import ThingEditor from '$lib/components/ThingEditor.svelte';
	import type { ThingRaw } from '$lib/db';
	import { goto } from '$lib/navigation';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';

	export let data: PageData;

	let existingThing = data.existingThing;

	async function handleSubmit(thing: ThingRaw) {
		if (thing.prevVersionId != DB_NULL) {
			await db.things.update(thing.prevVersionId, { nextVersionId: thing.id });
		}
		await db.things.add(thing);

		goto('/things');
	}
</script>

<HeaderBar>
	<a href="/app/things" class="secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>Editing "{existingThing.name}"</h1>
</HeaderBar>
<main class="u-guttered">
	<ThingEditor onSubmit={handleSubmit} {existingThing}></ThingEditor>
</main>
