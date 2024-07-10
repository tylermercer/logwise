<script lang="ts">
	import EntryForm from '$lib/components/EntryForm.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { name } = data.form;
</script>

<svelte:head>
	<title>{name}</title>
</svelte:head>
<HeaderBar backHref="/app/">
	<h1>{name}</h1>
</HeaderBar>
<main class="u-guttered l-column l-space-m">
	<EntryForm form={data.form}></EntryForm>
</main>
