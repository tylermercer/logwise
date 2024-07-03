<script lang="ts">
	import Message from 'virtual:icons/teenyicons/message-text-alt-outline';
	import Cog from 'virtual:icons/teenyicons/cog-outline';
	import MungedEmailLink from '$lib/components/MungedEmailLink.svelte';
	import LogsList from "../LogsList.svelte";
	import db from '$lib/db';
	import UserAccountMenu from '../account/UserAccountMenu.svelte';

	let user = db.cloud.currentUser;
</script>


<header class="u-guttered l-column l-space-xs">
	<div class="l-column l-space-xs">
		<UserAccountMenu>
			<div class="l-row l-space-none">
				<button class="btn-icon" aria-label="Give feedback">
					<Message></Message>
				</button>
				<button class="btn-icon" aria-label="Settings">
					<Cog></Cog>
				</button>
			</div>
		</UserAccountMenu>
	</div>
</header>
<slot></slot>
<LogsList></LogsList>
<footer class="u-guttered">
	<small>
		Created by <a class="btn-secondary" href="https://tylermercer.net">Tyler Mercer</a>. Got
		feedback? <MungedEmailLink class="btn-secondary">Email me!</MungedEmailLink>
	</small>
</footer>
<style lang="scss">
	.btn-icon {
		color: var(--primary-11);
		background-color: transparent;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		&:hover {
			background-color: var(--primary-4);
			color: var(--primary-12);
		}
	}
</style>