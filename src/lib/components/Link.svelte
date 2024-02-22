<script lang="ts">
	import { base } from '$app/paths';
	export let href = '';
	let className = '';
    export { className as class };
</script>

<a href="{base}{href}" class={className}><slot /></a>
