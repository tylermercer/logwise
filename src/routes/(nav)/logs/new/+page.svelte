<script lang="ts">
	import db from '$lib/db';
	import FormEditor from '$lib/components/FormEditor.svelte';
	import type { FormRaw } from '$lib/db';
	import { goto } from '$lib/navigation';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import HeaderBar from '$lib/components/HeaderBar.svelte';

	async function handleSubmit(form: FormRaw) {
		await db.forms.add(form);

		goto('/logs');
	}
</script>

<svelte:head>
	<title>New Form</title>
</svelte:head>
<HeaderBar>
	<a href="/app/logs" class="btn-secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	<h1>New form</h1>
</HeaderBar>
<main class="u-guttered">
	<FormEditor onSubmit={handleSubmit}></FormEditor>
</main>