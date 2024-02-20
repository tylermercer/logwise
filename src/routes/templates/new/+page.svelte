<script>
	import db from '$lib/db';
	import { goto } from '$lib/navigation';

	let status = '';

	let templateName = '';

	async function addTemplate() {
		try {
			var date = new Date();

			// Add the new Template!
			const id = await db.templates.add({
				id: crypto.randomUUID(),
				name: templateName,
				modifiedDatetime: date,
				createdDatetime: date,
				questions: []
			});

			status = `Template ${templateName} successfully added. Got id ${id}`;

			// Reset form:
			templateName = '';

			goto('/templates');
		} catch (error) {
			status = `Failed to add ${templateName}: ${error}`;
		}
	}
</script>

<h1>New Template</h1>
<div>
	<p>{status}</p>
	<fieldset>
		<legend>Template info</legend>
		<label>
			Name:
			<input type="text" bind:value={templateName} />
		</label>
		<br />
		<button on:click={addTemplate}>Add Template</button>
	</fieldset>
</div>
