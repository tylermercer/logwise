<script lang="ts">
	import { base } from '$app/paths';
	
	let className = '';

	export let role: string | undefined = undefined;
	export let href = '';
    export { className as class };
</script>

<a href="{base}{href}" class={className} role={role}><slot /></a>
