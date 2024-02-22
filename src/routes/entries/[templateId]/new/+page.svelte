<script lang="ts">
	import db from '$lib/db';
	import { goto } from '$lib/navigation';
	import { nanoid } from 'nanoid';

	let status = '';

	function cancel() {
		history.back();
	}
</script>

<header class="container">
	<h1>New Entry</h1>
</header>
<main class="container">
	<p>{status}</p>
	<form>
		<div class="grid">
			<button class="secondary" on:click={cancel} type="button">Cancel</button>
			<button type="submit">Add Template</button>
		</div>
	</form>
</main>

<style lang="scss">
</style>
