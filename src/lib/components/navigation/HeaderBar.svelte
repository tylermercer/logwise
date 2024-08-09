<script lang="ts">
	import backButtonLink from '$lib/util/actions/backButtonLink';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	import type { Snippet } from 'svelte';

	let { children, actions, backHref } : { children: Snippet, actions?: Snippet, backHref?: string } = $props();


</script>

<header class="u-guttered l-row l-space-xs">
	{#if backHref}
	<a href={backHref} use:backButtonLink class="btn-secondary" aria-label="Home">
		<LeftArrow></LeftArrow>
	</a>
	{/if}
	{@render children()}
	<div class="buttons l-row l-space-none">
		{#if actions}
			{@render actions()}
		{/if}
	</div>
</header>
<style lang="scss">
	header {
		flex-wrap: nowrap;
		align-items: center;
		padding-block: var(--space-m);
	}
	.buttons {
		margin-left: auto;
	}
</style>