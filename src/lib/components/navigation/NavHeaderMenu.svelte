<script lang="ts">
	import MungedEmailLink from '$lib/components/controls/MungedEmailLink.svelte';
	import Cog from 'virtual:icons/teenyicons/cog-outline';
	import Message from 'virtual:icons/teenyicons/message-text-alt-outline';
	import UserAccountMenu from '../account/UserAccountMenu.svelte';
	import Tooltip from '../util/Tooltip.svelte';
</script>

<header class="header u-guttered l-column l-space-xs">
	<div class="l-column l-space-xs">
		<UserAccountMenu>
			<div class="buttons l-row l-space-none">
				<Tooltip text="Give feedback">
					<MungedEmailLink role="button" class="btn-icon" ariaLabel="Give feedback">
						<Message></Message>
					</MungedEmailLink>
				</Tooltip>
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
	.buttons {
		margin-right: calc(var(--space-xs) * -1);
		margin-left: calc(var(--space-xs) * -1);
	}
	.header {
		width: 100%;
		padding-bottom: var(--space-xs);
		background-color: inherit;
		position: sticky;
		top: 0;
	}
</style>