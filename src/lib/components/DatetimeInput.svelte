<script lang="ts">
	export let value = new Date();
	export let id = '';

	let internal: string = '';

	const input = (date: Date) =>
		(internal = new Date(date.getTime() + date.getTimezoneOffset() * -60 * 1000)
			.toISOString()
			.slice(0, 19));
	const output = (x: string) => (value = new Date(x));

	$: input(value);
	$: output(internal);
</script>

<input {id} type="datetime-local" bind:value={internal} />
