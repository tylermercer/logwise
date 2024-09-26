<script lang="ts">
	import backButtonLink from '$lib/util/actions/backButtonLink';
	import MediaQuery from 'svelte-media-queries';
	import LeftArrow from 'virtual:icons/teenyicons/left-outline';
	export let backHref: string = '';
</script>

<header class="u-guttered l-row l-space-xs">
	{#if backHref}
		<MediaQuery query="(max-width: 933px)" let:matches>
			<a
				href={backHref}
				use:backButtonLink
				role="button"
				class="btn-icon"
				class:shift-left={!matches}
				aria-label="Home"
			>
				<LeftArrow></LeftArrow>
			</a>
		</MediaQuery>
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
			flex-basis: 0;
			min-width: 0;
			flex-grow: 1;
			height: 100%;
			padding-block: var(--space-3xs);
		}
	}
	.shift-left {
		position: absolute;
		transform: translateX(calc(-100% - var(--l-space)));
	}
	.buttons {
		margin-left: auto;
	}
</style>
