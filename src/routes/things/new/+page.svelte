<script lang="ts">
	import db from '$lib/db';
	import ThingEditor from '$lib/components/ThingEditor.svelte';
	import type { ThingRaw } from '$lib/db';
	import { goto } from '$lib/navigation';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';

	async function handleSubmit(thing: ThingRaw) {
		await db.things.add(thing);

		goto('/things');
	}
</script>

<HeaderBar>
	<a href="/app/things" class="btn-secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>New thing</h1>
</HeaderBar>
<main class="u-guttered">
	<ThingEditor onSubmit={handleSubmit}></ThingEditor>
</main>