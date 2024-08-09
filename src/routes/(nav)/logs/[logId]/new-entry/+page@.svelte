<script lang="ts">
	import { goto } from '$app/navigation';
	import EntryForm from '$lib/components/entries/EntryForm.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: form = data.form;
	$: name = data.log.name;

	async function onSubmit() {
		goto(`/app/logs/${data.log.id}`, {
			replaceState: true
		});
	}
</script>

<svelte:head>
	<title>{name}</title>
</svelte:head>
<HeaderBar backHref="/app/">
	<h1>{name}</h1>
</HeaderBar>
<main class="u-guttered l-column l-space-m">
	{#key form}
		<EntryForm {form} on:submit={onSubmit}></EntryForm>
	{/key}
</main>
