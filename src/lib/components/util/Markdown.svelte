<script lang="ts">
	import renderMarkdown from '$lib/util/renderMarkdown';

	export let text: string;

	$: asMarkdown = renderMarkdown(text);
</script>

{@html asMarkdown}
