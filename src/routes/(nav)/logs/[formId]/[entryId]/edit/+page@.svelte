<script lang="ts">
	import { goto } from '$app/navigation';
	import EntryForm from '$lib/components/EntryForm.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const title = 'Editing entry';

	const backHref = `/app/logs/${data.form.id}/${data.entry.id}`;

	async function onSubmit() {
		goto(backHref, {
			replaceState: true
		});
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<HeaderBar {backHref}>
	<h1>{title}</h1>
</HeaderBar>
<main class="u-guttered l-column l-space-m">
	<EntryForm form={data.form} on:submit={onSubmit} entry={data.entry}></EntryForm>
</main>
