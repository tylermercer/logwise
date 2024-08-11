<script lang="ts">
	import db from '$lib/db';
	import { DB_CURRENT_ENTITY_VERSION } from '$lib/db/types';
	import LogBuilder, { type LogWithForm } from '$lib/components/logs/LogBuilder.svelte';
	import HeaderBar from '$lib/components/navigation/HeaderBar.svelte';
	import { goto } from '$app/navigation';
	import { typeid } from 'typeid-unboxed';

	async function handleSubmit(data: LogWithForm) {
		// create log
		const logId = typeid('log');
		await db.transaction('rw', db.forms, db.logs, () => {
			db.logs.add({
				id: logId,
				name: data.name,
				description: data.description,
				color: data.color,
				createdDatetime: data.createdDatetime,
				modifiedDatetime: data.modifiedDatetime,
				currentFormId: data.currentForm.id,
				isArchived: data.isArchived,
				schemaVer: DB_CURRENT_ENTITY_VERSION
			});
			db.forms.add({
				...data.currentForm,
				logId
			});
		});

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
	<LogBuilder onSubmit={handleSubmit}></LogBuilder>
</main>
