<script lang="ts">
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import db from '$lib/db';
	import { fly } from 'svelte/transition';

	const {
		elements: { trigger, menu, item, separator, arrow },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		loop: true
	});

	let user = db.cloud.currentUser;
</script>

<div class="menu-container l-row l-space-xs">
    {#if $user.isLoggedIn}
        <button type="button" class="trigger" use:melt={$trigger} aria-label="Open Popover">{$user.name?.substring(0,2).toUpperCase() ?? 'ME'}</button>
    
        {#if $open}
            <div class="menu l-column l-space-2xs" use:melt={$menu} transition:fly={{ duration: 150, y: -10 }}>
                <div class="item info">Signed in as {$user.name}</div>
                {#if $user.license?.type !== 'prod'}
                <div class="upgrade-container">
                    <button class="btn-upgrade">Upgrade</button>
                </div>
                {/if}
                <div class="separator" use:melt={$separator} />
                <div class="item" use:melt={$item} on:m-click={() => db.cloud.logout()}>Sign out</div>
                <div use:melt={$arrow} />
            </div>
        {/if}
    {:else}
        <button class="sign-in" on:click={() => db.cloud.login()}>Sign in</button>
    {/if}
	<slot></slot>
</div>

<style lang="scss">
	.menu-container {
		align-items: center;
	}
	.menu {
		z-index: 40;
		display: flex;
		max-height: 300px;
		min-width: 220px;
		background-color: var(--gray-1);
		color: var(--gray-12);
		flex-direction: column;
		border-radius: var(--space-2xs);
		padding: calc(var(--space-xs) - var(--space-3xs));
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
    .btn-upgrade {
        display: inline-block;
        font-size: var(--step--1);
        padding: var(--space-2xs);
    }
    .upgrade-container {
        padding-left: var(--space-2xs);
        padding-right: var(--space-2xs);
    }
	.item {
		position: relative;
		height: var(--space-m);
		min-height: var(--space-m);
		user-select: none;
		border-radius: var(--space-3xs);
		padding-left: var(--space-2xs);
		padding-right: var(--space-2xs);
		z-index: 40;
		color: var(--gray-12);
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		line-height: 1;
		&:focus {
			outline: none;
		}
		&[data-highlighted] {
			background-color: var(--gray-3);
			color: var(--gray-12);
			outline: none;
		}
		&[data-disabled] {
			color: var(--gray-5);
		}
		&.info {
			color: var(--gray-11);
		}
	}
	.trigger {
		display: inline-flex;
		height: 2.25rem;
		width: 2.25rem;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background-color: var(--primary-9);
		color: var(--gray-1);
		&[data-highlighted] {
			outline: 2px solid var(--primary-6);
			outline-offset: 2px;
		}
		padding: 0;
		font-size: 0.875rem;
		font-weight: 500;
	}
	.separator {
		margin: 0.3125rem 0;
		height: 1px;
		background-color: #e2e8f0;
	}
	.trigger,
	.sign-in {
		margin-right: auto;
	}
</style>
