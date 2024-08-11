<script lang="ts">
	import backButtonLink from '$lib/util/actions/backButtonLink';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	export let backHref: string = '';
</script>

<header class="u-guttered l-row l-space-xs">
	{#if backHref}
		<a href={backHref} use:backButtonLink role="button" class="btn-icon" aria-label="Home">
			<LeftArrow></LeftArrow>
		</a>
	{/if}
	<slot />
	<div class="buttons l-row l-space-none">
		<slot name="actions" />
	</div>
</header>

<style lang="scss">
	header {
		flex-wrap: nowrap;
		align-items: flex-start;
		padding-block: var(--space-m);
		
		& > :global(h1) {
			height: 100%;
			padding-block: var(--space-3xs);
		}
	}
	.buttons {
		margin-left: auto;
	}
</style>
