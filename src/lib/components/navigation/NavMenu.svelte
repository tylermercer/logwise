<script lang="ts">
	import MungedEmailLink from '$lib/components/MungedEmailLink.svelte';
	import Cog from 'virtual:icons/teenyicons/cog-outline';
	import Message from 'virtual:icons/teenyicons/message-text-alt-outline';
	import LogsList from "../LogsList.svelte";
	import UserAccountMenu from '../account/UserAccountMenu.svelte';
</script>

<header class="header u-guttered l-column l-space-xs">
	<div class="l-column l-space-xs">
		<UserAccountMenu>
			<div class="buttons l-row l-space-none">
				<MungedEmailLink role="button" class="btn-icon" ariaLabel="Give feedback">
					<Message></Message>
				</MungedEmailLink>
				<a href="/app/settings" role="button" class="btn-icon" aria-label="Settings">
					<Cog></Cog>
				</a>
			</div>
		</UserAccountMenu>
	</div>
</header>
<slot></slot>
<LogsList></LogsList>

<style lang="scss">
	.buttons {
		margin-right: calc(var(--space-xs) * -1);
	}
	.header {
		padding-bottom: var(--space-xs);
	}
</style>