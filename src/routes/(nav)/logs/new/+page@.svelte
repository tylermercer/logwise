<script lang="ts">
	import db from '$lib/db';
	import FormEditor from '$lib/components/logs/FormEditor.svelte';
	import type { FormRaw } from '$lib/db';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import { goto } from '$app/navigation';

	async function handleSubmit(form: FormRaw) {
		await db.forms.add(form);

		goto('/app/');
	}
</script>

<svelte:head>
	<title>New Log</title>
</svelte:head>
<HeaderBar backHref="/app/">
	<h1>New Log</h1>
</HeaderBar>
<main class="u-guttered">
	<FormEditor onSubmit={handleSubmit}></FormEditor>
</main>
