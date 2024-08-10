<script lang="ts">
	import Cog from 'virtual:icons/teenyicons/cog-outline';
	import UserAccountMenu from '../account/UserAccountMenu.svelte';
	import Tooltip from '../util/Tooltip.svelte';
</script>

<header class="header u-guttered l-column l-space-xs">
	<div class="l-column l-space-xs">
		<UserAccountMenu>
			<div class="u-icon-button-group-right l-row l-space-none">
				<Tooltip text="Settings">
					<a href="/app/settings" role="button" class="btn-icon" aria-label="Settings">
						<Cog></Cog>
					</a>
				</Tooltip>
			</div>
		</UserAccountMenu>
	</div>
</header>

<style lang="scss">
	.header {
		width: 100%;
		padding-bottom: var(--space-xs);
		background-color: inherit;
		position: sticky;
		top: 0;
	}
</style>